
let balance = 10000;
let currentRound = 4;
let timeLeft = 10;
let timer;

function updateBalance(amount) {
    balance += amount;
    document.querySelector('.balance-amount').textContent = `₹${balance}`;
}

function updateTimer() {
    const timerDisplay = document.querySelector('.timer span');
    timerDisplay.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
    
    if (timeLeft === 0) {
        clearInterval(timer);
        generateResult();
        timeLeft = 10;
        currentRound++;
        timer = setInterval(updateTimer, 1000);
    }
    timeLeft--;
}

function generateResult() {
    const number = Math.floor(Math.random() * 10);
    const resultNumber = document.querySelector('.result-number');
    resultNumber.textContent = number;
    
    // Update color based on number
    resultNumber.className = 'result-number';
    if (number === 0 || number === 5) {
        resultNumber.classList.add('violet');
    } else if (number % 2 === 0) {
        resultNumber.classList.add('green');
    } else {
        resultNumber.classList.add('red');
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    timer = setInterval(updateTimer, 1000);
    
    // Add click handlers for betting buttons
    document.querySelectorAll('.color-btn, .number-btn, .size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const betAmount = 100; // Default bet amount
            updateBalance(-betAmount);
            // Show bet confirmation
            alert(`Bet placed: ₹${betAmount}`);
        });
    });
});
