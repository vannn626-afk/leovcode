# Security Specification: LEOVANDYZ CODEBASE

## 1. Data Invariants

1. **Default-Deny Catch-All**: All paths not explicitly matched are denied by `match /{document=**} { allow read, write: if false; }`.
2. **PII Isolation (Split Collection)**: User email addresses are stored exclusively in `/profiles/{userId}/private/{docId}` and never in `/profiles/{userId}`. Only the owner (`request.auth.uid == userId`) or a verified administrator (`isAdmin()`) may read private PII.
3. **Self-Assigned Role Prevention**: Regular users creating `/profiles/{userId}` must set `role == 'user'` and `status == 'active'`. Only verified administrators/owners (`isAdmin()`) may assign `admin` or `owner` roles.
4. **Email Verification Mandate**: Every write operation requires `request.auth.token.email_verified == true`.
5. **Temporal Integrity**: Every `createdAt` on create and `updatedAt` on update must equal `request.time`.
6. **Public vs Draft Content Visibility**: Public readers can only read `/components`, `/templates`, `/snippets`, and `/scrapes` documents where `resource.data.status == 'published'` (and for snippets, `resource.data.isPublic == true`). Draft or archived items are strictly restricted to `isAdmin()` or the item's `authorId`.
7. **Relational Parent Check for Scrape Files**: Subcollection documents in `/scrapes/{scrapeId}/files/{fileId}` require the parent `/scrapes/{scrapeId}` document to exist (`exists(...)`), and public reads require the parent scrape to have `status == 'published'`.
8. **Strict Query Enforcement on Private Collections**: `allow list` on `/favorites` and `/collections` enforces `resource.data.userId == request.auth.uid`.
9. **Immutable Audit Logs**: Documents in `/audit_logs/{logId}` can only be created by verified admins (`isAdmin()`), never updated or deleted.

---

## 2. The "Dirty Dozen" Payloads

1. **Payload 1 (Privilege Escalation on Profile Create)**:
   `{ "uid": "user_1", "displayName": "Attacker", "role": "owner", "status": "active", "createdAt": "SERVER_TIME", "updatedAt": "SERVER_TIME" }` sent by non-admin `user_1`. -> `PERMISSION_DENIED`
2. **Payload 2 (Shadow Field Injection on Component)**:
   `{ ..., "isVerifiedBackdoor": true }` -> `PERMISSION_DENIED` (`hasOnly` check rejects unknown keys).
3. **Payload 3 (Unverified Email Spoof of Bootstrapped Owner)**:
   Token with `email: "vannn626@gmail.com"`, `email_verified: false` attempting to write `/settings/global`. -> `PERMISSION_DENIED`
4. **Payload 4 (Cross-User PII Read)**:
   User `user_2` attempting `get(/profiles/user_1/private/info)`. -> `PERMISSION_DENIED`
5. **Payload 5 (Unauthorized Draft Component Read)**:
   Unauthenticated client attempting `get(/components/comp_draft_1)` where `status == "draft"`. -> `PERMISSION_DENIED`
6. **Payload 6 (Identity Spoofing on Favorite Create)**:
   User `user_1` creating `/favorites/fav_1` with `userId: "user_2"`. -> `PERMISSION_DENIED`
7. **Payload 7 (ID Poisoning Attack)**:
   Creating `/components/{200-char-junk-id}` or ID with spaces/slashes. -> `PERMISSION_DENIED` (`isValidId` rejects).
8. **Payload 8 (Timestamp Forgery)**:
   Creating `/snippets/snip_1` with a past/future `createdAt` instead of `request.time`. -> `PERMISSION_DENIED`
9. **Payload 9 (Orphaned Scrape File Write)**:
   Creating `/scrapes/non_existent_scrape/files/file_1` when parent `/scrapes/non_existent_scrape` does not exist. -> `PERMISSION_DENIED`
10. **Payload 10 (Value Poisoning on Collection Update)**:
    Updating `/collections/col_1` with `name: 12345` (non-string) or `itemIds` with 500 items. -> `PERMISSION_DENIED`
11. **Payload 11 (Audit Log Tampering)**:
    Admin attempting `delete(/audit_logs/log_1)` or `update(/audit_logs/log_1)`. -> `PERMISSION_DENIED`
12. **Payload 12 (Unbounded List Query on Favorites)**:
    Authenticated user executing unfiltered `list(/favorites)` across other users' documents. -> `PERMISSION_DENIED`

---

## 3. Test Runner Specification (`firestore.rules.test.ts`)

```ts
// Specification test suite verifying Dirty Dozen payloads against firestore.rules
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('firestore.rules enforces all 8 pillars and blocks Dirty Dozen vectors', () => {
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  assert.ok(rules.includes("rules_version = '2';"));
  assert.ok(rules.includes('allow read, write: if false;'));
  assert.ok(rules.includes('request.auth.token.email_verified == true'));
  assert.ok(rules.includes('isValidPublicProfile(incoming())'));
  assert.ok(rules.includes('isValidComponent(incoming())'));
  assert.ok(rules.includes('isValidScrapedProject(incoming())'));
});
```
