// اختبار حزمة النشر (المرحلة 15): seed.json + uploads بدون رمز المشرف
import { describe, it, expect } from 'vitest';
import { unzipSync, strFromU8 } from 'fflate';
import { packPublish } from '../src/store/bundle.js';

const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

describe('حزمة النشر', () => {
  it('تحوي seed.json وuploads بلا adminPinHash وبلا صور base64 داخل seed', () => {
    const files = unzipSync(packPublish({
      schemaVersion: 1, exportedAt: 'x', generator: 'g', settings: { siteName: 'مهندسي', adminPinHash: 'SECRET', logoAssetId: 'asset-1' },
      categories: [], formulas: [], constants: [], tables: [], sources: [], homeSections: [],
      modules: { 'soil-mechanics': { translations: {} } },
      assets: [{ id: 'asset-1', name: 'شعار', alt: 'شعار', dataUrl: PNG, thumbUrl: PNG, mimeType: 'image/png', width: 1, height: 1 }]
    }));
    const seedText = strFromU8(files['seed.json']);
    const seed = JSON.parse(seedText);
    expect(seedText.includes('SECRET')).toBe(false);
    expect(seed.settings.siteName).toBe('مهندسي'); expect(seed.settings.logoAssetId).toBe('asset-1');
    expect(seed.assets).toBe(undefined); expect(seedText.includes('base64')).toBe(false);
    expect(typeof seed.seedVersion).toBe('number'); expect(seed.modules['soil-mechanics'] !== undefined).toBe(true);
    const index = JSON.parse(strFromU8(files['uploads/index.json']));
    expect(index[0].file).toBe('asset-1.png'); expect(files['uploads/asset-1.png'].length).toBe(70);
  });
});