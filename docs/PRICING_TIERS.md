# NowAIKit — Pricing & License Tiers

NowAIKit uses a three-tier licensing model controlled by the `LICENSE_TIER` environment variable.

## Tiers at a Glance

| Feature | Free | Pro ($9.99/user/mo) | Enterprise (Custom) |
|---------|:----:|:-------------------:|:-------------------:|
| All 400+ tools (31+ modules) | ✓ | ✓ | ✓ |
| All auth methods (Basic, OAuth, SSO) | ✓ | ✓ | ✓ |
| All 31+ ServiceNow modules | ✓ | ✓ | ✓ |
| All AI clients (Claude, ChatGPT, Gemini, etc.) | ✓ | ✓ | ✓ |
| Single ServiceNow instance | ✓ | ✓ | ✓ |
| Multi-instance management | — | ✓ | ✓ |
| HTTP API server & web dashboard | — | ✓ | ✓ |
| Desktop app (Electron) | — | ✓ | ✓ |
| Multi-provider AI chat | — | ✓ | ✓ |
| Role-based tool packages (14 personas) | — | ✓ | ✓ |
| Slash commands & prompts | — | ✓ | ✓ |
| Priority support | — | ✓ | ✓ |
| SSO / OIDC management (Okta, Azure AD, Ping) | — | — | ✓ |
| Audit logging (JSONL + SIEM webhooks) | — | — | ✓ |
| Org policy governance (MDM/GPO) | — | — | ✓ |
| On-prem / private-cloud hosting | — | — | ✓ |
| Dedicated support & onboarding | — | — | ✓ |

## Configuration

Set `LICENSE_TIER` in your `.env` file or environment:

```bash
# Free (open-source — all 400+ tools, all auth, all modules, single instance)
LICENSE_TIER=free

# Pro (everything in Free + multi-instance + HTTP API + desktop + AI chat)
LICENSE_TIER=pro

# Enterprise (everything in Pro + SSO management + audit + org policy + on-prem)
LICENSE_TIER=enterprise
```

Default is `enterprise` (all features enabled) to preserve backward compatibility for existing users.

## Free Tier — Open-Source Core

The free tier is the MIT-licensed open-source distribution. It includes:

- **All 400+ tools** across all 31+ ServiceNow modules
- **All auth methods**: Basic, OAuth 2.0, SSO supported
- **All AI clients**: Claude Desktop, ChatGPT, Gemini, Cursor, VS Code, and all latest models supported
- **Single instance**: One ServiceNow connection
- **MCP protocol**: Full MCP compliance for Claude Desktop, Cursor, etc.

## Pro Tier

The Pro tier adds team and productivity features on top of Free:

- **Multi-instance**: Connect to dev, staging, prod, or multiple customer instances
- **HTTP API server**: REST API for web app integration
- **Desktop app**: Electron app with system tray
- **Multi-provider AI chat**: Claude Opus 4.6/Sonnet 4.6, GPT-4.1, Gemini 2.5 Pro, Groq, OpenRouter + all latest models supported
- **14 role-based tool packages**: Service desk, change coordinator, sysadmin, etc.
- **Slash commands & prompts**: Pre-built workflows
- **Priority support**: Faster response times

### Pricing

| Plan | Monthly | Annual (20% off) |
|------|---------|-------------------|
| Pro | $9.99/user/month | $7.99/user/month |

## Enterprise Tier

Enterprise adds governance, compliance, and hosting features:

- **SSO / OIDC management**: Okta, Azure AD / Entra ID, Ping Identity, any OIDC provider
- **Audit logging**: JSONL file + SIEM webhook (Splunk, Datadog, etc.)
- **Org policy**: Lock tool packages, enforce SSO, whitelist instances via MDM/GPO
- **On-premises hosting**: Self-hosted on your infrastructure / private cloud
- **Dedicated support**: Named account manager, onboarding assistance

### Pricing

Custom pricing — [contact sales](https://nowaikit.com/#pricing).

## Repository Structure

| Repository | Visibility | Contents |
|------------|-----------|----------|
| `aartiq/nowaikit` (main branch) | Public | Free tier — MIT licensed open-source core |
| `aartiq/nowaikit-pro` | **Private** | Pro + Enterprise — all features |

The free repo (`nowaikit` main branch) sets `LICENSE_TIER=free` by default. The private pro repo sets `LICENSE_TIER=enterprise` and includes the full tool set, desktop app, HTTP API, SSO, audit, and org policy modules.

## Upgrading

To upgrade from free to pro:

1. Get access to the private `nowaikit-pro` repository
2. Set `LICENSE_TIER=pro` (or `enterprise`) in your `.env`
3. Restart the server

All configuration (instance URLs, credentials, tool packages) carries over — the tier only controls which features are active.
