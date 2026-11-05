import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('firestore.rules contains all required security invariants and collection rules', () => {
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  const blueprint = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf8'));

  assert.ok(rules.includes("rules_version = '2';"), 'Must use rules_version 2');
  assert.ok(rules.includes('allow read, write: if false;'), 'Must include default-deny catch-all');
  assert.ok(rules.includes('request.auth.token.email_verified == true'), 'Must enforce email verification');
  assert.ok(rules.includes("request.auth.token.email == 'vannn626@gmail.com'"), 'Must include bootstrapped owner');

  const requiredMatchers = [
    'match /profiles/{userId}',
    'match /private/{docId}',
    'match /admins/{userId}',
    'match /categories/{categoryId}',
    'match /components/{componentId}',
    'match /templates/{templateId}',
    'match /snippets/{snippetId}',
    'match /scrapes/{scrapeId}',
    'match /files/{fileId}',
    'match /assets/{assetId}',
    'match /favorites/{favoriteId}',
    'match /collections/{collectionId}',
    'match /settings/{settingId}',
    'match /audit_logs/{logId}',
  ];

  for (const matcher of requiredMatchers) {
    assert.ok(rules.includes(matcher), `Missing match block: ${matcher}`);
  }

  assert.ok(Object.keys(blueprint.firestore).length >= 14, 'Blueprint must map all 14 paths');
});
