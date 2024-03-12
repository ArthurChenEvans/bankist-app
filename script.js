'use strict';

let account1 = {
    name: 'Arthur',
    user: 'ae',
    pass: '0000',
    balance: 19500,
    interestRate:    1.2,
    transfers: [20000, -500],
    isLoggedIn: false,
}

let accounts = []

const userInput = document.getElementById('user__input');
const PINInput = document.getElementById('pin__input');
const loginBtn = document.getElementById('login__btn');
const mainContent = document.querySelector('.balance__container');
const totalIn = document.getElementById('in-amount');
const totalOut = document.getElementById('out-amount');
const totalInterest = document.getElementById('interest-amount')
const sortBtn = document.querySelector('.transfer__footer-sort');
const timerText = document.getElementById('timer');

document.addEventListener('DOMContentLoaded', () => {
    accounts.push(account1);
})

loginBtn.addEventListener('click', (event) => {
    accounts.forEach(account => {
        event.preventDefault();
        if ((account.user == userInput.value) && (account.pass == PINInput.value)) {
            account.isLoggedIn = true;
            mainContent.style.opacity = '100%';
            document.querySelector('.balance__header-right h1').textContent =
                new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP'}).format(account.balance);
            document.querySelector('#header__text').innerText = `Good Day, ${account.name}!`;
            updateTotals(account);
            startTimer();
        } else {
            alert('Incorrect login.');
        }
    })
});


function startTimer() {
    let timer = 10 * 60;

    updateTimerText(timer);

    setInterval(function () {
        timer--;
        updateTimerText(timer);
    }, 1000);
}

function updateTimerText(timer) {
    let minutes = String(parseInt(timer / 60, 10)).padStart(2, '0');
    let seconds = String(parseInt(timer % 60, 10)).padStart(2, '0');

    timerText.textContent = `${minutes}:${seconds}`;
}

function updateTotals(account) {
    totalIn.innerText = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP'}).format(account.transfers
        .filter(x => x > 0)
        .reduce((previousValue, currentValue) => previousValue + currentValue));
    totalOut.innerText = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP'}).format(account.transfers
        .filter(x => x < 0)
        .reduce((previousValue, currentValue) => previousValue - currentValue));

     totalInterest.innerText = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP'}).format(account.transfers
        .filter(mov => mov > 0)
        .map(mov => mov * (account.interestRate / 100))
        .filter(int => int > 1)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0));
}

function transferTypeChecker(transfer) {
    if (transfer > 0) {
        return 'deposit';
    } else if (transfer < 0) {
        return 'withdrawal';
    }
}