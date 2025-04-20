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

    // Modal handling
    const modal = document.getElementById('bettingHistoryModal');
    const closeBtn = document.querySelector('.close-btn');

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        });
    }
});

function showBettingHistory() {
    const modal = document.getElementById('bettingHistoryModal');
    const historyList = document.getElementById('bettingHistoryList');
    const bettingHistory = JSON.parse(localStorage.getItem('bettingHistory') || '[]');

    historyList.innerHTML = bettingHistory.length ? 
        bettingHistory.map(bet => `
            <div class="history-item">
                <span>Game: ${bet.game}</span>
                <span>Amount: ₹${bet.amount}</span>
                <span class="${bet.status}">${bet.status === 'win' ? '+' + bet.winAmount : '-' + bet.amount}</span>
            </div>
        `).join('') : 
        '<div class="history-item">No betting history available</div>';

    modal.style.display = 'block';
}

function showRedEnvelopeForm() {
    document.getElementById('redEnvelopeModal').style.display = 'block';
}

function closeRedEnvelopeModal() {
    document.getElementById('redEnvelopeModal').style.display = 'none';
}

function redeemRedEnvelopeCode() {
    const code = document.getElementById('redEnvelopeCode').value;
    const redEnvelopes = JSON.parse(localStorage.getItem('redEnvelopes') || '[]');
    const envelope = redEnvelopes.find(e => e.code === code && !e.redeemed);

    if (envelope) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.balance = (parseFloat(currentUser.balance) + envelope.amount).toString();
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        envelope.redeemed = true;
        envelope.redeemedBy = currentUser.uid;
        envelope.redeemedAt = new Date().toISOString();
        localStorage.setItem('redEnvelopes', JSON.stringify(redEnvelopes));

        alert(`Successfully redeemed ₹${envelope.amount}!`);
        closeRedEnvelopeModal();
    } else {
        alert('Invalid or already redeemed code');
    }
}