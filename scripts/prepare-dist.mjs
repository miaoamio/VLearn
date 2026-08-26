import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const htmlEntry = join(dist, 'html', 'main', 'index.html');

await cp(htmlEntry, join(dist, 'index.html'));
await rm(join(dist, 'html'), { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, 'public', 'app.html'), join(dist, 'app.html'));
await cp(join(root, 'public', 'img'), join(dist, 'img'), { recursive: true });
await cp(join(root, 'public', 'fonts'), join(dist, 'fonts'), { recursive: true });
await cp(join(root, 'public', 'data'), join(dist, 'data'), { recursive: true });

for (const name of ['.env', '.env.development', '.env.example', '.env.local', '.env.production']) {
  await rm(join(dist, name), { force: true });
}
