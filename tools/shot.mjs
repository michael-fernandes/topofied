// True-viewport screenshots via CDP. Headless Chrome clamps its window to a
// 500px minimum on macOS, so device metrics must be overridden explicitly.
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, out, W = 390, H = 844, dsf = 2] = process.argv.slice(2);
const PORT = 9333 + Math.floor(Math.random() * 400);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const proc = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  "--force-prefers-reduced-motion",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), "cdp-"))}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function targets() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const j = await r.json();
      const page = j.find((t) => t.type === "page");
      if (page) return page;
    } catch {}
    await sleep(200);
  }
  throw new Error("chrome did not come up");
}

const page = await targets();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) pending.get(m.id)(m.result);
};
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id;
    pending.set(i, r);
    ws.send(JSON.stringify({ id: i, method, params }));
  });

await send("Emulation.setDeviceMetricsOverride", {
  width: +W, height: +H, deviceScaleFactor: +dsf, mobile: true,
});
await send("Page.enable");
await send("Page.navigate", { url });
await sleep(6000);
const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
writeFileSync(out, Buffer.from(data, "base64"));
console.log(`${out} @ ${W}x${H} dsf${dsf}`);
ws.close();
proc.kill();
process.exit(0);
