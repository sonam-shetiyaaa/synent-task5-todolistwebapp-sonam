const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');

const STORAGE_KEY = 'todos';

let todos = loadTodos();

function loadTodos() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
    list.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        if (todo.completed) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleCompleted(index));

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = todo.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(index));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });

    const remaining = todos.filter(t => !t.completed).length;
    taskCount.textContent = `${remaining} task${remaining === 1 ? '' : 's'} left`;
    emptyMessage.classList.toggle('hidden', todos.length > 0);
}

function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    todos.push({ text: trimmed, completed: false });
    saveTodos();
    render();
}

function deleteTask(index) {
    todos.splice(index, 1);
    saveTodos();
    render();
}

function toggleCompleted(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    render();
}

function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    render();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(input.value);
    input.value = '';
    input.focus();
});

clearCompletedBtn.addEventListener('click', clearCompleted);

render();
