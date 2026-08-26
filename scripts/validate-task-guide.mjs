import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const appPath = path.join(projectRoot, 'public', 'app.html');
const baconPath = path.join(projectRoot, 'public', 'img', 'bacon.webp');
const app = readFileSync(appPath, 'utf8');

assert.match(
  app,
  /\{\s*id:\s*'bacon',\s*name:\s*'培根',\s*img:\s*'img\/bacon\.webp'\s*\}/,
  '培根必须以本地图片注册到 INGREDIENTS',
);
assert.ok(statSync(baconPath).size > 0, '培根图片必须存在且非空');

assert.match(app, /id="taskGuide"/, '页面必须包含任务引导容器');
assert.match(
  app,
  /guide\.dataset\.guideStep\s*=/,
  '任务引导必须暴露当前派生状态',
);
assert.match(
  app,
  /function\s+refreshGuideAndActions\s*\(/,
  '必须集中刷新引导与操作状态',
);
assert.match(
  app,
  /function\s+renderLeftPanel\s*\([^)]*\)\s*\{[\s\S]*?refreshGuideAndActions\(\)/,
  '食材局部刷新时也必须同步更新引导',
);

for (const action of [
  'commit',
  'revert',
  'branch',
  'merge',
  'sync',
  'pr',
  'publish',
]) {
  assert.match(
    app,
    new RegExp(`data-action=["']${action}["']`),
    `${action} 操作必须可被引导识别`,
  );
}

const coreStages = [
  'clone',
  'add',
  'commit',
  'sync',
  'branch',
  'branch-edit',
  'pr',
  'pr-review',
  'publish',
  'complete',
];
const guideCopyStart = app.indexOf('const TASK_GUIDE_COPY = [');
const guideCopyEnd = app.indexOf('function taskGuideCopy', guideCopyStart);
assert.ok(
  guideCopyStart >= 0 && guideCopyEnd > guideCopyStart,
  '必须声明任务引导文案',
);
const guideCopy = app.slice(guideCopyStart, guideCopyEnd);
let previousIndex = -1;
for (const stage of coreStages) {
  const index = guideCopy.indexOf(`id: '${stage}'`);
  assert.ok(index > previousIndex, `任务状态 ${stage} 必须存在并保持教学顺序`);
  previousIndex = index;
}

console.log('task guide and bacon contract: ok');
