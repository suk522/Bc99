
let balance = 10000;
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
    bettingHistory.unshift({
        partyNumber: currentPartyNumber,
        type: type,
        amount: amount,
        status: 'pending',
        timestamp: new Date().toISOString()
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
            // Determine win/loss based on bet type and result
            let won = false;
            if (bet.type === 'violet' && (number === 0 || number === 5)) won = true;
            else if (bet.type === 'green' && [2,4,6,8].includes(number)) won = true;
            else if (bet.type === 'red' && [1,3,7,9].includes(number)) won = true;
            else if (bet.type === number) won = true;
            
            bet.status = won ? 'win' : 'loss';
            updateBalance(won ? bet.amount * 2 : -bet.amount);
        }
    });
    
    updateGameHistory();
    updateBettingHistory();
}

function updateBalance(amount) {
    balance += amount;
    document.querySelector('.balance-amount').textContent = `₹${balance}`;
}

function updateTimer() {
    const timerDisplay = document.querySelector('.timer span');
    timerDisplay.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
    
    if (timeLeft === 0) {
        generateResult();
        timeLeft = 30;
        currentRound++;
        document.querySelector('.round-number').textContent = currentRound.toString().padStart(5, '0');
    }
    timeLeft--;
}

function generateResult() {
    const number = Math.floor(Math.random() * 10);
    const resultNumber = document.querySelector('.result-number');
    resultNumber.textContent = number;
    
    resultNumber.className = 'result-number';
    if (number === 0 || number === 5) {
        resultNumber.classList.add('violet');
    } else if ([2,4,6,8].includes(number)) {
        resultNumber.classList.add('green');
    } else {
        resultNumber.classList.add('red');
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
    betList.innerHTML = bettingHistory.slice(0, 10).map(bet => `
        <div class="history-item">
            <span>Party: ${bet.partyNumber}</span>
            <span>Type: ${bet.type}</span>
            <span>Amount: ₹${bet.amount}</span>
            <span class="status ${bet.status}">${bet.status}</span>
        </div>
    `).join('');
}

function showBetPrompt() {
    document.getElementById('betPrompt').style.display = 'flex';
}

function hideBetPrompt() {
    document.getElementById('betPrompt').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    timer = setInterval(updateTimer, 1000);
    
    const betPrompt = document.getElementById('betPrompt');
    const allBetButtons = document.querySelectorAll('.color-btn, .number-btn, .size-btn');
    
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
        
        if (totalBet && totalBet <= balance) {
            updateBalance(-totalBet);
            hideBetPrompt();
        } else {
            alert('Invalid bet amount or insufficient balance');
        }
    });

    document.querySelector('.cancel').addEventListener('click', hideBetPrompt);
});
