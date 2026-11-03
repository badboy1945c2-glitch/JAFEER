/**
 * compress.js - محرك ضغط الصور في المتصفح باستخدام Canvas وتحويلها إلى WebP
 * 
 * المزايا:
 * - التحقق من الحد الأقصى لحجم الملف (8MB)
 * - تصغير الأبعاد القصوى إلى 1600px بجودة 0.82 WebP
 * - توليد نسخة مصغرة Thumbnail بعرض 400px لمعاينات البطاقات السريعة
 * - دعم SVG مع الحفاظ على صيغتها المتجهة بدون ضغط نقطي
 */

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 ميجابايت

/**
 * معالجة وضغط ملف الصورة قبل التخزين
 * @param {File} file 
 * @param {Object} options
 * @returns {Promise<{
 *   dataUrl: string,
 *   thumbUrl: string,
 *   width: number,
 *   height: number,
 *   originalSize: number,
 *   compressedSize: number,
 *   mimeType: string
 * }>}
 */
export async function processImageFile(file, {
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82,
  thumbWidth = 400
} = {}) {
  if (!file) throw new Error('لم يتم تحديد أي ملف.');

  // 1. فحص الحد الأقصى للحجم
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`حجم الصورة (${(file.size / (1024 * 1024)).toFixed(1)} ميجابايت) يتجاوز الحد الأقصى المسموح وهو 8 ميجابايت.`);
  }

  // 2. معالجة ملفات SVG المتجهة
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        resolve({
          dataUrl,
          thumbUrl: dataUrl,
          width: 800,
          height: 600,
          originalSize: file.size,
          compressedSize: file.size,
          mimeType: 'image/svg+xml'
        });
      };
      reader.onerror = () => reject(new Error('تعذر قراءة ملف SVG.'));
      reader.readAsDataURL(file);
    });
  }

  // 3. معالجة الصور النقطية (JPG, PNG, WebP) عبر Canvas
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // حساب الأبعاد بعد التصغير مع الحفاظ على نسبة العرض للارتفاع
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // رسم الصورة الرئيسية المضغوطة
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // تجربة تحويل WebP (أو JPEG كبديل في حال عدم دعمه)
      let mimeType = 'image/webp';
      let dataUrl = canvas.toDataURL(mimeType, quality);
      if (!dataUrl.startsWith('data:image/webp')) {
        mimeType = 'image/jpeg';
        dataUrl = canvas.toDataURL(mimeType, quality);
      }

      // حساب أبعاد وحجم النسخة المصغرة (Thumbnail)
      let thumbHeight = Math.round((height * thumbWidth) / width);
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = thumbWidth;
      thumbCanvas.height = thumbHeight;
      const thumbCtx = thumbCanvas.getContext('2d');
      thumbCtx.drawImage(img, 0, 0, thumbWidth, thumbHeight);
      const thumbUrl = thumbCanvas.toDataURL(mimeType, 0.75);

      // تقدير الحجم المضغوط من طول Base64
      const compressedSize = Math.round(dataUrl.length * 0.75);

      resolve({
        dataUrl,
        thumbUrl,
        width,
        height,
        originalSize: file.size,
        compressedSize,
        mimeType
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('تعذر تحميل الصورة. تأكد من أن الملف سليم وبصيغة مدعومة (JPG, PNG, WebP, SVG).'));
    };

    img.src = objectUrl;
  });
}

