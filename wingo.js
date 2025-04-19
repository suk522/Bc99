
let balance = 10000;
let currentRound = 4;
let timeLeft = 30;
let timer;
let selectedAmount = 0;
let selectedMultiplier = 1;

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
