# Optional: server-side script execution helper

ServiceNow has **no supported REST endpoint** for running arbitrary background scripts, so
`execute_script`, `execute_background_script`, and `run_fix_script` cannot run server-side code out of
the box. They return a clear `SCRIPT_EXEC_UNAVAILABLE` message unless you install this optional helper.

This helper is **opt-in and auditable on purpose**: it is an arbitrary-code-execution endpoint, so you
should review it, scope it, and protect it. Do not install it on an instance where that is not
acceptable. NowAIKit never creates it for you.

## What it is

A single scoped **Scripted REST API** that accepts `{ "script": "...", "scope": "global" }`, evaluates
it, and returns the result. Protect the endpoint with a dedicated ACL/role (below) so only your
integration user can call it.

## Install (review first, then run once in Scripts - Background as admin)

```javascript
// Creates a Scripted REST API: POST /api/<app>/nowaikit_exec/run
(function () {
  var api = new GlideRecord('sys_ws_definition');
  api.initialize();
  api.name = 'NowAIKit Script Exec';
  api.service_id = 'nowaikit_exec';           // base path segment
  api.active = true;
  var apiId = api.insert();

  var op = new GlideRecord('sys_ws_operation');
  op.initialize();
  op.web_service_definition = apiId;
  op.name = 'run';
  op.http_method = 'POST';
  op.relative_path = '/run';
  // Require a role you control (see below). Change 'x_nowaikit_exec' to your role.
  op.operation_script =
    "(function process(request, response) {\n" +
    "  if (!gs.hasRole('x_nowaikit_exec')) { response.setStatus(403); return { error: 'forbidden' }; }\n" +
    "  var body = request.body.data || {};\n" +
    "  try {\n" +
    "    var evaluator = new GlideScopedEvaluator();\n" +
    "    var result = evaluator.evaluateScript(null, null, body.script);\n" +
    "    return { ok: true, result: result };\n" +
    "  } catch (e) { response.setStatus(400); return { ok: false, error: '' + e }; }\n" +
    "})(request, response);";
  op.insert();

  gs.info('NowAIKit script-exec API created. Path: /api/' + gs.getProperty('glide.appcreator.company.code') + '/nowaikit_exec/run');
})();
```

Create a role (e.g. `x_nowaikit_exec`) and grant it only to your NowAIKit integration user, then lock
the Scripted REST operation to that role (ACL). Rotate/remove when no longer needed.

## Point NowAIKit at it

Set the endpoint path in the environment NowAIKit runs with:

```
SCRIPT_EXEC_ENDPOINT=/api/<yourvendorprefix>/nowaikit_exec/run
```

With that set, `execute_script` / `execute_background_script` / `run_fix_script` POST to the helper and
return its result. Without it, they fail cleanly with guidance to use the Table API or the ServiceNow UI.

## Security notes

- This grants server-side code execution to whoever can call the endpoint. Gate it with a dedicated
  role + ACL, never leave it open.
- Prefer the Table API tools (`create_record` / `update_record` / `query_records`) for data changes;
  reserve the script helper for genuine scripting needs.
- On hardened instances, creating the Scripted REST API or the eval may itself be blocked by data
  policies / scripted ACLs — that is expected and you should not work around your own hardening.
