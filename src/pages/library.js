/**
 * library.js - مكتبة المعادلات الهندسية مع البحث الفوري الذكي والفلترة
 */

import { StorageAdapter } from '../store/adapter.js';
import { matchArabicSearch } from '../engine/arabic.js';
import { createDimensionLineSvg } from '../motion/draw-lines.js';
import { coverHtml, hydrateAssetImages } from '../media/asset-image.js';
export function renderLibraryPage({ query = {}, navigate }) {
  const container = document.createElement('div');
  container.className = 'container page-container';
  container.style.padding = '40px 20px 100px';

  const formulas = StorageAdapter.getFormulas();
  const categories = StorageAdapter.getCategories();

  let activeCategory = query.category || 'all';
  let searchTerm = query.q || '';

  function renderList() {
    const listEl = container.querySelector('#formulas-list');
    const countEl = container.querySelector('#formulas-count');
    if (!listEl) return;

    // تصفية المعادلات بالبحث الذكي وبالتصنيف
    const filtered = formulas.filter(f => {
      const matchesCategory = activeCategory === 'all' || f.categoryId === activeCategory;
      const searchableText = `${f.title} ${f.description || ''} ${(f.tags || []).join(' ')}`;
      const matchesSearch = matchArabicSearch(searchableText, searchTerm);
      return matchesCategory && matchesSearch;
    });

    if (countEl) countEl.textContent = `${filtered.length} معادلة`;

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="8" y="8" width="32" height="32" rx="4" stroke-dasharray="3 3"/>
              <line x1="8" y1="24" x2="40" y2="24" stroke-dasharray="2 2"/>
              <line x1="24" y1="8" x2="24" y2="40" stroke-dasharray="2 2"/>
              <polygon points="18,32 30,32 18,20" fill="none" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <h4 class="empty-state-title">لا توجد معادلات مطابقة</h4>
          <p class="empty-state-desc">لم نجد أي معادلة تطابق معايير البحث الحالية. يمكنك مسح البحث أو اختيار تصنيف آخر.</p>
          <button class="btn btn-secondary btn-sm" id="btn-reset-filters">إعادة ضبط الفلاتر</button>
        </div>
      `;
      listEl.querySelector('#btn-reset-filters')?.addEventListener('click', () => {
        activeCategory = 'all';
        searchTerm = '';
        container.querySelector('#search-input').value = '';
        container.querySelectorAll('.cat-pill').forEach(p => p.classList.toggle('btn-primary', p.dataset.cat === 'all'));
        renderList();
      });
      return;
    }

    listEl.innerHTML = filtered.map(f => {
      const cat = categories.find(c => c.id === f.categoryId);
      return `
        <div class="card card-interactive" onclick="window.location.hash = '#/calc/${f.id}'">
          ${coverHtml(f.coverAssetId)}
          <div class="card-header">
            <span class="badge badge-category">${cat ? cat.title : 'عام'}</span>
            ${f.isSample ? '<span class="badge badge-sample">تجريبي</span>' : ''}
          </div>
          <h3 class="card-title">${f.title}</h3>
          <p class="card-desc">${f.description || 'معادلة حسابية موثقة.'}</p>
          <div class="card-footer">
            <span style="font-family: var(--font-mono); color: var(--violet-600); font-weight: 500;">
              ${f.outputs && f.outputs[0] ? `${f.outputs[0].key} = ${f.outputs[0].expression}` : ''}
            </span>
            <span style="color: var(--ink-soft); font-size: 0.82rem;">${(f.inputs || []).length} مدخلات</span>
          </div>
        </div>
      `;
       }).join('');

    hydrateAssetImages(listEl);
  }

  container.innerHTML = `
    <!-- ترويسة الصفحة -->
    <div style="border-bottom: 1px solid var(--line); padding-bottom: 24px; margin-bottom: 30px;">
      <div class="badge badge-category" style="margin-bottom: 10px;">المكتبة الهندسية</div>
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px;">
        <div>
          <h1 style="font-size: 2rem; margin-bottom: 6px;">مكتبة المعادلات والحسابات</h1>
          <p style="margin: 0; font-size: 0.95rem; color: var(--ink-soft);">
            استعرض المعادلات المتوفرة حسب التخصص أو ابحث بالاسم والرمز والوصف.
          </p>
        </div>
        <div id="formulas-count" style="font-family: var(--font-mono); font-size: 0.95rem; color: var(--violet-700); font-weight: 600;">
          ${formulas.length} معادلة
        </div>
      </div>
    </div>

    <!-- شريط البحث السريع والفلترة -->
    <div style="margin-bottom: 30px; display: flex; flex-direction: column; gap: 16px;">
      <div style="max-width: 600px;">
        <input 
          type="text" 
          id="search-input" 
          class="form-input" 
          placeholder="ابحث بالعربية (مثال: عزم، انحناء، هطول، إجهاد)..." 
          value="${searchTerm}" 
          style="padding: 10px 16px;"
        />
      </div>

      <!-- فلاتر التصنيفات -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <span style="font-size: 0.85rem; color: var(--ink-soft); margin-left: 6px;">التصنيف:</span>
        <button class="btn btn-sm cat-pill ${activeCategory === 'all' ? 'btn-primary' : 'btn-secondary'}" data-cat="all">
          الكل (${formulas.length})
        </button>
        ${categories.map(cat => {
          const count = formulas.filter(f => f.categoryId === cat.id).length;
          const isActive = activeCategory === cat.id;
          return `
            <button class="btn btn-sm cat-pill ${isActive ? 'btn-primary' : 'btn-secondary'}" data-cat="${cat.id}">
              ${cat.title} (${count})
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <!-- شبكة المعادلات -->
    <div id="formulas-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;"></div>
  `;

  // ربط أحداث البحث والفلترة
  const searchInput = container.querySelector('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      renderList();
    });
  }

  container.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-cat');
      container.querySelectorAll('.cat-pill').forEach(p => {
        const isSelected = p === btn;
        p.classList.toggle('btn-primary', isSelected);
        p.classList.toggle('btn-secondary', !isSelected);
      });
      renderList();
    });
  });

  renderList();
  return container;
}

