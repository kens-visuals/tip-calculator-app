'use strict';

const resetBtn = document.querySelector('.js-reset');
const customInput = document.querySelector('.js-input--custom');
const items = document.querySelectorAll('.js-item');
const inputs = document.querySelectorAll('.js-input');
const numbers = document.querySelectorAll('.js-number');
const errorTexts = document.querySelectorAll('.js-error-text');
const percentageBtns = document.querySelectorAll('.js-percentage');

const [billInput, peopleInput] = inputs;
const [tipAmount, totalAmount] = numbers;
const [billErrorText, peopleErrorText] = errorTexts;

const setActiceState = function () {
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      items.forEach((i) => i.classList.remove('calc__item--active'));
      e.target.classList.add('calc__item--active');
    });
  });
};

const setErrorState = function (e, msg) {
  e.target.previousElementSibling.lastElementChild.textContent = msg;
  e.target.classList.add('calc__error-input');
  items.forEach((i) => i.classList.remove('calc__item--active'));
};

const setSuccessState = function (e) {
  e.target.previousElementSibling.lastElementChild.textContent = '';
  e.target.classList.remove('calc__error-input');
};

const validateInput = function (e) {
  const value = e.target.value;
  const regex = /[0-9/\.]+/g;

  resetBtn.removeAttribute('disabled');

  if (!value || value === '' || value === '0')
    setErrorState(e, "Can't be zero");
  else if (!regex.test(value)) setErrorState(e, 'No letters allowed');
  else if (value < 0) setErrorState(e, "Can't be negative");
  else setSuccessState(e);
};

const resetAll = function () {
  customInput.value = '';
  inputs.forEach((el) => {
    el.value = '';
    el.classList.remove('calc__error-input');
  });
  errorTexts.forEach((el) => (el.textContent = ''));
  items.forEach((i) => i.classList.remove('calc__item--active'));
};

resetBtn.addEventListener('click', resetAll);
inputs.forEach((el) => el.addEventListener('keyup', validateInput));

customInput.addEventListener('keyup', (e) => {
  const value = e.target.value;
  if (!value || value === '' || value === '0' || !/[0-9/\.]+/.test(value)) {
    e.target.classList.add('calc__error-input');
  } else {
    e.target.classList.remove('calc__error-input');
    resetBtn.removeAttribute('disabled');
  }
});

window.onload = () =>
  [...inputs].map((el) => {
    el.value = '';
    resetBtn.setAttribute('disabled', true);
  });

(() => {
  setActiceState();
})();
