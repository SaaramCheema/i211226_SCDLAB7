//Saaram Islam Cheema-i211226 app.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

const users = {};
let tasks = [];

app.use(bodyParser.json());


const authenticateUser = (req, res, next) => {
  const { username, password } = req.headers;
  if (!users[username] || users[username].password !== password) {  // User Authentication Middleware
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.user = users[username];
  next();
};


app.post('/tasks', authenticateUser, (req, res) => {
  const { title, description, dueDate, category, priority } = req.body;
  const newTask = { title, description, dueDate, category, priority, completed: false };
  tasks.push(newTask);				// Task Creation
  res.status(201).json({ message: 'Task created successfully', task: newTask });
});


app.put('/tasks/:taskId', authenticateUser, (req, res) => {   // Mark Task as Completed
  const taskId = parseInt(req.params.taskId);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  tasks[taskIndex].completed = true;
  res.json({ message: 'Task marked as completed', task: tasks[taskIndex] });
});


app.get('/tasks', authenticateUser, (req, res) => {
  const { sortBy } = req.query;
  let sortedTasks = tasks;
  if (sortBy === 'dueDate') {
    sortedTasks = tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));// View Tasks
  } else if (sortBy === 'category') {
    sortedTasks = tasks.sort((a, b) => a.category.localeCompare(b.category));
  } else if (sortBy === 'status') {
    sortedTasks = tasks.sort((a, b) => a.completed - b.completed);
  }
  res.json(sortedTasks);
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);// Start the server
});
