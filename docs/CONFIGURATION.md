# Configuration reference

Every NowAIKit setting is an environment variable, set in your AI client's MCP config (or your shell
for the CLI). `nowaikit setup` writes the common ones for you. This page is the full list.

## Connection and authentication

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVICENOW_INSTANCE_URL` | (required) | e.g. `https://yourcompany.service-now.com` |
| `SERVICENOW_AUTH_METHOD` | `basic` | `basic` or `oauth` |
| `SERVICENOW_BASIC_USERNAME` / `SERVICENOW_BASIC_PASSWORD` | | Basic-auth credentials. |
| `SERVICENOW_OAUTH_CLIENT_ID` / `SERVICENOW_OAUTH_CLIENT_SECRET` | | OAuth app credentials. |
| `SERVICENOW_BEARER_TOKEN` | | A pre-obtained access token. Lets a process connect with only a token (used by gateways). |

For per-user OAuth login from the CLI, use `nowaikit auth login`, see
[OAuth setup](SERVICENOW_OAUTH_SETUP.md).

## Capability tiers (opt-in, off by default)

NowAIKit is read-only until you enable these. Each is a ceiling, see
[Delegated auth](DELEGATED_AUTH.md) for how they combine with per-request flags.

| Variable | Default | Description |
|----------|---------|-------------|
| `WRITE_ENABLED` | `false` | Allow create/update/delete. |
| `CMDB_WRITE_ENABLED` | `false` | Allow CMDB writes (needs `WRITE_ENABLED` too). |
| `SCRIPTING_ENABLED` | `false` | Allow server-side script execution. |
| `ATF_ENABLED` | `false` | Allow ATF test execution. |
| `NOW_ASSIST_ENABLED` | `false` | Allow Now Assist / generative AI tools. |

## Tool loading

| Variable | Default | Description |
|----------|---------|-------------|
| `MCP_TOOL_DISCOVERY` | (unset) | `lean` advertises a small core plus `search_tools` and reaches the full catalog on demand. `core` advertises only the core CRUD tools. Unset advertises the whole package. Use `lean` for clients that cap tool count (Claude cloud tasks cap at 500). See [Tool packages](TOOL_PACKAGES.md). |
| `MCP_TOOL_PACKAGE` | `full` | Load a role-specific subset. See [Tool packages](TOOL_PACKAGES.md). |

`nowaikit setup` writes `MCP_TOOL_DISCOVERY=lean` for the full package by default, so a fresh install
stays under client caps while keeping every tool reachable.

## Reliability

| Variable | Default | Description |
|----------|---------|-------------|
| `MAX_RETRIES` | `3` | Retries for failed reads. `0` means no retries (honored literally). Non-idempotent writes are never auto-retried when the response was lost, so a create can't be silently duplicated. |
| `RETRY_DELAY_MS` | `1000` | Base backoff between retries (exponential). |
| `REQUEST_TIMEOUT_MS` | `30000` | Per-request timeout. |

## Delegated auth (gateways, multi-tenant, backend-managed OAuth)

| Variable | Default | Description |
|----------|---------|-------------|
| `DELEGATED_AUTH` | (unset) | `true` enables delegated mode; `strict` requires a valid delegated token on every call and never falls back to base credentials. |
| `NOWAIKIT_REQUIRE_DELEGATION` | `false` | `true` enforces strict on top of `DELEGATED_AUTH=true`. |
| `NOWAIKIT_DELEGATED_SECRET` | | Shared secret that proves a request came from your trusted gateway. Set this in any real delegated deployment. |

Full contract (headers, error codes, capability model): [Delegated auth](DELEGATED_AUTH.md).

## CLI and misc

| Variable | Default | Description |
|----------|---------|-------------|
| `NOWAIKIT_OAUTH_PORT` | `8765` | Loopback port for the browser OAuth flow (`nowaikit auth login`). Change it only if 8765 is taken, and register the matching redirect URL. |
| `NOWAIKIT_CLAUDE_BIN` / `NOWAIKIT_CODEX_BIN` | `claude` / `codex` | Path to the CLI binary when using the `claude-cli` / `codex-cli` provider or the web dashboard's Claude Code subscription option. |
| `NOWAIKIT_NO_UPDATE_CHECK` | `0` | `1` disables the startup update check. |
| `SN_INSTANCE_GROUP` / `SN_INSTANCE_ENVIRONMENT` | | Optional labels for multi-instance setups. |
