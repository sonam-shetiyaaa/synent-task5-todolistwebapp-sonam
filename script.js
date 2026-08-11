const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const emptyTitle = document.getElementById('empty-title');
const emptySub = document.getElementById('empty-sub');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const dateChip = document.getElementById('date-chip');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
const filterButtons = document.querySelectorAll('.filter-btn');
const progressFill = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');
const countAll = document.getElementById('count-all');
const countActive = document.getElementById('count-active');
const countCompleted = document.getElementById('count-completed');

const STORAGE_KEY = 'todos';

let todos = loadTodos();
let currentFilter = 'all';
let query = '';

function loadTodos() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const raw = stored ? JSON.parse(stored) : [];
        return raw.map(t => ({
            id: t.id || Date.now() + Math.random().toString(36).slice(2),
            text: t.text,
            completed: !!t.completed,
            important: !!t.important,
            createdAt: t.createdAt || Date.now()
        }));
    } catch (e) {
        return [];
    }
}

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function formatDate() {
    return new Date().toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
}

function timeAgo(ts) {
    const diff = Date.now() - ts;
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function getVisibleTodos() {
    const q = query.trim().toLowerCase();
    return todos.filter(t => {
        const matchesFilter =
            currentFilter === 'all' ||
            (currentFilter === 'active' && !t.completed) ||
            (currentFilter === 'completed' && t.completed);
        const matchesQuery = !q || t.text.toLowerCase().includes(q);
        return matchesFilter && matchesQuery;
    });
}

function startEdit(todo, contentEl) {
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = todo.text;
    editInput.maxLength = 200;
    contentEl.replaceChildren(editInput);
    editInput.focus();
    editInput.select();

    let done = false;
    const finish = (save) => {
        if (done) return;
        done = true;
        const value = editInput.value.trim();
        if (save && value) {
            todo.text = value;
            saveTodos();
        }
        render();
    };

    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finish(true);
        if (e.key === 'Escape') finish(false);
    });
    editInput.addEventListener('blur', () => finish(true));
}

function render() {
    const visible = getVisibleTodos();

    list.innerHTML = '';

    visible.forEach((todo) => {
        const li = document.createElement('li');
        if (todo.completed) li.classList.add('completed');
        if (todo.important) li.classList.add('important');

        const starBtn = document.createElement('button');
        starBtn.className = 'star-btn' + (todo.important ? ' active' : '');
        starBtn.textContent = '★';
        starBtn.setAttribute('aria-label', 'Mark as important');
        starBtn.addEventListener('click', () => {
            todo.important = !todo.important;
            saveTodos();
            render();
        });

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.setAttribute('aria-label', 'Mark as completed');
        checkbox.addEventListener('change', () => {
            todo.completed = checkbox.checked;
            saveTodos();
            render();
        });

        const content = document.createElement('div');
        content.className = 'task-content';

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = todo.text;
        span.title = 'Double-click to edit';
        span.addEventListener('dblclick', () => startEdit(todo, content));

        const time = document.createElement('span');
        time.className = 'task-time';
        time.textContent = `added ${timeAgo(todo.createdAt)}`;

        content.appendChild(span);
        content.appendChild(time);

        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.setAttribute('aria-label', 'Edit task');
        editBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>';
        editBtn.addEventListener('click', () => startEdit(todo, content));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.setAttribute('aria-label', 'Delete task');
        deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
        deleteBtn.addEventListener('click', () => {
            todos = todos.filter(t => t.id !== todo.id);
            saveTodos();
            render();
        });

        li.appendChild(starBtn);
        li.appendChild(checkbox);
        li.appendChild(content);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });

    updateStats();
}

function updateStats() {
    const total = todos.length;
    const done = todos.filter(t => t.completed).length;
    const active = total - done;

    countAll.textContent = total;
    countActive.textContent = active;
    countCompleted.textContent = done;

    const remaining = active;
    taskCount.textContent = `${remaining} task${remaining === 1 ? '' : 's'} left`;

    const pct = total ? Math.round((done / total) * 100) : 0;
    progressFill.style.width = `${pct}%`;
    progressFill.classList.toggle('done', total > 0 && done === total);
    progressLabel.textContent = `${done} / ${total} done`;

    if (total === 0) {
        emptyTitle.textContent = 'All clear!';
        emptySub.textContent = 'Add a task above to get started.';
    } else {
        emptyTitle.textContent = 'No tasks found';
        emptySub.textContent = 'Try a different search or filter.';
    }
    emptyState.classList.toggle('hidden', getVisibleTodos().length > 0);
}

function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    todos.push({
        id: Date.now() + Math.random().toString(36).slice(2),
        text: trimmed,
        completed: false,
        important: false,
        createdAt: Date.now()
    });
    saveTodos();
    render();
}

function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    render();
}

function setFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn =>
        btn.classList.toggle('active', btn.dataset.filter === filter)
    );
    render();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(input.value);
    input.value = '';
    input.focus();
});

searchInput.addEventListener('input', () => {
    query = searchInput.value;
    searchClear.classList.toggle('hidden', !query);
    render();
});

searchClear.addEventListener('click', () => {
    searchInput.value = '';
    query = '';
    searchClear.classList.add('hidden');
    searchInput.focus();
    render();
});

filterButtons.forEach(btn =>
    btn.addEventListener('click', () => setFilter(btn.dataset.filter))
);

clearCompletedBtn.addEventListener('click', clearCompleted);

dateChip.textContent = formatDate();
render();
