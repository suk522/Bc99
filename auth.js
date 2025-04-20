
function handleUserLogin(event) {
    event.preventDefault();
    const phone = document.getElementById('userLoginPhone').value;
    const password = document.getElementById('userLoginPassword').value;
    
    // In a real app, this would validate against a database
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.phone === phone && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('Invalid credentials');
    }
    return false;
}

function handleRegistration(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.phone === phone)) {
        alert('Phone number already registered');
        return false;
    }
    
    const newUser = { name, phone, password, balance: 10000 };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    window.location.href = 'index.html';
    return false;
}

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        window.location.href = 'login.html';
    }
}

// Check auth on page load
document.addEventListener('DOMContentLoaded', checkAuth);
