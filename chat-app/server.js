const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todoApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Create Todo model
const TodoSchema = new mongoose.Schema({
  task: String,
  date: String,
  done: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', TodoSchema);

// Routes
app.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.render('index', { todos });
});

// API routes
app.post('/api/add', async (req, res) => {
  const { task, date } = req.body;
  if (!task) return res.status(400).json({ error: 'Task required' });
  const todo = new Todo({ task, date: date || null });
  await todo.save();
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/api/toggle/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (todo) {
    todo.done = !todo.done;
    await todo.save();
  }
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/api/delete/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  const todos = await Todo.find();
  res.json(todos);
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
