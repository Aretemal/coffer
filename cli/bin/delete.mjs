#!/usr/bin/env node
import path from "node:path";

import {
  die,
  exists,
  parseArgs,
  removeDirSafe,
  resolveWebWidgetsRoot,
  validateNameOrNs,
  widgetFolderName,
} from "./_fsd.mjs";

const { entity, name, ns } = parseArgs(process.argv.slice(2));

if (!entity) die('Usage: npx delete widget <name> [--ns <namespace>]');
if (entity !== "widget") die(`Пока поддерживается только: widget`);
if (!name) die("Нужно указать имя виджета");

validateNameOrNs(name, "name");
validateNameOrNs(ns, "ns");

const cwd = process.cwd();
const roots = resolveWebWidgetsRoot(cwd);
const widgetsRoot = (await exists(roots.b)) ? roots.b : roots.a;

if (!(await exists(widgetsRoot))) {
  die(
    `Не найден widgets root: ${widgetsRoot}\nЗапусти команду из корня репо или из папки web/`
  );
}

const folder = widgetFolderName(name);
const nsFolder = ns ? ns : null;
const widgetDir = nsFolder
  ? path.join(widgetsRoot, nsFolder, folder)
  : path.join(widgetsRoot, folder);

await removeDirSafe(widgetDir);

process.stdout.write(`Deleted widget: ${nsFolder ? `${nsFolder}/` : ""}${folder}\n`);

