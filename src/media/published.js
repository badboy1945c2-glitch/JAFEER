/**
 * published.js - صور الموقع المنشور: يحمّلها الزائر من public/uploads بدل IndexedDB
 * تُرجع الصورة بنفس شكل صور IndexedDB (dataUrl وthumbUrl) فتعمل كل أجزاء الموقع بلا تعديل.
 */
const cache = new Map();
let indexPromise = null;
const base = () => (import.meta.env && import.meta.env.BASE_URL) || './';

function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch(`${base()}uploads/index.json`)
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []);
  }
  return indexPromise;
}

async function fetchAsDataUrl(path) {
  const blob = await (await fetch(path)).blob();
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

export async function getPublishedAsset(id) {
  if (cache.has(id)) return cache.get(id);
  const entry = (await loadIndex()).find((a) => a.id === id);
  if (!entry) return null;
  try {
    const { file, thumbFile, ...meta } = entry;
    const dataUrl = await fetchAsDataUrl(`${base()}uploads/${file}`);
    const thumbUrl = thumbFile ? await fetchAsDataUrl(`${base()}uploads/${thumbFile}`) : dataUrl;
    const asset = { ...meta, dataUrl, thumbUrl };
    cache.set(id, asset);
    return asset;
  } catch {
    return null;
  }
}