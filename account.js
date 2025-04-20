
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!currentUser || !isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Update user information
    if (document.getElementById('userName')) {
        document.getElementById('userName').textContent = currentUser.name || 'User';
    }
    if (document.getElementById('userUID')) {
        document.getElementById('userUID').textContent = currentUser.uid || 'N/A';
    }
    if (document.getElementById('userBalance')) {
        document.getElementById('userBalance').textContent = `₹${currentUser.balance || 0}`;
    }

    // Add event listeners
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    const supportBtn = document.querySelector('.support-btn');
    if (supportBtn) {
        supportBtn.addEventListener('click', () => alert('Support service will be available soon!'));
    }

    const policyBtn = document.querySelector('.policy-btn');
    if (policyBtn) {
        policyBtn.addEventListener('click', () => alert('Privacy Policy will be available soon!'));
    }
});

function handleLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}
