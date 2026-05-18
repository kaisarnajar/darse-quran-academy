import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import path from "path";

const bogusClose = "</" + "motion" + ">";
const divClose = "</" + "div" + ">";

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory() && !["node_modules", ".git", ".next"].includes(name)) {
      walk(full, files);
    } else if (name.endsWith(".tsx")) {
      files.push(full);
    }
  }
  return files;
}

for (const file of walk(".")) {
  let content = readFileSync(file, "utf8");
  if (!content.includes("motion")) continue;
  const before = content;
  content = content.replaceAll(bogusClose, divClose);
  content = content.replace(/<motion\b/g, "<div");
  if (content !== before) {
    writeFileSync(file, content);
    console.log("fixed", file);
  }
}
