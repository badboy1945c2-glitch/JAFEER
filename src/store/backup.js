/**
 * backup.js - النسخ الاحتياطي: تصدير واستيراد حزمة الموقع (ZIP) مع كشف التعارض (المرحلة 13)
 */
import { StorageAdapter } from './adapter.js';
import { validateImportPackage, migrateData } from './schema.js';
import { collectModules, applyModules, resetModules } from './backup-sections.js';
import { packBundle, packPublish, unpackBundle, detectConflicts } from './bundle.js';

// ───────────── التصدير ─────────────
export async function createBackupPackage() {
  const data = StorageAdapter.getAllDataSync();
  const assets = await StorageAdapter.listMediaAssets();
  return {
    ...data,
    exportedAt: new Date().toISOString(),
    generator: 'almuhandis-alsaghir-v2',
    modules: collectModules(),
    assets
  };
}

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const stamp = () => new Date().toISOString().slice(0, 10);

export async function downloadBackupZip(filename = `almuhandis-backup-${stamp()}.zip`) {
  const pkg = await createBackupPackage();
  const bytes = packBundle(pkg);
  saveBlob(new Blob([bytes], { type: 'application/zip' }), filename);
  return { assets: pkg.assets.length, bytes: bytes.length };
}

// نسخة JSON قديمة (تبقى للتوافق)
export async function downloadBackupJson(filename = `almuhandis-backup-${stamp()}.json`) {
  const pkg = await createBackupPackage();
  saveBlob(new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json;charset=utf-8' }), filename);
}

// ───────────── الاستيراد ─────────────
// يقرأ ملفاً (ZIP أو JSON) ويرجع كائن الحزمة، أو يرمي خطأ بنص عربي
export async function parseBackupFile(file) {
  const buf = new Uint8Array(await file.arrayBuffer());
  if (buf[0] === 0x50 && buf[1] === 0x4b) return unpackBundle(buf).pkg; // توقيع ZIP: PK
  try { return JSON.parse(new TextDecoder().decode(buf)); } catch { throw new Error('الملف ليس حزمة ZIP ولا JSON سليماً.'); }
}

// يتحقق من الحزمة ويقارنها بالبيانات الحالية (بدون تغيير أي شيء)
export async function analyzeImport(pkg) {
  const validation = validateImportPackage(pkg);
  if (!validation.isValid) return { ok: false, errors: validation.errors };
  const migrated = migrateData(pkg, pkg.schemaVersion || 0);
  const current = await createBackupPackage();
  return { ok: true, pkg: migrated, conflicts: detectConflicts(current, migrated), errors: [] };
}

export async function importBackupPackage(input, { mode = 'merge' } = {}) {
  // تبقى الدالة تقبل نصاً (JSON خام) للتوافق مع النسخة القديمة والاختبارات
  let pkg = input;
  if (typeof input === 'string') {
    try { pkg = JSON.parse(input); }
    catch { return { success: false, message: 'الملف تالف: ليس بصيغة JSON صالحة.', errors: [] }; }
  }
  const validation = validateImportPackage(pkg);
  if (!validation.isValid) return { success: false, message: 'فشل التحقق من محتوى الحزمة.', errors: validation.errors };
  const migrated = migrateData(pkg, pkg.schemaVersion || 0);

  if (mode === 'replace') {
    StorageAdapter.clearAllData();
    resetModules();
    for (const a of await StorageAdapter.listMediaAssets()) await StorageAdapter.deleteMediaAsset(a.id);
    StorageAdapter.restoreAllData(migrated);
  } else {
    (migrated.formulas || []).forEach((f) => StorageAdapter.saveFormula(f));
    (migrated.categories || []).forEach((c) => StorageAdapter.saveCategory(c));
    (migrated.sources || []).forEach((s) => StorageAdapter.saveSource(s));
    (migrated.constants || []).forEach((c) => StorageAdapter.saveConstant(c));
    (migrated.tables || []).forEach((t) => StorageAdapter.saveTable(t));
    if (migrated.settings) StorageAdapter.updateSettings(migrated.settings);
    if (Array.isArray(migrated.homeSections) && migrated.homeSections.length) {
      const map = new Map(StorageAdapter.getHomeSections().map((s) => [s.id, s]));
      migrated.homeSections.forEach((s) => map.set(s.id, s));
      StorageAdapter.saveHomeSections([...map.values()].sort((a, b) => (a.order || 0) - (b.order || 0)));
    }
  }
  for (const asset of migrated.assets || []) await StorageAdapter.saveMediaAsset(asset);
  applyModules(migrated.modules, mode);

  return {
    success: true,
    message: mode === 'replace' ? 'تم استبدال بيانات الموقع بالكامل.' : 'تم دمج البيانات المستوردة.',
    errors: []
  };
}
// حزمة النشر: seed.json + uploads/ (للزوّار، بلا رمز المشرف)
export async function downloadPublishPackage(filename = `almuhandis-publish-${stamp()}.zip`) {
  const pkg = await createBackupPackage();
  const bytes = packPublish(pkg);
  saveBlob(new Blob([bytes], { type: 'application/zip' }), filename);
  return { assets: pkg.assets.length, bytes: bytes.length };
}
// ───────────── إعادة الضبط ─────────────
export async function resetSite() {
  StorageAdapter.clearAllData();
  resetModules();
  for (const a of await StorageAdapter.listMediaAssets()) await StorageAdapter.deleteMediaAsset(a.id);
  StorageAdapter.loadSeedData();
}