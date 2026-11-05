import type { VisualCustomConfig, ScrapedProjectFile } from '../types';

const ALLOWED_EXTENSIONS = new Set([
  'html',
  'htm',
  'css',
  'js',
  'mjs',
  'jsx',
  'ts',
  'tsx',
  'json',
  'md',
  'txt',
  'svg',
  'png',
  'jpg',
  'jpeg',
  'webp',
]);

const BLOCKED_EXTENSIONS = new Set([
  'exe',
  'dll',
  'so',
  'dylib',
  'bat',
  'cmd',
  'sh',
  'bash',
  'ps1',
  'msi',
  'com',
  'scr',
  'php',
  'phtml',
  'py',
  'rb',
  'pl',
  'jar',
  'bin',
]);

export function slugify(input: string): string {
  const cleaned = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return (cleaned || 'item').slice(0, 80);
}

export function isValidResourceId(id: string): boolean {
  return typeof id === 'string' && id.length >= 1 && id.length <= 128 && /^[a-zA-Z0-9_-]+$/.test(id);
}

export function validateFilePath(filePath: string): { valid: boolean; reason?: string; normalizedPath: string } {
  if (!filePath || typeof filePath !== 'string') {
    return { valid: false, reason: 'File path is empty.', normalizedPath: '' };
  }
  if (filePath.includes('\0')) {
    return { valid: false, reason: 'Null byte detected in file path.', normalizedPath: '' };
  }
  const normalized = filePath.replace(/\\/g, '/').trim();
  if (normalized.startsWith('/') || /^[a-zA-Z]:/.test(normalized)) {
    return { valid: false, reason: 'Absolute paths are forbidden.', normalizedPath: '' };
  }
  const segments = normalized.split('/');
  for (const segment of segments) {
    if (!segment || segment === '.' || segment === '..') {
      return { valid: false, reason: 'Path traversal sequence detected.', normalizedPath: '' };
    }
    if (segment.startsWith('.') && segment !== '.gitignore') {
      return { valid: false, reason: 'Hidden system files are not permitted.', normalizedPath: '' };
    }
  }
  if (normalized.length > 240) {
    return { valid: false, reason: 'File path exceeds 240 characters.', normalizedPath: '' };
  }
  return { valid: true, normalizedPath: normalized };
}

export function validateUploadExtension(fileName: string): { valid: boolean; extension: string; reason?: string } {
  const parts = fileName.toLowerCase().trim().split('.');
  if (parts.length < 2) {
    return { valid: false, extension: '', reason: 'File must have a valid extension.' };
  }
  const ext = parts[parts.length - 1];
  for (let i = 1; i < parts.length; i++) {
    if (BLOCKED_EXTENSIONS.has(parts[i])) {
      return { valid: false, extension: ext, reason: `Blocked executable extension (.${parts[i]}) detected.` };
    }
  }
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, extension: ext, reason: `Unsupported file extension (.${ext}).` };
  }
  return { valid: true, extension: ext };
}

export function detectLanguageFromPath(filePath: string): { language: string; mimeType: string } {
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'html':
    case 'htm':
      return { language: 'HTML', mimeType: 'text/html' };
    case 'css':
      return { language: 'CSS', mimeType: 'text/css' };
    case 'js':
    case 'mjs':
      return { language: 'JavaScript', mimeType: 'application/javascript' };
    case 'jsx':
      return { language: 'React JSX', mimeType: 'text/jsx' };
    case 'ts':
      return { language: 'TypeScript', mimeType: 'application/typescript' };
    case 'tsx':
      return { language: 'React TSX', mimeType: 'text/tsx' };
    case 'json':
      return { language: 'JSON', mimeType: 'application/json' };
    case 'md':
      return { language: 'Markdown', mimeType: 'text/markdown' };
    case 'svg':
      return { language: 'SVG', mimeType: 'image/svg+xml' };
    default:
      return { language: 'Text', mimeType: 'text/plain' };
  }
}

export function sanitizeSvgContent(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/javascript:/gi, '');
}

export const DEFAULT_CUSTOM_CONFIG: VisualCustomConfig = {
  backgroundColor: '#141A24',
  textColor: '#F5F7FA',
  accentColor: '#8B9CFF',
  fontFamily: 'Plus Jakarta Sans',
  fontSizePx: 15,
  fontWeight: '500',
  borderRadiusPx: 12,
  borderWidthPx: 1,
  borderColor: 'rgba(255,255,255,0.12)',
  paddingPx: 24,
  shadowLevel: 'md',
  opacityPercent: 100,
  layoutDirection: 'column',
  alignItems: 'stretch',
  transitionMs: 180,
};

export function generateCustomizedCode(
  baseHtml: string,
  baseCss: string,
  baseReact: string,
  config: VisualCustomConfig
): { html: string; css: string; react: string } {
  const shadowValue =
    config.shadowLevel === 'none'
      ? 'none'
      : config.shadowLevel === 'sm'
      ? '0 4px 12px rgba(0, 0, 0, 0.2)'
      : config.shadowLevel === 'md'
      ? '0 12px 32px rgba(0, 0, 0, 0.35)'
      : '0 24px 48px rgba(0, 0, 0, 0.5)';

  const customVariablesBlock = `:root {
  --lv-bg: ${config.backgroundColor};
  --lv-text: ${config.textColor};
  --lv-accent: ${config.accentColor};
  --lv-font: '${config.fontFamily}', sans-serif;
  --lv-font-size: ${config.fontSizePx}px;
  --lv-font-weight: ${config.fontWeight};
  --lv-radius: ${config.borderRadiusPx}px;
  --lv-border-width: ${config.borderWidthPx}px;
  --lv-border-color: ${config.borderColor};
  --lv-padding: ${config.paddingPx}px;
  --lv-shadow: ${shadowValue};
  --lv-opacity: ${(config.opacityPercent / 100).toFixed(2)};
  --lv-direction: ${config.layoutDirection};
  --lv-align: ${config.alignItems};
  --lv-transition: ${config.transitionMs}ms cubic-bezier(0.16, 1, 0.3, 1);
}

.lv-custom-target {
  background-color: var(--lv-bg);
  color: var(--lv-text);
  font-family: var(--lv-font);
  font-size: var(--lv-font-size);
  font-weight: var(--lv-font-weight);
  border-radius: var(--lv-radius);
  border: var(--lv-border-width) solid var(--lv-border-color);
  padding: var(--lv-padding);
  box-shadow: var(--lv-shadow);
  opacity: var(--lv-opacity);
  display: flex;
  flex-direction: var(--lv-direction);
  align-items: var(--lv-align);
  transition: all var(--lv-transition);
}
`;

  const combinedCss = `${customVariablesBlock}\n${baseCss}`.trim();
  const hasTargetClass = baseHtml.includes('lv-custom-target');
  const wrappedHtml = hasTargetClass
    ? baseHtml
    : `<div class="lv-custom-target">\n${baseHtml}\n</div>`;

  const stylePropLiteral = `{ backgroundColor: '${config.backgroundColor}', color: '${config.textColor}', borderRadius: '${config.borderRadiusPx}px', padding: '${config.paddingPx}px', borderColor: '${config.borderColor}', borderWidth: '${config.borderWidthPx}px' }`;
  const updatedReact = baseReact
    ? `// Customized with LEOVANDYZ Visual Customizer\n// Active tokens: ${JSON.stringify({
        accent: config.accentColor,
        radius: config.borderRadiusPx,
        padding: config.paddingPx,
        bg: config.backgroundColor,
      })}\nconst customStyle = ${stylePropLiteral};\n\n${baseReact}`
    : '';

  return {
    html: wrappedHtml,
    css: combinedCss,
    react: updatedReact,
  };
}

export function buildSandboxDocument(options: {
  html: string;
  css?: string;
  js?: string;
  canvasBg?: string;
  files?: ScrapedProjectFile[];
  entryFile?: string;
}): string {
  const { html, css = '', js = '', canvasBg = '#090B10', files, entryFile } = options;

  let resolvedHtml = html;
  let resolvedCss = css;
  let resolvedJs = js;

  if (files && files.length > 0) {
    const entry =
      files.find((f) => f.filePath === entryFile) ||
      files.find((f) => f.isEntryFile) ||
      files.find((f) => f.filePath.endsWith('.html')) ||
      files[0];

    if (entry && entry.filePath.endsWith('.html')) {
      resolvedHtml = entry.content;
    }

    const cssFiles = files.filter((f) => f.filePath.endsWith('.css'));
    if (cssFiles.length > 0) {
      resolvedCss = cssFiles.map((f) => `/* ${f.filePath} */\n${f.content}`).join('\n\n');
    }

    const jsFiles = files.filter((f) => f.filePath.endsWith('.js'));
    if (jsFiles.length > 0) {
      resolvedJs = jsFiles.map((f) => `// ${f.filePath}\n${f.content}`).join('\n\n');
    }
  }

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src data: https:; connect-src 'none';" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background-color: ${canvasBg};
      color: #F5F7FA;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    ${resolvedCss}
  </style>
</head>
<body>
  <div id="sandbox-mount" style="width: 100%; display: flex; justify-content: center; align-items: center;">
    ${resolvedHtml}
  </div>
  <script>
    (function() {
      const sendToHost = (type, payload) => {
        try {
          window.parent.postMessage({ source: 'leovandyz-sandbox', type, payload }, '*');
        } catch (_) {}
      };
      const origLog = console.log;
      const origWarn = console.warn;
      const origError = console.error;
      console.log = function(...args) {
        sendToHost('log', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        origLog.apply(console, args);
      };
      console.warn = function(...args) {
        sendToHost('warn', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        origWarn.apply(console, args);
      };
      console.error = function(...args) {
        sendToHost('error', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        origError.apply(console, args);
      };
      window.addEventListener('error', function(event) {
        sendToHost('error', event.message + (event.lineno ? ' (line ' + event.lineno + ')' : ''));
      });
      try {
        ${resolvedJs}
      } catch (err) {
        sendToHost('error', err && err.message ? err.message : String(err));
      }
    })();
  </script>
</body>
</html>`;
}
