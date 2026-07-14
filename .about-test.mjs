import { chromium } from "playwright-core";
import { homedir } from "node:os";
import { join } from "node:path";
const OUT = process.env.OUT;
const browser = await chromium.launch({ executablePath: join(homedir(), "AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe") });
const errors = [];
const mk = (label) => (page) => {
  page.on("console", (m) => m.type() === "error" && errors.push(`${label}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`${label}: ${e.message}`));
};
// desktop dark + light + toggle
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  mk("desktop")(page);
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/about-dark.png` });
  // hit-target audit + toggle to designer
  const btn = page.locator('button[aria-pressed]', { hasText: "designer" });
  const box = await btn.boundingBox();
  if (box.height < 44) errors.push(`designer chip only ${box.height}px tall`);
  await btn.click();
  await page.waitForTimeout(700);
  const pressed = await btn.getAttribute("aria-pressed");
  if (pressed !== "true") errors.push("designer chip aria-pressed not true after click");
  await page.screenshot({ path: `${OUT}/about-dark-designer.png` });
  await page.click('button[aria-label*="theme"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/about-light.png` });
  await page.close();
}
// mobile
{
  const page = await browser.newPage({ viewport: { width: 375, height: 700 }, hasTouch: true, isMobile: true });
  mk("mobile")(page);
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/about-mobile.png`, fullPage: false });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) errors.push("mobile: horizontal overflow");
  await page.close();
}
console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "PASS — checks green");
await browser.close();
