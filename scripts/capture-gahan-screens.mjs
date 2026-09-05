/**
 * Capture real Gahan UI screenshots into klandweb public assets.
 * Usage: node scripts/capture-gahan-screens.mjs
 */
import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const gahanEnv = path.resolve(root, "../gahan/.env.local");
const outDir = path.resolve(root, "public/assets/projects/gahan");
const credsPath = path.resolve(root, ".tmp-gahan-creds.json");

dotenv.config({ path: gahanEnv });

const BASE = process.env.GAHAN_URL || "http://localhost:3001";
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  "C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  `${process.env.LOCALAPPDATA}\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe`,
].filter(Boolean);

const chromePath = chromeCandidates.find((p) => fs.existsSync(p));
if (!chromePath) {
  console.error("Chrome not found");
  process.exit(1);
}

const creds = fs.existsSync(credsPath)
  ? JSON.parse(fs.readFileSync(credsPath, "utf8"))
  : {
      adminEmail: process.env.SEED_ADMIN_EMAIL,
      adminPass: process.env.SEED_ADMIN_PASSWORD,
      empEmail: "emp001@gahan.demo",
      empPass: "Gahan!Demo123",
    };

fs.mkdirSync(outDir, { recursive: true });

async function login(page, email, password) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.fill("#username", email);
  await page.fill("#password", password);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 20000 }),
    page.click('button[type="submit"]'),
  ]);
}

async function setLight(page) {
  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  });
  const light = page.getByRole("radio", { name: "روشن" });
  if (await light.count()) await light.click({ force: true }).catch(() => {});
}

async function shot(page, name) {
  // hide nextjs overlay
  await page.addStyleTag({
    content: `[data-nextjs-toast],[data-nextjs-dev-overlay],nextjs-portal{display:none!important}`,
  }).catch(() => {});
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, type: "png" });
  console.log("saved", name);
}

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
});

try {
  // ---- Admin desktop ----
  const admin = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    locale: "fa-IR",
  });
  await login(admin, creds.adminEmail, creds.adminPass);
  await setLight(admin);
  await admin.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
  await setLight(admin);
  await admin.waitForTimeout(800);
  await shot(admin, "admin-dashboard.png");

  await admin.goto(`${BASE}/admin/today`, { waitUntil: "networkidle" });
  await admin.waitForTimeout(600);
  await shot(admin, "admin-today.png");

  await admin.goto(`${BASE}/admin/employees`, { waitUntil: "networkidle" });
  await admin.waitForTimeout(600);
  await shot(admin, "admin-employees.png");

  await admin.goto(`${BASE}/admin/reports`, { waitUntil: "networkidle" });
  await admin.waitForTimeout(600);
  await shot(admin, "admin-reports.png");

  await admin.goto(`${BASE}/admin/workplaces`, { waitUntil: "networkidle" });
  await admin.waitForTimeout(1000);
  await shot(admin, "admin-workplaces.png");

  await admin.close();

  // ---- Employee mobile ----
  const emp = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: "fa-IR",
  });
  await emp.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await setLight(emp);
  await emp.waitForTimeout(400);
  await shot(emp, "login-mobile.png");

  await login(emp, creds.empEmail, creds.empPass);
  await setLight(emp);
  await emp.goto(`${BASE}/app`, { waitUntil: "networkidle" });
  await setLight(emp);
  await emp.waitForTimeout(800);
  await shot(emp, "employee-home.png");

  await emp.goto(`${BASE}/app/history`, { waitUntil: "networkidle" });
  await emp.waitForTimeout(600);
  await shot(emp, "employee-history.png");

  await emp.goto(`${BASE}/app/leave`, { waitUntil: "networkidle" });
  await emp.waitForTimeout(600);
  await shot(emp, "employee-leave.png");

  await emp.close();

  // Login desktop (for gallery)
  const loginPage = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  await loginPage.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await setLight(loginPage);
  await loginPage.waitForTimeout(500);
  await shot(loginPage, "login.png");
  await loginPage.close();

  console.log("done ->", outDir);
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
