import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const tag = process.argv[2]?.replace(/^refs\/tags\//, "");

if (!tag) {
  throw new Error("Usage: node scripts/release-notes.mjs <tag>");
}

const version = tag.replace(/^v/, "");
const lines = readFileSync(new URL("../CHANGELOG.md", import.meta.url), "utf8").split(
  /\r?\n/,
);
const heading = `## [${version}]`;
const start = lines.findIndex(
  (line) => line === heading || line.startsWith(`${heading} - `),
);

if (start === -1) {
  throw new Error(`CHANGELOG.md has no section for ${tag}`);
}

const next = lines.findIndex(
  (line, index) => index > start && line.startsWith("## ["),
);
const notes = lines
  .slice(start + 1, next === -1 ? undefined : next)
  .join("\n")
  .trim();

if (!notes) {
  throw new Error(`The CHANGELOG.md section for ${tag} is empty`);
}

const output = [notes];

try {
  const previousTag = execFileSync(
    "git",
    ["describe", "--tags", "--abbrev=0", `${tag}^`],
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
  ).trim();
  const repository = process.env.GITHUB_REPOSITORY;
  const server = process.env.GITHUB_SERVER_URL ?? "https://github.com";

  if (previousTag && repository) {
    output.push(
      `[Full changelog](${server}/${repository}/compare/${previousTag}...${tag})`,
    );
  }
} catch {
  // A first release has no previous tag to compare with.
}

process.stdout.write(`${output.join("\n\n")}\n`);
