
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!currentUser || !isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    const userName = document.getElementById('userName');
    const userUID = document.getElementById('userUID');
    const userBalance = document.getElementById('userBalance');

    if (userName && userUID && userBalance) {

    // Update user information
    document.getElementById('userName').textContent = currentUser.name || 'User';
    document.getElementById('userUID').textContent = currentUser.uid || 'N/A';
    document.getElementById('userBalance').textContent = `₹${currentUser.balance || 0}`;

    // Add event listeners
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        });
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
