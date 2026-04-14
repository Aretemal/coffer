import fs from "node:fs/promises";
import path from "node:path";

export function die(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

export function parseArgs(argv) {
  // Supports:
  //   <entity> <name> [--ns <namespace>] [--no-store]
  const out = {
    entity: null,
    name: null,
    ns: null,
    store: true,
  };

  const args = [...argv];
  out.entity = args.shift() ?? null;
  out.name = args.shift() ?? null;

  while (args.length) {
    const a = args.shift();
    if (a === "--ns") {
      out.ns = args.shift() ?? null;
      continue;
    }
    if (a === "--no-store") {
      out.store = false;
      continue;
    }
    die(`Unknown аргумент: ${a}`);
  }

  return out;
}

export function validateNameOrNs(value, label) {
  if (!value) return;
  if (!/^[A-Za-z0-9-]+$/.test(value)) {
    die(`${label} должен быть в формате [A-Za-z0-9-]. Получено: ${value}`);
  }
}

export function pascalCase(kebab) {
  return kebab
    .split("-")
    .filter(Boolean)
    .map((p) => p.slice(0, 1).toUpperCase() + p.slice(1))
    .join("");
}

export function widgetFolderName(name) {
  // If kebab-case → PascalCase. If already PascalCase-ish → keep.
  return name.includes("-") ? pascalCase(name) : name;
}

export async function exists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

export async function writeFileSafe(filePath, contents) {
  if (await exists(filePath)) {
    die(`Файл уже существует: ${filePath}`);
  }
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, contents, "utf8");
}

export async function removeDirSafe(dirPath) {
  if (!(await exists(dirPath))) {
    die(`Не найдено: ${dirPath}`);
  }
  await fs.rm(dirPath, { recursive: true, force: false });
}

export function resolveWebWidgetsRoot(cwd) {
  // Run from repo root OR /web.
  const repoRoot = path.basename(cwd).toLowerCase() === "web" ? path.dirname(cwd) : cwd;

  // Target structure: web/src/widgets
  const a = path.resolve(repoRoot, "web", "src", "widgets");
  const b = path.resolve(cwd, "src", "widgets");
  return { a, b };
}

