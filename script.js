function createCustomPrompt(title, inputType) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const prompt = document.createElement('div');
    prompt.className = 'custom-prompt';

    prompt.innerHTML = `
        <h3>${title}</h3>
        <input type="${inputType}" placeholder="Enter ${title.toLowerCase()}" />
        <div class="prompt-buttons">
            <button class="cancel">Cancel</button>
            <button class="confirm">Confirm</button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(prompt);

    return new Promise((resolve, reject) => {
        const input = prompt.querySelector('input');
        const confirmBtn = prompt.querySelector('.confirm');
        const cancelBtn = prompt.querySelector('.cancel');

        confirmBtn.onclick = () => {
            const value = input.value.trim();
            if (value) {
                resolve(value);
                cleanup();
            }
        };

        cancelBtn.onclick = () => {
            reject();
            cleanup();
        };

        function cleanup() {
            document.body.removeChild(overlay);
            document.body.removeChild(prompt);
        }
    });
}

async function bindBank() {
    try {
        const accountNumber = await createCustomPrompt('Account Number', 'text');
        const ifscCode = await createCustomPrompt('IFSC Code', 'text');

        const bankStatus = document.getElementById('bankStatus');
        bankStatus.textContent = `Bank account linked: ${accountNumber.slice(0, 4)}****${accountNumber.slice(-4)}`;

        // Store in localStorage
        localStorage.setItem('bankDetails', JSON.stringify({
            accountNumber,
            ifscCode
        }));

        // Disable the bind bank button
        const bindBankBtn = document.querySelector('.bind-bank-btn');
        bindBankBtn.disabled = true;

    } catch (error) {
        // User cancelled
    }
}

// Global balance management
function updateGlobalBalance(newBalance) {
    localStorage.setItem('userBalance', newBalance.toString());
    const balanceElements = document.querySelectorAll('.balance-amount');
    balanceElements.forEach(el => {
        el.textContent = `₹${newBalance}`;
    });
}

function getGlobalBalance() {
    return parseInt(localStorage.getItem('userBalance') || '10000');
}

function refreshBalance() {
    const currentBalance = getGlobalBalance();
    updateGlobalBalance(currentBalance);
}

// Initialize balance on page load
document.addEventListener('DOMContentLoaded', () => {
    refreshBalance();

    const savedBank = localStorage.getItem('bankDetails');
    if (savedBank) {
        const { accountNumber } = JSON.parse(savedBank);
        const bankStatus = document.getElementById('bankStatus');
        if (bankStatus) {
            bankStatus.textContent = `Bank account linked: ${accountNumber.slice(0, 4)}****${accountNumber.slice(-4)}`;

            // Disable the bind bank button
            const bindBankBtn = document.querySelector('.bind-bank-btn');
            if (bindBankBtn) bindBankBtn.disabled = true;
        }
    }
});

// Optimize navigation handling
let currentPage = window.location.pathname;
let isNavigating = false;

document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (link && link.href && !link.target && !e.ctrlKey && !e.shiftKey && !isNavigating) {
        e.preventDefault();
        const newPage = new URL(link.href).pathname;

        if (newPage !== currentPage) {
            isNavigating = true;
            document.body.classList.add('page-transition');
            requestAnimationFrame(() => {
                setTimeout(() => {
                    currentPage = newPage;
                    window.location = link.href;
                    isNavigating = false;
                }, 150);
            });
        }
    }
});

// Preload adjacent pages
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-links a');
    requestIdleCallback(() => {
        links.forEach(link => {
            if (link.href && link.href !== window.location.href) {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = link.href;
                document.head.appendChild(prefetchLink);
            }
        });
    });
});