// اختبارات حزمة الموقع (المرحلة 13): تعبئة وفك ZIP وكشف التعارض
import { describe, it, expect } from 'vitest';
import { packBundle, unpackBundle, detectConflicts, dataUrlToBytes, bytesToDataUrl } from '../src/store/bundle.js';

const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const SVG = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg"><rect width="4" height="4"/></svg>');
const pkg = () => ({
  schemaVersion: 1, settings: { siteName: 'مهندسي' }, categories: [{ id: 'c1', title: 'تربة' }],
  formulas: [{ id: 'f1', title: 'مثال', inputs: [], outputs: [] }], constants: [], tables: [], sources: [], homeSections: [{ id: 'h1', order: 1 }],
  modules: { 'soil-mechanics': { translations: { Sand: 'رمل' }, notes: [] } },
  assets: [
    { id: 'asset-1', name: 'صورة', alt: 'وصف', tags: ['a'], dataUrl: PNG, thumbUrl: PNG, mimeType: 'image/png', width: 1, height: 1 },
    { id: 'asset 2/x', name: 'شعار', alt: 'شعار', tags: [], dataUrl: SVG, thumbUrl: SVG, mimeType: 'image/svg+xml', width: 4, height: 4 }
  ]
});

describe('حزمة الموقع', () => {
  it('data URL يذهب ويعود بنفس البايتات', () => {
    const { mime, bytes } = dataUrlToBytes(PNG);
    expect(mime).toBe('image/png'); expect(bytes.length).toBe(70);
    expect(bytesToDataUrl(mime, bytes)).toBe(PNG);
  });
  it('تصدير ثم استيراد يعيد كل شيء كما كان', () => {
    const original = pkg();
    const { pkg: back, manifest } = unpackBundle(packBundle(original));
    expect(manifest.counts.assets).toBe(2); expect(manifest.counts.formulas).toBe(1);
    expect(JSON.stringify(back.modules)).toBe(JSON.stringify(original.modules));
    expect(JSON.stringify(back.formulas)).toBe(JSON.stringify(original.formulas));
    expect(back.assets.length).toBe(2);
    expect(back.assets[0].dataUrl).toBe(PNG); expect(back.assets[0].alt).toBe('وصف');
    expect(atob(back.assets[1].dataUrl.split(',')[1]).includes('<rect')).toBe(true);
  });
  it('ملف غير صالح يعطي رسالة عربية', () => {
    let msg = '';
    try { unpackBundle(new Uint8Array([1, 2, 3])); } catch (e) { msg = e.message; }
    expect(msg).toContain('ZIP');
  });
  it('كشف التعارض: إضافة وتطابق واختلاف', () => {
    const cur = pkg(), inc = pkg();
    inc.formulas.push({ id: 'f2', title: 'جديدة', inputs: [], outputs: [] });
    inc.categories[0].title = 'تربة معدّلة';
    inc.modules['soil-mechanics'].translations.Sand = 'رمل خشن';
    const r = detectConflicts(cur, inc);
    expect(r.collections.formulas.added.join()).toBe('f2'); expect(r.collections.formulas.same.join()).toBe('f1');
    expect(r.collections.categories.changed.join()).toBe('c1');
    expect(r.modules['soil-mechanics']).toBe('changed'); expect(r.hasConflicts).toBe(true);
  });
  it('حزمة مطابقة لا تعارض فيها (وتجاهل updatedAt)', () => {
    const cur = pkg(), inc = pkg();
    inc.formulas[0].updatedAt = '2026-11-01'; cur.formulas[0].updatedAt = '2026-10-01';
    expect(detectConflicts(cur, inc).hasConflicts).toBe(false);
  });
});