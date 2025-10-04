const addForm = document.getElementById('add-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const todoList = document.getElementById('todo-list');

// Render the todo list
function renderTodos(todos) {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.dataset.index = index;
    li.className = todo.done ? 'done' : '';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = todo.done ? 'Undo' : 'Done';
    toggleBtn.className = 'toggle-btn';
    toggleBtn.addEventListener('click', () => toggleTodo(index));

    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';
    const spanText = document.createElement('span');
    spanText.className = 'task-text';
    spanText.textContent = todo.task;
    taskInfo.appendChild(spanText);

    if(todo.date) {
      const spanDate = document.createElement('span');
      spanDate.className = 'task-date';
      spanDate.textContent = todo.date;
      taskInfo.appendChild(spanDate);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteTodo(index));

    li.appendChild(toggleBtn);
    li.appendChild(taskInfo);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// API calls
async function addTodo(task, date) {
  const res = await fetch('/api/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, date })
  });
  const todos = await res.json();
  renderTodos(todos);
}

async function toggleTodo(index) {
  const res = await fetch(`/api/toggle/${index}`, { method: 'POST' });
  const todos = await res.json();
  renderTodos(todos);
}

async function deleteTodo(index) {
  const res = await fetch(`/api/delete/${index}`, { method: 'POST' });
  const todos = await res.json();
  renderTodos(todos);
}

// Add form listener
addForm.addEventListener('submit', e => {
  e.preventDefault();
  if(taskInput.value) {
    addTodo(taskInput.value, dateInput.value);
    taskInput.value = '';
    dateInput.value = '';
  }
});

async function renderTodos(todos) {
  todoList.innerHTML = '';
  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.dataset.id = todo._id;
    li.className = todo.done ? 'done' : '';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = todo.done ? 'Undo' : 'Done';
    toggleBtn.className = 'toggle-btn';
    toggleBtn.addEventListener('click', () => toggleTodo(todo._id));

    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';
    const spanText = document.createElement('span');
    spanText.className = 'task-text';
    spanText.textContent = todo.task;
    taskInfo.appendChild(spanText);

    if(todo.date) {
      const spanDate = document.createElement('span');
      spanDate.className = 'task-date';
      spanDate.textContent = todo.date;
      taskInfo.appendChild(spanDate);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteTodo(todo._id));

    li.appendChild(toggleBtn);
    li.appendChild(taskInfo);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

async function addTodo(task, date) {
  const res = await fetch('/api/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, date })
  });
  const todos = await res.json();
  renderTodos(todos);
}

async function toggleTodo(id) {
  const res = await fetch(`/api/toggle/${id}`, { method: 'POST' });
  const todos = await res.json();
  renderTodos(todos);
}

async function deleteTodo(id) {
  const res = await fetch(`/api/delete/${id}`, { method: 'POST' });
  const todos = await res.json();
  renderTodos(todos);
}

// Add form listener
addForm.addEventListener('submit', e => {
  e.preventDefault();
  if(taskInput.value) {
    addTodo(taskInput.value, dateInput.value);
    taskInput.value = '';
    dateInput.value = '';
  }
});
