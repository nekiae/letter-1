/**
 * sync-gallery.mjs
 * Reads photo/ → copies to public/assets/gallery/ → writes public/data/gallery.json
 * Run via: node scripts/sync-gallery.mjs
 */

import { readdir, copyFile, mkdir, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PHOTO_DIR        = path.join(ROOT, 'photo');
const GALLERY_ASSET_DIR = path.join(ROOT, 'public', 'assets', 'gallery');
const GALLERY_JSON     = path.join(ROOT, 'public', 'data', 'gallery.json');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm', '.m4v']);

const PLACEHOLDER_COLORS = [
  '#B8C5D6', '#C4B5A5', '#A8B4C4', '#D4C4A0',
  '#C8B8C8', '#B8A8A0', '#C4A898', '#B5C4B5',
  '#D4B8A0', '#A0B4C8', '#C8C4A8', '#B4A8C8',
];

// ── helpers ──────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── image dimension detection (no extra deps) ────────────────────────────────

async function getImageDimensions(filePath, ext) {
  try {
    // Read only first 64 KB — enough for any header
    const fd = await (await import('fs/promises')).open(filePath, 'r');
    const buf = Buffer.alloc(65536);
    const { bytesRead } = await fd.read(buf, 0, 65536, 0);
    await fd.close();
    const data = buf.subarray(0, bytesRead);

    if (ext === '.png') {
      // PNG IHDR: signature (8) + chunk-length (4) + "IHDR" (4) + width (4) + height (4)
      if (data.length < 24) return null;
      return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
    }

    if (ext === '.jpg' || ext === '.jpeg') {
      // Scan for SOF0/SOF1/SOF2 markers (FF C0 / FF C1 / FF C2)
      let i = 2;
      while (i < data.length - 9) {
        if (data[i] !== 0xff) { i++; continue; }
        const marker = data[i + 1];
        if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
          // SOF: 2 marker + 2 length + 1 precision + 2 height + 2 width
          return {
            height: data.readUInt16BE(i + 5),
            width:  data.readUInt16BE(i + 7),
          };
        }
        if (marker === 0xd9 || marker === 0xda) break; // EOI / SOS
        if (i + 3 >= data.length) break;
        const segLen = data.readUInt16BE(i + 2);
        i += 2 + segLen;
      }
    }

    if (ext === '.webp') {
      // RIFF....WEBP VP8 (lossy) or VP8L (lossless) or VP8X (extended)
      if (data.length < 30) return null;
      const format = data.toString('ascii', 12, 16);
      if (format === 'VP8 ' && data.length >= 30) {
        const w = (data.readUInt16LE(26) & 0x3fff) + 1;
        const h = (data.readUInt16LE(28) & 0x3fff) + 1;
        return { width: w, height: h };
      }
      if (format === 'VP8L' && data.length >= 25) {
        const bits = data.readUInt32LE(21);
        const w = (bits & 0x3fff) + 1;
        const h = ((bits >> 14) & 0x3fff) + 1;
        return { width: w, height: h };
      }
      if (format === 'VP8X' && data.length >= 34) {
        const w = (data.readUIntLE(24, 3)) + 1;
        const h = (data.readUIntLE(27, 3)) + 1;
        return { width: w, height: h };
      }
    }

    return null;
  } catch {
    return null;
  }
}

function aspectFromDimensions(dims) {
  if (!dims) return randomItem(['square', 'portrait', 'landscape']);
  const ratio = dims.width / dims.height;
  if (ratio > 1.25) return 'landscape';
  if (ratio < 0.80) return 'portrait';
  return 'square';
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  await mkdir(GALLERY_ASSET_DIR, { recursive: true });

  // Read photo/ directory
  let files;
  try {
    files = await readdir(PHOTO_DIR);
  } catch {
    console.error(`Папка photo/ не найдена: ${PHOTO_DIR}`);
    process.exit(1);
  }

  const mediaFiles = files.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return IMAGE_EXTS.has(ext) || VIDEO_EXTS.has(ext);
  });

  if (mediaFiles.length === 0) {
    console.log('photo/ пуста — gallery.json не изменён.');
    return;
  }

  // Load existing gallery.json to preserve manual captions / dates / rotation
  let preserved = {}; // filename → { caption, date, rotation, placeholderColor }
  if (existsSync(GALLERY_JSON)) {
    try {
      const existing = JSON.parse(await readFile(GALLERY_JSON, 'utf8'));
      for (const entry of (existing.photos || [])) {
        if (entry.src) {
          const fn = path.basename(entry.src);
          preserved[fn] = {
            caption:          entry.caption          ?? '',
            date:             entry.date             ?? '',
            rotation:         entry.rotation         ?? null,
            placeholderColor: entry.placeholderColor ?? null,
          };
        }
      }
    } catch { /* ignore parse errors */ }
  }

  // Shuffle for random gallery order
  const shuffled = shuffle(mediaFiles);

  const photos = [];

  for (let i = 0; i < shuffled.length; i++) {
    const filename = shuffled[i];
    const ext      = path.extname(filename).toLowerCase();
    const isVideo  = VIDEO_EXTS.has(ext);
    const id       = `${isVideo ? 'video' : 'photo'}-${String(i + 1).padStart(3, '0')}`;

    // Copy to public/assets/gallery/
    await copyFile(
      path.join(PHOTO_DIR, filename),
      path.join(GALLERY_ASSET_DIR, filename),
    );

    const prev   = preserved[filename] ?? {};
    const dims   = isVideo ? null : await getImageDimensions(path.join(PHOTO_DIR, filename), ext);
    const aspect = isVideo ? 'landscape' : aspectFromDimensions(dims);

    const entry = {
      id,
      type:             isVideo ? 'video' : 'photo',
      src:              `/assets/gallery/${filename}`,
      caption:          prev.caption          ?? '',
      date:             prev.date             ?? '',
      placeholderColor: prev.placeholderColor ?? randomItem(PLACEHOLDER_COLORS),
      rotation:         prev.rotation         ?? randomFloat(-3, 3),
      aspect,
    };

    if (isVideo) entry.poster = '';

    photos.push(entry);
  }

  const output = {
    _comment: 'Авто-сгенерировано из папки photo/. caption и date можно задать вручную — они сохранятся при следующей синхронизации.',
    photos,
  };

  await writeFile(GALLERY_JSON, JSON.stringify(output, null, 2) + '\n');
  console.log(`sync-gallery: ${photos.length} файл(ов) → public/data/gallery.json`);
}

main().catch(err => {
  console.error('sync-gallery ошибка:', err);
  process.exit(1);
});
