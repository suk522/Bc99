function bindBank() {
    const accountNumber = prompt("Enter your bank account number:");
    if (!accountNumber) return;
    
    const ifscCode = prompt("Enter IFSC code:");
    if (!ifscCode) return;
    
    if (accountNumber && ifscCode) {
        // Here you would typically send this to a server
        const bankStatus = document.getElementById('bankStatus');
        bankStatus.textContent = `Bank account linked: ${accountNumber.slice(0, 4)}****${accountNumber.slice(-4)}`;
        
        // Store in localStorage for persistence
        localStorage.setItem('bankDetails', JSON.stringify({
            accountNumber,
            ifscCode
        }));
    }
}

// Check for existing bank details on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedBank = localStorage.getItem('bankDetails');
    if (savedBank) {
        const { accountNumber } = JSON.parse(savedBank);
        const bankStatus = document.getElementById('bankStatus');
        bankStatus.textContent = `Bank account linked: ${accountNumber.slice(0, 4)}****${accountNumber.slice(-4)}`;
    }
});