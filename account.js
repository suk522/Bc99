
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userUID').textContent = currentUser.uid;
    document.getElementById('userBalance').textContent = `₹${currentUser.balance}`;
});

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
