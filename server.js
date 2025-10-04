const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Atlas Connection
const mongoURL = 'mongodb+srv://itemmoo:moosic4826@cluster0.74g4yvb.mongodb.net/todoApp?retryWrites=true&w=majority';

mongoose.connect(mongoURL)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Todo Model
const TodoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  date: { type: String, default: null },
  done: { type: Boolean, default: false }
});
const Todo = mongoose.model('Todo', TodoSchema);

// Routes
app.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ _id: -1 });
    res.render('index', { todos });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.post('/api/add', async (req, res) => {
  try {
    const { task, date } = req.body;
    if (!task) return res.status(400).json({ error: 'Task required' });
    const todo = new Todo({ task, date: date || null });
    await todo.save();
    const todos = await Todo.find().sort({ _id: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/api/toggle/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo) {
      todo.done = !todo.done;
      await todo.save();
    }
    const todos = await Todo.find().sort({ _id: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/api/delete/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    const todos = await Todo.find().sort({ _id: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
