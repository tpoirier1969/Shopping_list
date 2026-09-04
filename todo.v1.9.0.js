/* Shared Shopping List v1.9.0
 * To Do module backed by Poirier's Planner's existing public.tod_donna_calendar_tasks table.
 * No duplicate task table is created here.
 */
(function () {
  'use strict';

  const APP_CONFIG = window.APP_CONFIG || {};
  const TASK_TABLE = 'tod_donna_calendar_tasks';
  const VIEWER_STORAGE = 'shared-shopping-task-person-v1';
  const POLL_MS = 12000;

  const state = {
    tasks: [],
    viewer: localStorage.getItem(VIEWER_STORAGE) === 'donna' ? 'donna' : 'tod',
    active: false,
    loading: false,
    client: null,
    channel: null,
    pollTimer: null,
  };

  const els = {
    todoTabBtn: document.getElementById('todoTabBtn'),
    todoTabFlag: document.getElementById('todoTabFlag'),
    tabBar: document.getElementById('tabBar'),
    mainGrid: document.getElementById('mainGrid'),
    todoGrid: document.getElementById('todoGrid'),
    floatingAddBtn: document.getElementById('floatingAddBtn'),
    taskModal: document.getElementById('taskModal'),
    taskForm: document.getElementById('taskForm'),
    taskModalTitle: document.getElementById('taskModalTitle'),
    taskIdInput: document.getElementById('taskIdInput'),
    taskTitleInput: document.getElementById('taskTitleInput'),
    taskPersonInput: document.getElementById('taskPersonInput'),
    taskWhenInput: document.getElementById('taskWhenInput'),
    taskDateWrap: document.getElementById('taskDateWrap'),
    taskDateInput: document.getElementById('taskDateInput'),
    taskImportantInput: document.getElementById('taskImportantInput'),
    taskNotesInput: document.getElementById('taskNotesInput'),
    deleteTaskBtn: document.getElementById('deleteTaskBtn'),
    closeTaskModalBtn: document.getElementById('closeTaskModalBtn'),
    cancelTaskModalBtn: document.getElementById('cancelTaskModalBtn'),
  };

  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function makeId() {
    return window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : `task-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function todayIso() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function normalizeTask(row) {
    return {
      id: row?.id || makeId(),
      title: String(row?.title || '').trim(),
      notes: String(row?.notes || ''),
      person_key: ['tod', 'donna', 'shared'].includes(row?.person_key) ? row.person_key : 'shared',
      task_mode: ['timeless', 'from_date', 'specific_date'].includes(row?.task_mode) ? row.task_mode : 'timeless',
      assigned_date: row?.assigned_date || null,
      priority: row?.priority === 'important' ? 'important' : 'normal',
      completed: Boolean(row?.completed),
      completed_at: row?.completed_at || null,
      sort_order: Number(row?.sort_order || 0),
      created_at: row?.created_at || null,
      updated_at: row?.updated_at || null,
    };
  }

  function personLabel(key) {
    if (key === 'donna') return 'Donna';
    if (key === 'tod') return 'Tod';
    return 'Shared';
  }

  function dateLabel(value) {
    if (!value) return '';
    const d = new Date(`${value}T00:00:00`);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function whenLabel(task) {
    if (task.task_mode === 'timeless') return 'Any day';
    const label = dateLabel(task.assigned_date);
    return task.task_mode === 'from_date' ? `Starts ${label}` : label;
  }

  function visibleToViewer(task) {
    return !task.completed && (task.person_key === 'shared' || task.person_key === state.viewer);
  }

  function visibleTasks() {
    return state.tasks
      .filter(visibleToViewer)
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority === 'important' ? -1 : 1;
        const orderDiff = Number(a.sort_order || 0) - Number(b.sort_order || 0);
        if (orderDiff) return orderDiff;
        const dateDiff = String(a.assigned_date || '').localeCompare(String(b.assigned_date || ''));
        if (dateDiff) return dateDiff;
        return a.title.localeCompare(b.title);
      });
  }

  function taskRow(task) {
    return `
      <div class="todo-row ${task.priority === 'important' ? 'important' : ''}">
        <label class="check-wrap todo-check">
          <input type="checkbox" data-todo-action="complete" data-id="${esc(task.id)}" aria-label="Complete ${esc(task.title)}" />
        </label>
        <button type="button" class="todo-main" data-todo-action="edit" data-id="${esc(task.id)}">
          <span class="todo-title">${task.priority === 'important' ? '<span class="todo-important-mark">!</span>' : ''}${esc(task.title)}</span>
          <span class="todo-meta">
            <span class="badge">${esc(personLabel(task.person_key))}</span>
            <span class="category-chip">${esc(whenLabel(task))}</span>
            ${task.notes ? `<span class="todo-notes">${esc(task.notes)}</span>` : ''}
          </span>
        </button>
      </div>`;
  }

  function taskGroup(title, tasks) {
    if (!tasks.length) return '';
    return `
      <section class="todo-group">
        <div class="category-head"><div class="category-title">${esc(title)}</div></div>
        <div class="todo-list">${tasks.map(taskRow).join('')}</div>
      </section>`;
  }

  function render(errorMessage = '') {
    const current = visibleTasks();
    const timeless = current.filter((task) => task.task_mode === 'timeless');
    const dated = current.filter((task) => task.task_mode !== 'timeless');
    const count = current.length;

    els.todoTabFlag?.classList.toggle('hidden', count === 0);

    if (!els.todoGrid) return;
    const body = errorMessage
      ? `<div class="empty-state todo-error">${esc(errorMessage)}</div>`
      : state.loading && !state.tasks.length
        ? '<div class="empty-state">Loading tasks…</div>'
        : count
          ? `${taskGroup('Any day', timeless)}${taskGroup('Dated', dated)}`
          : '<div class="empty-state">No unfinished tasks.</div>';

    els.todoGrid.innerHTML = `
      <div class="panel">
        <div class="panel-head">
          <div class="panel-title-row">
            <h2 class="panel-title">To Do</h2>
            <div class="panel-actions">
              <label class="task-view-control">
                <span>View</span>
                <select id="todoViewerSelect">
                  <option value="tod" ${state.viewer === 'tod' ? 'selected' : ''}>Tod + Shared</option>
                  <option value="donna" ${state.viewer === 'donna' ? 'selected' : ''}>Donna + Shared</option>
                </select>
              </label>
              <button type="button" class="control-btn primary" data-todo-action="add">Add task</button>
            </div>
          </div>
        </div>
        <div class="todo-wrap">${body}</div>
      </div>`;

    bindRenderedEvents();
  }

  function setActive(active) {
    state.active = Boolean(active);
    els.todoTabBtn?.classList.toggle('active', state.active);
    els.todoGrid?.classList.toggle('hidden', !state.active);
    els.mainGrid?.classList.toggle('hidden', state.active);
    if (state.active) {
      els.tabBar?.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
      els.floatingAddBtn?.classList.add('hidden');
      loadTasks();
      startPolling();
    } else {
      stopPolling();
    }
  }

  function updateDateVisibility() {
    if (!els.taskWhenInput || !els.taskDateWrap || !els.taskDateInput) return;
    const needsDate = els.taskWhenInput.value !== 'timeless';
    els.taskDateWrap.classList.toggle('hidden', !needsDate);
    els.taskDateInput.required = needsDate;
  }

  function openTask(task = null) {
    if (!els.taskModal) return;
    const editing = Boolean(task);
    els.taskModalTitle.textContent = editing ? 'Edit Task' : 'Add Task';
    els.taskIdInput.value = task?.id || '';
    els.taskTitleInput.value = task?.title || '';
    els.taskPersonInput.value = task?.person_key || 'shared';
    els.taskWhenInput.value = task?.task_mode || 'timeless';
    els.taskDateInput.value = task?.assigned_date || todayIso();
    els.taskImportantInput.checked = task?.priority === 'important';
    els.taskNotesInput.value = task?.notes || '';
    els.deleteTaskBtn.classList.toggle('hidden', !editing);
    updateDateVisibility();
    els.taskModal.showModal();
    window.setTimeout(() => els.taskTitleInput.focus(), 0);
  }

  function closeTask() {
    if (els.taskModal?.open) els.taskModal.close();
  }

  async function loadTasks(silent = false) {
    if (!state.client || state.loading) return;
    state.loading = true;
    if (!silent && state.active) render();
    try {
      const { data, error } = await state.client
        .from(TASK_TABLE)
        .select('*')
        .eq('completed', false)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      state.tasks = (data || []).map(normalizeTask);
      render();
    } catch (error) {
      console.error('Shared task load failed.', error);
      render(`Tasks could not be loaded: ${error?.message || error}`);
    } finally {
      state.loading = false;
    }
  }

  async function saveTask(task) {
    const row = normalizeTask(task);
    const payload = {
      id: row.id,
      title: row.title,
      notes: row.notes || null,
      person_key: row.person_key,
      task_mode: row.task_mode,
      assigned_date: row.task_mode === 'timeless' ? null : row.assigned_date,
      priority: row.priority,
      completed: row.completed,
      completed_at: row.completed_at,
      sort_order: row.sort_order,
    };
    const { data, error } = await state.client.from(TASK_TABLE).upsert(payload).select().single();
    if (error) throw error;
    const saved = normalizeTask(data);
    const index = state.tasks.findIndex((entry) => entry.id === saved.id);
    if (index >= 0) state.tasks[index] = saved;
    else state.tasks.push(saved);
    return saved;
  }

  async function saveTaskFromModal(event) {
    event.preventDefault();
    const title = els.taskTitleInput.value.trim();
    if (!title) {
      els.taskTitleInput.focus();
      return;
    }
    const existing = state.tasks.find((task) => task.id === els.taskIdInput.value) || null;
    const mode = els.taskWhenInput.value || 'timeless';
    const assignedDate = mode === 'timeless' ? null : els.taskDateInput.value;
    if (mode !== 'timeless' && !assignedDate) {
      els.taskDateInput.focus();
      return;
    }
    try {
      await saveTask({
        ...(existing || {}),
        id: els.taskIdInput.value || makeId(),
        title,
        notes: els.taskNotesInput.value.trim(),
        person_key: els.taskPersonInput.value || 'shared',
        task_mode: mode,
        assigned_date: assignedDate,
        priority: els.taskImportantInput.checked ? 'important' : 'normal',
        completed: existing?.completed || false,
        completed_at: existing?.completed_at || null,
        sort_order: existing?.sort_order || 0,
      });
      closeTask();
      render();
    } catch (error) {
      alert(`Task was not saved.\n\n${error?.message || error}`);
    }
  }

  async function completeTask(id) {
    const task = state.tasks.find((entry) => entry.id === id);
    if (!task) return;
    try {
      await saveTask({ ...task, completed: true, completed_at: new Date().toISOString() });
      render();
    } catch (error) {
      alert(`Task was not completed.\n\n${error?.message || error}`);
      render();
    }
  }

  async function deleteTask() {
    const id = els.taskIdInput.value;
    const task = state.tasks.find((entry) => entry.id === id);
    if (!task) return;
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    try {
      const { error } = await state.client.from(TASK_TABLE).delete().eq('id', id);
      if (error) throw error;
      state.tasks = state.tasks.filter((entry) => entry.id !== id);
      closeTask();
      render();
    } catch (error) {
      alert(`Task was not deleted.\n\n${error?.message || error}`);
    }
  }

  function bindRenderedEvents() {
    document.getElementById('todoViewerSelect')?.addEventListener('change', (event) => {
      state.viewer = event.currentTarget.value === 'donna' ? 'donna' : 'tod';
      localStorage.setItem(VIEWER_STORAGE, state.viewer);
      render();
    });

    els.todoGrid?.querySelectorAll('[data-todo-action]').forEach((element) => {
      element.addEventListener('click', (event) => {
        const action = event.currentTarget.dataset.todoAction;
        const id = event.currentTarget.dataset.id;
        if (action === 'add') openTask();
        if (action === 'edit') openTask(state.tasks.find((task) => task.id === id) || null);
      });
    });

    els.todoGrid?.querySelectorAll('input[data-todo-action="complete"]').forEach((input) => {
      input.addEventListener('change', (event) => {
        if (event.currentTarget.checked) completeTask(event.currentTarget.dataset.id);
      });
    });
  }

  function startPolling() {
    stopPolling();
    state.pollTimer = window.setInterval(() => {
      if (state.active && document.visibilityState === 'visible') loadTasks(true);
    }, POLL_MS);
  }

  function stopPolling() {
    if (state.pollTimer) window.clearInterval(state.pollTimer);
    state.pollTimer = null;
  }

  function startRealtime() {
    if (!state.client) return;
    state.channel = state.client
      .channel('shared-shopping-planner-tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: TASK_TABLE }, () => {
        if (state.active) loadTasks(true);
      })
      .subscribe();
  }

  function initClient() {
    if (!APP_CONFIG.supabaseUrl || !APP_CONFIG.supabaseAnonKey || !window.supabase) return false;
    state.client = window.supabase.createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    startRealtime();
    return true;
  }

  function init() {
    render();

    els.todoTabBtn?.addEventListener('click', () => setActive(true));
    els.tabBar?.addEventListener('click', () => setActive(false));

    els.taskWhenInput?.addEventListener('change', updateDateVisibility);
    els.taskForm?.addEventListener('submit', saveTaskFromModal);
    els.closeTaskModalBtn?.addEventListener('click', closeTask);
    els.cancelTaskModalBtn?.addEventListener('click', closeTask);
    els.deleteTaskBtn?.addEventListener('click', deleteTask);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && state.active) loadTasks(true);
    });

    if (els.floatingAddBtn) {
      new MutationObserver(() => {
        if (state.active) els.floatingAddBtn.classList.add('hidden');
      }).observe(els.floatingAddBtn, { attributes: true, attributeFilter: ['class'] });
    }

    if (!initClient()) {
      render('Tasks could not connect to Supabase.');
      return;
    }
    loadTasks(true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
