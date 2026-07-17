import { chromium } from "playwright-core";
import { homedir } from "node:os";
import { join } from "node:path";
const OUT = process.env.OUT;
const browser = await chromium.launch({ executablePath: join(homedir(), "AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe") });
const errors = [];
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("console", (m) => m.type() === "error" && errors.push("desktop: " + m.text()));
  page.on("pageerror", (e) => errors.push("desktop: " + e.message));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.locator("#log").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${OUT}/log-dark.png` });
  await page.click('button[aria-label*="theme"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/log-light.png` });
  await page.close();
}
{
  const page = await browser.newPage({ viewport: { width: 375, height: 700 }, hasTouch: true, isMobile: true });
  page.on("pageerror", (e) => errors.push("mobile: " + e.message));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.locator("#log").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${OUT}/log-mobile.png` });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) errors.push("mobile: horizontal overflow");
  await page.close();
}
console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "PASS");
await browser.close();
