
document.addEventListener('DOMContentLoaded', () => {
    loadMockData();
});

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
    
    const users = [
        { id: 1, username: "User123", balance: "$1500", status: "Active" },
        { id: 2, username: "User456", balance: "$2000", status: "Active" }
    ];

    renderTable('withdrawalsTable', withdrawals);
    renderTable('depositsTable', deposits);
    renderTable('usersTable', users);
}

function renderTable(tableId, data) {
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
