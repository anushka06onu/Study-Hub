export function getSigningSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.trim()) return secret;
  if (process.env.NODE_ENV === 'production') throw new Error('JWT_SECRET must be configured in production');
  return 'studyhub-dev-secret';
}

export function validateResetRequest(record, body, now = Date.now()) {
  return Boolean(
    record && typeof body.email === 'string' && body.email.trim() &&
    typeof body.otp === 'string' && /^\d{6}$/.test(body.otp) &&
    typeof body.newPassword === 'string' && body.newPassword.length >= 8 &&
    record.code === body.otp && record.expiresAt > now && record.attempts < 5
  );
}
