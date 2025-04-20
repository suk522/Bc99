
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!currentUser || !isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Update user information
    document.getElementById('userName').textContent = currentUser.name || 'User';
    document.getElementById('userUID').textContent = currentUser.uid || 'N/A';
    document.getElementById('userBalance').textContent = `₹${currentUser.balance || 0}`;

    // Add event listeners
    document.querySelector('.logout-btn').addEventListener('click', handleLogout);
    document.querySelector('.support-btn').addEventListener('click', () => alert('Support service will be available soon!'));
    document.querySelector('.policy-btn').addEventListener('click', () => alert('Privacy Policy will be available soon!'));
});

function handleLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}
