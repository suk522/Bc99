// User authentication functions
function handleLogin(event) {
    event.preventDefault();
    const phone = document.getElementById('loginPhone')?.value;
    const password = document.getElementById('loginPassword')?.value;

    if (!phone || !password) {
        alert('Please enter both phone and password');
        return false;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.phone === phone && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        alert('Invalid credentials');
    }
    return false;
}

function handleRegistration(event) {
    event.preventDefault();
    const name = document.getElementById('registerName')?.value;
    const phone = document.getElementById('registerPhone')?.value;
    const password = document.getElementById('registerPassword')?.value;

    if (!name || !phone || !password) {
        alert('Please fill all fields');
        return false;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some(u => u.phone === phone)) {
        alert('Phone number already registered');
        return false;
    }

    const newUser = {
        uid: Date.now().toString(),
        name,
        phone,
        password,
        balance: '0',
        bonusReceived: false
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('isLoggedIn', 'true');

    window.location.href = 'index.html';
    return false;
}

// Check authentication status
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!currentUser || !isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize auth check
document.addEventListener('DOMContentLoaded', checkAuth);