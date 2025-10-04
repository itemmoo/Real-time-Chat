const addForm = document.getElementById('add-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const todoList = document.getElementById('todo-list');

// Render the todo list
function renderTodos(todos) {
  todoList.innerHTML = '';
  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.dataset.id = todo._id;       // Use MongoDB _id
    li.className = todo.done ? 'done' : '';

    // Done / Undo button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = todo.done ? 'Undo' : 'Done';
    toggleBtn.className = 'toggle-btn';
    toggleBtn.addEventListener('click', () => toggleTodo(todo._id));

    // Task info
    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';
    const spanText = document.createElement('span');
    spanText.className = 'task-text';
    spanText.textContent = todo.task;
    taskInfo.appendChild(spanText);

    if (todo.date) {
      const spanDate = document.createElement('span');
      spanDate.className = 'task-date';
      spanDate.textContent = todo.date;
      taskInfo.appendChild(spanDate);
    }

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteTodo(todo._id));

    // Append elements
    li.appendChild(toggleBtn);
    li.appendChild(taskInfo);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// Add a new todo
async function addTodo(task, date) {
  const res = await fetch('/api/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, date })
  });
  const todos = await res.json();
  renderTodos(todos);
}

// Toggle done/undo
async function toggleTodo(id) {
  const res = await fetch(`/api/toggle/${id}`, { method: 'POST' });
  const todos = await res.json();
  renderTodos(todos);
}

// Delete a todo
async function deleteTodo(id) {
  const res = await fetch(`/api/delete/${id}`, { method: 'POST' });
  const todos = await res.json();
  renderTodos(todos);
}

// Handle form submission
addForm.addEventListener('submit', e => {
  e.preventDefault();
  if (taskInput.value) {
    addTodo(taskInput.value, dateInput.value);
    taskInput.value = '';
    dateInput.value = '';
  }
});

// Initial fetch to load todos
async function fetchTodos() {
  const res = await fetch('/api/todos');
  const todos = await res.json();
  renderTodos(todos);
}

fetchTodos();
