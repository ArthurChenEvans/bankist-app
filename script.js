'use strict';

let account1 = {
    name: 'Arthur',
    user: 'ae',
    pass: '0000',
    interestRate:    1.2,
    transfers: [20000, -500],
    balance: 0,
    isLoggedIn: false,

    calculateBalance() {
        return this.transfers.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    }
};

let accounts = [];

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
const loanBtn = document.getElementById('loan__confirm-btn');
const closeAccBtn = document.getElementById('close__confirm-btn');
const closeUserInput = document.getElementById('confirm-user');
const closePINInput = document.getElementById('confirm-pin');
const sortBtn = document.querySelector('.transfer__footer-sort');
const timerText = document.getElementById('timer');
const transferContainer = document.querySelector('.transfer__container-transfers');

document.addEventListener('DOMContentLoaded', () => {
    accounts.push(account1);
})

loginBtn.addEventListener('click', (event) => {
    event.preventDefault();
    console.log(accounts);
    const evaluateAccount = (account) => (account.user == userInput.value && account.pass == PINInput.value) ? account : null; 
    let accountIndex = accounts.findIndex(evaluateAccount);
    let account = accounts[accountIndex];
    console.log(account);

    if (account != null) {
        account.balance = account.calculateBalance();
        showView(account);
    } else {
        alert('Incorrect login or account does not exist.');
    }
});


transferBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const amountToTransfer = -Number(transferAmount.value);
    if (amountToTransfer >= 0) {
        alert('You cannot transfer 0 or negative money.');
    } else {
        let account = accounts.find(account => account.isLoggedIn === true);
        account.transfers.push(amountToTransfer);
    
        updateTransfersList(amountToTransfer, account);
        updateTotals(account);
        updateBalance(account);
    }
});

loanBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const amountToLoan = Number(loanAmount.value);

    if (amountToLoan <= 0) {
        alert('You cannot take out a loan that is less than or equal to 0.');
    } else {
        let account = accounts.find(account => account.isLoggedIn === true);
        account.transfers.push(amountToLoan);

        updateTransfersList(amountToLoan, account);
        updateTotals(account);
        updateBalance(account);
    }
});

closeAccBtn.addEventListener('click', (event) => {
    event.preventDefault();
    let account = accounts.find(account => account.isLoggedIn === true);
    const user = closeUserInput.value;
    const pin = closePINInput.value;

    if ((user != account.user) || (pin != account.pass)) {
        alert('Incorrect user or pin.');
    } else {
        account.isLoggedIn = false;
        accounts.pop(account);
        mainContent.style.opacity = '0%';
        alert('You have deleted your account!');
    }
});


function showView(account) {
    account.isLoggedIn = true;
    mainContent.style.opacity = '100%';
    document.querySelector('.balance__header-right h1').textContent =
        new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP'}).format(account.balance);
    document.querySelector('#header__text').innerText = `Good Day, ${account.name}!`;
    currentDate.innerText = new Intl.DateTimeFormat('en-GB', { style: 'DD/MM/YYYY' }).format(new Date());
    currentTime.innerText = new Intl.DateTimeFormat('en-GB', { timeStyle: 'long' }).format(new Date().getTime());
    updateTotals(account);
    startTimer();
}

function updateTransfersList(amount, account) {
    let newTransfer = document.createElement('div');
    newTransfer.classList.add('transfer-single');
    transferContainer.prepend(newTransfer);

    let transferInfo = document.createElement('div');
    transferInfo.classList.add('transfer__info');
    newTransfer.append(transferInfo);

    let transferTypeDiv = document.createElement('div')
    let transferAmount = amount;
    let transferType = transferTypeChecker(amount);

    if (transferType == 'deposit') {
        transferTypeDiv.classList.add('deposit');
    } else if (transferType == 'withdrawal') {
        transferTypeDiv.classList.add('withdrawal');
    }

    transferTypeDiv.innerText = `${account.transfers.length} ${transferType}`;
    transferInfo.append(transferTypeDiv);

    let transferDate = document.createElement('div');
    transferDate.classList.add('transfer__date');
    transferDate.innerText = new Intl.DateTimeFormat('en-GB', { style: 'DD/MM/YY' }).format(new Date());
    transferInfo.append(transferDate);

    let transferAmountFormatted = document.createElement('div');
    transferAmountFormatted.classList.add('transfer__amount');
    transferAmountFormatted.innerText = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP'}).format(transferAmount);
    newTransfer.append(transferAmountFormatted);
}

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

function updateBalance(account) {
    account.balance = account.calculateBalance();
    document.querySelector('.balance__header-right h1').textContent =
        new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP'}).format(account.balance);
}