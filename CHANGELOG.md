# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] — 2026-02-21

### Added

#### New Tool Modules (102 new tools)
- **HR Service Delivery** (12 tools): `create_hr_case`, `get_hr_case`, `update_hr_case`, `list_hr_cases`, `close_hr_case`, `list_hr_services`, `get_hr_service`, `get_hr_profile`, `update_hr_profile`, `list_hr_tasks`, `create_hr_task`, `get_hr_case_activity`
- **Customer Service Management** (11 tools): `create_csm_case`, `get_csm_case`, `update_csm_case`, `list_csm_cases`, `close_csm_case`, `get_csm_account`, `list_csm_accounts`, `get_csm_contact`, `list_csm_contacts`, `get_csm_case_sla`, `list_csm_products`
- **Security Operations & GRC** (11 tools): `create_security_incident`, `get_security_incident`, `update_security_incident`, `list_security_incidents`, `list_vulnerabilities`, `get_vulnerability`, `update_vulnerability`, `list_grc_risks`, `get_grc_risk`, `list_grc_controls`, `get_threat_intelligence`
- **Flow Designer & Process Automation** (10 tools): `list_flows`, `get_flow`, `trigger_flow`, `get_flow_execution`, `list_flow_executions`, `list_subflows`, `get_subflow`, `list_action_instances`, `get_process_automation`, `list_process_automations`
- **Service Portal & UI Builder** (14 tools): `list_portals`, `get_portal`, `list_portal_pages`, `get_portal_page`, `list_portal_widgets`, `get_portal_widget`, `create_portal_widget`, `update_portal_widget`, `list_widget_instances`, `list_ux_apps`, `get_ux_app`, `list_ux_pages`, `list_portal_themes`, `get_portal_theme`
- **Integration & Middleware** (19 tools): REST Messages, Transform Maps, Import Sets, Event Registry, OAuth/Credentials
- **Notifications & Attachments** (12 tools): `list_notifications`, `get_notification`, `create_notification`, `update_notification`, `list_email_logs`, `get_email_log`, `list_attachments`, `get_attachment_metadata`, `delete_attachment`, `upload_attachment`, `list_email_templates`, `list_notification_subscriptions`
- **Performance Analytics & Data Quality** (13 tools): PA indicators, scorecards, time-series, dashboards, data completeness checks

#### Enhancements to Existing Modules (16 tools)
- **Scripting** (+11 tools): `list_ui_policies`, `get_ui_policy`, `create_ui_policy`, `list_ui_actions`, `get_ui_action`, `create_ui_action`, `update_ui_action`, `list_acls`, `get_acl`, `create_acl`, `update_acl`
- **Reporting** (+5 tools): `get_scheduled_job`, `create_scheduled_job`, `update_scheduled_job`, `trigger_scheduled_job`, `list_job_run_history`
- **Now Assist** (+1 tool): `generate_work_notes` — AI-drafted work notes for any record

#### New Role-Based Tool Packages
- `portal_developer` — Service Portal / UI Builder focused (~35 tools)
- `integration_engineer` — REST Messages, Transform Maps, Events (~30 tools)

#### ServiceNow Client Enhancements
- `uploadAttachment(table, recordSysId, fileName, contentType, contentBase64)` — Binary upload to Attachment API (`/api/now/attachment/file`)

#### Documentation
- Expanded `README.md` with beginner and advanced setup guides for 12 AI clients (Claude Desktop, Claude Code, Cursor, VS Code, Windsurf, ChatGPT, Gemini, Codex, Cline, Amazon Q, JetBrains AI, Docker)
- Updated `docs/TOOLS.md` — full 230-tool reference
- Updated `docs/TOOL_PACKAGES.md` — 12-package documentation
- Updated `docs/SCRIPTING.md` — UI Policies, UI Actions, ACL management guide
- Updated `docs/REPORTING.md` — Scheduled job CRUD and execution history
- Updated `EXAMPLES.md` — 120+ usage examples with new module examples

### Changed
- `src/server.ts` MCP server version bumped to `2.1.0`
- `src/tools/index.ts` expanded with 4 new module imports and 2 new packages
- Total tools: 112 → 230 (+118 net, includes HRSD/CSM/Security/Flow from imported modules)
- Total modules: 17 → 21

---

## [2.0.0] — 2025-02-20

### Added

#### Core Architecture
- Modular domain-based tool architecture — each domain has its own `src/tools/domain.ts` file
- Role-based tool packaging via `MCP_TOOL_PACKAGE` environment variable (10 packages)
- Four-tier permission system (`WRITE_ENABLED`, `CMDB_WRITE_ENABLED`, `SCRIPTING_ENABLED`, `NOW_ASSIST_ENABLED`)
- `src/utils/permissions.ts` — centralized permission gate functions
- ATF execution gating via `ATF_ENABLED` environment variable

#### New Tool Domains (97 new tools, 112 total)
- **Incident Management** (7 tools): `create_incident`, `get_incident`, `update_incident`, `resolve_incident`, `close_incident`, `add_work_note`, `add_comment`
- **Problem Management** (4 tools): `create_problem`, `get_problem`, `update_problem`, `resolve_problem`
- **Change Management** (5 tools): `get_change_request`, `list_change_requests`, `update_change_request`, `submit_change_for_approval`, `close_change_request`
- **Task Management** (4 tools): `get_task`, `list_my_tasks`, `update_task`, `complete_task`
- **Knowledge Base** (6 tools): `list_knowledge_bases`, `search_knowledge`, `get_knowledge_article`, `create_knowledge_article`, `update_knowledge_article`, `publish_knowledge_article`
- **Service Catalog** (4 tools): `list_catalog_items`, `search_catalog`, `get_catalog_item`, `order_catalog_item`
- **Approvals** (4 tools): `get_my_approvals`, `list_approvals`, `approve_request`, `reject_request`
- **SLA** (2 tools): `get_sla_details`, `list_active_slas`
- **User & Group Management** (8 tools): `list_users`, `create_user`, `update_user`, `list_groups`, `create_group`, `update_group`, `add_user_to_group`, `remove_user_from_group`
- **Reporting & Analytics** (8 tools): `list_reports`, `get_report`, `run_aggregate_query`, `trend_query`, `get_performance_analytics`, `export_report_data`, `get_sys_log`, `list_scheduled_jobs`
- **ATF Testing** (9 tools): `list_atf_suites`, `get_atf_suite`, `run_atf_suite`, `list_atf_tests`, `get_atf_test`, `run_atf_test`, `get_atf_suite_result`, `list_atf_test_results`, `get_atf_failure_insight`
- **Now Assist / AI** (10 tools): `nlq_query`, `ai_search`, `generate_summary`, `suggest_resolution`, `categorize_incident`, `get_pi_models`, `get_virtual_agent_topics`, `trigger_agentic_playbook`, `get_ms_copilot_topics`, `get_virtual_agent_stream`
- **Scripting** (16 tools): Business rules, script includes, client scripts, changesets (full CRUD)
- **Agile / Scrum** (9 tools): Stories, epics, scrum tasks (full CRUD)

#### Latest Release API Support
- Now Assist Agentic Playbooks (`POST /api/sn_assist/playbook/trigger`)
- ATF Failure Insight (`GET /api/now/table/sys_atf_failure_insight`)
- AI Search (`GET /api/now/ai_search/search`)
- Predictive Intelligence with LightGBM (`POST /api/sn_ml/solution/{id}/predict`)
- Performance Analytics API (`GET /api/now/pa/widget/{sys_id}`)
- Stats/Aggregate API (`GET /api/now/stats/{table}`)
- Microsoft Copilot 365 topic bridge (`/api/sn_assist/copilot/topics`)
- Virtual Agent streaming API

#### Client Integration Support
- **Claude Desktop**: Basic Auth and OAuth config templates (`clients/claude-desktop/`)
- **Claude Code**: Setup guide with `claude mcp add` commands
- **OpenAI Codex / GPT-4o**: Python function-calling client (`clients/codex/servicenow_openai_client.py`)
- **Google Gemini / Vertex AI**: Python function-calling client (`clients/gemini/servicenow_gemini_client.py`)
- **Cursor**: MCP config files for basic and OAuth (`clients/cursor/.cursor/`)
- **VS Code**: MCP config files with extensions recommendations (`clients/vscode/.vscode/`)
- All clients include both `.env.basic.example` and `.env.oauth.example` files

#### ServiceNow Client Enhancements
- `createRecord(table, data)` — POST to Table API
- `updateRecord(table, sysId, data)` — PATCH to Table API
- `deleteRecord(table, sysId)` — DELETE from Table API
- `callNowAssist(endpoint, payload)` — POST to Now Assist / AI endpoints
- `runAggregateQuery(table, groupBy, aggregate, query)` — GET Stats API

#### Documentation
- Comprehensive `README.md` with beginner and advanced developer guides
- `docs/TOOLS.md` — full 112-tool reference with parameters and permissions
- `docs/TOOL_PACKAGES.md` — role-based package documentation
- `docs/CLIENT_SETUP.md` — unified setup guide for all 6 AI clients
- `docs/NOW_ASSIST.md` — Now Assist / AI integration guide
- `docs/ATF.md` — ATF testing guide with Failure Insight walkthrough
- `docs/SCRIPTING.md` — scripting management guide with latest release notes
- `docs/REPORTING.md` — reporting and analytics guide
- `docs/MULTI_INSTANCE.md` — multi-instance setup guide
- Per-client `SETUP.md` in each `clients/*/` directory
- `instances.example.json` — multi-instance config template

#### Configuration
- Updated `.env.example` with all new environment variables

### Changed
- `src/tools/index.ts` refactored into a domain router with package filtering
- Original 15 tools migrated to `src/tools/core.ts` (unchanged behavior)
- `src/servicenow/types.ts` expanded with 100+ new interfaces
- Version bumped from 1.0.0 to 2.0.0

---

## [1.0.0] — 2025-02-12

### Added
- Initial release with 15 tools
- Core platform tools: query records, get record, get table schema, get user, get group
- CMDB tools: search CI, get CI, list relationships
- ITOM tools: list discovery schedules, list MID servers, list active events, CMDB health dashboard, service mapping summary
- ITSM: create change request
- Experimental: natural language search, natural language update
- Basic Auth and OAuth 2.0 support
- Read-only by default with `WRITE_ENABLED` flag
- Vitest test suite
