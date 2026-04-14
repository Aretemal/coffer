#!/usr/bin/env node
import path from "node:path";

import {
  die,
  ensureDir,
  exists,
  parseArgs,
  resolveWebWidgetsRoot,
  validateNameOrNs,
  widgetFolderName,
  writeFileSafe,
} from "./_fsd.mjs";

const { entity, name, ns, store } = parseArgs(process.argv.slice(2));

if (!entity) die('Usage: npx new widget <name> [--ns <namespace>] [--no-store]');
if (entity !== "widget") die(`Пока поддерживается только: widget`);
if (!name) die("Нужно указать имя виджета");

validateNameOrNs(name, "name");
validateNameOrNs(ns, "ns");

const cwd = process.cwd();
const roots = resolveWebWidgetsRoot(cwd);
const widgetsRoot = (await exists(roots.b)) ? roots.b : roots.a;

if (!(await exists(widgetsRoot))) {
  await ensureDir(widgetsRoot);
}

const folder = widgetFolderName(name);
const nsFolder = ns ? ns : null;
const widgetDir = nsFolder
  ? path.join(widgetsRoot, nsFolder, folder)
  : path.join(widgetsRoot, folder);

if (await exists(widgetDir)) {
  die(`Виджет уже существует: ${widgetDir}`);
}

const widgetObjectName = folder;
const uiComponentName = "UI";
const containerName = "Container";
const containerHookName = "useContainer";
const nsLabel = nsFolder ? `${nsFolder} - ` : "";
const nameConst = `export const name = \`[Coffer - ${nsLabel}${folder} - Widget]\`\n`;

await ensureDir(widgetDir);
await ensureDir(path.join(widgetDir, "constants"));
await ensureDir(path.join(widgetDir, "container"));
await ensureDir(path.join(widgetDir, "lib", "types"));
await ensureDir(path.join(widgetDir, "ui"));
await ensureDir(path.join(widgetDir, "components"));

// root index.tsx
await writeFileSafe(
  path.join(widgetDir, "index.tsx"),
  `import { ${containerName} } from './container'\n` +
    (store ? `export * from './store'\n` : "") +
    `export * from './constants'\n\n` +
    `export const ${widgetObjectName} = {\n` +
    `  Widget: ${containerName},\n` +
    `}\n`
);

// ui/index.tsx
await writeFileSafe(
  path.join(widgetDir, "ui", "index.tsx"),
  `import React from 'react'\n` +
    `import type { FC } from 'react'\n\n` +
    `export const dtiDictionary = {\n` +
    `  mainDiv: 'UI',\n` +
    `}\n\n` +
    `export type UIPropertyType = {}\n\n` +
    `export const ${uiComponentName}: FC<UIPropertyType> = React.memo(() => (\n` +
    `  <div />\n` +
    `))\n`
);

// constants
await writeFileSafe(path.join(widgetDir, "constants", "name.ts"), nameConst);
await writeFileSafe(
  path.join(widgetDir, "constants", "data-testid.ts"),
  `import { name } from './name'\n\nexport const dti = \`\${name}-\`\n`
);
await writeFileSafe(
  path.join(widgetDir, "constants", "index.ts"),
  `export * from './name'\nexport * from './data-testid'\n`
);

// container
await writeFileSafe(
  path.join(widgetDir, "container", `${containerHookName}.ts`),
  `'use client'\n\nimport type { UIPropertyType } from '../ui'\n\nexport function ${containerHookName}(): UIPropertyType {\n  return {}\n}\n`
);
await writeFileSafe(
  path.join(widgetDir, "container", "index.tsx"),
  `import type { FC } from 'react'\n` +
    `import { name } from '../constants'\n` +
    `import { UI } from '../ui'\n` +
    `import { ${containerHookName} } from './${containerHookName}'\n\n` +
    `export const ${containerName}: FC = () => <UI {...${containerHookName}()} />\n\n` +
    `${containerName}.displayName = name\n`
);

// lib/types
await writeFileSafe(
  path.join(widgetDir, "lib", "types", "index.ts"),
  `export type PlaceholderType = {}\n`
);

// components
await writeFileSafe(path.join(widgetDir, "components", "index.ts"), `export {}\n`);

// store/structure only if needed
if (store) {
  await ensureDir(path.join(widgetDir, "store"));
  await ensureDir(path.join(widgetDir, "structure"));
  await writeFileSafe(path.join(widgetDir, "store", "index.ts"), `export {}\n`);
  await writeFileSafe(path.join(widgetDir, "structure", "index.ts"), `export const initialState = {}\n`);
}

process.stdout.write(`Created widget: ${nsFolder ? `${nsFolder}/` : ""}${folder}\n`);

