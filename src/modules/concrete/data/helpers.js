/** helpers.js - اختصارات لتعريف المدخلات والمخرجات */
export const tx = String.raw;
export const num = (key, name, tex, unit, def, extra = {}) => ({ key, name, tex, unit, def, ...extra });
export const sel = (key, name, tex, unit, def, options) => ({ key, name, tex, unit, def, options });
export const out = (key, name, tex, unit = '', dec = 2, extra = {}) => ({ key, name, tex, unit, dec, ...extra });