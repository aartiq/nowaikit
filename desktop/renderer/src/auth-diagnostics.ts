/**
 * Actionable ServiceNow auth-failure diagnostics — kept in sync with the CLI/MCP
 * (nowaikit src/servicenow/client.ts) and the cloud (nowaikit-cloud/lib/auth-diagnostics.ts)
 * per the global rulebook: a 401/403 must never be a dead end. Append these to the raw
 * error message so desktop users get a checklist, not a bare "not authenticated".
 */

export function basicAuthDiagnostic(): string {
  return [
    'Basic auth was rejected by the instance (HTTP 401). Common causes, in order:',
    '  1. Username must be the login user_name, not the email or display name.',
    '  2. The account needs a valid LOCAL password. If it is SSO/SAML-federated, browser login works',
    '     but Basic REST does not (no local password). Use a dedicated local integration user.',
    '  3. ServiceNow’s "Basic Auth Restriction" may be blocking Basic auth. The account needs the',
    '     snc_basic_auth_api_access role, or must be a Web Service Access Only (WSAO) account.',
    '  4. A corporate proxy may be stripping the Authorization header (arrives as "guest"). Test from',
    '     a different network / phone hotspot.',
    '  5. Confirm the account is active, not locked out, and not flagged password-reset-required.',
    '  6. If the instance restricts Basic auth, switch this connection to OAuth (the recommended path).',
    '  Docs: https://www.servicenow.com/community/itsm-articles/review-basic-authentication-account-security/ta-p/3555125',
  ].join('\n');
}

export function forbiddenDiagnostic(oauth: boolean): string {
  const lines = [
    'Authenticated, but not authorized for this operation (HTTP 403). Common causes:',
    '  1. The account is missing the roles this needs (e.g. itil for ITSM, or admin for config tables).',
  ];
  if (oauth) {
    lines.push(
      '  2. Your OAuth app/token is missing API scope. Grant the required scope (e.g. "useraccount") in',
      '     the OAuth application registry, and make sure the token’s user actually holds the roles.',
    );
  }
  lines.push(
    '  3. Writes need write access AND the user’s write roles.',
    '  4. An ACL on the specific table may be denying access even with the role.',
  );
  return lines.join('\n');
}

/** Append the right checklist if the error looks like a ServiceNow 401/403. */
export function withAuthDiagnostic(message: string, authType: 'basic' | 'oauth' | undefined): string {
  const m = message || '';
  if (/\b401\b|not authenticated|authentication.failed|unauthorized/i.test(m)) {
    return `${m}\n\n${basicAuthDiagnostic()}`;
  }
  if (/\b403\b|forbidden|insufficient|not authorized/i.test(m)) {
    return `${m}\n\n${forbiddenDiagnostic(authType === 'oauth')}`;
  }
  return m;
}
