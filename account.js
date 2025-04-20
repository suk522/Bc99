// Cache DOM elements
let modals = {};
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!currentUser?.uid || !isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Cache modal elements
    ['bettingHistoryModal', 'redEnvelopeModal', 'bindBankModal', 'supportModal'].forEach(id => {
        modals[id] = document.getElementById(id);
    });

    // Initialize all modals
    initializeModals();

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
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const prompt = document.createElement('div');
    prompt.className = 'custom-prompt';

    prompt.innerHTML = `
        <h3>Redeem Red Envelope</h3>
        <input type="text" id="redEnvelopeCode" placeholder="Enter code" />
        <div class="prompt-buttons">
            <button class="cancel">Close</button>
            <button class="confirm">Redeem</button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(prompt);

    const input = prompt.querySelector('input');
    const confirmBtn = prompt.querySelector('.confirm');
    const cancelBtn = prompt.querySelector('.cancel');

    function cleanup() {
        document.body.removeChild(overlay);
        document.body.removeChild(prompt);
    }

    confirmBtn.onclick = () => {
        const code = input.value.trim();
        if (code) {
            redeemRedEnvelopeCode(code);
            cleanup();
        }
    };

    cancelBtn.onclick = cleanup;
}

function redeemRedEnvelopeCode(code) {
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

        document.getElementById('userBalance').textContent = `₹${currentUser.balance}`;
        alert(`Successfully redeemed ₹${envelope.amount}!`);
    } else {
        alert('Invalid or already redeemed code');
    }
}

function closeRedEnvelopeModal() {
    document.getElementById('redEnvelopeModal').style.display = 'none';
}

function redeemRedEnvelopeCode() {
    const code = document.getElementById('redEnvelopeCode').value;
    const redEnvelopes = JSON.parse(localStorage.getItem('redEnvelopes') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const envelope = redEnvelopes.find(e => e.code === code && e.isActive);

    if (!envelope) {
        alert('Invalid code or code has expired');
        return;
    }

    if (envelope.redeemedBy.includes(currentUser.uid)) {
        alert('You have already redeemed this code');
        return;
    }

    currentUser.balance = (parseFloat(currentUser.balance) + envelope.amount).toString();
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    envelope.redeemedBy.push(currentUser.uid);
    envelope.lastRedeemedAt = new Date().toISOString();
    localStorage.setItem('redEnvelopes', JSON.stringify(redEnvelopes));

    alert(`Successfully redeemed ₹${envelope.amount}!`);
    closeRedEnvelopeModal();
}

function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close-btn');

    closeBtns.forEach(btn => {
        btn.onclick = () => {
            btn.closest('.modal').style.display = 'none';
        };
    });

    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
}

function showBindBank() {
    document.getElementById('bindBankModal').style.display = 'block';
}

function closeBankModal() {
    document.getElementById('bindBankModal').style.display = 'none';
}

function bindBankAccount() {
    const bankName = document.getElementById('bankName').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const ifscCode = document.getElementById('ifscCode').value;

    if (!bankName || !accountNumber || !ifscCode) {
        alert('Please fill all fields');
        return;
    }

    // Save bank details
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.bankDetails = { bankName, accountNumber, ifscCode };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    alert('Bank account bound successfully');
    closeBankModal();
}

function showCustomerSupport() {
    document.getElementById('supportModal').style.display = 'block';
}

function closeSupportModal() {
    document.getElementById('supportModal').style.display = 'none';
}

function contactSupport(type) {
    if (type === 'chat') {
        // Implement live chat functionality
        alert('Live chat support will be available soon');
    } else if (type === 'email') {
        window.location.href = 'mailto:support@bc99.com';
    }
    closeSupportModal();
}
