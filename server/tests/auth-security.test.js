import test from 'node:test';
import assert from 'node:assert/strict';
import { getSigningSecret, validateResetRequest, productionReady } from '../utils/authSecurity.js';

test('reset rejects missing, expired, exhausted, and mismatched recovery codes', () => {
  const body={email:'audit@example.test',otp:'123456',newPassword:'valid-test-password'};
  const record={code:'123456',expiresAt:2000,attempts:0};
  assert.equal(validateResetRequest(undefined,{email:body.email,newPassword:body.newPassword},1000),false);
  assert.equal(validateResetRequest(record,body,1000),true);
  assert.equal(validateResetRequest(record,body,2000),false);
  assert.equal(validateResetRequest({...record,attempts:5},body,1000),false);
  assert.equal(validateResetRequest(record,{...body,otp:'654321'},1000),false);
  assert.equal(validateResetRequest(record,{...body,newPassword:'short'},1000),false);
});
test('production requires an explicitly configured signing secret', () => {
  const oldMode=process.env.NODE_ENV, oldSecret=process.env.JWT_SECRET;
  try {
    process.env.NODE_ENV='production'; delete process.env.JWT_SECRET;
    assert.throws(getSigningSecret,/must be configured/);
    process.env.JWT_SECRET='placeholder-for-test-only-at-least-32-characters';
    assert.equal(getSigningSecret(),'placeholder-for-test-only-at-least-32-characters');
  } finally {
    if(oldMode===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=oldMode;
    if(oldSecret===undefined)delete process.env.JWT_SECRET;else process.env.JWT_SECRET=oldSecret;
  }
});


test('production cannot fall back to a mock database or weak JWT secret', () => {
 const env = {NODE_ENV:'production', JWT_SECRET:'x'.repeat(32)};
 assert.equal(productionReady(0,env),false);
 assert.equal(productionReady(1,env),true);
 assert.equal(productionReady(1,{...env,JWT_SECRET:'weak'}),false);
 assert.equal(productionReady(0,{NODE_ENV:'development'}),true);
});
