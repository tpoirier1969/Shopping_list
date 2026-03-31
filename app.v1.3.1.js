(function () {
  const APP_CONFIG = window.APP_CONFIG || {};
  const SHARED_SCOPE_ID = 'tod-donna-shared';
  const VERSION = 'v1.3.1';

  const CATEGORY_ORDER = [
    'Produce',
    'Deli',
    'Vegan',
    'Meat',
    'Frozen',
    'Gluten Free',
    'Condiments',
    'Canned',
    'Dry Goods',
    'Snacks',
    'Bakery',
    'Beverages',
    'Dairy / Eggs',
    'Cleaning',
    'Paper Products',
    'Pet Supplies',
    'Medicine',
    'Other',
  ];

  const BUILTIN_STORES = [
    { store_key: 'shopping', store_label: 'Groceries', sort_order: 10, is_builtin: true },
    { store_key: 'menards', store_label: 'Menards', sort_order: 20, is_builtin: true },
  ];

  const PARENT_LABELS = {
    poirier: 'P',
    schaffer: 'S',
  };

  const PARENT_TITLES = {
    poirier: 'Poirier',
    schaffer: 'Shafer',
  };

  const NOTE_LANES = [
    { key: 'shared', label: 'Notes' },
    { key: 'donna', label: 'Donna Notes' },
    { key: 'tod', label: 'Tod Notes' },
  ];

  const BUILTIN_RULES = [
    { category: 'Produce', keywords: ['apple', 'apples', 'banana', 'bananas', 'orange', 'oranges', 'lettuce', 'romaine', 'spinach', 'celery', 'carrot', 'carrots', 'onion', 'onions', 'potato', 'potatoes', 'garlic', 'grape', 'grapes', 'broccoli', 'cauliflower', 'pepper', 'peppers', 'tomato', 'tomatoes', 'cucumber', 'cucumbers', 'avocado', 'avocados', 'lime', 'limes', 'lemon', 'lemons', 'salad', 'mushroom', 'mushrooms', 'berries', 'strawberry', 'blueberry'] },
    { category: 'Deli', keywords: ['deli', 'sliced turkey', 'sliced ham', 'provolone', 'swiss slices', 'lunch meat', 'rotisserie', 'prepared salad', 'coleslaw'] },
    { category: 'Vegan', keywords: ['tofu', 'tempeh', 'vegan', 'plant butter', 'plant-based', 'almond yogurt', 'soy yogurt', 'oatmilk creamer', 'vegan cheese'] },
    { category: 'Meat', keywords: ['beef', 'steak', 'hamburger', 'ground beef', 'chicken', 'pork', 'bacon', 'sausage', 'ham', 'turkey', 'salmon', 'fish fillet', 'shrimp'] },
    { category: 'Frozen', keywords: ['frozen', 'ice cream', 'pizza', 'french fries', 'hash browns', 'waffles', 'tv dinner'] },
    { category: 'Gluten Free', keywords: ['gluten free', 'gf bread', 'gf pasta', 'gf crackers', 'gf flour'] },
    { category: 'Condiments', keywords: ['ketchup', 'mustard', 'mayo', 'mayonnaise', 'relish', 'salsa', 'soy sauce', 'vinegar', 'olive oil', 'hot sauce', 'salad dressing', 'bbq sauce', 'jam', 'jelly', 'peanut butter'] },
    { category: 'Canned', keywords: ['canned', 'can of', 'soup', 'broth', 'beans', 'green beans', 'corn', 'peas', 'tuna', 'tomato sauce', 'diced tomatoes', 'crushed tomatoes', 'whole tomatoes', 'spam', 'crushed pineapple', 'pineapple chunks', 'canned pineapple', 'canned peaches', 'sliced peaches', 'canned pears', 'mandarin oranges', 'fruit cup', 'fruit cocktail', 'olives'] },
    { category: 'Dry Goods', keywords: ['flour', 'sugar', 'salt', 'pepper', 'spice', 'seasoning', 'pasta', 'rice', 'oats', 'oatmeal', 'cereal', 'lentils', 'breadcrumbs', 'cracker crumbs', 'yeast', 'baking powder', 'baking soda', 'macaroni'] },
    { category: 'Snacks', keywords: ['chips', 'pretzels', 'popcorn', 'cookies', 'cracker', 'crackers', 'nuts', 'trail mix', 'granola bar', 'bars'] },
    { category: 'Bakery', keywords: ['bread', 'bagel', 'bagels', 'bun', 'buns', 'rolls', 'donut', 'donuts', 'tortilla', 'tortillas', 'muffin', 'muffins'] },
    { category: 'Beverages', keywords: ['coffee', 'tea', 'juice', 'soda', 'sparkling water', 'water', 'milkshake', 'cider', 'gatorade', 'pop'] },
    { category: 'Dairy / Eggs', keywords: ['milk', 'eggs', 'butter', 'cheese', 'cream', 'cream cheese', 'sour cream', 'cottage cheese', 'half and half', 'yogurt'] },
    { category: 'Cleaning', keywords: ['bleach', 'cleaner', 'spray', 'soap', 'dish soap', 'laundry', 'detergent', 'disinfectant', 'trash bags'] },
    { category: 'Paper Products', keywords: ['paper towel', 'paper towels', 'toilet paper', 'tissues', 'napkins', 'paper plates', 'paper cups'] },
    { category: 'Pet Supplies', keywords: ['dog food', 'cat food', 'bird seed', 'pet', 'litter', 'treats', 'chews'] },
    { category: 'Medicine', keywords: ['ibuprofen', 'acetaminophen', 'aspirin', 'bandages', 'vitamin', 'medicine', 'cold meds', 'cough syrup', 'antacid'] },
  ];

  const state = {
    currentTab: 'shopping',
    modalStore: 'shopping',
    items: [],
    rules: [],
    stores: [...BUILTIN_STORES],
    noteItems: [],
    ready: false,
    user: null,
    startupFailed: false,
  };

  const els = {
    modeBadge: document.getElementById('modeBadge'),
    statusBar: document.getElementById('statusBar'),
    tabBar: document.getElementById('tabBar'),
    mainGrid: document.getElementById('mainGrid'),
    floatingAddBtn: document.getElementById('floatingAddBtn'),
    itemModal: document.getElementById('itemModal'),
    modalTitle: document.getElementById('modalTitle'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    cancelModalBtn: document.getElementById('cancelModalBtn'),
    itemForm: document.getElementById('itemForm'),
    itemNameInput: document.getElementById('itemNameInput'),
    parentSelector: document.getElementById('parentSelector'),
    parentPoirier: document.getElementById('parentPoirier'),
    parentSchaffer: document.getElementById('parentSchaffer'),
    categoryPickerWrap: document.getElementById('categoryPickerWrap'),
    categoryPicker: document.getElementById('categoryPicker'),
    storeModal: document.getElementById('storeModal'),
    storeForm: document.getElementById('storeForm'),
    storeNameInput: document.getElementById('storeNameInput'),
    closeStoreModalBtn: document.getElementById('closeStoreModalBtn'),
    cancelStoreModalBtn: document.getElementById('cancelStoreModalBtn'),
  };

  els.categoryPicker.innerHTML = CATEGORY_ORDER
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join('');

  class SupabaseStore {
    async init() {
      if (!APP_CONFIG.supabaseUrl || !APP_CONFIG.supabaseAnonKey) {
        throw new Error('Missing Supabase URL or anon key in config.js');
      }
      this.householdId = SHARED_SCOPE_ID;
      this.client = window.supabase.createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      });
      const { data: sessionData } = await this.client.auth.getSession();
      if (!sessionData?.session) {
        const { error } = await this.client.auth.signInAnonymously();
        if (error) throw new Error(`Anonymous auth failed. Enable Anonymous sign-ins in Supabase Auth. ${error.message}`);
      }
      const { data } = await this.client.auth.getSession();
      state.user = data?.session?.user || null;
      setModeBadge('Supabase shared mode');
      return true;
    }

    async currentUser() {
      return state.user;
    }

    async getItems() {
      const { data, error } = await this.client
        .from('shopping_items')
        .select('*')
        .eq('household_id', this.householdId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    }

    async saveItem(item) {
      const payload = { ...item, household_id: this.householdId };
      delete payload.created_at;
      const { data, error } = await this.client
        .from('shopping_items')
        .upsert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    async getRules() {
      const { data, error } = await this.client
        .from('shopping_rules')
        .select('*')
        .eq('household_id', this.householdId);
      if (error) throw error;
      return data || [];
    }

    async saveRule(rule) {
      const payload = { ...rule, household_id: this.householdId };
      const { data, error } = await this.client
        .from('shopping_rules')
        .upsert(payload, { onConflict: 'household_id,item_key,store' })
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    async getLegacyNote() {
      const { data, error } = await this.client
        .from('shopping_notes')
        .select('*')
        .eq('household_id', this.householdId)
        .limit(1);
      if (error) throw error;
      return data?.[0]?.body || '';
    }

    async saveLegacyNote(body) {
      const payload = { household_id: this.householdId, body, updated_at: new Date().toISOString() };
      const { error } = await this.client
        .from('shopping_notes')
        .upsert(payload, { onConflict: 'household_id' });
      if (error) throw error;
      return body;
    }

    async getNoteItems() {
      const { data, error } = await this.client
        .from('shopping_note_items')
        .select('*')
        .eq('household_id', this.householdId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    }

    async saveNoteItem(note) {
      const payload = { ...note, household_id: this.householdId };
      delete payload.created_at;
      const { data, error } = await this.client
        .from('shopping_note_items')
        .upsert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    async deleteNoteItem(id) {
      const { error } = await this.client
        .from('shopping_note_items')
        .delete()
        .eq('household_id', this.householdId)
        .eq('id', id);
      if (error) throw error;
      return true;
    }

    async getStores() {
      const { data, error } = await this.client
        .from('shopping_stores')
        .select('*')
        .eq('household_id', this.householdId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return mergeStores(data || []);
    }

    async saveStore(storeDef) {
      const payload = { ...storeDef, household_id: this.householdId };
      const { data, error } = await this.client
        .from('shopping_stores')
        .upsert(payload, { onConflict: 'household_id,store_key' })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }

  let store = null;

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeName(value) {
    return String(value || '').toLowerCase().trim().replace(/\s+/g, ' ');
  }

  function slugifyStoreName(value) {
    return normalizeName(value).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
  }

  function makeId() {
    return crypto?.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function mergeStores(remoteStores) {
    const byKey = new Map();
    BUILTIN_STORES.forEach((storeDef) => byKey.set(storeDef.store_key, { ...storeDef }));
    (remoteStores || []).forEach((storeDef) => {
      if (!storeDef?.store_key) return;
      const existing = byKey.get(storeDef.store_key) || {};
      byKey.set(storeDef.store_key, {
        household_id: SHARED_SCOPE_ID,
        store_key: storeDef.store_key,
        store_label: storeDef.store_label || existing.store_label || storeDef.store_key,
        sort_order: Number.isFinite(Number(storeDef.sort_order)) ? Number(storeDef.sort_order) : (existing.sort_order ?? 999),
        is_builtin: Boolean(existing.is_builtin),
        created_at: storeDef.created_at || existing.created_at || null,
      });
    });
    return Array.from(byKey.values()).sort((a, b) => {
      const diff = (a.sort_order ?? 999) - (b.sort_order ?? 999);
      if (diff) return diff;
      return (a.store_label || '').localeCompare(b.store_label || '');
    });
  }

  function getStoreDefs() {
    return mergeStores(state.stores);
  }

  function getStoreTabs() {
    return getStoreDefs().map((entry) => ({ key: entry.store_key, label: entry.store_label, type: 'store' }));
  }

  function getAllTabDefs() {
    return [
      ...getStoreTabs(),
      { key: 'parents', label: 'Parents', type: 'static' },
      { key: 'notes', label: 'Notes', type: 'static' },
      { key: 'removed', label: 'Recently Removed', type: 'static' },
    ];
  }

  function getStoreLabel(storeKey) {
    return getStoreDefs().find((entry) => entry.store_key === storeKey)?.store_label || storeKey;
  }

  function isStoreTab(tabName) {
    return getStoreDefs().some((entry) => entry.store_key === tabName);
  }

  function isShaferTarget(item) {
    return item?.parent_target === 'schaffer' || item?.parent_target === 'shafer';
  }

  function isShoppingStore(item) {
    return item?.store === 'shopping' || item?.store === 'ours';
  }

  function setModeBadge(text) {
    els.modeBadge.textContent = text;
  }

  function setStatus(text, isError = false) {
    els.statusBar.textContent = text || '';
    els.statusBar.style.color = isError ? 'var(--danger)' : 'var(--muted)';
  }

  function handleError(error) {
    console.error(error);
    if (!state.ready && !state.startupFailed) {
      setStatus('Still connecting to Supabase…', false);
      return;
    }
    setStatus(error?.message || 'Something went sideways.', true);
  }

  function renderStartupLoading(message, detail = '') {
    const safe = escapeHtml(message || 'Connecting to Supabase…');
    const safeDetail = escapeHtml(detail || 'On a phone or weak connection this can take a few seconds.');
    els.mainGrid.innerHTML = `
      <section class="view active" id="view-startup-loading">
        <div class="panel">
          <div class="panel-head">
            <div class="panel-title-row">
              <h2 class="panel-title">Connecting…</h2>
            </div>
          </div>
          <div class="empty-state startup-copy" style="text-align:left;line-height:1.5;">
            <div><strong>${safe}</strong></div>
            <div style="margin-top:8px;">${safeDetail}</div>
          </div>
        </div>
      </section>
    `;
  }

  function renderStartupError(message) {
    const safe = escapeHtml(message || 'Startup failed.');
    els.mainGrid.innerHTML = `
      <section class="view active" id="view-startup-error">
        <div class="panel">
          <div class="panel-head">
            <div class="panel-title-row">
              <h2 class="panel-title">Setup error</h2>
            </div>
          </div>
          <div class="empty-state startup-copy" style="text-align:left;line-height:1.5;">
            <div><strong>The app did not finish connecting to Supabase.</strong></div>
            <div style="margin-top:8px;">${safe}</div>
            <div style="margin-top:12px;">Check your Supabase values, make sure Anonymous sign-ins are enabled in Supabase Auth, run the latest SQL for this build, then hard refresh the page.</div>
          </div>
        </div>
      </section>
    `;
  }

  function ensureStoreReady() {
    if (!store || !state.ready) {
      throw new Error('Still connecting to Supabase. Give it another second.');
    }
  }

  function baseItem(itemName, category, storeName, parentTarget = null) {
    return {
      id: makeId(),
      household_id: SHARED_SCOPE_ID,
      item_name: itemName.trim(),
      normalized_name: normalizeName(itemName),
      category,
      store: storeName,
      parent_target: parentTarget,
      purchased_main: false,
      parent_checked: false,
      on_shopping_list: true,
      delivered: false,
      removed: false,
      removed_reason: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  function baseNoteItem(body, lane) {
    return {
      id: makeId(),
      household_id: SHARED_SCOPE_ID,
      lane,
      body: body.trim(),
      is_checked: false,
      sort_order: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  function getLearnedRule(normalizedName, storeName) {
    return state.rules.find((rule) => rule.item_key === normalizedName && rule.store === storeName);
  }

  function guessCategory(itemName, storeName) {
    const normalized = normalizeName(itemName);
    const learned = getLearnedRule(normalized, storeName);
    if (learned?.category) return learned.category;

    let bestCategory = null;
    let bestScore = 0;
    for (const rule of BUILTIN_RULES) {
      for (const keyword of rule.keywords) {
        if (!normalized.includes(keyword)) continue;
        const score = keyword.length;
        if (score > bestScore) {
          bestScore = score;
          bestCategory = rule.category;
        }
      }
    }
    return bestCategory;
  }

  function currentParentSelection() {
    if (els.parentPoirier.checked) return 'poirier';
    if (els.parentSchaffer.checked) return 'schaffer';
    return null;
  }

  function mutuallyExclusiveParentChecks(changed) {
    if (changed === 'poirier' && els.parentPoirier.checked) els.parentSchaffer.checked = false;
    if (changed === 'schaffer' && els.parentSchaffer.checked) els.parentPoirier.checked = false;
  }

  function openModal(storeName) {
    if (!state.ready) {
      setStatus('Still connecting to Supabase…');
      return;
    }
    state.modalStore = storeName;
    els.itemForm.reset();
    els.categoryPickerWrap.classList.add('hidden');
    els.categoryPicker.value = CATEGORY_ORDER[0];
    const isShopping = storeName === 'shopping';
    els.parentSelector.classList.toggle('hidden', !isShopping);
    els.modalTitle.textContent = `Add ${getStoreLabel(storeName)} Item`;
    els.itemModal.showModal();
    window.setTimeout(() => els.itemNameInput.focus(), 40);
  }

  function closeModal() {
    els.itemModal.close();
  }

  function openStoreModal() {
    if (!state.ready) {
      setStatus('Still connecting to Supabase…');
      return;
    }
    els.storeForm.reset();
    els.storeModal.showModal();
    window.setTimeout(() => els.storeNameInput.focus(), 40);
  }

  function closeStoreModal() {
    els.storeModal.close();
  }

  async function saveRule(itemKey, category, storeName) {
    ensureStoreReady();
    await store.saveRule({
      household_id: SHARED_SCOPE_ID,
      item_key: itemKey,
      category,
      store: storeName,
      updated_at: new Date().toISOString(),
    });
    state.rules = await store.getRules();
  }

  async function addStoreFromModal() {
    ensureStoreReady();
    const label = els.storeNameInput.value.trim();
    if (!label) return;
    const key = slugifyStoreName(label);
    if (!key) throw new Error('That store name does not produce a usable key.');
    if (['parents', 'notes', 'removed'].includes(key)) throw new Error('Pick a different store name.');
    if (getStoreDefs().some((entry) => entry.store_key === key)) throw new Error('That store already exists.');
    const maxOrder = Math.max(...getStoreDefs().map((entry) => Number(entry.sort_order) || 0), 0);
    await store.saveStore({
      household_id: SHARED_SCOPE_ID,
      store_key: key,
      store_label: label,
      sort_order: maxOrder + 10,
    });
    state.stores = await store.getStores();
    state.currentTab = key;
    renderAll();
    closeStoreModal();
    setStatus(`Added store: ${label}`);
  }

  async function addItemFromModal() {
    ensureStoreReady();
    const itemName = els.itemNameInput.value.trim();
    if (!itemName) return;
    let category = guessCategory(itemName, state.modalStore);
    const normalized = normalizeName(itemName);

    if (!category && els.categoryPickerWrap.classList.contains('hidden')) {
      els.categoryPickerWrap.classList.remove('hidden');
      els.categoryPicker.focus();
      return;
    }

    if (!category) {
      category = els.categoryPicker.value;
      await saveRule(normalized, category, state.modalStore);
    }

    const item = baseItem(itemName, category, state.modalStore, currentParentSelection());
    const saved = await store.saveItem(item);
    state.items.push(saved);
    if (!guessCategory(itemName, state.modalStore)) {
      await saveRule(normalized, category, state.modalStore);
    }
    closeModal();
    renderAll();
    setStatus(`Added ${itemName}.`);
  }

  function getItemsForTab(tabName) {
    if (isStoreTab(tabName)) {
      return state.items.filter((item) => {
        const matchesStore = tabName === 'shopping' ? isShoppingStore(item) : item.store === tabName;
        return matchesStore && item.on_shopping_list && !item.removed;
      });
    }
    if (tabName === 'parents') {
      return state.items.filter((item) => isShoppingStore(item) && item.parent_target && !item.removed && !item.delivered);
    }
    if (tabName === 'removed') {
      return state.items
        .filter((item) => item.removed)
        .sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
    }
    return [];
  }

  function getNotesForLane(lane) {
    return state.noteItems
      .filter((note) => note.lane === lane)
      .sort((a, b) => {
        if (a.is_checked !== b.is_checked) return Number(a.is_checked) - Number(b.is_checked);
        return (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0);
      });
  }

  function hasTabFlag(tabName) {
    if (isStoreTab(tabName)) {
      return getItemsForTab(tabName).some((item) => !item.purchased_main);
    }
    if (tabName === 'parents') {
      return getItemsForTab('parents').some((item) => !item.parent_checked);
    }
    if (tabName === 'notes') {
      return state.noteItems.some((note) => !note.is_checked && note.body?.trim());
    }
    return false;
  }

  function getView(tabName) {
    return document.getElementById(`view-${tabName}`);
  }

  function panelShell(title, actionsHtml, bodyHtml) {
    return `
      <div class="panel">
        <div class="panel-head">
          <div class="panel-title-row">
            <h2 class="panel-title">${escapeHtml(title)}</h2>
            <div class="panel-actions">${actionsHtml || ''}</div>
          </div>
        </div>
        ${bodyHtml}
      </div>
    `;
  }

  function renderTabBarAndViews() {
    const tabs = getAllTabDefs();
    if (!tabs.some((tab) => tab.key === state.currentTab)) state.currentTab = 'shopping';

    els.tabBar.innerHTML = [
      ...tabs.map((tab) => `
        <button class="tab ${tab.key === state.currentTab ? 'active' : ''} ${hasTabFlag(tab.key) ? 'has-flag' : ''}" data-tab="${escapeHtml(tab.key)}">
          <span class="tab-label">${escapeHtml(tab.label)}</span>
          ${hasTabFlag(tab.key) ? '<span class="tab-flag-dot" aria-hidden="true"></span>' : ''}
        </button>
      `),
      '<button class="tab tab-add-store" data-action="open-store-modal">＋ Store</button>',
    ].join('');

    els.mainGrid.innerHTML = tabs.map((tab) => `
      <section id="view-${escapeHtml(tab.key)}" class="view ${tab.key === state.currentTab ? 'active' : ''}"></section>
    `).join('');
  }

  function renderCategorizedItems(items, options = {}) {
    const groups = new Map();
    CATEGORY_ORDER.forEach((category) => groups.set(category, []));
    items.forEach((item) => {
      if (!groups.has(item.category)) groups.set(item.category, []);
      groups.get(item.category).push(item);
    });
    const blocks = [];
    for (const [category, groupItems] of groups.entries()) {
      if (!groupItems.length) continue;
      const rows = groupItems.map((item) => renderItemRow(item, options)).join('');
      blocks.push(`
        <section class="category-block">
          <div class="category-head">
            <div class="category-title">${escapeHtml(category)}</div>
          </div>
          <div class="item-list">${rows}</div>
        </section>
      `);
    }
    if (!blocks.length) return '<div class="empty-state">Nothing here yet.</div>';
    return blocks.join('');
  }

  function renderRemoved(items) {
    if (!items.length) {
      return panelShell('Recently Removed', '', '<div class="empty-state">No recently removed items.</div>');
    }
    const rows = items.map((item) => `
      <div class="item-row removed-row">
        <div class="item-main">
          <span class="helper-chip">${escapeHtml(item.removed_reason || 'removed')}</span>
          <span class="item-name">${escapeHtml(item.item_name)}</span>
        </div>
        <div class="item-meta">
          <span class="category-chip">${escapeHtml(item.category)}</span>
          <span class="badge">${escapeHtml(getStoreLabel(item.store))}</span>
          ${item.parent_target ? `<span class="parent-badge">${escapeHtml(PARENT_LABELS[isShaferTarget(item) ? 'schaffer' : item.parent_target] || 'S')}</span>` : ''}
        </div>
        <div class="item-actions">
          <button class="restore-btn" data-action="restore" data-id="${item.id}">Restore</button>
        </div>
      </div>
    `).join('');
    return panelShell('Recently Removed', '', `<div class="item-list">${rows}</div>`);
  }

  function renderItemRow(item, options = {}) {
    const checked = options.parentMode ? item.parent_checked : item.purchased_main;
    const rowClass = ['item-row', checked ? 'checked' : ''].filter(Boolean).join(' ');
    const checkboxMode = options.parentMode ? 'parent' : 'main';
    const showParentBadge = Boolean(item.parent_target);
    const parentKey = isShaferTarget(item) ? 'schaffer' : item.parent_target;
    return `
      <div class="${rowClass}">
        <label class="check-wrap">
          <input type="checkbox" data-action="toggle-${checkboxMode}" data-id="${item.id}" ${checked ? 'checked' : ''} />
        </label>
        <div class="item-main">
          <span class="item-name">${escapeHtml(item.item_name)}</span>
          <div class="item-meta">
            ${showParentBadge ? `<span class="parent-badge">${escapeHtml(PARENT_LABELS[parentKey] || 'S')}</span>` : ''}
            ${options.showStore ? `<span class="badge">${escapeHtml(getStoreLabel(item.store))}</span>` : ''}
          </div>
        </div>
        <div class="item-actions">
          <button class="remove-btn" data-action="remove" data-id="${item.id}">✕</button>
        </div>
      </div>
    `;
  }

  function renderStoreView(storeKey) {
    const items = getItemsForTab(storeKey);
    const actions = `
      <button class="control-btn" data-action="open-add" data-store="${escapeHtml(storeKey)}">Add item</button>
      <button class="control-btn primary" data-action="done-store" data-store="${escapeHtml(storeKey)}" ${items.some((item) => item.purchased_main) ? '' : 'disabled'}>Done</button>
    `;
    const view = getView(storeKey);
    if (view) view.innerHTML = panelShell(getStoreLabel(storeKey), actions, renderCategorizedItems(items));
  }

  function renderParents() {
    const poirierItems = state.items.filter((item) => isShoppingStore(item) && item.parent_target === 'poirier' && !item.removed && !item.delivered);
    const schafferItems = state.items.filter((item) => isShoppingStore(item) && isShaferTarget(item) && !item.removed && !item.delivered);

    const renderParentSection = (title, key, items) => `
      <section class="parent-section ${items.length ? '' : 'empty-parent-section'}">
        <div class="parent-section-head">
          <div class="parent-section-title">${escapeHtml(title)}</div>
          <div class="panel-actions">
            <button class="control-btn primary" data-action="delivered-parent" data-parent="${escapeHtml(key)}" ${items.some((item) => item.parent_checked) ? '' : 'disabled'}>Delivered</button>
          </div>
        </div>
        ${items.length ? renderCategorizedItems(items, { parentMode: true }) : '<div class="empty-state compact-empty">Nothing pending.</div>'}
      </section>
    `;

    const view = getView('parents');
    if (!view) return;
    view.innerHTML = panelShell('Parents', '', `
      <div class="parent-sections-wrap">
        ${renderParentSection('Poirier', 'poirier', poirierItems)}
        ${renderParentSection('Shafer', 'schaffer', schafferItems)}
      </div>
    `);
  }

  function renderNoteLane(laneDef) {
    const notes = getNotesForLane(laneDef.key);
    const rows = notes.length ? notes.map((note) => `
      <div class="item-row note-row ${note.is_checked ? 'checked' : ''}">
        <label class="check-wrap">
          <input type="checkbox" data-action="toggle-note" data-id="${note.id}" ${note.is_checked ? 'checked' : ''} />
        </label>
        <div class="item-main">
          <span class="item-name">${escapeHtml(note.body)}</span>
        </div>
        <div class="item-actions">
          <button class="remove-btn" data-action="delete-note" data-id="${note.id}">Delete</button>
        </div>
      </div>
    `).join('') : '<div class="empty-state compact-empty">No notes here.</div>';

    return `
      <section class="note-section">
        <div class="parent-section-head">
          <div class="parent-section-title">${escapeHtml(laneDef.label)}</div>
        </div>
        <div class="note-entry-bar">
          <input class="note-input" data-note-input="${escapeHtml(laneDef.key)}" type="text" maxlength="200" placeholder="Add ${escapeHtml(laneDef.label.toLowerCase())}..." />
          <button class="control-btn" data-action="add-note" data-lane="${escapeHtml(laneDef.key)}">Add</button>
        </div>
        <div class="item-list">${rows}</div>
      </section>
    `;
  }

  function renderNotes() {
    const view = getView('notes');
    if (!view) return;
    view.innerHTML = panelShell('Notes', '', `
      <div class="notes-sections-wrap">
        ${NOTE_LANES.map((laneDef) => renderNoteLane(laneDef)).join('')}
      </div>
    `);
  }

  function renderAll() {
    renderTabBarAndViews();
    getStoreTabs().forEach((tab) => renderStoreView(tab.key));
    renderParents();
    renderNotes();
    const removedView = getView('removed');
    if (removedView) removedView.innerHTML = renderRemoved(getItemsForTab('removed'));
    bindDynamicEvents();
    switchTab(state.currentTab);
  }

  async function persistItem(item) {
    ensureStoreReady();
    const saved = await store.saveItem(item);
    const idx = state.items.findIndex((x) => x.id === saved.id);
    if (idx >= 0) state.items[idx] = saved;
    else state.items.push(saved);
    renderAll();
  }

  async function persistNoteItem(note) {
    ensureStoreReady();
    const saved = await store.saveNoteItem(note);
    const idx = state.noteItems.findIndex((x) => x.id === saved.id);
    if (idx >= 0) state.noteItems[idx] = saved;
    else state.noteItems.push(saved);
    renderAll();
  }

  async function removeNoteItem(id) {
    ensureStoreReady();
    await store.deleteNoteItem(id);
    state.noteItems = state.noteItems.filter((note) => note.id !== id);
    renderAll();
  }

  async function toggleMainChecked(id, checked) {
    const item = state.items.find((x) => x.id === id);
    if (!item) return;
    item.purchased_main = checked;
    await persistItem(item);
  }

  async function toggleParentChecked(id, checked) {
    const item = state.items.find((x) => x.id === id);
    if (!item) return;
    item.parent_checked = checked;
    await persistItem(item);
  }

  async function removeItem(id) {
    const item = state.items.find((x) => x.id === id);
    if (!item) return;
    item.removed = true;
    item.removed_reason = 'manual';
    item.on_shopping_list = false;
    item.parent_checked = false;
    item.purchased_main = false;
    item.delivered = false;
    await persistItem(item);
  }

  async function restoreItem(id) {
    const item = state.items.find((x) => x.id === id);
    if (!item) return;
    item.removed = false;
    item.removed_reason = null;
    item.delivered = false;
    item.parent_checked = false;
    item.purchased_main = false;
    item.on_shopping_list = true;
    await persistItem(item);
  }

  async function shoppedStore(storeName) {
    const items = state.items.filter((item) => {
      const matchesStore = storeName === 'shopping' ? isShoppingStore(item) : item.store === storeName;
      return matchesStore && item.on_shopping_list && !item.removed && item.purchased_main;
    });
    for (const item of items) {
      item.purchased_main = false;
      if (item.parent_target && storeName === 'shopping') {
        item.on_shopping_list = false;
      } else {
        item.removed = true;
        item.removed_reason = 'shopped';
        item.on_shopping_list = false;
      }
      await persistItem(item);
    }
    setStatus(`Trip cleared for ${getStoreLabel(storeName)}.`);
  }

  async function deliveredParent(parentKey) {
    const items = state.items.filter((item) => {
      const matchesParent = parentKey === 'schaffer' ? isShaferTarget(item) : item.parent_target === parentKey;
      return matchesParent && !item.removed && !item.delivered && item.parent_checked;
    });
    for (const item of items) {
      item.parent_checked = false;
      item.delivered = true;
      item.removed = true;
      item.removed_reason = 'delivered';
      item.on_shopping_list = false;
      await persistItem(item);
    }
    setStatus(`Delivered items cleared for ${PARENT_TITLES[parentKey] || parentKey}.`);
  }

  async function addNoteFromLane(lane) {
    ensureStoreReady();
    const input = document.querySelector(`[data-note-input="${lane}"]`);
    if (!input) return;
    const body = input.value.trim();
    if (!body) return;
    await persistNoteItem(baseNoteItem(body, lane));
    input.value = '';
    setStatus(`Added note to ${NOTE_LANES.find((entry) => entry.key === lane)?.label || 'Notes'}.`);
  }

  async function toggleNoteChecked(id, checked) {
    const note = state.noteItems.find((entry) => entry.id === id);
    if (!note) return;
    note.is_checked = checked;
    await persistNoteItem(note);
  }

  function switchTab(tabName) {
    state.currentTab = tabName;
    document.querySelectorAll('.tab[data-tab]').forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === tabName));
    document.querySelectorAll('.view').forEach((view) => view.classList.toggle('active', view.id === `view-${tabName}`));
    els.floatingAddBtn.classList.toggle('hidden', !state.ready || tabName === 'notes' || tabName === 'removed' || tabName === 'parents');
    const targetStore = isStoreTab(tabName) ? tabName : 'shopping';
    els.floatingAddBtn.dataset.store = targetStore;
    els.floatingAddBtn.title = `Add ${getStoreLabel(targetStore)} item`;
  }

  function debounce(fn, wait = 400) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  function bindDynamicEvents() {
    document.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const action = event.currentTarget.dataset.action;
        const id = event.currentTarget.dataset.id;
        const storeName = event.currentTarget.dataset.store;
        const parentKey = event.currentTarget.dataset.parent;
        const lane = event.currentTarget.dataset.lane;
        try {
          if (action === 'open-add') await openModal(storeName);
          else if (action === 'open-store-modal') await openStoreModal();
          else if (action === 'remove') await removeItem(id);
          else if (action === 'restore') await restoreItem(id);
          else if (action === 'done-store') await shoppedStore(storeName);
          else if (action === 'delivered-parent') await deliveredParent(parentKey);
          else if (action === 'add-note') await addNoteFromLane(lane);
          else if (action === 'delete-note') await removeNoteItem(id);
        } catch (error) {
          handleError(error);
        }
      });
    });

    document.querySelectorAll('input[data-action="toggle-main"]').forEach((input) => {
      input.addEventListener('change', async (event) => {
        try {
          await toggleMainChecked(event.currentTarget.dataset.id, event.currentTarget.checked);
        } catch (error) {
          handleError(error);
        }
      });
    });

    document.querySelectorAll('input[data-action="toggle-parent"]').forEach((input) => {
      input.addEventListener('change', async (event) => {
        try {
          await toggleParentChecked(event.currentTarget.dataset.id, event.currentTarget.checked);
        } catch (error) {
          handleError(error);
        }
      });
    });

    document.querySelectorAll('input[data-action="toggle-note"]').forEach((input) => {
      input.addEventListener('change', async (event) => {
        try {
          await toggleNoteChecked(event.currentTarget.dataset.id, event.currentTarget.checked);
        } catch (error) {
          handleError(error);
        }
      });
    });

    document.querySelectorAll('[data-note-input]').forEach((input) => {
      input.addEventListener('keydown', async (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        try {
          await addNoteFromLane(event.currentTarget.dataset.noteInput);
        } catch (error) {
          handleError(error);
        }
      });
    });
  }

  async function migrateLegacyNotesIfNeeded(legacyBody) {
    const trimmed = (legacyBody || '').trim();
    if (!trimmed) return;
    const hasSharedNotes = state.noteItems.some((note) => note.lane === 'shared');
    if (hasSharedNotes) return;
    const lines = trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) return;
    for (let i = 0; i < lines.length; i += 1) {
      const note = baseNoteItem(lines[i], 'shared');
      note.sort_order = Date.now() + i;
      await store.saveNoteItem(note);
    }
    await store.saveLegacyNote('');
    state.noteItems = await store.getNoteItems();
  }

  async function loadAll() {
    ensureStoreReady();
    const [items, rules, legacyNote, stores, noteItems] = await Promise.all([
      store.getItems(),
      store.getRules(),
      store.getLegacyNote(),
      store.getStores(),
      store.getNoteItems(),
    ]);
    state.items = items || [];
    state.rules = rules || [];
    state.stores = stores || [...BUILTIN_STORES];
    state.noteItems = noteItems || [];
    await migrateLegacyNotesIfNeeded(legacyNote);
    renderAll();
    setStatus(`Ready. ${VERSION}`);
  }

  async function initStore() {
    let slowTimer = null;
    try {
      state.startupFailed = false;
      setModeBadge('Connecting…');
      setStatus('Connecting to Supabase…');
      renderStartupLoading('Connecting to Supabase…');
      slowTimer = window.setTimeout(() => {
        if (!state.ready) {
          setModeBadge('Connecting…');
          setStatus('Still connecting to Supabase…');
          renderStartupLoading('Still connecting to Supabase…', 'Phone connections can take a few extra seconds.');
        }
      }, 2200);
      store = new SupabaseStore();
      await store.init();
      state.user = await store.currentUser();
      state.ready = true;
      if (slowTimer) window.clearTimeout(slowTimer);
      await loadAll();
    } catch (error) {
      if (slowTimer) window.clearTimeout(slowTimer);
      state.ready = false;
      state.startupFailed = true;
      console.error('Supabase startup failed.', error);
      const message = error.code === '42P01'
        ? 'Supabase setup issue: this build needs the latest SQL, including shopping_note_items.'
        : `Supabase setup issue: ${error.message}`;
      setStatus(message, true);
      renderStartupError(message);
      throw error;
    }
  }

  function bindStaticEvents() {
    els.tabBar.addEventListener('click', (event) => {
      const storeBtn = event.target.closest('[data-action="open-store-modal"]');
      if (storeBtn) {
        openStoreModal();
        return;
      }
      const button = event.target.closest('.tab[data-tab]');
      if (!button) return;
      switchTab(button.dataset.tab);
    });

    els.floatingAddBtn.addEventListener('click', () => openModal(els.floatingAddBtn.dataset.store || 'shopping'));
    els.closeModalBtn.addEventListener('click', closeModal);
    els.cancelModalBtn.addEventListener('click', closeModal);
    els.closeStoreModalBtn.addEventListener('click', closeStoreModal);
    els.cancelStoreModalBtn.addEventListener('click', closeStoreModal);

    els.parentPoirier.addEventListener('change', () => mutuallyExclusiveParentChecks('poirier'));
    els.parentSchaffer.addEventListener('change', () => mutuallyExclusiveParentChecks('schaffer'));

    els.itemNameInput.addEventListener('input', () => {
      const guess = guessCategory(els.itemNameInput.value, state.modalStore);
      if (guess) els.categoryPickerWrap.classList.add('hidden');
    });

    els.itemForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        await addItemFromModal();
      } catch (error) {
        handleError(error);
      }
    });

    els.storeForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        await addStoreFromModal();
      } catch (error) {
        handleError(error);
      }
    });
  }

  bindStaticEvents();
  els.floatingAddBtn.classList.add('hidden');
  renderStartupLoading('Connecting to Supabase…');
  initStore().catch(() => {});
})();
