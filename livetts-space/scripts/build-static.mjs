import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist", "space-static");
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(path.join(output, "static"), { recursive: true });
const policy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self' blob:; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'";
const html = fs.readFileSync(path.join(root, "static", "index.html"), "utf8")
  .replace('<html lang="en">', '<html lang="en" data-static-preview="true">')
  .replace('<meta charset="utf-8">', `<meta charset="utf-8">\n  <meta http-equiv="Content-Security-Policy" content="${policy}">`)
  .replaceAll('="/static/', '="./static/')
  .replaceAll('href="/"', 'href="./"');
fs.writeFileSync(path.join(output, "index.html"), html);
fs.copyFileSync(path.join(root, "STATIC_SPACE.md"), path.join(output, "README.md"));
for (const filename of ["app.js", "style.css", "favicon.svg"]) {
  fs.copyFileSync(path.join(root, "static", filename), path.join(output, "static", filename));
}
for (const filename of ["index.html", "README.md", "static/app.js", "static/style.css", "static/favicon.svg"]) {
  const text = fs.readFileSync(path.join(output, filename), "utf8");
  if (/(?:sk-[A-Za-z0-9_-]{16,}|hf_[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{16,}|https?:\/\/(?:api)?joyspace\.jd\.com)/i.test(text)) {
    throw new Error(`Refusing credential-like or internal content in ${filename}`);
  }
}
console.log(`Static preview built: ${output}`);
console.log("5 public files; no backend, keys, weights, or audio recordings included.");
