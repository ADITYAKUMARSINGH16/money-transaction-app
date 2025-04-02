const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

const DATA_FILE = path.join(__dirname, 'transactions.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Function to read users from the JSON file
const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
};

// Function to write users to the JSON file
const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Function to read transactions from the JSON file
const readTransactions = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Function to write transactions to the JSON file
const writeTransactions = (transactions) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(transactions, null, 2));
};

// User registration
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ id: users.length + 1, username, password: hashedPassword });
    writeUsers(users);
    res.status(201).send('User  registered successfully');
});

// User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = { id: user.id, username: user.username }; // Store user in session
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid username or password');
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.send('Logged out successfully');
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

// User-specific transactions
app.post('/api/transactions', isAuthenticated, (req, res) => {
    const { amount, recipient, category } = req.body;
    const transactions = readTransactions();

    const transaction = {
        id: transactions.length + 1,
        userId: req.session.user.id, // Associate transaction with user ID
        amount,
        recipient,
        category,
        date: new Date().toISOString(),
    };
    transactions.push(transaction);
    writeTransactions(transactions);
    res.status(201).json(transaction);
});

// Get user-specific transactions
app.get('/api/transactions', isAuthenticated, (req, res) => {
    const transactions = readTransactions();
    const userTransactions = transactions.filter(t => t.userId === req.session.user.id);
    res.json(userTransactions);
});

// Get total spending for the user
app.get('/api/total-spending', isAuthenticated, (req, res) => {
    const transactions = readTransactions();
    const totalSpent = transactions
        .filter(t => t.userId === req.session.user.id)
        .reduce((acc, transaction) => acc + transaction.amount, 0);
    
    res.json({ totalSpent });
});

// Get monthly spending reports for the user
app.get('/api/monthly-spending', isAuthenticated, (req, res) => {
    const transactions = readTransactions();
    const monthlySpending = {};

    transactions.forEach(transaction => {
        if (transaction.userId === req.session.user.id) {
            const month = new Date(transaction.date).toLocaleString('default', { year: 'numeric', month: 'long' });
            if (!monthlySpending[month]) {
                monthlySpending[month] = 0;
            }
            monthlySpending[month] += transaction.amount;
        }
    });

    res.json(monthlySpending);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});