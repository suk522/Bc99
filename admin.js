
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!localStorage.getItem('adminAuth')) {
        window.location.href = 'admin-login.html';
        return;
    }
    loadMockData();
});

// Add logout function
function logout() {
    localStorage.removeItem('adminAuth');
    window.location.href = 'admin-login.html';
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`button[onclick="showTab('${tabName}')"]`).classList.add('active');
}

function loadMockData() {
    const withdrawals = [
        { id: 1, user: "User123", amount: "$500", status: "Pending", date: "2024-04-19" },
        { id: 2, user: "User456", amount: "$1000", status: "Completed", date: "2024-04-18" }
    ];
    
    const deposits = [
        { id: 1, user: "User789", amount: "$750", status: "Completed", date: "2024-04-19" },
        { id: 2, user: "User123", amount: "$250", status: "Completed", date: "2024-04-17" }
    ];
    
    const users = JSON.parse(localStorage.getItem('users') || '[]').map(user => ({
        id: user.uid,
        username: user.name,
        phone: user.phone,
        balance: `₹${user.balance}`,
        status: user.status,
        registeredAt: new Date(user.registeredAt).toLocaleDateString()
    }));

    renderTable('withdrawalsTable', withdrawals);
    renderTable('depositsTable', deposits);
    renderTable('usersTable', users);
}

function renderUserTable(users) {
    const table = document.getElementById('usersTable');
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>UID</th>
                    <th>Phone</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.id}</td>
                        <td>${user.phone}</td>
                        <td>₹${user.balance}</td>
                        <td>${user.status}</td>
                        <td>
                            <button onclick="viewUserHistory('${user.id}')">View History</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    table.innerHTML = html;
}

function viewUserHistory(userId) {
    const user = JSON.parse(localStorage.getItem('users')).find(u => u.id === userId);
    const bettingHistory = JSON.parse(localStorage.getItem('bettingHistory') || '[]')
        .filter(bet => bet.userId === userId);

    const modal = document.getElementById('userDetails');
    const historyDiv = document.getElementById('userBettingHistory');
    
    historyDiv.innerHTML = `
        <h4>${user.username}'s Betting History</h4>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Game</th>
                    <th>Amount</th>
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>
                ${bettingHistory.map(bet => `
                    <tr>
                        <td>${new Date(bet.timestamp).toLocaleString()}</td>
                        <td>${bet.game}</td>
                        <td>₹${bet.amount}</td>
                        <td class="${bet.status}">${bet.status === 'win' ? '+' + bet.winAmount : '-' + bet.amount}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <button onclick="document.getElementById('userDetails').style.display='none'">Close</button>
    `;
    
    modal.style.display = 'block';
}

function renderTable(tableId, data) {
    if (tableId === 'usersTable') {
        renderUserTable(data);
        return;
    }
    
    const table = document.getElementById(tableId);
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const html = `
        <table>
            <thead>
                <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
                ${data.map(row => `
                    <tr>${headers.map(h => `<td>${row[h]}</td>`).join('')}</tr>
                `).join('')}
            </tbody>
        </table>
    `;
    table.innerHTML = html;
}

// Add search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const filteredUsers = users.filter(user => 
                user.username.toLowerCase().includes(searchTerm) ||
                user.phone.includes(searchTerm)
            );
            renderUserTable(filteredUsers);
        });
    }
});
