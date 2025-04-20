
function handleUserLogin(event) {
    event.preventDefault();
    const phone = document.getElementById('userLoginPhone').value;
    const password = document.getElementById('userLoginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.phone === phone && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'account.html';
    } else {
        alert('Invalid credentials');
    }
    return false;
}

function generateUID() {
    return Math.floor(10000 + Math.random() * 90000).toString();
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
    
    let uid;
    do {
        uid = generateUID();
    } while (users.some(u => u.uid === uid));
    
    const newUser = { 
        uid,
        name, 
        phone, 
        password, 
        balance: 10000,
        status: 'active',
        registeredAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    window.location.href = 'index.html';
    return false;
}

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const isAuthPage = window.location.pathname.includes('login.html') || 
                      window.location.pathname.includes('register.html');
    const isIndexPage = window.location.pathname === '/' || 
                       window.location.pathname === '/index.html';
    
    if (!currentUser && !isAuthPage) {
        window.location.href = 'login.html';
        return false;
    } else if (currentUser && isAuthPage) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Check auth on page load
document.addEventListener('DOMContentLoaded', checkAuth);

// Check auth on page load
document.addEventListener('DOMContentLoaded', checkAuth);
