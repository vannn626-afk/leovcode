import type {
  CategoryItem,
  ComponentItem,
  TemplateItem,
  SnippetItem,
  ScrapedProject,
  PlatformSettings,
  AssetItem,
} from '../types';

const NOW = '2026-11-05T04:00:00.000Z';

export const INITIAL_SETTINGS: PlatformSettings = {
  id: 'global',
  siteName: 'LEOVANDYZ CODEBASE',
  siteDescription: 'A modern developer workspace to discover, customize, preview, and share code.',
  accentColor: '#8B9CFF',
  defaultTheme: 'dark',
  maintenanceMode: false,
  allowPublicPlayground: true,
  maxUploadSizeMb: 15,
  updatedBy: 'system-bootstrap',
  updatedAt: NOW,
};

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-auth',
    name: 'Authentication',
    slug: 'authentication',
    description: 'Login portals, registration flows, OTP verification, 2FA, and password security interfaces.',
    section: 'components',
    iconName: 'ShieldCheck',
    order: 1,
    isVisible: true,
    isFeatured: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'cat-buttons',
    name: 'Buttons',
    slug: 'buttons',
    description: 'Interactive triggers, loading buttons, command actions, OAuth triggers, and segmented toggles.',
    section: 'components',
    iconName: 'MousePointerClick',
    order: 2,
    isVisible: true,
    isFeatured: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'cat-navigation',
    name: 'Navigation',
    slug: 'navigation',
    description: 'Top command headers, collapsible workspace sidebars, breadcrumbs, and tab bars.',
    section: 'components',
    iconName: 'Compass',
    order: 3,
    isVisible: true,
    isFeatured: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'cat-forms',
    name: 'Forms',
    slug: 'forms',
    description: 'Validated inputs, search bars, selects, checkboxes, radios, and multi-step form controls.',
    section: 'components',
    iconName: 'FormInput',
    order: 4,
    isVisible: true,
    isFeatured: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'cat-cards',
    name: 'Cards',
    slug: 'cards',
    description: 'Pricing matrices, profile summaries, telemetry KPI cards, and interactive feature surfaces.',
    section: 'components',
    iconName: 'LayoutGrid',
    order: 5,
    isVisible: true,
    isFeatured: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'cat-modals',
    name: 'Modals & Overlays',
    slug: 'modals',
    description: 'Command palettes, confirmation dialogs, toast notifications, tooltips, and drawers.',
    section: 'components',
    iconName: 'Layers',
    order: 6,
    isVisible: true,
    isFeatured: false,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'cat-dashboard',
    name: 'Dashboard & Data',
    slug: 'dashboard',
    description: 'High-density data grids, tabular stat rows, skeleton loaders, and progress indicators.',
    section: 'components',
    iconName: 'BarChart3',
    order: 7,
    isVisible: true,
    isFeatured: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'cat-animations',
    name: 'Animations & Loaders',
    slug: 'animations',
    description: 'Compositor-friendly micro-interactions, skeleton shimmers, and state transitions.',
    section: 'components',
    iconName: 'Zap',
    order: 8,
    isVisible: true,
    isFeatured: false,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'cat-tpl-saas',
    name: 'SaaS & Landing Pages',
    slug: 'saas-landing',
    description: 'Complete multi-section SaaS marketing pages, pricing layouts, and product showcases.',
    section: 'templates',
    iconName: 'Globe',
    order: 9,
    isVisible: true,
    isFeatured: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'cat-scrape-auth',
    name: 'Login & Authentication Archives',
    slug: 'scrape-auth',
    description: 'Multi-file authentication templates and security flows with complete HTML/CSS/JS bundles.',
    section: 'scrapes',
    iconName: 'KeyRound',
    order: 10,
    isVisible: true,
    isFeatured: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'cat-scrape-ui',
    name: 'Full Workspace & App UI',
    slug: 'scrape-workspace',
    description: 'Complete multi-file application shells, kanban boards, and interactive command docks.',
    section: 'scrapes',
    iconName: 'FolderGit2',
    order: 11,
    isVisible: true,
    isFeatured: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const INITIAL_COMPONENTS: ComponentItem[] = [
  {
    id: 'comp-modern-dark-login',
    name: 'Modern Dark Login Portal',
    slug: 'modern-dark-login',
    description: 'Clean dark authentication card with email and password validation, visibility toggle, and OAuth SSO triggers.',
    category: 'Authentication',
    subcategory: 'Login',
    technology: 'React + Tailwind',
    tags: ['auth', 'login', 'dark-ui', 'oauth'],
    status: 'published',
    isFeatured: true,
    isPopular: true,
    version: '1.2.0',
    viewsCount: 428,
    copiesCount: 164,
    downloadsCount: 89,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="lv-custom-target w-full max-w-md rounded-xl bg-[#141A24] border border-white/10 p-7 text-[#F5F7FA] shadow-xl">
  <div class="mb-6">
    <p class="text-xs font-mono uppercase tracking-wider text-[#8B9CFF] mb-1">Workspace Access</p>
    <h2 class="text-xl font-semibold tracking-tight">Sign in to your account</h2>
    <p class="text-sm text-[#9BA6B5] mt-1">Enter your credentials to access the developer console.</p>
  </div>
  <form id="loginForm" class="space-y-4" onsubmit="return false;">
    <div>
      <label class="block text-xs font-medium text-[#9BA6B5] mb-1.5" for="emailInput">Work Email</label>
      <input id="emailInput" type="email" placeholder="developer@company.dev" required class="w-full rounded-lg bg-[#090B10] border border-white/10 px-3.5 py-2.5 text-sm text-[#F5F7FA] placeholder-[#9BA6B5]/50 focus:outline-none focus:border-[#8B9CFF]" />
    </div>
    <div>
      <div class="flex items-center justify-between mb-1.5">
        <label class="text-xs font-medium text-[#9BA6B5]" for="passwordInput">Password</label>
        <button type="button" id="togglePw" class="text-xs text-[#8B9CFF] hover:underline">Show</button>
      </div>
      <input id="passwordInput" type="password" value="••••••••••••" required class="w-full rounded-lg bg-[#090B10] border border-white/10 px-3.5 py-2.5 text-sm text-[#F5F7FA] focus:outline-none focus:border-[#8B9CFF]" />
    </div>
    <button type="submit" id="submitBtn" class="w-full rounded-lg bg-[#8B9CFF] px-4 py-2.5 text-sm font-semibold text-[#090B10] hover:opacity-95 transition">Continue to Workspace</button>
    <p id="statusMsg" class="text-xs text-emerald-400 hidden text-center pt-1">Session verified. Redirecting to console...</p>
  </form>
</div>`,
    cssCode: `.lv-custom-target {
  background: #141A24;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
}`,
    jsCode: `const toggleBtn = document.getElementById('togglePw');
const pwInput = document.getElementById('passwordInput');
const form = document.getElementById('loginForm');
const statusMsg = document.getElementById('statusMsg');

if (toggleBtn && pwInput) {
  toggleBtn.addEventListener('click', () => {
    const isPw = pwInput.getAttribute('type') === 'password';
    pwInput.setAttribute('type', isPw ? 'text' : 'password');
    toggleBtn.textContent = isPw ? 'Hide' : 'Show';
  });
}
if (form && statusMsg) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    statusMsg.classList.remove('hidden');
  });
}`,
    reactCode: `import React, { useState } from 'react';

export function ModernDarkLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full max-w-md rounded-xl bg-[#141A24] border border-white/10 p-7 text-[#F5F7FA]">
      <div className="mb-6">
        <p className="text-xs font-mono uppercase tracking-wider text-[#8B9CFF] mb-1">Workspace Access</p>
        <h2 className="text-xl font-semibold tracking-tight">Sign in to your account</h2>
        <p className="text-sm text-[#9BA6B5] mt-1">Enter your credentials to access the developer console.</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-xs font-medium text-[#9BA6B5] mb-1.5">Work Email</label>
          <input
            type="email"
            placeholder="developer@company.dev"
            required
            className="w-full rounded-lg bg-[#090B10] border border-white/10 px-3.5 py-2.5 text-sm text-[#F5F7FA]"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#9BA6B5]">Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-[#8B9CFF] hover:underline"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            defaultValue="secret-token-2026"
            required
            className="w-full rounded-lg bg-[#090B10] border border-white/10 px-3.5 py-2.5 text-sm text-[#F5F7FA]"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-[#8B9CFF] px-4 py-2.5 text-sm font-semibold text-[#090B10]"
        >
          Continue to Workspace
        </button>
        {submitted && (
          <p className="text-xs text-emerald-400 text-center pt-1">
            Session verified. Redirecting to console...
          </p>
        )}
      </form>
    </div>
  );
}`,
    tailwindCode: `<div class="w-full max-w-md rounded-xl bg-[#141A24] border border-white/10 p-7 text-[#F5F7FA]">
  <h2 class="text-xl font-semibold">Sign in to your account</h2>
</div>`,
    tsCode: `export interface LoginCredentials {
  email: string;
  password: string;
  rememberDevice?: boolean;
}`,
  },
  {
    id: 'comp-glassmorphism-login',
    name: 'Glassmorphism Auth Card',
    slug: 'glassmorphism-login',
    description: 'Frosted backdrop authentication surface with single-layer elevation, SSO provider buttons, and magic link switch.',
    category: 'Authentication',
    subcategory: 'Login',
    technology: 'Tailwind CSS',
    tags: ['auth', 'glassmorphism', 'sso', 'magic-link'],
    status: 'published',
    isFeatured: true,
    isPopular: false,
    version: '1.0.4',
    viewsCount: 312,
    copiesCount: 118,
    downloadsCount: 54,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="lv-custom-target w-full max-w-md rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/15 p-7 text-[#F5F7FA]">
  <h3 class="text-lg font-semibold">Magic Link Authentication</h3>
  <p class="text-xs text-[#9BA6B5] mt-1 mb-5">Receive a one-time cryptographic sign-in link in your inbox.</p>
  <div class="space-y-3">
    <input type="email" placeholder="engineer@domain.io" class="w-full rounded-lg bg-black/40 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:border-[#8B9CFF] focus:outline-none" />
    <button id="magicBtn" class="w-full rounded-lg bg-[#8B9CFF] text-[#090B10] font-semibold text-sm py-2.5 hover:opacity-90 transition">Send Sign-In Link</button>
    <p id="magicNotice" class="text-xs text-[#8B9CFF] hidden">Check your inbox for a temporary login link.</p>
  </div>
</div>`,
    cssCode: `.lv-custom-target { backdrop-filter: blur(12px); }`,
    jsCode: `const btn = document.getElementById('magicBtn');
const notice = document.getElementById('magicNotice');
if (btn && notice) {
  btn.addEventListener('click', () => notice.classList.remove('hidden'));
}`,
    reactCode: `export function GlassmorphismAuthCard() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/15 p-7 text-[#F5F7FA]">
      <h3 className="text-lg font-semibold">Magic Link Authentication</h3>
      <p className="text-xs text-[#9BA6B5] mt-1 mb-5">Receive a one-time cryptographic sign-in link in your inbox.</p>
      <input type="email" placeholder="engineer@domain.io" className="w-full rounded-lg bg-black/40 border border-white/15 px-3.5 py-2.5 text-sm text-white mb-3" />
      <button className="w-full rounded-lg bg-[#8B9CFF] text-[#090B10] font-semibold text-sm py-2.5">Send Sign-In Link</button>
    </div>
  );
}`,
    tailwindCode: `<div class="rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/15 p-7">...</div>`,
    tsCode: `export type AuthMode = 'magic-link' | 'password';`,
  },
  {
    id: 'comp-neobrutalism-login',
    name: 'Neobrutalism High-Contrast Login',
    slug: 'neobrutalism-login',
    description: 'Sharp 2px structural borders with hard offset shadow and high-contrast geometric inputs.',
    category: 'Authentication',
    subcategory: 'Login',
    technology: 'HTML + CSS',
    tags: ['auth', 'neobrutalism', 'high-contrast'],
    status: 'published',
    isFeatured: false,
    isPopular: true,
    version: '1.1.0',
    viewsCount: 289,
    copiesCount: 97,
    downloadsCount: 41,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="lv-custom-target w-full max-w-sm bg-[#10141D] border-2 border-[#F5F7FA] p-6 text-[#F5F7FA] shadow-[6px_6px_0px_#8B9CFF]">
  <div class="border-b-2 border-[#F5F7FA] pb-3 mb-5 flex justify-between items-center">
    <span class="font-mono text-xs font-bold uppercase">AUTH_GATE_01</span>
    <span class="font-mono text-xs bg-[#8B9CFF] text-[#090B10] px-2 py-0.5 font-bold">SECURE</span>
  </div>
  <label class="block font-mono text-xs mb-1">HANDLE</label>
  <input type="text" value="leovandyz_dev" class="w-full bg-[#090B10] border-2 border-[#F5F7FA] px-3 py-2 text-sm font-mono mb-4 focus:outline-none" />
  <label class="block font-mono text-xs mb-1">ACCESS KEY</label>
  <input type="password" value="••••••••••" class="w-full bg-[#090B10] border-2 border-[#F5F7FA] px-3 py-2 text-sm font-mono mb-5 focus:outline-none" />
  <button class="w-full bg-[#8B9CFF] text-[#090B10] border-2 border-[#F5F7FA] py-2.5 font-mono text-xs font-bold uppercase active:translate-x-1 active:translate-y-1 transition-transform">Authenticate Session</button>
</div>`,
    cssCode: `.lv-custom-target { box-shadow: 6px 6px 0px #8B9CFF; }`,
    jsCode: ``,
    reactCode: `export function NeobrutalismLogin() {
  return (
    <div className="w-full max-w-sm bg-[#10141D] border-2 border-[#F5F7FA] p-6 text-[#F5F7FA] shadow-[6px_6px_0px_#8B9CFF]">
      <h3 className="font-mono text-sm font-bold mb-4">AUTH_GATE_01</h3>
      <button className="w-full bg-[#8B9CFF] text-[#090B10] border-2 border-[#F5F7FA] py-2.5 font-mono text-xs font-bold uppercase">
        Authenticate Session
      </button>
    </div>
  );
}`,
    tailwindCode: `<div class="bg-[#10141D] border-2 border-[#F5F7FA] shadow-[6px_6px_0px_#8B9CFF] p-6">...</div>`,
    tsCode: ``,
  },
  {
    id: 'comp-otp-verification',
    name: 'OTP 6-Digit Verification Matrix',
    slug: 'otp-verification-matrix',
    description: 'Accessible 6-digit one-time passcode input with auto-advance, paste handler, and resend timer.',
    category: 'Authentication',
    subcategory: 'Verification',
    technology: 'React + TypeScript',
    tags: ['auth', 'otp', '2fa', 'security'],
    status: 'published',
    isFeatured: true,
    isPopular: true,
    version: '1.3.0',
    viewsCount: 376,
    copiesCount: 152,
    downloadsCount: 73,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="lv-custom-target w-full max-w-md rounded-xl bg-[#141A24] border border-white/10 p-6 text-[#F5F7FA]">
  <h3 class="text-base font-semibold">Two-Step Verification</h3>
  <p class="text-xs text-[#9BA6B5] mt-1 mb-5">Enter the 6-digit security code sent to your authenticator device.</p>
  <div class="grid grid-cols-6 gap-2.5 mb-5" id="otpGrid">
    <input maxlength="1" value="4" aria-label="Digit 1" class="otp-box w-full h-12 text-center font-mono text-lg font-semibold rounded-lg bg-[#090B10] border border-[#8B9CFF] text-[#F5F7FA]" />
    <input maxlength="1" value="8" aria-label="Digit 2" class="otp-box w-full h-12 text-center font-mono text-lg font-semibold rounded-lg bg-[#090B10] border border-[#8B9CFF] text-[#F5F7FA]" />
    <input maxlength="1" value="2" aria-label="Digit 3" class="otp-box w-full h-12 text-center font-mono text-lg font-semibold rounded-lg bg-[#090B10] border border-[#8B9CFF] text-[#F5F7FA]" />
    <input maxlength="1" value="" placeholder="·" aria-label="Digit 4" class="otp-box w-full h-12 text-center font-mono text-lg font-semibold rounded-lg bg-[#090B10] border border-white/15 text-[#F5F7FA]" />
    <input maxlength="1" value="" placeholder="·" aria-label="Digit 5" class="otp-box w-full h-12 text-center font-mono text-lg font-semibold rounded-lg bg-[#090B10] border border-white/15 text-[#F5F7FA]" />
    <input maxlength="1" value="" placeholder="·" aria-label="Digit 6" class="otp-box w-full h-12 text-center font-mono text-lg font-semibold rounded-lg bg-[#090B10] border border-white/15 text-[#F5F7FA]" />
  </div>
  <button id="verifyOtpBtn" class="w-full rounded-lg bg-[#8B9CFF] py-2.5 text-xs font-semibold text-[#090B10]">Verify Security Code</button>
</div>`,
    cssCode: `.otp-box:focus { outline: 2px solid #8B9CFF; outline-offset: 1px; }`,
    jsCode: `const inputs = document.querySelectorAll('.otp-box');
inputs.forEach((input, idx) => {
  input.addEventListener('input', (e) => {
    if (e.target.value && idx < inputs.length - 1) {
      inputs[idx + 1].focus();
    }
  });
});`,
    reactCode: `import React, { useState } from 'react';

export function OtpVerificationMatrix() {
  const [digits, setDigits] = useState(['4', '8', '2', '', '', '']);
  return (
    <div className="w-full max-w-md rounded-xl bg-[#141A24] border border-white/10 p-6 text-[#F5F7FA]">
      <h3 className="text-base font-semibold">Two-Step Verification</h3>
      <div className="grid grid-cols-6 gap-2.5 my-5">
        {digits.map((d, i) => (
          <input
            key={i}
            maxLength={1}
            value={d}
            onChange={(e) => {
              const next = [...digits];
              next[i] = e.target.value;
              setDigits(next);
            }}
            className="w-full h-12 text-center font-mono text-lg font-semibold rounded-lg bg-[#090B10] border border-white/15 text-[#F5F7FA]"
          />
        ))}
      </div>
      <button className="w-full rounded-lg bg-[#8B9CFF] py-2.5 text-xs font-semibold text-[#090B10]">
        Verify Security Code
      </button>
    </div>
  );
}`,
    tailwindCode: `<div class="grid grid-cols-6 gap-2.5">...</div>`,
    tsCode: `export type OtpTuple = [string, string, string, string, string, string];`,
  },
  {
    id: 'comp-password-strength-ui',
    name: 'Password Entropy & Strength Meter',
    slug: 'password-strength-meter',
    description: 'Real-time password entropy analyzer checking length, character classes, and cryptographic rules.',
    category: 'Authentication',
    subcategory: 'Security',
    technology: 'React + TypeScript',
    tags: ['auth', 'password', 'validation', 'security'],
    status: 'published',
    isFeatured: false,
    isPopular: true,
    version: '1.0.2',
    viewsCount: 245,
    copiesCount: 94,
    downloadsCount: 38,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="lv-custom-target w-full max-w-md rounded-xl bg-[#141A24] border border-white/10 p-6 text-[#F5F7FA]">
  <label class="block text-xs font-medium text-[#9BA6B5] mb-1.5" for="pwMeterInput">Create Master Password</label>
  <input id="pwMeterInput" type="text" value="Lv#Codebase_2026!" class="w-full rounded-lg bg-[#090B10] border border-white/15 px-3.5 py-2 text-sm font-mono text-[#F5F7FA] mb-3" />
  <div class="grid grid-cols-4 gap-1.5 mb-3" id="meterBars">
    <div class="h-1.5 rounded bg-emerald-400"></div>
    <div class="h-1.5 rounded bg-emerald-400"></div>
    <div class="h-1.5 rounded bg-emerald-400"></div>
    <div class="h-1.5 rounded bg-emerald-400"></div>
  </div>
  <div class="flex items-center justify-between text-xs text-[#9BA6B5]">
    <span>Entropy score: Strong (98 bits)</span>
    <span class="font-mono text-emerald-400">4 / 4 rules met</span>
  </div>
</div>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `export function PasswordStrengthMeter() {
  return (
    <div className="w-full max-w-md rounded-xl bg-[#141A24] border border-white/10 p-6 text-[#F5F7FA]">
      <label className="block text-xs font-medium text-[#9BA6B5] mb-1.5">Create Master Password</label>
      <input type="text" defaultValue="Lv#Codebase_2026!" className="w-full rounded-lg bg-[#090B10] border border-white/15 px-3.5 py-2 text-sm font-mono text-[#F5F7FA] mb-3" />
    </div>
  );
}`,
    tailwindCode: `<div class="grid grid-cols-4 gap-1.5">...</div>`,
    tsCode: ``,
  },
  {
    id: 'comp-split-screen-login',
    name: 'Split-Screen Enterprise Auth',
    slug: 'split-screen-login',
    description: 'Two-column enterprise authentication layout pairing a credential form with architectural security notes.',
    category: 'Authentication',
    subcategory: 'Login',
    technology: 'React + Tailwind',
    tags: ['auth', 'enterprise', 'split-layout'],
    status: 'published',
    isFeatured: false,
    isPopular: false,
    version: '1.1.0',
    viewsCount: 198,
    copiesCount: 72,
    downloadsCount: 29,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="lv-custom-target w-full max-w-2xl rounded-xl bg-[#141A24] border border-white/10 overflow-hidden grid grid-cols-1 md:grid-cols-2 text-[#F5F7FA]">
  <div class="p-6">
    <h3 class="text-base font-semibold mb-1">Enterprise SSO</h3>
    <p class="text-xs text-[#9BA6B5] mb-4">Sign in with your organization domain.</p>
    <input type="email" placeholder="name@enterprise.com" class="w-full rounded-lg bg-[#090B10] border border-white/10 px-3 py-2 text-xs text-white mb-3" />
    <button class="w-full rounded-lg bg-[#8B9CFF] text-[#090B10] font-semibold text-xs py-2.5">Continue with SAML</button>
  </div>
  <div class="bg-[#10141D] border-l border-white/10 p-6 flex flex-col justify-between">
    <div>
      <p class="font-mono text-xs text-[#8B9CFF] mb-2">Role-Based Access</p>
      <p class="text-xs text-[#9BA6B5] leading-relaxed">Hardware key enforcement and zero-trust session tokens are enabled by default for all workspace members.</p>
    </div>
    <p class="text-[11px] font-mono text-[#9BA6B5]">TLS 1.3 · WebAuthn Ready</p>
  </div>
</div>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `export function SplitScreenEnterpriseAuth() {
  return <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl bg-[#141A24] border border-white/10">...</div>;
}`,
    tailwindCode: `<div class="grid grid-cols-1 md:grid-cols-2">...</div>`,
    tsCode: ``,
  },
  {
    id: 'comp-button-collection-suite',
    name: 'Developer Action Button Suite',
    slug: 'developer-button-suite',
    description: 'Complete set of Primary, Secondary, Outline, Ghost, Loading, and Keyboard-Shortcut buttons with tactile press states.',
    category: 'Buttons',
    subcategory: 'Action Controls',
    technology: 'React + Tailwind',
    tags: ['buttons', 'interactive', 'controls', 'loading'],
    status: 'published',
    isFeatured: true,
    isPopular: true,
    version: '2.0.0',
    viewsCount: 519,
    copiesCount: 231,
    downloadsCount: 112,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="lv-custom-target w-full max-w-lg rounded-xl bg-[#141A24] border border-white/10 p-6 text-[#F5F7FA]">
  <p class="text-xs font-mono text-[#9BA6B5] mb-4">Interactive Button Variants (Click to test)</p>
  <div class="flex flex-wrap gap-3 items-center">
    <button class="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition">Primary Action</button>
    <button class="px-4 py-2 rounded-lg bg-[#1A2230] text-[#F5F7FA] border border-white/10 text-xs font-medium hover:border-white/25 transition">Secondary Surface</button>
    <button class="px-4 py-2 rounded-lg bg-transparent border border-[#8B9CFF]/50 text-[#8B9CFF] text-xs font-medium hover:bg-[#8B9CFF]/10 transition">Outline Precision</button>
    <button id="deploySimBtn" class="px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
      <span>Run Build</span>
      <kbd class="text-[10px] bg-black/40 px-1.5 py-0.5 rounded">⌘B</kbd>
    </button>
  </div>
  <p id="btnFeedback" class="text-xs font-mono text-[#8B9CFF] mt-4">Ready for interaction.</p>
</div>`,
    cssCode: ``,
    jsCode: `const deployBtn = document.getElementById('deploySimBtn');
const feedback = document.getElementById('btnFeedback');
if (deployBtn && feedback) {
  deployBtn.addEventListener('click', () => {
    feedback.textContent = 'Build triggered at ' + new Date().toLocaleTimeString();
  });
}`,
    reactCode: `export function DeveloperButtonSuite() {
  return (
    <div className="flex flex-wrap gap-3">
      <button className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold">Primary Action</button>
      <button className="px-4 py-2 rounded-lg bg-[#1A2230] text-[#F5F7FA] border border-white/10 text-xs font-medium">Secondary Surface</button>
    </div>
  );
}`,
    tailwindCode: `<button class="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold">Primary Action</button>`,
    tsCode: `export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';`,
  },
  {
    id: 'comp-segmented-toggle-control',
    name: 'Segmented View & Billing Toggle',
    slug: 'segmented-toggle-control',
    description: 'Accessible single-line segmented button bar for switching viewports, billing intervals, or code formats.',
    category: 'Buttons',
    subcategory: 'Toggles',
    technology: 'React + Tailwind',
    tags: ['buttons', 'segmented-control', 'tabs', 'toggle'],
    status: 'published',
    isFeatured: false,
    isPopular: true,
    version: '1.1.2',
    viewsCount: 274,
    copiesCount: 130,
    downloadsCount: 49,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="lv-custom-target w-full max-w-md rounded-xl bg-[#141A24] border border-white/10 p-6 text-[#F5F7FA]">
  <div class="inline-flex p-1 rounded-lg bg-[#090B10] border border-white/10" role="tablist">
    <button type="button" data-mode="preview" class="seg-btn px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#1A2230] text-[#F5F7FA]">Preview</button>
    <button type="button" data-mode="react" class="seg-btn px-3.5 py-1.5 rounded-md text-xs font-medium text-[#9BA6B5]">React TSX</button>
    <button type="button" data-mode="html" class="seg-btn px-3.5 py-1.5 rounded-md text-xs font-medium text-[#9BA6B5]">HTML + CSS</button>
  </div>
  <p id="segOutput" class="text-xs text-[#9BA6B5] mt-4 font-mono">Active mode: preview</p>
</div>`,
    cssCode: ``,
    jsCode: `const btns = document.querySelectorAll('.seg-btn');
const out = document.getElementById('segOutput');
btns.forEach((btn) => {
  btn.addEventListener('click', () => {
    btns.forEach((b) => {
      b.className = 'seg-btn px-3.5 py-1.5 rounded-md text-xs font-medium text-[#9BA6B5]';
    });
    btn.className = 'seg-btn px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#1A2230] text-[#F5F7FA]';
    if (out) out.textContent = 'Active mode: ' + btn.getAttribute('data-mode');
  });
});`,
    reactCode: `import React, { useState } from 'react';
export function SegmentedToggle() {
  const [active, setActive] = useState('preview');
  return (
    <div className="inline-flex p-1 rounded-lg bg-[#090B10] border border-white/10">
      {['preview', 'react', 'html'].map((item) => (
        <button
          key={item}
          onClick={() => setActive(item)}
          className={\`px-3.5 py-1.5 rounded-md text-xs font-medium \${active === item ? 'bg-[#1A2230] text-[#F5F7FA]' : 'text-[#9BA6B5]'}\`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}`,
    tailwindCode: `<div class="inline-flex p-1 rounded-lg bg-[#090B10] border border-white/10">...</div>`,
    tsCode: ``,
  },
  {
    id: 'comp-command-navbar',
    name: 'Three-Zone Workspace Header',
    slug: 'three-zone-command-navbar',
    description: 'Strict 3-zone top navigation bar featuring brand wordmark, single-line links, and quick command trigger.',
    category: 'Navigation',
    subcategory: 'Headers',
    technology: 'React + Tailwind',
    tags: ['navbar', 'header', 'navigation', 'responsive'],
    status: 'published',
    isFeatured: true,
    isPopular: false,
    version: '1.0.0',
    viewsCount: 304,
    copiesCount: 112,
    downloadsCount: 44,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<header class="lv-custom-target w-full rounded-xl bg-[#10141D] border border-white/10 px-5 py-3.5 flex items-center justify-between gap-6 text-[#F5F7FA]">
  <a href="#brand" class="text-sm font-bold tracking-tight whitespace-nowrap shrink-0">LEOVANDYZ</a>
  <nav class="hidden sm:flex items-center gap-5 text-xs text-[#9BA6B5]">
    <a href="#components" class="hover:text-white whitespace-nowrap">Components</a>
    <a href="#templates" class="hover:text-white whitespace-nowrap">Templates</a>
    <a href="#snippets" class="hover:text-white whitespace-nowrap">Snippets</a>
    <a href="#scrape" class="hover:text-white whitespace-nowrap">Scrape Archive</a>
  </nav>
  <button class="px-3 py-1.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold whitespace-nowrap shrink-0">Open Playground</button>
</header>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `export function ThreeZoneHeader() {
  return (
    <header className="w-full rounded-xl bg-[#10141D] border border-white/10 px-5 py-3.5 flex items-center justify-between gap-6 text-[#F5F7FA]">
      <span className="text-sm font-bold tracking-tight">LEOVANDYZ</span>
      <button className="px-3 py-1.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold">Open Playground</button>
    </header>
  );
}`,
    tailwindCode: `<header class="flex items-center justify-between gap-6 px-5 py-3.5 bg-[#10141D]">...</header>`,
    tsCode: ``,
  },
  {
    id: 'comp-telemetry-kpi-card',
    name: 'Tabular Telemetry Metric Grid',
    slug: 'tabular-telemetry-kpi-card',
    description: 'High-density metric strip with tabular numerals, period comparison labels, and zero nested card clutter.',
    category: 'Dashboard & Data',
    subcategory: 'Metrics',
    technology: 'React + Tailwind',
    tags: ['dashboard', 'metrics', 'tabular-nums', 'analytics'],
    status: 'published',
    isFeatured: true,
    isPopular: true,
    version: '1.4.0',
    viewsCount: 389,
    copiesCount: 167,
    downloadsCount: 68,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="lv-custom-target w-full max-w-xl rounded-xl bg-[#141A24] border border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10 grid grid-cols-1 sm:grid-cols-3 text-[#F5F7FA]">
  <div class="p-4">
    <p class="text-xs text-[#9BA6B5]">Published Components</p>
    <p class="text-2xl font-semibold font-mono tabular-nums mt-1">24</p>
    <p class="text-[11px] text-[#9BA6B5] mt-1">Verified production code</p>
  </div>
  <div class="p-4">
    <p class="text-xs text-[#9BA6B5]">Median Bundle Size</p>
    <p class="text-2xl font-semibold font-mono tabular-nums mt-1">4.2 KB</p>
    <p class="text-[11px] text-emerald-400 mt-1">Zero external runtime deps</p>
  </div>
  <div class="p-4">
    <p class="text-xs text-[#9BA6B5]">Sandbox Isolation</p>
    <p class="text-2xl font-semibold font-mono tabular-nums mt-1">CSP v3</p>
    <p class="text-[11px] text-[#8B9CFF] mt-1">Strict iframe origin policy</p>
  </div>
</div>`,
    cssCode: `.tabular-nums { font-variant-numeric: tabular-nums; }`,
    jsCode: ``,
    reactCode: `export function TabularMetricGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 rounded-xl bg-[#141A24] border border-white/10 divide-x divide-white/10">
      <div className="p-4">
        <p className="text-xs text-[#9BA6B5]">Published Components</p>
        <p className="text-2xl font-semibold font-mono tabular-nums mt-1">24</p>
      </div>
    </div>
  );
}`,
    tailwindCode: `<div class="grid grid-cols-3 divide-x divide-white/10">...</div>`,
    tsCode: ``,
  },
  {
    id: 'comp-tiered-pricing-card',
    name: 'Audience-Led SaaS Pricing Card',
    slug: 'audience-saas-pricing-card',
    description: 'Transparent SaaS pricing matrix named by target engineering team size with concrete resource allocations.',
    category: 'Cards',
    subcategory: 'Pricing',
    technology: 'React + Tailwind',
    tags: ['pricing', 'cards', 'saas', 'matrix'],
    status: 'published',
    isFeatured: true,
    isPopular: false,
    version: '1.1.0',
    viewsCount: 295,
    copiesCount: 109,
    downloadsCount: 51,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="lv-custom-target w-full max-w-sm rounded-xl bg-[#141A24] border border-[#8B9CFF]/50 p-6 text-[#F5F7FA]">
  <div class="flex items-center justify-between text-xs text-[#8B9CFF] font-mono mb-2">
    <span>For Scaling Product Teams</span>
    <span>Annual Billing</span>
  </div>
  <h3 class="text-lg font-semibold">Workspace Pro</h3>
  <div class="mt-3 mb-5 flex items-baseline gap-1.5">
    <span class="text-3xl font-bold font-mono tabular-nums">$29</span>
    <span class="text-xs text-[#9BA6B5]">/ seat / month</span>
  </div>
  <ul class="space-y-2.5 text-xs text-[#9BA6B5] mb-6 border-t border-white/10 pt-4">
    <li class="flex justify-between"><span>Private Snippet Vault</span><span class="font-mono text-[#F5F7FA]">Unlimited</span></li>
    <li class="flex justify-between"><span>ZIP Archive Exports</span><span class="font-mono text-[#F5F7FA]">Up to 50 MB</span></li>
    <li class="flex justify-between"><span>Custom Brand Tokens</span><span class="font-mono text-[#F5F7FA]">Included</span></li>
  </ul>
  <button class="w-full rounded-lg bg-[#8B9CFF] py-2.5 text-xs font-semibold text-[#090B10]">Provision Team Workspace</button>
</div>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `export function PricingCard() {
  return <div className="rounded-xl bg-[#141A24] border border-[#8B9CFF]/50 p-6">...</div>;
}`,
    tailwindCode: `<div class="rounded-xl bg-[#141A24] border border-[#8B9CFF]/50 p-6">...</div>`,
    tsCode: ``,
  },
  {
    id: 'comp-command-palette-modal',
    name: 'Keyboard Command Palette Dialog',
    slug: 'keyboard-command-palette',
    description: 'Instant search command palette with live filtering, keyboard shortcut hints, and section grouping.',
    category: 'Modals & Overlays',
    subcategory: 'Command Palette',
    technology: 'React + TypeScript',
    tags: ['modal', 'command-palette', 'search', 'keyboard'],
    status: 'published',
    isFeatured: true,
    isPopular: true,
    version: '1.2.1',
    viewsCount: 360,
    copiesCount: 148,
    downloadsCount: 64,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="lv-custom-target w-full max-w-md rounded-xl bg-[#141A24] border border-white/15 overflow-hidden text-[#F5F7FA] shadow-2xl">
  <div class="px-4 py-3 border-b border-white/10 flex items-center justify-between">
    <input id="cmdFilter" type="text" placeholder="Filter commands (e.g. export, theme)..." class="w-full bg-transparent text-xs text-[#F5F7FA] placeholder-[#9BA6B5] focus:outline-none" />
    <kbd class="text-[10px] font-mono text-[#9BA6B5] border border-white/10 px-1.5 py-0.5 rounded">ESC</kbd>
  </div>
  <div class="p-2 space-y-1 text-xs" id="cmdList">
    <button type="button" class="cmd-item w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#1A2230] text-left">
      <span>Export Component as ZIP Archive</span>
      <span class="font-mono text-[11px] text-[#8B9CFF]">⇧⌘E</span>
    </button>
    <button type="button" class="cmd-item w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#1A2230] text-left text-[#9BA6B5]">
      <span>Open Isolated Code Playground</span>
      <span class="font-mono text-[11px]">⌘P</span>
    </button>
    <button type="button" class="cmd-item w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#1A2230] text-left text-[#9BA6B5]">
      <span>Toggle Dark / Light Workspace Theme</span>
      <span class="font-mono text-[11px]">⌘J</span>
    </button>
  </div>
</div>`,
    cssCode: ``,
    jsCode: `const input = document.getElementById('cmdFilter');
const items = document.querySelectorAll('.cmd-item');
if (input) {
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    items.forEach((el) => {
      el.style.display = el.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
    });
  });
}`,
    reactCode: `export function CommandPaletteModal() {
  return <div className="rounded-xl bg-[#141A24] border border-white/15">...</div>;
}`,
    tailwindCode: `<div class="rounded-xl bg-[#141A24] border border-white/15 overflow-hidden">...</div>`,
    tsCode: ``,
  },
  {
    id: 'comp-validated-api-form',
    name: 'Webhook Endpoint Configuration Form',
    slug: 'webhook-configuration-form',
    description: 'Developer form with URL validation, signing secret generator, event checkboxes, and payload test button.',
    category: 'Forms',
    subcategory: 'Configuration',
    technology: 'React + Tailwind',
    tags: ['forms', 'validation', 'webhook', 'inputs'],
    status: 'published',
    isFeatured: false,
    isPopular: true,
    version: '1.0.5',
    viewsCount: 229,
    copiesCount: 88,
    downloadsCount: 37,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<form class="lv-custom-target w-full max-w-md rounded-xl bg-[#141A24] border border-white/10 p-6 text-[#F5F7FA] space-y-4" onsubmit="return false;">
  <div>
    <h3 class="text-sm font-semibold">Register Webhook Endpoint</h3>
    <p class="text-xs text-[#9BA6B5] mt-0.5">Receive real-time JSON payloads on repository publication events.</p>
  </div>
  <div>
    <label class="block text-xs text-[#9BA6B5] mb-1" for="whUrl">Payload URL</label>
    <input id="whUrl" type="url" value="https://api.yourdomain.dev/webhooks/leovandyz" class="w-full rounded-lg bg-[#090B10] border border-white/10 px-3 py-2 text-xs font-mono text-[#F5F7FA]" />
  </div>
  <div class="space-y-2">
    <span class="block text-xs text-[#9BA6B5]">Event Subscriptions</span>
    <label class="flex items-center gap-2 text-xs">
      <input type="checkbox" checked class="accent-[#8B9CFF]" />
      <span>component.published</span>
    </label>
    <label class="flex items-center gap-2 text-xs">
      <input type="checkbox" checked class="accent-[#8B9CFF]" />
      <span>scrape.archive.verified</span>
    </label>
  </div>
  <button id="saveWhBtn" type="submit" class="w-full rounded-lg bg-[#8B9CFF] py-2 text-xs font-semibold text-[#090B10]">Save Webhook Configuration</button>
</form>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `export function WebhookConfigForm() {
  return <form className="rounded-xl bg-[#141A24] border border-white/10 p-6 space-y-4">...</form>;
}`,
    tailwindCode: `<form class="space-y-4">...</form>`,
    tsCode: ``,
  },
  {
    id: 'comp-skeleton-table-loader',
    name: 'Geometry-Matched Table Skeleton',
    slug: 'geometry-table-skeleton',
    description: 'Smooth shimmer loading placeholder matching 40px data table rows to eliminate cumulative layout shift.',
    category: 'Animations & Loaders',
    subcategory: 'Skeletons',
    technology: 'Tailwind CSS',
    tags: ['skeleton', 'loader', 'animation', 'cls'],
    status: 'published',
    isFeatured: false,
    isPopular: false,
    version: '1.0.1',
    viewsCount: 184,
    copiesCount: 79,
    downloadsCount: 31,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="lv-custom-target w-full max-w-md rounded-xl bg-[#141A24] border border-white/10 p-5 space-y-3">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <div class="h-3.5 w-32 rounded bg-white/10 animate-pulse"></div>
    <div class="h-3.5 w-16 rounded bg-white/10 animate-pulse"></div>
  </div>
  <div class="space-y-2.5">
    <div class="h-8 w-full rounded-lg bg-white/[0.05] animate-pulse"></div>
    <div class="h-8 w-full rounded-lg bg-white/[0.05] animate-pulse"></div>
    <div class="h-8 w-full rounded-lg bg-white/[0.05] animate-pulse"></div>
  </div>
</div>`,
    cssCode: ``,
    jsCode: ``,
    reactCode: `export function TableSkeleton() {
  return <div className="space-y-2.5 animate-pulse">...</div>;
}`,
    tailwindCode: `<div class="h-8 w-full rounded-lg bg-white/[0.05] animate-pulse"></div>`,
    tsCode: ``,
  },
];

export const INITIAL_TEMPLATES: TemplateItem[] = [
  {
    id: 'tpl-devcloud-landing',
    name: 'DevCloud Infrastructure Landing Page',
    slug: 'devcloud-infrastructure-landing',
    description: 'Complete dark-mode developer platform landing page with 3-zone navbar, asymmetric split hero, tabular latency proof strip, and tiered pricing.',
    category: 'Landing Page',
    technology: 'React + Tailwind',
    tags: ['landing-page', 'saas', 'developer-tools', 'dark-ui'],
    status: 'published',
    isFeatured: true,
    viewsCount: 612,
    copiesCount: 215,
    downloadsCount: 134,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="min-h-screen bg-[#090B10] text-[#F5F7FA] font-sans">
  <header class="flex items-center justify-between gap-8 px-8 py-4 border-b border-white/10">
    <span class="text-base font-bold tracking-tight">DEVCLOUD</span>
    <nav class="hidden md:flex items-center gap-6 text-xs text-[#9BA6B5]">
      <a href="#edge" class="hover:text-white">Edge Runtime</a>
      <a href="#storage" class="hover:text-white">Postgres Storage</a>
      <a href="#pricing" class="hover:text-white">Pricing</a>
    </nav>
    <button class="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold">Deploy Cluster</button>
  </header>
  <section class="max-w-5xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
    <div class="lg:col-span-7 space-y-5">
      <p class="text-xs font-mono text-[#8B9CFF]">Zero-Config Container Mesh</p>
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">Deploy isolated workloads in under 400 milliseconds.</h1>
      <p class="text-sm text-[#9BA6B5] leading-relaxed">Built for engineering teams that require predictable cold-start performance, strict regional data residency, and instant rollback snapshots.</p>
      <div class="flex flex-wrap gap-3 pt-2">
        <button class="px-5 py-2.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold">Provision Free Sandbox</button>
        <button class="px-5 py-2.5 rounded-lg bg-[#141A24] border border-white/10 text-xs font-medium">Read Architecture Spec</button>
      </div>
    </div>
    <div class="lg:col-span-5 rounded-xl bg-[#141A24] border border-white/10 p-5 font-mono text-xs space-y-2">
      <div class="text-[#9BA6B5] border-b border-white/10 pb-2">cluster-eu-central-1.yml</div>
      <div class="text-emerald-400">replicas: 4</div>
      <div class="text-[#8B9CFF]">isolation: strict-vm</div>
      <div class="text-[#F5F7FA]">healthcheck: /api/readyz (200 OK)</div>
    </div>
  </section>
</div>`,
    reactCode: `export function DevCloudLandingTemplate() {
  return (
    <div className="min-h-screen bg-[#090B10] text-[#F5F7FA]">
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <span className="font-bold">DEVCLOUD</span>
        <button className="px-4 py-2 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold">Deploy Cluster</button>
      </header>
    </div>
  );
}`,
  },
  {
    id: 'tpl-finledger-dashboard',
    name: 'FinLedger SaaS Analytics Workspace',
    slug: 'finledger-saas-workspace',
    description: 'Enterprise financial ledger and API usage workspace with fixed 256px sidebar, breadcrumb header, and tabular transaction ledger.',
    category: 'Dashboard',
    technology: 'React + TypeScript',
    tags: ['dashboard', 'saas', 'fintech', 'tables'],
    status: 'published',
    isFeatured: true,
    viewsCount: 482,
    copiesCount: 176,
    downloadsCount: 98,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="min-h-[420px] bg-[#090B10] text-[#F5F7FA] grid grid-cols-12 rounded-xl overflow-hidden border border-white/10">
  <aside class="col-span-3 bg-[#10141D] border-r border-white/10 p-4 space-y-2 text-xs">
    <div class="font-bold text-sm mb-4">FINLEDGER</div>
    <div class="px-3 py-2 rounded bg-[#1A2230] text-white">Settlements</div>
    <div class="px-3 py-2 text-[#9BA6B5]">API Keys</div>
    <div class="px-3 py-2 text-[#9BA6B5]">Audit Trail</div>
  </aside>
  <main class="col-span-9 p-6 space-y-5">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold">Daily Settlement Ledger</h2>
      <button class="px-3 py-1.5 rounded-lg bg-[#8B9CFF] text-[#090B10] text-xs font-semibold">Export CSV</button>
    </div>
    <table class="w-full text-left text-xs border-collapse">
      <thead>
        <tr class="border-b border-white/10 text-[#9BA6B5]">
          <th class="py-2">Batch ID</th>
          <th class="py-2">Status</th>
          <th class="py-2 text-right">Net Volume</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/10 font-mono">
        <tr><td class="py-2.5">STL-9041</td><td class="py-2.5 text-emerald-400">Cleared</td><td class="py-2.5 text-right">$142,890.00</td></tr>
        <tr><td class="py-2.5">STL-9042</td><td class="py-2.5 text-emerald-400">Cleared</td><td class="py-2.5 text-right">$89,120.50</td></tr>
      </tbody>
    </table>
  </main>
</div>`,
    reactCode: `export function FinLedgerWorkspace() {
  return <div className="grid grid-cols-12 min-h-screen bg-[#090B10] text-[#F5F7FA]">...</div>;
}`,
  },
  {
    id: 'tpl-minimal-engineer-portfolio',
    name: 'Minimalist Systems Engineer Portfolio',
    slug: 'minimal-systems-portfolio',
    description: 'Editorial portfolio template featuring architecture case studies, open-source repository index, and benchmark writeups.',
    category: 'Developer Portfolio',
    technology: 'HTML + Tailwind',
    tags: ['portfolio', 'minimal', 'editorial', 'developer'],
    status: 'published',
    isFeatured: false,
    viewsCount: 340,
    copiesCount: 124,
    downloadsCount: 67,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    htmlCode: `<div class="max-w-3xl mx-auto bg-[#090B10] text-[#F5F7FA] p-8 space-y-8">
  <header class="flex items-center justify-between border-b border-white/10 pb-4">
    <span class="font-mono text-sm font-semibold">alex.systems</span>
    <span class="text-xs text-[#9BA6B5]">Distributed Storage & Compilers</span>
  </header>
  <section class="space-y-3">
    <h1 class="text-2xl font-bold">Designing low-latency storage engines and developer tooling.</h1>
    <p class="text-sm text-[#9BA6B5]">Selected engineering case studies from 2022 to 2026.</p>
  </section>
</div>`,
    reactCode: `export function EngineerPortfolioTemplate() {
  return <main className="max-w-3xl mx-auto p-8">...</main>;
}`,
  },
];

export const INITIAL_SNIPPETS: SnippetItem[] = [
  {
    id: 'snip-use-debounce',
    name: 'useDebounce Typed React Hook',
    slug: 'use-debounce-react-hook',
    description: 'Zero-dependency generic TypeScript hook for debouncing rapid search inputs and filter queries.',
    category: 'React',
    language: 'TypeScript',
    tags: ['react', 'hooks', 'performance', 'search'],
    status: 'published',
    isPublic: true,
    authorId: 'system-owner',
    authorName: 'Leovandyz Core',
    copiesCount: 318,
    createdAt: NOW,
    updatedAt: NOW,
    code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}`,
  },
  {
    id: 'snip-safe-zip-validator',
    name: 'ZIP Path Traversal & Extension Guard',
    slug: 'zip-path-traversal-guard',
    description: 'Validates archive entry paths against directory traversal, null bytes, and executable file extensions.',
    category: 'Utility',
    language: 'TypeScript',
    tags: ['security', 'zip', 'validation', 'upload'],
    status: 'published',
    isPublic: true,
    authorId: 'system-owner',
    authorName: 'Leovandyz Core',
    copiesCount: 245,
    createdAt: NOW,
    updatedAt: NOW,
    code: `export function isSafeArchivePath(entryPath: string): boolean {
  if (!entryPath || entryPath.includes('\\0')) return false;
  const normalized = entryPath.replace(/\\\\/g, '/').trim();
  if (normalized.startsWith('/') || /^[a-zA-Z]:/.test(normalized)) return false;
  const segments = normalized.split('/');
  return !segments.some((seg) => !seg || seg === '.' || seg === '..' || seg.startsWith('.'));
}`,
  },
  {
    id: 'snip-fetch-exponential-backoff',
    name: 'Fetch with Bounded Exponential Backoff',
    slug: 'fetch-exponential-backoff',
    description: 'Resilient HTTP client helper with jittered backoff that avoids retrying 4xx client errors.',
    category: 'API',
    language: 'TypeScript',
    tags: ['api', 'fetch', 'resilience', 'async'],
    status: 'published',
    isPublic: true,
    authorId: 'system-owner',
    authorName: 'Leovandyz Core',
    copiesCount: 192,
    createdAt: NOW,
    updatedAt: NOW,
    code: `export async function fetchWithBackoff(url: string, init?: RequestInit, maxAttempts = 3): Promise<Response> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(url, init);
    if (response.ok || (response.status >= 400 && response.status < 500)) {
      return response;
    }
    if (attempt === maxAttempts) return response;
    const baseDelay = 500 * Math.pow(2, attempt - 1);
    const jitter = Math.floor(Math.random() * 150);
    await new Promise((r) => setTimeout(r, baseDelay + jitter));
  }
  throw new Error('Unreachable backoff state');
}`,
  },
  {
    id: 'snip-tabular-number-formatter',
    name: 'Compact Metric & Byte Formatter',
    slug: 'compact-metric-byte-formatter',
    description: 'Formats byte sizes and large counters cleanly for tabular dashboard columns.',
    category: 'Utility',
    language: 'TypeScript',
    tags: ['formatting', 'metrics', 'numbers'],
    status: 'published',
    isPublic: true,
    authorId: 'system-owner',
    authorName: 'Leovandyz Core',
    copiesCount: 164,
    createdAt: NOW,
    updatedAt: NOW,
    code: `export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return \`\${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} \${units[i]}\`;
}`,
  },
  {
    id: 'snip-css-grid-autofit',
    name: 'Responsive Intrinsic CSS Grid',
    slug: 'responsive-intrinsic-css-grid',
    description: 'Breakpoint-free responsive card layout using CSS Grid repeat and minmax.',
    category: 'CSS',
    language: 'CSS',
    tags: ['css', 'grid', 'responsive', 'layout'],
    status: 'published',
    isPublic: true,
    authorId: 'system-owner',
    authorName: 'Leovandyz Core',
    copiesCount: 209,
    createdAt: NOW,
    updatedAt: NOW,
    code: `.intrinsic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 1.25rem;
  align-items: stretch;
}`,
  },
];

export const INITIAL_SCRAPES: ScrapedProject[] = [
  {
    id: 'scrape-saas-glass-auth-portal',
    name: 'SaaS Multi-View Authentication Archive',
    slug: 'saas-glass-auth-portal',
    description: 'Curated multi-file authentication portal featuring tabbed Sign In, Create Account, and Recovery views with live password entropy validation and clean CSS custom properties.',
    category: 'Login & Authentication',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    tags: ['auth', 'login', 'register', 'multi-file', 'responsive'],
    sourceUrl: 'https://github.com/leovandyz-open/auth-portal-reference',
    sourceAuthor: 'Leovandyz Open Source Lab',
    license: 'MIT License',
    attributionNotes: 'Published under MIT License. Permitted for commercial and personal adaptation with attribution header preserved.',
    entryFile: 'index.html',
    status: 'published',
    isFeatured: true,
    isPopular: true,
    viewsCount: 742,
    copiesCount: 289,
    downloadsCount: 194,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    files: [
      {
        id: 'sf-auth-1',
        projectId: 'scrape-saas-glass-auth-portal',
        filePath: 'index.html',
        language: 'HTML',
        mimeType: 'text/html',
        fileSize: 1640,
        isEntryFile: true,
        authorId: 'system-owner',
        createdAt: NOW,
        updatedAt: NOW,
        content: `<div class="auth-shell">
  <div class="auth-header">
    <span class="auth-kicker">LEOVANDYZ ARCHIVE #01</span>
    <h1>Unified Identity Gateway</h1>
    <p>Switch between Sign In and Registration to inspect the multi-file validation logic.</p>
  </div>
  <div class="auth-tabs" role="tablist">
    <button type="button" class="tab-btn active" data-tab="signin">Sign In</button>
    <button type="button" class="tab-btn" data-tab="register">Create Account</button>
  </div>
  <form id="authArchiveForm" class="auth-form">
    <div class="field-group">
      <label for="archiveEmail">Developer Email</label>
      <input id="archiveEmail" type="email" value="engineer@leovandyz.dev" required />
    </div>
    <div class="field-group" id="nameFieldGroup" style="display: none;">
      <label for="archiveName">Workspace Handle</label>
      <input id="archiveName" type="text" placeholder="leovandyz_builder" />
    </div>
    <div class="field-group">
      <label for="archivePassword">Security Passphrase</label>
      <input id="archivePassword" type="password" value="Lv#90210_Secure" required />
    </div>
    <button type="submit" class="primary-submit" id="archiveSubmitBtn">Authenticate Session</button>
    <div id="archiveFeedback" class="feedback-banner" aria-live="polite">Ready: All client-side invariants satisfied.</div>
  </form>
</div>`,
      },
      {
        id: 'sf-auth-2',
        projectId: 'scrape-saas-glass-auth-portal',
        filePath: 'style.css',
        language: 'CSS',
        mimeType: 'text/css',
        fileSize: 1420,
        isEntryFile: false,
        authorId: 'system-owner',
        createdAt: NOW,
        updatedAt: NOW,
        content: `.auth-shell {
  width: 100%;
  max-width: 420px;
  background: #141A24;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 28px;
  color: #F5F7FA;
}
.auth-kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #8B9CFF;
}
.auth-header h1 {
  font-size: 20px;
  font-weight: 700;
  margin: 6px 0 4px;
}
.auth-header p {
  font-size: 12px;
  color: #9BA6B5;
  margin: 0 0 18px;
}
.auth-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #090B10;
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.tab-btn {
  background: transparent;
  color: #9BA6B5;
  border: none;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
}
.tab-btn.active {
  background: #1A2230;
  color: #F5F7FA;
}
.field-group {
  margin-bottom: 14px;
}
.field-group label {
  display: block;
  font-size: 12px;
  color: #9BA6B5;
  margin-bottom: 6px;
}
.field-group input {
  width: 100%;
  background: #090B10;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #F5F7FA;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
}
.primary-submit {
  width: 100%;
  background: #8B9CFF;
  color: #090B10;
  font-weight: 700;
  font-size: 13px;
  padding: 11px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 4px;
}
.feedback-banner {
  margin-top: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #34D399;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 8px 10px;
  border-radius: 6px;
}`,
      },
      {
        id: 'sf-auth-3',
        projectId: 'scrape-saas-glass-auth-portal',
        filePath: 'script.js',
        language: 'JavaScript',
        mimeType: 'application/javascript',
        fileSize: 820,
        isEntryFile: false,
        authorId: 'system-owner',
        createdAt: NOW,
        updatedAt: NOW,
        content: `const tabs = document.querySelectorAll('.tab-btn');
const nameGroup = document.getElementById('nameFieldGroup');
const submitBtn = document.getElementById('archiveSubmitBtn');
const feedback = document.getElementById('archiveFeedback');
const form = document.getElementById('authArchiveForm');

tabs.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.getAttribute('data-tab');
    if (nameGroup && submitBtn) {
      nameGroup.style.display = mode === 'register' ? 'block' : 'none';
      submitBtn.textContent = mode === 'register' ? 'Provision Developer Account' : 'Authenticate Session';
    }
  });
});

if (form && feedback) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.textContent = 'Verified token issued at ' + new Date().toLocaleTimeString();
  });
}`,
      },
      {
        id: 'sf-auth-4',
        projectId: 'scrape-saas-glass-auth-portal',
        filePath: 'README.md',
        language: 'Markdown',
        mimeType: 'text/markdown',
        fileSize: 380,
        isEntryFile: false,
        authorId: 'system-owner',
        createdAt: NOW,
        updatedAt: NOW,
        content: `# SaaS Multi-View Authentication Archive

- **Entry File**: \`index.html\`
- **Stylesheet**: \`style.css\`
- **Controller**: \`script.js\`
- **License**: MIT License

## Usage
Import all three files into your static web host or adapt the CSS custom tokens into your component system.`,
      },
    ],
  },
  {
    id: 'scrape-fintech-pricing-matrix',
    name: 'Interactive Seat & Billing Calculator Archive',
    slug: 'fintech-pricing-matrix',
    description: 'Multi-file SaaS pricing calculator with live seat count slider, annual discount computation, and tabular cost breakdown.',
    category: 'Website Sections',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    tags: ['pricing', 'calculator', 'saas', 'interactive'],
    sourceUrl: 'https://github.com/leovandyz-open/fintech-pricing-calculator',
    sourceAuthor: 'Leovandyz UI Engineering',
    license: 'MIT License',
    attributionNotes: 'Released under MIT License for open developer reference and commercial projects.',
    entryFile: 'index.html',
    status: 'published',
    isFeatured: true,
    isPopular: true,
    viewsCount: 618,
    copiesCount: 241,
    downloadsCount: 158,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    files: [
      {
        id: 'sf-price-1',
        projectId: 'scrape-fintech-pricing-matrix',
        filePath: 'index.html',
        language: 'HTML',
        mimeType: 'text/html',
        fileSize: 1320,
        isEntryFile: true,
        authorId: 'system-owner',
        createdAt: NOW,
        updatedAt: NOW,
        content: `<div class="calc-card">
  <div class="calc-top">
    <div>
      <span class="calc-tag">TRANSPARENT SEAT ESTIMATOR</span>
      <h2>Team Cluster Estimator</h2>
    </div>
    <div class="price-display">
      <span id="totalCost">$145</span>
      <small>/ month</small>
    </div>
  </div>
  <div class="slider-row">
    <div class="slider-labels">
      <span>Active Developer Seats</span>
      <strong id="seatCountLabel">5 seats</strong>
    </div>
    <input id="seatRange" type="range" min="1" max="50" value="5" />
  </div>
  <div class="spec-grid">
    <div><span>Included Build Minutes</span><strong id="buildMins">15,000 mins</strong></div>
    <div><span>Concurrent Sandboxes</span><strong id="sandboxCount">10 nodes</strong></div>
  </div>
</div>`,
      },
      {
        id: 'sf-price-2',
        projectId: 'scrape-fintech-pricing-matrix',
        filePath: 'style.css',
        language: 'CSS',
        mimeType: 'text/css',
        fileSize: 980,
        isEntryFile: false,
        authorId: 'system-owner',
        createdAt: NOW,
        updatedAt: NOW,
        content: `.calc-card {
  width: 100%;
  max-width: 480px;
  background: #141A24;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 24px;
  color: #F5F7FA;
}
.calc-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}
.calc-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #8B9CFF;
}
.calc-top h2 {
  margin: 4px 0 0;
  font-size: 18px;
}
.price-display span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 28px;
  font-weight: 700;
  color: #8B9CFF;
}
.price-display small {
  font-size: 12px;
  color: #9BA6B5;
}
.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 8px;
}
#seatRange {
  width: 100%;
  accent-color: #8B9CFF;
}
.spec-grid {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 12px;
}
.spec-grid span {
  display: block;
  color: #9BA6B5;
  margin-bottom: 4px;
}
.spec-grid strong {
  font-family: 'JetBrains Mono', monospace;
}`,
      },
      {
        id: 'sf-price-3',
        projectId: 'scrape-fintech-pricing-matrix',
        filePath: 'script.js',
        language: 'JavaScript',
        mimeType: 'application/javascript',
        fileSize: 540,
        isEntryFile: false,
        authorId: 'system-owner',
        createdAt: NOW,
        updatedAt: NOW,
        content: `const range = document.getElementById('seatRange');
const seatLabel = document.getElementById('seatCountLabel');
const totalCost = document.getElementById('totalCost');
const buildMins = document.getElementById('buildMins');
const sandboxCount = document.getElementById('sandboxCount');

if (range) {
  range.addEventListener('input', (e) => {
    const seats = Number(e.target.value);
    seatLabel.textContent = seats + (seats === 1 ? ' seat' : ' seats');
    totalCost.textContent = '$' + (seats * 29);
    buildMins.textContent = (seats * 3000).toLocaleString() + ' mins';
    sandboxCount.textContent = (seats * 2) + ' nodes';
  });
}`,
      },
    ],
  },
  {
    id: 'scrape-kanban-sprint-board',
    name: 'Interactive Sprint Task Board Archive',
    slug: 'kanban-sprint-board',
    description: 'Clean multi-column engineering task tracker with instant status promotion buttons and live backlog counter.',
    category: 'Dashboard UI',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    tags: ['dashboard', 'kanban', 'workflow', 'interactive'],
    sourceUrl: 'https://github.com/leovandyz-open/sprint-board-lite',
    sourceAuthor: 'Leovandyz Systems',
    license: 'Apache-2.0',
    attributionNotes: 'Licensed under Apache 2.0. Free to modify, bundle, and distribute.',
    entryFile: 'index.html',
    status: 'published',
    isFeatured: true,
    isPopular: false,
    viewsCount: 504,
    copiesCount: 183,
    downloadsCount: 112,
    authorId: 'system-owner',
    createdAt: NOW,
    updatedAt: NOW,
    files: [
      {
        id: 'sf-kan-1',
        projectId: 'scrape-kanban-sprint-board',
        filePath: 'index.html',
        language: 'HTML',
        mimeType: 'text/html',
        fileSize: 1190,
        isEntryFile: true,
        authorId: 'system-owner',
        createdAt: NOW,
        updatedAt: NOW,
        content: `<div class="board-wrap">
  <div class="board-head">
    <h3>Sprint 42 Engineering Queue</h3>
    <button id="addTaskBtn" type="button">+ Add Task</button>
  </div>
  <div class="task-list" id="taskList">
    <div class="task-row">
      <span>Harden ZIP path traversal checks</span>
      <span class="badge-done">Completed</span>
    </div>
    <div class="task-row">
      <span>Verify WCAG AA contrast ratios on dark surfaces</span>
      <span class="badge-done">Completed</span>
    </div>
    <div class="task-row">
      <span>Isolate iframe runtime CSP headers</span>
      <span class="badge-active">In Review</span>
    </div>
  </div>
</div>`,
      },
      {
        id: 'sf-kan-2',
        projectId: 'scrape-kanban-sprint-board',
        filePath: 'style.css',
        language: 'CSS',
        mimeType: 'text/css',
        fileSize: 780,
        isEntryFile: false,
        authorId: 'system-owner',
        createdAt: NOW,
        updatedAt: NOW,
        content: `.board-wrap {
  width: 100%;
  max-width: 500px;
  background: #141A24;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 20px;
  color: #F5F7FA;
}
.board-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.board-head h3 { margin: 0; font-size: 15px; }
.board-head button {
  background: #8B9CFF;
  color: #090B10;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.task-list { display: flex; flex-direction: column; gap: 8px; }
.task-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #090B10;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12px;
}
.badge-done { color: #34D399; font-family: monospace; }
.badge-active { color: #8B9CFF; font-family: monospace; }`,
      },
      {
        id: 'sf-kan-3',
        projectId: 'scrape-kanban-sprint-board',
        filePath: 'script.js',
        language: 'JavaScript',
        mimeType: 'application/javascript',
        fileSize: 410,
        isEntryFile: false,
        authorId: 'system-owner',
        createdAt: NOW,
        updatedAt: NOW,
        content: `const addBtn = document.getElementById('addTaskBtn');
const list = document.getElementById('taskList');
if (addBtn && list) {
  addBtn.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'task-row';
    row.innerHTML = '<span>New verification check #' + (list.children.length + 1) + '</span><span class="badge-active">Queued</span>';
    list.appendChild(row);
  });
}`,
      },
    ],
  },
];

export const INITIAL_ASSETS: AssetItem[] = [
  {
    id: 'asset-shield-svg',
    name: 'security-shield-mark.svg',
    mimeType: 'image/svg+xml',
    extension: 'svg',
    sizeBytes: 642,
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%238B9CFF" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    category: 'Icons',
    uploadedBy: 'system-owner',
    createdAt: NOW,
  },
  {
    id: 'asset-grid-svg',
    name: 'component-matrix-badge.svg',
    mimeType: 'image/svg+xml',
    extension: 'svg',
    sizeBytes: 580,
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%2334D399" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    category: 'Badges',
    uploadedBy: 'system-owner',
    createdAt: NOW,
  },
];
