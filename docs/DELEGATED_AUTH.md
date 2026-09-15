# Delegated authentication (multi-tenant and backend-managed OAuth)

Delegated auth lets a trusted backend run one NowAIKit process (or a subprocess per user) and pass the
current user's identity and ServiceNow token on each request, instead of NowAIKit holding a single set
of credentials. Your backend owns the OAuth lifecycle (authorization, token storage, refresh,
revocation); NowAIKit just receives a token per call and runs as that user.

This is the supported pattern for embedding NowAIKit in your own product, for a shared gateway that
serves many customers, and for per-user OAuth where you never want NowAIKit to fall back to a shared
service account.

## The three modes

Set with the `DELEGATED_AUTH` environment variable:

| Value | Behavior |
|-------|----------|
| unset (default) | Single-identity mode. NowAIKit uses the credentials it was configured with. |
| `true` | Delegated mode. If a request carries a delegated token, NowAIKit runs as that user against that token's instance. If a request has no token, it falls back to the configured base client. |
| `strict` | Strict delegated mode. Every request must carry a valid gateway secret and a delegated token. A missing or invalid delegation is rejected before any tool runs, and NowAIKit never falls back to base credentials. |

`NOWAIKIT_REQUIRE_DELEGATION=true` turns on strict enforcement on top of `DELEGATED_AUTH=true`, if you
prefer to keep the two settings separate. Either one enables strict behavior.

For a hard boundary in strict mode, run the process with no base credentials at all (no basic
username/password, no `SERVICENOW_BEARER_TOKEN`). Then there is nothing to fall back to even in code.

## The request contract

Delegated context is read from inbound HTTP headers on the streamable-HTTP transport. All header names
are lowercase.

| Header | Purpose |
|--------|---------|
| `x-nowaikit-gateway-secret` | Proves the request came from your trusted gateway. Must equal `NOWAIKIT_DELEGATED_SECRET` (constant-time compared). Required when that secret is set. |
| `x-servicenow-token` | The user's ServiceNow access token (bearer). NowAIKit calls ServiceNow as this user. |
| `x-servicenow-instance-url` | The instance this request targets. Lets one shared server serve many instances. |
| `x-nowaikit-user` | Optional. The user identifier, for audit. |
| `x-nowaikit-tool-package` | Optional. Restrict this request to a role package. |
| `x-nowaikit-write-enabled` | `true` to allow writes for this request (still capped by the server, see below). |
| `x-nowaikit-cmdb-write-enabled` | `true` to allow CMDB writes for this request. |
| `x-nowaikit-scripting-enabled` | `true` to allow scripting for this request. |
| `x-nowaikit-atf-enabled` | `true` to allow ATF execution for this request. |
| `x-nowaikit-now-assist-enabled` | `true` to allow Now Assist tools for this request. |

### The gateway secret

When `NOWAIKIT_DELEGATED_SECRET` is set, NowAIKit only trusts delegated headers if the request carries a
matching `x-nowaikit-gateway-secret`. A request without the correct secret gets no token and no
capability flags (it fails closed), so a client cannot forge its own identity or permissions. Set this
secret in any real deployment.

## The capability model

Permission flags are ceiling-limited. The server's environment sets the maximum (for example
`WRITE_ENABLED=true`), and a delegated request can only narrow it, never widen it. The effective
capability is `(server env AND delegated flag)`. A forged or over-permissive delegated flag can never
enable a tier the operator left off. So a request is allowed to write only when the server has
`WRITE_ENABLED=true` and the request sent `x-nowaikit-write-enabled: true`.

## Errors in strict mode

| Error code | Meaning |
|------------|---------|
| `DELEGATION_REQUIRED` | Strict mode is on and the request had no valid delegated token (missing token, or a gateway secret that did not match). The tool did not run and no base credentials were used. |
| `DELEGATION_INCOMPATIBLE_TOOL` | The request called a tool that resolves a client from the instance manager rather than the per-request identity. These are refused under strict mode. |

### Tools not available under strict mode

These operate on server-configured instances, not the delegated identity, so they are refused when
strict mode is on: `compare_instances`, `switch_instance`, `get_current_instance`, `list_instances`.
Exclude them from the exposed set with a tool package or allowlist if you want them hidden entirely.

## Reliability for writes

In a delegated deployment you are often creating records on behalf of users, so duplicate writes
matter. NowAIKit will not auto-retry a non-idempotent write (a create, for example) when the response
was lost to a network error or timeout, because the write may already have committed. Reads still
retry. To turn off retries entirely, set `MAX_RETRIES=0` (this is honored literally). See
[Configuration](CONFIGURATION.md) for the retry settings.

## Example

A backend that runs one subprocess per user and injects the current token:

```
# environment for the NowAIKit subprocess
DELEGATED_AUTH=strict
NOWAIKIT_DELEGATED_SECRET=<a long random secret shared with your gateway>
WRITE_ENABLED=true            # ceiling; each request still opts in per call
# no base credentials configured
```

Each tool request your gateway forwards:

```
x-nowaikit-gateway-secret: <the same secret>
x-servicenow-token: <the user's current ServiceNow access token>
x-servicenow-instance-url: https://yourcustomer.service-now.com
x-nowaikit-write-enabled: true
```

If the secret is wrong or the token is missing, the call is rejected with `DELEGATION_REQUIRED` before
any tool executes, and nothing runs as a shared account.

## Notes

- All of this is in the mainline package. There is no fork or patch to maintain, and the flags, headers
  and error codes are a stable contract. Changes are recorded in the [changelog](../CHANGELOG.md) so you
  can pin a version and validate across upgrades.
- Strict mode and the retry behavior are opt-in and do not change single-identity deployments.
