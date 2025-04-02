// Register a new user
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('Registration successful');
            window.location.href = 'index.html'; // Redirect to login page
        } else {
            alert('Registration failed');
        }
    });
}

// Login an existing user
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('Login successful');
            window.location.href = 'transactions.html'; // Redirect to transactions page
        } else {
            alert('Login failed');
        }
    });
}

// Add a new transaction
if (document.getElementById('transaction-form')) {
    document.getElementById('transaction-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('amount').value);
        const recipient = document.getElementById('recipient').value.trim();
        const category = document.getElementById('category').value;

        try {
            const response = await fetch('http://localhost:3000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, recipient, category }),
            });

            if (response.ok) {
                alert('Transaction added successfully');
                document.getElementById('transaction-form').reset(); // Reset the form
                fetchTransactions(); // Refresh the transaction list
            } else {
                alert('Failed to add transaction');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    });
}

// Fetch and display total spending
async function fetchTotalSpending() {
    const response = await fetch('http://localhost:3000/api/total-spending');
    const data = await response.json();
    document.getElementById('total-spending').textContent = `₹${data.totalSpent.toFixed(2)}`; // Use rupee sign only

    
} 

// Fetch and display monthly spending
async function fetchMonthlySpending() {
    const response = await fetch('http://localhost:3000/api/monthly-spending');
    const monthlySpending = await response.json();
    const monthlySpendingList = document.getElementById('monthly-spending-list');
    monthlySpendingList.innerHTML = ''; // Clear the list

    for (const month in monthlySpending) {
        const li = document.createElement('li');
        li.textContent = `${month}: ₹${monthlySpending[month].toFixed(2)}`; // Use rupee sign only
        monthlySpendingList.appendChild(li);
    }
}

// Fetch and display transactions
async function fetchTransactions() {
    const response = await fetch('http://localhost:3000/api/transactions');
    const transactions = await response.json();
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = ''; // Clear the list

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        const date = new Date(transaction.date); // Convert the date string to a Date object
        const formattedDate = date.toLocaleString(); // Format the date and time
        li.textContent = `${transaction.recipient}: ₹${transaction.amount.toFixed(2)} (${transaction.category}) on ${formattedDate}`; // Use rupee sign only
        transactionList.appendChild(li);
    });
}

// Call fetch functions when the transactions page loads
if (document.getElementById('transaction-list')) {
    fetchTransactions();
    fetchTotalSpending();
    fetchMonthlySpending();
}

// Logout function
function logout() {
    fetch('http://localhost:3000/api/logout', {
        method: 'POST',
    }).then(() => {
        alert('Logged out successfully');
        window.location.href = 'index.html'; // Redirect to main page
    });
}