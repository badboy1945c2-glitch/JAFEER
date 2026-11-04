/**
 * main.js - نقطة البداية والتوجيه لموقع «المهندس الصغير»
 */

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/animations.css';
import './styles/pages.css';
import './styles/print.css';
import './styles/admin.css';
import './modules/soil-mechanics/backup-section.js';

import { StorageAdapter } from './store/adapter.js';
import { Router } from './router.js';
import { createHeader } from './components/header.js';
import { createFooter } from './components/footer.js';

import { renderHomePage } from './pages/home.js';
import { renderLibraryPage } from './pages/library.js';
import { renderTablesPage } from './pages/tables.js';
import { renderSourcesPage } from './pages/sources.js';
import { renderAboutPage } from './pages/about.js';
import { renderNotFoundPage } from './pages/not-found.js';
import { applySiteSettings, watchAssetImages } from './site-settings.js';
import seedData from './data/seed.json';
import { applyModules } from './store/backup-sections.js';
import { renderStructuresPage } from './modules/structural-analysis/ui/structures-page.js';

const app = document.querySelector('#app');

// زوّار الموقع المنشور: يحدّثون محتواهم عند صدور نسخة جديدة. متصفح المشرف (له رمز PIN) لا يُمسّ.
function syncPublishedSeed() {
  if (!seedData.seedVersion) return;
  if (StorageAdapter.getSettings().adminPinHash) return;
  const KEY = 'almuhandis_published_seed';
  if (localStorage.getItem(KEY) === String(seedData.seedVersion)) return;
  StorageAdapter.restoreAllData(seedData);
  applyModules(seedData.modules, 'replace');
  localStorage.setItem(KEY, String(seedData.seedVersion));
}

async function bootstrap() {
  if (!app) return;

  // 1. تهيئة مخزن البيانات
  await StorageAdapter.initStore();
  applySiteSettings();
  watchAssetImages();
  syncPublishedSeed();

  // 2. بناء الهيكل الثابت للتطبيق
  app.innerHTML = '';

  let headerEl = createHeader();
  const mainContentEl = document.createElement('main');
  mainContentEl.id = 'main-content';
  mainContentEl.style.minHeight = 'calc(100vh - var(--header-height) - 300px)';
  let footerEl = createFooter();

  app.appendChild(headerEl);
  app.appendChild(mainContentEl);
  app.appendChild(footerEl);

  window.addEventListener('site-settings-changed', () => {
    applySiteSettings();
    const newHeader = createHeader();
    const newFooter = createFooter();
    headerEl.replaceWith(newHeader);
    footerEl.replaceWith(newFooter);
    headerEl = newHeader;
    footerEl = newFooter;
  });

  // 3. تهيئة جهاز التوجيه (Router)
  new Router({
    rootEl: mainContentEl,
    routes: {
      '/': renderHomePage,
      '/library': renderLibraryPage,
      '/tables': renderTablesPage,
      '/sources': renderSourcesPage,
      '/about': renderAboutPage,
      '/structures': async (ctx) => {
        return renderStructuresPage(ctx);
      }
    },
    notFound: renderNotFoundPage
  });
}

bootstrap();