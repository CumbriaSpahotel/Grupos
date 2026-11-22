const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');

test('default Firestore rules fail closed', () => {
  const s = read('firestore.rules');
  assert.match(s, /allow read, write:\s*if false/);
  assert.doesNotMatch(s, /allow\s+(?:read|write|read, write):\s*if true/);
});

test('staging access requires a Firebase UID and server-side membership', () => {
  const s = read('firestore.auth-staging.rules');
  assert.match(s, /request\.auth\.uid/);
  assert.match(s, /access_members/);
  assert.match(s, /allow write:\s*if false/);
  assert.doesNotMatch(s, /allow\s+(?:read|write|read, write):\s*if true/);
});

test('login no longer relies on hard-coded default PIN', () => {
  const s = read('index.html');
  assert.match(s, /NexusFirebaseAccess\.login/);
  assert.doesNotMatch(s, /pass:\s*["']1234["']/);
  assert.doesNotMatch(s, /String\(matchedUser\.pass\)/);
});

test('Firebase outage does not simulate successful persistence', () => {
  const s = read('js/firebase-init.js');
  assert.match(s, /No se ha guardado ningún cambio/);
  assert.doesNotMatch(s, /set:\s*function\(\)\s*\{\s*return Promise\.resolve\(\)/);
});

test('authentication requires server-provisioned membership', () => {
  const s = read('js/firebase-access.staging.js');
  assert.match(s, /collection\('access_members'\)/);
  assert.match(s, /signInWithEmailAndPassword/);
  assert.match(s, /await getAuth\(\)\.signOut\(\)/);
});
