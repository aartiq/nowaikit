<div align="center">

<img src="docs/assets/banner.svg" alt="now-ai-kit — The Complete ServiceNow AI Kit" width="100%"/>

<br/>

[![AI-Powered](https://img.shields.io/badge/AI--Powered-Multi--Provider-6366f1?style=flat-square)](https://github.com/aartiq/nowaikit)
[![Tools](https://img.shields.io/badge/230%2B%20Tools-21%20Modules-0ea5e9?style=flat-square)](docs/TOOLS.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-f59e0b?style=flat-square)](LICENSE)
[![ServiceNow](https://img.shields.io/badge/ServiceNow-Latest%20Release-00c7b4?style=flat-square)](https://developer.servicenow.com)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-8b5cf6?style=flat-square)](https://modelcontextprotocol.io)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)

<br/>

# now-ai-kit

## The Most Comprehensive ServiceNow AI Kit — Free, Forever

> AI-powered &bull; Multi-agent &bull; Multi-provider &bull; 230+ tools &bull; 21 modules &bull; 5-minute setup &bull; Always free

**now-ai-kit** is the most comprehensive and easiest-to-set-up AI toolkit for ServiceNow.
Connect Claude, ChatGPT, Gemini, Cursor, GitHub Copilot, or any MCP-compatible AI to your ServiceNow instance in **under 5 minutes** — and let your AI read, build, deploy, and automate across all 21 ServiceNow modules.

Ask questions, write scripts, deploy portal widgets, trigger flows, manage incidents, automate HRSD and CSM workflows, run ATF tests, build integrations, and fire events — all from your AI chat window, in plain English.

**Works with any AI. Works on any instance. Works for everyone. 100% open-source, always free.**

<br/>

| | |
|---|---|
| **Beginners** | Connect in 5 minutes. Ask questions in plain English. No API knowledge needed. Free PDI at developer.servicenow.com. |
| **Developers** | Write, deploy, test, and manage scripts, flows, widgets, and integrations at AI speed. |
| **Architects** | Orchestrate multi-step autonomous workflows, multi-instance comparisons, and agentic AI automation. |

<br/>

</div>

---

## Who Is This For?

<table>
<tr>
<td width="33%" valign="top">

### Beginners
**Zero ServiceNow API knowledge required.**

Connect Claude Desktop or Cursor to your ServiceNow PDI in 5 minutes. Ask plain English questions, browse incidents, search knowledge articles, place catalog orders, and monitor SLAs — all from your AI chat window. No code, no Postman, no documentation diving.

*Start here → [5-Minute Quickstart](#getting-started)*

</td>
<td width="33%" valign="top">

### Developers
**Build faster with AI as your development partner.**

Let your AI write business rules, create client scripts, manage UI Policies and ACLs, deploy Service Portal widgets, configure REST Messages, and manage Transform Maps — all with full TypeScript types, changeset support, and ATF test integration. Role-based packages scope tools to exactly what you need.

*Explore → [Platform Developer Package](#role-based-tool-packages)*

</td>
<td width="33%" valign="top">

### Architects & Advanced Users
**Autonomous multi-agent workflows across your full platform.**

Trigger Agentic Playbooks, run predictive intelligence models, fire and monitor events, compare record counts across environments, audit data quality, and orchestrate multi-step ITSM/HRSD/CSM processes — all from a single AI session with multi-instance support.

*Deep dive → [Now Assist & Agentic Guide](docs/NOW_ASSIST.md)*

</td>
</tr>
</table>

---

## Why now-ai-kit

<table>
<tr>
<td width="33%" valign="top">

### Autonomous AI Operations

Go beyond Q&A. Your AI agent can autonomously create incidents, write and deploy scripts, trigger flows, fire events, upload attachments, manage changesets, and run ATF test suites — completing multi-step tasks end-to-end without manual intervention. Supports Now Assist Agentic Playbooks for native ServiceNow AI automation.

</td>
<td width="33%" valign="top">

### Multi-Provider, Any Agent

Works with every major AI platform out of the box — **Claude**, **ChatGPT**, **Gemini**, **Grok**, **Cursor**, **Windsurf**, **GitHub Copilot**, **Continue.dev**, **Cline**, **Amazon Q**, **JetBrains AI**, **Zed**, **Ollama**. Any MCP-compatible agent or custom Python/TypeScript agent via the Anthropic Agent SDK. OAuth 2.0 and Basic Auth for every integration.

</td>
<td width="33%" valign="top">

### Broadest Platform Coverage

230+ production-ready tools spanning every ServiceNow domain: ITSM, ITOM, HRSD, CSM, SecOps, GRC, Agile, ATF, Flow Designer, Scripting, Now Assist, Service Portal, Integration Hub, Notifications, Performance Analytics, and more — the most complete AI toolkit for ServiceNow available.

</td>
</tr>
<tr>
<td width="33%" valign="top">

### Role-Based Intelligence

Twelve pre-built persona packages — service desk, platform developer, portal developer, integration engineer, ITOM engineer, AI developer, and more. Each package exposes exactly the right 15–55 tools for that role, reducing noise and enforcing least-privilege access. Configure once per team.

</td>
<td width="33%" valign="top">

### Safe by Default

A five-tier permission model ensures every operation is explicitly authorised. Read is always on; write, CMDB, scripting, and Now Assist each require a dedicated opt-in flag. Your instance cannot be accidentally modified by an AI without deliberate configuration.

</td>
<td width="33%" valign="top">

### Production-Ready Documentation

Full TypeScript types, 120+ real-world examples, 9 reference guides, and beginner + advanced setup instructions for every major AI client. Built on the latest ServiceNow APIs. Multi-instance support for prod/staging/dev from a single session.

</td>
</tr>
</table>

---

## Quick Links

| Resource | Link |
|----------|------|
| All 230+ Tools Reference | [docs/TOOLS.md](docs/TOOLS.md) |
| Client Setup (All AI tools, beginner + advanced) | [docs/CLIENT_SETUP.md](docs/CLIENT_SETUP.md) |
| Role-Based Tool Packages | [docs/TOOL_PACKAGES.md](docs/TOOL_PACKAGES.md) |
| Now Assist & AI Integration | [docs/NOW_ASSIST.md](docs/NOW_ASSIST.md) |
| ATF Testing Guide | [docs/ATF.md](docs/ATF.md) |
| Scripting Management | [docs/SCRIPTING.md](docs/SCRIPTING.md) |
| Reporting & Analytics | [docs/REPORTING.md](docs/REPORTING.md) |
| Multi-Instance Setup | [docs/MULTI_INSTANCE.md](docs/MULTI_INSTANCE.md) |
| 120+ Real-World Examples | [EXAMPLES.md](EXAMPLES.md) |
| Changelog | [CHANGELOG.md](CHANGELOG.md) |

---

## Module Coverage

21 domain modules covering the full ServiceNow platform:

| Module | Key Capabilities | Tools |
|--------|-----------------|-------|
| Core & CMDB | Record query, schema discovery, CMDB CIs, ITOM Discovery, MID Servers | 16 |
| Incident Management | Full incident lifecycle — create, update, resolve, close, work notes | 9 |
| Problem Management | Problem records, root cause analysis, known errors | 4 |
| Change Management | **Create**, get, update, submit for approval, close change requests | 6 |
| Task Management | Generic tasks, my-task lists, completions | 4 |
| Knowledge Base | Search, create, update, publish KB articles | 6 |
| Service Catalog & Approvals | Catalog browsing, order items, SLA tracking, approval workflows | 10 |
| User & Group Management | Users, groups, membership, role assignments | 8 |
| Reporting & Analytics | Aggregate queries, trend analysis, **scheduled job CRUD**, run history | 13 |
| ATF Testing | Test suites, test execution, ATF Failure Insight | 9 |
| Now Assist / AI | NLQ, AI Search, summaries, resolution suggestions, Agentic Playbooks | 10 |
| Scripting | Business rules, script includes, **client script CRUD**, **UI Policies**, **UI Actions**, **ACL management**, changesets | 28 |
| Agile / Scrum | Stories, epics, sprints, scrum tasks | 9 |
| HR Service Delivery (HRSD) | HR cases, HR services, employee profiles, onboarding/offboarding | 12 |
| Customer Service Management (CSM) | Customer cases, accounts, contacts, products, SLAs | 11 |
| Security Operations & GRC | SecOps incidents, vulnerabilities, GRC risks, controls, threat intel | 11 |
| Flow Designer & Process Automation | Flows, subflows, triggers, executions, Process Automation playbooks | 10 |
| **Service Portal & UI Builder** *(new)* | Portals, pages, **widgets (create/update/deploy)**, Next Experience apps/pages, themes | 14 |
| **Integration Hub** *(new)* | REST Messages, Transform Maps, Import Sets, **Event Registry**, OAuth apps, credential aliases | 18 |
| **Notifications & Attachments** *(new)* | Email notifications, email logs, **file attachments (upload/list/delete)**, templates, subscriptions | 12 |
| **Performance Analytics** *(new)* | PA indicators/scorecards, time-series, dashboards, PA jobs, **data quality checks** | 13 |

---

## Authentication

Both **Basic Auth** and **OAuth 2.0** are fully supported across all client integrations:

| Method | Best For |
|--------|----------|
| Basic Auth | Development, personal instances, quick setup |
| OAuth 2.0 Client Credentials | Production deployments, service accounts |
| OAuth 2.0 Password Grant | Automated CI/CD pipelines |

---

## Permission System

A four-tier permission model keeps your instance safe by default:

| Tier | Environment Variable | Covers |
|------|---------------------|--------|
| 0 — Read | *(always on)* | All query and read operations |
| 1 — Write | `WRITE_ENABLED=true` | Create/update across ITSM, HRSD, CSM, Agile |
| 2 — CMDB Write | `CMDB_WRITE_ENABLED=true` | CI create/update in the CMDB |
| 3 — Scripting | `SCRIPTING_ENABLED=true` | Business rules, script includes, changesets |
| 4 — Now Assist | `NOW_ASSIST_ENABLED=true` | AI Agentic Playbooks, NLQ, AI Search |

---

## Role-Based Tool Packages

Set `MCP_TOOL_PACKAGE` to expose only the tools relevant to each persona:

| Package | Persona | Tools Included |
|---------|---------|---------------|
| `full` | Administrators | All 230+ tools |
| `service_desk` | L1/L2 Agents | Incidents, tasks, approvals, KB, SLA |
| `change_coordinator` | Change Managers | Changes (create/approve/close), CAB, CMDB, approvals |
| `knowledge_author` | KB Authors | Knowledge base create/publish |
| `catalog_builder` | Catalog Admins | Catalog, users, groups |
| `system_administrator` | Sys Admins | Users, groups, reports, logs, notifications, attachments, ACLs, PA |
| `platform_developer` | Developers | Scripts, UI Policies, UI Actions, ACLs, client scripts, ATF, changesets |
| `portal_developer` | Portal/UX Devs | Portals, pages, widgets (create/update), UI Policies, UI Actions, client scripts |
| `integration_engineer` | Integration Devs | REST Messages, Transform Maps, Import Sets, Events, OAuth, credentials |
| `itom_engineer` | ITOM Engineers | CMDB, Discovery, MID servers, events |
| `agile_manager` | Scrum Masters | Stories, epics, sprints |
| `ai_developer` | AI Builders | Now Assist, NLQ, Agentic Playbooks |

---

## Getting Started

### Prerequisites

- **Node.js 20+** — [nodejs.org](https://nodejs.org)
- A **ServiceNow instance** (free developer instance at [developer.servicenow.com](https://developer.servicenow.com))
- An AI client: Claude Desktop, Claude Code, Cursor, VS Code, or any OpenAI/Gemini-compatible client

### Install

```bash
# Option A — npm (recommended)
npm install -g now-ai-kit

# Option B — clone from source
git clone https://github.com/aartiq/nowaikit.git
cd nowaikit
npm install && npm run build
```

### Configure

```bash
cp .env.example .env
```

Edit `.env`:

```env
# ServiceNow instance URL (no trailing slash)
SERVICENOW_INSTANCE_URL=https://yourinstance.service-now.com

# Auth method: basic or oauth
SERVICENOW_AUTH_METHOD=basic
SERVICENOW_BASIC_USERNAME=your.username
SERVICENOW_BASIC_PASSWORD=your_password

# Permission gates (start with all off for safety)
WRITE_ENABLED=false
CMDB_WRITE_ENABLED=false
SCRIPTING_ENABLED=false
NOW_ASSIST_ENABLED=false

# Optional: limit tools to a role package
# MCP_TOOL_PACKAGE=service_desk
```

### Step 1: Get a ServiceNow Instance

If you don't have a ServiceNow instance, get a free Personal Developer Instance (PDI):

1. Go to [developer.servicenow.com](https://developer.servicenow.com)
2. Click **"Sign up and Start Building"** and create a free account
3. Request a PDI instance — it will be provisioned in minutes
4. Note your instance URL: `https://devXXXXXX.service-now.com`

### Step 2: Build now-ai-kit

```bash
git clone https://github.com/aartiq/nowaikit.git
cd nowaikit
npm install
npm run build
# Built files are in ./dist/
```

Or install globally:

```bash
npm install -g now-ai-kit
# Find the binary: which now-ai-kit
```

---

## Client Setup Guides

### Claude Desktop (Beginner)

**macOS/Linux:** Edit `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** Edit `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "now-ai-kit": {
      "command": "node",
      "args": ["/absolute/path/to/nowaikit/dist/server.js"],
      "env": {
        "SERVICENOW_INSTANCE_URL": "https://yourinstance.service-now.com",
        "SERVICENOW_AUTH_METHOD": "basic",
        "SERVICENOW_BASIC_USERNAME": "admin",
        "SERVICENOW_BASIC_PASSWORD": "your_password",
        "WRITE_ENABLED": "false"
      }
    }
  }
}
```

Restart Claude Desktop. The hammer icon in the bottom-left shows connected MCP servers.

**Advanced (OAuth 2.0 + write access + role package):**

```json
{
  "mcpServers": {
    "now-ai-kit": {
      "command": "node",
      "args": ["/absolute/path/to/nowaikit/dist/server.js"],
      "env": {
        "SERVICENOW_INSTANCE_URL": "https://yourinstance.service-now.com",
        "SERVICENOW_AUTH_METHOD": "oauth",
        "SERVICENOW_CLIENT_ID": "your_oauth_client_id",
        "SERVICENOW_CLIENT_SECRET": "your_oauth_client_secret",
        "SERVICENOW_USERNAME": "svc_account",
        "SERVICENOW_PASSWORD": "svc_password",
        "WRITE_ENABLED": "true",
        "SCRIPTING_ENABLED": "true",
        "MCP_TOOL_PACKAGE": "platform_developer"
      }
    }
  }
}
```

See [docs/SERVICENOW_OAUTH_SETUP.md](docs/SERVICENOW_OAUTH_SETUP.md) to create an OAuth application in ServiceNow.

---

### Claude Code / Claude CLI (Beginner)

```bash
# Add the MCP server (Basic Auth)
claude mcp add now-ai-kit node /absolute/path/to/nowaikit/dist/server.js \
  --env SERVICENOW_INSTANCE_URL=https://yourinstance.service-now.com \
  --env SERVICENOW_AUTH_METHOD=basic \
  --env SERVICENOW_BASIC_USERNAME=admin \
  --env SERVICENOW_BASIC_PASSWORD=your_password

# Verify it's registered
claude mcp list
```

**Advanced (project-scoped .mcp.json):**

Create `.mcp.json` in your project root to scope the server to that project:

```json
{
  "mcpServers": {
    "now-ai-kit": {
      "command": "node",
      "args": ["./dist/server.js"],
      "env": {
        "SERVICENOW_INSTANCE_URL": "https://yourinstance.service-now.com",
        "SERVICENOW_AUTH_METHOD": "oauth",
        "SERVICENOW_CLIENT_ID": "your_client_id",
        "SERVICENOW_CLIENT_SECRET": "your_secret",
        "SERVICENOW_USERNAME": "admin",
        "SERVICENOW_PASSWORD": "password",
        "WRITE_ENABLED": "true",
        "SCRIPTING_ENABLED": "true",
        "NOW_ASSIST_ENABLED": "true",
        "ATF_ENABLED": "true"
      }
    }
  }
}
```

---

### Cursor (Beginner)

Open Cursor → **Settings** → **MCP** → **Add Server**, or create `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "now-ai-kit": {
      "command": "node",
      "args": ["/absolute/path/to/nowaikit/dist/server.js"],
      "env": {
        "SERVICENOW_INSTANCE_URL": "https://yourinstance.service-now.com",
        "SERVICENOW_AUTH_METHOD": "basic",
        "SERVICENOW_BASIC_USERNAME": "admin",
        "SERVICENOW_BASIC_PASSWORD": "your_password"
      }
    }
  }
}
```

Reload Cursor. The server appears under **Tools** in the Composer panel.

**Advanced (developer package with scripting):**

```json
{
  "mcpServers": {
    "now-ai-kit": {
      "command": "node",
      "args": ["/absolute/path/to/nowaikit/dist/server.js"],
      "env": {
        "SERVICENOW_INSTANCE_URL": "https://yourinstance.service-now.com",
        "SERVICENOW_AUTH_METHOD": "basic",
        "SERVICENOW_BASIC_USERNAME": "admin",
        "SERVICENOW_BASIC_PASSWORD": "your_password",
        "WRITE_ENABLED": "true",
        "SCRIPTING_ENABLED": "true",
        "MCP_TOOL_PACKAGE": "portal_developer"
      }
    }
  }
}
```

---

### VS Code with GitHub Copilot (Beginner)

Install the **GitHub Copilot** extension, then add to your VS Code `settings.json`:

```json
{
  "github.copilot.chat.mcp.servers": {
    "now-ai-kit": {
      "command": "node",
      "args": ["/absolute/path/to/nowaikit/dist/server.js"],
      "env": {
        "SERVICENOW_INSTANCE_URL": "https://yourinstance.service-now.com",
        "SERVICENOW_AUTH_METHOD": "basic",
        "SERVICENOW_BASIC_USERNAME": "admin",
        "SERVICENOW_BASIC_PASSWORD": "your_password"
      }
    }
  }
}
```

Or create `.vscode/mcp.json` (workspace-scoped):

```json
{
  "servers": {
    "now-ai-kit": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/nowaikit/dist/server.js"],
      "env": {
        "SERVICENOW_INSTANCE_URL": "https://yourinstance.service-now.com",
        "SERVICENOW_AUTH_METHOD": "basic",
        "SERVICENOW_BASIC_USERNAME": "admin",
        "SERVICENOW_BASIC_PASSWORD": "your_password",
        "WRITE_ENABLED": "true"
      }
    }
  }
}
```

---

### VS Code with Continue.dev (Beginner)

Install the **Continue** extension, then add to `~/.continue/config.json`:

```json
{
  "mcpServers": [
    {
      "name": "now-ai-kit",
      "command": "node",
      "args": ["/absolute/path/to/nowaikit/dist/server.js"],
      "env": {
        "SERVICENOW_INSTANCE_URL": "https://yourinstance.service-now.com",
        "SERVICENOW_AUTH_METHOD": "basic",
        "SERVICENOW_BASIC_USERNAME": "admin",
        "SERVICENOW_BASIC_PASSWORD": "your_password"
      }
    }
  ]
}
```

---

### Windsurf (Codeium) (Beginner)

Open Windsurf → **Settings** → **AI** → **MCP Servers** → **Add Server**:

```json
{
  "mcpServers": {
    "now-ai-kit": {
      "command": "node",
      "args": ["/absolute/path/to/nowaikit/dist/server.js"],
      "env": {
        "SERVICENOW_INSTANCE_URL": "https://yourinstance.service-now.com",
        "SERVICENOW_AUTH_METHOD": "basic",
        "SERVICENOW_BASIC_USERNAME": "admin",
        "SERVICENOW_BASIC_PASSWORD": "your_password"
      }
    }
  }
}
```

---

### ChatGPT / OpenAI (Advanced — Custom GPT or API)

now-ai-kit exposes a standard MCP server over stdio. To connect to ChatGPT, use a bridge such as **mcp-proxy** to expose the server over HTTP/SSE, then register it as a ChatGPT plugin or connect via the OpenAI Assistants API with function calling.

**Step 1: Run now-ai-kit as an HTTP server via mcp-proxy:**

```bash
npm install -g mcp-proxy
mcp-proxy --port 3000 -- node /path/to/nowaikit/dist/server.js
```

**Step 2: Register as an OpenAI function tool (Assistants API):**

```python
from openai import OpenAI
client = OpenAI()

# Use the MCP tool descriptions as function schemas
# See docs/CLIENT_SETUP.md for full OpenAI Assistants example
assistant = client.beta.assistants.create(
    model="gpt-4o",
    tools=[{"type": "function", "function": now_ai_kit_tool_schema}]
)
```

See [clients/openai/SETUP.md](clients/openai/SETUP.md) for the full bridge setup.

---

### Google Gemini / Vertex AI (Advanced)

Use the MCP-to-HTTP bridge pattern (same as ChatGPT above) to expose now-ai-kit over HTTP, then connect to the Gemini API via function calling:

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    tools=[now_ai_kit_tool_definition]
)
```

See [clients/gemini/SETUP.md](clients/gemini/SETUP.md) for the full Vertex AI function calling setup.

---

### OpenAI Codex (Advanced)

Codex (via the OpenAI API) supports tool/function calling. Use the same bridge approach:

```bash
# Start now-ai-kit as HTTP/SSE proxy
mcp-proxy --port 3000 -- node /path/to/nowaikit/dist/server.js

# Then use the Responses API with tool definitions
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{"model":"o1","tools":[...]}'
```

See [clients/codex/SETUP.md](clients/codex/SETUP.md) for the full setup.

---

### Cline (VS Code Extension) (Beginner)

Install **Cline** from the VS Code marketplace, then in Cline settings → **MCP Servers**:

```json
{
  "now-ai-kit": {
    "command": "node",
    "args": ["/absolute/path/to/nowaikit/dist/server.js"],
    "env": {
      "SERVICENOW_INSTANCE_URL": "https://yourinstance.service-now.com",
      "SERVICENOW_AUTH_METHOD": "basic",
      "SERVICENOW_BASIC_USERNAME": "admin",
      "SERVICENOW_BASIC_PASSWORD": "your_password",
      "WRITE_ENABLED": "true"
    }
  }
}
```

---

### Amazon Q Developer (Advanced)

Amazon Q Developer supports MCP via its agent SDK. Add now-ai-kit as an MCP server in your Q Developer workspace config. See [docs/CLIENT_SETUP.md](docs/CLIENT_SETUP.md) for the full setup.

---

### JetBrains AI Assistant (Advanced)

In JetBrains IDE (IntelliJ, PyCharm, etc.) → **Settings** → **AI Assistant** → **MCP Servers** → **Add**:

```json
{
  "name": "now-ai-kit",
  "command": "node",
  "args": ["/absolute/path/to/nowaikit/dist/server.js"],
  "env": {
    "SERVICENOW_INSTANCE_URL": "https://yourinstance.service-now.com",
    "SERVICENOW_AUTH_METHOD": "basic",
    "SERVICENOW_BASIC_USERNAME": "admin",
    "SERVICENOW_BASIC_PASSWORD": "your_password"
  }
}
```

---

### Docker (Any Client)

```bash
# Build image
docker build -t now-ai-kit .

# Run as stdio MCP server (pipe to your AI client)
docker run --rm -i \
  -e SERVICENOW_INSTANCE_URL=https://yourinstance.service-now.com \
  -e SERVICENOW_AUTH_METHOD=basic \
  -e SERVICENOW_BASIC_USERNAME=admin \
  -e SERVICENOW_BASIC_PASSWORD=your_password \
  -e WRITE_ENABLED=false \
  now-ai-kit

# Or run via mcp-proxy for HTTP access
docker run --rm -p 3000:3000 \
  -e SERVICENOW_INSTANCE_URL=https://yourinstance.service-now.com \
  -e SERVICENOW_AUTH_METHOD=basic \
  -e SERVICENOW_BASIC_USERNAME=admin \
  -e SERVICENOW_BASIC_PASSWORD=your_password \
  now-ai-kit mcp-proxy --port 3000 -- node dist/server.js
```

For full setup guides for every client (including OAuth 2.0 variants), see [docs/CLIENT_SETUP.md](docs/CLIENT_SETUP.md).

---

## Example Interactions

Once connected, ask your AI assistant in plain language:

**ITSM & Change Management:**
```
Show me all open P1 incidents assigned to the Network Operations group.
```
```
Create a normal change request for deploying the new API gateway — implementation planned for Saturday midnight.
```
```
What CMDB CIs does the ERP application depend on?
```

**Scripting & Development:**
```
List all client scripts on the incident table and show me the ones that fire on form load.
```
```
Create a UI action button "Escalate to L3" on the incident form that assigns the ticket to the L3-Support group.
```
```
Show me all ACL rules for the change_request table that restrict the "delete" operation.
```

**Service Portal & UI Builder:**
```
List all widgets in the Service Portal that contain "catalog" in their name.
```
```
Get the full source code of the "Stock Ticker" widget so I can update its server script.
```
```
Create a new portal widget called "My Approvals Widget" with a simple Angular template that lists pending approvals.
```

**Integrations & Events:**
```
List all REST Message definitions that connect to external APIs.
```
```
Show me all transform maps that target the incident table.
```
```
Fire the custom event "myapp.ticket.escalated" on incident INC0012345.
```

**Notifications & Attachments:**
```
List all email notifications that trigger on the incident table when a comment is added.
```
```
Upload a screenshot of the error (base64) as an attachment to incident INC0012345.
```
```
Show me all failed email log entries from the last 24 hours.
```

**Performance Analytics & Data Quality:**
```
Get the current scorecard for the "Mean Time to Resolve" PA indicator with a 30-day trend.
```
```
Check the data completeness of the incident table — how many incidents are missing assignment_group or category?
```
```
Compare record counts across incident, change_request, and problem tables.
```

**ATF, Reporting & Scheduled Jobs:**
```
Run the Regression Test Suite and show me any failures with ATF Failure Insight details.
```
```
Summarise the last 30 days of incident trends by category.
```
```
Create a scheduled job that runs daily at 3am to archive closed incidents older than 90 days.
```

For 100+ real-world examples with expected inputs, outputs, and advanced workflows, see [EXAMPLES.md](EXAMPLES.md).

---

## Advanced Configuration

### OAuth 2.0

```env
SERVICENOW_AUTH_METHOD=oauth
SERVICENOW_INSTANCE_URL=https://yourinstance.service-now.com
SERVICENOW_CLIENT_ID=your_oauth_client_id
SERVICENOW_CLIENT_SECRET=your_oauth_client_secret
SERVICENOW_OAUTH_GRANT_TYPE=client_credentials
```

### Multi-Instance Setup

Manage multiple ServiceNow environments with `instances.json`:

```json
{
  "instances": [
    {
      "name": "production",
      "url": "https://prod.service-now.com",
      "authMethod": "oauth",
      "clientId": "...",
      "clientSecret": "..."
    },
    {
      "name": "dev",
      "url": "https://dev12345.service-now.com",
      "authMethod": "basic",
      "username": "admin",
      "password": "..."
    }
  ]
}
```

See [docs/MULTI_INSTANCE.md](docs/MULTI_INSTANCE.md) for full instructions.

### Docker

```bash
docker build -t now-ai-kit .
docker run -e SERVICENOW_INSTANCE_URL=https://yourinstance.service-now.com \
           -e SERVICENOW_AUTH_METHOD=basic \
           -e SERVICENOW_BASIC_USERNAME=admin \
           -e SERVICENOW_BASIC_PASSWORD=password \
           now-ai-kit
```

---

## See It In Action

These are real interactions you can have with your AI once now-ai-kit is connected:

**Operations — plain English:**
```
You: "Show me all P1 incidents opened this week that are still unresolved"
You: "Which assignment groups have the most open incidents right now?"
You: "Find all change requests scheduled for this weekend"
You: "Is any SLA about to breach in the next 2 hours?"
```

**Development — AI writes and deploys for you:**
```
You: "Create a business rule that auto-assigns high-priority incidents to the NOC group"
You: "Write a client script that validates email format on the contact form"
You: "Create a Service Portal widget that shows my team's open tasks"
You: "Set up a REST Message integration to send alerts to our Slack channel"
```

**AI-powered intelligence:**
```
You: "Summarise this incident and suggest a resolution based on similar past cases"
You: "Use Predictive Intelligence to categorise this new incident description"
You: "Trigger the SOC Agentic Playbook for this security incident"
You: "What's the trend in P2 incidents over the last 6 months?"
```

**Advanced automation:**
```
You: "Compare record counts between prod and dev for the incident table"
You: "Check data completeness on the cmdb_ci_server table — which fields are mostly empty?"
You: "Run the nightly sync transform map on the latest import set"
You: "Create a scheduled job that emails the on-call team daily at 7am"
```

See [EXAMPLES.md](EXAMPLES.md) for 120+ real-world examples across all 21 modules.

---

## Supported AI Clients

**Any MCP-compatible AI agent works.** Tested and documented for:

| Client | Type | Auth Methods | Config Guide |
|--------|------|-------------|-------------|
| Claude Desktop | Desktop app | Basic, OAuth 2.0 | [clients/claude-desktop/SETUP.md](clients/claude-desktop/SETUP.md) |
| Claude Code | CLI / IDE | Basic, OAuth 2.0 | [clients/claude-code/SETUP.md](clients/claude-code/SETUP.md) |
| ChatGPT / OpenAI | API / Web | Basic, OAuth 2.0 | [clients/openai/SETUP.md](clients/openai/SETUP.md) |
| Gemini / Vertex AI | API / CLI | Basic, OAuth 2.0 | [clients/gemini/SETUP.md](clients/gemini/SETUP.md) |
| Grok (xAI) | API / Web | Basic, OAuth 2.0 | [docs/CLIENT_SETUP.md](docs/CLIENT_SETUP.md) |
| Cursor | AI code editor | Basic, OAuth 2.0 | [clients/cursor/SETUP.md](clients/cursor/SETUP.md) |
| Windsurf (Codeium) | AI code editor | Basic, OAuth 2.0 | [docs/CLIENT_SETUP.md](docs/CLIENT_SETUP.md) |
| GitHub Copilot (VS Code) | IDE extension | Basic, OAuth 2.0 | [clients/vscode/SETUP.md](clients/vscode/SETUP.md) |
| Continue.dev | VS Code / JetBrains | Basic, OAuth 2.0 | [docs/CLIENT_SETUP.md](docs/CLIENT_SETUP.md) |
| Cline | VS Code extension | Basic, OAuth 2.0 | [docs/CLIENT_SETUP.md](docs/CLIENT_SETUP.md) |
| Amazon Q Developer | IDE / CLI | Basic, OAuth 2.0 | [docs/CLIENT_SETUP.md](docs/CLIENT_SETUP.md) |
| JetBrains AI Assistant | IDE plugin | Basic, OAuth 2.0 | [docs/CLIENT_SETUP.md](docs/CLIENT_SETUP.md) |
| Zed | AI editor | Basic, OAuth 2.0 | [docs/CLIENT_SETUP.md](docs/CLIENT_SETUP.md) |
| Ollama (local models) | Local runtime | Basic | [docs/CLIENT_SETUP.md](docs/CLIENT_SETUP.md) |

---

## What's New in v2.1

- **230+ tools** across 21 domain modules (+76 from v2.0)
- **4 new modules**: Service Portal & UI Builder, Integration Hub, Notifications & Attachments, Performance Analytics & Data Quality
- **Scripting enhancements** — UI Policies, UI Actions, ACL management (11 new tools)
- **Reporting enhancements** — scheduled job CRUD + run history (5 new tools)
- **Now Assist** — `generate_work_notes` AI-drafted work notes for any record
- **2 new role packages** — `portal_developer`, `integration_engineer`
- **Binary file upload** — `uploadAttachment()` via ServiceNow Attachment API
- **Server version** bumped to 2.1.0

## What's New in v2.0

- **154 tools** across 17 domain modules (up from 16 tools in v1.0)
- **HRSD module** — HR cases, services, profiles, onboarding/offboarding workflows
- **CSM module** — Customer cases, accounts, contacts, products, SLA tracking
- **Security Operations & GRC** — SecOps incidents, vulnerabilities, risks, controls, threat intel
- **Flow Designer** — List, inspect, trigger, and monitor flows and subflows
- **OAuth 2.0** for all six AI clients
- **Role-based tool packages** — 10 persona-specific packages
- **Now Assist Agentic Playbooks** — latest release AI automation
- **ATF Failure Insight** — latest release test failure diagnostics
- **61 unit tests** covering all permission tiers, routing, and domain handlers
- **Complete documentation** — 8 reference guides in `docs/`

---

## Documentation

| Guide | Description |
|-------|-------------|
| [docs/TOOLS.md](docs/TOOLS.md) | Complete reference for all 230+ tools with parameters, return types, and permission requirements |
| [docs/CLIENT_SETUP.md](docs/CLIENT_SETUP.md) | Step-by-step beginner + advanced setup for all AI clients (Claude, ChatGPT, Gemini, Cursor, VS Code, Windsurf, Continue, Cline, Codex, JetBrains, Ollama) |
| [docs/TOOL_PACKAGES.md](docs/TOOL_PACKAGES.md) | Role-based package reference — which tools each of the 12 persona packages includes |
| [docs/NOW_ASSIST.md](docs/NOW_ASSIST.md) | Now Assist and AI integration guide — NLQ, AI Search, Agentic Playbooks |
| [docs/ATF.md](docs/ATF.md) | ATF testing guide — suites, test runs, ATF Failure Insight |
| [docs/SCRIPTING.md](docs/SCRIPTING.md) | Scripting management — business rules, script includes, UI Policies, UI Actions, ACLs, changesets |
| [docs/REPORTING.md](docs/REPORTING.md) | Reporting and analytics — aggregate queries, Performance Analytics, scheduled jobs |
| [docs/MULTI_INSTANCE.md](docs/MULTI_INSTANCE.md) | Multi-instance configuration via `instances.json` or environment variables |
| [docs/SERVICENOW_OAUTH_SETUP.md](docs/SERVICENOW_OAUTH_SETUP.md) | Creating an OAuth application in ServiceNow for secure API access |
| [EXAMPLES.md](EXAMPLES.md) | 100+ real-world examples with inputs, outputs, and advanced workflows |

---

## Development

```bash
# Install dependencies
npm install

# Run in development mode (hot reload)
npm run dev

# Build
npm run build

# Run all tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

### Project Structure

```
src/
  server.ts              — MCP server entry point
  servicenow/
    client.ts            — ServiceNow REST API client (Basic + OAuth + Attachment API)
    types.ts             — Full TypeScript type definitions
  tools/
    index.ts             — Tool router & role-based package system (12 packages)
    core.ts              — Core platform & CMDB (16 tools)
    incident.ts          — Incident management (9 tools)
    problem.ts           — Problem management (4 tools)
    change.ts            — Change management (6 tools)
    task.ts              — Task management (4 tools)
    knowledge.ts         — Knowledge base (6 tools)
    catalog.ts           — Service catalog & approvals (10 tools)
    user.ts              — User & group management (8 tools)
    reporting.ts         — Reporting, analytics & scheduled jobs (13 tools)
    atf.ts               — ATF testing (9 tools)
    now-assist.ts        — Now Assist / AI (10 tools)
    script.ts            — Scripting, UI Policies, UI Actions, ACLs (28 tools)
    agile.ts             — Agile / Scrum (9 tools)
    hrsd.ts              — HR Service Delivery (12 tools)
    csm.ts               — Customer Service Management (11 tools)
    security.ts          — Security Operations & GRC (11 tools)
    flow.ts              — Flow Designer & Process Automation (10 tools)
    portal.ts            — Service Portal & UI Builder (14 tools) ★ new
    integration.ts       — REST Messages, Transform Maps, Events (18 tools) ★ new
    notification.ts      — Notifications, Email, Attachments (12 tools) ★ new
    performance.ts       — Performance Analytics & Data Quality (13 tools) ★ new
  utils/
    permissions.ts       — Five-tier permission gate functions
    errors.ts            — Typed error classes
    logging.ts           — Structured logger
tests/
  tools/                 — Unit tests
docs/                    — Reference documentation (8 guides)
clients/                 — Per-client setup and config files
  claude-desktop/
  claude-code/
  cursor/
  vscode/
  codex/
  gemini/
```

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

- Bug reports and feature requests: [open an issue](../../issues)
- New tool domains, additional tests, or documentation improvements are especially appreciated
- All PRs require `npm test` to pass

---

## Security

If you discover a security vulnerability, please follow the responsible disclosure process in [SECURITY.md](SECURITY.md). Do not open a public issue.

---

## Frequently Asked Questions

**Do I need to know the ServiceNow API to use this?**
No. For beginners, you just connect your AI and ask questions in plain English. The kit handles all API calls automatically.

**Which ServiceNow versions are supported?**
All currently supported ServiceNow releases (Xanadu, Washingon DC, Vancouver, and later). The toolkit targets the latest available APIs.

**Can I use this on a free Personal Developer Instance (PDI)?**
Yes. Get a free PDI at [developer.servicenow.com](https://developer.servicenow.com) and connect in 5 minutes.

**Is it safe to use on production?**
Yes. The permission system is read-only by default. Write, scripting, and Now Assist capabilities must each be explicitly enabled with environment variables. Use role packages to limit the tool surface.

**Can I use multiple AI providers at the same time?**
Yes. Each AI client gets its own MCP config pointing at the same (or different) now-ai-kit instance. Run Claude Desktop and Cursor side by side against the same ServiceNow environment.

**Does it support multi-instance?**
Yes — prod, staging, and dev instances simultaneously. See [docs/MULTI_INSTANCE.md](docs/MULTI_INSTANCE.md).

**Is it free?**
Completely free and open-source under the MIT license.

---

## License

[MIT](LICENSE) — free for personal and commercial use.

---

<div align="center">

### The complete ServiceNow AI toolkit — for beginners, developers, and architects.

**now-ai-kit** &bull; ServiceNow MCP Server &bull; ServiceNow AI Agent &bull; ServiceNow Claude Integration &bull; ServiceNow ChatGPT &bull; ServiceNow Cursor &bull; ServiceNow Automation &bull; ServiceNow Developer Tools

If now-ai-kit saves you time, please star the repository — it helps others find the project.

[![GitHub Stars](https://img.shields.io/github/stars/aartiq/nowaikit?style=social)](../../stargazers)

</div>
