// Extends the native Error with an HTTP status code so widget components
// can show status-specific messages (401 = expired session, 403 = unauthorized (contact admin))
export type TokenError = Error & { status?: number };
