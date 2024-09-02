const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('views'));

// File to store users
const usersFile = path.join(__dirname, 'users.json');

// Load users from file
const loadUsers = () => {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
};

// Save users to file
const saveUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  if (users.find(user => user.username === username)) {
    return res.send('Username already exists. <a href="/signup">Try again</a>');
  }

  users.push({ username, password });
  saveUsers(users);
  res.send('Signup successful! <a href="/login">Login</a>');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    res.send('Login successful! <a href="/users">List Users</a>');
  } else {
    res.send('Invalid credentials. <a href="/login">Try again</a>');
  }
});

app.get('/users', (req, res) => {
  const users = loadUsers();
  const userList = users.map(user => `<li>${user.username}</li>`).join('');
  res.send(`<ul>${userList}</ul> <a href="/">Home</a>`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
