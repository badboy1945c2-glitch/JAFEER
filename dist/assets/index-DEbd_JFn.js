const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./calculator-D1hqwk3L.js","./katex-Dc8nsIP1.js","./evaluate-B0-ofPa3.js","./mathjs-DR_SeBty.js","./toast-CnxnsvgL.js","./soil-page-C4D4uXrT.js","./uscs-names-B6qDO2uH.js","./design-DWZF9eua.js","./dashboard-Qg-cH5i3.js","./fflate-EV1LHJOo.js"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function r(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=r(i);fetch(i.href,s)}})();const ce="modulepreload",ue=function(e,t){return new URL(e,t).href},U={},C=function(t,r,o){let i=Promise.resolve();if(r&&r.length>0){const a=document.getElementsByTagName("link"),d=document.querySelector("meta[property=csp-nonce]"),m=(d==null?void 0:d.nonce)||(d==null?void 0:d.getAttribute("nonce"));i=Promise.allSettled(r.map(l=>{if(l=ue(l,o),l in U)return;U[l]=!0;const g=l.endsWith(".css"),v=g?'[rel="stylesheet"]':"";if(!!o)for(let c=a.length-1;c>=0;c--){const y=a[c];if(y.href===l&&(!g||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${v}`))return;const n=document.createElement("link");if(n.rel=g?"stylesheet":ce,g||(n.as="script"),n.crossOrigin="",n.href=l,m&&n.setAttribute("nonce",m),document.head.appendChild(n),g)return new Promise((c,y)=>{n.addEventListener("load",c),n.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${l}`)))})}))}function s(a){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=a,window.dispatchEvent(d),!d.defaultPrevented)throw a}return i.then(a=>{for(const d of a||[])d.status==="rejected"&&s(d.reason);return t().catch(s)})},se=new Map;function me(e,t){se.set(e,t)}const H=()=>[...se.entries()].map(([e,t])=>({id:e,...t}));function at(){const e={};for(const t of H()){const r=t.export();r!=null&&(e[t.id]=r)}return e}function fe(e={},t="merge"){for(const r of H())e&&e[r.id]!==void 0&&r.import(e[r.id],t)}function nt(){for(const e of H())e.reset&&e.reset()}const D=e=>e&&typeof e=="object"&&!Array.isArray(e),G=e=>e.every(t=>D(t)&&"id"in t);function ae(e,t){if(e==null)return t;if(Array.isArray(e)&&Array.isArray(t)){if(G(e)&&G(t)){const r=new Map(e.map(o=>[o.id,o]));return t.forEach(o=>r.set(o.id,o)),[...r.values()]}return t}if(D(e)&&D(t)){const r={...e};for(const o of Object.keys(t))r[o]=ae(e[o],t[o]);return r}return t}const O="almuhandis_v1_soil_custom",B=()=>({translations:{},notes:[],examples:[],assets:{}});function lt(){try{const e=JSON.parse(localStorage.getItem(O));return e&&typeof e=="object"?{...B(),...e}:B()}catch{return B()}}function dt(e){localStorage.setItem(O,JSON.stringify(e))}const W=()=>{try{return JSON.parse(localStorage.getItem(O))}catch{return null}};me("soil-mechanics",{label:"وحدة ميكانيك التربة (الترجمات والملاحظات والأمثلة والصور المرتبطة)",export:()=>W(),import:(e,t)=>{const r=t==="replace"?e:ae(W(),e);localStorage.setItem(O,JSON.stringify(r))},reset:()=>localStorage.removeItem(O)});const A="almuhandis_v1_",N=new Map;function R(){try{if(typeof window>"u"||!window.localStorage)return!1;const e="__test_storage__";return window.localStorage.setItem(e,"1"),window.localStorage.removeItem(e),!0}catch{return!1}}function J(e){return R()?window.localStorage.getItem(A+e):N.get(A+e)||null}function M(e,t){R()?window.localStorage.setItem(A+e,t):N.set(A+e,t)}function ge(e){R()?window.localStorage.removeItem(A+e):N.delete(A+e)}const u={list(e){const t=J(e);if(!t)return[];try{const r=JSON.parse(t);return Array.isArray(r)?r:[]}catch{return[]}},get(e,t){return this.list(e).find(o=>o.id===t||o.key===t)||null},set(e,t){if(!t)return t;const r=this.list(e),o=t.id!==void 0?"id":"key",i=r.findIndex(s=>s[o]===t[o]);if(i>=0)r[i]={...r[i],...t,updatedAt:new Date().toISOString()};else{const s=new Date().toISOString();r.push({...t,createdAt:t.createdAt||s,updatedAt:s})}return M(e,JSON.stringify(r)),t},saveCollection(e,t){M(e,JSON.stringify(t))},getObject(e){const t=J(e);if(!t)return null;try{return JSON.parse(t)}catch{return null}},setObject(e,t){M(e,JSON.stringify(t))},remove(e,t){const r=this.list(e),o=r.length>0&&r[0].id!==void 0?"id":"key",i=r.filter(a=>a[o]!==t&&a.id!==t&&a.key!==t),s=i.length!==r.length;return s&&M(e,JSON.stringify(i)),s},clear(e){ge(e)},clearAll(){if(R()){const e=[];for(let t=0;t<window.localStorage.length;t++){const r=window.localStorage.key(t);r&&r.startsWith(A)&&e.push(r)}e.forEach(t=>window.localStorage.removeItem(t))}N.clear()}},ve="almuhandis_db",pe=1,b="media_assets",L=new Map;function E(){return typeof window<"u"&&typeof window.indexedDB<"u"}function T(){return new Promise((e,t)=>{if(!E())return e(null);const r=window.indexedDB.open(ve,pe);r.onupgradeneeded=o=>{const i=o.target.result;i.objectStoreNames.contains(b)||i.createObjectStore(b,{keyPath:"id"})},r.onsuccess=()=>e(r.result),r.onerror=()=>t(r.error)})}const z={async saveAsset(e){if(!e||!e.id)throw new Error("بيانات الأصل غير مكتملة (المعرف مطلوب).");const t={...e,createdAt:e.createdAt||new Date().toISOString()};if(!E())return L.set(e.id,t),t;const r=await T();return new Promise((o,i)=>{const d=r.transaction(b,"readwrite").objectStore(b).put(t);d.onsuccess=()=>o(t),d.onerror=()=>i(d.error)})},async getAsset(e){if(!e)return null;if(!E())return L.get(e)||null;const t=await T();return new Promise((r,o)=>{const a=t.transaction(b,"readonly").objectStore(b).get(e);a.onsuccess=()=>r(a.result||null),a.onerror=()=>o(a.error)})},async listAssets(){if(!E())return Array.from(L.values());const e=await T();return new Promise((t,r)=>{const s=e.transaction(b,"readonly").objectStore(b).getAll();s.onsuccess=()=>t(s.result||[]),s.onerror=()=>r(s.error)})},async removeAsset(e){if(!e)return!1;if(!E())return L.delete(e);const t=await T();return new Promise((r,o)=>{const a=t.transaction(b,"readwrite").objectStore(b).delete(e);a.onsuccess=()=>r(!0),a.onerror=()=>o(a.error)})},async getStorageUsage(){const e=await this.listAssets();let t=0;for(const r of e)r.size?t+=r.size:r.dataUrl&&(t+=r.dataUrl.length*.75);return Math.round(t)},async clearAll(){if(!E()){L.clear();return}const e=await T();return new Promise((t,r)=>{const s=e.transaction(b,"readwrite").objectStore(b).clear();s.onsuccess=()=>t(),s.onerror=()=>r(s.error)})}},V=1;function ne(e){if(!e||typeof e!="object")return{isValid:!1,error:"كائن المعادلة غير صالح."};if(!e.id||typeof e.id!="string")return{isValid:!1,error:"معرّف المعادلة (id) مفقود أو غير نصي."};if(!e.title||typeof e.title!="string")return{isValid:!1,error:"عنوان المعادلة مطلوب."};if(!Array.isArray(e.inputs))return{isValid:!1,error:"مصفوفة المدخلات (inputs) غير صالحة."};for(const t of e.inputs)if(!t.key||typeof t.key!="string")return{isValid:!1,error:"مفتاح المدخل (key) مطلوب في جميع المدخلات."};if(!Array.isArray(e.outputs)||e.outputs.length===0)return{isValid:!1,error:"يجب أن تحتوي المعادلة على مخرج واحد على الأقل."};for(const t of e.outputs){if(!t.key||typeof t.key!="string")return{isValid:!1,error:"مفتاح المخرج (key) مطلوب في جميع المخرجات."};if(!t.expression||typeof t.expression!="string")return{isValid:!1,error:`صيغة المخرج "${t.key}" مطلوبة.`}}return{isValid:!0,error:null}}function he(e){return!e||typeof e!="object"?{isValid:!1,error:"كائن التصنيف غير صالح."}:!e.id||typeof e.id!="string"?{isValid:!1,error:"معرّف التصنيف مطلوب."}:!e.title||typeof e.title!="string"?{isValid:!1,error:"اسم التصنيف مطلوب."}:{isValid:!0,error:null}}function ye(e){return!e||typeof e!="object"?{isValid:!1,error:"كائن المصدر غير صالح."}:!e.id||typeof e.id!="string"?{isValid:!1,error:"معرّف المصدر مطلوب."}:!e.title||typeof e.title!="string"?{isValid:!1,error:"عنوان المصدر مطلوب."}:{isValid:!0,error:null}}function be(e){return!e||typeof e!="object"?{isValid:!1,error:"كائن الثابت غير صالح."}:!e.key||typeof e.key!="string"?{isValid:!1,error:"رمز الثابت مطلوب."}:e.value===void 0||e.value===null||isNaN(Number(e.value))?{isValid:!1,error:"قيمة الثابت يجب أن تكون رقماً صالحاً."}:{isValid:!0,error:null}}function xe(e){return!e||typeof e!="object"?{isValid:!1,error:"كائن الجدول المرجعي غير صالح."}:!e.id||typeof e.id!="string"?{isValid:!1,error:"معرّف الجدول مطلوب."}:!e.title||typeof e.title!="string"?{isValid:!1,error:"عنوان الجدول مطلوب."}:Array.isArray(e.columns)?Array.isArray(e.rows)?{isValid:!0,error:null}:{isValid:!1,error:"صفوف الجدول يجب أن تكون مصفوفة."}:{isValid:!1,error:"أعمدة الجدول يجب أن تكون مصفوفة."}}function ct(e){const t=[];return!e||typeof e!="object"?{isValid:!1,errors:["الملف المستورد تالف أو لا يحتوي على كائن JSON صالح."]}:(e.formulas&&!Array.isArray(e.formulas)?t.push("حقل المعادلات (formulas) يجب أن يكون مصفوفة."):e.formulas&&e.formulas.forEach((r,o)=>{const i=ne(r);i.isValid||t.push(`المعادلة #${o+1} (${r.id||"بدون معرف"}): ${i.error}`)}),e.categories&&!Array.isArray(e.categories)&&t.push("حقل التصنيفات (categories) يجب أن يكون مصفوفة."),e.tables&&!Array.isArray(e.tables)&&t.push("حقل الجداول (tables) يجب أن يكون مصفوفة."),e.constants&&!Array.isArray(e.constants)&&t.push("حقل الثوابت (constants) يجب أن يكون مصفوفة."),{isValid:t.length===0,errors:t})}function we(e,t=0){let r={...e};return t<1&&(r.schemaVersion=1,r.settings||(r.settings={}),r.formulas||(r.formulas=[]),r.categories||(r.categories=[]),r.sources||(r.sources=[]),r.constants||(r.constants=[]),r.tables||(r.tables=[]),r.homeSections||(r.homeSections=[])),r}const ke=1,Se={siteName:"المهندس الصغير",tagline:"حاسبات ومعادلات هندسية مرجعية",logoAssetId:null,faviconAssetId:null,heroBackgroundAssetIds:[],heroOverlayOpacity:.55,primaryColor:"#6636CC",animationsEnabled:!0,footerText:"موقع «المهندس الصغير» - حاسبات ومعادلات هندسية مرجعية قابلة للتوسعة.",contactLinks:[],adminPinHash:""},Ae=[{id:"cat-structures",title:"المنشآت",description:"تحليل الإجهادات والعزوم وقوى القص للعتبات والإطارات.",coverAssetId:null,order:1},{id:"cat-concrete",title:"الخرسانة المسلحة",description:"تسليح المقاطع وحسابات الأحجام والأوزان الذاتية.",coverAssetId:null,order:2},{id:"cat-soil",title:"ميكانيكا التربة",description:"قدرة تحمل التربة وإجهادات التماس وتصميم الأساسات.",coverAssetId:null,order:3},{id:"cat-survey",title:"المساحة والطرق",description:"حسابات المنحنيات الأفقية والرأسية والإحداثيات.",coverAssetId:null,order:4}],Ee=[{id:"beam-simple-moment",title:"العزم الأقصى في عتبة بسيطة الإسناد",categoryId:"cat-structures",description:"حساب العزم الأقصى لعتبة محمّلة بحمل منتظم على كامل طولها.",coverAssetId:null,galleryAssetIds:[],inputs:[{key:"w",label:"الحمل الموزع",unit:"kN/m",default:10,min:0,max:null,hint:"الحمل الموزع بانتظام على طول العتبة"},{key:"L",label:"طول العتبة",unit:"m",default:5,min:0,max:null,hint:"المسافة بين ركيزتي العتبة"}],outputs:[{key:"M",label:"العزم الأقصى",unit:"kN.m",expression:"w * L^2 / 8",latex:"M = \\frac{w L^2}{8}",decimals:2}],sourceIds:["src-001"],tags:["عزوم","عتبات","منشآت"],notes:"يُفترض أن مادة العتبة خطية مرنة وأن الركائز حرة الدوران.",status:"published",isSample:!0,createdAt:"2026-10-30T10:00:00.000Z",updatedAt:"2026-10-30T10:00:00.000Z"},{id:"axial-stress",title:"الإجهاد العمودي المحوري",categoryId:"cat-structures",description:"حساب الإجهاد العمودي المؤثر على مقطع مستعرض تحت تأثير قوة محورية.",coverAssetId:null,galleryAssetIds:[],inputs:[{key:"P",label:"القوة المحورية",unit:"kN",default:150,min:0,max:null,hint:"القوة العمودية المؤثرة"},{key:"A",label:"مساحة المقطع",unit:"cm²",default:50,min:.001,max:null,hint:"مساحة المقطع المستعرض"}],outputs:[{key:"sigma",label:"الإجهاد العمودي",unit:"MPa",expression:"(P * 1000) / (A * 100)",latex:"\\sigma = \\frac{P}{A}",decimals:2}],sourceIds:["src-001"],tags:["إجهاد","ميكانيكا المواد"],notes:"تمت مراعاة تحويل الوحدات: 1 kN = 1000 N و 1 cm² = 100 mm² للحصول على الناتج بوحدة MPa (N/mm²).",status:"published",isSample:!0,createdAt:"2026-10-30T10:00:00.000Z",updatedAt:"2026-10-30T10:00:00.000Z"},{id:"slab-concrete-volume",title:"حجم ووزن الخرسانة لبلاطة سقف",categoryId:"cat-concrete",description:"حساب الحجم الهندسي للبلاطة والوزن الذاتي التقريبي باعتماد كثافة الخرسانة المسلحة.",coverAssetId:null,galleryAssetIds:[],inputs:[{key:"L",label:"طول البلاطة",unit:"m",default:6,min:0,max:null,hint:"البعد في الاتجاه الأول"},{key:"B",label:"عرض البلاطة",unit:"m",default:4,min:0,max:null,hint:"البعد في الاتجاه الثاني"},{key:"t",label:"سماكة البلاطة",unit:"m",default:.2,min:.05,max:null,hint:"سماكة الصب الخرساني"},{key:"density",label:"كثافة الخرسانة",unit:"kN/m³",default:25,min:15,max:35,hint:"الكثافة الحجمية (المعتادة 25 kN/m³)"}],outputs:[{key:"Area",label:"مساحة المسطح",unit:"m²",expression:"L * B",latex:"A = L \\times B",decimals:2},{key:"Volume",label:"حجم الخرسانة",unit:"m³",expression:"Area * t",latex:"V = A \\times t",decimals:2},{key:"Weight",label:"الوزن الإجمالي",unit:"kN",expression:"Volume * density",latex:"W = V \\times \\gamma",decimals:2}],sourceIds:[],tags:["خرسانة","كميات","أوزان"],notes:"هذه المعادلة استرشادية لحساب الكميات والأوزان الذاتية.",status:"published",isSample:!0,createdAt:"2026-10-30T10:00:00.000Z",updatedAt:"2026-10-30T10:00:00.000Z"}],$e=[{key:"g",label:"تسارع الجاذبية الأرضية",value:9.81,unit:"m/s²",sourceId:null,description:"قيمة تسارع السقوط الحر القياسي على سطح الأرض"}],Ce=[{id:"concrete_grades",title:"درجات الخرسانة المعيارية (Eurocode 2)",columns:[{key:"grade",label:"الرتبة",type:"text"},{key:"fc",label:"مقاومة الانضغاط المميزة (fc)",unit:"MPa",type:"number"},{key:"fcm",label:"متوسط المقاومة (fcm)",unit:"MPa",type:"number"},{key:"Ecm",label:"معامل المرونة (Ecm)",unit:"GPa",type:"number"}],rows:[{grade:"C20/25",fc:20,fcm:28,Ecm:30},{grade:"C25/30",fc:25,fcm:33,Ecm:31},{grade:"C30/37",fc:30,fcm:38,Ecm:33},{grade:"C35/45",fc:35,fcm:43,Ecm:34}],sourceId:null}],Le=[{id:"src-001",title:"ميكانيكا المواد (Mechanics of Materials)",author:"Russell C. Hibbeler",edition:"الطبعة العاشرة (10th Edition)",pages:"الفصل 6: الانحناء والعزوم، الفصل 1: الإجهادات المحورية",link:"",coverAssetId:null}],Te=[{id:"sec-hero",type:"hero",enabled:!0,order:1,title:"حاسبات ومعادلات هندسية مرجعية"},{id:"sec-stats",type:"stats",enabled:!0,order:2,title:"الإحصائيات"},{id:"sec-modules",type:"modules",enabled:!0,order:2.5,title:"وحدات متخصصة"},{id:"sec-categories",type:"categories",enabled:!0,order:3,title:"التصنيفات الهندسية"},{id:"sec-latest",type:"latest-formulas",enabled:!0,order:4,title:"أحدث المعادلات المضافة"},{id:"sec-gallery",type:"gallery",enabled:!0,order:5,title:"معرض المخططات والرسومات الهندسية"},{id:"sec-about",type:"about",enabled:!0,order:6,title:"عن موقع المهندس الصغير"}],w={schemaVersion:ke,settings:Se,categories:Ae,formulas:Ee,constants:$e,tables:Ce,sources:Le,homeSections:Te},ze={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1},_=new Map;let j=null;const q=()=>ze&&"./"||"./";function Ie(){return j||(j=fetch(`${q()}uploads/index.json`).then(e=>e.ok?e.json():[]).catch(()=>[])),j}async function Z(e){const t=await(await fetch(e)).blob();return new Promise((r,o)=>{const i=new FileReader;i.onload=()=>r(i.result),i.onerror=o,i.readAsDataURL(t)})}async function Oe(e){if(_.has(e))return _.get(e);const t=(await Ie()).find(r=>r.id===e);if(!t)return null;try{const{file:r,thumbFile:o,...i}=t,s=await Z(`${q()}uploads/${r}`),a=o?await Z(`${q()}uploads/${o}`):s,d={...i,dataUrl:s,thumbUrl:a};return _.set(e,d),d}catch{return null}}const f={FORMULAS:"formulas",CATEGORIES:"categories",SOURCES:"sources",CONSTANTS:"constants",TABLES:"tables",HOME_SECTIONS:"home_sections",SETTINGS:"settings",META:"meta"},p={async initStore(){const t=(u.getObject(f.META)||{}).schemaVersion||0;if(u.list(f.FORMULAS).length===0)this.loadSeedData(w);else if(t<V){const o=this.getAllDataSync(),i=we(o,t);this.restoreAllData(i)}u.setObject(f.META,{schemaVersion:V,lastInitialized:new Date().toISOString()})},loadSeedData(e=w){e.settings&&u.setObject(f.SETTINGS,e.settings),e.categories&&u.saveCollection(f.CATEGORIES,e.categories),e.formulas&&u.saveCollection(f.FORMULAS,e.formulas),e.constants&&u.saveCollection(f.CONSTANTS,e.constants),e.tables&&u.saveCollection(f.TABLES,e.tables),e.sources&&u.saveCollection(f.SOURCES,e.sources),e.homeSections&&u.saveCollection(f.HOME_SECTIONS,e.homeSections)},getFormulas(){return u.list(f.FORMULAS)},getFormula(e){return u.get(f.FORMULAS,e)},saveFormula(e){const t=ne(e);if(!t.isValid)throw new Error(`خطأ في مخطط المعادلة: ${t.error}`);return u.set(f.FORMULAS,e)},deleteFormula(e){return u.remove(f.FORMULAS,e)},getCategories(){return u.list(f.CATEGORIES).sort((t,r)=>(t.order||0)-(r.order||0))},getCategory(e){return u.get(f.CATEGORIES,e)},saveCategory(e){const t=he(e);if(!t.isValid)throw new Error(`خطأ في بيانات التصنيف: ${t.error}`);return u.set(f.CATEGORIES,e)},deleteCategory(e){return u.remove(f.CATEGORIES,e)},getSources(){return u.list(f.SOURCES)},getSource(e){return u.get(f.SOURCES,e)},saveSource(e){const t=ye(e);if(!t.isValid)throw new Error(`خطأ في بيانات المصدر: ${t.error}`);return u.set(f.SOURCES,e)},deleteSource(e){const r=this.getFormulas().filter(o=>o.sourceIds&&o.sourceIds.includes(e));if(r.length>0){const o=r.map(s=>`"${s.title}"`).join("، "),i=new Error(`لا يمكن حذف المصدر لأنه مرتبط بالمعادلات التالية: ${o}`);throw i.isLinked=!0,i.linkedCount=r.length,i}return u.remove(f.SOURCES,e)},getConstants(){return u.list(f.CONSTANTS)},getConstant(e){return u.get(f.CONSTANTS,e)},saveConstant(e){const t=be(e);if(!t.isValid)throw new Error(`خطأ في بيانات الثابت: ${t.error}`);return u.set(f.CONSTANTS,e)},deleteConstant(e){return u.remove(f.CONSTANTS,e)},getTables(){return u.list(f.TABLES)},getTable(e){return u.get(f.TABLES,e)},saveTable(e){const t=xe(e);if(!t.isValid)throw new Error(`خطأ في بيانات الجدول: ${t.error}`);return u.set(f.TABLES,e)},deleteTable(e){return u.remove(f.TABLES,e)},getSettings(){return u.getObject(f.SETTINGS)||w.settings},updateSettings(e){const r={...this.getSettings(),...e};return u.setObject(f.SETTINGS,r),r},getHomeSections(){const e=u.list(f.HOME_SECTIONS);return e.length===0?w.homeSections:e.sort((t,r)=>(t.order||0)-(r.order||0))},saveHomeSections(e){u.saveCollection(f.HOME_SECTIONS,e)},async saveMediaAsset(e){return await z.saveAsset(e)},async getMediaAsset(e){return await z.getAsset(e)||await Oe(e)},async listMediaAssets(){return await z.listAssets()},async deleteMediaAsset(e){return await z.removeAsset(e)},async getMediaStorageUsage(){return await z.getStorageUsage()},getAllDataSync(){return{schemaVersion:V,settings:this.getSettings(),categories:this.getCategories(),formulas:this.getFormulas(),constants:this.getConstants(),tables:this.getTables(),sources:this.getSources(),homeSections:this.getHomeSections()}},restoreAllData(e){!e||typeof e!="object"||(e.settings&&u.setObject(f.SETTINGS,e.settings),e.categories&&u.saveCollection(f.CATEGORIES,e.categories),e.formulas&&u.saveCollection(f.FORMULAS,e.formulas),e.constants&&u.saveCollection(f.CONSTANTS,e.constants),e.tables&&u.saveCollection(f.TABLES,e.tables),e.sources&&u.saveCollection(f.SOURCES,e.sources),e.homeSections&&u.saveCollection(f.HOME_SECTIONS,e.homeSections))},clearAllData(){u.clearAll()}};class Fe{constructor({rootEl:t,routes:r={},notFoundView:o}){this.rootEl=t,this.routes=[],this.notFoundView=o,this.currentPath=null,this.currentCleanup=null,Object.entries(r).forEach(([i,s])=>{this.addRoute(i,s)}),this.init()}addRoute(t,r){const o=t.replace(/^#/,""),i=[],s=o.replace(/:([a-zA-Z0-9_]+)/g,(d,m)=>(i.push(m),"([^/]+)")).replace(/\//g,"\\/"),a=new RegExp(`^${s}$`);this.routes.push({pattern:o,regex:a,paramNames:i,handler:r})}getPath(){let t=window.location.hash||"#/";t.startsWith("#")||(t="#"+t);const r=t.substring(1).split("?")[0];return r.startsWith("/")?r:"/"+r}getQueryParams(){const t=window.location.hash||"",r=t.indexOf("?");if(r===-1)return{};const o=t.substring(r+1),i={};return new URLSearchParams(o).forEach((s,a)=>{i[a]=s}),i}navigate(t){const r=t.startsWith("#")?t:"#"+(t.startsWith("/")?t:"/"+t);window.location.hash=r}async handleRoute(){const t=this.getPath(),r=this.getQueryParams();let o=null,i={};for(const d of this.routes){const m=t.match(d.regex);if(m){o=d,d.paramNames.forEach((l,g)=>{i[l]=decodeURIComponent(m[g+1])});break}}if(this.currentCleanup&&typeof this.currentCleanup=="function"){try{this.currentCleanup()}catch(d){console.error(d)}this.currentCleanup=null}this.rootEl.innerHTML="";const s=document.createElement("div");s.className="page-container";let a;o?a=await o.handler({params:i,query:r,navigate:this.navigate.bind(this)}):this.notFoundView&&(a=await this.notFoundView({path:t,navigate:this.navigate.bind(this)})),a instanceof HTMLElement?s.appendChild(a):a&&typeof a=="object"&&a.element instanceof HTMLElement&&(s.appendChild(a.element),typeof a.cleanup=="function"&&(this.currentCleanup=a.cleanup)),this.rootEl.appendChild(s),window.scrollTo({top:0,behavior:"instant"}),this.currentPath=t,window.dispatchEvent(new CustomEvent("app:route-changed",{detail:{path:t,params:i,query:r}}))}init(){window.addEventListener("hashchange",()=>this.handleRoute()),this.handleRoute()}}function F({showTagline:e=!1,size:t="normal"}={}){const r=t==="large"?44:36,o=t==="large"?"1.5rem":"1.25rem",i=p.getSettings();return`
    <a href="#/" class="brand-logo" aria-label="المهندس الصغير - الصفحة الرئيسية">
      <div class="brand-icon-wrapper" style="width: ${r}px; height: ${r}px;">
         ${i.logoAssetId?`<img data-asset-id="${i.logoAssetId}" alt="شعار الموقع" style="width:100%; height:100%; object-fit:contain; border-radius:8px;" />`:`
        <svg class="brand-svg" viewBox="0 0 40 40" width="${r}" height="${r}" xmlns="http://www.w3.org/2000/svg">
                `}
          <!-- خلفية الحاوية الهندسية -->
          <rect class="brand-rect" width="40" height="40" rx="8" fill="var(--violet-600)" />
          
          <!-- مسطرة المثلث الهندسي (Set square) -->
          <polygon class="brand-triangle" points="10,31 31,31 10,10" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linejoin="round"/>
          <polygon points="14,27 25,27 14,16" fill="none" stroke="var(--violet-200)" stroke-width="1.5" stroke-linejoin="round"/>
          
          <!-- درجات وتدريجات المسطرة -->
          <line x1="15" y1="27" x2="15" y2="24" stroke="var(--violet-200)" stroke-width="1.2"/>
          <line x1="19" y1="27" x2="19" y2="24" stroke="var(--violet-200)" stroke-width="1.2"/>
          <line x1="23" y1="27" x2="23" y2="24" stroke="var(--violet-200)" stroke-width="1.2"/>
          
          <!-- مربع القياس الدقيق -->
          <rect class="brand-dot" x="25" y="10" width="5" height="5" rx="1" fill="#FFFFFF"/>
        </svg>
      </div>
      <div class="brand-text-col">
        <span class="brand-name" style="font-size: ${o};"${i.siteName||"المهندس الصغير"}</span>
        ${e?`<span class="brand-tagline"${i.tagline||"حاسبات ومعادلات هندسية"}</span>`:""}
      </div>
    </a>
  `}function Y(){const e=document.createElement("header");e.className="site-header",e.innerHTML=`
    <div class="container site-header-inner">
      <!-- الشعار -->
      <div class="site-header-brand">
        ${F({showTagline:!1,size:"normal"})}
      </div>

      <!-- روابط التصفح للشاشات المتوسطة والكبيرة -->
      <nav class="site-nav" aria-label="التنقل الرئيسي">
        <a href="#/" class="nav-link" data-route="/">الرئيسية</a>
        <a href="#/library" class="nav-link" data-route="/library">المعادلات</a>
        <a href="#/tables" class="nav-link" data-route="/tables">الجداول المرجعية</a>
        <a href="#/sources" class="nav-link" data-route="/sources">المصادر</a>
        <a href="#/soil" class="nav-link" data-route="/soil">ميكانيك التربة</a>
        <a href="#/about" class="nav-link" data-route="/about">عن الموقع</a>
      </nav>

      <!-- الأزرار الجانبية وقائمة الجوال -->
      <div class="site-header-actions">
        <a href="#/admin" class="btn btn-secondary btn-sm admin-nav-btn" title="لوحة التحكم">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span class="admin-btn-text">لوحة التحكم</span>
        </a>

        <!-- زر القائمة المنزلقة للجوال -->
        <button class="mobile-menu-toggle" aria-label="فتح القائمة الرئيسية" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- القائمة المنزلقة للجوال (Mobile Drawer) -->
    <div class="mobile-drawer-backdrop" aria-hidden="true"></div>
    <div class="mobile-drawer" role="dialog" aria-modal="true" aria-label="القائمة الرئيسية">
      <div class="mobile-drawer-header">
        ${F({showTagline:!1,size:"normal"})}
        <button class="mobile-drawer-close" aria-label="إغلاق القائمة">✕</button>
      </div>
      <nav class="mobile-drawer-nav">
        <a href="#/" class="mobile-nav-link" data-route="/">الرئيسية</a>
        <a href="#/library" class="mobile-nav-link" data-route="/library">مكتبة المعادلات</a>
        <a href="#/tables" class="mobile-nav-link" data-route="/tables">الجداول المرجعية</a>
        <a href="#/sources" class="mobile-nav-link" data-route="/sources">المصادر والأكواد</a>
        <a href="#/soil" class="mobile-nav-link" data-route="/soil">ميكانيك التربة</a>
        <a href="#/about" class="mobile-nav-link" data-route="/about">عن المهندس الصغير</a>
        <div style="border-top: 1px solid var(--line); margin: 12px 0;"></div>
        <a href="#/admin" class="mobile-nav-link" data-route="/admin" style="color: var(--violet-700); font-weight: 600;">
          لوحة التحكم
        </a>
        <a href="#/design" class="mobile-nav-link" data-route="/design" style="color: var(--ink-soft); font-size: 0.85rem;">
          دليل المكونات (وضع التطوير)
        </a>
      </nav>
    </div>
  `;const t=e.querySelector(".mobile-menu-toggle"),r=e.querySelector(".mobile-drawer-close"),o=e.querySelector(".mobile-drawer-backdrop"),i=e.querySelector(".mobile-drawer"),s=()=>{i.classList.add("is-open"),o.classList.add("is-open"),t.setAttribute("aria-expanded","true"),o.setAttribute("aria-hidden","false")},a=()=>{i.classList.remove("is-open"),o.classList.remove("is-open"),t.setAttribute("aria-expanded","false"),o.setAttribute("aria-hidden","true")};t.addEventListener("click",s),r.addEventListener("click",a),o.addEventListener("click",a),e.querySelectorAll(".mobile-nav-link").forEach(l=>{l.addEventListener("click",a)});const d=l=>{e.querySelectorAll(".nav-link, .mobile-nav-link").forEach(v=>{const h=v.getAttribute("data-route"),n=h==="/"?l==="/":l.startsWith(h);v.classList.toggle("is-active",n),n?v.setAttribute("aria-current","page"):v.removeAttribute("aria-current")})};window.addEventListener("app:route-changed",l=>{d(l.detail.path)});const m=window.location.hash.replace(/^#/,"").split("?")[0]||"/";return d(m.startsWith("/")?m:"/"+m),e}function $(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches||document.body.classList.contains("animations-disabled")}let P=null;function Me(e=document){if($()){e.querySelectorAll(".reveal, .stagger-container").forEach(o=>{o.classList.add("is-revealed"),o.querySelectorAll(".reveal-item").forEach(i=>{i.style.opacity="1",i.style.transform="none"})});return}P||(P=new IntersectionObserver(r=>{r.forEach(o=>{if(o.isIntersecting){const i=o.target;i.classList.add("is-revealed"),i.classList.contains("stagger-container")&&i.querySelectorAll(".reveal-item").forEach((a,d)=>{a.style.setProperty("--stagger-idx",d)}),P.unobserve(i)}})},{root:null,threshold:.12,rootMargin:"0px 0px -40px 0px"})),e.querySelectorAll(".reveal:not(.is-revealed), .stagger-container:not(.is-revealed)").forEach(r=>P.observe(r))}function x(e="",t=240){return`
    <div class="dimension-line-wrapper" style="display: flex; align-items: center; gap: 8px; width: 100%; max-width: ${t}px;">
      <svg class="dimension-svg" viewBox="0 0 200 16" width="100%" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
        <!-- علامة البداية العمودية -->
        <line class="draw-line" x1="2" y1="2" x2="2" y2="14" stroke="var(--violet-500)" stroke-width="1.5" />
        <!-- سهم البداية -->
        <path class="draw-line" d="M 2 8 L 8 5 L 8 11 Z" fill="var(--violet-500)" stroke="var(--violet-500)" />
        
        <!-- خط البعد الأفقي -->
        <line class="draw-line" x1="2" y1="8" x2="198" y2="8" stroke="var(--line-strong)" stroke-width="1.5" stroke-dasharray="4 2" />
        
        <!-- سهم النهاية -->
        <path class="draw-line" d="M 198 8 L 192 5 L 192 11 Z" fill="var(--violet-500)" stroke="var(--violet-500)" />
        <!-- علامة النهاية العمودية -->
        <line class="draw-line" x1="198" y1="2" x2="198" y2="14" stroke="var(--violet-500)" stroke-width="1.5" />
      </svg>
      ${e?`<span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--violet-600); white-space: nowrap;">${e}</span>`:""}
    </div>
  `}function Pe(e=document){const t=e.querySelectorAll(".dimension-line-wrapper:not([data-drawn])");if($()){t.forEach(o=>{o.querySelectorAll(".draw-line").forEach(i=>i.classList.add("is-drawn")),o.setAttribute("data-drawn","true")});return}const r=new IntersectionObserver(o=>{o.forEach(i=>{if(i.isIntersecting){const s=i.target;s.querySelectorAll(".draw-line").forEach(d=>d.classList.add("is-drawn")),s.setAttribute("data-drawn","true"),r.unobserve(s)}})},{threshold:.2});t.forEach(o=>r.observe(o))}function K(){const e=document.createElement("footer");return e.className="site-footer",e.innerHTML=`
    <div class="container">
      <div style="margin-bottom: 24px;">
        ${x("نهاية المخطط // FOOTER",240)}
      </div>

      <div class="site-footer-grid">
        <!-- عمود العلامة والوصف -->
        <div class="footer-col footer-col-brand">
          ${F({showTagline:!0,size:"normal"})}
          <p style="font-size: 0.88rem; color: var(--ink-soft); margin-top: 14px; line-height: 1.7; max-width: 320px;">
            ${p.getSettings().footerText||"موقع وحاسبة هندسية عربية مخصصة للمهندس والباحث المدني."}
          </p>
        </div>

        <!-- عمود التصفح السريع -->
        <div class="footer-col">
          <h4 class="footer-title">الأقسام الرئيسية</h4>
          <ul class="footer-links">
            <li><a href="#/library">مكتبة المعادلات</a></li>
            <li><a href="#/tables">الجداول المرجعية</a></li>
            <li><a href="#/sources">المصادر والأكواد</a></li>
            <li><a href="#/about">عن الموقع والمنهجية</a></li>
          </ul>
        </div>

        <!-- عمود التصنيفات الهندسية -->
        <div class="footer-col">
          <h4 class="footer-title">التصنيفات</h4>
          <ul class="footer-links">
            <li><a href="#/library?category=cat-structures">المنشآت والعزوم</a></li>
            <li><a href="#/library?category=cat-concrete">الخرسانة المسلحة</a></li>
            <li><a href="#/library?category=cat-soil">ميكانيكا التربة</a></li>
            <li><a href="#/library?category=cat-survey">المساحة والطرق</a></li>
          </ul>
        </div>

        <!-- عمود الإدارة والتنويه -->
        <div class="footer-col">
          <h4 class="footer-title">الإدارة والتحكم</h4>
          <ul class="footer-links">
            <li><a href="#/admin" style="font-weight: 600; color: var(--violet-600);">دخول لوحة التحكم</a></li>
            <li><a href="#/design" style="color: var(--ink-soft);">دليل نظام التصميم</a></li>
          </ul>
          <div style="margin-top: 16px; padding: 10px 12px; background: var(--bg-soft); border: 1px solid var(--line); border-radius: var(--radius-sm); font-size: 0.78rem; color: var(--ink-soft); line-height: 1.6;">
            <strong>تنويه هندسي:</strong> جميع النتائج لأغراض تعليمية واسترشادية، ويجب دائماً الرجوع للأكواد المعتمدة قبل الاعتماد الإنشائي.
          </div>
        </div>
      </div>

      <!-- حقوق الموقع والسنة -->
      <div class="site-footer-bottom">
        <div style="font-size: 0.85rem; color: var(--ink-soft);">
          © ${new Date().getFullYear()} موقع <strong>المهندس الصغير</strong>. جميع الحقوق محفوظة ومفتوحة المصدر.
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--violet-600);">
          v2.0 // STATIC-FIRST ARCHITECTURE
        </div>
      </div>
    </div>
  `,e}function Ne(e){return 1-Math.pow(1-e,3)}function Re(e,t,{startValue:r=0,duration:o=900,decimals:i=0,suffix:s="",prefix:a=""}={}){if(!e)return;const d=parseFloat(t)||0,m=parseFloat(r)||0;if($()||o<=0){e.textContent=`${a}${d.toFixed(i)}${s}`;return}let l=null;function g(v){l||(l=v);const h=Math.min((v-l)/o,1),n=Ne(h),c=m+(d-m)*n;e.textContent=`${a}${c.toFixed(i)}${s}`,h<1?requestAnimationFrame(g):e.textContent=`${a}${d.toFixed(i)}${s}`}requestAnimationFrame(g)}function Be(e=document){const t=e.querySelectorAll("[data-countup]:not([data-counted])");if($()){t.forEach(o=>{const i=parseFloat(o.getAttribute("data-countup"))||0,s=parseInt(o.getAttribute("data-decimals")||"0",10),a=o.getAttribute("data-suffix")||"";o.textContent=`${i.toFixed(s)}${a}`,o.setAttribute("data-counted","true")});return}const r=new IntersectionObserver(o=>{o.forEach(i=>{if(i.isIntersecting){const s=i.target,a=parseFloat(s.getAttribute("data-countup"))||0,d=parseInt(s.getAttribute("data-decimals")||"0",10),m=parseInt(s.getAttribute("data-duration")||"1000",10),l=s.getAttribute("data-suffix")||"";Re(s,a,{decimals:d,duration:m,suffix:l}),s.setAttribute("data-counted","true"),r.unobserve(s)}})},{threshold:.2});t.forEach(o=>r.observe(o))}function Ve(e){if(!e||$()||window.matchMedia("(pointer: coarse)").matches)return;const t=e.querySelector(".hero-blueprint-bg");if(!t)return;let r=!1;e.addEventListener("mousemove",o=>{r||(r=!0,requestAnimationFrame(()=>{const i=e.getBoundingClientRect(),s=o.clientX-i.left-i.width/2,a=o.clientY-i.top-i.height/2,d=s/i.width*10,m=a/i.height*10;t.style.transform=`translate(${d}px, ${m}px)`,r=!1}))}),e.addEventListener("mouseleave",()=>{t.style.transform="translate(0px, 0px)",t.style.transition="transform 600ms cubic-bezier(.2, .7, .2, 1)",setTimeout(()=>{t.style.transition=""},600)})}function _e(){if($())return;let e=document.querySelector(".scroll-progress-bar");e||(e=document.createElement("div"),e.className="scroll-progress-bar",document.body.appendChild(e));let t=!1;window.addEventListener("scroll",()=>{t||(t=!0,requestAnimationFrame(()=>{const r=window.scrollY||document.documentElement.scrollTop,o=document.documentElement.scrollHeight-window.innerHeight,i=o>0?r/o*100:0;e.style.width=`${i}%`,t=!1}))},{passive:!0})}function je(e=document){Me(e),Be(e),Pe(e),_e()}let S=null;function De(){return S||(S=document.getElementById("modal-root"),S||(S=document.createElement("div"),S.id="modal-root",document.body.appendChild(S))),S}function qe({title:e="",content:t="",confirmText:r="تأكيد",cancelText:o="إلغاء",showFooter:i=!0,onConfirm:s=null,onCancel:a=null}={}){const d=De(),m=document.createElement("div");m.className="modal-backdrop",m.setAttribute("role","dialog"),m.setAttribute("aria-modal","true"),m.innerHTML=`
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">${e}</h3>
        <button class="modal-close" aria-label="إغلاق النافذة">✕</button>
      </div>
      <div class="modal-body">
        ${typeof t=="string"?t:""}
      </div>
      ${i?`
        <div class="modal-footer">
          <button class="btn btn-secondary modal-cancel-btn">${o}</button>
          <button class="btn btn-primary modal-confirm-btn">${r}</button>
        </div>
      `:""}
    </div>
  `,typeof t!="string"&&t instanceof Node&&m.querySelector(".modal-body").appendChild(t);const l=()=>{m.classList.remove("is-open"),setTimeout(()=>{m.parentNode&&m.parentNode.removeChild(m)},200),document.removeEventListener("keydown",g)},g=n=>{n.key==="Escape"&&(a&&a(),l())};document.addEventListener("keydown",g),m.querySelector(".modal-close").addEventListener("click",()=>{a&&a(),l()});const v=m.querySelector(".modal-cancel-btn");v&&v.addEventListener("click",()=>{a&&a(),l()});const h=m.querySelector(".modal-confirm-btn");return h&&h.addEventListener("click",()=>{s&&s(),l()}),m.addEventListener("click",n=>{n.target===m&&(a&&a(),l())}),d.appendChild(m),requestAnimationFrame(()=>{m.classList.add("is-open")}),{close:l}}const Q="soil-home-card-styles";function He(){if(document.getElementById(Q))return;const e=document.createElement("style");e.id=Q,e.textContent=`
  .soil-home-card{display:grid;grid-template-columns:minmax(0,1fr) 180px;gap:24px;align-items:center;
    border:1px solid var(--line);border-radius:var(--radius-lg);padding:24px;background:var(--bg);
    transition:transform 250ms cubic-bezier(.2,.7,.2,1),box-shadow 250ms,border-color 250ms}
  .soil-home-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-soft);border-color:var(--violet-500)}
  .soil-home-card h3{margin:0 0 8px;font-size:1.4rem;color:var(--ink)}
  .soil-home-card p{margin:0 0 14px;color:var(--ink-soft);font-size:.95rem;line-height:1.8}
  .soil-home-card .shc-src{font-size:.78rem;color:var(--ink-soft);margin-top:10px}
  .soil-home-card .shc-actions{display:flex;gap:8px;flex-wrap:wrap}
  @media(max-width:640px){
    .soil-home-card{grid-template-columns:1fr}
    .soil-home-card svg{max-width:150px;margin:0 auto;order:-1}
  }
  @media (prefers-reduced-motion:reduce){
    .soil-home-card{transition:none}.soil-home-card:hover{transform:none}
  }`,document.head.appendChild(e)}const Ue=`
<svg viewBox="0 0 180 200" role="img" aria-label="مخطط أطوار التربة: هواء وماء وحبيبات صلبة" style="width:100%;height:auto;direction:ltr;">
  <rect x="40" y="10"  width="90" height="40" fill="var(--violet-50)"  stroke="var(--violet-300)" stroke-width="1.5"/>
  <rect x="40" y="50"  width="90" height="50" fill="var(--violet-100)" stroke="var(--violet-300)" stroke-width="1.5"/>
  <rect x="40" y="100" width="90" height="90" fill="var(--violet-300)" stroke="var(--violet-600)" stroke-width="1.5"/>
  <text x="85" y="34"  text-anchor="middle" font-size="12" fill="var(--violet-800)">Air</text>
  <text x="85" y="79"  text-anchor="middle" font-size="12" fill="var(--violet-800)">Water</text>
  <text x="85" y="150" text-anchor="middle" font-size="12" fill="var(--violet-800)">Solids</text>
  <text x="138" y="34"  font-size="12" fill="var(--ink-soft)">Va</text>
  <text x="138" y="79"  font-size="12" fill="var(--ink-soft)">Vw</text>
  <text x="138" y="150" font-size="12" fill="var(--ink-soft)">Vs</text>
  <text x="32" y="79"  text-anchor="end" font-size="12" fill="var(--ink-soft)">Ww</text>
  <text x="32" y="150" text-anchor="end" font-size="12" fill="var(--ink-soft)">Ws</text>
</svg>`;function Ge(){He();const e=document.createElement("div");return e.className="soil-home-card",e.innerHTML=`
    <div>
      <h3>ميكانيك التربة</h3>
      <p>حاسبة ذكية لعلاقات الأطوار وحدود أتربرغ، وتحليل حبيبي بمنحنى التدرج، وكشف نوع التربة
         (USCS وAASHTO وUSDA) بمخططات متحركة من أول الشجرة إلى اسم التربة.</p>
      <div class="shc-actions">
        <a class="btn btn-primary btn-sm" href="#/soil">فتح الوحدة</a>
        <a class="btn btn-secondary btn-sm" href="#/soil?tab=detect">كشف نوع التربة</a>
      </div>
      <div class="shc-src">مبنية حرفياً من المحاضرة، ص1 إلى ص45</div>
    </div>
    ${Ue}`,e}function X(){return`
    <svg viewBox="0 0 400 240" width="100%" height="240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- شبكة رسم هندسي خفيفة -->
      <pattern id="diag-grid-1" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--line)" stroke-width="0.8"/>
      </pattern>
      <rect width="400" height="240" fill="url(#diag-grid-1)" rx="8" stroke="var(--line-strong)" stroke-width="1"/>

      <!-- الحمل الموزع المنتظم w -->
      <line x1="60" y1="36" x2="340" y2="36" stroke="var(--violet-600)" stroke-width="2" />
      ${[60,100,140,180,220,260,300,340].map(e=>`
        <line x1="${e}" y1="36" x2="${e}" y2="60" stroke="var(--violet-600)" stroke-width="1.5" />
        <polygon points="${e-3},56 ${e+3},56 ${e},62" fill="var(--violet-600)" />
      `).join("")}
      <text x="200" y="26" font-family="var(--font-mono)" font-size="12" font-weight="600" fill="var(--violet-700)" text-anchor="middle">الحمل الموزع w = q</text>

      <!-- العتبة -->
      <rect x="60" y="64" width="280" height="14" rx="2" fill="var(--violet-100)" stroke="var(--ink)" stroke-width="2" />

      <!-- الركائز: ركيزة مفصلية (يسار) وركيزة منزلقة (يمين) -->
      <!-- مفصلية Pin -->
      <polygon points="60,78 50,96 70,96" fill="none" stroke="var(--ink)" stroke-width="2" />
      <line x1="44" y1="96" x2="76" y2="96" stroke="var(--ink)" stroke-width="2" />

      <!-- منزلقة Roller -->
      <polygon points="340,78 330,94 350,94" fill="none" stroke="var(--ink)" stroke-width="2" />
      <circle cx="334" cy="98" r="3" fill="none" stroke="var(--ink)" stroke-width="1.5"/>
      <circle cx="346" cy="98" r="3" fill="none" stroke="var(--ink)" stroke-width="1.5"/>
      <line x1="324" y1="102" x2="356" y2="102" stroke="var(--ink)" stroke-width="2" />

      <!-- خط البعد لطول العتبة L -->
      <line x1="60" y1="114" x2="340" y2="114" stroke="var(--line-strong)" stroke-width="1.2" stroke-dasharray="3 3"/>
      <line x1="60" y1="108" x2="60" y2="120" stroke="var(--line-strong)" stroke-width="1.2"/>
      <line x1="340" y1="108" x2="340" y2="120" stroke="var(--line-strong)" stroke-width="1.2"/>
      <text x="200" y="128" font-family="var(--font-mono)" font-size="12" fill="var(--ink-soft)" text-anchor="middle">الطول L</text>

      <!-- مخطط عزم الانحناء (BMD) -->
      <line x1="60" y1="160" x2="340" y2="160" stroke="var(--ink-muted)" stroke-width="1"/>
      <path d="M 60 160 Q 200 220 340 160" fill="rgba(102, 54, 204, 0.08)" stroke="var(--violet-600)" stroke-width="2.5" />
      <text x="200" y="195" font-family="var(--font-mono)" font-size="12" font-weight="700" fill="var(--violet-800)" text-anchor="middle">M_max = w·L² / 8</text>
      <text x="200" y="152" font-family="var(--font-mono)" font-size="10" fill="var(--ink-muted)" text-anchor="middle">[مخطط عزم الانحناء BMD]</text>
    </svg>
  `}function ee(){return`
    <svg viewBox="0 0 320 240" width="100%" height="240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <pattern id="diag-grid-2" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--line)" stroke-width="0.8"/>
      </pattern>
      <rect width="320" height="240" fill="url(#diag-grid-2)" rx="8" stroke="var(--line-strong)" stroke-width="1"/>

      <!-- المقطع الخرساني المستطيل (b × h) -->
      <rect x="90" y="30" width="140" height="170" fill="var(--violet-50)" stroke="var(--ink)" stroke-width="2.5" rx="4" />

      <!-- كانة التسليح العرضية (Stirrup) -->
      <rect x="105" y="45" width="110" height="140" fill="none" stroke="var(--violet-500)" stroke-width="2" rx="6" />

      <!-- قضبان التسليح السفلية الرئيسية (3 قضبان) -->
      <circle cx="120" cy="170" r="7" fill="var(--violet-700)" stroke="var(--ink)" stroke-width="1.5"/>
      <circle cx="160" cy="170" r="7" fill="var(--violet-700)" stroke="var(--ink)" stroke-width="1.5"/>
      <circle cx="200" cy="170" r="7" fill="var(--violet-700)" stroke="var(--ink)" stroke-width="1.5"/>

      <!-- قضبان التعليق العلوية (قضيبين) -->
      <circle cx="120" cy="60" r="5" fill="var(--violet-300)" stroke="var(--ink)" stroke-width="1.5"/>
      <circle cx="200" cy="60" r="5" fill="var(--violet-300)" stroke="var(--ink)" stroke-width="1.5"/>

      <!-- أبعاد العرض b -->
      <line x1="90" y1="215" x2="230" y2="215" stroke="var(--line-strong)" stroke-width="1.2" stroke-dasharray="3 2"/>
      <line x1="90" y1="210" x2="90" y2="220" stroke="var(--line-strong)" stroke-width="1.2"/>
      <line x1="230" y1="210" x2="230" y2="220" stroke="var(--line-strong)" stroke-width="1.2"/>
      <text x="160" y="228" font-family="var(--font-mono)" font-size="11" fill="var(--ink-soft)" text-anchor="middle">العرض b</text>

      <!-- أبعاد الارتفاع h -->
      <line x1="65" y1="30" x2="65" y2="200" stroke="var(--line-strong)" stroke-width="1.2" stroke-dasharray="3 2"/>
      <line x1="60" y1="30" x2="70" y2="30" stroke="var(--line-strong)" stroke-width="1.2"/>
      <line x1="60" y1="200" x2="70" y2="200" stroke="var(--line-strong)" stroke-width="1.2"/>
      <text x="50" y="118" font-family="var(--font-mono)" font-size="11" fill="var(--ink-soft)" text-anchor="middle">الارتفاع h</text>

      <!-- مؤشر التسليح -->
      <text x="250" y="174" font-family="var(--font-mono)" font-size="11" font-weight="600" fill="var(--violet-700)">As (رئيسي)</text>
      <line x1="208" y1="170" x2="242" y2="170" stroke="var(--violet-600)" stroke-width="1.2"/>
    </svg>
  `}function te(){return`
    <svg viewBox="0 0 340 240" width="100%" height="240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <pattern id="diag-grid-3" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--line)" stroke-width="0.8"/>
      </pattern>
      <rect width="340" height="240" fill="url(#diag-grid-3)" rx="8" stroke="var(--line-strong)" stroke-width="1"/>

      <!-- الجدار الاستنادي الكابولي (Stem & Footing) -->
      <polygon points="120,40 138,40 144,180 80,180 80,200 200,200 200,180 144,180" fill="var(--violet-100)" stroke="var(--ink)" stroke-width="2" />

      <!-- خط منسوب الردم الترابي (Ground Surface) -->
      <line x1="138" y1="40" x2="300" y2="40" stroke="var(--ink)" stroke-width="2"/>
      ${[160,190,220,250,280].map(e=>`
        <line x1="${e}" y1="40" x2="${e-10}" y2="50" stroke="var(--ink-muted)" stroke-width="1.5"/>
      `).join("")}

      <!-- مثلث ضغط التربة الفعال (Active Earth Pressure Triangle) -->
      <polygon points="144,40 144,180 230,180" fill="rgba(102, 54, 204, 0.12)" stroke="var(--violet-600)" stroke-width="2" />
      
      <!-- أسهم توزيع الضغط -->
      ${[75,110,145,175].map((e,t)=>{const r=(t+1)*20;return`
          <line x1="144" y1="${e}" x2="${144+r}" y2="${e}" stroke="var(--violet-600)" stroke-width="1.5"/>
          <polygon points="${144+r-4},${e-3} ${144+r-4},${e+3} ${144+r},${e}" fill="var(--violet-600)"/>
        `}).join("")}

      <text x="240" y="195" font-family="var(--font-mono)" font-size="11" font-weight="600" fill="var(--violet-800)">pa = Ka·γ·H</text>
      <text x="185" y="115" font-family="var(--font-mono)" font-size="10" fill="var(--violet-700)">Pa (المحصلة)</text>
    </svg>
  `}function We({navigate:e}){const t=document.createElement("div");t.className="container page-container",t.style.padding="40px 20px 100px";const r=p.getHomeSections();if(r.length&&!r.some(n=>n.type==="modules")){const n=r.find(c=>c.type==="stats")||r.find(c=>c.type==="hero");p.saveHomeSections([...r,{id:"sec-modules",type:"modules",enabled:!0,order:(n?n.order:0)+.5,title:"وحدات متخصصة"}])}const o=p.getHomeSections().filter(n=>n.enabled!==!1).sort((n,c)=>(n.order||0)-(c.order||0)),i=p.getFormulas(),s=p.getCategories(),a=p.getSources(),d=p.getTables(),m=p.getConstants(),l=p.getSettings(),g={hero:n=>`
      <section class="hero-section" id="main-hero" style="position: relative; overflow: hidden; border-radius: var(--radius-lg); border: 1px solid var(--line); padding: 50px 24px; margin-bottom: 50px; background-color: var(--bg-soft); text-align: center;">
                ${l.heroBackgroundAssetIds&&l.heroBackgroundAssetIds[0]?`
          <img data-asset-id="${l.heroBackgroundAssetIds[0]}" alt="" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;" />
          <div style="position:absolute; inset:0; background:rgba(245,241,254,${l.heroOverlayOpacity??.55});"></div>`:""}
      <div class="hero-blueprint-bg">
          <svg class="hero-grid-svg" viewBox="0 0 1000 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="main-hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--line)" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#main-hero-grid)" />
            <line x1="120" y1="0" x2="120" y2="400" class="hero-grid-accent" />
            <line x1="0" y1="180" x2="1000" y2="180" class="hero-grid-accent" />
            <g class="grid-cross" transform="translate(120, 180)">
              <circle cx="0" cy="0" r="4" fill="var(--violet-600)"/>
              <circle cx="0" cy="0" r="14" fill="none" stroke="var(--violet-500)" stroke-width="1.2" stroke-dasharray="2 2"/>
            </g>
          </svg>
        </div>

        <div style="position: relative; z-index: 1; max-width: 760px; margin: 0 auto;">
          <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 18px;">
            <span class="badge badge-category">منصة هندسية مفتوحة</span>
            <span class="badge badge-published">نظام حاسبات قابل للتوسعة</span>
          </div>

          <div style="display: flex; justify-content: center; margin-bottom: 20px;">
            ${F({showTagline:!1,size:"large"})}
          </div>

          <h1 style="font-size: 2.2rem; margin-bottom: 16px; font-weight: 700; color: var(--ink);">
            ${n.title||l.siteName||"حاسبات ومعادلات هندسية مرجعية"}
          </h1>
          <p style="font-size: 1.05rem; line-height: 1.8; color: var(--ink-soft); margin-bottom: 30px; max-width: 640px; margin-inline: auto;">
            ${l.tagline||"أداة حسابية هندسية دقيقة للمهندس والباحث المدني. إدخال قيم، خطوات حل موثقة، ومراجع معيارية بدون تعقيد."}
          </p>

          <!-- شريط البحث السريع -->
          <div style="max-width: 520px; margin: 0 auto 20px;">
            <form id="hero-search-form" style="display: flex; gap: 8px;">
              <input 
                type="text" 
                id="hero-search-input" 
                class="form-input" 
                placeholder="ابحث عن معادلة (مثال: عزم، إجهاد، هطول، خرسانة)..." 
                style="padding: 12px 16px; font-size: 1rem; border-radius: var(--radius); box-shadow: 0 2px 8px rgba(63,31,138,0.06);"
              />
              <button type="submit" class="btn btn-primary" style="padding: 0 22px;">بحث</button>
            </form>
          </div>
        </div>
      </section>
    `,stats:n=>`
      <section class="reveal" style="margin-bottom: 50px;">
        <div style="margin-bottom: 16px;">
          ${x(n.title||"الإحصائيات السريعة للنظام",320)}
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div class="card" style="text-align: center; padding: 22px;">
            <div style="font-size: 2.3rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);" 
                 data-countup="${i.length}" data-duration="900">${i.length}</div>
            <div style="font-size: 0.88rem; color: var(--ink-soft); margin-top: 4px;">معادلة هندسية</div>
          </div>
          <div class="card" style="text-align: center; padding: 22px;">
            <div style="font-size: 2.3rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);" 
                 data-countup="${a.length}" data-duration="900">${a.length}</div>
            <div style="font-size: 0.88rem; color: var(--ink-soft); margin-top: 4px;">مرجعاً وكوداً معتمداً</div>
          </div>
          <div class="card" style="text-align: center; padding: 22px;">
            <div style="font-size: 2.3rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);" 
                 data-countup="${d.length+m.length}" data-duration="1000">${d.length+m.length}</div>
            <div style="font-size: 0.88rem; color: var(--ink-soft); margin-top: 4px;">ثوابت وجداول مرجعية</div>
          </div>
          <div class="card" style="text-align: center; padding: 22px;">
            <div style="font-size: 2.3rem; font-weight: 700; font-family: var(--font-mono); color: var(--violet-700);" 
                 data-countup="${s.length}" data-duration="800">${s.length}</div>
            <div style="font-size: 0.88rem; color: var(--ink-soft); margin-top: 4px;">تصنيفات معتمدة</div>
          </div>
        </div>
      </section>
    `,modules:n=>`
      <section class="reveal" style="margin-bottom: 50px;">
        <div style="margin-bottom: 16px;">
          ${x(n.title||"وحدات متخصصة",320)}
        </div>
        <div data-modules-slot></div>
      </section>
    `,categories:n=>`
      <section class="reveal" style="margin-bottom: 50px;">
        <div style="margin-bottom: 16px;">
          ${x(n.title||"التصنيفات الهندسية المعتمدة",320)}
        </div>
        <div class="stagger-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
          ${s.map(c=>`
            <a href="#/library?category=${c.id}" class="card card-interactive reveal-item" style="text-decoration: none;">
              <div class="card-header">
                <span class="badge badge-category">${c.title}</span>
              </div>
              <p class="card-desc" style="font-size: 0.88rem; margin: 0;">${c.description||"تصفح المعادلات التابعة لهذا القسم."}</p>
            </a>
          `).join("")}
        </div>
      </section>
    `,"latest-formulas":n=>`
      <section class="reveal" style="margin-bottom: 50px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>${x(n.title||"أحدث المعادلات المضافة",320)}</div>
          <a href="#/library" class="btn btn-secondary btn-sm">عرض كل المعادلات ←</a>
        </div>
        <div class="stagger-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          ${i.slice(0,6).map(c=>{const y=s.find(k=>k.id===c.categoryId);return`
              <div class="card card-interactive reveal-item" onclick="window.location.hash = '#/calc/${c.id}'">
                <div class="card-header">
                  <span class="badge badge-category">${y?y.title:"عام"}</span>
                  ${c.isSample?'<span class="badge badge-sample">تجريبي</span>':""}
                </div>
                <h3 class="card-title">${c.title}</h3>
                <p class="card-desc">${c.description||"معادلة حسابية موثقة."}</p>
                <div class="card-footer">
                  <span style="font-family: var(--font-mono); color: var(--violet-600); font-weight: 500;">
                    ${c.outputs&&c.outputs[0]?`${c.outputs[0].key} = ${c.outputs[0].expression}`:""}
                  </span>
                  <span style="color: var(--ink-soft); font-size: 0.82rem;">${(c.inputs||[]).length} مدخلات</span>
                </div>
              </div>
            `}).join("")}
        </div>
      </section>
    `,gallery:n=>`
      <section class="reveal" style="margin-bottom: 50px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>${x(n.title||"معرض المخططات والرسومات الهندسية",360)}</div>
          <span style="font-size: 0.82rem; color: var(--ink-muted);">انقر على المخطط للتكبير والفحص</span>
        </div>
        <div class="stagger-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <!-- مخطط 1: العتبة والعزوم -->
          <div class="card card-interactive reveal-item btn-zoom-diagram" data-diagram="beam" style="padding: 16px;">
            <div style="border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 12px; background: #fff;">
              ${X()}
            </div>
            <div style="font-weight: 600; font-size: 0.95rem; color: var(--ink); margin-bottom: 4px;">عتبة بسيطة الإسناد ومخطط العزوم BMD</div>
            <div style="font-size: 0.82rem; color: var(--ink-soft);">توزيع الحمل المنتظم وقيمة العزم الأقصى في المنتصف wL²/8.</div>
          </div>

          <!-- مخطط 2: مقطع الخرسانة المسلحة -->
          <div class="card card-interactive reveal-item btn-zoom-diagram" data-diagram="concrete" style="padding: 16px;">
            <div style="border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 12px; background: #fff;">
              ${ee()}
            </div>
            <div style="font-weight: 600; font-size: 0.95rem; color: var(--ink); margin-bottom: 4px;">مقطع عرضي لجسور الخرسانة المسلحة</div>
            <div style="font-size: 0.82rem; color: var(--ink-soft);">تفاصيل كانات القص وتسليح الشد السفلي والتعليق العلوي.</div>
          </div>

          <!-- مخطط 3: ضغط التربة الجدار الاستنادي -->
          <div class="card card-interactive reveal-item btn-zoom-diagram" data-diagram="soil" style="padding: 16px;">
            <div style="border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 12px; background: #fff;">
              ${te()}
            </div>
            <div style="font-weight: 600; font-size: 0.95rem; color: var(--ink); margin-bottom: 4px;">مثلث ضغط التربة الجانبي الفعال</div>
            <div style="font-size: 0.82rem; color: var(--ink-soft);">حساب محصلة الضغط Pa على الجدران الاستنادية الكابولية.</div>
          </div>
        </div>
      </section>
    `,about:n=>`
      <section class="reveal" style="margin-bottom: 50px;">
        <div style="margin-bottom: 16px;">
          ${x(n.title||"عن موقع المهندس الصغير",280)}
        </div>
        <div class="card" style="padding: 30px; background-color: var(--bg-soft);">
          <div style="max-width: 780px;">
            <h3 style="font-size: 1.25rem; color: var(--violet-900); margin-bottom: 12px;">منصة عربية للمهندس والباحث الإنشائي</h3>
            <p style="font-size: 0.95rem; line-height: 1.8; color: var(--ink-soft); margin-bottom: 20px;">
              صُمم «المهندس الصغير» ليكون أكثر من مجرد آلة حاسبة رقمية؛ إنه مرجع عملي يوضح خطوات التعويض الحسابي والرياضي، ويوثق المرجع الأكاديمي أو البند المعياري لكل معادلة، مع معمارية ثابتة خفيفة تتيح إضافة المعادلات والمراجع محلياً وتحديثها مجاناً.
            </p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <a href="#/about" class="btn btn-secondary btn-sm">قراءة المزيد عن الموقع والمنهجية ←</a>
              <a href="#/admin" class="btn btn-ghost btn-sm" style="color: var(--violet-700);">دخول لوحة التحكم المشرف</a>
            </div>
          </div>
        </div>
      </section>
    `,"sources-preview":n=>`
      <section class="reveal" style="margin-bottom: 50px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>${x(n.title||"المصادر والمراجع المعتمدة",320)}</div>
          <a href="#/sources" class="btn btn-secondary btn-sm">عرض كل المصادر ←</a>
        </div>
        <div class="stagger-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          ${a.map(c=>`
            <div class="card">
              <div class="card-header">
                <span class="badge badge-category">${c.edition||"مرجع معتمد"}</span>
              </div>
              <h4 style="font-size: 1.05rem; margin-bottom: 6px; color: var(--ink);">${c.title}</h4>
              <div style="font-size: 0.85rem; color: var(--ink-soft);">${c.author||""}</div>
            </div>
          `).join("")}
        </div>
      </section>
    `,"custom-text":n=>`
      <section class="reveal" style="margin-bottom: 50px;">
        <div class="card" style="padding: 24px; border-right: 4px solid var(--violet-600);">
          <h3 style="font-size: 1.1rem; color: var(--ink); margin-bottom: 8px;">${n.title||"تنويه هندسي"}</h3>
          <p style="font-size: 0.92rem; color: var(--ink-soft); margin: 0; line-height: 1.7;">${n.content||""}</p>
        </div>
      </section>
    `};t.innerHTML=o.map(n=>{const c=g[n.type];return c?c(n):""}).join(""),t.querySelectorAll("[data-modules-slot]").forEach(n=>{n.appendChild(Ge())});const v=t.querySelector("#hero-search-form");v&&v.addEventListener("submit",n=>{n.preventDefault();const c=t.querySelector("#hero-search-input").value.trim();e(c?`/library?q=${encodeURIComponent(c)}`:"/library")});const h=t.querySelector("#main-hero");return h&&Ve(h),t.querySelectorAll(".btn-zoom-diagram").forEach(n=>{n.addEventListener("click",()=>{const c=n.getAttribute("data-diagram");let y="معاينة المخطط الهندسي",k="";c==="beam"?(y="عتبة بسيطة الإسناد ومخطط العزم BMD",k=X()):c==="concrete"?(y="مقطع عرضي لعتبة خرسانية مسلحة وتفاصيل التسليح",k=ee()):c==="soil"&&(y="مثلث ضغط التربة الجانبي الفعال على جدار استنادي",k=te()),qe({title:y,content:`
          <div style="padding: 10px; text-align: center;">
            <div style="max-width: 520px; margin: 0 auto; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: #fff;">
              ${k}
            </div>
            <p style="margin-top: 14px; font-size: 0.85rem; color: var(--ink-soft); text-align: right; line-height: 1.6;">
              رسم تخطيطي هندسي ناقل للمتغيرات والمعادلات المعتمدة في كودات التصميم الإنشائي.
            </p>
          </div>
        `,confirmText:"إغلاق",showFooter:!1})})}),requestAnimationFrame(()=>{je(t)}),t}const le={"٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9"},Je=/[\u064B-\u065F\u0670\u0640]/g;function re(e){if(!e||typeof e!="string")return"";let t=e.trim().toLowerCase();return t=t.replace(Je,""),t=t.replace(/[أإآٱ]/g,"ا"),t=t.replace(/ؤ/g,"و"),t=t.replace(/ئ/g,"ي"),t=t.replace(/ة/g,"ه"),t=t.replace(/ى/g,"ي"),t=t.replace(/[٠-٩۰-۹]/g,r=>le[r]||r),t=t.replace(/\s+/g," "),t}function Ze(e,t){if(!t||!t.trim())return!0;if(!e||typeof e!="string")return!1;const r=re(e);return re(t).split(" ").filter(Boolean).every(s=>r.includes(s))}function ut(e){if(e==null)return"";let t=String(e).trim();return t=t.replace(/[٠-٩۰-۹]/g,r=>le[r]||r),t=t.replace(/\u066C/g,""),t=t.replace(/\u066B/g,"."),t.includes(",")&&!t.includes(".")&&(t=t.replace(",",".")),t}async function de(e){var r;const t=e.querySelectorAll("img[data-asset-id]");for(const o of t){if(o.dataset.hydrated)continue;o.dataset.hydrated="1";const i=o.getAttribute("data-asset-id");try{const s=await p.getMediaAsset(i);s&&(s.thumbUrl||s.dataUrl)?(o.src=s.thumbUrl||s.dataUrl,o.alt=s.alt||s.name||"",(r=o.closest(".asset-cover"))==null||r.classList.add("is-loaded")):o.remove()}catch{o.remove()}}}function Ye(e){return`
    <div class="asset-cover" style="height: 130px; margin: -4px -4px 12px; border-radius: var(--radius-sm); overflow: hidden; background: var(--violet-50); position: relative;">
      
    <svg viewBox="0 0 200 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="200" height="100" fill="#F5F1FE"/>
      <path d="M0 20H200M0 40H200M0 60H200M0 80H200M40 0V100M80 0V100M120 0V100M160 0V100" stroke="#D8C9F8" stroke-width="0.6"/>
      <path d="M30 75L100 25L170 75Z" fill="none" stroke="#7B4FE0" stroke-width="1.2"/>
    </svg>
      ${e?`<img data-asset-id="${e}" alt="" loading="lazy" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; background: var(--violet-50);" />`:""}
    </div>`}function Ke({query:e={},navigate:t}){const r=document.createElement("div");r.className="container page-container",r.style.padding="40px 20px 100px";const o=p.getFormulas(),i=p.getCategories();let s=e.category||"all",a=e.q||"";function d(){var h;const l=r.querySelector("#formulas-list"),g=r.querySelector("#formulas-count");if(!l)return;const v=o.filter(n=>{const c=s==="all"||n.categoryId===s,y=`${n.title} ${n.description||""} ${(n.tags||[]).join(" ")}`,k=Ze(y,a);return c&&k});if(g&&(g.textContent=`${v.length} معادلة`),v.length===0){l.innerHTML=`
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
      `,(h=l.querySelector("#btn-reset-filters"))==null||h.addEventListener("click",()=>{s="all",a="",r.querySelector("#search-input").value="",r.querySelectorAll(".cat-pill").forEach(n=>n.classList.toggle("btn-primary",n.dataset.cat==="all")),d()});return}l.innerHTML=v.map(n=>{const c=i.find(y=>y.id===n.categoryId);return`
        <div class="card card-interactive" onclick="window.location.hash = '#/calc/${n.id}'">
          ${Ye(n.coverAssetId)}
          <div class="card-header">
            <span class="badge badge-category">${c?c.title:"عام"}</span>
            ${n.isSample?'<span class="badge badge-sample">تجريبي</span>':""}
          </div>
          <h3 class="card-title">${n.title}</h3>
          <p class="card-desc">${n.description||"معادلة حسابية موثقة."}</p>
          <div class="card-footer">
            <span style="font-family: var(--font-mono); color: var(--violet-600); font-weight: 500;">
              ${n.outputs&&n.outputs[0]?`${n.outputs[0].key} = ${n.outputs[0].expression}`:""}
            </span>
            <span style="color: var(--ink-soft); font-size: 0.82rem;">${(n.inputs||[]).length} مدخلات</span>
          </div>
        </div>
      `}).join(""),de(l)}r.innerHTML=`
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
          ${o.length} معادلة
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
          value="${a}" 
          style="padding: 10px 16px;"
        />
      </div>

      <!-- فلاتر التصنيفات -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <span style="font-size: 0.85rem; color: var(--ink-soft); margin-left: 6px;">التصنيف:</span>
        <button class="btn btn-sm cat-pill ${s==="all"?"btn-primary":"btn-secondary"}" data-cat="all">
          الكل (${o.length})
        </button>
        ${i.map(l=>{const g=o.filter(h=>h.categoryId===l.id).length;return`
            <button class="btn btn-sm cat-pill ${s===l.id?"btn-primary":"btn-secondary"}" data-cat="${l.id}">
              ${l.title} (${g})
            </button>
          `}).join("")}
      </div>
    </div>

    <!-- شبكة المعادلات -->
    <div id="formulas-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;"></div>
  `;const m=r.querySelector("#search-input");return m&&m.addEventListener("input",l=>{a=l.target.value.trim(),d()}),r.querySelectorAll(".cat-pill").forEach(l=>{l.addEventListener("click",()=>{s=l.getAttribute("data-cat"),r.querySelectorAll(".cat-pill").forEach(g=>{const v=g===l;g.classList.toggle("btn-primary",v),g.classList.toggle("btn-secondary",!v)}),d()})}),d(),r}function Qe({navigate:e}){const t=document.createElement("div");t.className="container page-container",t.style.padding="40px 20px 100px";const r=p.getTables(),o=p.getConstants();return t.innerHTML=`
    <!-- ترويسة الصفحة -->
    <div style="border-bottom: 1px solid var(--line); padding-bottom: 24px; margin-bottom: 40px;">
      <div class="badge badge-category" style="margin-bottom: 10px;">المراجع والمعايير</div>
      <h1 style="font-size: 2rem; margin-bottom: 8px;">الجداول والثوابت المرجعية</h1>
      <p style="margin: 0; font-size: 0.95rem; color: var(--ink-soft);">
        جداول خواص المواد والمعايير الهندسية المعمول بها، بالإضافة إلى الثوابت الفيزيائية التي تعتمد عليها حاسبات الموقع.
      </p>
    </div>

    <!-- قسم الثوابت الرياضية والهندسية -->
    <section style="margin-bottom: 50px;">
      <div style="margin-bottom: 16px;">
        ${x("الثوابت الفيزيائية والرياضية",320)}
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        ${o.map(i=>`
          <div class="card">
            <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 1.05rem; font-weight: 600; color: var(--ink);">${i.label||i.key}</span>
              <code style="font-size: 1.25rem; font-weight: 700; color: var(--violet-700);">${i.key} = ${i.value} ${i.unit||""}</code>
            </div>
            <p style="font-size: 0.85rem; color: var(--ink-soft); margin: 0;">${i.description||"ثابت معتمد في حسابات النظام."}</p>
          </div>
        `).join("")}
      </div>
    </section>

    <!-- قسم الجداول المرجعية -->
    <section>
      <div style="margin-bottom: 16px;">
        ${x("الجداول المرجعية للمواد (Lookup Tables)",380)}
      </div>
      
      ${r.map(i=>`
        <div class="card" style="margin-bottom: 30px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
            <div>
              <h3 style="font-size: 1.2rem; color: var(--violet-800); margin-bottom: 4px;">${i.title}</h3>
              <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--ink-muted);">معرف الجدول: ${i.id}</span>
            </div>
            <span class="badge badge-published">${(i.rows||[]).length} صفوف</span>
          </div>

          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  ${(i.columns||[]).map(s=>`
                    <th>${s.label||s.key} ${s.unit?`[${s.unit}]`:""}</th>
                  `).join("")}
                </tr>
              </thead>
              <tbody>
                ${(i.rows||[]).map(s=>`
                  <tr>
                    ${(i.columns||[]).map((a,d)=>`
                      <td class="${a.type==="number"?"font-mono":""}" style="${d===0?"font-weight: 600;":""}">
                        ${s[a.key]!==void 0?s[a.key]:"—"}
                      </td>
                    `).join("")}
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `).join("")}
    </section>
  `,t}function Xe({navigate:e}){const t=document.createElement("div");t.className="container page-container",t.style.padding="40px 20px 100px";const r=p.getSources(),o=p.getFormulas();return t.innerHTML=`
    <!-- ترويسة الصفحة -->
    <div style="border-bottom: 1px solid var(--line); padding-bottom: 24px; margin-bottom: 40px;">
      <div class="badge badge-category" style="margin-bottom: 10px;">التوثيق العلمي</div>
      <h1 style="font-size: 2rem; margin-bottom: 8px;">المصادر والمراجع والأكواد الهندسية</h1>
      <p style="margin: 0; font-size: 0.95rem; color: var(--ink-soft);">
        قائمة الكتب الأكاديمية والأكواد الإنشائية المعتمدة التي تستند إليها معادلات وحسابات «المهندس الصغير».
      </p>
    </div>

    <!-- شبكة بطاقات المصادر -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
      ${r.map(i=>{const s=o.filter(a=>a.sourceIds&&a.sourceIds.includes(i.id));return`
          <div class="card">
            <div class="card-header">
              <span class="badge badge-category">${i.edition||"مرجع معتمد"}</span>
              <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--ink-muted);">${i.id}</span>
            </div>
            <h3 class="card-title">${i.title}</h3>
            <div style="font-size: 0.88rem; color: var(--ink-soft); margin-bottom: 12px;">
              المؤلف / الجهة: <strong>${i.author||"غير محدد"}</strong>
            </div>
            ${i.pages?`
              <div style="font-size: 0.85rem; color: var(--violet-800); background-color: var(--violet-50); border: 1px solid var(--violet-100); padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 16px;">
                ${i.pages}
              </div>
            `:""}

            <div class="card-footer" style="flex-direction: column; align-items: flex-start; gap: 8px;">
              <span style="font-size: 0.82rem; font-weight: 600; color: var(--ink);">المعادلات المرتبطة بهذا المرجع (${s.length}):</span>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                ${s.length>0?s.map(a=>`
                  <a href="#/calc/${a.id}" class="badge badge-draft" style="text-decoration: none;">${a.title}</a>
                `).join(""):'<span style="font-size: 0.8rem; color: var(--ink-muted);">لا توجد معادلات مرتبطة حالياً.</span>'}
              </div>
            </div>
          </div>
        `}).join("")}
    </div>
  `,t}function et({navigate:e}){const t=document.createElement("div");return t.className="container page-container",t.style.padding="40px 20px 100px",t.innerHTML=`
    <!-- ترويسة الصفحة -->
    <div style="border-bottom: 1px solid var(--line); padding-bottom: 24px; margin-bottom: 40px; text-align: center;">
      <div style="display: flex; justify-content: center; margin-bottom: 16px;">
        ${F({showTagline:!1,size:"large"})}
      </div>
      <h1 style="font-size: 2.2rem; margin-bottom: 8px;">عن موقع «المهندس الصغير»</h1>
      <p style="margin: 0 auto; max-width: 600px; font-size: 1.05rem; color: var(--ink-soft); line-height: 1.8;">
        منصة حاسبات ومعادلات هندسية عربية مفتوحة المصدر، مبنية بروح ورقة الرسم الهندسي النظيفة.
      </p>
    </div>

    <!-- بطاقات الرؤية والمعمارية -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 40px;">
      <div class="card">
        <h3 style="font-size: 1.15rem; color: var(--violet-800); margin-bottom: 10px;">الرؤية والهدف</h3>
        <p style="font-size: 0.92rem; line-height: 1.7; color: var(--ink-soft); margin: 0;">
          تسهيل الوصول إلى الحسابات الهندسية المدنية اليومية، وإبراز خطوات الحل الرياضي والفيزيائي بالتفصيل وليس مجرد إعطاء ناتج أعمى (Black Box)، مع ربط كل حساب بمرجعه وكوده الأصلي.
        </p>
      </div>

      <div class="card">
        <h3 style="font-size: 1.15rem; color: var(--violet-800); margin-bottom: 10px;">معمارية ثابتة بميزانية صفرية</h3>
        <p style="font-size: 0.92rem; line-height: 1.7; color: var(--ink-soft); margin: 0;">
          الموقع مبني بالكامل كـ Static Site بدون خادم مدفوع. تُدار البيانات محلياً عبر تقنيات المتصفح الحديثة (LocalStorage و IndexedDB)، وتُرفع التحديثات مجاناً عبر GitHub Pages أو Cloudflare Pages.
        </p>
      </div>

      <div class="card">
        <h3 style="font-size: 1.15rem; color: var(--violet-800); margin-bottom: 10px;">محرك حساب رياضي آمن</h3>
        <p style="font-size: 0.92rem; line-height: 1.7; color: var(--ink-soft); margin: 0;">
          يتم تقييم المعادلات بواسطة مكتبة <code>mathjs</code> الموثوقة مع حظر كامل لدوال <code>eval()</code> و <code>new Function()</code>، وتُعرض الصيغ الرياضية بدقة عبر مكتبة <code>KaTeX</code>.
        </p>
      </div>
    </div>

    <!-- صندوق التنويه الهندسي -->
    <div style="padding: 24px; background-color: var(--violet-50); border: 1px solid var(--line); border-right: 4px solid var(--violet-600); border-radius: var(--radius);">
      <h4 style="font-size: 1rem; color: var(--violet-900); margin-bottom: 8px;">إخلاء مسؤولية وتنويه قانوني</h4>
      <p style="font-size: 0.9rem; color: var(--ink-soft); margin: 0; line-height: 1.7;">
        المعادلات والأرقام المتوفرة في الموقع هي أدوات مساعدة للأغراض التعليمية ومراجعة الحسابات الأولية. تقع مسؤولية التحقق والاعتماد النهائي في المشاريع الإنشائية والتنفيذية على عاتق المهندس المصمم المعتمد وفق الكود المحلي الساري.
      </p>
    </div>
  `,t}function tt({path:e,navigate:t}){var o,i;const r=document.createElement("div");return r.className="container",r.style.padding="80px 20px 120px",r.style.textAlign="center",r.innerHTML=`
    <div style="max-width: 580px; margin: 0 auto;">
      <!-- رسم هندسي SVG لمخطط ناقص / مسند وعمود بدون عتبة -->
      <div style="margin-bottom: 28px; display: flex; justify-content: center;">
        <svg viewBox="0 0 320 180" width="300" height="170" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- خلفية شبكية خفيفة للمخطط -->
          <pattern id="nf-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--line)" stroke-width="0.8"/>
          </pattern>
          <rect width="320" height="180" fill="url(#nf-grid)" rx="6" stroke="var(--line-strong)" stroke-width="1.2"/>
          
          <!-- العمود الأيمن -->
          <rect x="50" y="80" width="24" height="80" fill="var(--violet-100)" stroke="var(--violet-600)" stroke-width="2"/>
          <!-- العمود الأيسر -->
          <rect x="246" y="80" width="24" height="80" fill="var(--violet-100)" stroke="var(--violet-600)" stroke-width="2"/>
          
          <!-- مسار العتبة المفقودة (خط متقطع للدلالة على عنصر ناقص) -->
          <rect x="74" y="80" width="172" height="20" fill="none" stroke="var(--violet-400)" stroke-width="1.5" stroke-dasharray="6 4"/>
          
          <!-- خط البعد الهندسي مع علامة استفهام -->
          <line x1="74" y1="55" x2="246" y2="55" stroke="var(--error)" stroke-width="1.5" stroke-dasharray="3 3"/>
          <line x1="74" y1="50" x2="74" y2="60" stroke="var(--error)" stroke-width="1.5"/>
          <line x1="246" y1="50" x2="246" y2="60" stroke="var(--error)" stroke-width="1.5"/>
          
          <!-- وسم 404 الهندسي -->
          <rect x="135" y="40" width="50" height="26" rx="4" fill="var(--error-bg)" stroke="var(--error)" stroke-width="1"/>
          <text x="160" y="58" font-family="var(--font-mono)" font-size="14" font-weight="700" fill="var(--error)" text-anchor="middle">404</text>
          
          <!-- علامة تنبيه هندسية في المنتصف -->
          <text x="160" y="95" font-family="var(--font-mono)" font-size="12" fill="var(--ink-muted)" text-anchor="middle">[عنصر مفقود // MISSING ELEMENT]</text>
        </svg>
      </div>

      <div class="badge badge-sample" style="color: var(--error); border-color: var(--error); background-color: var(--error-bg); margin-bottom: 12px;">
        خطأ 404: مخطط غير مكتمل
      </div>

      <h1 style="font-size: 1.8rem; margin-bottom: 12px; color: var(--ink);">
        الصفحة أو المعادلة المطلوبة غير موجودة
      </h1>

      <p style="font-size: 1rem; line-height: 1.7; color: var(--ink-soft); margin-bottom: 30px;">
        يبدو أن المسار الذي تحاول الوصول إليه (<code>${e||window.location.hash}</code>) غير معرّف في مخططات الموقع، أو تم نقله.
      </p>

      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-primary" id="btn-back-home">
          العودة للرئيسية
        </button>
        <button class="btn btn-secondary" id="btn-search-formulas">
          تصفح مكتبة المعادلات
        </button>
      </div>
    </div>
  `,(o=r.querySelector("#btn-back-home"))==null||o.addEventListener("click",()=>{t("/")}),(i=r.querySelector("#btn-search-formulas"))==null||i.addEventListener("click",()=>{t("/library")}),r}const ie={violet:{label:"بنفسجي (الافتراضي)",vars:{50:"#F5F1FE",100:"#EAE2FC",200:"#D8C9F8",300:"#B9A1F0",500:"#7B4FE0",600:"#6636CC",700:"#522AA6",800:"#3F1F8A"}},blue:{label:"أزرق",vars:{50:"#EEF4FE",100:"#DCE8FD",200:"#BCD3FB",300:"#8FB5F6",500:"#3F7DE8",600:"#1F5FCC",700:"#184BA3",800:"#133B80"}},green:{label:"أخضر زمردي",vars:{50:"#EDF8F3",100:"#D6F0E4",200:"#AEE0C9",300:"#7ACBA8",500:"#2FA877",600:"#1B8A5E",700:"#156F4C",800:"#115A3E"}},orange:{label:"برتقالي محروق",vars:{50:"#FEF3EC",100:"#FCE4D3",200:"#F8C9A7",300:"#F2A672",500:"#E0782F",600:"#C25E1A",700:"#9C4A14",800:"#7C3B10"}},crimson:{label:"عنابي",vars:{50:"#FDF0F2",100:"#FADCE1",200:"#F4B7C1",300:"#EC8798",500:"#D44862",600:"#B52C48",700:"#912239",800:"#741B2E"}}};function oe(){const e=p.getSettings(),t=ie[e.colorPreset]||ie.violet;Object.entries(t.vars).forEach(([r,o])=>document.documentElement.style.setProperty(`--violet-${r}`,o)),document.title=e.siteName||"المهندس الصغير",document.body.classList.toggle("animations-disabled",e.animationsEnabled===!1),rt(e.faviconAssetId)}async function rt(e){let t=document.querySelector('link[rel="icon"]');t||(t=document.createElement("link"),t.rel="icon",document.head.appendChild(t)),t.dataset.default||(t.dataset.default=t.getAttribute("href")||"");let r=null;if(e)try{r=await p.getMediaAsset(e)}catch{}r?(t.href=r.thumbUrl||r.dataUrl,t.type=r.mimeType||"image/png"):t.href=t.dataset.default}function it(){let e=!1;const t=()=>{e=!1,de(document.body)};new MutationObserver(()=>{e||(e=!0,requestAnimationFrame(t))}).observe(document.body,{childList:!0,subtree:!0}),t()}const I=document.querySelector("#app");function ot(){if(!w.seedVersion||p.getSettings().adminPinHash)return;const e="almuhandis_published_seed";localStorage.getItem(e)!==String(w.seedVersion)&&(p.restoreAllData(w),fe(w.modules,"replace"),localStorage.setItem(e,String(w.seedVersion)))}async function st(){if(!I)return;await p.initStore(),oe(),it(),ot(),I.innerHTML="";let e=Y();const t=document.createElement("main");t.id="main-content",t.style.minHeight="calc(100vh - var(--header-height) - 300px)";let r=K();I.appendChild(e),I.appendChild(t),I.appendChild(r),window.addEventListener("site-settings-changed",()=>{oe();const o=Y(),i=K();e.replaceWith(o),r.replaceWith(i),e=o,r=i}),new Fe({rootEl:t,routes:{"/":We,"/library":Ke,"/category/:id":async o=>{const{renderCategoryPage:i}=await C(async()=>{const{renderCategoryPage:s}=await import("./category-DaoNb52v.js");return{renderCategoryPage:s}},[],import.meta.url);return i(o)},"/calc/:id":async o=>{const{renderCalculatorPage:i}=await C(async()=>{const{renderCalculatorPage:s}=await import("./calculator-D1hqwk3L.js");return{renderCalculatorPage:s}},__vite__mapDeps([0,1,2,3,4]),import.meta.url);return i(o)},"/tables":Qe,"/sources":Xe,"/soil":async o=>{const{renderSoilPage:i}=await C(async()=>{const{renderSoilPage:s}=await import("./soil-page-C4D4uXrT.js");return{renderSoilPage:s}},__vite__mapDeps([5,3,6]),import.meta.url);return i(o)},"/about":et,"/design":async o=>{const{renderDesignPage:i}=await C(async()=>{const{renderDesignPage:s}=await import("./design-DWZF9eua.js");return{renderDesignPage:s}},__vite__mapDeps([7,4]),import.meta.url);return i(o)},"/admin":async o=>{const{renderAdminDashboard:i}=await C(async()=>{const{renderAdminDashboard:s}=await import("./dashboard-Qg-cH5i3.js");return{renderAdminDashboard:s}},__vite__mapDeps([8,4,9,6,2,3]),import.meta.url);return i(o)}},notFoundView:tt})}st().catch(console.error);export{ie as C,p as S,ee as a,F as b,x as c,je as d,Re as e,nt as f,fe as g,at as h,Ve as i,H as j,lt as k,we as m,ut as n,qe as o,X as r,dt as s,ct as v};
