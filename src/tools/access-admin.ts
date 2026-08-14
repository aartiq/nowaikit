/**
 * User access administration: roles, delegation, group membership, offboarding.
 * Read: Tier 0. Grant/revoke/create/deactivate: Tier 1 (WRITE_ENABLED=true).
 *
 * Tables:
 *   sys_user_has_role — role grants (M2M user↔role)
 *   sys_user_role     — role definitions
 *   sys_user          — users
 *   sys_user_delegate — approval/coverage delegation
 *   sys_user_grmember — group membership
 */
import type { ServiceNowClient } from '../servicenow/client.js';
import { ServiceNowError } from '../utils/errors.js';
import { requireWrite } from '../utils/permissions.js';

async function resolveUser(client: ServiceNowClient, user: string): Promise<string> {
  if (/^[0-9a-f]{32}$/i.test(user)) return user;
  const resp = await client.queryRecords({ table: 'sys_user', query: `user_name=${user}^ORemail=${user}`, limit: 1 });
  if (resp.count === 0) throw new ServiceNowError(`User not found: ${user}`, 'NOT_FOUND');
  return (resp.records[0] as any).sys_id;
}

async function resolveRole(client: ServiceNowClient, role: string): Promise<string> {
  if (/^[0-9a-f]{32}$/i.test(role)) return role;
  const resp = await client.queryRecords({ table: 'sys_user_role', query: `name=${role}`, limit: 1 });
  if (resp.count === 0) throw new ServiceNowError(`Role not found: ${role}`, 'NOT_FOUND');
  return (resp.records[0] as any).sys_id;
}

export function getAccessAdminToolDefinitions() {
  return [
    {
      name: 'list_user_roles',
      description: 'List roles granted to a user (sys_user_has_role), including inherited flag',
      inputSchema: {
        type: 'object',
        properties: {
          user: { type: 'string', description: 'User sys_id, user_name, or email' },
        },
        required: ['user'],
      },
    },
    {
      name: 'grant_role',
      description: 'Grant a role to a user (sys_user_has_role). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          user: { type: 'string', description: 'User sys_id, user_name, or email' },
          role: { type: 'string', description: 'Role sys_id or name (e.g. "itil")' },
        },
        required: ['user', 'role'],
      },
    },
    {
      name: 'revoke_role',
      description: 'Revoke a directly-granted role from a user. Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          user: { type: 'string', description: 'User sys_id, user_name, or email' },
          role: { type: 'string', description: 'Role sys_id or name' },
        },
        required: ['user', 'role'],
      },
    },
    {
      name: 'create_role',
      description: 'Create a new role (sys_user_role). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Role name (e.g. "x_acme.approver")' },
          description: { type: 'string', description: 'Role description' },
          fields: { type: 'object', description: 'Additional field values' },
        },
        required: ['name'],
      },
    },
    {
      name: 'deactivate_user',
      description: 'Deactivate (offboard) a user by setting active=false. Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          user: { type: 'string', description: 'User sys_id, user_name, or email' },
        },
        required: ['user'],
      },
    },
    {
      name: 'create_delegation',
      description: 'Create an approval/coverage delegation (sys_user_delegate). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          user: { type: 'string', description: 'User delegating (sys_id/user_name/email)' },
          delegate: { type: 'string', description: 'User receiving the delegation' },
          starts: { type: 'string', description: 'Start datetime (YYYY-MM-DD HH:MM:SS)' },
          ends: { type: 'string', description: 'End datetime (YYYY-MM-DD HH:MM:SS)' },
          approvals: { type: 'boolean', description: 'Delegate approvals (default true)' },
          assignments: { type: 'boolean', description: 'Delegate assignments' },
        },
        required: ['user', 'delegate'],
      },
    },
    {
      name: 'list_group_members',
      description: 'List the members of a group (sys_user_grmember)',
      inputSchema: {
        type: 'object',
        properties: {
          group: { type: 'string', description: 'Group sys_id or name' },
          limit: { type: 'number', description: 'Max records (default 100)' },
        },
        required: ['group'],
      },
    },
    {
      name: 'get_user_entitlements',
      description: 'Summarize what a user can access: their roles, groups, and active status',
      inputSchema: {
        type: 'object',
        properties: {
          user: { type: 'string', description: 'User sys_id, user_name, or email' },
        },
        required: ['user'],
      },
    },
  ];
}

export async function executeAccessAdminToolCall(
  client: ServiceNowClient,
  name: string,
  args: Record<string, any>,
): Promise<any> {
  switch (name) {
    case 'list_user_roles': {
      const userId = await resolveUser(client, args.user);
      return await client.queryRecords({
        table: 'sys_user_has_role',
        query: `user=${userId}`,
        fields: 'role,role.name,inherited,granted_by,state',
        limit: 200,
      });
    }
    case 'grant_role': {
      requireWrite();
      const userId = await resolveUser(client, args.user);
      const roleId = await resolveRole(client, args.role);
      const existing = await client.queryRecords({ table: 'sys_user_has_role', query: `user=${userId}^role=${roleId}`, limit: 1 });
      if (existing.count > 0) return { already_granted: true, summary: `User already has role ${args.role}` };
      const result = await client.createRecord('sys_user_has_role', { user: userId, role: roleId });
      return { ...result, summary: `Granted role ${args.role} to ${args.user}` };
    }
    case 'revoke_role': {
      requireWrite();
      const userId = await resolveUser(client, args.user);
      const roleId = await resolveRole(client, args.role);
      const existing = await client.queryRecords({ table: 'sys_user_has_role', query: `user=${userId}^role=${roleId}^inherited=false`, limit: 1 });
      if (existing.count === 0) throw new ServiceNowError(`No directly-granted role ${args.role} on ${args.user} to revoke`, 'NOT_FOUND');
      await client.deleteRecord('sys_user_has_role', (existing.records[0] as any).sys_id);
      return { success: true, summary: `Revoked role ${args.role} from ${args.user}` };
    }
    case 'create_role': {
      requireWrite();
      if (!args.name) throw new ServiceNowError('name is required', 'INVALID_REQUEST');
      const payload: Record<string, any> = { name: args.name, ...(args.fields ?? {}) };
      if (args.description) payload.description = args.description;
      const result = await client.createRecord('sys_user_role', payload);
      return { ...result, summary: `Created role "${args.name}"` };
    }
    case 'deactivate_user': {
      requireWrite();
      const userId = await resolveUser(client, args.user);
      const result = await client.updateRecord('sys_user', userId, { active: 'false' });
      return { ...result, summary: `Deactivated user ${args.user}` };
    }
    case 'create_delegation': {
      requireWrite();
      const userId = await resolveUser(client, args.user);
      const delegateId = await resolveUser(client, args.delegate);
      const payload: Record<string, any> = {
        user: userId,
        delegate: delegateId,
        approvals: args.approvals === false ? 'false' : 'true',
      };
      if (args.assignments !== undefined) payload.assignments = args.assignments ? 'true' : 'false';
      if (args.starts) payload.starts = args.starts;
      if (args.ends) payload.ends = args.ends;
      const result = await client.createRecord('sys_user_delegate', payload);
      return { ...result, summary: `Delegated from ${args.user} to ${args.delegate}` };
    }
    case 'list_group_members': {
      let groupId = args.group;
      if (!/^[0-9a-f]{32}$/i.test(groupId)) {
        const g = await client.queryRecords({ table: 'sys_user_group', query: `name=${args.group}`, limit: 1 });
        if (g.count === 0) throw new ServiceNowError(`Group not found: ${args.group}`, 'NOT_FOUND');
        groupId = (g.records[0] as any).sys_id;
      }
      return await client.queryRecords({
        table: 'sys_user_grmember',
        query: `group=${groupId}`,
        fields: 'user,user.name,user.user_name,user.email,user.active',
        limit: args.limit ?? 100,
      });
    }
    case 'get_user_entitlements': {
      const userId = await resolveUser(client, args.user);
      const user = await client.getRecord('sys_user', userId);
      const roles = await client.queryRecords({ table: 'sys_user_has_role', query: `user=${userId}`, fields: 'role.name,inherited', limit: 200 }).catch(() => ({ records: [] }));
      const groups = await client.queryRecords({ table: 'sys_user_grmember', query: `user=${userId}`, fields: 'group.name', limit: 200 }).catch(() => ({ records: [] }));
      return {
        user: { sys_id: userId, name: (user as any).name, user_name: (user as any).user_name, active: (user as any).active },
        roles: (roles as any).records,
        groups: (groups as any).records,
      };
    }
    default:
      return null;
  }
}
