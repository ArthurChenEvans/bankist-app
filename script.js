'use strict';

let account1 = {
    name: 'Arthur',
    user: 'ae',
    pass: '0000',
    balance: 19500
}

let accounts = []

const userInput = document.getElementById('user__input');
const PINInput = document.getElementById('pin__input');
const loginBtn = document.getElementById('login__btn');
const mainContent = document.querySelector('.balance__container');
const timerText = document.getElementById('timer');

document.addEventListener('DOMContentLoaded', () => {
    accounts.push(account1);
})

loginBtn.addEventListener('click', (event) => {
    accounts.forEach(account => {
        event.preventDefault();
        if ((account.user == userInput.value) && (account.pass == PINInput.value)) {
            mainContent.style.opacity = '100%';
            document.querySelector('.balance__header-right h1').textContent =
                new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP'}).format(account.balance);
            document.querySelector('#header__text').innerText = `Good Day, ${account.name}!`;
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