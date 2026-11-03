/**
 * bundle.js - حزمة الموقع بصيغة ZIP (المرحلة 13)، دوال نقية بلا DOM وبلا تخزين.
 * شكل الملف:
 *   manifest.json     بيانات تعريفية (الإصدار، التاريخ، أعداد العناصر)
 *   data.json         كل البيانات ما عدا الصور (معادلات، تصنيفات، ... وأقسام الوحدات modules)
 *   media/index.json  بيانات الصور بدون محتواها (الاسم، alt، الوسوم، أسماء الملفات)
 *   media/<id>.<ext>  ملفات الصور الفعلية (وليس نصوص base64 داخل JSON، فالحجم أصغر)
 */
import { zipSync, unzipSync, strToU8, strFromU8 } from 'fflate';

export const BUNDLE_FORMAT = 'almuhandis-bundle';
export const BUNDLE_VERSION = 1;
export const ID_COLLECTIONS = ['formulas', 'categories', 'sources', 'constants', 'tables'];

const EXT = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/svg+xml': 'svg' };
const safeName = (id) => String(id).replace(/[^\w.-]/g, '_');

// ───────────── الصور: data URL ↔ بايتات ─────────────
export function dataUrlToBytes(dataUrl) {
  const m = /^data:([^;,]+)((?:;[^;,]+)*),(.*)$/s.exec(dataUrl || '');
  if (!m) throw new Error('رابط صورة غير صالح');
  const mime = m[1];
  if (m[2].includes(';base64')) {
    const bin = atob(m[3]);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { mime, bytes };
  }
  return { mime, bytes: strToU8(decodeURIComponent(m[3])) };
}

export function bytesToDataUrl(mime, bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return `data:${mime};base64,${btoa(bin)}`;
}

// ───────────── تعبئة وفك الحزمة ─────────────
// pkg: { schemaVersion, settings, categories, formulas, ..., assets: [...], modules?: {...} }
export function packBundle(pkg) {
  const files = {};
  const { assets = [], ...data } = pkg;
  const index = [];
  for (const a of assets) {
    const { dataUrl, thumbUrl, ...meta } = a;
    const base = safeName(a.id);
    const main = dataUrlToBytes(dataUrl);
    const ext = EXT[main.mime] || 'bin';
    const entry = { ...meta, mimeType: a.mimeType || main.mime, file: `media/${base}.${ext}` };
    files[entry.file] = [main.bytes, { level: 0 }];            // الصور مضغوطة أصلاً (WebP)
    if (thumbUrl && thumbUrl !== dataUrl) {
      const th = dataUrlToBytes(thumbUrl);
      entry.thumbFile = `media/${base}.thumb.${EXT[th.mime] || 'bin'}`;
      files[entry.thumbFile] = [th.bytes, { level: 0 }];
    }
    index.push(entry);
  }
  const counts = Object.fromEntries(ID_COLLECTIONS.map((k) => [k, (data[k] || []).length]));
  counts.assets = assets.length;
  files['manifest.json'] = strToU8(JSON.stringify({
    format: BUNDLE_FORMAT, version: BUNDLE_VERSION, schemaVersion: data.schemaVersion,
    exportedAt: data.exportedAt || new Date().toISOString(), generator: data.generator || '', counts
  }, null, 2));
  files['data.json'] = strToU8(JSON.stringify(data));
  files['media/index.json'] = strToU8(JSON.stringify(index));
  return zipSync(files, { level: 6 });
}

// يرجع { pkg, manifest } أو يرمي خطأ بنص عربي
export function unpackBundle(bytes) {
  let files;
  try { files = unzipSync(bytes); } catch { throw new Error('الملف ليس حزمة ZIP صالحة.'); }
  if (!files['manifest.json'] || !files['data.json']) throw new Error('هذه ليست حزمة موقع (ينقصها manifest.json أو data.json).');
  let manifest, data, index;
  try {
    manifest = JSON.parse(strFromU8(files['manifest.json']));
    data = JSON.parse(strFromU8(files['data.json']));
    index = files['media/index.json'] ? JSON.parse(strFromU8(files['media/index.json'])) : [];
  } catch { throw new Error('ملفات الحزمة تالفة (JSON غير صالح).'); }
  if (manifest.format !== BUNDLE_FORMAT) throw new Error('صيغة الحزمة غير معروفة.');
  if (manifest.version > BUNDLE_VERSION) throw new Error('الحزمة من إصدار أحدث من هذا الموقع.');
  const assets = index.map((e) => {
    const { file, thumbFile, ...meta } = e;
    if (!files[file]) throw new Error(`ملف الصورة مفقود داخل الحزمة: ${file}`);
    const dataUrl = bytesToDataUrl(meta.mimeType, files[file]);
    const thumbUrl = thumbFile && files[thumbFile] ? bytesToDataUrl(thumbFile.endsWith('.svg') ? 'image/svg+xml' : meta.mimeType, files[thumbFile]) : dataUrl;
    return { ...meta, dataUrl, thumbUrl };
  });
  return { pkg: { ...data, assets }, manifest };
}

// ───────────── كشف التعارض عند الاستيراد ─────────────
const IGNORED = new Set(['updatedAt', 'createdAt']);
export function stable(v) {
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  if (v && typeof v === 'object') {
    return `{${Object.keys(v).filter((k) => !IGNORED.has(k)).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;
  }
  return JSON.stringify(v);
}

function diffById(current = [], incoming = []) {
  const cur = new Map(current.map((x) => [x.id, stable(x)]));
  const out = { added: [], same: [], changed: [] };
  for (const x of incoming) {
    if (!cur.has(x.id)) out.added.push(x.id);
    else if (cur.get(x.id) === stable(x)) out.same.push(x.id);
    else out.changed.push(x.id);
  }
  return out;
}

// current / incoming: نفس شكل pkg. يرجع ملخصاً تعرضه الواجهة قبل سؤال المستخدم (دمج أم استبدال)
export function detectConflicts(current, incoming) {
  const collections = {};
  for (const k of [...ID_COLLECTIONS, 'assets']) collections[k] = diffById(current[k], incoming[k]);
  const settingsChanged = stable(current.settings || {}) !== stable(incoming.settings || {});
  const homeChanged = stable(current.homeSections || []) !== stable(incoming.homeSections || []);
  const modules = {};
  for (const id of Object.keys(incoming.modules || {})) {
    const cur = (current.modules || {})[id];
    modules[id] = cur === undefined ? 'added' : stable(cur) === stable(incoming.modules[id]) ? 'same' : 'changed';
  }
  const hasConflicts = settingsChanged || homeChanged
    || Object.values(collections).some((c) => c.changed.length > 0)
    || Object.values(modules).includes('changed');
  return { collections, settingsChanged, homeChanged, modules, hasConflicts };
}


// ───────────── حزمة النشر (المرحلة 15) ─────────────
// seed.json (يذهب إلى src/data/seed.json) + uploads/ (يذهب إلى public/uploads) للزوّار.
// لا تتضمن رمز المشرف (adminPinHash) ولا الصور بصيغة base64.
export function packPublish(pkg) {
  const { assets = [], settings = {}, exportedAt, generator, ...seed } = pkg;
  const { adminPinHash, ...publicSettings } = settings;
  const files = {};
  const index = [];
  for (const a of assets) {
    const { dataUrl, thumbUrl, ...meta } = a;
    const base = safeName(a.id);
    const main = dataUrlToBytes(dataUrl);
    const entry = { ...meta, mimeType: a.mimeType || main.mime, file: `${base}.${EXT[main.mime] || 'bin'}` };
    files[`uploads/${entry.file}`] = [main.bytes, { level: 0 }];
    if (thumbUrl && thumbUrl !== dataUrl) {
      const th = dataUrlToBytes(thumbUrl);
      entry.thumbFile = `${base}.thumb.${EXT[th.mime] || 'bin'}`;
      files[`uploads/${entry.thumbFile}`] = [th.bytes, { level: 0 }];
    }
    index.push(entry);
  }
  files['uploads/index.json'] = strToU8(JSON.stringify(index));
  files['seed.json'] = strToU8(JSON.stringify({ ...seed, settings: publicSettings, seedVersion: Date.now() }, null, 2));
  return zipSync(files, { level: 6 });
}