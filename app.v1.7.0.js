(function () {
  const APP_CONFIG = window.APP_CONFIG || {};
  const SHARED_SCOPE_ID = 'tod-donna-shared';
  const VERSION = 'v1.7.0';

  const CATEGORY_ORDER = [
    'Fruit',
    'Vegetables',
    'Frozen',
    'Condiments',
    'Gluten Free',
    'Canned',
    'Ethnic',
    'Dried',
    'Spices',
    'Baking supplies',
    'Snacks',
    'Baked goods',
    'Coffee/Tea',
    'Juice/Pop',
    'Dairy',
    'Eggs',
    'Cheese',
    'Meat',
    'Alcohol',
    'Paper Goods',
    'Cleaning Supplies',
    'Pet Supplies',
    'Clothes',
    'Sporting Goods',
    'Household',
    'Gardening',
    'Holiday',
    'Health and Beauty',
    'Candy',
    'Plumbing',
    'Flooring',
    'Paint',
    'Fasteners',
    'Tools',
    'Windows/Doors',
    'Lumber',
    'Shelving',
    'Auto',
    'Other',
  ];

  const BUILTIN_STORES = [
    { store_key: 'shopping', store_label: 'Shopping', sort_order: 10, is_builtin: true, route_categories: [] },
    { store_key: 'walmart', store_label: 'Walmart', sort_order: 20, is_builtin: true, route_categories: [
      'Fruit', 'Vegetables', 'Frozen', 'Condiments', 'Gluten Free', 'Canned', 'Ethnic', 'Dried', 'Baking supplies',
      'Snacks', 'Baked goods', 'Coffee/Tea', 'Juice/Pop', 'Dairy', 'Eggs', 'Cheese', 'Meat', 'Alcohol',
      'Paper Goods', 'Cleaning Supplies', 'Pet Supplies', 'Clothes', 'Sporting Goods', 'Auto', 'Gardening',
      'Household', 'Fasteners', 'Holiday', 'Health and Beauty', 'Candy'
    ] },
    { store_key: 'meiers', store_label: "Meier's", sort_order: 30, is_builtin: true, route_categories: [
      'Fruit', 'Vegetables', 'Meat', 'Baked goods', 'Condiments', 'Canned', 'Dried', 'Ethnic', 'Spices',
      'Baking supplies', 'Coffee/Tea', 'Cheese', 'Frozen', 'Dairy', 'Eggs', 'Cleaning Supplies',
      'Snacks', 'Paper Goods', 'Candy', 'Juice/Pop', 'Alcohol', 'Clothes', 'Health and Beauty',
      'Gardening', 'Pet Supplies'
    ] },
    { store_key: 'super-one-negaunee', store_label: 'Super One Negaunee', sort_order: 40, is_builtin: true, route_categories: [
      'Fruit', 'Vegetables', 'Condiments', 'Meat', 'Canned', 'Gluten Free', 'Ethnic',
      'Baking supplies', 'Coffee/Tea', 'Paper Goods', 'Snacks', 'Dairy', 'Eggs', 'Frozen', 'Alcohol'
    ] },
    { store_key: 'menards', store_label: 'Menards', sort_order: 50, is_builtin: true, route_categories: [
      'Gardening', 'Plumbing', 'Flooring', 'Paint', 'Pet Supplies', 'Fasteners',
      'Tools', 'Windows/Doors', 'Lumber', 'Shelving', 'Auto'
    ] },
    { store_key: 'super-one-marquette', store_label: 'Super One Marquette', sort_order: 60, is_builtin: true, route_categories: [] },
    { store_key: 'mqt-food-co-op', store_label: 'Mqt. Food Co-Op', sort_order: 70, is_builtin: true, route_categories: [] },
  ];

  const BUILDER_NEW_STORE_KEY = '__new_store__';

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

  const TRIP_NOTE_LANES = [
    { key: 'trip-clothing', label: 'Clothing' },
    { key: 'trip-tents', label: 'Tent(s)' },
    { key: 'trip-fishing-gear', label: 'Fishing Gear' },
    { key: 'trip-boat-stuff', label: 'Boat Stuff' },
    { key: 'trip-cooking', label: 'Cooking' },
    { key: 'trip-food', label: 'Food' },
    { key: 'trip-toiletries', label: 'Toiletries' },
    { key: 'trip-bedding', label: 'Bedding / Sleeping' },
    { key: 'trip-first-aid', label: 'First Aid / Medicine' },
    { key: 'trip-tools', label: 'Tools / Repair' },
    { key: 'trip-electronics', label: 'Electronics / Charging' },
    { key: 'trip-paperwork', label: 'Paperwork / Licenses' },
    { key: 'trip-dog-stuff', label: 'Dog Stuff' },
    { key: 'trip-misc', label: 'Misc' },
  ];

  const BUILTIN_RULES = [
    { category: 'Fruit', keywords: ['apple', 'apples', 'banana', 'bananas', 'orange', 'oranges', 'grape', 'grapes', 'berries', 'strawberry', 'strawberries', 'blueberry', 'blueberries', 'raspberry', 'raspberries', 'blackberry', 'blackberries', 'pear', 'pears', 'peach', 'peaches', 'plum', 'plums', 'lemon', 'lemons', 'lime', 'limes', 'avocado', 'avocados', 'pineapple', 'melon', 'watermelon', 'cantaloupe', 'mandarin'] },
    { category: 'Vegetables', keywords: ['lettuce', 'romaine', 'spinach', 'celery', 'carrot', 'carrots', 'onion', 'onions', 'potato', 'potatoes', 'garlic', 'broccoli', 'cauliflower', 'pepper', 'peppers', 'tomato', 'tomatoes', 'cucumber', 'cucumbers', 'salad', 'mushroom', 'mushrooms', 'zucchini', 'squash', 'cabbage', 'green beans'] },
    { category: 'Frozen', keywords: ['frozen', 'ice cream', 'pizza', 'french fries', 'hash browns', 'waffles', 'tv dinner', 'frozen vegetables', 'frozen fruit'] },
    { category: 'Condiments', keywords: ['ketchup', 'mustard', 'mayo', 'mayonnaise', 'relish', 'salsa', 'soy sauce', 'vinegar', 'olive oil', 'hot sauce', 'salad dressing', 'bbq sauce', 'jam', 'jelly', 'peanut butter', 'pickle', 'pickles'] },
    { category: 'Gluten Free', keywords: ['gluten free', 'gf bread', 'gf pasta', 'gf crackers', 'gf flour'] },
    { category: 'Canned', keywords: ['canned', 'can of', 'soup', 'broth', 'beans', 'corn', 'peas', 'tuna', 'tomato sauce', 'diced tomatoes', 'crushed tomatoes', 'whole tomatoes', 'spam', 'canned pineapple', 'canned peaches', 'canned pears', 'mandarin oranges', 'fruit cup', 'fruit cocktail', 'olives'] },
    { category: 'Ethnic', keywords: ['tortilla', 'tortillas', 'salsa verde', 'enchilada', 'taco', 'tacos', 'ramen', 'curry paste', 'coconut milk', 'nori', 'soy sauce', 'fish sauce', 'tikka', 'naan'] },
    { category: 'Spices', keywords: ['spice', 'spices', 'seasoning', 'seasonings', 'black pepper', 'peppercorn', 'peppercorns', 'cinnamon', 'paprika', 'cumin', 'oregano', 'basil', 'thyme', 'rosemary', 'garlic powder', 'onion powder', 'chili powder'] },
    { category: 'Dried', keywords: ['flour', 'sugar', 'salt', 'pasta', 'rice', 'oats', 'oatmeal', 'cereal', 'lentils', 'breadcrumbs', 'cracker crumbs', 'macaroni', 'beans dry', 'dried beans', 'noodles'] },
    { category: 'Baking supplies', keywords: ['yeast', 'baking powder', 'baking soda', 'brown sugar', 'powdered sugar', 'cocoa', 'chocolate chips', 'vanilla', 'cake mix', 'frosting'] },
    { category: 'Baked goods', keywords: ['bread', 'breads', 'loaf', 'loaves', 'roll', 'rolls', 'bun', 'buns', 'bagel', 'bagels', 'muffin', 'muffins', 'donut', 'donuts', 'pastry', 'pastries', 'croissant', 'croissants', 'english muffin', 'english muffins'] },
    
    { category: 'Snacks', keywords: ['chips', 'pretzels', 'popcorn', 'cookies', 'cracker', 'crackers', 'nuts', 'trail mix', 'granola bar', 'granola bars'] },
    { category: 'Coffee/Tea', keywords: ['coffee', 'tea', 'creamer', 'k-cup', 'k cups'] },
    { category: 'Juice/Pop', keywords: ['juice', 'soda', 'sparkling water', 'water', 'cider', 'gatorade', 'pop', 'cola', 'root beer', 'ginger ale'] },
    { category: 'Dairy', keywords: ['milk', 'butter', 'cream', 'cream cheese', 'sour cream', 'cottage cheese', 'half and half', 'yogurt'] },
    { category: 'Eggs', keywords: ['egg', 'eggs'] },
    { category: 'Cheese', keywords: ['cheese', 'cheddar', 'mozzarella', 'parmesan', 'provolone', 'swiss'] },
    { category: 'Meat', keywords: ['beef', 'steak', 'hamburger', 'ground beef', 'chicken', 'pork', 'bacon', 'sausage', 'ham', 'turkey', 'salmon', 'fish fillet', 'shrimp'] },
    { category: 'Alcohol', keywords: ['beer', 'wine', 'vodka', 'whiskey', 'bourbon', 'tequila', 'rum', 'gin'] },
    { category: 'Paper Goods', keywords: ['paper towel', 'paper towels', 'toilet paper', 'tissues', 'napkins', 'paper plates', 'paper cups'] },
    { category: 'Cleaning Supplies', keywords: ['bleach', 'cleaner', 'spray', 'soap', 'dish soap', 'laundry', 'detergent', 'disinfectant', 'trash bags'] },
    { category: 'Pet Supplies', keywords: ['dog food', 'cat food', 'bird seed', 'pet', 'litter', 'treats', 'chews'] },
    { category: 'Clothes', keywords: ['shirt', 'shirts', 'pants', 'socks', 'underwear', 'boots', 'jacket', 'coat', 'hat', 'gloves'] },
    { category: 'Sporting Goods', keywords: ['ammo box', 'fishing line', 'hook', 'hooks', 'bobber', 'bobbers', 'sinker', 'lure', 'lures', 'camp chair', 'camp chairs'] },
    { category: 'Household', keywords: ['light bulb', 'light bulbs', 'storage tote', 'storage totes', 'hanger', 'hangers', 'broom', 'mop', 'bucket'] },
    { category: 'Gardening', keywords: ['soil', 'potting soil', 'mulch', 'fertilizer', 'seed', 'seeds', 'plant food', 'garden hose'] },
    { category: 'Holiday', keywords: ['christmas', 'easter', 'halloween', 'thanksgiving', 'valentine', 'ornament', 'gift wrap'] },
    { category: 'Health and Beauty', keywords: ['shampoo', 'conditioner', 'toothpaste', 'toothbrush', 'deodorant', 'lotion', 'bandages', 'vitamin', 'medicine', 'cold meds', 'cough syrup', 'antacid', 'razor', 'razors'] },
    { category: 'Candy', keywords: ['candy', 'chocolate', 'gum', 'mints'] },
    { category: 'Plumbing', keywords: ['pipe', 'pvc', 'faucet', 'valve', 'drain', 'plumbing', 'sink trap'] },
    { category: 'Flooring', keywords: ['tile', 'vinyl plank', 'vinyl flooring', 'laminate', 'underlayment', 'grout'] },
    { category: 'Paint', keywords: ['paint', 'primer', 'brush', 'roller', 'rollers', 'drop cloth'] },
    { category: 'Fasteners', keywords: ['screw', 'screws', 'nail', 'nails', 'bolt', 'bolts', 'washer', 'washers', 'nut', 'nuts'] },
    { category: 'Tools', keywords: ['hammer', 'drill', 'saw', 'wrench', 'pliers', 'tool', 'tools', 'tape measure'] },
    { category: 'Windows/Doors', keywords: ['window', 'windows', 'door', 'doors', 'hinge', 'hinges', 'weather strip', 'weatherstripping'] },
    { category: 'Lumber', keywords: ['2x4', '2x6', 'plywood', 'board', 'boards', 'lumber'] },
    { category: 'Shelving', keywords: ['shelf', 'shelves', 'shelving', 'bracket', 'brackets'] },
    { category: 'Auto', keywords: ['oil', 'wiper', 'wipers', 'coolant', 'washer fluid', 'antifreeze', 'air freshener', 'car cleaner'] },
  ];

  const CACHE_KEY = 'shared-shopping-list-cache-v4';

  const state = {
    currentTab: 'shopping',
    currentStoreFilter: 'master',
    modalStore: 'shopping',
    items: [],
    rules: [],
    stores: [...BUILTIN_STORES],
    categories: [...CATEGORY_ORDER],
    noteItems: [],
    ready: false,
    user: null,
    startupFailed: false,
    usingCachedView: false,
    syncLabel: 'Starting…',
    syncTone: 'starting',
    pendingWrites: 0,
    refreshTimers: {},
    refreshInFlight: {},
    syncResetTimer: null,
    liveChannelReady: false,
    builderSortables: [],
    storeBuilder: {
      selectedStoreKey: 'walmart',
      workingLabel: 'Walmart',
      workingRoute: [],
      dirty: false,
    },
  };

  const els = {
    modeBadge: document.getElementById('modeBadge'),
    syncBadge: document.getElementById('syncBadge'),
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

  function refreshCategoryPickerOptions() {
    const categories = getCategoryOrder();
    els.categoryPicker.innerHTML = categories
      .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
      .join('');
  }


  class SupabaseStore {
    async init() {
      if (!APP_CONFIG.supabaseUrl || !APP_CONFIG.supabaseAnonKey) {
        throw new Error('Missing Supabase URL or anon key in config.js');
      }
      this.householdId = SHARED_SCOPE_ID;
      this.client = window.supabase.createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      });
      const { data: sessionData, error: sessionError } = await this.client.auth.getSession();
      if (sessionError) throw sessionError;
      let session = sessionData?.session || null;
      if (!session) {
        const { data: anonData, error } = await this.client.auth.signInAnonymously();
        if (error) throw new Error(`Anonymous auth failed. Enable Anonymous sign-ins in Supabase Auth. ${error.message}`);
        session = anonData?.session || null;
      }
      state.user = session?.user || null;
      setModeBadge('Supabase shared mode');
      return true;
    }

    async currentUser() {
      return state.user;
    }

    async getItems() {
      const { data, error } = await this.client
        .from('shoppinglist_items')
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
        .from('shoppinglist_items')
        .upsert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    async getRules() {
      const { data, error } = await this.client
        .from('shoppinglist_rules')
        .select('*')
        .eq('household_id', this.householdId);
      if (error) throw error;
      return data || [];
    }

    async saveRule(rule) {
      const payload = { ...rule, household_id: this.householdId };
      const { data, error } = await this.client
        .from('shoppinglist_rules')
        .upsert(payload, { onConflict: 'household_id,item_key,store' })
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    async getLegacyNote() {
      const { data, error } = await this.client
        .from('shoppinglist_notes')
        .select('*')
        .eq('household_id', this.householdId)
        .limit(1);
      if (error) throw error;
      return data?.[0]?.body || '';
    }

    async saveLegacyNote(body) {
      const payload = { household_id: this.householdId, body, updated_at: new Date().toISOString() };
      const { error } = await this.client
        .from('shoppinglist_notes')
        .upsert(payload, { onConflict: 'household_id' });
      if (error) throw error;
      return body;
    }

    async getNoteItems() {
      const { data, error } = await this.client
        .from('shoppinglist_note_items')
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
        .from('shoppinglist_note_items')
        .upsert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    async deleteNoteItem(id) {
      const { error } = await this.client
        .from('shoppinglist_note_items')
        .delete()
        .eq('household_id', this.householdId)
        .eq('id', id);
      if (error) throw error;
      return true;
    }

    async getCategories() {
      const { data, error } = await this.client
        .from('shoppinglist_categories')
        .select('*')
        .eq('household_id', this.householdId)
        .order('sort_order', { ascending: true })
        .order('category_name', { ascending: true });
      if (error) throw error;
      return data || [];
    }

    async saveCategory(categoryDef) {
      const payload = { ...categoryDef, household_id: this.householdId };
      const { data, error } = await this.client
        .from('shoppinglist_categories')
        .upsert(payload, { onConflict: 'household_id,category_name' })
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    async getStores() {
      const { data, error } = await this.client
        .from('shoppinglist_stores')
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
        .from('shoppinglist_stores')
        .upsert(payload, { onConflict: 'household_id,store_key' })
        .select()
        .single();
      if (error) throw error;
      return data;
    }

startRealtime(onChange, onStatus) {
  const channel = this.client.channel(`shopping-live-${this.householdId}`);
  ['shoppinglist_items', 'shoppinglist_rules', 'shoppinglist_stores', 'shoppinglist_categories', 'shoppinglist_note_items'].forEach((tableName) => {
    channel.on('postgres_changes', { event: '*', schema: 'public', table: tableName }, (payload) => {
      try {
        onChange?.(tableName, payload);
      } catch (error) {
        console.error('Realtime handler failed.', error);
      }
    });
  });
  this.realtimeChannel = channel;
  channel.subscribe((status) => {
    onStatus?.(status);
  });
  return channel;
}

stopRealtime() {
  if (this.realtimeChannel) {
    this.client.removeChannel(this.realtimeChannel);
    this.realtimeChannel = null;
  }
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


  function readCachedSnapshot() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        stores: Array.isArray(parsed.stores) ? mergeStores(parsed.stores) : [...BUILTIN_STORES],
        categories: Array.isArray(parsed.categories) ? mergeCategories(parsed.categories) : [...CATEGORY_ORDER],
        savedAt: parsed.savedAt || null,
      };
    } catch (error) {
      console.warn('Cache read skipped.', error);
      return null;
    }
  }

  function writeCachedSnapshot() {
    try {
      const payload = {
        items: state.items || [],
        stores: getStoreDefs(),
        categories: getCategoryOrder(),
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn('Cache write skipped.', error);
    }
  }

  function normalizeName(value) {
    return String(value || '').toLowerCase().trim().replace(/\s+/g, ' ');
  }

  function slugifyStoreName(value) {
    return normalizeName(value).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
  }

  function normalizeCategoryName(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
  }

  function titleCaseCategory(value) {
    return normalizeCategoryName(value)
      .split(' ')
      .filter(Boolean)
      .map((part) => {
        if (part.includes('/')) {
          return part.split('/').map((sub) => sub ? `${sub.charAt(0).toUpperCase()}${sub.slice(1).toLowerCase()}` : '').join('/');
        }
        return `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`;
      })
      .join(' ');
  }

  function makeId() {
    return crypto?.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function mergeCategories(remoteCategories) {
    const seen = new Map();
    CATEGORY_ORDER.forEach((category, index) => {
      seen.set(category.toLowerCase(), {
        category_name: category,
        sort_order: (index + 1) * 10,
        is_builtin: true,
      });
    });
    (remoteCategories || []).forEach((entry, index) => {
      const categoryName = typeof entry === 'string' ? normalizeCategoryName(entry) : normalizeCategoryName(entry?.category_name);
      if (!categoryName) return;
      const key = categoryName.toLowerCase();
      const existing = seen.get(key) || {};
      seen.set(key, {
        category_name: categoryName,
        sort_order: Number.isFinite(Number(entry?.sort_order)) ? Number(entry.sort_order) : (existing.sort_order ?? (CATEGORY_ORDER.length + index + 1) * 10),
        is_builtin: Boolean(existing.is_builtin || entry?.is_builtin),
      });
    });
    return Array.from(seen.values())
      .sort((a, b) => {
        const diff = (a.sort_order ?? 9999) - (b.sort_order ?? 9999);
        if (diff) return diff;
        return a.category_name.localeCompare(b.category_name);
      })
      .map((entry) => entry.category_name);
  }

  function mergeStores(remoteStores) {
    const byKey = new Map();
    BUILTIN_STORES.forEach((storeDef) => byKey.set(storeDef.store_key, { ...storeDef, route_categories: [...(storeDef.route_categories || [])] }));
    (remoteStores || []).forEach((storeDef) => {
      if (!storeDef?.store_key) return;
      const existing = byKey.get(storeDef.store_key) || {};
      const routeCategories = Array.isArray(storeDef.route_categories) ? storeDef.route_categories.filter(Boolean) : (existing.route_categories || []);
      byKey.set(storeDef.store_key, {
        household_id: SHARED_SCOPE_ID,
        store_key: storeDef.store_key,
        store_label: storeDef.store_label || existing.store_label || storeDef.store_key,
        sort_order: Number.isFinite(Number(storeDef.sort_order)) ? Number(storeDef.sort_order) : (existing.sort_order ?? 999),
        is_builtin: Boolean(existing.is_builtin),
        route_categories: routeCategories,
        created_at: storeDef.created_at || existing.created_at || null,
      });
    });
    return Array.from(byKey.values()).sort((a, b) => {
      const diff = (a.sort_order ?? 999) - (b.sort_order ?? 999);
      if (diff) return diff;
      return (a.store_label || '').localeCompare(b.store_label || '');
    });
  }

  function getCategoryOrder() {
    return mergeCategories(state.categories);
  }

  function getStoreDefs() {
    return mergeStores(state.stores);
  }

  function getStoreTabs() {
    return [{ key: 'shopping', label: 'Shopping', type: 'store' }];
  }

  function getStoreFilterDefs() {
    return [
      { key: 'master', label: 'Master List', categories: getCategoryOrder() },
      ...getStoreDefs()
        .filter((entry) => entry.store_key !== 'shopping')
        .map((entry) => ({
          key: entry.store_key,
          label: entry.store_label,
          categories: Array.isArray(entry.route_categories) ? entry.route_categories : [],
        })),
    ];
  }

  function getStoreFilterDef(filterKey) {
    return getStoreFilterDefs().find((entry) => entry.key === filterKey) || getStoreFilterDefs()[0];
  }

  function getAllTabDefs() {
    return [
      ...getStoreTabs(),
      { key: 'parents', label: 'Parents', type: 'static' },
      { key: 'notes', label: 'Notes', type: 'static' },
      { key: 'trips', label: 'Trips & Packing', type: 'static' },
      { key: 'stores', label: 'Stores', type: 'static' },
      { key: 'removed', label: 'Recently Removed', type: 'static' },
    ];
  }

  function getStoreLabel(storeKey) {
    return getStoreDefs().find((entry) => entry.store_key === storeKey)?.store_label || storeKey;
  }

  function isStoreTab(tabName) {
    return tabName === 'shopping';
  }

  function isShaferTarget(item) {
    return item?.parent_target === 'schaffer' || item?.parent_target === 'shafer';
  }

  function isShoppingStore(item) {
    return !item?.store || item.store === 'ours' || getStoreDefs().some((entry) => entry.store_key === item.store);
  }

  function getShoppingItems() {
    return state.items.filter((item) => item.on_shopping_list && !item.removed);
  }

  function getItemsForStoreFilter(filterKey) {
    const filterDef = getStoreFilterDef(filterKey);
    const items = getShoppingItems();
    if (!filterDef || filterDef.key === 'master') return items;
    return items.filter((item) => filterDef.categories.includes(getEffectiveCategory(item)));
  }

  function setModeBadge(text) {
    els.modeBadge.textContent = text;
  }


function setSyncBadge(label, tone = 'starting') {
  state.syncLabel = label || 'Starting…';
  state.syncTone = tone || 'starting';
  if (!els.syncBadge) return;
  els.syncBadge.textContent = state.syncLabel;
  els.syncBadge.className = `sync-badge sync-${state.syncTone}`;
}

function pulseSavedState() {
  if (state.syncResetTimer) window.clearTimeout(state.syncResetTimer);
  state.syncResetTimer = window.setTimeout(() => {
    if (state.pendingWrites > 0) {
      setSyncBadge('Saving…', 'busy');
    } else if (!navigator.onLine) {
      setSyncBadge('Offline', 'offline');
    } else if (state.liveChannelReady) {
      setSyncBadge('Live', 'live');
    } else {
      setSyncBadge('Saved', 'saved');
    }
  }, 1200);
}

function beginWrite() {
  state.pendingWrites += 1;
  setSyncBadge('Saving…', 'busy');
}

function finishWrite(success = true) {
  state.pendingWrites = Math.max(0, state.pendingWrites - 1);
  if (!success) {
    setSyncBadge('Sync failed', 'error');
    return;
  }
  if (state.pendingWrites > 0) {
    setSyncBadge('Saving…', 'busy');
    return;
  }
  setSyncBadge('Saved', 'saved');
  pulseSavedState();
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
    setSyncBadge('Sync failed', 'error');
  }


function clearRefreshTimer(key) {
  if (!state.refreshTimers[key]) return;
  window.clearTimeout(state.refreshTimers[key]);
  state.refreshTimers[key] = null;
}

async function refreshRemoteSegment(segment = 'all', options = {}) {
  ensureStoreReady();
  if (state.refreshInFlight[segment]) return;
  state.refreshInFlight[segment] = true;
  const silent = Boolean(options.silent);
  if (!silent && state.pendingWrites === 0) setSyncBadge('Syncing…', 'busy');
  try {
    if (segment === 'items' || segment === 'all') {
      state.items = await store.getItems();
    }
    if (segment === 'rules' || segment === 'all') {
      state.rules = await store.getRules();
    }
    if (segment === 'stores' || segment === 'all') {
      state.stores = await store.getStores();
    }
    if (segment === 'categories' || segment === 'all') {
      state.categories = mergeCategories(await store.getCategories());
    }
    if (segment === 'notes' || segment === 'all') {
      state.noteItems = await store.getNoteItems();
    }
    writeCachedSnapshot();
    renderAll();
    if (state.pendingWrites === 0) {
      setSyncBadge(state.liveChannelReady ? 'Live' : 'Saved', state.liveChannelReady ? 'live' : 'saved');
    }
  } catch (error) {
    handleError(error);
  } finally {
    state.refreshInFlight[segment] = false;
  }
}

function scheduleRefresh(segment = 'all', delay = 180, options = {}) {
  clearRefreshTimer(segment);
  state.refreshTimers[segment] = window.setTimeout(() => {
    refreshRemoteSegment(segment, options);
  }, delay);
}

function handleRealtimeChange(tableName, payload) {
  const row = payload?.new || payload?.old || {};
  if (row.household_id && row.household_id !== SHARED_SCOPE_ID) return;
  if (tableName === 'shoppinglist_items') scheduleRefresh('items', 120);
  else if (tableName === 'shoppinglist_rules') scheduleRefresh('rules', 150, { silent: true });
  else if (tableName === 'shoppinglist_stores') scheduleRefresh('stores', 150);
  else if (tableName === 'shoppinglist_categories') scheduleRefresh('categories', 150);
  else if (tableName === 'shoppinglist_note_items') scheduleRefresh('notes', 120);
}

function handleRealtimeStatus(status) {
  if (status === 'SUBSCRIBED') {
    state.liveChannelReady = true;
    if (state.pendingWrites > 0) setSyncBadge('Saving…', 'busy');
    else setSyncBadge('Live', 'live');
    return;
  }
  if (status === 'TIMED_OUT') {
    state.liveChannelReady = false;
    setSyncBadge('Realtime slow', 'reconnecting');
    scheduleRefresh('all', 300, { silent: true });
    return;
  }
  if (status === 'CHANNEL_ERROR') {
    state.liveChannelReady = false;
    setSyncBadge('Live sync issue', 'error');
    return;
  }
  if (status === 'CLOSED') {
    state.liveChannelReady = false;
    setSyncBadge('Reconnecting…', 'reconnecting');
  }
}

function startLiveSync() {
  ensureStoreReady();
  store.stopRealtime?.();
  store.startRealtime(handleRealtimeChange, handleRealtimeStatus);
}

function bindConnectivityRefresh() {
  window.addEventListener('online', () => {
    setSyncBadge('Reconnecting…', 'reconnecting');
    scheduleRefresh('all', 120, { silent: true });
  });
  window.addEventListener('offline', () => {
    setSyncBadge('Offline', 'offline');
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.ready) {
      scheduleRefresh('all', 100, { silent: true });
    }
  });
  window.setInterval(() => {
    if (state.ready && document.visibilityState === 'visible') {
      scheduleRefresh('all', 120, { silent: true });
    }
  }, 45000);
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

  function getLearnedRule(normalizedName, storeName = 'shopping') {
    return state.rules.find((rule) => rule.item_key === normalizedName && rule.store === storeName)
      || state.rules.find((rule) => rule.item_key === normalizedName && rule.store === 'shopping')
      || state.rules.find((rule) => rule.item_key === normalizedName && rule.store === 'master')
      || state.rules.find((rule) => rule.item_key === normalizedName);
  }

  function guessCategory(itemName, storeName = 'shopping') {
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

  function getEffectiveCategory(item) {
    const raw = normalizeCategoryName(item?.category);
    if (getCategoryOrder().includes(raw)) return raw;

    const guessed = guessCategory(item?.item_name || '', 'shopping');
    if (guessed) return guessed;

    switch (raw) {
      case 'Produce': return 'Vegetables';
      case 'Deli': return 'Meat';
      case 'Vegan': return 'Gluten Free';
      case 'Dry Goods': return 'Dried';
      case 'Bakery': return 'Baked goods';
      case 'Beverages': return 'Juice/Pop';
      case 'Dairy / Eggs': return 'Dairy';
      case 'Cleaning': return 'Cleaning Supplies';
      case 'Paper Products': return 'Paper Goods';
      case 'Medicine': return 'Health and Beauty';
      case 'Baking': return 'Baking supplies';
      default: return raw || 'Other';
    }
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
    const firstCategory = getCategoryOrder()[0] || 'Other';
    refreshCategoryPickerOptions();
    els.categoryPicker.value = firstCategory;
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
    beginWrite();
    try {
      await store.saveRule({
        household_id: SHARED_SCOPE_ID,
        item_key: itemKey,
        category,
        store: storeName,
        updated_at: new Date().toISOString(),
      });
      state.rules = await store.getRules();
      finishWrite(true);
    } catch (error) {
      finishWrite(false);
      throw error;
    }
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
    beginWrite();
    try {
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
      finishWrite(true);
    } catch (error) {
      finishWrite(false);
      throw error;
    }
  }

  async function saveStoreFromBuilder() {
    ensureStoreReady();
    const labelInput = document.querySelector('[data-builder-store-name]');
    const label = normalizeCategoryName(labelInput?.value || state.storeBuilder.workingLabel || '');
    if (!label) throw new Error('Give the store a name first.');
    const key = state.storeBuilder.selectedStoreKey === BUILDER_NEW_STORE_KEY
      ? slugifyStoreName(label)
      : state.storeBuilder.selectedStoreKey;
    if (!key) throw new Error('That store name does not produce a usable key.');
    const existing = getStoreDefs().find((entry) => entry.store_key === key);
    const maxOrder = Math.max(...getStoreDefs().map((entry) => Number(entry.sort_order) || 0), 0);
    beginWrite();
    try {
      await store.saveStore({
        household_id: SHARED_SCOPE_ID,
        store_key: key,
        store_label: label,
        sort_order: existing?.sort_order ?? (maxOrder + 10),
        route_categories: Array.from(new Set((state.storeBuilder.workingRoute || []).map(normalizeCategoryName).filter(Boolean))),
      });
      state.stores = await store.getStores();
      state.storeBuilder.selectedStoreKey = key;
      state.storeBuilder.workingLabel = label;
      state.storeBuilder.workingRoute = [...(getStoreDefs().find((entry) => entry.store_key === key)?.route_categories || state.storeBuilder.workingRoute)];
      state.storeBuilder.dirty = false;
      state.currentStoreFilter = key;
      renderAll();
      setStatus(`Saved store route for ${label}.`);
      finishWrite(true);
    } catch (error) {
      finishWrite(false);
      throw error;
    }
  }

  async function addCategoryFromBuilder() {
    ensureStoreReady();
    const input = document.querySelector('[data-builder-new-category]');
    const raw = input?.value || '';
    const categoryName = titleCaseCategory(raw);
    if (!categoryName) return;
    if (getCategoryOrder().some((entry) => entry.toLowerCase() === categoryName.toLowerCase())) {
      if (input) input.value = '';
      setStatus(`${categoryName} is already in the category list.`);
      return;
    }
    const maxSort = getCategoryOrder().length * 10;
    beginWrite();
    try {
      await store.saveCategory({
        household_id: SHARED_SCOPE_ID,
        category_name: categoryName,
        sort_order: maxSort + 10,
        is_builtin: false,
      });
      state.categories = mergeCategories(await store.getCategories());
      if (input) input.value = '';
      setStatus(`Added category: ${categoryName}.`);
      finishWrite(true);
      renderAll();
    } catch (error) {
      finishWrite(false);
      throw error;
    }
  }

  async function addItemFromModal() {
    ensureStoreReady();
    const itemName = els.itemNameInput.value.trim();
    if (!itemName) return;
    let category = guessCategory(itemName, 'shopping');
    const normalized = normalizeName(itemName);

    if (!category && els.categoryPickerWrap.classList.contains('hidden')) {
      els.categoryPickerWrap.classList.remove('hidden');
      els.categoryPicker.focus();
      return;
    }

    if (!category) {
      category = els.categoryPicker.value;
      await saveRule(normalized, category, 'shopping');
    }

    const item = baseItem(itemName, category, 'shopping', currentParentSelection());
    await persistItem(item);
    if (!guessCategory(itemName, 'shopping')) {
      await saveRule(normalized, category, 'shopping');
    }
    closeModal();
    setStatus(`Added ${itemName}.`);
  }

  function getItemsForTab(tabName) {
    if (tabName === 'shopping') {
      return getItemsForStoreFilter(state.currentStoreFilter);
    }
    if (tabName === 'parents') {
      return state.items.filter((item) => item.parent_target && !item.removed && !item.delivered);
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
    if (tabName === 'shopping') {
      return getShoppingItems().some((item) => !item.purchased_main);
    }
    if (tabName === 'parents') {
      return getItemsForTab('parents').some((item) => !item.parent_checked);
    }
    if (tabName === 'notes') {
      return NOTE_LANES.some((lane) => getNotesForLane(lane.key).some((note) => !note.is_checked && note.body?.trim()));
    }
    if (tabName === 'trips') {
      return TRIP_NOTE_LANES.some((lane) => getNotesForLane(lane.key).some((note) => !note.is_checked && note.body?.trim()));
    }
    return false;
  }

  function getView(tabName) {
    return document.getElementById(`view-${tabName}`);
  }

  function ensureCurrentStoreFilter() {
    const defs = getStoreFilterDefs();
    if (!defs.some((entry) => entry.key === state.currentStoreFilter)) {
      state.currentStoreFilter = 'master';
    }
  }

  function getEditableStoreDefs() {
    return getStoreDefs().filter((entry) => entry.store_key !== 'shopping');
  }

  function ensureStoreBuilderState() {
    const editableStores = getEditableStoreDefs();
    const selectedKey = state.storeBuilder.selectedStoreKey;
    const existing = editableStores.find((entry) => entry.store_key === selectedKey);
    if (existing) {
      if (!state.storeBuilder.dirty) {
        state.storeBuilder.workingLabel = existing.store_label;
        state.storeBuilder.workingRoute = [...(existing.route_categories || [])];
      }
      return;
    }
    const fallback = editableStores[0];
    if (fallback) {
      state.storeBuilder.selectedStoreKey = fallback.store_key;
      state.storeBuilder.workingLabel = fallback.store_label;
      state.storeBuilder.workingRoute = [...(fallback.route_categories || [])];
      state.storeBuilder.dirty = false;
    } else {
      state.storeBuilder.selectedStoreKey = BUILDER_NEW_STORE_KEY;
      state.storeBuilder.workingLabel = '';
      state.storeBuilder.workingRoute = [];
      state.storeBuilder.dirty = false;
    }
  }

  function selectBuilderStore(storeKey) {
    const editableStores = getEditableStoreDefs();
    if (storeKey === BUILDER_NEW_STORE_KEY) {
      state.storeBuilder.selectedStoreKey = BUILDER_NEW_STORE_KEY;
      state.storeBuilder.workingLabel = '';
      state.storeBuilder.workingRoute = [];
      state.storeBuilder.dirty = false;
      return;
    }
    const found = editableStores.find((entry) => entry.store_key === storeKey) || editableStores[0];
    if (!found) return;
    state.storeBuilder.selectedStoreKey = found.store_key;
    state.storeBuilder.workingLabel = found.store_label;
    state.storeBuilder.workingRoute = [...(found.route_categories || [])];
    state.storeBuilder.dirty = false;
  }

  function syncBuilderRouteFromDom() {
    const routeEl = document.querySelector('[data-builder-route]');
    if (!routeEl) return;
    const names = Array.from(routeEl.querySelectorAll('[data-category-name]'))
      .map((node) => normalizeCategoryName(node.dataset.categoryName))
      .filter(Boolean);
    state.storeBuilder.workingRoute = Array.from(new Set(names));
    state.storeBuilder.dirty = true;
  }

  function destroyBuilderSortables() {
    (state.builderSortables || []).forEach((instance) => {
      try { instance.destroy(); } catch (error) {}
    });
    state.builderSortables = [];
  }

  function initStoreBuilderSortables() {
    destroyBuilderSortables();
    const availableEl = document.querySelector('[data-builder-available]');
    const routeEl = document.querySelector('[data-builder-route]');
    if (!availableEl || !routeEl || !window.Sortable) return;
    const refreshAfterSort = () => {
      syncBuilderRouteFromDom();
      renderAll();
    };
    const availableSortable = new window.Sortable(availableEl, {
      group: { name: 'store-builder', pull: 'clone', put: false },
      sort: false,
      animation: 150,
      fallbackOnBody: true,
      forceFallback: true,
    });
    const routeSortable = new window.Sortable(routeEl, {
      group: { name: 'store-builder', pull: true, put: true },
      animation: 150,
      fallbackOnBody: true,
      forceFallback: true,
      onAdd: refreshAfterSort,
      onUpdate: refreshAfterSort,
    });
    state.builderSortables = [availableSortable, routeSortable];
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

    els.tabBar.innerHTML = tabs.map((tab) => `
      <button class="tab ${tab.key === state.currentTab ? 'active' : ''} ${hasTabFlag(tab.key) ? 'has-flag' : ''}" data-tab="${escapeHtml(tab.key)}">
        <span class="tab-label">${escapeHtml(tab.label)}</span>
        ${hasTabFlag(tab.key) ? '<span class="tab-flag-dot" aria-hidden="true"></span>' : ''}
      </button>
    `).join('');

    els.mainGrid.innerHTML = tabs.map((tab) => `
      <section id="view-${escapeHtml(tab.key)}" class="view ${tab.key === state.currentTab ? 'active' : ''}"></section>
    `).join('');
  }

  function renderShoppingFilters() {
    return `
      <div class="store-filter-bar">
        ${getStoreFilterDefs().map((filterDef) => `
          <button
            class="store-filter-btn ${filterDef.key === state.currentStoreFilter ? 'active' : ''}"
            data-action="set-shopping-filter"
            data-filter="${escapeHtml(filterDef.key)}"
          >
            ${escapeHtml(filterDef.label)}
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderCategorizedItems(items, options = {}) {
    const categoryOrder = options.categoryOrder || CATEGORY_ORDER;
    const groups = new Map();
    categoryOrder.forEach((category) => groups.set(category, []));
    items.forEach((item) => {
      const category = getEffectiveCategory(item);
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category).push(item);
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
          <span class="category-chip">${escapeHtml(getEffectiveCategory(item))}</span>
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
            <span class="category-chip">${escapeHtml(getEffectiveCategory(item))}</span>
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

  function renderShoppingView() {
    const filterDef = getStoreFilterDef(state.currentStoreFilter);
    const items = getItemsForStoreFilter(filterDef.key);
    const actions = `
      <button class="control-btn" data-action="open-add" data-store="shopping" ${state.ready ? '' : 'disabled'}>Add item</button>
      <button class="control-btn" data-action="open-store-builder" ${state.ready ? '' : 'disabled'}>Store builder</button>
      <button class="control-btn primary" data-action="done-store" data-store="shopping" ${(state.ready && items.some((item) => item.purchased_main)) ? '' : 'disabled'}>Done</button>
    `;
    const view = getView('shopping');
    if (!view) return;
    view.innerHTML = panelShell(
      `Shopping — ${filterDef.label}`,
      actions,
      `${renderShoppingFilters()}${renderCategorizedItems(items, { categoryOrder: filterDef.categories })}`
    );
  }

  function renderStoreBuilder() {
    ensureStoreBuilderState();
    const view = getView('stores');
    if (!view) return;
    const editableStores = getEditableStoreDefs();
    const availableCategories = getCategoryOrder().filter((category) => !state.storeBuilder.workingRoute.includes(category));
    const routeCards = state.storeBuilder.workingRoute.length
      ? state.storeBuilder.workingRoute.map((category, index) => `
        <div class="route-grid-item" data-category-name="${escapeHtml(category)}">
          <div class="route-number">${index + 1}</div>
          <div class="route-name-wrap">
            <div class="route-name">${escapeHtml(category)}</div>
            <div class="route-hint">Drag to reorder</div>
          </div>
          <button class="icon-btn route-remove-btn" data-action="builder-remove-route-category" data-category="${escapeHtml(category)}" aria-label="Remove ${escapeHtml(category)}">✕</button>
        </div>
      `).join('')
      : '<div class="empty-state compact-empty">Drag or tap categories into the route list.</div>';

    const availableCards = availableCategories.length
      ? availableCategories.map((category) => `
        <button class="builder-category-pill" type="button" data-action="builder-add-category-to-route" data-category="${escapeHtml(category)}" data-category-name="${escapeHtml(category)}">
          <span class="drag-dots" aria-hidden="true">⋮⋮</span>
          <span>${escapeHtml(category)}</span>
        </button>
      `).join('')
      : '<div class="empty-state compact-empty">Every category is already in this route.</div>';

    const dirtyChip = state.storeBuilder.dirty ? '<span class="helper-chip">Unsaved</span>' : '<span class="badge">Saved</span>';
    const note = window.Sortable ? 'Drag to reorder on the phone. If dragging gets fussy, tap a category to add it and then drag the numbered cards.' : 'Tap categories to add them. Drag support is unavailable until the Sortable library loads.';

    view.innerHTML = panelShell('Store Builder', '', `
      <div class="store-builder-wrap">
        <section class="builder-card">
          <div class="builder-card-head">
            <div>
              <div class="builder-card-title">Store setup</div>
              <div class="builder-card-sub">${note}</div>
            </div>
            ${dirtyChip}
          </div>
          <div class="builder-form-grid">
            <label class="full-row">
              <span>Store</span>
              <select data-builder-store-select>
                ${editableStores.map((storeDef) => `<option value="${escapeHtml(storeDef.store_key)}" ${storeDef.store_key === state.storeBuilder.selectedStoreKey ? 'selected' : ''}>${escapeHtml(storeDef.store_label)}</option>`).join('')}
                <option value="${BUILDER_NEW_STORE_KEY}" ${state.storeBuilder.selectedStoreKey === BUILDER_NEW_STORE_KEY ? 'selected' : ''}>+ New store</option>
              </select>
            </label>
            <label class="full-row">
              <span>Store name</span>
              <input type="text" maxlength="60" value="${escapeHtml(state.storeBuilder.workingLabel || '')}" data-builder-store-name placeholder="Store name" />
            </label>
          </div>
          <div class="builder-actions-row">
            <button class="primary-btn" type="button" data-action="builder-save-store" ${state.ready ? '' : 'disabled'}>Save store</button>
            <button class="secondary-btn" type="button" data-action="builder-new-store">Blank route</button>
          </div>
        </section>

        <section class="builder-card">
          <div class="builder-card-head">
            <div>
              <div class="builder-card-title">Available categories</div>
              <div class="builder-card-sub">Tap to add or drag into the route grid.</div>
            </div>
          </div>
          <div class="builder-add-row">
            <input type="text" maxlength="60" placeholder="Add a new category" data-builder-new-category />
            <button class="secondary-btn" type="button" data-action="builder-add-category" ${state.ready ? '' : 'disabled'}>Add</button>
          </div>
          <div class="builder-category-palette" data-builder-available>
            ${availableCards}
          </div>
        </section>

        <section class="builder-card">
          <div class="builder-card-head">
            <div>
              <div class="builder-card-title">Numbered route grid</div>
              <div class="builder-card-sub">This is the order items will appear in that store.</div>
            </div>
          </div>
          <div class="route-grid" data-builder-route>
            ${routeCards}
          </div>
        </section>
      </div>
    `);
  }

  function renderParents() {
    const poirierItems = state.items.filter((item) => item.parent_target === 'poirier' && !item.removed && !item.delivered);
    const schafferItems = state.items.filter((item) => isShaferTarget(item) && !item.removed && !item.delivered);

    const renderParentSection = (title, key, items) => `
      <section class="parent-section ${items.length ? '' : 'empty-parent-section'}">
        <div class="parent-section-head">
          <div class="parent-section-title">${escapeHtml(title)}</div>
          <div class="panel-actions">
            <button class="control-btn primary" data-action="delivered-parent" data-parent="${escapeHtml(key)}" ${items.some((item) => item.parent_checked) ? '' : 'disabled'}>Delivered</button>
          </div>
        </div>
        ${items.length ? renderCategorizedItems(items, { parentMode: true, categoryOrder: CATEGORY_ORDER }) : '<div class="empty-state compact-empty">Nothing pending.</div>'}
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

  function renderTrips() {
    const view = getView('trips');
    if (!view) return;
    view.innerHTML = panelShell('Trips & Packing', '', `
      <div class="notes-sections-wrap">
        ${TRIP_NOTE_LANES.map((laneDef) => renderNoteLane(laneDef)).join('')}
      </div>
    `);
  }

  function renderAll() {
    ensureCurrentStoreFilter();
    renderTabBarAndViews();
    renderShoppingView();
    renderParents();
    renderNotes();
    renderTrips();
    renderStoreBuilder();
    const removedView = getView('removed');
    if (removedView) removedView.innerHTML = renderRemoved(getItemsForTab('removed'));
    refreshCategoryPickerOptions();
    bindDynamicEvents();
    switchTab(state.currentTab);
    initStoreBuilderSortables();
  }

  async function persistItem(item) {
    ensureStoreReady();
    beginWrite();
    try {
      const saved = await store.saveItem(item);
      const idx = state.items.findIndex((x) => x.id === saved.id);
      if (idx >= 0) state.items[idx] = saved;
      else state.items.push(saved);
      writeCachedSnapshot();
      renderAll();
      finishWrite(true);
      return saved;
    } catch (error) {
      finishWrite(false);
      throw error;
    }
  }

  async function persistNoteItem(note) {
    ensureStoreReady();
    beginWrite();
    try {
      const saved = await store.saveNoteItem(note);
      const idx = state.noteItems.findIndex((x) => x.id === saved.id);
      if (idx >= 0) state.noteItems[idx] = saved;
      else state.noteItems.push(saved);
      renderAll();
      finishWrite(true);
      return saved;
    } catch (error) {
      finishWrite(false);
      throw error;
    }
  }

  async function removeNoteItem(id) {
    ensureStoreReady();
    beginWrite();
    try {
      await store.deleteNoteItem(id);
      state.noteItems = state.noteItems.filter((note) => note.id !== id);
      renderAll();
      finishWrite(true);
    } catch (error) {
      finishWrite(false);
      throw error;
    }
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
      if (!item.on_shopping_list || item.removed || !item.purchased_main) return false;
      if (storeName !== 'shopping') return item.store === storeName;
      const filterDef = getStoreFilterDef(state.currentStoreFilter);
      return filterDef.key === 'master' || filterDef.categories.includes(getEffectiveCategory(item));
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
    setStatus(`Checked items cleared from ${getStoreFilterDef(state.currentStoreFilter).label}.`);
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
    els.floatingAddBtn.classList.toggle('hidden', !state.ready || ['notes', 'trips', 'stores', 'removed', 'parents'].includes(tabName));
    const targetStore = isStoreTab(tabName) ? tabName : 'shopping';
    els.floatingAddBtn.dataset.store = targetStore;
    els.floatingAddBtn.title = 'Add shopping item';
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
        const filterKey = event.currentTarget.dataset.filter;
        try {
          if (action === 'open-add') await openModal(storeName);
          else if (action === 'remove') await removeItem(id);
          else if (action === 'restore') await restoreItem(id);
          else if (action === 'done-store') await shoppedStore(storeName);
          else if (action === 'delivered-parent') await deliveredParent(parentKey);
          else if (action === 'add-note') await addNoteFromLane(lane);
          else if (action === 'delete-note') await removeNoteItem(id);
          else if (action === 'set-shopping-filter') {
            state.currentStoreFilter = filterKey || 'master';
            renderAll();
          }
          else if (action === 'open-store-builder') {
            state.currentTab = 'stores';
            renderAll();
          }
          else if (action === 'builder-new-store') {
            selectBuilderStore(BUILDER_NEW_STORE_KEY);
            renderAll();
          }
          else if (action === 'builder-add-category-to-route') {
            const categoryName = normalizeCategoryName(event.currentTarget.dataset.category || '');
            if (categoryName && !state.storeBuilder.workingRoute.includes(categoryName)) {
              state.storeBuilder.workingRoute.push(categoryName);
              state.storeBuilder.dirty = true;
              renderAll();
            }
          }
          else if (action === 'builder-remove-route-category') {
            const categoryName = normalizeCategoryName(event.currentTarget.dataset.category || '');
            state.storeBuilder.workingRoute = state.storeBuilder.workingRoute.filter((entry) => entry !== categoryName);
            state.storeBuilder.dirty = true;
            renderAll();
          }
          else if (action === 'builder-save-store') await saveStoreFromBuilder()
          else if (action === 'builder-add-category') await addCategoryFromBuilder()
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

    document.querySelectorAll('[data-builder-store-select]').forEach((select) => {
      select.addEventListener('change', (event) => {
        selectBuilderStore(event.currentTarget.value || BUILDER_NEW_STORE_KEY);
        renderAll();
      });
    });

    document.querySelectorAll('[data-builder-store-name]').forEach((input) => {
      input.addEventListener('input', (event) => {
        state.storeBuilder.workingLabel = event.currentTarget.value;
        state.storeBuilder.dirty = true;
      });
    });

    document.querySelectorAll('[data-builder-new-category]').forEach((input) => {
      input.addEventListener('keydown', async (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        try {
          await addCategoryFromBuilder();
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

    const items = await store.getItems();
    state.items = items || [];
    state.usingCachedView = false;
    writeCachedSnapshot();
    renderAll();
    setStatus(`Connected. Loading the rest…`);

    const [rules, legacyNote, stores, noteItems, categories] = await Promise.all([
      store.getRules(),
      store.getLegacyNote(),
      store.getStores(),
      store.getNoteItems(),
      store.getCategories(),
    ]);

    state.rules = rules || [];
    state.stores = stores || [...BUILTIN_STORES];
    state.noteItems = noteItems || [];
    state.categories = mergeCategories(categories || []);
    await migrateLegacyNotesIfNeeded(legacyNote);
    writeCachedSnapshot();
    renderAll();
    startLiveSync();
    setStatus('Ready.');
    setSyncBadge('Live', 'live');
  }

  async function initStore() {
    let slowTimer = null;
    try {
      state.startupFailed = false;
      setModeBadge('Connecting…');
      setSyncBadge('Starting…', 'starting');
      setStatus('Connecting to Supabase…');

      const cached = readCachedSnapshot();
      if (cached?.items?.length) {
        state.items = cached.items;
        state.stores = cached.stores || [...BUILTIN_STORES];
        state.categories = cached.categories || [...CATEGORY_ORDER];
        state.usingCachedView = true;
        renderAll();
        setStatus('Showing saved list while Supabase connects…');
      } else {
        renderStartupLoading('Connecting to Supabase…');
      }

      slowTimer = window.setTimeout(() => {
        if (!state.ready) {
          setModeBadge('Connecting…');
          setSyncBadge('Connecting…', 'busy');
          setStatus(state.usingCachedView ? 'Still syncing with Supabase…' : 'Still connecting to Supabase…');
          if (!state.usingCachedView) {
            renderStartupLoading('Still connecting to Supabase…', 'Phone connections can take a few extra seconds.');
          }
        }
      }, 1800);
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
        ? 'Supabase setup issue: this build needs the latest SQL, including shoppinglist_categories and route columns.'
        : `Supabase setup issue: ${error.message}`;
      setSyncBadge('Sync failed', 'error');
      setStatus(message, true);
      if (!state.usingCachedView) renderStartupError(message);
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
