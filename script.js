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
const totalInterest = document.getElementById('interest-amount');
const currentDate = document.getElementById('balance__date');
const currentTime = document.getElementById('balance__time');
const transferTo = document.getElementById('transfer-to');
const transferAmount = document.getElementById('transfer-amount');
const transferBtn = document.getElementById('transfer__confirm-btn');
const loanAmount = document.getElementById('loan-amount');
const loanBtn = document.getElementById('login__btn');
const closeAccBtn = document.getElementById('close__confirm-btn');
const sortBtn = document.querySelector('.transfer__footer-sort');
const timerText = document.getElementById('timer');
const transferContainer = document.querySelector('.transfer__container-transfers');

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
            currentDate.innerText = new Intl.DateTimeFormat('en-GB', { style: 'DD/MM/YYYY' }).format(new Date());
            currentTime.innerText = new Intl.DateTimeFormat('en-GB', { timeStyle: 'long' }).format(new Date().getTime());
            updateTotals(account);
            startTimer();
        } else {
            alert('Incorrect login.');
        }
    })
});

transferBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const transferPerson = transferTo.value;
    const amountToTransfer = transferAmount.value;

    let newTransfer = document.createElement('div');
    newTransfer.classList.add('transfer-single');
    transferContainer.prepend(newTransfer);


})


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