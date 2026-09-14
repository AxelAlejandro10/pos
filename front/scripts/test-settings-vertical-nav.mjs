#!/usr/bin/env node
/**
 * Smoke: Settings vertical nav layout + ?section= deep link (#395).
 */
import { createRequire } from 'module';
import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { isHeadless } from './puppeteer-headless.mjs';

const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const repoRoot = resolve(__dirname, '..', '..');

function loadEnv() {
  const envPath = join(repoRoot, '.env');
  if (existsSync(envPath)) {
    try {
      readFileSync(envPath, 'utf8')
        .split('\n')
        .forEach((line) => {
          const m = line.match(/^([^#=]+)=(.*)$/);
          if (m && !process.env[m[1].trim()]) {
            process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
          }
        });
    } catch {
      /* ignore */
    }
  }
}

function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean);
  return candidates.find((p) => existsSync(p));
}

async function detectBaseUrl() {
  if (process.env.BASE_URL) return process.env.BASE_URL.replace(/\/$/, '');
  for (const port of [4203, 4202, 4200]) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/`);
      if (res.ok || res.status === 304) return `http://127.0.0.1:${port}`;
    } catch {
      /* try next */
    }
  }
  throw new Error('No app on 4203/4202/4200');
}

loadEnv();
const baseUrl = await detectBaseUrl();
const email = process.env.LOGIN_EMAIL || process.env.DEMO_LOGIN_EMAIL;
const password = process.env.LOGIN_PASSWORD || process.env.DEMO_LOGIN_PASSWORD;
if (!email || !password) {
  console.error('Need LOGIN_EMAIL/PASSWORD or DEMO_LOGIN_*');
  process.exit(1);
}

const browser = await puppeteer.launch({
  headless: isHeadless(),
  executablePath: chromePath(),
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
let failed = false;

try {
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${baseUrl}/login?tenant=1`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 15000 });
  await page.type('input[type="email"], input[name="email"]', email);
  await page.type('input[type="password"], input[name="password"]', password);
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
  ]);

  await page.goto(`${baseUrl}/settings`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('[data-testid="settings-nav"]', { timeout: 15000 });

  const desktop = await page.evaluate(() => {
    const layoutEl = document.querySelector('[data-testid="settings-layout"]');
    const style = layoutEl ? getComputedStyle(layoutEl) : null;
    return {
      hasNav: !!document.querySelector('[data-testid="settings-nav"]'),
      hasLayout: !!layoutEl,
      flexDirection: style?.flexDirection,
      hasOldTabs: !!document.querySelector('.tabs-container'),
      navItemCount: document.querySelectorAll('.settings-nav-item').length,
    };
  });
  console.log('desktop', desktop);
  if (!desktop.hasNav || desktop.hasOldTabs || desktop.flexDirection !== 'row') {
    console.error('FAIL: expected row layout with vertical nav on desktop');
    failed = true;
  }

  await page.click('[data-testid="settings-payments-tab"]');
  await page.waitForFunction(() => location.search.includes('section=payments'), { timeout: 5000 });
  console.log('url after payments', page.url());

  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('[data-testid="settings-payments-tab"].active', { timeout: 10000 });
  console.log('payments active after reload');

  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/settings?section=security`, { waitUntil: 'networkidle2' });
  const mobile = await page.evaluate(() => {
    const layoutEl = document.querySelector('[data-testid="settings-layout"]');
    const style = layoutEl ? getComputedStyle(layoutEl) : null;
    return {
      flexDirection: style?.flexDirection,
      securityVisible: !!document.querySelector('[data-testid="settings-security-section"]'),
    };
  });
  console.log('mobile', mobile);
  if (!mobile.securityVisible || mobile.flexDirection !== 'column') {
    console.error('FAIL: expected column layout + security section on mobile');
    failed = true;
  }
} catch (e) {
  console.error(e);
  failed = true;
} finally {
  await browser.close();
}

if (failed) {
  console.error('>>> RESULT: Settings vertical nav smoke FAILED');
  process.exit(1);
}
console.log('>>> RESULT: Settings vertical nav smoke passed.');
