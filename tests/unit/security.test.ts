import test from 'node:test';
import assert from 'node:assert/strict';
import {
  slugify,
  validateFilePath,
  validateUploadExtension,
  sanitizeSvgContent,
  generateCustomizedCode,
  DEFAULT_CUSTOM_CONFIG,
  buildSandboxDocument,
} from '../../src/utils/security';

test('slugify converts titles into clean URL-safe slugs', () => {
  assert.equal(slugify('Modern Dark Login!'), 'modern-dark-login');
  assert.equal(slugify('  Glassmorphism___Card 2026 '), 'glassmorphism-card-2026');
});

test('validateFilePath blocks path traversal and absolute paths', () => {
  assert.equal(validateFilePath('src/index.html').valid, true);
  assert.equal(validateFilePath('../etc/passwd').valid, false);
  assert.equal(validateFilePath('src/../../secret.txt').valid, false);
  assert.equal(validateFilePath('/etc/hosts').valid, false);
  assert.equal(validateFilePath('C:\\Windows\\system32').valid, false);
  assert.equal(validateFilePath('.env').valid, false);
});

test('validateUploadExtension blocks executable files and allows web source files', () => {
  assert.equal(validateUploadExtension('index.html').valid, true);
  assert.equal(validateUploadExtension('App.tsx').valid, true);
  assert.equal(validateUploadExtension('malware.exe').valid, false);
  assert.equal(validateUploadExtension('backdoor.php.jpg').valid, false);
  assert.equal(validateUploadExtension('run.sh').valid, false);
});

test('sanitizeSvgContent strips script tags and inline event handlers', () => {
  const dirty = '<svg onload="alert(1)"><script>evil()</script><path d="M0 0" /></svg>';
  const clean = sanitizeSvgContent(dirty);
  assert.equal(clean.includes('<script>'), false);
  assert.equal(clean.includes('onload='), false);
  assert.equal(clean.includes('<path d="M0 0" />'), true);
});

test('generateCustomizedCode injects CSS variables and mutates exported source code', () => {
  const custom = { ...DEFAULT_CUSTOM_CONFIG, accentColor: '#22C55E', borderRadiusPx: 20 };
  const result = generateCustomizedCode('<button>Click</button>', '.btn { color: white; }', 'export const Btn = () => <button />;', custom);
  assert.ok(result.css.includes('--lv-accent: #22C55E;'));
  assert.ok(result.css.includes('--lv-radius: 20px;'));
  assert.ok(result.html.includes('lv-custom-target'));
  assert.ok(result.react.includes('borderRadius: \'20px\''));
});

test('buildSandboxDocument enforces strict CSP and multi-file bundling', () => {
  const doc = buildSandboxDocument({
    html: '<h1>Fallback</h1>',
    files: [
      {
        id: 'f1',
        projectId: 'p1',
        filePath: 'index.html',
        language: 'HTML',
        mimeType: 'text/html',
        fileSize: 32,
        isEntryFile: true,
        content: '<div id="app">MultiFile Scrape</div>',
        authorId: 'u1',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'f2',
        projectId: 'p1',
        filePath: 'style.css',
        language: 'CSS',
        mimeType: 'text/css',
        fileSize: 28,
        isEntryFile: false,
        content: '#app { color: #8B9CFF; }',
        authorId: 'u1',
        createdAt: '',
        updatedAt: '',
      },
    ],
    entryFile: 'index.html',
  });
  assert.ok(doc.includes('Content-Security-Policy'));
  assert.ok(doc.includes('MultiFile Scrape'));
  assert.ok(doc.includes('#app { color: #8B9CFF; }'));
});
