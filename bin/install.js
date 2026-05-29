#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const skillName = "knowledge-juicer";
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultSkillDir = path.join(os.homedir(), ".codex", "skills", skillName);
const defaultImaDir = path.join(os.homedir(), ".config", "ima");
const skillEntries = ["SKILL.md", "README.md", "LICENSE", "assets", "references", "scripts"];

const args = process.argv.slice(2);
const flags = new Set(args.filter((arg) => arg.startsWith("--")));

function valueAfter(flag) {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  return args[index + 1] && !args[index + 1].startsWith("--") ? args[index + 1] : null;
}

function showHelp() {
  console.log(`Knowledge Juicer installer

Usage:
  npx github:fxyadela/knowledge-juicer
  npx github:fxyadela/knowledge-juicer -- --yes

Options:
  --dest <path>       Install to a custom skills directory
  --yes              Use defaults and skip questions
  --force            Overwrite existing Skill files
  --skip-config      Install only, without Obsidian/IMA setup
  --help             Show this help
`);
}

if (flags.has("--help") || flags.has("-h")) {
  showHelp();
  process.exit(0);
}

const destination = path.resolve(expandHome(valueAfter("--dest") || defaultSkillDir));
const yes = flags.has("--yes") || flags.has("-y");
const force = flags.has("--force");
const skipConfig = flags.has("--skip-config");

function expandHome(inputPath) {
  if (!inputPath) return inputPath;
  if (inputPath === "~") return os.homedir();
  if (inputPath.startsWith("~/")) return path.join(os.homedir(), inputPath.slice(2));
  return inputPath;
}

function copyEntry(entry) {
  const source = path.join(packageRoot, entry);
  const target = path.join(destination, entry);
  if (!fs.existsSync(source)) return;
  fs.cpSync(source, target, {
    recursive: true,
    force: true,
    errorOnExist: false
  });
}

function findObsidianVault() {
  const candidates = [
    path.join(os.homedir(), "Documents", "Obsidian Vault"),
    path.join(os.homedir(), "Obsidian Vault")
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || "";
}

function ensureLearningFolders(vaultPath) {
  if (!vaultPath) return;
  const folders = [
    "📚 学习笔记",
    path.join("📚 学习笔记", "📺 YouTube"),
    path.join("📚 学习笔记", "🐦 X"),
    path.join("📚 学习笔记", "💬 Reddit"),
    path.join("📚 学习笔记", "📝 博客"),
    path.join("📚 学习笔记", "📄 其他")
  ];
  for (const folder of folders) {
    fs.mkdirSync(path.join(vaultPath, folder), { recursive: true });
  }
}

function readExistingConfig() {
  const configPath = path.join(destination, "config.local.json");
  if (!fs.existsSync(configPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch {
    return {};
  }
}

function writeConfig(config) {
  const configPath = path.join(destination, "config.local.json");
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  return configPath;
}

async function askHidden(question) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await rl.question(question);
    rl.close();
    return answer.trim();
  }

  return new Promise((resolve) => {
    let value = "";
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    function onData(char) {
      if (char === "\u0003") {
        process.stdout.write("\n");
        process.exit(130);
      }
      if (char === "\r" || char === "\n") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.off("data", onData);
        process.stdout.write("\n");
        resolve(value.trim());
        return;
      }
      if (char === "\u007f") {
        value = value.slice(0, -1);
        return;
      }
      value += char;
      process.stdout.write("*");
    }

    process.stdin.on("data", onData);
  });
}

async function configureLocalSettings() {
  const existing = readExistingConfig();
  let rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const detectedVault = findObsidianVault();
  let vaultPath = existing.obsidian?.vaultPath || detectedVault;

  if (!yes && process.stdin.isTTY) {
    const prompt = detectedVault
      ? `Obsidian Vault detected at "${detectedVault}". Use it? (Y/n) `
      : "Obsidian Vault not detected. Enter path, or leave blank to skip: ";
    const answer = (await rl.question(prompt)).trim();
    if (detectedVault && answer.toLowerCase() === "n") {
      vaultPath = (await rl.question("Enter your Obsidian Vault path, or leave blank to skip: ")).trim();
    } else if (!detectedVault) {
      vaultPath = answer;
    }
  }

  vaultPath = expandHome(vaultPath || "");
  if (vaultPath) {
    fs.mkdirSync(vaultPath, { recursive: true });
    ensureLearningFolders(vaultPath);
  }

  const imaClientPath = path.join(defaultImaDir, "client_id");
  const imaKeyPath = path.join(defaultImaDir, "api_key");
  let imaEnabled = fs.existsSync(imaClientPath) && fs.existsSync(imaKeyPath);
  let knowledgeBaseName = existing.ima?.defaultKnowledgeBaseName || "";
  let knowledgeBaseId = existing.ima?.defaultKnowledgeBaseId || "";

  if (!yes && process.stdin.isTTY) {
    const configureIma = (await rl.question("Connect IMA knowledge base now? (y/N) ")).trim().toLowerCase();
    if (configureIma === "y") {
      fs.mkdirSync(defaultImaDir, { recursive: true });
      if (!fs.existsSync(imaClientPath)) {
        const clientId = (await rl.question("Paste your IMA Client ID: ")).trim();
        if (clientId) fs.writeFileSync(imaClientPath, `${clientId}\n`, "utf8");
      }
      if (!fs.existsSync(imaKeyPath)) {
        rl.close();
        const apiKey = await askHidden("Paste your IMA API Key (hidden): ");
        if (apiKey) fs.writeFileSync(imaKeyPath, `${apiKey}\n`, "utf8");
        rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      }
      imaEnabled = fs.existsSync(imaClientPath) && fs.existsSync(imaKeyPath);
      knowledgeBaseName = (await rl.question("Default IMA knowledge base name (optional): ")).trim();
      knowledgeBaseId = (await rl.question("Default IMA knowledge_base_id (optional): ")).trim();
    }
  }

  rl.close();

  const config = {
    obsidian: {
      enabled: Boolean(vaultPath),
      vaultPath: vaultPath || ""
    },
    ima: {
      enabled: imaEnabled,
      credentialsDir: defaultImaDir,
      defaultKnowledgeBaseName: knowledgeBaseName,
      defaultKnowledgeBaseId: knowledgeBaseId
    }
  };

  return writeConfig(config);
}

function installSkillFiles() {
  if (fs.existsSync(destination) && force) {
    const configPath = path.join(destination, "config.local.json");
    const existingConfig = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : null;
    fs.rmSync(destination, { recursive: true, force: true });
    fs.mkdirSync(destination, { recursive: true });
    if (existingConfig) fs.writeFileSync(configPath, existingConfig, "utf8");
  } else {
    fs.mkdirSync(destination, { recursive: true });
  }

  for (const entry of skillEntries) copyEntry(entry);
}

console.log("Installing Knowledge Juicer...");
installSkillFiles();

let configPath = "";
if (!skipConfig) {
  configPath = await configureLocalSettings();
}

console.log("");
console.log(`Installed to: ${destination}`);
if (configPath) console.log(`Local config: ${configPath}`);
console.log("");
console.log("Next step: restart Codex or open a new session so the Skill is loaded.");
