// Auto-generated tool manifest for browser-only mode
// Generated: 2026-08-13
// Total tools: 492

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    "name": "search_tools",
    "description": "Search the full NowAIKit tool catalog (400+ tools) by keyword to discover the right tool without loading every definition. Returns matching tool names + descriptions ranked by relevance. Use this FIRST when you are unsure which tool to call. Especially useful with MCP_TOOL_DISCOVERY=lean, which exposes only a small core set plus this search.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Keywords to match against tool names and descriptions, e.g. \"create incident\", \"cmdb health\", \"run atf\""
        },
        "limit": {
          "type": "number",
          "description": "Max results to return (default 25)"
        }
      },
      "required": [
        "query"
      ]
    }
  },
  {
    "name": "query_records",
    "description": "Query ServiceNow records with filtering, field selection, pagination, and sorting",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name (e.g., \"incident\", \"change_request\")"
        },
        "query": {
          "type": "string",
          "description": "Encoded query string (e.g., \"active=true^priority=1\")"
        },
        "fields": {
          "type": "string",
          "description": "Comma-separated fields to return"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default: 10, max: 1000)"
        },
        "orderBy": {
          "type": "string",
          "description": "Field to sort by. Prefix with \"-\" for descending"
        }
      },
      "required": [
        "table"
      ]
    }
  },
  {
    "name": "get_table_schema",
    "description": "Get the structure and field information for a ServiceNow table",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name to inspect"
        }
      },
      "required": [
        "table"
      ]
    }
  },
  {
    "name": "get_record",
    "description": "Retrieve complete details of a specific record by sys_id",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name"
        },
        "sys_id": {
          "type": "string",
          "description": "32-character system ID"
        },
        "fields": {
          "type": "string",
          "description": "Optional comma-separated fields"
        }
      },
      "required": [
        "table",
        "sys_id"
      ]
    }
  },
  {
    "name": "create_record",
    "description": "Create a new record in any ServiceNow table (requires WRITE_ENABLED=true). Pass dry_run=true to preview the resolved payload without writing.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name (e.g., \"incident\", \"sys_user_preference\")"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs for the new record fields"
        },
        "dry_run": {
          "type": "boolean",
          "description": "Preview only — return the resolved payload without creating the record"
        }
      },
      "required": [
        "table",
        "fields"
      ]
    }
  },
  {
    "name": "update_record",
    "description": "Update an existing record in any ServiceNow table (requires WRITE_ENABLED=true). Pass dry_run=true to preview a before→after field diff without writing.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name (e.g., \"incident\", \"sys_user_preference\")"
        },
        "sys_id": {
          "type": "string",
          "description": "32-character system ID of the record to update"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs of fields to update"
        },
        "dry_run": {
          "type": "boolean",
          "description": "Preview only — return a before→after diff without updating the record"
        }
      },
      "required": [
        "table",
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "delete_record",
    "description": "Delete a record from any ServiceNow table (requires WRITE_ENABLED=true). Pass dry_run=true to preview the record that would be deleted without deleting it.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name"
        },
        "sys_id": {
          "type": "string",
          "description": "32-character system ID of the record to delete"
        },
        "dry_run": {
          "type": "boolean",
          "description": "Preview only — return the record that would be deleted without deleting it"
        }
      },
      "required": [
        "table",
        "sys_id"
      ]
    }
  },
  {
    "name": "validate_query",
    "description": "Lint-check a ServiceNow encoded query BEFORE running it: validates javascript: expressions against the safe function allowlist, length limits, and common mistakes (e.g. using = instead of ^, raw spaces). Returns { valid, issues, suggestions }.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "The encoded query to validate, e.g. \"active=true^priority=1^ORDERBYDESCsys_created_on\""
        }
      },
      "required": [
        "query"
      ]
    }
  },
  {
    "name": "get_user",
    "description": "Look up user details by email or username",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user_identifier": {
          "type": "string",
          "description": "Email address or username"
        }
      },
      "required": [
        "user_identifier"
      ]
    }
  },
  {
    "name": "get_group",
    "description": "Find assignment group details by name or sys_id",
    "inputSchema": {
      "type": "object",
      "properties": {
        "group_identifier": {
          "type": "string",
          "description": "Group name or sys_id"
        }
      },
      "required": [
        "group_identifier"
      ]
    }
  },
  {
    "name": "search_cmdb_ci",
    "description": "Search for configuration items (CIs) in the CMDB",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Encoded query (e.g., \"sys_class_name=cmdb_ci_server\")"
        },
        "limit": {
          "type": "number",
          "description": "Max CIs (default: 10, max: 100)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_cmdb_ci",
    "description": "Get complete information about a specific configuration item",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ci_sys_id": {
          "type": "string",
          "description": "System ID of the CI"
        },
        "fields": {
          "type": "string",
          "description": "Optional comma-separated fields"
        }
      },
      "required": [
        "ci_sys_id"
      ]
    }
  },
  {
    "name": "list_relationships",
    "description": "Show parent and child relationships for a CI",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ci_sys_id": {
          "type": "string",
          "description": "System ID of the CI"
        }
      },
      "required": [
        "ci_sys_id"
      ]
    }
  },
  {
    "name": "list_discovery_schedules",
    "description": "List discovery schedules and their run status",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active_only": {
          "type": "boolean",
          "description": "Only show active schedules"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_mid_servers",
    "description": "List MID servers and verify they are healthy",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active_only": {
          "type": "boolean",
          "description": "Only show servers with status \"Up\""
        }
      },
      "required": []
    }
  },
  {
    "name": "list_active_events",
    "description": "Monitor critical infrastructure events",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Filter events (e.g., \"severity=1\")"
        },
        "limit": {
          "type": "number",
          "description": "Max events (default: 10)"
        }
      },
      "required": []
    }
  },
  {
    "name": "cmdb_health_dashboard",
    "description": "Get CMDB data quality metrics (completeness of server and network CI data)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    }
  },
  {
    "name": "service_mapping_summary",
    "description": "View service dependencies and related CIs for impact analysis",
    "inputSchema": {
      "type": "object",
      "properties": {
        "service_sys_id": {
          "type": "string",
          "description": "System ID of the business service"
        }
      },
      "required": [
        "service_sys_id"
      ]
    }
  },
  {
    "name": "natural_language_search",
    "description": "Search ServiceNow using plain English",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Plain English query"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 10)"
        }
      },
      "required": [
        "query"
      ]
    }
  },
  {
    "name": "natural_language_update",
    "description": "Update a record using natural language (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "instruction": {
          "type": "string",
          "description": "Natural language update instruction"
        },
        "table": {
          "type": "string",
          "description": "Table name"
        }
      },
      "required": [
        "instruction",
        "table"
      ]
    }
  },
  {
    "name": "list_instances",
    "description": "List all configured ServiceNow instances (multi-instance / multi-customer support)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    }
  },
  {
    "name": "switch_instance",
    "description": "Switch the active ServiceNow instance for this session",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Instance name as configured (e.g. \"prod\", \"dev\", \"customer_a\")"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "get_current_instance",
    "description": "Get the currently active ServiceNow instance name and URL",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    }
  },
  {
    "name": "create_ci_relationship",
    "description": "[Write] Create a relationship between two CMDB Configuration Items",
    "inputSchema": {
      "type": "object",
      "properties": {
        "parent": {
          "type": "string",
          "description": "Parent CI sys_id"
        },
        "child": {
          "type": "string",
          "description": "Child CI sys_id"
        },
        "type": {
          "type": "string",
          "description": "Relationship type (e.g. \"Runs on::Runs\")"
        }
      },
      "required": [
        "parent",
        "child",
        "type"
      ]
    }
  },
  {
    "name": "cmdb_impact_analysis",
    "description": "Analyze the downstream impact of a Configuration Item change or outage",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ci_sys_id": {
          "type": "string",
          "description": "CI sys_id to analyze"
        },
        "depth": {
          "type": "number",
          "description": "Relationship depth to traverse (default: 2)"
        }
      },
      "required": [
        "ci_sys_id"
      ]
    }
  },
  {
    "name": "run_discovery_scan",
    "description": "[Write] Trigger a ServiceNow Discovery scan for network/infrastructure",
    "inputSchema": {
      "type": "object",
      "properties": {
        "schedule_id": {
          "type": "string",
          "description": "Discovery schedule sys_id to run"
        },
        "mid_server": {
          "type": "string",
          "description": "Optional MID server name"
        }
      },
      "required": [
        "schedule_id"
      ]
    }
  },
  {
    "name": "bulk_create_records",
    "description": "Create many records in one table in a single call, tracking every created sys_id and returning a rollback_token. With rollback_on_error=true, a mid-way failure deletes everything already created so the batch is all-or-nothing. Supports dry_run. Requires WRITE_ENABLED=true.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Target table"
        },
        "records": {
          "type": "array",
          "items": {
            "type": "object"
          },
          "description": "Array of field key-value objects to create"
        },
        "rollback_on_error": {
          "type": "boolean",
          "description": "If a create fails, delete the ones already created (default false)"
        },
        "dry_run": {
          "type": "boolean",
          "description": "Preview the resolved payloads without creating anything"
        }
      },
      "required": [
        "table",
        "records"
      ]
    }
  },
  {
    "name": "rollback_changes",
    "description": "Delete a set of previously-created records, e.g. the rollback_token returned by bulk_create_records. Requires WRITE_ENABLED=true.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "changes": {
          "type": "array",
          "description": "Array of { table, sys_id } to delete",
          "items": {
            "type": "object",
            "properties": {
              "table": {
                "type": "string"
              },
              "sys_id": {
                "type": "string"
              }
            },
            "required": [
              "table",
              "sys_id"
            ]
          }
        }
      },
      "required": [
        "changes"
      ]
    }
  },
  {
    "name": "compare_instances",
    "description": "Compare two configured ServiceNow instances: record counts for a table (with optional query) and/or a specific system property value. Useful for dev→prod drift detection and governance.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "instance_a": {
          "type": "string",
          "description": "First instance name (as configured)"
        },
        "instance_b": {
          "type": "string",
          "description": "Second instance name (as configured)"
        },
        "table": {
          "type": "string",
          "description": "Table to compare record counts for (optional)"
        },
        "query": {
          "type": "string",
          "description": "Encoded query to scope the count (optional)"
        },
        "property": {
          "type": "string",
          "description": "A sys_properties name to compare values for (optional)"
        }
      },
      "required": [
        "instance_a",
        "instance_b"
      ]
    }
  },
  {
    "name": "create_incident",
    "description": "Create a new incident record (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Brief description of the issue"
        },
        "urgency": {
          "type": "number",
          "description": "1=High, 2=Medium, 3=Low"
        },
        "impact": {
          "type": "number",
          "description": "1=High, 2=Medium, 3=Low"
        },
        "priority": {
          "type": "number",
          "description": "1=Critical, 2=High, 3=Moderate, 4=Low"
        },
        "description": {
          "type": "string",
          "description": "Detailed description"
        },
        "assignment_group": {
          "type": "string",
          "description": "Assignment group name or sys_id"
        },
        "caller_id": {
          "type": "string",
          "description": "Caller user name or sys_id"
        },
        "category": {
          "type": "string",
          "description": "Incident category"
        },
        "subcategory": {
          "type": "string",
          "description": "Incident subcategory"
        }
      },
      "required": [
        "short_description"
      ]
    }
  },
  {
    "name": "get_incident",
    "description": "Get full details of an incident by number (e.g. INC0012345) or sys_id",
    "inputSchema": {
      "type": "object",
      "properties": {
        "number_or_sysid": {
          "type": "string",
          "description": "Incident number (INC...) or sys_id"
        }
      },
      "required": [
        "number_or_sysid"
      ]
    }
  },
  {
    "name": "update_incident",
    "description": "Update fields on an existing incident (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the incident"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update (e.g., {\"state\": \"2\", \"urgency\": \"1\"})"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "resolve_incident",
    "description": "Resolve an incident with resolution code and notes (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the incident"
        },
        "resolution_code": {
          "type": "string",
          "description": "Resolution code (e.g., \"Solved (Permanently)\")"
        },
        "resolution_notes": {
          "type": "string",
          "description": "Details of how the incident was resolved"
        }
      },
      "required": [
        "sys_id",
        "resolution_code",
        "resolution_notes"
      ]
    }
  },
  {
    "name": "close_incident",
    "description": "Close a resolved incident (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the incident"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "add_work_note",
    "description": "Add an internal work note to any ITSM record (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name (e.g., \"incident\", \"change_request\")"
        },
        "sys_id": {
          "type": "string",
          "description": "System ID of the record"
        },
        "note": {
          "type": "string",
          "description": "Work note text (internal, not visible to end user)"
        }
      },
      "required": [
        "table",
        "sys_id",
        "note"
      ]
    }
  },
  {
    "name": "add_comment",
    "description": "Add a customer-visible comment to any ITSM record (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name (e.g., \"incident\")"
        },
        "sys_id": {
          "type": "string",
          "description": "System ID of the record"
        },
        "comment": {
          "type": "string",
          "description": "Comment text (visible to end user/caller)"
        }
      },
      "required": [
        "table",
        "sys_id",
        "comment"
      ]
    }
  },
  {
    "name": "create_problem",
    "description": "Create a new problem record (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Brief description of the problem"
        },
        "description": {
          "type": "string",
          "description": "Detailed description"
        },
        "assignment_group": {
          "type": "string",
          "description": "Assignment group name or sys_id"
        },
        "priority": {
          "type": "number",
          "description": "1=Critical, 2=High, 3=Moderate, 4=Low"
        }
      },
      "required": [
        "short_description"
      ]
    }
  },
  {
    "name": "get_problem",
    "description": "Get full details of a problem by number (PRB...) or sys_id",
    "inputSchema": {
      "type": "object",
      "properties": {
        "number_or_sysid": {
          "type": "string",
          "description": "Problem number (PRB...) or sys_id"
        }
      },
      "required": [
        "number_or_sysid"
      ]
    }
  },
  {
    "name": "update_problem",
    "description": "Update fields on an existing problem (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the problem"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "resolve_problem",
    "description": "Resolve a problem with root cause and resolution notes (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the problem"
        },
        "root_cause": {
          "type": "string",
          "description": "Root cause of the problem"
        },
        "resolution_notes": {
          "type": "string",
          "description": "How the problem was resolved"
        }
      },
      "required": [
        "sys_id",
        "root_cause",
        "resolution_notes"
      ]
    }
  },
  {
    "name": "create_change_request",
    "description": "Create a new change request (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Brief description of the change"
        },
        "description": {
          "type": "string",
          "description": "Detailed description and justification"
        },
        "type": {
          "type": "string",
          "description": "Change type: \"normal\", \"standard\", \"emergency\""
        },
        "category": {
          "type": "string",
          "description": "Change category (e.g. \"Software\", \"Hardware\", \"Network\")"
        },
        "risk": {
          "type": "string",
          "description": "Risk level: \"1\"=High, \"2\"=Medium, \"3\"=Low, \"4\"=Very Low"
        },
        "impact": {
          "type": "string",
          "description": "Impact: \"1\"=High, \"2\"=Medium, \"3\"=Low"
        },
        "priority": {
          "type": "string",
          "description": "Priority: \"1\"=Critical, \"2\"=High, \"3\"=Moderate, \"4\"=Low"
        },
        "assignment_group": {
          "type": "string",
          "description": "Assignment group name or sys_id"
        },
        "assigned_to": {
          "type": "string",
          "description": "Assignee username or sys_id"
        },
        "start_date": {
          "type": "string",
          "description": "Planned start date (ISO: YYYY-MM-DD HH:MM:SS)"
        },
        "end_date": {
          "type": "string",
          "description": "Planned end date (ISO: YYYY-MM-DD HH:MM:SS)"
        },
        "implementation_plan": {
          "type": "string",
          "description": "Step-by-step implementation plan"
        },
        "backout_plan": {
          "type": "string",
          "description": "Rollback plan if change fails"
        },
        "test_plan": {
          "type": "string",
          "description": "Testing and validation steps"
        },
        "cmdb_ci": {
          "type": "string",
          "description": "Affected CI sys_id"
        }
      },
      "required": [
        "short_description",
        "type"
      ]
    }
  },
  {
    "name": "get_change_request",
    "description": "Get full details of a change request by number (CHG...) or sys_id",
    "inputSchema": {
      "type": "object",
      "properties": {
        "number_or_sysid": {
          "type": "string",
          "description": "Change number (CHG...) or sys_id"
        }
      },
      "required": [
        "number_or_sysid"
      ]
    }
  },
  {
    "name": "update_change_request",
    "description": "Update fields on a change request (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the change request"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_change_requests",
    "description": "List change requests with optional filtering by state or query",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Encoded query filter"
        },
        "state": {
          "type": "string",
          "description": "Change state (e.g., \"-5\"=Requested, \"-4\"=Draft, \"0\"=Open)"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default: 10)"
        }
      },
      "required": []
    }
  },
  {
    "name": "submit_change_for_approval",
    "description": "Move a change request to \"Requested\" state for approval (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the change request"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "close_change_request",
    "description": "Close a change request with close code and notes (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the change request"
        },
        "close_code": {
          "type": "string",
          "description": "Close code (e.g., \"successful\", \"unsuccessful\")"
        },
        "close_notes": {
          "type": "string",
          "description": "Closure notes"
        }
      },
      "required": [
        "sys_id",
        "close_code",
        "close_notes"
      ]
    }
  },
  {
    "name": "schedule_cab_meeting",
    "description": "[Write] Schedule a Change Advisory Board (CAB) meeting",
    "inputSchema": {
      "type": "object",
      "properties": {
        "change_id": {
          "type": "string",
          "description": "Change request number (CHG...) or sys_id"
        },
        "date": {
          "type": "string",
          "description": "ISO date for the CAB meeting"
        },
        "duration_minutes": {
          "type": "number",
          "description": "Meeting duration in minutes"
        },
        "attendees": {
          "type": "string",
          "description": "Comma-separated group names"
        }
      },
      "required": [
        "change_id",
        "date"
      ]
    }
  },
  {
    "name": "get_task",
    "description": "Get details of any task record by number or sys_id",
    "inputSchema": {
      "type": "object",
      "properties": {
        "number_or_sysid": {
          "type": "string",
          "description": "Task number or sys_id"
        }
      },
      "required": [
        "number_or_sysid"
      ]
    }
  },
  {
    "name": "update_task",
    "description": "Update fields on a task record (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the task"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_my_tasks",
    "description": "List tasks assigned to the currently configured user",
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "number",
          "description": "Max tasks to return (default: 10)"
        }
      },
      "required": []
    }
  },
  {
    "name": "complete_task",
    "description": "Mark a task as complete (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the task"
        },
        "close_notes": {
          "type": "string",
          "description": "Optional closure notes"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_knowledge_bases",
    "description": "List all knowledge bases available in the instance",
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "search_knowledge",
    "description": "Search knowledge base articles by keyword",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search keywords or phrase"
        },
        "limit": {
          "type": "number",
          "description": "Max articles (default: 10)"
        },
        "knowledge_base": {
          "type": "string",
          "description": "Optional: filter by knowledge base sys_id or name"
        }
      },
      "required": [
        "query"
      ]
    }
  },
  {
    "name": "get_knowledge_article",
    "description": "Get the full content of a knowledge article by number (KB...) or sys_id",
    "inputSchema": {
      "type": "object",
      "properties": {
        "number_or_sysid": {
          "type": "string",
          "description": "Article number (KB...) or sys_id"
        }
      },
      "required": [
        "number_or_sysid"
      ]
    }
  },
  {
    "name": "create_knowledge_article",
    "description": "Create a new knowledge article (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Article title"
        },
        "text": {
          "type": "string",
          "description": "Article body (HTML or plain text)"
        },
        "knowledge_base_sys_id": {
          "type": "string",
          "description": "sys_id of the target knowledge base"
        },
        "category": {
          "type": "string",
          "description": "Article category"
        }
      },
      "required": [
        "short_description",
        "text",
        "knowledge_base_sys_id"
      ]
    }
  },
  {
    "name": "update_knowledge_article",
    "description": "Update a knowledge article (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the article"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update (e.g., {\"text\": \"...updated content...\"})"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "publish_knowledge_article",
    "description": "Publish a draft knowledge article (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the article to publish"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "retire_knowledge_article",
    "description": "[Write] Retire a knowledge article (mark as outdated)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "article_id": {
          "type": "string",
          "description": "Article number (KB...) or sys_id"
        }
      },
      "required": [
        "article_id"
      ]
    }
  },
  {
    "name": "list_catalog_items",
    "description": "List available service catalog items",
    "inputSchema": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string",
          "description": "Filter by category name or sys_id"
        },
        "limit": {
          "type": "number",
          "description": "Max items (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "search_catalog",
    "description": "Search the service catalog for items matching a keyword",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search keywords"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 10)"
        }
      },
      "required": [
        "query"
      ]
    }
  },
  {
    "name": "get_catalog_item",
    "description": "Get full details of a catalog item including its variables",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id_or_name": {
          "type": "string",
          "description": "Catalog item sys_id or name"
        }
      },
      "required": [
        "sys_id_or_name"
      ]
    }
  },
  {
    "name": "create_catalog_item",
    "description": "Create a new service catalog item (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Catalog item display name"
        },
        "short_description": {
          "type": "string",
          "description": "One-line summary shown in search results"
        },
        "description": {
          "type": "string",
          "description": "Full HTML description of the item"
        },
        "category": {
          "type": "string",
          "description": "sys_id of the catalog category (sc_category)"
        },
        "price": {
          "type": "string",
          "description": "Price (e.g. \"0\", \"99.99\")"
        },
        "delivery_time": {
          "type": "string",
          "description": "Estimated delivery time ISO 8601 duration (e.g. \"1 08:00:00\" for 1 day 8 hours)"
        },
        "active": {
          "type": "boolean",
          "description": "Make the item available in the catalog (default: true)"
        },
        "roles": {
          "type": "string",
          "description": "Comma-separated roles that can see the item"
        }
      },
      "required": [
        "name",
        "short_description"
      ]
    }
  },
  {
    "name": "update_catalog_item",
    "description": "Update an existing catalog item (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Catalog item sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update (name, short_description, price, active, category, etc.)"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "order_catalog_item",
    "description": "Order a service catalog item (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the catalog item"
        },
        "quantity": {
          "type": "number",
          "description": "Quantity to order (default: 1)"
        },
        "variables": {
          "type": "object",
          "description": "Catalog item variables as key-value pairs"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_approval_rule",
    "description": "Create an approval rule that automatically generates approval requests when a record matches given conditions (requires WRITE_ENABLED=true). Uses the sysapproval_rule table.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Rule name"
        },
        "table": {
          "type": "string",
          "description": "Table this rule applies to (e.g. \"sc_request\", \"change_request\")"
        },
        "approver_type": {
          "type": "string",
          "description": "\"user\" | \"group\" — whether the approver is a user or a group"
        },
        "approver": {
          "type": "string",
          "description": "sys_id of the approving user or group"
        },
        "condition": {
          "type": "string",
          "description": "Encoded query that determines when the rule fires (leave blank for always)"
        },
        "active": {
          "type": "boolean",
          "description": "Activate the rule immediately (default: true)"
        },
        "order": {
          "type": "number",
          "description": "Execution order relative to other rules (default: 100)"
        }
      },
      "required": [
        "name",
        "table",
        "approver_type",
        "approver"
      ]
    }
  },
  {
    "name": "get_my_approvals",
    "description": "List approvals pending for the currently configured user",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "Filter by state: \"requested\", \"approved\", \"rejected\" (default: \"requested\")"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_approvals",
    "description": "List approval requests with optional filters",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Encoded query filter"
        },
        "state": {
          "type": "string",
          "description": "Approval state filter"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 10)"
        }
      },
      "required": []
    }
  },
  {
    "name": "approve_request",
    "description": "Approve a pending approval request (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the approval record"
        },
        "comments": {
          "type": "string",
          "description": "Optional approval comments"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "reject_request",
    "description": "Reject a pending approval request (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the approval record"
        },
        "comments": {
          "type": "string",
          "description": "Reason for rejection (required)"
        }
      },
      "required": [
        "sys_id",
        "comments"
      ]
    }
  },
  {
    "name": "get_sla_details",
    "description": "Get SLA breach status for a specific task or incident",
    "inputSchema": {
      "type": "object",
      "properties": {
        "task_sys_id": {
          "type": "string",
          "description": "System ID of the task/incident"
        }
      },
      "required": [
        "task_sys_id"
      ]
    }
  },
  {
    "name": "list_active_slas",
    "description": "List active SLA records with optional filters",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Encoded query filter"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 10)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_catalog_variable",
    "description": "[Write] Add a form variable to a service catalog item",
    "inputSchema": {
      "type": "object",
      "properties": {
        "cat_item_id": {
          "type": "string",
          "description": "Catalog item sys_id"
        },
        "name": {
          "type": "string",
          "description": "Variable name"
        },
        "question_text": {
          "type": "string",
          "description": "Label shown to user"
        },
        "type": {
          "type": "string",
          "description": "Variable type: string/reference/select_box/checkbox/date/date_time/integer/multi_line_text/email"
        },
        "order": {
          "type": "number",
          "description": "Display order (default: 100)"
        },
        "mandatory": {
          "type": "boolean",
          "description": "Required field"
        }
      },
      "required": [
        "cat_item_id",
        "name",
        "question_text",
        "type"
      ]
    }
  },
  {
    "name": "create_catalog_ui_policy",
    "description": "[Write] Create a UI policy for a catalog item form",
    "inputSchema": {
      "type": "object",
      "properties": {
        "cat_item_id": {
          "type": "string",
          "description": "Catalog item sys_id"
        },
        "short_description": {
          "type": "string",
          "description": "UI policy description"
        },
        "conditions": {
          "type": "string",
          "description": "Encoded condition query"
        },
        "reverse_if_false": {
          "type": "boolean",
          "description": "Reverse actions when condition is false"
        }
      },
      "required": [
        "cat_item_id",
        "short_description"
      ]
    }
  },
  {
    "name": "list_users",
    "description": "List users with optional search filter",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Filter (e.g., \"active=true^departmentLIKEIT\")"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_user",
    "description": "Create a new user account (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user_name": {
          "type": "string",
          "description": "Unique username (login name)"
        },
        "email": {
          "type": "string",
          "description": "Email address"
        },
        "first_name": {
          "type": "string",
          "description": "First name"
        },
        "last_name": {
          "type": "string",
          "description": "Last name"
        },
        "title": {
          "type": "string",
          "description": "Job title"
        },
        "department": {
          "type": "string",
          "description": "Department name or sys_id"
        }
      },
      "required": [
        "user_name",
        "email",
        "first_name",
        "last_name"
      ]
    }
  },
  {
    "name": "update_user",
    "description": "Update a user account (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the user"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_groups",
    "description": "List groups with optional search filter",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Filter (e.g., \"active=true^typeLIKEitil\")"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_group",
    "description": "Create a new assignment group (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Group name"
        },
        "description": {
          "type": "string",
          "description": "Group description"
        },
        "manager": {
          "type": "string",
          "description": "Manager user_name or sys_id"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "update_group",
    "description": "Update a group (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the group"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "add_user_to_group",
    "description": "Add a user to a group (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user_sys_id": {
          "type": "string",
          "description": "System ID of the user"
        },
        "group_sys_id": {
          "type": "string",
          "description": "System ID of the group"
        }
      },
      "required": [
        "user_sys_id",
        "group_sys_id"
      ]
    }
  },
  {
    "name": "remove_user_from_group",
    "description": "Remove a user from a group (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "member_sys_id": {
          "type": "string",
          "description": "System ID of the sys_user_grmember record"
        }
      },
      "required": [
        "member_sys_id"
      ]
    }
  },
  {
    "name": "list_reports",
    "description": "List saved reports in the instance (latest release: /api/now/reporting)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "search": {
          "type": "string",
          "description": "Search reports by name (uses sysparm_contains)"
        },
        "category": {
          "type": "string",
          "description": "Filter by report category"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_report",
    "description": "Get the definition and metadata of a saved report",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id_or_name": {
          "type": "string",
          "description": "Report sys_id or exact name"
        }
      },
      "required": [
        "sys_id_or_name"
      ]
    }
  },
  {
    "name": "run_aggregate_query",
    "description": "Run a grouped aggregate (COUNT, SUM, AVG) query on any table (latest release: /api/now/stats/{table})",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table to query (e.g., \"incident\", \"task_sla\")"
        },
        "group_by": {
          "type": "string",
          "description": "Field to group results by (e.g., \"priority\", \"state\", \"assignment_group\")"
        },
        "aggregate": {
          "type": "string",
          "description": "Aggregate function: COUNT (default), SUM, AVG, MIN, MAX"
        },
        "query": {
          "type": "string",
          "description": "Optional encoded query filter"
        },
        "limit": {
          "type": "number",
          "description": "Max groups (default: 20)"
        }
      },
      "required": [
        "table",
        "group_by"
      ]
    }
  },
  {
    "name": "trend_query",
    "description": "Get time-bucketed trend data for a table (useful for monthly/weekly trend charts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name (e.g., \"incident\")"
        },
        "date_field": {
          "type": "string",
          "description": "Date field to bucket by (e.g., \"opened_at\", \"sys_created_on\")"
        },
        "group_by": {
          "type": "string",
          "description": "Secondary grouping field (e.g., \"priority\", \"state\")"
        },
        "query": {
          "type": "string",
          "description": "Optional encoded query filter"
        },
        "periods": {
          "type": "number",
          "description": "Number of months to look back (default: 6)"
        }
      },
      "required": [
        "table",
        "date_field",
        "group_by"
      ]
    }
  },
  {
    "name": "get_performance_analytics",
    "description": "Read Performance Analytics scorecard/indicator data (requires PA plugin; GET /api/now/pa/scorecards). Pass an indicator sys_id, or a PA widget sys_id to resolve its indicator.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "indicator_sys_id": {
          "type": "string",
          "description": "sys_id of the PA indicator (pa_indicators)"
        },
        "widget_sys_id": {
          "type": "string",
          "description": "sys_id of a PA widget (pa_widgets); its indicator is resolved automatically"
        },
        "from": {
          "type": "string",
          "description": "Optional score-series start date (YYYY-MM-DD)"
        },
        "to": {
          "type": "string",
          "description": "Optional score-series end date (YYYY-MM-DD)"
        }
      },
      "required": []
    }
  },
  {
    "name": "export_report_data",
    "description": "Export raw table data as structured JSON for use in external reports",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table to export from"
        },
        "query": {
          "type": "string",
          "description": "Encoded query filter"
        },
        "fields": {
          "type": "string",
          "description": "Comma-separated fields to include"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default: 100, max: 1000)"
        }
      },
      "required": [
        "table"
      ]
    }
  },
  {
    "name": "get_sys_log",
    "description": "Retrieve system log entries for debugging or auditing. Set app_scope=true to read the scoped-application log (syslog_app_scope), where scoped gs.info()/gs.log() output lands, instead of the global syslog.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Filter (e.g., \"level=error^sys_created_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()\")"
        },
        "app_scope": {
          "type": "boolean",
          "description": "Read syslog_app_scope (scoped-app log output) instead of the global syslog."
        },
        "limit": {
          "type": "number",
          "description": "Max entries (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_scheduled_jobs",
    "description": "List scheduled jobs and their run schedules",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active": {
          "type": "boolean",
          "description": "Filter to active jobs only (default: true)"
        },
        "query": {
          "type": "string",
          "description": "Additional filter"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_scheduled_job",
    "description": "Get full details of a scheduled job by sys_id or name",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id_or_name": {
          "type": "string",
          "description": "Job sys_id or exact name"
        }
      },
      "required": [
        "sys_id_or_name"
      ]
    }
  },
  {
    "name": "create_scheduled_job",
    "description": "Create a new scheduled script execution job (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Job name"
        },
        "script": {
          "type": "string",
          "description": "Server-side JavaScript to run on schedule"
        },
        "run_type": {
          "type": "string",
          "description": "Schedule type: \"daily\", \"weekly\", \"monthly\", \"once\", \"periodically\""
        },
        "run_time": {
          "type": "string",
          "description": "Time to run (HH:MM:SS format for daily/weekly/monthly)"
        },
        "run_period": {
          "type": "string",
          "description": "Period interval for \"periodically\" type (e.g. \"00:15:00\" for 15 minutes)"
        },
        "active": {
          "type": "boolean",
          "description": "Whether to activate immediately (default: true)"
        }
      },
      "required": [
        "name",
        "script",
        "run_type"
      ]
    }
  },
  {
    "name": "update_scheduled_job",
    "description": "Update a scheduled job (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Scheduled job sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update (name, script, active, run_type, run_time, etc.)"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "trigger_scheduled_job",
    "description": "Immediately execute a scheduled job on-demand (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Scheduled job sys_id to trigger"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_report",
    "description": "Create a new saved report on any table (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "Report title displayed in the list"
        },
        "table": {
          "type": "string",
          "description": "Table to report on (e.g. \"incident\", \"change_request\")"
        },
        "type": {
          "type": "string",
          "description": "Report type: \"bar\", \"column\", \"pie\", \"line\", \"list\", \"gauge\", \"single_score\", \"trend\", \"pivot\", \"calHeatmap\""
        },
        "field": {
          "type": "string",
          "description": "Primary grouping field for the report"
        },
        "query": {
          "type": "string",
          "description": "Encoded query to filter report data"
        },
        "aggregate": {
          "type": "string",
          "description": "Aggregate function: COUNT (default), SUM, AVG, MIN, MAX"
        },
        "group_by": {
          "type": "string",
          "description": "Secondary grouping field (stacked charts)"
        },
        "roles": {
          "type": "string",
          "description": "Comma-separated roles that can view the report"
        }
      },
      "required": [
        "title",
        "table",
        "type"
      ]
    }
  },
  {
    "name": "update_report",
    "description": "Update an existing saved report definition (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Report sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update (title, type, query, field, aggregate, etc.)"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_job_run_history",
    "description": "List recent run history for scheduled jobs (success/failure log)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "job_sys_id": {
          "type": "string",
          "description": "Filter by specific job sys_id"
        },
        "status": {
          "type": "string",
          "description": "Filter by run status: success, error, canceled"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_scheduled_report",
    "description": "[Write] Schedule a report for recurring email delivery",
    "inputSchema": {
      "type": "object",
      "properties": {
        "report_id": {
          "type": "string",
          "description": "Report sys_id"
        },
        "frequency": {
          "type": "string",
          "description": "Frequency: daily/weekly/monthly"
        },
        "recipients": {
          "type": "string",
          "description": "Email addresses"
        },
        "day_of_week": {
          "type": "string",
          "description": "Day of week (for weekly frequency)"
        },
        "day_of_month": {
          "type": "number",
          "description": "Day of month (for monthly frequency)"
        },
        "format": {
          "type": "string",
          "description": "Export format: pdf/csv/xlsx"
        }
      },
      "required": [
        "report_id",
        "frequency",
        "recipients"
      ]
    }
  },
  {
    "name": "create_kpi",
    "description": "[Write] Create a Key Performance Indicator from ServiceNow data",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "KPI name"
        },
        "table": {
          "type": "string",
          "description": "Source table"
        },
        "field": {
          "type": "string",
          "description": "Aggregate field"
        },
        "aggregate": {
          "type": "string",
          "description": "Aggregate function: COUNT/AVG/SUM/MIN/MAX"
        },
        "conditions": {
          "type": "string",
          "description": "Encoded query filter"
        },
        "unit": {
          "type": "string",
          "description": "Display unit"
        }
      },
      "required": [
        "name",
        "table",
        "aggregate"
      ]
    }
  },
  {
    "name": "generate_report",
    "description": "Generate a branded PDF or PPTX report from capability analysis results. Call this after completing a scan, review, or audit to create a management-ready document with charts, tables, and ServiceNow links. Supports single capability (content) or multiple capabilities (sections) in one combined report.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "content": {
          "type": "string",
          "description": "Full markdown analysis to convert into a branded report (for single capability)"
        },
        "sections": {
          "type": "array",
          "description": "Multiple capability analyses to combine into one report. Each section becomes a chapter. Use this instead of content for multi-capability reports.",
          "items": {
            "type": "object",
            "properties": {
              "content": {
                "type": "string",
                "description": "Markdown analysis for this capability"
              },
              "title": {
                "type": "string",
                "description": "Section title (e.g. \"Instance Health Scan\")"
              },
              "capability": {
                "type": "string",
                "description": "Capability name (e.g. \"scan-health\")"
              }
            },
            "required": [
              "content",
              "title"
            ]
          }
        },
        "format": {
          "type": "string",
          "enum": [
            "pdf",
            "pptx"
          ],
          "description": "Output format: pdf (branded document) or pptx (slide deck)"
        },
        "title": {
          "type": "string",
          "description": "Report title (e.g. \"Instance Health Scan\", \"Comprehensive Instance Audit\")"
        },
        "capability": {
          "type": "string",
          "description": "Capability name that produced the analysis (e.g. \"scan-health\", \"review-code\", \"combined-audit\")"
        }
      },
      "required": [
        "format",
        "title"
      ]
    }
  },
  {
    "name": "list_atf_suites",
    "description": "List ATF test suites in the instance",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active": {
          "type": "boolean",
          "description": "Filter to active suites only"
        },
        "query": {
          "type": "string",
          "description": "Additional filter"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_atf_suite",
    "description": "Get details of a test suite including test count",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id_or_name": {
          "type": "string",
          "description": "Test suite sys_id or name"
        }
      },
      "required": [
        "sys_id_or_name"
      ]
    }
  },
  {
    "name": "run_atf_suite",
    "description": "Execute an ATF test suite (requires ATF_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the test suite"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_atf_tests",
    "description": "List ATF test cases, optionally filtered by suite",
    "inputSchema": {
      "type": "object",
      "properties": {
        "suite_sys_id": {
          "type": "string",
          "description": "Filter by test suite sys_id"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active tests only"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_atf_test",
    "description": "Get details of a specific test case",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the test"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "run_atf_test",
    "description": "Execute a single ATF test (requires ATF_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the test"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "get_atf_suite_result",
    "description": "Get the results of a test suite run",
    "inputSchema": {
      "type": "object",
      "properties": {
        "result_sys_id": {
          "type": "string",
          "description": "System ID of the suite result record"
        }
      },
      "required": [
        "result_sys_id"
      ]
    }
  },
  {
    "name": "list_atf_test_results",
    "description": "List individual test results within a suite run",
    "inputSchema": {
      "type": "object",
      "properties": {
        "suite_result_sys_id": {
          "type": "string",
          "description": "Filter by suite result sys_id"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_atf_failure_insight",
    "description": "Get ATF Failure Insight data — metadata changes between last successful and failed run (role changes, field value changes)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "result_sys_id": {
          "type": "string",
          "description": "System ID of the failed suite result"
        }
      },
      "required": [
        "result_sys_id"
      ]
    }
  },
  {
    "name": "nlq_query",
    "description": "Ask a natural language question and get structured ServiceNow data (ServiceNow NLQ API)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "question": {
          "type": "string",
          "description": "Plain English question (e.g., \"How many P1 incidents were opened this week?\")"
        },
        "table": {
          "type": "string",
          "description": "Optional target table hint"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 10)"
        }
      },
      "required": [
        "question"
      ]
    }
  },
  {
    "name": "ai_search",
    "description": "Semantic AI-powered search across KB, catalog, incidents (ServiceNow AI Search)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Natural language search query"
        },
        "sources": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Sources to search: [\"kb\", \"catalog\", \"incident\"] (default: all)"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 10)"
        }
      },
      "required": [
        "query"
      ]
    }
  },
  {
    "name": "categorize_incident",
    "description": "Suggest category, assignment group, and priority for an incident by analysing similar resolved incidents (Table API). Predictive Intelligence has no public REST prediction endpoint; for model-based scoring run PI on-record and read the predicted field.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Incident short description"
        },
        "description": {
          "type": "string",
          "description": "Optional full description (not required for the heuristic)"
        }
      },
      "required": [
        "short_description"
      ]
    }
  },
  {
    "name": "get_virtual_agent_topics",
    "description": "List Virtual Agent topics available in the instance (sys_cs_topic)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active": {
          "type": "boolean",
          "description": "Filter to active topics only"
        },
        "category": {
          "type": "string",
          "description": "Filter by topic category"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_ms_copilot_topics",
    "description": "List the Virtual Agent topics (sys_cs_topic) that back a Microsoft Copilot integration. Copilot topic mapping itself is configured in Copilot Studio on the Microsoft side, not exposed via ServiceNow REST.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_pi_models",
    "description": "List available Predictive Intelligence solutions (classification/similarity models)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    }
  },
  {
    "name": "list_business_rules",
    "description": "List business rules (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Filter by table name"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active rules only"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_business_rule",
    "description": "Get full details and script body of a business rule (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the business rule"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_business_rule",
    "description": "Create a new business rule (requires SCRIPTING_ENABLED=true). ServiceNow supports ES2021 async/await in scripts.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Rule name"
        },
        "table": {
          "type": "string",
          "description": "Table this rule applies to"
        },
        "when": {
          "type": "string",
          "description": "\"before\" | \"after\" | \"async\" | \"display\""
        },
        "script": {
          "type": "string",
          "description": "Server-side JavaScript. ServiceNow supports ES2021 (async/await, ?., ??)."
        },
        "condition": {
          "type": "string",
          "description": "Optional condition script"
        },
        "active": {
          "type": "boolean",
          "description": "Whether to activate the rule (default: true)"
        },
        "order": {
          "type": "number",
          "description": "Execution order (default: 100)"
        }
      },
      "required": [
        "name",
        "table",
        "when",
        "script"
      ]
    }
  },
  {
    "name": "update_business_rule",
    "description": "Update a business rule (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the rule"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update (name, script, active, condition, etc.)"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_script_includes",
    "description": "List script includes (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Filter (e.g., \"nameLIKEUtil\")"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active includes"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_script_include",
    "description": "Get full script body of a script include (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id_or_name": {
          "type": "string",
          "description": "Script include sys_id or api_name"
        }
      },
      "required": [
        "sys_id_or_name"
      ]
    }
  },
  {
    "name": "create_script_include",
    "description": "Create a new script include (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Script include name"
        },
        "script": {
          "type": "string",
          "description": "Script body (class definition). ServiceNow supports ES2021."
        },
        "api_name": {
          "type": "string",
          "description": "API name used to call this from other scripts"
        },
        "access": {
          "type": "string",
          "description": "\"public\" or \"package_private\" (default: \"public\")"
        },
        "active": {
          "type": "boolean",
          "description": "Whether to activate (default: true)"
        },
        "client_callable": {
          "type": "boolean",
          "description": "Client callable, for GlideAjax use (default: false)"
        },
        "scope": {
          "type": "string",
          "description": "Target application scope: a sys_scope sys_id, or \"global\" for the global scope. Default: your current application. Overriding scope needs cross-scope create rights."
        }
      },
      "required": [
        "name",
        "script"
      ]
    }
  },
  {
    "name": "update_script_include",
    "description": "Update a script include (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the script include"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_client_scripts",
    "description": "List client scripts (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Filter by table name"
        },
        "type": {
          "type": "string",
          "description": "\"onLoad\" | \"onChange\" | \"onSubmit\" | \"onCellEdit\""
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active scripts"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_client_script",
    "description": "Get full details and script body of a client script (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the client script"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_changesets",
    "description": "List update sets (changesets) (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "Filter by state: \"in progress\", \"complete\", \"ignore\""
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_changeset",
    "description": "Get details of an update set (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id_or_name": {
          "type": "string",
          "description": "Update set sys_id or name"
        }
      },
      "required": [
        "sys_id_or_name"
      ]
    }
  },
  {
    "name": "commit_changeset",
    "description": "Commit an update set (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the update set"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "publish_changeset",
    "description": "Publish/export an update set to XML for deployment (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the update set"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_client_script",
    "description": "Create a new client script (onLoad, onChange, onSubmit, onCellEdit) (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Script name"
        },
        "table": {
          "type": "string",
          "description": "Table this client script applies to"
        },
        "type": {
          "type": "string",
          "description": "\"onLoad\" | \"onChange\" | \"onSubmit\" | \"onCellEdit\""
        },
        "script": {
          "type": "string",
          "description": "Client-side JavaScript. Use g_form, g_user, etc."
        },
        "field_name": {
          "type": "string",
          "description": "Field name (required for onChange/onCellEdit)"
        },
        "active": {
          "type": "boolean",
          "description": "Whether to activate the script (default: true)"
        },
        "global": {
          "type": "boolean",
          "description": "Run script globally (default: false)"
        }
      },
      "required": [
        "name",
        "table",
        "type",
        "script"
      ]
    }
  },
  {
    "name": "update_client_script",
    "description": "Update an existing client script (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Client script sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update (script, active, name, type, etc.)"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_ui_policies",
    "description": "List UI Policies for a table (field visibility, mandatory, read-only rules) (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Filter by table name"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active policies only"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_ui_policy",
    "description": "Get full details and conditions of a UI Policy (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "UI Policy sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_ui_policy",
    "description": "Create a new UI Policy to control field behavior dynamically (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Policy description"
        },
        "table": {
          "type": "string",
          "description": "Table to apply this policy on"
        },
        "conditions": {
          "type": "string",
          "description": "Encoded query conditions that trigger the policy"
        },
        "script": {
          "type": "string",
          "description": "Optional script to run when conditions are met"
        },
        "active": {
          "type": "boolean",
          "description": "Whether to activate immediately (default: true)"
        },
        "run_scripts": {
          "type": "boolean",
          "description": "Run script in addition to UI actions (default: false)"
        }
      },
      "required": [
        "short_description",
        "table"
      ]
    }
  },
  {
    "name": "list_ui_actions",
    "description": "List UI Actions (buttons, context menus, related links) for a table (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Filter by table name"
        },
        "type": {
          "type": "string",
          "description": "Filter by type: button, context_menu, related_link, list_link, list_button, list_context_menu"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active actions only"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_ui_action",
    "description": "Get full details and script of a UI Action (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "UI Action sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_ui_action",
    "description": "Create a new UI Action (button or link) on a form (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Button/link label visible to users"
        },
        "table": {
          "type": "string",
          "description": "Table to add this action on"
        },
        "action_name": {
          "type": "string",
          "description": "Internal action name (no spaces)"
        },
        "script": {
          "type": "string",
          "description": "Server-side script to execute when clicked"
        },
        "type": {
          "type": "string",
          "description": "\"button\" | \"context_menu\" | \"related_link\" | \"list_button\""
        },
        "condition": {
          "type": "string",
          "description": "Condition to show/hide the action"
        },
        "active": {
          "type": "boolean",
          "description": "Whether to activate immediately (default: true)"
        },
        "form_button": {
          "type": "boolean",
          "description": "Show on form (default: true)"
        },
        "list_button": {
          "type": "boolean",
          "description": "Show on list (default: false)"
        }
      },
      "required": [
        "name",
        "table",
        "action_name"
      ]
    }
  },
  {
    "name": "update_ui_action",
    "description": "Update an existing UI Action (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "UI Action sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update (name, script, active, condition, etc.)"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_acls",
    "description": "List Access Control rules (ACLs) — who can read/write/create/delete records (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Filter ACLs by table name"
        },
        "operation": {
          "type": "string",
          "description": "Filter by operation: read, write, create, delete, execute"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active ACLs only"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_acl",
    "description": "Get full details of an ACL rule including its script and role requirements (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "ACL sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_acl",
    "description": "Create a new ACL rule to control access to a table or field (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "ACL name (typically \"table.field\" or \"table.*\")"
        },
        "type": {
          "type": "string",
          "description": "\"record\" | \"field\" | \"rest_endpoint\" | \"soap_endpoint\""
        },
        "operation": {
          "type": "string",
          "description": "\"read\" | \"write\" | \"create\" | \"delete\" | \"execute\""
        },
        "admin_overrides": {
          "type": "boolean",
          "description": "Allow admin to override (default: true)"
        },
        "active": {
          "type": "boolean",
          "description": "Whether to activate immediately (default: true)"
        },
        "script": {
          "type": "string",
          "description": "Optional condition script (return true to allow)"
        },
        "roles": {
          "type": "string",
          "description": "Comma-separated roles required (e.g. \"admin,itil\")"
        },
        "description": {
          "type": "string",
          "description": "Description of this access rule"
        }
      },
      "required": [
        "name",
        "operation"
      ]
    }
  },
  {
    "name": "update_acl",
    "description": "Update an existing ACL rule (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "ACL sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update (active, script, roles, condition, etc.)"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "create_story",
    "description": "Create a new agile story/user story (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Story title"
        },
        "story_points": {
          "type": "number",
          "description": "Story point estimate"
        },
        "sprint": {
          "type": "string",
          "description": "Sprint sys_id or name"
        },
        "epic": {
          "type": "string",
          "description": "Epic sys_id"
        },
        "description": {
          "type": "string",
          "description": "Story description and acceptance criteria"
        },
        "assigned_to": {
          "type": "string",
          "description": "User sys_id or username"
        }
      },
      "required": [
        "short_description"
      ]
    }
  },
  {
    "name": "update_story",
    "description": "Update an agile story (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the story"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_stories",
    "description": "List agile stories with optional sprint or state filter",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sprint": {
          "type": "string",
          "description": "Filter by sprint sys_id"
        },
        "state": {
          "type": "string",
          "description": "Filter by state (e.g., \"1\"=Open, \"2\"=Work in Progress, \"3\"=Complete)"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_epic",
    "description": "Create a new epic (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Epic title"
        },
        "description": {
          "type": "string",
          "description": "Epic description and goals"
        },
        "project": {
          "type": "string",
          "description": "Project sys_id"
        }
      },
      "required": [
        "short_description"
      ]
    }
  },
  {
    "name": "update_epic",
    "description": "Update an epic (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the epic"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_epics",
    "description": "List epics with optional project or state filter",
    "inputSchema": {
      "type": "object",
      "properties": {
        "project": {
          "type": "string",
          "description": "Filter by project sys_id"
        },
        "state": {
          "type": "string",
          "description": "Filter by state"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_scrum_task",
    "description": "Create a scrum task (sub-task of a story) (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Task title"
        },
        "story_sys_id": {
          "type": "string",
          "description": "Parent story sys_id"
        },
        "assigned_to": {
          "type": "string",
          "description": "Assignee user_name or sys_id"
        }
      },
      "required": [
        "short_description"
      ]
    }
  },
  {
    "name": "update_scrum_task",
    "description": "Update a scrum task (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the scrum task"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_scrum_tasks",
    "description": "List scrum tasks, optionally filtered by story",
    "inputSchema": {
      "type": "object",
      "properties": {
        "story_sys_id": {
          "type": "string",
          "description": "Filter by parent story sys_id"
        },
        "assigned_to": {
          "type": "string",
          "description": "Filter by assignee"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_story_dependency",
    "description": "Link one agile story as dependent on another (m2m_story_dependencies). Requires WRITE_ENABLED=true.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "story": {
          "type": "string",
          "description": "The dependent story sys_id (the one that is blocked)"
        },
        "dependent_story": {
          "type": "string",
          "description": "The story it depends on (the blocker) sys_id"
        }
      },
      "required": [
        "story",
        "dependent_story"
      ]
    }
  },
  {
    "name": "list_story_dependencies",
    "description": "List dependency links for a story (m2m_story_dependencies).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "story": {
          "type": "string",
          "description": "Story sys_id to list dependencies for"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 50)"
        }
      },
      "required": [
        "story"
      ]
    }
  },
  {
    "name": "delete_story_dependency",
    "description": "Remove a story dependency link by its m2m_story_dependencies sys_id. Requires WRITE_ENABLED=true.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "The m2m_story_dependencies record sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_project",
    "description": "Create a PPM project (pm_project). Requires WRITE_ENABLED=true.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Project name / short description"
        },
        "description": {
          "type": "string",
          "description": "Project description"
        },
        "state": {
          "type": "string",
          "description": "Project state (e.g. pending, open, work in progress)"
        },
        "priority": {
          "type": "string",
          "description": "Priority (1-5)"
        },
        "fields": {
          "type": "object",
          "description": "Additional pm_project fields (start_date, end_date, project_manager, etc.)"
        }
      },
      "required": [
        "short_description"
      ]
    }
  },
  {
    "name": "update_project",
    "description": "Update a PPM project (pm_project). Requires WRITE_ENABLED=true.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Project sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_projects",
    "description": "List PPM projects (pm_project).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Encoded query filter (e.g. state=open)"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default: 20)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_hr_case",
    "description": "Create a new HR Service Delivery case (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Brief description of the HR request"
        },
        "hr_service": {
          "type": "string",
          "description": "HR service sys_id or name (e.g. \"Onboarding\", \"Offboarding\")"
        },
        "subject_person": {
          "type": "string",
          "description": "User sys_id or username the case is about"
        },
        "description": {
          "type": "string",
          "description": "Full details of the HR request"
        },
        "assignment_group": {
          "type": "string",
          "description": "HR assignment group name or sys_id"
        },
        "priority": {
          "type": "number",
          "description": "1=Critical, 2=High, 3=Moderate, 4=Low"
        }
      },
      "required": [
        "short_description",
        "hr_service"
      ]
    }
  },
  {
    "name": "get_hr_case",
    "description": "Get full details of an HR case by number (e.g. HRCS0001234) or sys_id",
    "inputSchema": {
      "type": "object",
      "properties": {
        "number_or_sysid": {
          "type": "string",
          "description": "HR case number (HRCS...) or sys_id"
        }
      },
      "required": [
        "number_or_sysid"
      ]
    }
  },
  {
    "name": "update_hr_case",
    "description": "Update fields on an existing HR case (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the HR case"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_hr_cases",
    "description": "List HR cases with optional filters (status, subject person, service)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "Filter by state: open, work_in_progress, closed_complete, closed_incomplete"
        },
        "subject_person": {
          "type": "string",
          "description": "User sys_id or username to filter by"
        },
        "hr_service": {
          "type": "string",
          "description": "HR service name or sys_id"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        },
        "query": {
          "type": "string",
          "description": "Additional encoded query string"
        }
      },
      "required": []
    }
  },
  {
    "name": "close_hr_case",
    "description": "Close an HR case with resolution notes (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the HR case"
        },
        "close_notes": {
          "type": "string",
          "description": "Resolution or closure notes"
        },
        "close_code": {
          "type": "string",
          "description": "Closure code (e.g., \"Resolved\", \"Withdrawn\")"
        }
      },
      "required": [
        "sys_id",
        "close_notes"
      ]
    }
  },
  {
    "name": "list_hr_services",
    "description": "List available HR services (Onboarding, Offboarding, Benefits, Payroll, etc.)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active": {
          "type": "boolean",
          "description": "Filter to active services only (default true)"
        },
        "query": {
          "type": "string",
          "description": "Filter by name or description"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_hr_service",
    "description": "Get details of a specific HR service including its tasks and SLAs",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id_or_name": {
          "type": "string",
          "description": "HR service sys_id or exact name"
        }
      },
      "required": [
        "sys_id_or_name"
      ]
    }
  },
  {
    "name": "get_hr_profile",
    "description": "Get the HR profile for a user (employment details, department, manager)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user_identifier": {
          "type": "string",
          "description": "Username, email, or sys_id of the user"
        }
      },
      "required": [
        "user_identifier"
      ]
    }
  },
  {
    "name": "update_hr_profile",
    "description": "Update HR profile fields for a user (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user_sys_id": {
          "type": "string",
          "description": "sys_id of the user whose profile to update"
        },
        "fields": {
          "type": "object",
          "description": "HR profile fields to update (e.g., {\"department\": \"Engineering\"})"
        }
      },
      "required": [
        "user_sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_hr_tasks",
    "description": "List HR tasks associated with an HR case",
    "inputSchema": {
      "type": "object",
      "properties": {
        "hr_case_sysid": {
          "type": "string",
          "description": "sys_id of the parent HR case"
        },
        "state": {
          "type": "string",
          "description": "Filter by task state (open, closed)"
        }
      },
      "required": [
        "hr_case_sysid"
      ]
    }
  },
  {
    "name": "create_hr_task",
    "description": "Create a task within an HR case (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "hr_case_sysid": {
          "type": "string",
          "description": "sys_id of the parent HR case"
        },
        "short_description": {
          "type": "string",
          "description": "Brief description of the task"
        },
        "assigned_to": {
          "type": "string",
          "description": "User sys_id or username to assign the task to"
        },
        "due_date": {
          "type": "string",
          "description": "Due date in ISO 8601 format"
        }
      },
      "required": [
        "hr_case_sysid",
        "short_description"
      ]
    }
  },
  {
    "name": "get_hr_case_activity",
    "description": "Get the full activity log and journal entries for an HR case",
    "inputSchema": {
      "type": "object",
      "properties": {
        "hr_case_sysid": {
          "type": "string",
          "description": "sys_id of the HR case"
        }
      },
      "required": [
        "hr_case_sysid"
      ]
    }
  },
  {
    "name": "create_onboarding_case",
    "description": "Create an employee onboarding case with all standard tasks. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "employee_sys_id": {
          "type": "string",
          "description": "New employee user sys_id"
        },
        "start_date": {
          "type": "string",
          "description": "Start date (ISO 8601)"
        },
        "department": {
          "type": "string",
          "description": "Department name or sys_id"
        },
        "manager": {
          "type": "string",
          "description": "Manager user sys_id"
        },
        "location": {
          "type": "string",
          "description": "Office location"
        },
        "job_title": {
          "type": "string",
          "description": "Job title"
        }
      },
      "required": [
        "employee_sys_id",
        "start_date"
      ]
    }
  },
  {
    "name": "create_offboarding_case",
    "description": "Create an employee offboarding case with exit tasks. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "employee_sys_id": {
          "type": "string",
          "description": "Departing employee user sys_id"
        },
        "last_day": {
          "type": "string",
          "description": "Last working day (ISO 8601)"
        },
        "reason": {
          "type": "string",
          "description": "Offboarding reason (resignation, termination, retirement)"
        },
        "manager": {
          "type": "string",
          "description": "Manager user sys_id"
        }
      },
      "required": [
        "employee_sys_id",
        "last_day"
      ]
    }
  },
  {
    "name": "get_hr_lifecycle_events",
    "description": "Get HR lifecycle events for an employee (promotions, transfers, leaves)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "employee_sys_id": {
          "type": "string",
          "description": "Employee user sys_id"
        },
        "event_type": {
          "type": "string",
          "description": "Filter by type: promotion, transfer, leave, onboarding, offboarding"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": [
        "employee_sys_id"
      ]
    }
  },
  {
    "name": "list_hr_document_templates",
    "description": "List available HR document templates (offer letters, contracts, policies)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string",
          "description": "Filter by category: onboarding, offboarding, benefits, policy"
        },
        "active": {
          "type": "boolean",
          "description": "Filter active only (default true)"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_csm_case",
    "description": "Create a new Customer Service case (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Brief summary of the customer issue"
        },
        "account": {
          "type": "string",
          "description": "Account name or sys_id"
        },
        "contact": {
          "type": "string",
          "description": "Contact name or sys_id (the person raising the case)"
        },
        "category": {
          "type": "string",
          "description": "Case category (e.g., \"Product\", \"Billing\", \"Technical\")"
        },
        "subcategory": {
          "type": "string",
          "description": "Case subcategory"
        },
        "priority": {
          "type": "number",
          "description": "1=Critical, 2=High, 3=Moderate, 4=Low"
        },
        "description": {
          "type": "string",
          "description": "Detailed description of the customer issue"
        },
        "product": {
          "type": "string",
          "description": "Product or service sys_id related to the case"
        },
        "assignment_group": {
          "type": "string",
          "description": "CSM assignment group"
        }
      },
      "required": [
        "short_description"
      ]
    }
  },
  {
    "name": "get_csm_case",
    "description": "Get full details of a CSM case by number (e.g. CS0001234) or sys_id",
    "inputSchema": {
      "type": "object",
      "properties": {
        "number_or_sysid": {
          "type": "string",
          "description": "Case number (CS...) or sys_id"
        }
      },
      "required": [
        "number_or_sysid"
      ]
    }
  },
  {
    "name": "update_csm_case",
    "description": "Update fields on an existing CSM case (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the CSM case"
        },
        "fields": {
          "type": "object",
          "description": "Key-value pairs of fields to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_csm_cases",
    "description": "List CSM cases with optional filters (account, contact, state, priority)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account": {
          "type": "string",
          "description": "Filter by account name or sys_id"
        },
        "contact": {
          "type": "string",
          "description": "Filter by contact name or sys_id"
        },
        "state": {
          "type": "string",
          "description": "Filter by state (open, resolved, closed)"
        },
        "priority": {
          "type": "number",
          "description": "Filter by priority (1-4)"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        },
        "query": {
          "type": "string",
          "description": "Additional encoded query"
        }
      },
      "required": []
    }
  },
  {
    "name": "close_csm_case",
    "description": "Close a CSM case with resolution details (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the CSM case"
        },
        "resolution_code": {
          "type": "string",
          "description": "How the case was resolved"
        },
        "resolution_notes": {
          "type": "string",
          "description": "Detailed resolution notes"
        }
      },
      "required": [
        "sys_id",
        "resolution_notes"
      ]
    }
  },
  {
    "name": "get_csm_account",
    "description": "Get details of a customer account including contacts and open cases count",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name_or_sysid": {
          "type": "string",
          "description": "Account name or sys_id"
        }
      },
      "required": [
        "name_or_sysid"
      ]
    }
  },
  {
    "name": "list_csm_accounts",
    "description": "List customer accounts with optional search filter",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search accounts by name"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active accounts only (default true)"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_csm_contact",
    "description": "Get details of a customer contact (name, account, phone, email)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name_or_sysid": {
          "type": "string",
          "description": "Contact name, email, or sys_id"
        }
      },
      "required": [
        "name_or_sysid"
      ]
    }
  },
  {
    "name": "list_csm_contacts",
    "description": "List contacts for an account or search across all contacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account_sysid": {
          "type": "string",
          "description": "Filter contacts by account sys_id"
        },
        "query": {
          "type": "string",
          "description": "Search by name or email"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_csm_case_sla",
    "description": "Get SLA details and remaining time for a CSM case",
    "inputSchema": {
      "type": "object",
      "properties": {
        "case_sysid": {
          "type": "string",
          "description": "sys_id of the CSM case"
        }
      },
      "required": [
        "case_sysid"
      ]
    }
  },
  {
    "name": "list_csm_products",
    "description": "List products and services available in the CSM catalog",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search products by name"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_security_incident",
    "description": "Create a Security Operations incident (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Brief description of the security event"
        },
        "category": {
          "type": "string",
          "description": "Incident category (e.g., \"Malware\", \"Phishing\", \"Data Breach\", \"Unauthorized Access\")"
        },
        "subcategory": {
          "type": "string",
          "description": "Incident subcategory"
        },
        "severity": {
          "type": "number",
          "description": "1=High, 2=Medium, 3=Low"
        },
        "description": {
          "type": "string",
          "description": "Detailed description of the security incident"
        },
        "affected_cis": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "List of affected CI sys_ids"
        },
        "assignment_group": {
          "type": "string",
          "description": "SOC team or assignment group"
        }
      },
      "required": [
        "short_description",
        "category"
      ]
    }
  },
  {
    "name": "get_security_incident",
    "description": "Get full details of a security incident by number or sys_id",
    "inputSchema": {
      "type": "object",
      "properties": {
        "number_or_sysid": {
          "type": "string",
          "description": "Security incident number (SIR...) or sys_id"
        }
      },
      "required": [
        "number_or_sysid"
      ]
    }
  },
  {
    "name": "update_security_incident",
    "description": "Update a security incident record (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the security incident"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update (state, severity, containment_status, etc.)"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_security_incidents",
    "description": "List security incidents with filters (severity, state, category)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "Filter by state (open, analysis, contain, eradicate, recover, review, closed)"
        },
        "severity": {
          "type": "number",
          "description": "Filter by severity (1=High, 2=Medium, 3=Low)"
        },
        "category": {
          "type": "string",
          "description": "Filter by incident category"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        },
        "query": {
          "type": "string",
          "description": "Additional encoded query string"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_vulnerabilities",
    "description": "List vulnerability entries from the Vulnerability Response module",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "Filter by state (open, in_review, risk_accepted, closed)"
        },
        "severity": {
          "type": "string",
          "description": "Filter by CVSS severity (critical, high, medium, low)"
        },
        "ci_sysid": {
          "type": "string",
          "description": "Filter by affected CI sys_id"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        },
        "query": {
          "type": "string",
          "description": "Additional encoded query string"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_vulnerability",
    "description": "Get details of a specific vulnerability entry including CVSS score and affected CIs",
    "inputSchema": {
      "type": "object",
      "properties": {
        "number_or_sysid": {
          "type": "string",
          "description": "Vulnerability number (VIT...) or sys_id"
        }
      },
      "required": [
        "number_or_sysid"
      ]
    }
  },
  {
    "name": "update_vulnerability",
    "description": "Update a vulnerability entry (state, risk acceptance notes, remediation date) (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the vulnerability entry"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update (state, risk_acceptance_notes, remediation_date, etc.)"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_grc_risks",
    "description": "List GRC (Governance, Risk, Compliance) risk entries",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "Filter by risk state (draft, assess, review, accepted, closed)"
        },
        "category": {
          "type": "string",
          "description": "Filter by risk category"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_grc_risk",
    "description": "Get details of a GRC risk including impact, likelihood, and controls",
    "inputSchema": {
      "type": "object",
      "properties": {
        "number_or_sysid": {
          "type": "string",
          "description": "Risk number or sys_id"
        }
      },
      "required": [
        "number_or_sysid"
      ]
    }
  },
  {
    "name": "list_grc_controls",
    "description": "List GRC controls with optional filter by risk or policy",
    "inputSchema": {
      "type": "object",
      "properties": {
        "risk_sysid": {
          "type": "string",
          "description": "Filter controls by related risk sys_id"
        },
        "state": {
          "type": "string",
          "description": "Filter by control state (draft, attest, review, exception, compliant, non_compliant)"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_threat_intelligence",
    "description": "Query threat intelligence data — IOCs, threat actors, and campaigns",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search term (IP, domain, hash, actor name)"
        },
        "type": {
          "type": "string",
          "description": "Filter by IOC type: ip_address, domain, file_hash, url, email"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": [
        "query"
      ]
    }
  },
  {
    "name": "list_security_playbooks",
    "description": "List available security response playbooks",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active": {
          "type": "boolean",
          "description": "Filter active only (default true)"
        },
        "category": {
          "type": "string",
          "description": "Filter by category (incident_response, threat_hunting, compliance)"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "run_security_playbook",
    "description": "Execute a security response playbook against an incident. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "playbook_sys_id": {
          "type": "string",
          "description": "Playbook sys_id to execute"
        },
        "incident_sys_id": {
          "type": "string",
          "description": "Security incident sys_id to run against"
        },
        "parameters": {
          "type": "object",
          "description": "Optional playbook input parameters"
        }
      },
      "required": [
        "playbook_sys_id",
        "incident_sys_id"
      ]
    }
  },
  {
    "name": "get_security_dashboard",
    "description": "Get security posture dashboard — open incidents by severity, vulnerability counts, mean time to resolve",
    "inputSchema": {
      "type": "object",
      "properties": {
        "days": {
          "type": "number",
          "description": "Look-back period in days (default 30)"
        }
      },
      "required": []
    }
  },
  {
    "name": "scan_vulnerabilities",
    "description": "Trigger a vulnerability scan for specified CIs or groups. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ci_sys_ids": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "CI sys_ids to scan"
        },
        "group": {
          "type": "string",
          "description": "CI group to scan (alternative to ci_sys_ids)"
        },
        "scan_type": {
          "type": "string",
          "description": "Scan type: full, quick, compliance (default full)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_grc_risk",
    "description": "Create a new GRC risk entry. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Risk name"
        },
        "category": {
          "type": "string",
          "description": "Risk category"
        },
        "description": {
          "type": "string",
          "description": "Risk description"
        },
        "impact": {
          "type": "number",
          "description": "Impact score (1-5)"
        },
        "likelihood": {
          "type": "number",
          "description": "Likelihood score (1-5)"
        },
        "owner": {
          "type": "string",
          "description": "Risk owner user sys_id"
        }
      },
      "required": [
        "name",
        "category"
      ]
    }
  },
  {
    "name": "list_compliance_policies",
    "description": "List GRC compliance policies and their current status",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "Filter by state (draft, published, retired)"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_compliance_assessment",
    "description": "Get compliance assessment results for a policy or control",
    "inputSchema": {
      "type": "object",
      "properties": {
        "policy_sys_id": {
          "type": "string",
          "description": "Policy sys_id"
        },
        "control_sys_id": {
          "type": "string",
          "description": "Control sys_id (alternative to policy)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_audit_results",
    "description": "List audit results and findings",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "Filter by state (open, in_progress, closed)"
        },
        "severity": {
          "type": "string",
          "description": "Filter by severity (critical, high, medium, low)"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_flows",
    "description": "List Flow Designer flows with optional filter by name, category, or active status",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search flows by name or description"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active flows only (default true)"
        },
        "category": {
          "type": "string",
          "description": "Filter by category (e.g., \"ITSM\", \"HR\", \"Security\")"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_flow",
    "description": "Get full details of a Flow Designer flow including its actions and trigger",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name_or_sysid": {
          "type": "string",
          "description": "Flow name or sys_id"
        }
      },
      "required": [
        "name_or_sysid"
      ]
    }
  },
  {
    "name": "trigger_flow",
    "description": "Trigger a Flow Designer flow with optional input parameters (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "flow_sys_id": {
          "type": "string",
          "description": "sys_id of the flow to trigger"
        },
        "inputs": {
          "type": "object",
          "description": "Key-value pairs for flow input variables"
        }
      },
      "required": [
        "flow_sys_id"
      ]
    }
  },
  {
    "name": "get_flow_execution",
    "description": "Get the status and details of a specific flow execution",
    "inputSchema": {
      "type": "object",
      "properties": {
        "execution_sysid": {
          "type": "string",
          "description": "sys_id of the flow execution to inspect"
        }
      },
      "required": [
        "execution_sysid"
      ]
    }
  },
  {
    "name": "list_flow_executions",
    "description": "List recent executions of a flow with status (completed, error, running)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "flow_sys_id": {
          "type": "string",
          "description": "sys_id of the parent flow"
        },
        "status": {
          "type": "string",
          "description": "Filter by status: running, complete, error, cancelled"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": [
        "flow_sys_id"
      ]
    }
  },
  {
    "name": "list_subflows",
    "description": "List available subflows that can be reused across flows",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search subflows by name"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active subflows only (default true)"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_subflow",
    "description": "Get full details of a subflow including its inputs, outputs, and actions",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name_or_sysid": {
          "type": "string",
          "description": "Subflow name or sys_id"
        }
      },
      "required": [
        "name_or_sysid"
      ]
    }
  },
  {
    "name": "list_action_instances",
    "description": "List Flow Designer action instances. Pass flow_id to scope to a single flow's steps (recommended); otherwise lists across the environment.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "flow_id": {
          "type": "string",
          "description": "Parent flow sys_id (sys_hub_flow). Returns only that flow's action instances."
        },
        "query": {
          "type": "string",
          "description": "Search actions by name or category"
        },
        "category": {
          "type": "string",
          "description": "Filter by action category (e.g., \"ServiceNow Core\", \"Integrations\")"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_process_automation",
    "description": "Get details of a Process Automation Designer playbook or process",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name_or_sysid": {
          "type": "string",
          "description": "Playbook or process name or sys_id"
        }
      },
      "required": [
        "name_or_sysid"
      ]
    }
  },
  {
    "name": "list_process_automations",
    "description": "List Process Automation Designer playbooks and processes",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search by name or description"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active processes only (default true)"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_flow",
    "description": "Create a new Flow Designer flow. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Flow name"
        },
        "description": {
          "type": "string",
          "description": "Flow description"
        },
        "trigger_type": {
          "type": "string",
          "description": "Trigger type: record, schedule, inbound_email, rest (default record)"
        },
        "trigger_table": {
          "type": "string",
          "description": "Trigger table (for record triggers)"
        },
        "scope": {
          "type": "string",
          "description": "Application scope"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "create_subflow",
    "description": "Create a new reusable subflow. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Subflow name"
        },
        "description": {
          "type": "string",
          "description": "Subflow description"
        },
        "inputs": {
          "type": "array",
          "items": {
            "type": "object"
          },
          "description": "Input variable definitions [{name, type, mandatory}]"
        },
        "scope": {
          "type": "string",
          "description": "Application scope"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "create_flow_action",
    "description": "Create a custom Flow Designer action. **[Scripting]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Action name"
        },
        "description": {
          "type": "string",
          "description": "Action description"
        },
        "inputs": {
          "type": "array",
          "items": {
            "type": "object"
          },
          "description": "Input definitions [{name, type, mandatory}]"
        },
        "outputs": {
          "type": "array",
          "items": {
            "type": "object"
          },
          "description": "Output definitions [{name, type}]"
        },
        "script": {
          "type": "string",
          "description": "Action script body"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "publish_flow",
    "description": "Publish (activate) a draft flow or subflow. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "flow_sys_id": {
          "type": "string",
          "description": "Flow or subflow sys_id to publish"
        },
        "type": {
          "type": "string",
          "description": "Type: flow or subflow (default flow)"
        }
      },
      "required": [
        "flow_sys_id"
      ]
    }
  },
  {
    "name": "update_flow",
    "description": "Update a flow or subflow's METADATA only (activate/deactivate, name, description, run-as). **[Write]** NOTE: this cannot safely insert or edit flow STEPS. Flow Designer executes a compiled snapshot, and writing action-instance rows over REST does not recompile the flow, which would desync/corrupt it. Edit steps in the Flow Designer UI.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "flow_sys_id": {
          "type": "string",
          "description": "Flow or subflow sys_id"
        },
        "type": {
          "type": "string",
          "description": "Type: flow or subflow (default flow)"
        },
        "active": {
          "type": "boolean",
          "description": "Activate (true) or deactivate (false)"
        },
        "name": {
          "type": "string",
          "description": "New name"
        },
        "description": {
          "type": "string",
          "description": "New description"
        },
        "run_as": {
          "type": "string",
          "description": "run_as value (e.g. user_who_triggers, system_user)"
        }
      },
      "required": [
        "flow_sys_id"
      ]
    }
  },
  {
    "name": "test_flow",
    "description": "Execute a flow in test mode with sample inputs. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "flow_sys_id": {
          "type": "string",
          "description": "Flow sys_id to test"
        },
        "test_inputs": {
          "type": "object",
          "description": "Test input values"
        }
      },
      "required": [
        "flow_sys_id"
      ]
    }
  },
  {
    "name": "get_flow_error_log",
    "description": "Get detailed error logs for failed flow executions",
    "inputSchema": {
      "type": "object",
      "properties": {
        "flow_sys_id": {
          "type": "string",
          "description": "Flow sys_id"
        },
        "days": {
          "type": "number",
          "description": "Look-back period in days (default 7)"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": [
        "flow_sys_id"
      ]
    }
  },
  {
    "name": "list_decision_tables",
    "description": "List Decision Builder decision tables (sys_decision), optionally filtered by name or active status",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search decision tables by name or description"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active decision tables only"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_decision_table",
    "description": "Get a decision table with its inputs and answer rows, by name or sys_id",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name_or_sysid": {
          "type": "string",
          "description": "Decision table name or sys_id"
        }
      },
      "required": [
        "name_or_sysid"
      ]
    }
  },
  {
    "name": "list_decision_inputs",
    "description": "List the inputs of a decision table",
    "inputSchema": {
      "type": "object",
      "properties": {
        "decision_sys_id": {
          "type": "string",
          "description": "sys_id of the decision table (sys_decision)"
        }
      },
      "required": [
        "decision_sys_id"
      ]
    }
  },
  {
    "name": "list_decision_answers",
    "description": "List the answer/result rows of a decision table",
    "inputSchema": {
      "type": "object",
      "properties": {
        "decision_sys_id": {
          "type": "string",
          "description": "sys_id of the decision table (sys_decision)"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 100)"
        }
      },
      "required": [
        "decision_sys_id"
      ]
    }
  },
  {
    "name": "create_decision_table",
    "description": "Create a Decision Builder decision table (sys_decision). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Decision table name"
        },
        "description": {
          "type": "string",
          "description": "Description of what the decision returns"
        },
        "active": {
          "type": "boolean",
          "description": "Whether the decision table is active (default true)"
        },
        "fields": {
          "type": "object",
          "description": "Additional sys_decision field values to set"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "create_decision_input",
    "description": "Add an input to a decision table (sys_decision_input). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "decision_sys_id": {
          "type": "string",
          "description": "sys_id of the parent decision table (sys_decision)"
        },
        "name": {
          "type": "string",
          "description": "Input name/label"
        },
        "type": {
          "type": "string",
          "description": "Input data type (e.g., string, integer, reference, boolean)"
        },
        "order": {
          "type": "number",
          "description": "Display order of the input"
        },
        "fields": {
          "type": "object",
          "description": "Additional sys_decision_input field values to set"
        }
      },
      "required": [
        "decision_sys_id",
        "name"
      ]
    }
  },
  {
    "name": "list_sla_definitions",
    "description": "List SLA/OLA definitions (contract_sla), optionally filtered by name, table, or active status",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search definitions by name"
        },
        "table": {
          "type": "string",
          "description": "Filter to a collection/table (e.g. \"incident\")"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active definitions only"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_sla_definition",
    "description": "Create an SLA/OLA definition (contract_sla). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "SLA definition name"
        },
        "collection": {
          "type": "string",
          "description": "Table the SLA applies to (e.g. \"incident\")"
        },
        "duration_type": {
          "type": "string",
          "description": "Duration type (e.g. \"User specified\")"
        },
        "duration": {
          "type": "string",
          "description": "Duration value (e.g. \"1970-01-01 04:00:00\" for 4h)"
        },
        "start_condition": {
          "type": "string",
          "description": "Encoded start condition"
        },
        "stop_condition": {
          "type": "string",
          "description": "Encoded stop condition"
        },
        "schedule": {
          "type": "string",
          "description": "Schedule sys_id (business hours)"
        },
        "type": {
          "type": "string",
          "description": "\"SLA\" or \"OLA\" (default SLA)"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "name",
        "collection"
      ]
    }
  },
  {
    "name": "update_sla_definition",
    "description": "Update an SLA/OLA definition (contract_sla). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "sys_id of the definition"
        },
        "fields": {
          "type": "object",
          "description": "Field values to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "get_task_sla",
    "description": "Get live SLA instances (task_sla) for a task — percent complete, breach status, stage, planned end",
    "inputSchema": {
      "type": "object",
      "properties": {
        "task": {
          "type": "string",
          "description": "sys_id of the task (incident/change/etc.)"
        },
        "task_number": {
          "type": "string",
          "description": "Task number (e.g. INC0010001) if sys_id not known"
        },
        "active_only": {
          "type": "boolean",
          "description": "Only in-progress SLAs (default true)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_breached_slas",
    "description": "List SLA instances that have breached or are at risk within a window (task_sla)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "breached": {
          "type": "boolean",
          "description": "true = already breached; false = at-risk/in-progress (default true)"
        },
        "min_percentage": {
          "type": "number",
          "description": "For at-risk: minimum business_percentage (e.g. 80)"
        },
        "sla_table": {
          "type": "string",
          "description": "Filter to a task table (e.g. \"incident\") via task.sys_class_name"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_on_call_now",
    "description": "Find who is on call for a group right now. Returns the current roster members for the group's rotations",
    "inputSchema": {
      "type": "object",
      "properties": {
        "group": {
          "type": "string",
          "description": "Group name or sys_id"
        }
      },
      "required": [
        "group"
      ]
    }
  },
  {
    "name": "list_rotas",
    "description": "List on-call rotations (cmn_rota), optionally filtered by group or name",
    "inputSchema": {
      "type": "object",
      "properties": {
        "group": {
          "type": "string",
          "description": "Filter by group sys_id"
        },
        "query": {
          "type": "string",
          "description": "Search rotations by name"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_rota_schedule",
    "description": "Create an on-call rotation (cmn_rota) for a group. Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Rotation name"
        },
        "group": {
          "type": "string",
          "description": "Group sys_id that owns the rotation"
        },
        "time_zone": {
          "type": "string",
          "description": "Time zone (e.g. \"US/Eastern\")"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "name",
        "group"
      ]
    }
  },
  {
    "name": "add_roster_member",
    "description": "Add a member to an on-call roster (cmn_rota_member). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "roster": {
          "type": "string",
          "description": "sys_id of the roster (cmn_rota_roster)"
        },
        "member": {
          "type": "string",
          "description": "sys_id of the group member (sys_user_grmember) or user"
        },
        "order": {
          "type": "number",
          "description": "Rotation order"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "roster",
        "member"
      ]
    }
  },
  {
    "name": "create_on_call_override",
    "description": "Create an on-call coverage override for a date range (cmn_rota_override). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "roster": {
          "type": "string",
          "description": "sys_id of the roster being overridden"
        },
        "member": {
          "type": "string",
          "description": "sys_id of the covering user/member"
        },
        "start": {
          "type": "string",
          "description": "Override start (YYYY-MM-DD HH:MM:SS)"
        },
        "end": {
          "type": "string",
          "description": "Override end (YYYY-MM-DD HH:MM:SS)"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "roster",
        "member",
        "start",
        "end"
      ]
    }
  },
  {
    "name": "get_request_item",
    "description": "Get a requested item (RITM) with its variables, by number or sys_id",
    "inputSchema": {
      "type": "object",
      "properties": {
        "number": {
          "type": "string",
          "description": "RITM number (e.g. RITM0010001)"
        },
        "sys_id": {
          "type": "string",
          "description": "sys_id of the sc_req_item"
        }
      },
      "required": []
    }
  },
  {
    "name": "update_request_item",
    "description": "Update the state/stage or fields of a requested item (sc_req_item). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "sys_id of the RITM"
        },
        "state": {
          "type": "string",
          "description": "New state value"
        },
        "stage": {
          "type": "string",
          "description": "New stage value"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_catalog_tasks",
    "description": "List catalog fulfillment tasks (SCTASK), optionally by request item, assignment group, or state",
    "inputSchema": {
      "type": "object",
      "properties": {
        "request_item": {
          "type": "string",
          "description": "Parent RITM sys_id"
        },
        "assignment_group": {
          "type": "string",
          "description": "Assignment group sys_id"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active tasks only"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "complete_catalog_task",
    "description": "Close a catalog fulfillment task (sc_task) as complete. Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "sys_id of the SCTASK"
        },
        "close_notes": {
          "type": "string",
          "description": "Closure notes"
        },
        "state": {
          "type": "string",
          "description": "Closed state value (default 3 = Closed Complete)"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_catalog_categories",
    "description": "List catalog categories (sc_category), optionally filtered by catalog or title",
    "inputSchema": {
      "type": "object",
      "properties": {
        "catalog": {
          "type": "string",
          "description": "Catalog sys_id to filter by"
        },
        "query": {
          "type": "string",
          "description": "Search categories by title"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_catalog_category",
    "description": "Create a catalog category (sc_category). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "Category title"
        },
        "catalog": {
          "type": "string",
          "description": "Catalog sys_id (sc_catalog)"
        },
        "description": {
          "type": "string",
          "description": "Category description"
        },
        "parent": {
          "type": "string",
          "description": "Parent category sys_id (for sub-categories)"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "title"
      ]
    }
  },
  {
    "name": "create_user_criteria",
    "description": "Create a user criteria record (user_criteria) for catalog entitlement/audience. Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "User criteria name"
        },
        "roles": {
          "type": "string",
          "description": "Comma-separated role sys_ids"
        },
        "groups": {
          "type": "string",
          "description": "Comma-separated group sys_ids"
        },
        "users": {
          "type": "string",
          "description": "Comma-separated user sys_ids"
        },
        "match_all": {
          "type": "boolean",
          "description": "Require all conditions to match"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "assign_user_criteria",
    "description": "Attach a user criteria to a catalog item as available-for (sc_cat_item_user_criteria_mtom). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "catalog_item": {
          "type": "string",
          "description": "sys_id of the catalog item (sc_cat_item)"
        },
        "user_criteria": {
          "type": "string",
          "description": "sys_id of the user_criteria record"
        }
      },
      "required": [
        "catalog_item",
        "user_criteria"
      ]
    }
  },
  {
    "name": "list_user_roles",
    "description": "List roles granted to a user (sys_user_has_role), including inherited flag",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user": {
          "type": "string",
          "description": "User sys_id, user_name, or email"
        }
      },
      "required": [
        "user"
      ]
    }
  },
  {
    "name": "grant_role",
    "description": "Grant a role to a user (sys_user_has_role). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user": {
          "type": "string",
          "description": "User sys_id, user_name, or email"
        },
        "role": {
          "type": "string",
          "description": "Role sys_id or name (e.g. \"itil\")"
        }
      },
      "required": [
        "user",
        "role"
      ]
    }
  },
  {
    "name": "revoke_role",
    "description": "Revoke a directly-granted role from a user. Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user": {
          "type": "string",
          "description": "User sys_id, user_name, or email"
        },
        "role": {
          "type": "string",
          "description": "Role sys_id or name"
        }
      },
      "required": [
        "user",
        "role"
      ]
    }
  },
  {
    "name": "create_role",
    "description": "Create a new role (sys_user_role). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Role name (e.g. \"x_acme.approver\")"
        },
        "description": {
          "type": "string",
          "description": "Role description"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "deactivate_user",
    "description": "Deactivate (offboard) a user by setting active=false. Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user": {
          "type": "string",
          "description": "User sys_id, user_name, or email"
        }
      },
      "required": [
        "user"
      ]
    }
  },
  {
    "name": "create_delegation",
    "description": "Create an approval/coverage delegation (sys_user_delegate). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user": {
          "type": "string",
          "description": "User delegating (sys_id/user_name/email)"
        },
        "delegate": {
          "type": "string",
          "description": "User receiving the delegation"
        },
        "starts": {
          "type": "string",
          "description": "Start datetime (YYYY-MM-DD HH:MM:SS)"
        },
        "ends": {
          "type": "string",
          "description": "End datetime (YYYY-MM-DD HH:MM:SS)"
        },
        "approvals": {
          "type": "boolean",
          "description": "Delegate approvals (default true)"
        },
        "assignments": {
          "type": "boolean",
          "description": "Delegate assignments"
        }
      },
      "required": [
        "user",
        "delegate"
      ]
    }
  },
  {
    "name": "list_group_members",
    "description": "List the members of a group (sys_user_grmember)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "group": {
          "type": "string",
          "description": "Group sys_id or name"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 100)"
        }
      },
      "required": [
        "group"
      ]
    }
  },
  {
    "name": "get_user_entitlements",
    "description": "Summarize what a user can access: their roles, groups, and active status",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user": {
          "type": "string",
          "description": "User sys_id, user_name, or email"
        }
      },
      "required": [
        "user"
      ]
    }
  },
  {
    "name": "create_survey",
    "description": "Create a survey/assessment definition (asmt_metric_type). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Survey name"
        },
        "description": {
          "type": "string",
          "description": "Survey description"
        },
        "type": {
          "type": "string",
          "description": "Metric type (e.g. \"survey\")"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "send_survey",
    "description": "Issue a survey/assessment instance to a user (asmt_assessment_instance). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "metric_type": {
          "type": "string",
          "description": "sys_id of the survey definition (asmt_metric_type)"
        },
        "user": {
          "type": "string",
          "description": "Recipient user sys_id"
        },
        "trigger_id": {
          "type": "string",
          "description": "Source record sys_id (e.g. the closed incident)"
        },
        "trigger_table": {
          "type": "string",
          "description": "Source table name"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "metric_type",
        "user"
      ]
    }
  },
  {
    "name": "get_survey_results",
    "description": "Get responses/scores for a survey instance or definition (asmt_assessment_instance_question)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "instance": {
          "type": "string",
          "description": "sys_id of a specific assessment instance"
        },
        "metric_type": {
          "type": "string",
          "description": "sys_id of the survey definition (aggregate across instances)"
        },
        "limit": {
          "type": "number",
          "description": "Max question rows (default 100)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_assessments",
    "description": "List survey/assessment instances (asmt_assessment_instance) by state or user",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "Instance state (e.g. \"ready\", \"complete\")"
        },
        "user": {
          "type": "string",
          "description": "Recipient user sys_id"
        },
        "metric_type": {
          "type": "string",
          "description": "Survey definition sys_id"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_grc_issues",
    "description": "List GRC issues/findings (sn_grc_issue), optionally by state or owner",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "Issue state filter"
        },
        "owner": {
          "type": "string",
          "description": "Owner/assigned user sys_id"
        },
        "query": {
          "type": "string",
          "description": "Search issues by short description"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_grc_issue",
    "description": "Raise a GRC issue/finding (sn_grc_issue). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Issue summary"
        },
        "description": {
          "type": "string",
          "description": "Full description"
        },
        "source": {
          "type": "string",
          "description": "Source record sys_id (control/risk/audit)"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "short_description"
      ]
    }
  },
  {
    "name": "create_grc_control",
    "description": "Author a compliance control (sn_compliance_control). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Control name"
        },
        "description": {
          "type": "string",
          "description": "Control description"
        },
        "profile": {
          "type": "string",
          "description": "Related profile/entity sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "run_control_test",
    "description": "Create/attest a control test (sn_compliance_control_test). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "control": {
          "type": "string",
          "description": "sys_id of the control (sn_compliance_control)"
        },
        "result": {
          "type": "string",
          "description": "Test result/state (e.g. \"pass\", \"fail\")"
        },
        "notes": {
          "type": "string",
          "description": "Test notes/evidence"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "control"
      ]
    }
  },
  {
    "name": "create_business_service",
    "description": "Create a business service (cmdb_ci_service). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Business service name"
        },
        "owned_by": {
          "type": "string",
          "description": "Owner user sys_id"
        },
        "support_group": {
          "type": "string",
          "description": "Support group sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "create_service_offering",
    "description": "Create a service offering under a business service (service_offering). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Service offering name"
        },
        "parent": {
          "type": "string",
          "description": "Parent business service sys_id (cmdb_ci_service)"
        },
        "support_group": {
          "type": "string",
          "description": "Support group sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Additional field values"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "list_service_offerings",
    "description": "List service offerings (service_offering), optionally by parent business service",
    "inputSchema": {
      "type": "object",
      "properties": {
        "parent": {
          "type": "string",
          "description": "Parent business service sys_id"
        },
        "query": {
          "type": "string",
          "description": "Search offerings by name"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_scan_suites",
    "description": "List Instance Scan suites (scan_suite) available to run",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search suites by name"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_instance_scan_findings",
    "description": "List Instance Scan findings (scan_finding) — best-practice violations, optionally by check or suite result",
    "inputSchema": {
      "type": "object",
      "properties": {
        "check": {
          "type": "string",
          "description": "Filter by check name (contains)"
        },
        "suite_result": {
          "type": "string",
          "description": "Filter by scan suite result sys_id"
        },
        "table": {
          "type": "string",
          "description": "Filter by target table"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_ecc_queue",
    "description": "Inspect the ECC queue (ecc_queue) — MID server probes/sensors, by state, agent, or topic",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "Filter by state (e.g. \"ready\", \"processed\", \"error\")"
        },
        "queue": {
          "type": "string",
          "description": "Direction: \"input\" or \"output\""
        },
        "agent": {
          "type": "string",
          "description": "MID server agent name (contains)"
        },
        "topic": {
          "type": "string",
          "description": "Topic (contains)"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "resubmit_ecc_probe",
    "description": "Re-queue an ECC probe/sensor by setting its state back to ready (ecc_queue). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "sys_id of the ecc_queue record"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "run_fix_script",
    "description": "Execute a fix script (sys_script_fix) by name or sys_id on the server. Requires WRITE_ENABLED=true and SCRIPTING_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Fix script name"
        },
        "sys_id": {
          "type": "string",
          "description": "sys_id of the fix script"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_ai_agent_executions",
    "description": "List recent Now Assist AI Agent execution plans (sn_aia_execution_plan)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string",
          "description": "Filter by execution status"
        },
        "query": {
          "type": "string",
          "description": "Encoded query for additional filtering"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_ai_agent_execution",
    "description": "Get an AI Agent execution plan with its steps/tool calls (sn_aia_execution_plan + _step)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "sys_id of the execution plan"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_agent_use_cases",
    "description": "List AI Agent Studio use cases (sn_aia_usecase) and their configuration",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search use cases by name"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_application_services",
    "description": "List discovered application services (cmdb_ci_service_auto), optionally by name or operational status. Parity with ServiceNow get_all_application_service_names",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search application services by name"
        },
        "operational_status": {
          "type": "string",
          "description": "Filter by operational_status value"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "cmdb_services_for_ci",
    "description": "Reverse lookup: which application services contain a given CI/server (svc_ci_assoc). Parity with ServiceNow get_all_application_services_for_a_server",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ci": {
          "type": "string",
          "description": "sys_id of the CI/server"
        },
        "ci_name": {
          "type": "string",
          "description": "CI name if sys_id not known"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "cmdb_find_unmapped_cis",
    "description": "Find operational CIs that have relationships but belong to no application service (mapping gaps). Parity with ServiceNow get_unmapped_topology",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ci_class": {
          "type": "string",
          "description": "Restrict to a CI class/table (e.g. cmdb_ci_server)"
        },
        "limit": {
          "type": "number",
          "description": "Max CIs to scan/return (default 100)"
        }
      },
      "required": []
    }
  },
  {
    "name": "suggest_ci_class",
    "description": "Suggest the correct CMDB CI class for a keyword before creating a CI (cmdb_class_info). Parity with ServiceNow Get_SimilarCI_Classes",
    "inputSchema": {
      "type": "object",
      "properties": {
        "keyword": {
          "type": "string",
          "description": "Device/technology keyword, e.g. \"linux server\", \"load balancer\""
        },
        "limit": {
          "type": "number",
          "description": "Max classes to return (default 10)"
        }
      },
      "required": [
        "keyword"
      ]
    }
  },
  {
    "name": "get_quote",
    "description": "Get a CPQ/sales quote record by number or sys_id (tries known quote tables)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "number": {
          "type": "string",
          "description": "Quote number"
        },
        "sys_id": {
          "type": "string",
          "description": "Quote sys_id"
        },
        "table": {
          "type": "string",
          "description": "Explicit quote table if you know it"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_quotes",
    "description": "List CPQ/sales quotes with optional filters (state, account)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Explicit quote table if you know it"
        },
        "state": {
          "type": "string",
          "description": "Filter by state"
        },
        "account": {
          "type": "string",
          "description": "Filter by account sys_id"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_approval_history",
    "description": "Get the approval progression/history for any record (sysapproval_approver rows, ordered)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "record": {
          "type": "string",
          "description": "sys_id of the record under approval (source record)"
        },
        "limit": {
          "type": "number",
          "description": "Max approver rows (default 100)"
        }
      },
      "required": [
        "record"
      ]
    }
  },
  {
    "name": "preview_approval_routing",
    "description": "Preview the planned approver path for a record before/after submission (existing sysapproval_approver rows + matching approval rules)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "record": {
          "type": "string",
          "description": "sys_id of the record to preview routing for"
        },
        "table": {
          "type": "string",
          "description": "Table of the record (to match approval rules)"
        }
      },
      "required": [
        "record"
      ]
    }
  },
  {
    "name": "add_adhoc_approver",
    "description": "Add an ad-hoc approver to an in-flight approval on a record (inserts a sysapproval_approver row). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "record": {
          "type": "string",
          "description": "sys_id of the record under approval (sets sysapproval)"
        },
        "approver": {
          "type": "string",
          "description": "sys_id of the user to add as approver"
        },
        "source_table": {
          "type": "string",
          "description": "Table of the source record (source_table field)"
        }
      },
      "required": [
        "record",
        "approver"
      ]
    }
  },
  {
    "name": "recall_approval_request",
    "description": "Recall/withdraw approval requests on a record by cancelling pending approver rows (state → cancelled/no_longer_required). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "record": {
          "type": "string",
          "description": "sys_id of the record whose approvals to recall"
        }
      },
      "required": [
        "record"
      ]
    }
  },
  {
    "name": "submit_for_approval",
    "description": "Submit any record for approval by setting its approval field to \"requested\" (generic, not just change). Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table of the record"
        },
        "sys_id": {
          "type": "string",
          "description": "sys_id of the record"
        },
        "approval_field": {
          "type": "string",
          "description": "Approval field name (default \"approval\")"
        }
      },
      "required": [
        "table",
        "sys_id"
      ]
    }
  },
  {
    "name": "list_csm_case_tasks",
    "description": "List the tasks on a CSM case (sn_customerservice_task). Parity with ServiceNow CSM \"Get Case Tasks\"",
    "inputSchema": {
      "type": "object",
      "properties": {
        "case": {
          "type": "string",
          "description": "CSM case number or sys_id"
        },
        "active": {
          "type": "boolean",
          "description": "Only active tasks"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": [
        "case"
      ]
    }
  },
  {
    "name": "advance_hr_case",
    "description": "Advance an HR case to its next state/stage (sn_hr_core_case). Parity with ServiceNow HRSD \"HR Case Advance\". Requires WRITE_ENABLED=true",
    "inputSchema": {
      "type": "object",
      "properties": {
        "case": {
          "type": "string",
          "description": "HR case number or sys_id"
        },
        "state": {
          "type": "string",
          "description": "Target state value (if known); otherwise increments the current state"
        },
        "work_notes": {
          "type": "string",
          "description": "Optional work note to add on advance"
        }
      },
      "required": [
        "case"
      ]
    }
  },
  {
    "name": "search_hr_knowledge",
    "description": "Search HR-scoped knowledge articles (kb_knowledge in HR knowledge bases). Parity with ServiceNow HRSD \"HR Knowledge Search\"",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search text"
        },
        "kb": {
          "type": "string",
          "description": "Optional specific HR knowledge base sys_id"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 20)"
        }
      },
      "required": [
        "query"
      ]
    }
  },
  {
    "name": "mcp_health_check",
    "description": "Health check: confirm the instance is reachable and the configured credentials resolve to a valid user. Parity with ServiceNow MCP \"Health Check\"",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    }
  },
  {
    "name": "summarize_record",
    "description": "Summarize a record (incident/case/etc.) using the Now Assist summarization skill when available, otherwise return the assembled record + activity for the caller to summarize. Parity with ServiceNow Quickstart incident/case summarization",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table (e.g. incident, sn_customerservice_case, sn_hr_core_case)"
        },
        "record": {
          "type": "string",
          "description": "Record number or sys_id"
        }
      },
      "required": [
        "table",
        "record"
      ]
    }
  },
  {
    "name": "get_case_sentiment",
    "description": "Assess customer sentiment on a CSM case via the Now Assist sentiment skill when available, else return the case + customer comments for sentiment analysis. Parity with ServiceNow CSM \"Sentiment Analysis\"",
    "inputSchema": {
      "type": "object",
      "properties": {
        "case": {
          "type": "string",
          "description": "CSM case number or sys_id"
        },
        "table": {
          "type": "string",
          "description": "Case table (default sn_customerservice_case)"
        }
      },
      "required": [
        "case"
      ]
    }
  },
  {
    "name": "generate_case_activity_response",
    "description": "Draft an agent reply for a CSM case activity stream via the Now Assist activity-response skill when available, else return the case context to draft from. Parity with ServiceNow CSM \"Activity Response\"",
    "inputSchema": {
      "type": "object",
      "properties": {
        "case": {
          "type": "string",
          "description": "CSM case number or sys_id"
        },
        "table": {
          "type": "string",
          "description": "Case table (default sn_customerservice_case)"
        },
        "instruction": {
          "type": "string",
          "description": "Optional tone/instruction for the reply"
        }
      },
      "required": [
        "case"
      ]
    }
  },
  {
    "name": "generate_csm_resolution_notes",
    "description": "Generate CSM resolution notes via the Now Assist resolution-notes skill when available, else return the case + work notes to summarize. Parity with ServiceNow CSM \"Generate Resolution Notes\"",
    "inputSchema": {
      "type": "object",
      "properties": {
        "case": {
          "type": "string",
          "description": "CSM case number or sys_id"
        },
        "table": {
          "type": "string",
          "description": "Case table (default sn_customerservice_case)"
        }
      },
      "required": [
        "case"
      ]
    }
  },
  {
    "name": "check_hr_eligibility",
    "description": "Check an employee's eligibility for an HR service/policy via the Policy Based HR Case Evaluator skill when available, else return the employee + service context. Parity with ServiceNow HRSD \"HR Eligibility Check\"",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user": {
          "type": "string",
          "description": "Employee sys_id, user_name, or email"
        },
        "hr_service": {
          "type": "string",
          "description": "HR service sys_id or name to check eligibility for"
        }
      },
      "required": [
        "user",
        "hr_service"
      ]
    }
  },
  {
    "name": "list_portals",
    "description": "List all Service Portal configurations available in the instance",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search portals by title or url_suffix"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_portal",
    "description": "Create a new Service Portal configuration (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "Human-readable portal title"
        },
        "url_suffix": {
          "type": "string",
          "description": "URL path segment for the portal (e.g. \"myportal\" → /myportal)"
        },
        "default_homepage": {
          "type": "string",
          "description": "sys_id of the default homepage sp_page record"
        },
        "theme": {
          "type": "string",
          "description": "sys_id of the sp_theme to apply"
        },
        "logo": {
          "type": "string",
          "description": "sys_id of the logo attachment record"
        },
        "description": {
          "type": "string",
          "description": "Short description of the portal"
        }
      },
      "required": [
        "title",
        "url_suffix"
      ]
    }
  },
  {
    "name": "create_portal_page",
    "description": "Create a new page inside a Service Portal (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "Page title"
        },
        "id": {
          "type": "string",
          "description": "Unique page ID used in the URL (e.g. \"my-page\")"
        },
        "portal_sys_id": {
          "type": "string",
          "description": "sys_id of the parent Service Portal"
        },
        "description": {
          "type": "string",
          "description": "Brief description of the page purpose"
        }
      },
      "required": [
        "title",
        "id",
        "portal_sys_id"
      ]
    }
  },
  {
    "name": "get_portal",
    "description": "Get full configuration details of a Service Portal by sys_id or URL suffix",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "Portal sys_id or url_suffix (e.g. \"sp\", \"itsm\")"
        }
      },
      "required": [
        "id"
      ]
    }
  },
  {
    "name": "list_portal_pages",
    "description": "List pages that belong to a Service Portal",
    "inputSchema": {
      "type": "object",
      "properties": {
        "portal_sys_id": {
          "type": "string",
          "description": "sys_id of the parent portal"
        },
        "query": {
          "type": "string",
          "description": "Filter pages by title or id"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": [
        "portal_sys_id"
      ]
    }
  },
  {
    "name": "get_portal_page",
    "description": "Get details of a specific Service Portal page including its layout",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Page sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_portal_widgets",
    "description": "List Service Portal widgets with optional search by name or category",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search widgets by name or description"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_portal_widget",
    "description": "Get full source code (HTML, CSS, client/server scripts) of a Service Portal widget",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id_or_sysid": {
          "type": "string",
          "description": "Widget sys_id or id field (e.g. \"widget-cool-clock\")"
        }
      },
      "required": [
        "id_or_sysid"
      ]
    }
  },
  {
    "name": "create_portal_widget",
    "description": "Create a new Service Portal widget with template, CSS, and scripts (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Human-readable widget name"
        },
        "id": {
          "type": "string",
          "description": "Unique widget ID/handle (e.g. \"my-custom-widget\")"
        },
        "template": {
          "type": "string",
          "description": "Angular HTML template"
        },
        "css": {
          "type": "string",
          "description": "SCSS/CSS styles"
        },
        "client_script": {
          "type": "string",
          "description": "Client-side controller JavaScript"
        },
        "server_script": {
          "type": "string",
          "description": "Server-side script (GlideRecord calls)"
        },
        "option_schema": {
          "type": "string",
          "description": "JSON array defining widget options"
        },
        "demo_data": {
          "type": "string",
          "description": "JSON object with demo data for preview"
        }
      },
      "required": [
        "name",
        "id"
      ]
    }
  },
  {
    "name": "update_portal_widget",
    "description": "Update an existing Service Portal widget's source code (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Widget sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update: template, css, client_script, server_script, name, etc."
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_widget_instances",
    "description": "List instances of a specific widget placed on portal pages",
    "inputSchema": {
      "type": "object",
      "properties": {
        "widget_sys_id": {
          "type": "string",
          "description": "Widget sys_id to find instances of"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": [
        "widget_sys_id"
      ]
    }
  },
  {
    "name": "list_ux_apps",
    "description": "List Next Experience (UI Builder) applications",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search apps by name"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_ux_app",
    "description": "Get configuration details of a Next Experience application",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id_or_name": {
          "type": "string",
          "description": "App sys_id or name"
        }
      },
      "required": [
        "sys_id_or_name"
      ]
    }
  },
  {
    "name": "list_ux_pages",
    "description": "List pages within a Next Experience (UI Builder) application",
    "inputSchema": {
      "type": "object",
      "properties": {
        "app_sys_id": {
          "type": "string",
          "description": "Parent UX app sys_id"
        },
        "query": {
          "type": "string",
          "description": "Filter pages by name"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": [
        "app_sys_id"
      ]
    }
  },
  {
    "name": "list_portal_themes",
    "description": "List Service Portal themes (color palettes, CSS variables)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_portal_theme",
    "description": "Get full details of a Service Portal theme including CSS variables",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Theme sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_rest_messages",
    "description": "List outbound REST Message configurations (integrations with external APIs)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search by name or description"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_rest_message",
    "description": "Get full configuration of an outbound REST Message including its endpoints",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id_or_name": {
          "type": "string",
          "description": "REST Message sys_id or name"
        }
      },
      "required": [
        "sys_id_or_name"
      ]
    }
  },
  {
    "name": "list_rest_message_functions",
    "description": "List HTTP methods (functions) defined within a REST Message",
    "inputSchema": {
      "type": "object",
      "properties": {
        "rest_message_sys_id": {
          "type": "string",
          "description": "Parent REST Message sys_id"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": [
        "rest_message_sys_id"
      ]
    }
  },
  {
    "name": "create_rest_message",
    "description": "Create a new outbound REST Message definition (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Unique REST Message name"
        },
        "endpoint": {
          "type": "string",
          "description": "Base URL endpoint (e.g. \"https://api.example.com/v1\")"
        },
        "description": {
          "type": "string",
          "description": "Purpose/description of this integration"
        },
        "use_mutual_auth": {
          "type": "boolean",
          "description": "Whether to use mutual TLS authentication"
        },
        "authentication_type": {
          "type": "string",
          "description": "Auth type: \"no_authentication\", \"basic\", \"oauth2\""
        }
      },
      "required": [
        "name",
        "endpoint"
      ]
    }
  },
  {
    "name": "list_transform_maps",
    "description": "List Transform Maps used for importing data into ServiceNow tables",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search by name or target table"
        },
        "target_table": {
          "type": "string",
          "description": "Filter by target table name (e.g. \"incident\")"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_transform_map",
    "description": "Get details of a Transform Map including its field mappings",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id_or_name": {
          "type": "string",
          "description": "Transform Map sys_id or name"
        }
      },
      "required": [
        "sys_id_or_name"
      ]
    }
  },
  {
    "name": "run_transform_map",
    "description": "Execute a Transform Map on an Import Set to load data (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "transform_map_sys_id": {
          "type": "string",
          "description": "sys_id of the Transform Map to run"
        },
        "import_set_sys_id": {
          "type": "string",
          "description": "sys_id of the Import Set containing source data"
        }
      },
      "required": [
        "transform_map_sys_id",
        "import_set_sys_id"
      ]
    }
  },
  {
    "name": "list_transform_field_maps",
    "description": "List field-level mappings within a Transform Map",
    "inputSchema": {
      "type": "object",
      "properties": {
        "transform_map_sys_id": {
          "type": "string",
          "description": "Parent Transform Map sys_id"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": [
        "transform_map_sys_id"
      ]
    }
  },
  {
    "name": "list_import_sets",
    "description": "List Import Sets with optional filter by state or staging table",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "Filter by state: loaded, partial, transform_failed, complete"
        },
        "query": {
          "type": "string",
          "description": "Additional encoded query string"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_import_set",
    "description": "Get details of a specific Import Set including row count and transform status",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Import Set sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_import_set_row",
    "description": "Insert a row into an Import Set staging table for later transformation (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "staging_table": {
          "type": "string",
          "description": "Staging table name (e.g. \"u_import_incident\"). Must already exist."
        },
        "data": {
          "type": "object",
          "description": "Key-value pairs for the staging table row"
        }
      },
      "required": [
        "staging_table",
        "data"
      ]
    }
  },
  {
    "name": "list_data_sources",
    "description": "List Import Set data source definitions (file/JDBC/REST loaders)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search by name"
        },
        "type": {
          "type": "string",
          "description": "Filter by type: file, jdbc, ldap, rest"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_event_registry",
    "description": "List registered event definitions in the ServiceNow event registry",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search events by name or description"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_event_registry_entry",
    "description": "Get details of a specific registered event definition",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name_or_sysid": {
          "type": "string",
          "description": "Event name (e.g. \"incident.created\") or sys_id"
        }
      },
      "required": [
        "name_or_sysid"
      ]
    }
  },
  {
    "name": "register_event",
    "description": "Register a new custom event in the event registry (requires SCRIPTING_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Unique event name (e.g. \"my_app.record_created\")"
        },
        "description": {
          "type": "string",
          "description": "Description of when this event fires"
        },
        "table": {
          "type": "string",
          "description": "Table that fires this event (e.g. \"incident\")"
        }
      },
      "required": [
        "name",
        "table"
      ]
    }
  },
  {
    "name": "fire_event",
    "description": "Fire a custom ServiceNow event for a specific record (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "event_name": {
          "type": "string",
          "description": "Event name to fire (must be registered)"
        },
        "table": {
          "type": "string",
          "description": "Table name of the target record"
        },
        "record_sys_id": {
          "type": "string",
          "description": "sys_id of the record to fire the event on"
        },
        "parm1": {
          "type": "string",
          "description": "Optional first parameter passed to event handlers"
        },
        "parm2": {
          "type": "string",
          "description": "Optional second parameter passed to event handlers"
        }
      },
      "required": [
        "event_name",
        "table",
        "record_sys_id"
      ]
    }
  },
  {
    "name": "list_event_log",
    "description": "List recent event log entries (fired events and their processing status)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "event_name": {
          "type": "string",
          "description": "Filter by event name"
        },
        "state": {
          "type": "string",
          "description": "Filter by state: ready, processing, processed, error, transferred"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_oauth_applications",
    "description": "List OAuth application registry entries (client applications that can authenticate)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search by name or client ID"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_credential_aliases",
    "description": "List connection and credential aliases used by integrations",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search by name"
        },
        "type": {
          "type": "string",
          "description": "Filter by type: basic, oauth2, api_key, certificate"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_notifications",
    "description": "List email notification definitions (sysevent_email_action)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search notifications by name"
        },
        "table": {
          "type": "string",
          "description": "Filter by target table (e.g. \"incident\")"
        },
        "event": {
          "type": "string",
          "description": "Filter by event trigger name"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active notifications only"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_notification",
    "description": "Get full details of an email notification definition including template and conditions",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id_or_name": {
          "type": "string",
          "description": "Notification sys_id or name"
        }
      },
      "required": [
        "sys_id_or_name"
      ]
    }
  },
  {
    "name": "create_notification",
    "description": "Create a new email notification definition (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Notification name"
        },
        "table": {
          "type": "string",
          "description": "Table that triggers this notification (e.g. \"incident\")"
        },
        "event": {
          "type": "string",
          "description": "Event name that fires this notification (e.g. \"incident.commented\")"
        },
        "subject": {
          "type": "string",
          "description": "Email subject line (supports ${field} variables)"
        },
        "message_html": {
          "type": "string",
          "description": "HTML body of the email notification"
        },
        "recipients": {
          "type": "string",
          "description": "Who receives the email (e.g. \"assigned_to\", \"watch_list\")"
        },
        "active": {
          "type": "boolean",
          "description": "Whether to activate immediately (default true)"
        },
        "condition": {
          "type": "string",
          "description": "Additional filter condition script"
        }
      },
      "required": [
        "name",
        "table"
      ]
    }
  },
  {
    "name": "update_notification",
    "description": "Update an existing email notification (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Notification sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update: name, subject, message_html, active, condition, etc."
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "list_email_logs",
    "description": "List outbound email log entries to track sent/failed emails",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "Filter by state: sent, failed, ready, sending, ignored"
        },
        "recipient": {
          "type": "string",
          "description": "Filter by recipient email address"
        },
        "subject": {
          "type": "string",
          "description": "Filter emails by subject (partial match)"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_email_log",
    "description": "Get full details of an email log entry including body and headers",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Email log sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_attachments",
    "description": "List attachments associated with a specific record",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name (e.g. \"incident\")"
        },
        "record_sys_id": {
          "type": "string",
          "description": "sys_id of the record whose attachments to list"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": [
        "table",
        "record_sys_id"
      ]
    }
  },
  {
    "name": "get_attachment_metadata",
    "description": "Get metadata (name, type, size) of a specific attachment by its sys_id",
    "inputSchema": {
      "type": "object",
      "properties": {
        "attachment_sys_id": {
          "type": "string",
          "description": "Attachment sys_id"
        }
      },
      "required": [
        "attachment_sys_id"
      ]
    }
  },
  {
    "name": "delete_attachment",
    "description": "Delete an attachment from a record (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "attachment_sys_id": {
          "type": "string",
          "description": "sys_id of the attachment to delete"
        }
      },
      "required": [
        "attachment_sys_id"
      ]
    }
  },
  {
    "name": "upload_attachment",
    "description": "Upload a base64-encoded attachment to a ServiceNow record (requires WRITE_ENABLED=true). Useful for adding files, screenshots, or documents to incidents, changes, etc.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name (e.g. \"incident\")"
        },
        "record_sys_id": {
          "type": "string",
          "description": "sys_id of the record to attach the file to"
        },
        "file_name": {
          "type": "string",
          "description": "File name including extension (e.g. \"screenshot.png\")"
        },
        "content_type": {
          "type": "string",
          "description": "MIME type (e.g. \"image/png\", \"application/pdf\", \"text/plain\", \"application/json\")"
        },
        "content_base64": {
          "type": "string",
          "description": "Base64-encoded file content (use standard base64 encoding)"
        }
      },
      "required": [
        "table",
        "record_sys_id",
        "file_name",
        "content_type",
        "content_base64"
      ]
    }
  },
  {
    "name": "list_email_templates",
    "description": "List email notification templates used by notifications",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search templates by name"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_notification_subscriptions",
    "description": "List user subscriptions to notifications (who has opted in/out)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user_sys_id": {
          "type": "string",
          "description": "User sys_id to list their subscriptions"
        },
        "notification_sys_id": {
          "type": "string",
          "description": "Filter by specific notification"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "send_emergency_broadcast",
    "description": "[Write] Send emergency broadcast notification to users or groups",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subject": {
          "type": "string",
          "description": "Broadcast subject"
        },
        "body": {
          "type": "string",
          "description": "Message body"
        },
        "recipients": {
          "type": "string",
          "description": "Comma-separated user/group sys_ids"
        },
        "channels": {
          "type": "string",
          "description": "Delivery channels: email,sms,push"
        }
      },
      "required": [
        "subject",
        "body",
        "recipients"
      ]
    }
  },
  {
    "name": "schedule_notification",
    "description": "[Write] Schedule a notification for future delivery",
    "inputSchema": {
      "type": "object",
      "properties": {
        "notification_id": {
          "type": "string",
          "description": "Notification rule sys_id"
        },
        "schedule": {
          "type": "string",
          "description": "Cron expression or ISO date"
        },
        "active": {
          "type": "boolean",
          "description": "Whether the notification is active"
        }
      },
      "required": [
        "notification_id",
        "schedule"
      ]
    }
  },
  {
    "name": "list_pa_indicators",
    "description": "List Performance Analytics (PA) indicators (KPIs) available in the instance",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search indicators by name or description"
        },
        "category": {
          "type": "string",
          "description": "Filter by indicator category"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active indicators only (default true)"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_pa_indicator",
    "description": "Get details of a specific Performance Analytics indicator including its formula",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id_or_name": {
          "type": "string",
          "description": "Indicator sys_id or name"
        }
      },
      "required": [
        "sys_id_or_name"
      ]
    }
  },
  {
    "name": "get_pa_scorecard",
    "description": "Get current scorecard data for a PA indicator — returns current value, target, trend direction",
    "inputSchema": {
      "type": "object",
      "properties": {
        "indicator_sys_id": {
          "type": "string",
          "description": "PA indicator sys_id"
        },
        "breakdown_sys_id": {
          "type": "string",
          "description": "Optional breakdown (dimension) sys_id to segment data by group"
        },
        "period": {
          "type": "string",
          "description": "Time period: last_7_days, last_30_days, last_quarter, last_year (default: last_30_days)"
        },
        "include_scores": {
          "type": "boolean",
          "description": "Include individual score records (default false)"
        }
      },
      "required": [
        "indicator_sys_id"
      ]
    }
  },
  {
    "name": "get_pa_time_series",
    "description": "Get historical time-series data for a PA indicator to identify trends",
    "inputSchema": {
      "type": "object",
      "properties": {
        "indicator_sys_id": {
          "type": "string",
          "description": "PA indicator sys_id"
        },
        "start_date": {
          "type": "string",
          "description": "Start date in YYYY-MM-DD format (default: 30 days ago)"
        },
        "end_date": {
          "type": "string",
          "description": "End date in YYYY-MM-DD format (default: today)"
        },
        "limit": {
          "type": "number",
          "description": "Max data points to return (default 100)"
        }
      },
      "required": [
        "indicator_sys_id"
      ]
    }
  },
  {
    "name": "list_pa_breakdowns",
    "description": "List PA breakdowns (dimensions) available for segmenting indicator data",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search breakdowns by name"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_pa_dashboards",
    "description": "List Performance Analytics dashboards",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search dashboards by name"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_pa_dashboard",
    "description": "Get details of a PA dashboard including its widgets/tabs",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id_or_name": {
          "type": "string",
          "description": "Dashboard sys_id or name"
        }
      },
      "required": [
        "sys_id_or_name"
      ]
    }
  },
  {
    "name": "list_homepages",
    "description": "List homepage dashboards (CMS content pages used as homepages)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search by title"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_pa_jobs",
    "description": "List Performance Analytics data collection jobs and their schedules",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active": {
          "type": "boolean",
          "description": "Filter to active jobs only (default true)"
        },
        "query": {
          "type": "string",
          "description": "Search by name"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_pa_job",
    "description": "Get details of a Performance Analytics collection job",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "PA job sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_dashboard",
    "description": "Create a new Performance Analytics dashboard (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Dashboard name"
        },
        "description": {
          "type": "string",
          "description": "Brief description of the dashboard"
        },
        "roles": {
          "type": "string",
          "description": "Comma-separated roles that can view this dashboard (leave blank for all)"
        },
        "active": {
          "type": "boolean",
          "description": "Activate the dashboard immediately (default: true)"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "update_dashboard",
    "description": "Update an existing PA dashboard (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Dashboard sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update (name, description, roles, active, etc.)"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "create_pa_indicator",
    "description": "Create a Performance Analytics (PA) indicator / KPI on `pa_indicators` (requires WRITE_ENABLED=true). Define the source facts table, aggregation and conditions; collect data via a PA job afterward.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Indicator name (e.g. \"Open P1 incidents\")"
        },
        "description": {
          "type": "string",
          "description": "What the indicator measures"
        },
        "facts_table": {
          "type": "string",
          "description": "Source/facts table the indicator counts (e.g. \"incident\")"
        },
        "aggregate": {
          "type": "string",
          "description": "Aggregation function",
          "enum": [
            "count",
            "sum",
            "average",
            "maximum",
            "minimum"
          ]
        },
        "field": {
          "type": "string",
          "description": "Field to aggregate (required for sum/average/max/min; ignored for count)"
        },
        "conditions": {
          "type": "string",
          "description": "Encoded query on the facts table (e.g. \"active=true^priority=1\")"
        },
        "unit": {
          "type": "string",
          "description": "Unit (pa_units name or sys_id)"
        },
        "direction": {
          "type": "string",
          "description": "Desired trend",
          "enum": [
            "maximize",
            "minimize"
          ]
        },
        "active": {
          "type": "boolean",
          "description": "Activate immediately (default: true)"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "create_pa_breakdown",
    "description": "Create a Performance Analytics (PA) breakdown on `pa_breakdowns` (requires WRITE_ENABLED=true). Breakdowns slice an indicator by a dimension (e.g. by Assignment group or Category).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Breakdown name (e.g. \"By Assignment group\")"
        },
        "description": {
          "type": "string",
          "description": "What this breakdown slices by"
        },
        "related_field": {
          "type": "string",
          "description": "Optional dotted field path the breakdown maps to (e.g. \"assignment_group\")"
        },
        "active": {
          "type": "boolean",
          "description": "Activate immediately (default: true)"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "check_table_completeness",
    "description": "Analyze data quality and field completeness for a ServiceNow table — returns percentage of non-empty values per field",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name to analyze (e.g. \"incident\", \"cmdb_ci_server\")"
        },
        "fields": {
          "type": "string",
          "description": "Comma-separated field names to check (e.g. \"assigned_to,priority,category\")"
        },
        "query": {
          "type": "string",
          "description": "Optional encoded query to scope the analysis (e.g. \"active=true\")"
        },
        "sample_size": {
          "type": "number",
          "description": "Number of records to sample (default 100, max 500)"
        }
      },
      "required": [
        "table",
        "fields"
      ]
    }
  },
  {
    "name": "get_table_record_count",
    "description": "Get total record count for a ServiceNow table with optional filters",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name"
        },
        "query": {
          "type": "string",
          "description": "Optional encoded query to count a subset"
        }
      },
      "required": [
        "table"
      ]
    }
  },
  {
    "name": "compare_record_counts",
    "description": "Compare record counts across multiple ServiceNow tables or time periods — useful for capacity planning",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tables": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "List of table names to compare (e.g. [\"incident\", \"change_request\", \"problem\"])"
        },
        "query": {
          "type": "string",
          "description": "Optional query to apply to all tables"
        }
      },
      "required": [
        "tables"
      ]
    }
  },
  {
    "name": "get_system_property",
    "description": "Get a ServiceNow system property value and metadata by name",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Property name (e.g. \"glide.smtp.host\")"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "set_system_property",
    "description": "Create or update a ServiceNow system property value. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Property name"
        },
        "value": {
          "type": "string",
          "description": "Property value"
        },
        "description": {
          "type": "string",
          "description": "Optional description"
        },
        "type": {
          "type": "string",
          "description": "Property type: string, integer, boolean, choice, password2, etc."
        }
      },
      "required": [
        "name",
        "value"
      ]
    }
  },
  {
    "name": "list_system_properties",
    "description": "List system properties with optional filtering",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Encoded query to filter properties"
        },
        "category": {
          "type": "string",
          "description": "Filter by category (e.g. \"email\", \"security\")"
        },
        "type": {
          "type": "string",
          "description": "Filter by type (e.g. \"boolean\", \"string\")"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "delete_system_property",
    "description": "Delete a system property by name. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Property name to delete"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "search_system_properties",
    "description": "Search system properties by name, value, or description",
    "inputSchema": {
      "type": "object",
      "properties": {
        "search": {
          "type": "string",
          "description": "Search text matched against name, value, and description"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default 20)"
        }
      },
      "required": [
        "search"
      ]
    }
  },
  {
    "name": "bulk_get_properties",
    "description": "Retrieve multiple system property values in a single call",
    "inputSchema": {
      "type": "object",
      "properties": {
        "names": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Array of property names to retrieve"
        }
      },
      "required": [
        "names"
      ]
    }
  },
  {
    "name": "bulk_set_properties",
    "description": "Create or update multiple system properties in a single operation. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "properties": {
          "type": "array",
          "description": "Array of {name, value, description?} objects",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "value": {
                "type": "string"
              },
              "description": {
                "type": "string"
              }
            },
            "required": [
              "name",
              "value"
            ]
          }
        }
      },
      "required": [
        "properties"
      ]
    }
  },
  {
    "name": "export_properties",
    "description": "Export system properties matching a query to a JSON object (useful for environment snapshots)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string",
          "description": "Filter by category"
        },
        "query": {
          "type": "string",
          "description": "Encoded query filter"
        }
      },
      "required": []
    }
  },
  {
    "name": "import_properties",
    "description": "Import (create or update) system properties from a JSON object. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "properties": {
          "type": "object",
          "description": "Key-value map of property names to values (e.g. {\"glide.smtp.host\": \"smtp.example.com\"})"
        },
        "dry_run": {
          "type": "boolean",
          "description": "If true, show what would be changed without writing (default false)"
        }
      },
      "required": [
        "properties"
      ]
    }
  },
  {
    "name": "validate_property",
    "description": "Validate a property value against its declared type constraints without saving",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Property name"
        },
        "value": {
          "type": "string",
          "description": "Value to validate"
        }
      },
      "required": [
        "name",
        "value"
      ]
    }
  },
  {
    "name": "list_property_categories",
    "description": "List all unique property categories with their record counts",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    }
  },
  {
    "name": "get_property_history",
    "description": "Get audit history of changes to a system property",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Property name"
        },
        "limit": {
          "type": "number",
          "description": "Max audit records (default 20)"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "get_current_update_set",
    "description": "Get the currently active Update Set for the session",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    }
  },
  {
    "name": "list_update_sets",
    "description": "List Update Sets by state (in progress, complete, ignore)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "description": "State filter: \"in progress\", \"complete\", \"ignore\""
        },
        "query": {
          "type": "string",
          "description": "Additional encoded query filter"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_update_set",
    "description": "Create a new Update Set and optionally switch to it. **[Scripting]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Update Set name"
        },
        "description": {
          "type": "string",
          "description": "Purpose or description"
        },
        "release": {
          "type": "string",
          "description": "Target release label"
        },
        "switch_to": {
          "type": "boolean",
          "description": "Switch to this Update Set after creation (default true)"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "switch_update_set",
    "description": "Switch the active Update Set context to a specified Update Set. **[Scripting]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "sys_id of the target Update Set"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "complete_update_set",
    "description": "Mark an Update Set as complete (ready for migration). **[Scripting]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Update Set sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "preview_update_set",
    "description": "Preview all changes contained in an Update Set",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Update Set sys_id"
        },
        "limit": {
          "type": "number",
          "description": "Max records to list (default 100)"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "export_update_set",
    "description": "Get the XML export payload for an Update Set (as used in migration). **[Scripting]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Update Set sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "ensure_active_update_set",
    "description": "Ensure an active Update Set exists; create one automatically if none is in progress. **[Scripting]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "default_name": {
          "type": "string",
          "description": "Name to use when auto-creating (default: \"AI Session Update Set\")"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_va_topic",
    "description": "Create a new Virtual Agent conversation topic. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Topic name (display name)"
        },
        "description": {
          "type": "string",
          "description": "What this topic handles"
        },
        "category": {
          "type": "string",
          "description": "Topic category sys_id"
        },
        "active": {
          "type": "boolean",
          "description": "Activate immediately (default true)"
        },
        "fulfillment_type": {
          "type": "string",
          "description": "Fulfillment type: \"itsm_integration\", \"custom\", \"web_service\""
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "update_va_topic",
    "description": "Update a Virtual Agent topic properties. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Topic sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update (name, description, active, etc.)"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "get_va_topic",
    "description": "Get Virtual Agent topic details including intent and trigger phrases",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Topic sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_va_topics_full",
    "description": "List all Virtual Agent topics with category and status details",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active": {
          "type": "boolean",
          "description": "Filter to active topics only (default true)"
        },
        "category": {
          "type": "string",
          "description": "Filter by category name"
        },
        "query": {
          "type": "string",
          "description": "Additional encoded query"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_va_conversation",
    "description": "Get conversation history for a Virtual Agent session",
    "inputSchema": {
      "type": "object",
      "properties": {
        "conversation_id": {
          "type": "string",
          "description": "Conversation sys_id or session ID"
        },
        "limit": {
          "type": "number",
          "description": "Max messages (default 50)"
        }
      },
      "required": [
        "conversation_id"
      ]
    }
  },
  {
    "name": "list_va_conversations",
    "description": "List recent Virtual Agent conversations",
    "inputSchema": {
      "type": "object",
      "properties": {
        "topic_sys_id": {
          "type": "string",
          "description": "Filter by topic"
        },
        "user_sys_id": {
          "type": "string",
          "description": "Filter by user"
        },
        "limit": {
          "type": "number",
          "description": "Max results (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_va_categories",
    "description": "List Virtual Agent topic categories",
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "number",
          "description": "Max results (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_assets",
    "description": "List IT assets with optional filtering by state, class, or assigned user",
    "inputSchema": {
      "type": "object",
      "properties": {
        "asset_class": {
          "type": "string",
          "description": "Asset class: \"alm_hardware\", \"alm_license\", \"alm_consumable\""
        },
        "state": {
          "type": "string",
          "description": "Asset state: \"in_use\", \"in_stock\", \"retired\", \"missing\""
        },
        "assigned_to": {
          "type": "string",
          "description": "User sys_id to filter by assignee"
        },
        "location": {
          "type": "string",
          "description": "Location name or sys_id"
        },
        "query": {
          "type": "string",
          "description": "Additional encoded query"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_asset",
    "description": "Get full details of an IT asset including financial and lifecycle data",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Asset sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_asset",
    "description": "Create a new IT asset record. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "display_name": {
          "type": "string",
          "description": "Asset display name"
        },
        "asset_tag": {
          "type": "string",
          "description": "Unique asset tag"
        },
        "model_category": {
          "type": "string",
          "description": "Category sys_id (Hardware, Software, etc.)"
        },
        "model": {
          "type": "string",
          "description": "Model sys_id"
        },
        "serial_number": {
          "type": "string",
          "description": "Serial number"
        },
        "assigned_to": {
          "type": "string",
          "description": "User sys_id"
        },
        "location": {
          "type": "string",
          "description": "Location sys_id"
        },
        "cost": {
          "type": "number",
          "description": "Purchase cost"
        },
        "cost_center": {
          "type": "string",
          "description": "Cost center sys_id"
        },
        "purchase_date": {
          "type": "string",
          "description": "Purchase date (YYYY-MM-DD)"
        }
      },
      "required": [
        "display_name"
      ]
    }
  },
  {
    "name": "update_asset",
    "description": "Update an IT asset record. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Asset sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "retire_asset",
    "description": "Retire an IT asset (mark as disposed/retired). **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Asset sys_id"
        },
        "disposal_reason": {
          "type": "string",
          "description": "Reason for retirement"
        },
        "disposal_date": {
          "type": "string",
          "description": "Disposal date (YYYY-MM-DD)"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_software_licenses",
    "description": "List software license records with compliance status",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Encoded query filter"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_license_compliance",
    "description": "Get license compliance summary — purchased vs. installed vs. in use counts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "license_sys_id": {
          "type": "string",
          "description": "Software license sys_id (optional — omit for all)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_asset_contracts",
    "description": "List asset maintenance and support contracts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "asset_sys_id": {
          "type": "string",
          "description": "Filter by linked asset"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active contracts (default true)"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "track_asset_lifecycle",
    "description": "Track asset lifecycle events and stage transitions",
    "inputSchema": {
      "type": "object",
      "properties": {
        "asset_id": {
          "type": "string",
          "description": "Asset tag or sys_id"
        },
        "new_stage": {
          "type": "string",
          "description": "Lifecycle stage: in_stock/in_use/in_maintenance/retired/disposed"
        },
        "notes": {
          "type": "string",
          "description": "Transition notes"
        }
      },
      "required": [
        "asset_id",
        "new_stage"
      ]
    }
  },
  {
    "name": "get_license_optimization",
    "description": "Analyze software license usage and recommend optimizations",
    "inputSchema": {
      "type": "object",
      "properties": {
        "software_name": {
          "type": "string",
          "description": "Optional filter by software name"
        },
        "threshold_pct": {
          "type": "number",
          "description": "Usage threshold percentage (default: 80)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_devops_pipelines",
    "description": "List DevOps pipeline configurations registered in ServiceNow",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active": {
          "type": "boolean",
          "description": "Filter to active pipelines (default true)"
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_devops_pipeline",
    "description": "Get details of a specific DevOps pipeline",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Pipeline sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_deployments",
    "description": "List recent application deployments tracked in ServiceNow",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pipeline_sys_id": {
          "type": "string",
          "description": "Filter by pipeline"
        },
        "environment": {
          "type": "string",
          "description": "Filter by environment (e.g. \"prod\", \"staging\")"
        },
        "state": {
          "type": "string",
          "description": "Filter by state: \"success\", \"failed\", \"in_progress\""
        },
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_deployment",
    "description": "Get details and status of a specific deployment",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Deployment sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_devops_change",
    "description": "Create a change request linked to a DevOps deployment for change governance. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Change short description"
        },
        "pipeline": {
          "type": "string",
          "description": "Pipeline name or sys_id"
        },
        "environment": {
          "type": "string",
          "description": "Target environment (prod, staging, dev)"
        },
        "artifact": {
          "type": "string",
          "description": "Artifact name or version being deployed"
        },
        "type": {
          "type": "string",
          "description": "Change type: normal, standard, emergency"
        },
        "assigned_to": {
          "type": "string",
          "description": "User sys_id"
        },
        "assignment_group": {
          "type": "string",
          "description": "Group sys_id"
        }
      },
      "required": [
        "short_description",
        "environment"
      ]
    }
  },
  {
    "name": "track_deployment",
    "description": "Record a deployment event in ServiceNow for audit and velocity tracking. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pipeline": {
          "type": "string",
          "description": "Pipeline sys_id or name"
        },
        "environment": {
          "type": "string",
          "description": "Target environment"
        },
        "artifact_name": {
          "type": "string",
          "description": "Artifact or application name"
        },
        "artifact_version": {
          "type": "string",
          "description": "Version or build number"
        },
        "status": {
          "type": "string",
          "description": "Deployment status: success, failed, rolled_back"
        },
        "notes": {
          "type": "string",
          "description": "Deployment notes"
        }
      },
      "required": [
        "environment",
        "artifact_name",
        "status"
      ]
    }
  },
  {
    "name": "get_devops_insights",
    "description": "Get deployment frequency, failure rate, and lead time metrics for a pipeline",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pipeline_sys_id": {
          "type": "string",
          "description": "Pipeline sys_id (optional — all pipelines if omitted)"
        },
        "days": {
          "type": "number",
          "description": "Number of days to analyse (default 30)"
        }
      },
      "required": []
    }
  },
  {
    "name": "list_scoped_apps",
    "description": "List scoped applications (custom apps) installed in the instance",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search apps by name or scope prefix"
        },
        "active": {
          "type": "boolean",
          "description": "Filter to active apps only"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_scoped_app",
    "description": "Get full details of a scoped application by sys_id or scope name",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "App sys_id or scope name (e.g. \"x_myco_myapp\")"
        }
      },
      "required": [
        "id"
      ]
    }
  },
  {
    "name": "create_scoped_app",
    "description": "Create a new scoped application in App Studio (requires WRITE_ENABLED=true). The scope prefix must be unique and follow the pattern x_<vendor>_<appname>.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Human-readable application name"
        },
        "scope": {
          "type": "string",
          "description": "Unique scope prefix, e.g. \"x_myco_myapp\". Must start with \"x_\"."
        },
        "version": {
          "type": "string",
          "description": "Application version string (e.g. \"1.0.0\"). Defaults to \"1.0.0\"."
        },
        "short_description": {
          "type": "string",
          "description": "Short description shown in the app list"
        },
        "description": {
          "type": "string",
          "description": "Full description of the application"
        },
        "vendor": {
          "type": "string",
          "description": "Vendor or author name"
        },
        "active": {
          "type": "boolean",
          "description": "Activate the app immediately (default: true)"
        },
        "logo": {
          "type": "string",
          "description": "App logo attachment sys_id (optional)"
        }
      },
      "required": [
        "name",
        "scope"
      ]
    }
  },
  {
    "name": "update_scoped_app",
    "description": "Update an existing scoped application (requires WRITE_ENABLED=true)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "App sys_id"
        },
        "fields": {
          "type": "object",
          "description": "Fields to update (name, version, short_description, description, active, vendor, etc.)"
        }
      },
      "required": [
        "sys_id",
        "fields"
      ]
    }
  },
  {
    "name": "ml_predict_change_risk",
    "description": "Predict the risk level of a change request using historical ML analysis",
    "inputSchema": {
      "type": "object",
      "properties": {
        "change_sys_id": {
          "type": "string",
          "description": "Change request sys_id to evaluate"
        },
        "type": {
          "type": "string",
          "description": "Change type: normal, standard, emergency"
        },
        "category": {
          "type": "string",
          "description": "Change category"
        }
      },
      "required": []
    }
  },
  {
    "name": "ml_detect_anomalies",
    "description": "Run anomaly detection on operational metrics (alert volume, incident trends, etc.)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table to analyze (e.g. incident, sn_agent_alert)"
        },
        "field": {
          "type": "string",
          "description": "Numeric field to analyse (e.g. priority, reassignment_count)"
        },
        "days": {
          "type": "number",
          "description": "Look-back period in days (default 30)"
        },
        "threshold": {
          "type": "number",
          "description": "Standard deviations for anomaly threshold (default 2)"
        }
      },
      "required": [
        "table",
        "field"
      ]
    }
  },
  {
    "name": "ml_forecast_incidents",
    "description": "Forecast incident volume for the next N days based on historical trends",
    "inputSchema": {
      "type": "object",
      "properties": {
        "days_ahead": {
          "type": "number",
          "description": "Number of days to forecast (default 7)"
        },
        "category": {
          "type": "string",
          "description": "Filter by category (optional)"
        },
        "priority": {
          "type": "string",
          "description": "Filter by priority (optional)"
        }
      },
      "required": []
    }
  },
  {
    "name": "ml_train_incident_classifier",
    "description": "Trigger training of the incident classification ML solution. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "solution_name": {
          "type": "string",
          "description": "ML solution name (default auto-detect)"
        }
      },
      "required": []
    }
  },
  {
    "name": "ml_train_change_risk",
    "description": "Trigger training of the change risk prediction ML model. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "solution_name": {
          "type": "string",
          "description": "ML solution name (default auto-detect)"
        }
      },
      "required": []
    }
  },
  {
    "name": "ml_train_anomaly_detector",
    "description": "Trigger training of an anomaly detection model for a specific table/field. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Target table for anomaly detection"
        },
        "field": {
          "type": "string",
          "description": "Numeric field to train on"
        }
      },
      "required": [
        "table",
        "field"
      ]
    }
  },
  {
    "name": "ml_evaluate_model",
    "description": "Get accuracy, training status, and metrics for a trained ML solution",
    "inputSchema": {
      "type": "object",
      "properties": {
        "model_sys_id": {
          "type": "string",
          "description": "ML solution sys_id"
        }
      },
      "required": [
        "model_sys_id"
      ]
    }
  },
  {
    "name": "ml_model_training_history",
    "description": "Get training run history and accuracy trends for an ML solution over time",
    "inputSchema": {
      "type": "object",
      "properties": {
        "model_sys_id": {
          "type": "string",
          "description": "ML solution sys_id"
        },
        "days": {
          "type": "number",
          "description": "Look-back period (default 90)"
        }
      },
      "required": [
        "model_sys_id"
      ]
    }
  },
  {
    "name": "ml_virtual_agent_nlu",
    "description": "Analyse Virtual Agent NLU performance — conversation completion rates and fallback metrics",
    "inputSchema": {
      "type": "object",
      "properties": {
        "topic_sys_id": {
          "type": "string",
          "description": "VA topic sys_id (optional, all topics if omitted)"
        },
        "days": {
          "type": "number",
          "description": "Analysis period in days (default 30)"
        }
      },
      "required": []
    }
  },
  {
    "name": "ml_process_optimization",
    "description": "Identify process bottlenecks using analysis of task durations and reassignment patterns",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Process table to analyse (e.g. incident, change_request, sc_task)"
        },
        "days": {
          "type": "number",
          "description": "Analysis period (default 90)"
        }
      },
      "required": [
        "table"
      ]
    }
  },
  {
    "name": "ml_similar_incidents",
    "description": "Find similar past incidents using keyword-based matching. Provide either an incident sys_id (to find similar incidents) or a short_description (for free-text matching). Returns resolved incidents ranked by keyword match count.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "incident_sys_id": {
          "type": "string",
          "description": "Sys_id of an existing incident to find similar ones for"
        },
        "short_description": {
          "type": "string",
          "description": "Free-text description to match against (required if no sys_id)"
        },
        "limit": {
          "type": "number",
          "description": "Max results to return (default 10)"
        }
      },
      "required": []
    }
  },
  {
    "name": "ml_auto_categorize",
    "description": "Auto-categorize a record based on its description by analysing resolved records of the same table. Queries the last 500 resolved records, groups by category, and matches input keywords to suggest a category.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "short_description": {
          "type": "string",
          "description": "Short description of the record to categorize"
        },
        "description": {
          "type": "string",
          "description": "Full description (optional, improves accuracy)"
        },
        "table": {
          "type": "string",
          "description": "Table to analyse (default \"incident\")"
        }
      },
      "required": [
        "short_description"
      ]
    }
  },
  {
    "name": "list_uib_pages",
    "description": "List UI Builder pages and their route configurations",
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "number",
          "description": "Max records (default 25)"
        },
        "app": {
          "type": "string",
          "description": "Filter by UX app sys_id"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_uib_page",
    "description": "Get details of a specific UI Builder page including layout and child elements",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "UIB page sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_uib_page",
    "description": "Create a new UI Builder page with route registration. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "Page title"
        },
        "path": {
          "type": "string",
          "description": "URL path segment"
        },
        "app": {
          "type": "string",
          "description": "Parent UX app sys_id"
        },
        "layout": {
          "type": "string",
          "description": "Layout type: single, sidebar, tabbed (default single)"
        }
      },
      "required": [
        "title",
        "path"
      ]
    }
  },
  {
    "name": "update_uib_page",
    "description": "Update an existing UI Builder page. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "UIB page sys_id"
        },
        "title": {
          "type": "string"
        },
        "path": {
          "type": "string"
        },
        "layout": {
          "type": "string"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "delete_uib_page",
    "description": "Delete a UI Builder page. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "UIB page sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_uib_components",
    "description": "List available UI Builder components (macroponents) in the instance",
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "number",
          "description": "Max records (default 50)"
        },
        "scope": {
          "type": "string",
          "description": "Filter by scope/app"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_uib_component",
    "description": "Create a custom UI Builder component (macroponent). **[Scripting]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Component name"
        },
        "label": {
          "type": "string",
          "description": "Display label"
        },
        "description": {
          "type": "string"
        },
        "category": {
          "type": "string",
          "description": "Component category"
        }
      },
      "required": [
        "name",
        "label"
      ]
    }
  },
  {
    "name": "update_uib_component",
    "description": "Update a UI Builder component. **[Scripting]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Component sys_id"
        },
        "label": {
          "type": "string"
        },
        "description": {
          "type": "string"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "list_uib_data_brokers",
    "description": "List UI Builder data brokers (data sources for pages)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page_sys_id": {
          "type": "string",
          "description": "Filter by page"
        },
        "limit": {
          "type": "number"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_uib_data_broker",
    "description": "Create a UI Builder data broker to feed data to a page. **[Scripting]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Broker name"
        },
        "table": {
          "type": "string",
          "description": "Source table"
        },
        "query": {
          "type": "string",
          "description": "Encoded query filter"
        },
        "page": {
          "type": "string",
          "description": "Target page sys_id"
        }
      },
      "required": [
        "name",
        "table"
      ]
    }
  },
  {
    "name": "list_workspaces",
    "description": "List all configurable agent workspaces",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active": {
          "type": "boolean",
          "description": "Filter active (default true)"
        },
        "limit": {
          "type": "number"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_workspace",
    "description": "Get details of a configurable agent workspace including tabs and lists",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Workspace sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_workspace",
    "description": "Create a new configurable agent workspace. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Workspace name"
        },
        "description": {
          "type": "string"
        },
        "table": {
          "type": "string",
          "description": "Primary table (e.g. incident)"
        },
        "icon": {
          "type": "string",
          "description": "Workspace icon name"
        }
      },
      "required": [
        "name",
        "table"
      ]
    }
  },
  {
    "name": "configure_workspace_list",
    "description": "Add or update a list view in an agent workspace. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workspace_sys_id": {
          "type": "string",
          "description": "Workspace sys_id"
        },
        "table": {
          "type": "string",
          "description": "List table"
        },
        "title": {
          "type": "string",
          "description": "List title"
        },
        "query": {
          "type": "string",
          "description": "Encoded query filter"
        },
        "columns": {
          "type": "string",
          "description": "Comma-separated field names"
        }
      },
      "required": [
        "workspace_sys_id",
        "table",
        "title"
      ]
    }
  },
  {
    "name": "create_ux_app_route",
    "description": "Register a new route (URL path) in a UX app. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "app_sys_id": {
          "type": "string",
          "description": "UX app sys_id"
        },
        "path": {
          "type": "string",
          "description": "Route path"
        },
        "page_sys_id": {
          "type": "string",
          "description": "Target UIB page sys_id"
        },
        "title": {
          "type": "string",
          "description": "Route title"
        }
      },
      "required": [
        "app_sys_id",
        "path",
        "page_sys_id"
      ]
    }
  },
  {
    "name": "create_ux_experience",
    "description": "Create a new UX Experience (app shell) configuration. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Experience name"
        },
        "app_sys_id": {
          "type": "string",
          "description": "UX app sys_id"
        },
        "landing_page": {
          "type": "string",
          "description": "Landing page sys_id"
        }
      },
      "required": [
        "name",
        "app_sys_id"
      ]
    }
  },
  {
    "name": "list_mobile_app_configs",
    "description": "List ServiceNow mobile app configurations",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active": {
          "type": "boolean",
          "description": "Filter active (default true)"
        },
        "limit": {
          "type": "number"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_mobile_app_config",
    "description": "Get details of a specific mobile app configuration",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "Mobile app config sys_id"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_mobile_app_config",
    "description": "Create a new mobile app configuration. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "App name"
        },
        "description": {
          "type": "string"
        },
        "branding_color": {
          "type": "string",
          "description": "Primary colour hex"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "list_mobile_applets",
    "description": "List mobile applets (mini-apps within the mobile experience)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "app_config": {
          "type": "string",
          "description": "Filter by app config sys_id"
        },
        "limit": {
          "type": "number"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_mobile_applet",
    "description": "Create a mobile applet in a mobile app. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Applet name"
        },
        "table": {
          "type": "string",
          "description": "Applet data table"
        },
        "icon": {
          "type": "string",
          "description": "Applet icon"
        },
        "app_config": {
          "type": "string",
          "description": "Parent app config sys_id"
        }
      },
      "required": [
        "name",
        "table"
      ]
    }
  },
  {
    "name": "list_mobile_layouts",
    "description": "List mobile layout configurations",
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "number"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_mobile_layout",
    "description": "Create a mobile layout for a specific view. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Layout name"
        },
        "table": {
          "type": "string",
          "description": "Target table"
        },
        "type": {
          "type": "string",
          "description": "Layout type: list, form, detail"
        }
      },
      "required": [
        "name",
        "table"
      ]
    }
  },
  {
    "name": "configure_offline_sync",
    "description": "Configure which tables/records are available offline in mobile. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table to sync offline"
        },
        "query": {
          "type": "string",
          "description": "Filter query for sync scope"
        },
        "max_records": {
          "type": "number",
          "description": "Max offline records (default 500)"
        }
      },
      "required": [
        "table"
      ]
    }
  },
  {
    "name": "send_push_notification",
    "description": "Send a push notification to mobile app users. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "user": {
          "type": "string",
          "description": "Target user sys_id"
        },
        "group": {
          "type": "string",
          "description": "Target group sys_id (alternative to user)"
        },
        "title": {
          "type": "string",
          "description": "Notification title"
        },
        "body": {
          "type": "string",
          "description": "Notification body text"
        },
        "action_url": {
          "type": "string",
          "description": "Deep link URL on tap"
        }
      },
      "required": [
        "title",
        "body"
      ]
    }
  },
  {
    "name": "get_mobile_analytics",
    "description": "Get mobile app usage analytics — sessions, active users, popular applets",
    "inputSchema": {
      "type": "object",
      "properties": {
        "days": {
          "type": "number",
          "description": "Analysis period in days (default 30)"
        }
      },
      "required": []
    }
  },
  {
    "name": "find_artifact",
    "description": "Search for platform artifacts by name, type, or scope (business rules, scripts, widgets, etc.)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Artifact name or pattern"
        },
        "type": {
          "type": "string",
          "description": "Artifact type: business_rule, script_include, client_script, ui_policy, ui_action, widget, flow, sys_properties"
        },
        "scope": {
          "type": "string",
          "description": "Application scope name"
        },
        "limit": {
          "type": "number"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "validate_artifact",
    "description": "Validate an artifact for best practices, security issues, and performance concerns",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Artifact table (e.g. sys_script, sys_script_include)"
        },
        "sys_id": {
          "type": "string",
          "description": "Artifact sys_id"
        }
      },
      "required": [
        "table",
        "sys_id"
      ]
    }
  },
  {
    "name": "clone_artifact",
    "description": "Clone a platform artifact to a new name/scope. **[Scripting]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Source artifact table"
        },
        "sys_id": {
          "type": "string",
          "description": "Source artifact sys_id"
        },
        "new_name": {
          "type": "string",
          "description": "Name for the cloned artifact"
        },
        "target_scope": {
          "type": "string",
          "description": "Target application scope (optional)"
        }
      },
      "required": [
        "table",
        "sys_id",
        "new_name"
      ]
    }
  },
  {
    "name": "validate_deployment",
    "description": "Pre-validate an update set or app before deployment — check for conflicts and missing dependencies",
    "inputSchema": {
      "type": "object",
      "properties": {
        "update_set_sys_id": {
          "type": "string",
          "description": "Update set sys_id to validate"
        },
        "app_sys_id": {
          "type": "string",
          "description": "Scoped app sys_id (alternative to update set)"
        }
      },
      "required": []
    }
  },
  {
    "name": "rollback_deployment",
    "description": "Rollback a deployment by reverting an update set. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "update_set_sys_id": {
          "type": "string",
          "description": "Committed update set sys_id to rollback"
        },
        "reason": {
          "type": "string",
          "description": "Reason for rollback"
        }
      },
      "required": [
        "update_set_sys_id"
      ]
    }
  },
  {
    "name": "list_deployment_history",
    "description": "List deployment history — committed update sets and app installs over time",
    "inputSchema": {
      "type": "object",
      "properties": {
        "days": {
          "type": "number",
          "description": "Look-back period (default 30)"
        },
        "limit": {
          "type": "number"
        }
      },
      "required": []
    }
  },
  {
    "name": "create_solution_package",
    "description": "Create a solution package from selected update sets for distribution. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Package name"
        },
        "description": {
          "type": "string"
        },
        "update_sets": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Array of update set sys_ids to include"
        }
      },
      "required": [
        "name",
        "update_sets"
      ]
    }
  },
  {
    "name": "execute_background_script",
    "description": "Execute a background script on the instance (server-side JavaScript). **[Scripting]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "script": {
          "type": "string",
          "description": "JavaScript code to execute"
        },
        "scope": {
          "type": "string",
          "description": "Application scope (default global)"
        }
      },
      "required": [
        "script"
      ]
    }
  },
  {
    "name": "import_cmdb_data",
    "description": "Import CI data into CMDB via import set. **[Write]**",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Target CMDB table (e.g. cmdb_ci_server)"
        },
        "data": {
          "type": "array",
          "items": {
            "type": "object"
          },
          "description": "Array of records to import"
        }
      },
      "required": [
        "table",
        "data"
      ]
    }
  },
  {
    "name": "analyze_data_quality",
    "description": "Analyse data quality for a table — completeness, duplicates, stale records",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table to analyse"
        },
        "required_fields": {
          "type": "string",
          "description": "Comma-separated fields that should be populated"
        },
        "days_stale": {
          "type": "number",
          "description": "Consider records stale after N days without update (default 180)"
        }
      },
      "required": [
        "table"
      ]
    }
  },
  {
    "name": "fluent_query",
    "description": "GlideQuery-style fluent query builder. Supports select, where, aggregate (COUNT/AVG/SUM/MIN/MAX), orderBy, limit, and groupBy. Returns records or aggregate results. Example: { table: \"incident\", where: [[\"active\",\"=\",true],[\"priority\",\"<\",3]], select: [\"number\",\"short_description\"], limit: 10 }",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name (e.g., \"incident\")"
        },
        "where": {
          "type": "array",
          "description": "Array of conditions: [field, operator, value]. Operators: =, !=, >, >=, <, <=, LIKE, STARTSWITH, CONTAINS, IN, NOT IN, ISEMPTY, ISNOTEMPTY",
          "items": {
            "type": "array",
            "items": {},
            "minItems": 2,
            "maxItems": 3
          }
        },
        "orWhere": {
          "type": "array",
          "description": "Array of OR conditions (same format as where)",
          "items": {
            "type": "array",
            "items": {},
            "minItems": 2,
            "maxItems": 3
          }
        },
        "select": {
          "type": "array",
          "description": "Fields to return. Supports dot-walking (e.g., \"caller_id.email\"). If omitted, returns all fields.",
          "items": {
            "type": "string"
          }
        },
        "aggregate": {
          "type": "string",
          "description": "Aggregate operation: COUNT, AVG, SUM, MIN, MAX",
          "enum": [
            "COUNT",
            "AVG",
            "SUM",
            "MIN",
            "MAX"
          ]
        },
        "aggregateField": {
          "type": "string",
          "description": "Field to aggregate on (required for AVG, SUM, MIN, MAX)"
        },
        "groupBy": {
          "type": "string",
          "description": "Field to group results by (for aggregate queries)"
        },
        "orderBy": {
          "type": "string",
          "description": "Field to sort by. Prefix with \"-\" for descending."
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default: 20, max: 200)"
        },
        "displayValue": {
          "type": "boolean",
          "description": "Return display values instead of internal values (default: false)"
        }
      },
      "required": [
        "table"
      ]
    }
  },
  {
    "name": "batch_request",
    "description": "Execute multiple ServiceNow REST API operations in a single HTTP call. Reduces round-trips by 50-70%. Each operation specifies method, URL path, and optional body. Max 50 operations per batch.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "operations": {
          "type": "array",
          "description": "Array of REST operations to execute",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "description": "Unique operation ID for correlating responses"
              },
              "method": {
                "type": "string",
                "description": "HTTP method: GET, POST, PATCH, DELETE",
                "enum": [
                  "GET",
                  "POST",
                  "PATCH",
                  "DELETE"
                ]
              },
              "url": {
                "type": "string",
                "description": "API URL path (e.g., \"/api/now/table/incident?sysparm_limit=5\")"
              },
              "body": {
                "type": "object",
                "description": "Request body for POST/PATCH operations"
              }
            },
            "required": [
              "id",
              "method",
              "url"
            ]
          },
          "minItems": 1,
          "maxItems": 50
        }
      },
      "required": [
        "operations"
      ]
    }
  },
  {
    "name": "execute_script",
    "description": "Execute a server-side script on the ServiceNow instance (Background Script). Supports GlideRecord, GlideQuery, GlideAggregate, and all server-side APIs. Returns the script output. Use for complex queries that cannot be expressed via REST. REQUIRES WRITE_ENABLED=true.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "script": {
          "type": "string",
          "description": "Server-side JavaScript to execute. Use gs.print() or gs.info() for output."
        },
        "scope": {
          "type": "string",
          "description": "Application scope to run in (default: global)"
        }
      },
      "required": [
        "script"
      ]
    }
  },
  {
    "name": "fluent_sdk_query",
    "description": "Run `now-sdk query <table>` — a read-only Table REST API query executed via the ServiceNow SDK CLI against your authenticated instance (no browser). New in @servicenow/sdk 4.8. Ideal while authoring Fluent code: resolve sys_ids, inspect table schemas, check existing records, read choice values. Example: { table: \"sys_user_role\", query: \"name=admin\", fields: [\"sys_id\",\"name\"], limit: 1 }",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table to query (e.g., \"incident\", \"sys_dictionary\")"
        },
        "query": {
          "type": "string",
          "description": "Encoded query string (e.g., \"name=admin^active=true\")"
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Fields to return (e.g., [\"sys_id\",\"name\"])"
        },
        "limit": {
          "type": "number",
          "description": "Max rows to return"
        }
      },
      "required": [
        "table"
      ]
    }
  },
  {
    "name": "fluent_version",
    "description": "Report the installed `@servicenow/sdk` (now-sdk) version and whether it meets the version NowAIKit tracks features against (currently 4.10.1). Returns an upgrade hint when out of date.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    }
  },
  {
    "name": "fluent_explain",
    "description": "Run `npx @servicenow/sdk explain <topic>` to get live SDK documentation on a topic — always current API signatures, not training-data guesses. Returns explanations of Fluent APIs, types, patterns, and best practices. Known topics include: GlideQuery, table API, scoped app, now.config.json, keys.ts, metadata, Record, Now.del, Now.attach, DataLookup, RestMessage, Alias, AliasTemplate, RetryPolicy, Playbook, Flow, Subflow, CustomAction, TryCatch, DoInParallel, FlowStages, AiAgent, AiAgentWorkflow, roleMap, NowAssistSkillConfig, UiPolicy, DataPolicy, Form, InstanceScan, ServicePortal, ImportSet, override, StateModel, cicd.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "topic": {
          "type": "string",
          "description": "Topic to explain. Examples: GlideQuery, table API, scoped app, now.config.json, keys.ts, metadata, Record, Now.del, etc."
        }
      },
      "required": [
        "topic"
      ]
    }
  },
  {
    "name": "fluent_init",
    "description": "Initialize a new ServiceNow fluent/now-sdk project. Runs `npx @servicenow/sdk init`. REQUIRES FLUENT_ENABLED=true and WRITE_ENABLED=true.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Project name"
        },
        "template": {
          "type": "string",
          "description": "Project template (optional)"
        },
        "directory": {
          "type": "string",
          "description": "Target directory (optional, defaults to cwd)"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "fluent_build",
    "description": "Build a ServiceNow fluent/now-sdk project. Runs `npx @servicenow/sdk build`. REQUIRES FLUENT_ENABLED=true and WRITE_ENABLED=true.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "directory": {
          "type": "string",
          "description": "Project directory (optional, defaults to cwd)"
        }
      },
      "required": []
    }
  },
  {
    "name": "fluent_validate",
    "description": "Validate a ServiceNow fluent/now-sdk project. Runs `npx @servicenow/sdk validate`. REQUIRES FLUENT_ENABLED=true.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "directory": {
          "type": "string",
          "description": "Project directory (optional, defaults to cwd)"
        }
      },
      "required": []
    }
  },
  {
    "name": "fluent_cicd",
    "description": "Run ServiceNow CI/CD operations via the SDK (`now-sdk cicd`, new in @servicenow/sdk 4.10). Drive scoped-app install/publish and ATF test-suite runs from a promotion pipeline, outside the local build/install flow. REQUIRES FLUENT_ENABLED=true and WRITE_ENABLED=true.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "action": {
          "type": "string",
          "enum": [
            "install",
            "publish",
            "testsuite"
          ],
          "description": "install a published app version, publish an app scope to the app repo, or run an ATF test suite"
        },
        "appSysId": {
          "type": "string",
          "description": "App sys_id (required for action=install)"
        },
        "scope": {
          "type": "string",
          "description": "App scope, e.g. x_acme_app (required for action=publish)"
        },
        "appVersion": {
          "type": "string",
          "description": "App version, e.g. 1.0.0 (install/publish)"
        },
        "testSuiteName": {
          "type": "string",
          "description": "ATF test suite name (required for action=testsuite)"
        }
      },
      "required": [
        "action"
      ]
    }
  },
  {
    "name": "search_servicenow_docs",
    "description": "Search the official ServiceNow product documentation (servicenow.com/docs) — API references (GlideRecord, GlideSystem, GlideAjax…), admin & developer guides, encoded-query operators, release notes. Returns ranked results with title, breadcrumb, URL, snippet, and a `ref` to read the full page with fetch_servicenow_doc. Use this to ground answers in current ServiceNow docs rather than memory. Read-only; uses the public docs site, not your instance.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "What to look up (e.g., \"GlideRecord addEncodedQuery\", \"flow designer rest step\", \"CSDM 4.0\")."
        },
        "limit": {
          "type": "number",
          "description": "Max results to return (default 6, max 20)."
        },
        "product": {
          "type": "string",
          "description": "Optional product/area to bias the search (e.g., \"ITSM\", \"CMDB\", \"Flow Designer\", \"Performance Analytics\")."
        }
      },
      "required": [
        "query"
      ]
    }
  },
  {
    "name": "fetch_servicenow_doc",
    "description": "Fetch the full readable text of a specific ServiceNow documentation page. Pass either the `ref` returned by search_servicenow_docs (fastest, exact) or a servicenow.com/docs page URL. Use after search_servicenow_docs to read a result in full. Read-only; only ServiceNow docs are reachable.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ref": {
          "type": "string",
          "description": "The `ref` from a search_servicenow_docs result (preferred — resolves directly to page content)."
        },
        "url": {
          "type": "string",
          "description": "A servicenow.com/docs page URL (used when no ref is available; resolved via docs search)."
        },
        "maxChars": {
          "type": "number",
          "description": "Truncate the returned text to this many characters (default 9000, max 30000)."
        }
      },
      "required": []
    }
  },
  {
    "name": "create_now_assist_skill",
    "description": "Create a Now Assist skill definition (requires NOW_ASSIST_ENABLED + WRITE_ENABLED)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Skill name"
        },
        "description": {
          "type": "string",
          "description": "Skill description"
        },
        "input_schema": {
          "type": "string",
          "description": "JSON schema string defining the skill input"
        },
        "output_schema": {
          "type": "string",
          "description": "JSON schema string defining the skill output"
        },
        "prompt_template": {
          "type": "string",
          "description": "Prompt template for the skill"
        },
        "model": {
          "type": "string",
          "description": "Optional model identifier to use for this skill"
        }
      },
      "required": [
        "name",
        "description",
        "input_schema",
        "output_schema",
        "prompt_template"
      ]
    }
  },
  {
    "name": "list_now_assist_skills",
    "description": "List Now Assist skill definitions (requires NOW_ASSIST_ENABLED)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active": {
          "type": "boolean",
          "description": "Filter by active status"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        },
        "query": {
          "type": "string",
          "description": "Additional encoded query string"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_now_assist_skill",
    "description": "Get a single Now Assist skill definition by sys_id (requires NOW_ASSIST_ENABLED)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the skill"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "test_now_assist_skill",
    "description": "Invoke a Now Assist skill with test input to verify behavior (requires NOW_ASSIST_ENABLED)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "skill_sys_id": {
          "type": "string",
          "description": "System ID of the skill to test"
        },
        "test_input": {
          "type": "object",
          "description": "Test input payload to send to the skill"
        }
      },
      "required": [
        "skill_sys_id",
        "test_input"
      ]
    }
  },
  {
    "name": "create_ai_agent",
    "description": "Create an AI agent definition with optional auto-generated ACLs (requires NOW_ASSIST_ENABLED + WRITE_ENABLED)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Agent name"
        },
        "description": {
          "type": "string",
          "description": "Agent description"
        },
        "capabilities": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "List of capability identifiers the agent supports"
        },
        "auto_generate_acls": {
          "type": "boolean",
          "description": "Automatically create ACL records for the agent (default true)"
        }
      },
      "required": [
        "name",
        "description",
        "capabilities"
      ]
    }
  },
  {
    "name": "list_ai_agents",
    "description": "List AI agent definitions",
    "inputSchema": {
      "type": "object",
      "properties": {
        "active": {
          "type": "boolean",
          "description": "Filter by active status"
        },
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "get_ai_agent",
    "description": "Get an AI agent definition and its related ACLs",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sys_id": {
          "type": "string",
          "description": "System ID of the AI agent"
        }
      },
      "required": [
        "sys_id"
      ]
    }
  },
  {
    "name": "create_agentic_workflow",
    "description": "Create an agentic workflow linked to an AI agent (requires NOW_ASSIST_ENABLED + WRITE_ENABLED)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Workflow name"
        },
        "description": {
          "type": "string",
          "description": "Workflow description"
        },
        "agent_sys_id": {
          "type": "string",
          "description": "System ID of the parent AI agent"
        },
        "steps": {
          "type": "array",
          "description": "Ordered list of workflow steps",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "description": "Step name"
              },
              "action": {
                "type": "string",
                "description": "Action identifier"
              },
              "inputs": {
                "type": "object",
                "description": "Step input parameters"
              },
              "condition": {
                "type": "string",
                "description": "Optional condition expression"
              }
            },
            "required": [
              "name",
              "action"
            ]
          }
        },
        "trigger_conditions": {
          "type": "string",
          "description": "Optional trigger condition expression"
        }
      },
      "required": [
        "name",
        "description",
        "agent_sys_id",
        "steps"
      ]
    }
  },
  {
    "name": "cmdb_find_duplicates",
    "description": "Find duplicate CIs by matching on specified fields (in-memory grouping)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ci_class": {
          "type": "string",
          "description": "CI class table (default cmdb_ci)"
        },
        "match_fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Fields to match on for duplicate detection (default: name, serial_number, ip_address)"
        },
        "limit": {
          "type": "number",
          "description": "Max CIs to scan (default 100)"
        }
      },
      "required": []
    }
  },
  {
    "name": "cmdb_find_orphans",
    "description": "Find CIs with no relationships in cmdb_rel_ci",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ci_class": {
          "type": "string",
          "description": "CI class table (default cmdb_ci)"
        },
        "limit": {
          "type": "number",
          "description": "Max orphan CIs to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "cmdb_find_stale",
    "description": "Find CIs not updated within a given number of days that are still operational",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ci_class": {
          "type": "string",
          "description": "CI class table (default cmdb_ci)"
        },
        "days_threshold": {
          "type": "number",
          "description": "Number of days since last update to consider stale (default 90)"
        },
        "limit": {
          "type": "number",
          "description": "Max stale CIs to return (default 50)"
        }
      },
      "required": []
    }
  },
  {
    "name": "cmdb_reconcile",
    "description": "Act on duplicate, stale, or orphan CIs — merge, retire, or remove (requires CMDB_WRITE_ENABLED). Supports dry_run mode.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "action": {
          "type": "string",
          "enum": [
            "merge_duplicates",
            "retire_stale",
            "remove_orphans"
          ],
          "description": "Reconciliation action to perform"
        },
        "targets": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Array of CI sys_ids to act on"
        },
        "dry_run": {
          "type": "boolean",
          "description": "Preview changes without applying (default true)"
        }
      },
      "required": [
        "action",
        "targets"
      ]
    }
  },
  {
    "name": "create_playbook",
    "description": "Create a playbook definition with ordered steps that chain tool calls (requires NOW_ASSIST_ENABLED + WRITE_ENABLED)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Playbook name"
        },
        "description": {
          "type": "string",
          "description": "Playbook description"
        },
        "steps": {
          "type": "array",
          "description": "Ordered list of playbook steps",
          "items": {
            "type": "object",
            "properties": {
              "tool_name": {
                "type": "string",
                "description": "Name of the tool to invoke"
              },
              "args_template": {
                "type": "object",
                "description": "Arguments template — can reference {{context.key}} or {{steps[N].result.key}}"
              },
              "condition": {
                "type": "string",
                "description": "Optional JS-like condition expression. Step runs only when truthy."
              },
              "on_error": {
                "type": "string",
                "enum": [
                  "stop",
                  "skip",
                  "continue"
                ],
                "description": "Error handling: stop (default), skip this step, or continue to next"
              }
            },
            "required": [
              "tool_name",
              "args_template"
            ]
          }
        }
      },
      "required": [
        "name",
        "description",
        "steps"
      ]
    }
  },
  {
    "name": "execute_playbook",
    "description": "Execute a playbook step by step, passing results forward through context (requires NOW_ASSIST_ENABLED). Supports dry_run.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "playbook": {
          "type": "object",
          "description": "Playbook object with name, description, and steps array",
          "properties": {
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "steps": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "tool_name": {
                    "type": "string"
                  },
                  "args_template": {
                    "type": "object"
                  },
                  "condition": {
                    "type": "string"
                  },
                  "on_error": {
                    "type": "string",
                    "enum": [
                      "stop",
                      "skip",
                      "continue"
                    ]
                  }
                },
                "required": [
                  "tool_name",
                  "args_template"
                ]
              }
            }
          },
          "required": [
            "steps"
          ]
        },
        "context": {
          "type": "object",
          "description": "Initial context key-value pairs available to all steps"
        },
        "dry_run": {
          "type": "boolean",
          "description": "Preview execution plan without invoking tools (default true)"
        }
      },
      "required": [
        "playbook"
      ]
    }
  },
  {
    "name": "list_playbooks",
    "description": "List stored playbook definitions from sys_hub_action_type_definition",
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "number",
          "description": "Max records to return (default 25)"
        }
      },
      "required": []
    }
  },
  {
    "name": "discover_table",
    "description": "Discover a ServiceNow table schema and register dynamic CRUD tools for it. After discovery, new tools become available: dynamic_query_<table>, dynamic_get_<table>, dynamic_create_<table>, dynamic_update_<table>, dynamic_delete_<table>. Schemas are cached for 30 minutes.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name to discover (e.g., \"u_custom_table\")"
        },
        "operations": {
          "type": "array",
          "description": "Operations to enable: query, get, create, update, delete. Default: all.",
          "items": {
            "type": "string",
            "enum": [
              "query",
              "get",
              "create",
              "update",
              "delete"
            ]
          }
        }
      },
      "required": [
        "table"
      ]
    }
  },
  {
    "name": "list_table_config",
    "description": "List every configuration artifact on a table — business rules, client scripts, UI policies, ACLs, UI actions, data policies, and dictionary fields — with per-type counts. Use it to see what depends on a table before changing or removing it. This is config/metadata impact, not CMDB CI impact. Each lane returns {count, records} or {error} if that table/plugin is unavailable.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name, e.g. \"incident\""
        },
        "limit": {
          "type": "number",
          "description": "Max records per artifact type (default 50)"
        }
      },
      "required": [
        "table"
      ]
    }
  },
  {
    "name": "find_field_references",
    "description": "Find where a table field is used — its dictionary entry plus any scripts (business rules, script includes, client scripts, UI actions, widgets) that mention the field name. Use it before renaming or removing a field. Script matches are substring (LIKE) hits, so expect false positives (comments, similarly-named symbols) and misses for dynamically-built references; treat results as candidates to review, not a definitive list.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table name, e.g. \"incident\""
        },
        "field": {
          "type": "string",
          "description": "Field (column) name, e.g. \"u_custom_field\""
        },
        "limit": {
          "type": "number",
          "description": "Max matches per source (default 50)"
        }
      },
      "required": [
        "table",
        "field"
      ]
    }
  },
  {
    "name": "find_script_references",
    "description": "Find what references a Script Include or named artifact — scans script-bearing config tables for textual use of the name. Use it before renaming or deleting a Script Include, Script Action, etc. Matches are substring (LIKE) hits, so treat them as candidates to review (false positives from comments/similar names; misses for dynamic references).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Artifact name to search for, e.g. a Script Include class name"
        },
        "limit": {
          "type": "number",
          "description": "Max matches per source (default 50)"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "find_update_sets",
    "description": "List the update sets that contain changes to an artifact (by name), so you know what is in-flight or already captured for promotion before you touch it.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Artifact name (or partial) to match against captured updates"
        },
        "limit": {
          "type": "number",
          "description": "Max update records to scan (default 100)"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "find_property_usage",
    "description": "Find scripts that read a system property (sys_properties) by name, plus the property record itself. Use it before changing or removing a property. Matches are substring (LIKE) hits — candidates to review, not definitive.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "System property name, e.g. \"glide.ui.incident_reassignment_action\""
        },
        "limit": {
          "type": "number",
          "description": "Max matches per source (default 50)"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  {
    "name": "list_supported_artifacts",
    "description": "Local sync: list the artifact types (tables) that support pull/push to local files and which fields sync for each.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    }
  },
  {
    "name": "pull_artifact",
    "description": "Local sync: fetch an artifact's editable fields (e.g. a Service Portal widget's template/css/script) for local editing. Returns the content inline; when NOWAIKIT_SYNC_DIR is set it also writes one file per field and returns the paths. This is config/pro-code editing of a single artifact, not an update-set export.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Artifact table, e.g. \"sp_widget\", \"sys_script_include\""
        },
        "sys_id": {
          "type": "string",
          "description": "sys_id OR name of the record (a name is resolved to its sys_id)"
        }
      },
      "required": [
        "table",
        "sys_id"
      ]
    }
  },
  {
    "name": "push_artifact",
    "description": "Local sync: write edited fields back to an artifact (requires WRITE_ENABLED=true). Pass fields inline as {field:value}; if omitted and NOWAIKIT_SYNC_DIR is set, reads them from the pulled files on disk. Overwrites the listed fields with NO merge — run sync_status first, and pass expected_updated_on to abort if the instance changed since you pulled.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Artifact table"
        },
        "sys_id": {
          "type": "string",
          "description": "sys_id OR name of the record"
        },
        "fields": {
          "type": "object",
          "description": "Optional map of {field: newValue} to update; defaults to the on-disk files under NOWAIKIT_SYNC_DIR"
        },
        "expected_updated_on": {
          "type": "string",
          "description": "Optional sys_updated_on from your last pull/sync_status; the push aborts with a CONFLICT if the record has changed since."
        }
      },
      "required": [
        "table",
        "sys_id"
      ]
    }
  },
  {
    "name": "sync_status",
    "description": "Local sync: compare an artifact's current instance content against your local/edited content field-by-field. Each field reports unchanged | changed | not_local (no local copy to compare). Also returns sys_updated_on to feed into push_artifact's conflict check.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Artifact table"
        },
        "sys_id": {
          "type": "string",
          "description": "sys_id OR name of the record"
        },
        "fields": {
          "type": "object",
          "description": "Optional {field: localValue} to compare; defaults to files under NOWAIKIT_SYNC_DIR"
        }
      },
      "required": [
        "table",
        "sys_id"
      ]
    }
  },
  {
    "name": "visualize_aggregate",
    "description": "Build a real-time chart of ServiceNow records grouped by a field (e.g. incidents by priority, cases by state). Returns chart-ready data, a Teams Adaptive Card (Chart.*) to drop into a Copilot Studio \"Send an adaptive card\" step, a markdown table, and a summary. Read-only.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table to aggregate, e.g. \"incident\", \"sn_customerservice_case\""
        },
        "group_by": {
          "type": "string",
          "description": "Field to group by, e.g. \"priority\", \"state\", \"category\", \"assignment_group\""
        },
        "query": {
          "type": "string",
          "description": "Optional encoded query filter, e.g. \"active=true\""
        },
        "chart_type": {
          "type": "string",
          "description": "column (default) | bar | pie | donut"
        },
        "title": {
          "type": "string",
          "description": "Optional chart title"
        },
        "limit": {
          "type": "number",
          "description": "Keep the top N groups by count (default 12)"
        }
      },
      "required": [
        "table",
        "group_by"
      ]
    }
  },
  {
    "name": "aggregate_report",
    "description": "Server-side aggregate REPORT grouped by a field, in ONE query with no 1000-row truncation. Returns per-group record count PLUS averages/sums/mins/maxes of numeric or duration fields — the right tool for a periodic summary like \"incident volume by category with average resolution time\". Do NOT list raw records for this; use this. For task tables (incident, problem, change_request, cases, etc.) it INCLUDES average resolution time automatically even if avg_fields is omitted. Duration fields come back pre-formatted (e.g. \"21 14:03:10\"). Returns a stats table (markdown), the rows, a count chart Adaptive Card, and a summary. Read-only.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table to aggregate, e.g. \"incident\""
        },
        "group_by": {
          "type": "string",
          "description": "Field to group by, e.g. \"category\", \"assignment_group\", \"priority\""
        },
        "query": {
          "type": "string",
          "description": "Encoded query filter, e.g. resolved in the last 7 days: \"stateIN6,7^resolved_atRELATIVEGT@dayofweek@ago@7\""
        },
        "avg_fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Fields to average per group, e.g. [\"business_duration\"] or [\"calendar_duration\"] for resolution time. Comma string also accepted."
        },
        "sum_fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Fields to sum per group"
        },
        "min_fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Fields to take the minimum of per group"
        },
        "max_fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Fields to take the maximum of per group"
        },
        "title": {
          "type": "string",
          "description": "Optional report title"
        },
        "limit": {
          "type": "number",
          "description": "Keep the top N groups by count (default 25)"
        }
      },
      "required": [
        "table",
        "group_by"
      ]
    }
  },
  {
    "name": "visualize_trend",
    "description": "Build a real-time trend line of ServiceNow record counts over time (e.g. incidents opened per day). Returns chart-ready series, a Teams Adaptive Card line chart, a markdown table, and a summary. Read-only.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "table": {
          "type": "string",
          "description": "Table to count, e.g. \"incident\""
        },
        "date_field": {
          "type": "string",
          "description": "Date/time field to bucket on (default \"sys_created_on\")"
        },
        "interval": {
          "type": "string",
          "description": "day (default) | week | month"
        },
        "query": {
          "type": "string",
          "description": "Recommended: a span filter, e.g. \"sys_created_onONLast 30 days@...\" or \"active=true\""
        },
        "title": {
          "type": "string",
          "description": "Optional chart title"
        }
      },
      "required": [
        "table"
      ]
    }
  }
];
