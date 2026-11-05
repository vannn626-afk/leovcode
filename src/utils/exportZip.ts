import JSZip from 'jszip';
import type { ComponentItem, ScrapedProjectFile } from '../types';
import { validateFilePath, validateUploadExtension, detectLanguageFromPath } from './security';

export function downloadTextFile(filename: string, content: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function downloadComponentZip(component: ComponentItem, customHtml?: string, customCss?: string, customReact?: string) {
  const zip = new JSZip();
  const folder = zip.folder(component.slug) || zip;

  const html = customHtml || component.htmlCode;
  const css = customCss || component.cssCode;
  const react = customReact || component.reactCode;

  if (html) {
    const standaloneDoc = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${component.name} - LEOVANDYZ CODEBASE</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="./style.css" />
</head>
<body class="bg-[#090B10] text-[#F5F7FA] min-h-screen flex items-center justify-center p-8">
${html}
  <script src="./script.js"></script>
</body>
</html>`;
    folder.file('index.html', standaloneDoc);
  }
  if (css) folder.file('style.css', css);
  if (component.jsCode) folder.file('script.js', component.jsCode);
  if (react) folder.file(`${component.slug}.tsx`, react);
  if (component.tailwindCode) folder.file(`${component.slug}.tailwind.html`, component.tailwindCode);
  if (component.tsCode) folder.file(`${component.slug}.ts`, component.tsCode);

  folder.file(
    'README.md',
    `# ${component.name}\n\n${component.description}\n\n- Category: ${component.category}\n- Technology: ${component.technology}\n- Version: ${component.version}\n- Exported from LEOVANDYZ CODEBASE\n`
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${component.slug}-bundle.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function downloadScrapeProjectZip(slug: string, name: string, license: string, sourceAuthor: string, sourceUrl: string, files: ScrapedProjectFile[]) {
  const zip = new JSZip();
  const root = zip.folder(slug) || zip;

  for (const file of files) {
    const cleanPath = file.filePath.replace(/^\/+/, '');
    root.file(cleanPath, file.content);
  }

  if (!files.some((f) => f.filePath.toLowerCase() === 'license' || f.filePath.toLowerCase() === 'attribution.md')) {
    root.file(
      'ATTRIBUTION.md',
      `# ${name}\n\n- Original Author: ${sourceAuthor}\n- Original Source: ${sourceUrl}\n- License: ${license}\n- Packaged via LEOVANDYZ CODEBASE Scrape Archive\n`
    );
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${slug}-project.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function parseUploadedZipArchive(
  zipFile: File,
  projectId: string,
  authorId: string,
  maxSizeMb = 10
): Promise<{ files: ScrapedProjectFile[]; rejected: string[]; entryFile: string }> {
  if (zipFile.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`ZIP archive exceeds maximum limit of ${maxSizeMb} MB.`);
  }

  const zip = await JSZip.loadAsync(zipFile);
  const parsedFiles: ScrapedProjectFile[] = [];
  const rejected: string[] = [];
  const now = new Date().toISOString();

  const entries = Object.entries(zip.files);
  for (const [rawPath, entry] of entries) {
    if (entry.dir) continue;
    // Strip common top-level wrapper folder if present
    const strippedPath = rawPath.includes('/') ? rawPath.split('/').slice(1).join('/') || rawPath : rawPath;
    const pathCheck = validateFilePath(strippedPath);
    if (!pathCheck.valid) {
      rejected.push(`${rawPath} (${pathCheck.reason})`);
      continue;
    }

    const fileName = pathCheck.normalizedPath.split('/').pop() || '';
    const extCheck = validateUploadExtension(fileName);
    if (!extCheck.valid) {
      rejected.push(`${rawPath} (${extCheck.reason})`);
      continue;
    }

    const content = await entry.async('string');
    if (content.length > 100000) {
      rejected.push(`${rawPath} (File content exceeds 100 KB inline storage limit)`);
      continue;
    }

    const { language, mimeType } = detectLanguageFromPath(pathCheck.normalizedPath);
    parsedFiles.push({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      projectId,
      filePath: pathCheck.normalizedPath,
      language,
      mimeType,
      fileSize: content.length,
      isEntryFile: false,
      content,
      authorId,
      createdAt: now,
      updatedAt: now,
    });
  }

  let entryCandidate =
    parsedFiles.find((f) => f.filePath === 'index.html') ||
    parsedFiles.find((f) => f.filePath.endsWith('.html')) ||
    parsedFiles.find((f) => f.filePath.endsWith('App.tsx')) ||
    parsedFiles[0];

  const entryFile = entryCandidate ? entryCandidate.filePath : 'index.html';
  parsedFiles.forEach((f) => {
    f.isEntryFile = f.filePath === entryFile;
  });

  return { files: parsedFiles, rejected, entryFile };
}
