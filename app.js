(function () {
  const APP_CONFIG = window.APP_CONFIG || {};
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

  const STORE_LABELS = {
    ours: 'Ours',
    menards: 'Menards',
  };

  const PARENT_LABELS = {
    poirier: 'P',
    schaffer: 'S',
  };

  const BUILTIN_RULES = [
    { category: 'Produce', keywords: ['apple', 'apples', 'banana', 'bananas', 'orange', 'oranges', 'lettuce', 'romaine', 'spinach', 'celery', 'carrot', 'carrots', 'onion', 'onions', 'potato', 'potatoes', 'garlic', 'grape', 'grapes', 'broccoli', 'cauliflower', 'pepper', 'peppers', 'tomato', 'tomatoes', 'cucumber', 'cucumbers', 'avocado', 'avocados', 'lime', 'limes', 'lemon', 'lemons', 'salad', 'mushroom', 'mushrooms', 'berries', 'strawberry', 'blueberry'] },
    { category: 'Deli', keywords: ['deli', 'sliced turkey', 'sliced ham', 'provolone', 'swiss slices', 'lunch meat', 'rotisserie', 'prepared salad', 'coleslaw'] },
    { category: 'Vegan', keywords: ['tofu', 'tempeh', 'vegan', 'plant butter', 'plant-based', 'almond yogurt', 'soy yogurt', 'oatmilk creamer', 'vegan cheese'] },
    { category: 'Meat', keywords: ['beef', 'steak', 'hamburger', 'ground beef', 'chicken', 'pork', 'bacon', 'sausage', 'ham', 'turkey', 'salmon', 'fish fillet', 'shrimp'] },
    { category: 'Frozen', keywords: ['frozen', 'ice cream', 'pizza', 'peas', 'french fries', 'hash browns', 'waffles', 'tv dinner'] },
    { category: 'Gluten Free', keywords: ['gluten free', 'gf bread', 'gf pasta', 'gf crackers', 'gf flour'] },
    { category: 'Condiments', keywords: ['ketchup', 'mustard', 'mayo', 'mayonnaise', 'relish', 'salsa', 'soy sauce', 'vinegar', 'olive oil', 'hot sauce', 'salad dressing', 'bbq sauce', 'jam', 'jelly', 'peanut butter'] },
    { category: 'Canned', keywords: ['canned', 'soup', 'broth', 'beans', 'corn', 'peas', 'tuna', 'tomato sauce', 'tomatoes', 'spam'] },
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
    currentTab: 'ours',
    modalStore: 'ours',
    items: [],
    rules: [],
    note: '',
    isSupabase: false,
    ready: false,
    user: null,
  };

  const els = {
    modeBadge: document.getElementById('modeBadge'),
    statusBar: document.getElementById('statusBar'),
    tabBar: document.getElementById('tabBar'),
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
    authEmail: document.getElementById('authEmail'),
    authPassword: document.getElementById('authPassword'),
    signInBtn: document.getElementById('signInBtn'),
    signUpBtn: document.getElementById('signUpBtn'),
    signOutBtn: document.getElementById('signOutBtn'),
    authCompact: document.getElementById('authCompact'),
    views: {
      ours: document.getElementById('view-ours'),
      menards: document.getElementById('view-menards'),
      poirier: document.getElementById('view-poirier'),
      schaffer: document.getElementById('view-schaffer'),
      notes: document.getElementById('view-notes'),
      removed: document.getElementById('view-removed'),
    },
  };

  const categoryOptionsHtml = CATEGORY_ORDER.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
  els.categoryPicker.innerHTML = categoryOptionsHtml;

  class LocalStore {
    async init() {
      this.itemsKey = 'shopping-list-items-v1';
      this.rulesKey = 'shopping-list-rules-v1';
      this.noteKey = 'shopping-list-note-v1';
      state.isSupabase = false;
      setModeBadge('Local demo mode');
      return true;
    }
    async getItems() { return readJSON(this.itemsKey, []); }
    async saveItem(item) {
      const items = readJSON(this.itemsKey, []);
      const idx = items.findIndex((x) => x.id === item.id);
      item.updated_at = new Date().toISOString();
      if (idx >= 0) items[idx] = item;
      else items.push(item);
      writeJSON(this.itemsKey, items);
      return item;
    }
    async getRules() { return readJSON(this.rulesKey, []); }
    async saveRule(rule) {
      const rules = readJSON(this.rulesKey, []);
      const idx = rules.findIndex((r) => r.item_key === rule.item_key && r.store === rule.store);
      if (idx >= 0) rules[idx] = rule;
      else rules.push(rule);
      writeJSON(this.rulesKey, rules);
      return rule;
    }
    async getNote() { return localStorage.getItem(this.noteKey) || ''; }
    async saveNote(body) { localStorage.setItem(this.noteKey, body); return body; }
    async signIn() { return { user: { email: 'local@demo' } }; }
    async signUp() { return { user: { email: 'local@demo' } }; }
    async signOut() { return true; }
    async currentUser() { return { email: 'local@demo' }; }
  }

  class SupabaseStore {
    async init() {
      if (!APP_CONFIG.supabaseUrl || !APP_CONFIG.supabaseAnonKey) {
        throw new Error('Missing Supabase URL or anon key in config.js');
      }
      state.isSupabase = true;
      this.client = window.supabase.createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      });
      const { data } = await this.client.auth.getSession();
      state.user = data?.session?.user || null;
      setModeBadge(state.user ? `Supabase: ${state.user.email}` : 'Supabase ready — sign in');
      this.client.auth.onAuthStateChange((_event, session) => {
        state.user = session?.user || null;
        setAuthState();
        if (state.user) {
          setModeBadge(`Supabase: ${state.user.email}`);
          loadAll().catch(handleError);
        } else {
          setModeBadge('Supabase ready — sign in');
          state.items = [];
          state.rules = [];
          state.note = '';
          renderAll();
        }
      });
      return true;
    }
    ensureUser() {
      if (!state.user) throw new Error('Sign in first.');
    }
    async currentUser() { return state.user; }
    async signIn(email, password) {
      const { data, error } = await this.client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      state.user = data.user;
      return data;
    }
    async signUp(email, password) {
      const { data, error } = await this.client.auth.signUp({ email, password });
      if (error) throw error;
      state.user = data.user || null;
      return data;
    }
    async signOut() {
      const { error } = await this.client.auth.signOut();
      if (error) throw error;
      state.user = null;
      return true;
    }
    async getItems() {
      this.ensureUser();
      const { data, error } = await this.client
        .from('shopping_items')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    }
    async saveItem(item) {
      this.ensureUser();
      const payload = { ...item };
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
      this.ensureUser();
      const { data, error } = await this.client.from('shopping_rules').select('*');
      if (error) throw error;
      return data || [];
    }
    async saveRule(rule) {
      this.ensureUser();
      const { data, error } = await this.client
        .from('shopping_rules')
        .upsert(rule, { onConflict: 'user_id,item_key,store' })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    async getNote() {
      this.ensureUser();
      const { data, error } = await this.client
        .from('shopping_notes')
        .select('*')
        .limit(1);
      if (error) throw error;
      return data?.[0]?.body || '';
    }
    async saveNote(body) {
      this.ensureUser();
      const payload = { body, updated_at: new Date().toISOString() };
      const { error } = await this.client.from('shopping_notes').upsert(payload, { onConflict: 'user_id' });
      if (error) throw error;
      return body;
    }
  }

  let store = null;

  function readJSON(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalizeName(value) {
    return value.toLowerCase().trim().replace(/\s+/g, ' ');
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
    setStatus(error?.message || 'Something went sideways.', true);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function makeId() {
    return crypto?.randomUUID ? crypto.randomUUID() : `item-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function baseItem(itemName, category, storeName, parentTarget = null) {
    return {
      id: makeId(),
      user_id: state.user?.id || 'local-user',
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

  function getLearnedRule(normalizedName, storeName) {
    return state.rules.find((rule) => rule.item_key === normalizedName && rule.store === storeName);
  }

  function guessCategory(itemName, storeName) {
    const normalized = normalizeName(itemName);
    const learned = getLearnedRule(normalized, storeName);
    if (learned?.category) return learned.category;

    for (const rule of BUILTIN_RULES) {
      if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
        return rule.category;
      }
    }
    return null;
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
    state.modalStore = storeName;
    els.itemForm.reset();
    els.categoryPickerWrap.classList.add('hidden');
    const isOurs = storeName === 'ours';
    els.parentSelector.classList.toggle('hidden', !isOurs);
    els.modalTitle.textContent = `Add ${STORE_LABELS[storeName]} Item`;
    els.itemModal.showModal();
    setTimeout(() => els.itemNameInput.focus(), 50);
  }

  function closeModal() {
    els.itemModal.close();
  }

  async function saveRule(itemKey, category, storeName) {
    const payload = {
      user_id: state.user?.id || 'local-user',
      item_key: itemKey,
      category,
      store: storeName,
      updated_at: new Date().toISOString(),
    };
    await store.saveRule(payload);
    state.rules = await store.getRules();
  }

  async function addItemFromModal() {
    const itemName = els.itemNameInput.value.trim();
    if (!itemName) return;

    let category = guessCategory(itemName, state.modalStore);
    const normalized = normalizeName(itemName);

    if (!category && els.categoryPickerWrap.classList.contains('hidden')) {
      els.categoryPickerWrap.classList.remove('hidden');
      els.categoryPicker.value = 'Other';
      return;
    }

    if (!category) {
      category = els.categoryPicker.value;
      await saveRule(normalized, category, state.modalStore);
    }

    const parentTarget = state.modalStore === 'ours' ? currentParentSelection() : null;
    const item = baseItem(itemName, category, state.modalStore, parentTarget);
    const saved = await store.saveItem(item);
    state.items.push(saved);
    setStatus(`Added: ${itemName}`);
    closeModal();
    renderAll();
  }

  async function loadAll() {
    if (state.isSupabase && !state.user) {
      state.items = [];
      state.rules = [];
      state.note = '';
      renderAll();
      return;
    }
    const [items, rules, note] = await Promise.all([store.getItems(), store.getRules(), store.getNote()]);
    state.items = items;
    state.rules = rules;
    state.note = note;
    renderAll();
  }

  function getItemsForTab(tabName) {
    switch (tabName) {
      case 'ours':
        return state.items.filter((item) => item.store === 'ours' && item.on_shopping_list && !item.removed);
      case 'menards':
        return state.items.filter((item) => item.store === 'menards' && item.on_shopping_list && !item.removed);
      case 'poirier':
        return state.items.filter((item) => item.store === 'ours' && item.parent_target === 'poirier' && !item.removed && !item.delivered);
      case 'schaffer':
        return state.items.filter((item) => item.store === 'ours' && item.parent_target === 'schaffer' && !item.removed && !item.delivered);
      case 'removed':
        return state.items.filter((item) => item.removed).sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
      default:
        return [];
    }
  }

  function countChecked(items, mode) {
    if (mode === 'parent') return items.filter((item) => item.parent_checked).length;
    return items.filter((item) => item.purchased_main).length;
  }

  function panelShell(title, actionsHtml, bodyHtml) {
    return `
      <div class="panel">
        <div class="panel-head">
          <div class="panel-title-row">
            <h2 class="panel-title">${title}</h2>
            <div class="panel-actions">${actionsHtml || ''}</div>
          </div>
        </div>
        ${bodyHtml}
      </div>
    `;
  }

  function renderCategorizedItems(items, options = {}) {
    const groups = new Map();
    CATEGORY_ORDER.forEach((category) => groups.set(category, []));
    for (const item of items) {
      if (!groups.has(item.category)) groups.set(item.category, []);
      groups.get(item.category).push(item);
    }

    const blocks = [];
    for (const [category, groupItems] of groups.entries()) {
      if (!groupItems.length) continue;
      const rows = groupItems.map((item) => renderItemRow(item, options)).join('');
      blocks.push(`
        <section class="category-block">
          <div class="category-head">
            <div class="category-title">${escapeHtml(category)} <span class="badge">${groupItems.length}</span></div>
          </div>
          <div class="item-list">${rows}</div>
        </section>
      `);
    }

    if (!blocks.length) {
      return `<div class="empty-state">Nothing here yet.</div>`;
    }
    return blocks.join('');
  }

  function renderRemoved(items) {
    if (!items.length) {
      return panelShell('Recently Removed', '', `<div class="empty-state">No recently removed items.</div>`);
    }
    const rows = items.map((item) => `
      <div class="item-row removed-row">
        <div class="item-main">
          <span class="helper-chip">${escapeHtml(item.removed_reason || 'removed')}</span>
          <span class="item-name">${escapeHtml(item.item_name)}</span>
        </div>
        <div class="item-meta">
          <span class="category-chip">${escapeHtml(item.category)}</span>
          <span class="badge">${escapeHtml(STORE_LABELS[item.store] || item.store)}</span>
          ${item.parent_target ? `<span class="parent-badge">${escapeHtml(PARENT_LABELS[item.parent_target])}</span>` : ''}
        </div>
        <div class="item-actions">
          <button class="restore-btn" data-action="restore" data-id="${item.id}">Restore</button>
        </div>
      </div>
    `).join('');

    return panelShell('Recently Removed', '', `<div class="item-list">${rows}</div>`);
  }

  function renderItemRow(item, options = {}) {
    const rowClass = [
      'item-row',
      item.purchased_main || item.parent_checked ? 'checked' : '',
    ].filter(Boolean).join(' ');

    const showParentBadge = Boolean(item.parent_target);
    const checkboxMode = options.parentMode ? 'parent' : 'main';
    const checkboxChecked = options.parentMode ? item.parent_checked : item.purchased_main;

    return `
      <div class="${rowClass}">
        <label class="check-wrap">
          <input type="checkbox" data-action="toggle-${checkboxMode}" data-id="${item.id}" ${checkboxChecked ? 'checked' : ''} />
        </label>
        <div class="item-main">
          <span class="item-name">${escapeHtml(item.item_name)}</span>
          <div class="item-meta">
            ${showParentBadge ? `<span class="parent-badge">${escapeHtml(PARENT_LABELS[item.parent_target])}</span>` : ''}
            ${options.showStore ? `<span class="badge">${escapeHtml(STORE_LABELS[item.store] || item.store)}</span>` : ''}
          </div>
        </div>
        <div class="item-actions">
          <button class="remove-btn" data-action="remove" data-id="${item.id}">✕</button>
        </div>
      </div>
    `;
  }

  function renderOurs() {
    const items = getItemsForTab('ours');
    const checkedCount = countChecked(items, 'main');
    const actions = `
      <button class="control-btn" data-action="open-add" data-store="ours">Add item</button>
      <button class="control-btn primary" data-action="shopped-ours" ${checkedCount ? '' : 'disabled'}>Shopped (${checkedCount})</button>
    `;
    els.views.ours.innerHTML = panelShell('Ours', actions, renderCategorizedItems(items));
  }

  function renderMenards() {
    const items = getItemsForTab('menards');
    const checkedCount = countChecked(items, 'main');
    const actions = `
      <button class="control-btn" data-action="open-add" data-store="menards">Add item</button>
      <button class="control-btn primary" data-action="shopped-menards" ${checkedCount ? '' : 'disabled'}>Shopped (${checkedCount})</button>
    `;
    els.views.menards.innerHTML = panelShell('Menards', actions, renderCategorizedItems(items));
  }

  function renderParentTab(parentKey) {
    const items = getItemsForTab(parentKey);
    const checkedCount = countChecked(items, 'parent');
    const title = parentKey === 'poirier' ? 'Poirier' : 'Schaffer';
    const actions = `
      <button class="control-btn primary" data-action="delivered-${parentKey}" ${checkedCount ? '' : 'disabled'}>Delivered (${checkedCount})</button>
    `;
    els.views[parentKey].innerHTML = panelShell(title, actions, renderCategorizedItems(items, { parentMode: true }));
  }

  function renderNotes() {
    els.views.notes.innerHTML = `
      <div class="notes-wrap">
        <div class="panel-title-row" style="margin-bottom: 10px;">
          <h2 class="panel-title">Notes</h2>
          <div class="panel-actions"><span class="badge">Shared</span></div>
        </div>
        <textarea id="notesText" class="notes-text" placeholder="Put shared notes here...">${escapeHtml(state.note || '')}</textarea>
      </div>
    `;
  }

  function renderAll() {
    renderOurs();
    renderMenards();
    renderParentTab('poirier');
    renderParentTab('schaffer');
    renderNotes();
    els.views.removed.innerHTML = renderRemoved(getItemsForTab('removed'));
    bindDynamicEvents();
    switchTab(state.currentTab);
  }

  async function persistItem(item) {
    const saved = await store.saveItem(item);
    const idx = state.items.findIndex((x) => x.id === saved.id);
    if (idx >= 0) state.items[idx] = saved;
    else state.items.push(saved);
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
    const items = state.items.filter((item) => item.store === storeName && item.on_shopping_list && !item.removed && item.purchased_main);
    for (const item of items) {
      item.purchased_main = false;
      if (item.parent_target && storeName === 'ours') {
        item.on_shopping_list = false;
      } else {
        item.removed = true;
        item.removed_reason = 'shopped';
        item.on_shopping_list = false;
      }
      await persistItem(item);
    }
    setStatus(`Trip cleared for ${STORE_LABELS[storeName]}.`);
  }

  async function deliveredParent(parentKey) {
    const items = state.items.filter((item) => item.parent_target === parentKey && !item.removed && !item.delivered && item.parent_checked);
    for (const item of items) {
      item.parent_checked = false;
      item.delivered = true;
      item.removed = true;
      item.removed_reason = 'delivered';
      item.on_shopping_list = false;
      await persistItem(item);
    }
    setStatus(`Delivered items cleared for ${parentKey === 'poirier' ? 'Poirier' : 'Schaffer'}.`);
  }

  function switchTab(tabName) {
    state.currentTab = tabName;
    document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === tabName));
    Object.entries(els.views).forEach(([key, view]) => view.classList.toggle('active', key === tabName));
    els.floatingAddBtn.classList.toggle('hidden', tabName === 'notes' || tabName === 'removed' || tabName === 'poirier' || tabName === 'schaffer');
    els.floatingAddBtn.dataset.store = tabName === 'menards' ? 'menards' : 'ours';
    els.floatingAddBtn.title = tabName === 'menards' ? 'Add Menards item' : 'Add shopping item';
  }

  function setAuthState() {
    const signedIn = !!state.user || !state.isSupabase;
    els.signOutBtn.classList.toggle('hidden', !signedIn || !state.isSupabase);
    els.signInBtn.classList.toggle('hidden', !state.isSupabase);
    els.signUpBtn.classList.toggle('hidden', !state.isSupabase);
    els.authEmail.disabled = !state.isSupabase;
    els.authPassword.disabled = !state.isSupabase;
  }

  function debounce(fn, wait = 400) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  const saveNoteDebounced = debounce(async (value) => {
    try {
      await store.saveNote(value);
      setStatus('Notes saved.');
    } catch (error) {
      handleError(error);
    }
  }, 500);

  function bindDynamicEvents() {
    document.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const action = event.currentTarget.dataset.action;
        const id = event.currentTarget.dataset.id;
        const storeName = event.currentTarget.dataset.store;
        try {
          if (action === 'open-add') openModal(storeName);
          if (action === 'remove') await removeItem(id);
          if (action === 'restore') await restoreItem(id);
          if (action === 'shopped-ours') await shoppedStore('ours');
          if (action === 'shopped-menards') await shoppedStore('menards');
          if (action === 'delivered-poirier') await deliveredParent('poirier');
          if (action === 'delivered-schaffer') await deliveredParent('schaffer');
        } catch (error) {
          handleError(error);
        }
      });
    });

    document.querySelectorAll('input[data-action="toggle-main"]').forEach((input) => {
      input.addEventListener('change', async (event) => {
        try { await toggleMainChecked(event.currentTarget.dataset.id, event.currentTarget.checked); }
        catch (error) { handleError(error); }
      });
    });

    document.querySelectorAll('input[data-action="toggle-parent"]').forEach((input) => {
      input.addEventListener('change', async (event) => {
        try { await toggleParentChecked(event.currentTarget.dataset.id, event.currentTarget.checked); }
        catch (error) { handleError(error); }
      });
    });

    const notesText = document.getElementById('notesText');
    if (notesText) {
      notesText.addEventListener('input', (event) => {
        state.note = event.currentTarget.value;
        saveNoteDebounced(state.note);
      });
    }
  }

  async function initStore() {
    if (APP_CONFIG.mode === 'supabase') {
      try {
        store = new SupabaseStore();
        await store.init();
      } catch (error) {
        console.warn('Falling back to local mode.', error);
        store = new LocalStore();
        await store.init();
        setStatus(`Supabase setup issue: ${error.message}. Running local mode instead.`, true);
      }
    } else {
      store = new LocalStore();
      await store.init();
    }
    state.isSupabase = store instanceof SupabaseStore;
    state.user = await store.currentUser();
    setAuthState();
    state.ready = true;
    await loadAll();
  }

  function bindStaticEvents() {
    els.tabBar.addEventListener('click', (event) => {
      const button = event.target.closest('.tab');
      if (!button) return;
      switchTab(button.dataset.tab);
    });

    els.floatingAddBtn.addEventListener('click', () => openModal(els.floatingAddBtn.dataset.store || 'ours'));
    els.closeModalBtn.addEventListener('click', closeModal);
    els.cancelModalBtn.addEventListener('click', closeModal);

    els.parentPoirier.addEventListener('change', () => mutuallyExclusiveParentChecks('poirier'));
    els.parentSchaffer.addEventListener('change', () => mutuallyExclusiveParentChecks('schaffer'));

    els.itemNameInput.addEventListener('input', () => {
      const guess = guessCategory(els.itemNameInput.value, state.modalStore);
      if (guess) {
        els.categoryPickerWrap.classList.add('hidden');
      }
    });

    els.itemForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        await addItemFromModal();
      } catch (error) {
        handleError(error);
      }
    });

    els.itemNameInput.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        try {
          await addItemFromModal();
        } catch (error) {
          handleError(error);
        }
      }
    });

    els.signInBtn.addEventListener('click', async () => {
      try {
        await store.signIn(els.authEmail.value.trim(), els.authPassword.value);
        state.user = await store.currentUser();
        await loadAll();
      } catch (error) {
        handleError(error);
      }
    });

    els.signUpBtn.addEventListener('click', async () => {
      try {
        await store.signUp(els.authEmail.value.trim(), els.authPassword.value);
        setStatus('Sign-up submitted. If email confirmation is enabled, confirm it and then sign in.');
      } catch (error) {
        handleError(error);
      }
    });

    els.signOutBtn.addEventListener('click', async () => {
      try {
        await store.signOut();
        setStatus('Signed out.');
      } catch (error) {
        handleError(error);
      }
    });
  }

  bindStaticEvents();
  initStore().catch(handleError);
})();
