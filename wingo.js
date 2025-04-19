let currentRound = 4;
let timeLeft = 30;
let timer;
let selectedAmount = 0;
let selectedMultiplier = 1;
let gameHistory = [];
let bettingHistory = [];
let currentPartyNumber = generatePartyNumber();

function generatePartyNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const sequence = String(currentRound).padStart(6, '0');
    return `${year}${month}${day}${sequence}`;
}

function addBet(type, amount) {
    const allButtons = document.querySelectorAll('.color-btn, .number-btn, .size-btn');
    let selectedButton = null;

    allButtons.forEach(btn => {
        if (btn.classList.contains('selected')) {
            selectedButton = btn;
        }
    });

    const betType = selectedButton ? selectedButton.textContent : type;
    bettingHistory.unshift({
        partyNumber: currentPartyNumber,
        type: betType,
        amount: amount,
        status: 'pending',
        winAmount: 0
    });
    updateBettingHistory();
}

function updateGameResult(number) {
    gameHistory.unshift({
        partyNumber: currentPartyNumber,
        result: number,
        timestamp: new Date().toISOString()
    });

    // Update betting results
    bettingHistory.forEach(bet => {
        if (bet.status === 'pending') {
            let won = false;
            let multiplier = 2;

            if (bet.type === 'violet' && (number === 0 || number === 5)) won = true;
            else if (bet.type === 'green' && [2,4,6,8].includes(number)) won = true;
            else if (bet.type === 'red' && [1,3,7,9].includes(number)) won = true;
            else if (bet.type === number) {
                won = true;
                multiplier = 9;
            }

            if (won) {
                bet.status = 'win';
                bet.winAmount = Math.floor(bet.amount * multiplier * 0.98); // 2% fee
                updateBalance(bet.winAmount);
            } else {
                bet.status = 'loss';
                bet.winAmount = -bet.amount;
            }
        }
    });

    updateGameHistory();
    updateBettingHistory();
}

function updateBalance(amount) {
    const currentBalance = getGlobalBalance();
    const newBalance = currentBalance + amount;
    updateGlobalBalance(newBalance);
}

function refreshBalance() {
    const currentBalance = getGlobalBalance();
    updateGlobalBalance(currentBalance);
}


function getGlobalBalance() {
    return parseFloat(localStorage.getItem('balance')) || 0;
}

function updateGlobalBalance(newBalance) {
    localStorage.setItem('balance', newBalance);
    const newBalanceStr = `₹${newBalance}`;
    document.querySelectorAll('.balance-amount').forEach(el => {
        el.textContent = newBalanceStr;
    });
}

function updateTimer() {
    const timerDisplay = document.querySelector('.timer span');
    const partyDisplay = document.querySelector('.round-number');

    timerDisplay.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
    partyDisplay.textContent = currentPartyNumber;

    if (timeLeft === 0) {
        generateResult();
        timeLeft = 30;
        currentRound++;
        currentPartyNumber = generatePartyNumber();
    }
    timeLeft--;
}

function generateResult() {
    const number = Math.floor(Math.random() * 10);
    const resultBall = document.querySelector('.result-ball:not(.small)');
    const lastResults = document.querySelectorAll('.result-ball.small');

    // Shift previous results
    for (let i = lastResults.length - 1; i > 0; i--) {
        lastResults[i].className = lastResults[i-1].className;
        lastResults[i].textContent = lastResults[i-1].textContent;
    }

    if (lastResults[0]) {
        lastResults[0].className = resultBall.className;
        lastResults[0].textContent = resultBall.textContent;
    }

    if (resultBall) {
        resultBall.textContent = number;
        resultBall.className = 'result-ball';

        // Example: if number is 2, ball will be green
        if (number === 0 || number === 5) {
            resultBall.classList.add('violet');
        } else if ([2,4,6,8].includes(number)) {
            resultBall.classList.add('green');
        } else {
            resultBall.classList.add('red');
        }

        resultBall.style.opacity = '1';
        resultBall.style.transform = 'scale(1)';
    }

    updateGameResult(number);
    currentPartyNumber = generatePartyNumber();
}

function updateGameHistory() {
    const historyList = document.querySelector('.game-history');
    historyList.innerHTML = gameHistory.slice(0, 10).map(game => `
        <div class="history-item">
            <span>Party: ${game.partyNumber}</span>
            <span class="result ${game.result === 0 || game.result === 5 ? 'violet' : 
                               [2,4,6,8].includes(game.result) ? 'green' : 'red'}">
                ${game.result}
            </span>
        </div>
    `).join('');
}

function updateBettingHistory() {
    const betList = document.querySelector('.betting-history');
    if (betList) {
        betList.innerHTML = bettingHistory.slice(0, 10).map(bet => {
            const partyShort = bet.partyNumber.slice(-6);
            return `
            <div class="history-item">
                <span>#${partyShort}</span>
                <span>${bet.type}</span>
                <span class="status ${bet.status.toLowerCase()}">
                    ${bet.status === 'win' ? `+${bet.winAmount}` : 
                      bet.status === 'loss' ? `-${bet.amount}` : 
                      '⌛'}
                </span>
            </div>
            `;
        }).join('');
    }
}

function showBetPrompt() {
    document.getElementById('betPrompt').style.display = 'flex';
}

function hideBetPrompt() {
    document.getElementById('betPrompt').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    timer = setInterval(updateTimer, 1000);
    refreshBalance(); // Initialize balance

    const betPrompt = document.getElementById('betPrompt');
    const allBetButtons = document.querySelectorAll('.color-btn, .number-btn, .size-btn');

    allBetButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            allBetButtons.forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            showBetPrompt();
        });
    });

    allBetButtons.forEach(btn => {
        btn.addEventListener('click', showBetPrompt);
    });

    document.querySelectorAll('.bet-amounts button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectedAmount = parseInt(e.target.dataset.amount);
            document.querySelectorAll('.bet-amounts button').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
        });
    });

    document.querySelectorAll('.bet-multipliers button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectedMultiplier = parseInt(e.target.dataset.multiplier);
            document.querySelectorAll('.bet-multipliers button').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
        });
    });

    document.querySelector('.confirm').addEventListener('click', () => {
        const customAmount = document.getElementById('customBet').value;
        const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount;
        const totalBet = finalAmount * selectedMultiplier;

        if (totalBet && totalBet <= getGlobalBalance()) {
            const selectedButton = document.querySelector('.betting-options button.selected');
            const betType = selectedButton ? selectedButton.textContent : 'Unknown';
            addBet(betType, totalBet);
            updateBalance(-totalBet);
            hideBetPrompt();
        } else {
            alert('Invalid bet amount or insufficient balance');
        }
    });

    document.querySelector('.cancel').addEventListener('click', hideBetPrompt);
});