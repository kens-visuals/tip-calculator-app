let currentTip = 0;

const resetBtn = document.querySelector('.js-reset');
const inputs = document.querySelectorAll('.js-input');
const percentBtn = document.querySelectorAll('.js-btn');
const amountNumbers = document.querySelectorAll('.js-number');
const errorTexts = document.querySelectorAll('.js-error-text');
const percentageBtns = document.querySelectorAll('.js-percentage');

const [tipAmount, totalAmount] = amountNumbers;
const [billInput, customInput, peopleInput] = inputs;

const regExes = {
  dot: /^\.$/g,
  zero: /^0\d+/g,
  num: /[^0-9\.]+/g,
  people: /[^0-9]+/g,
  letter: /[a-zA-Z,/<>\?;':""[\]\\{}\|`~!@#\$%\^&\*()_=\+]+/g,
};

const testRegExp = (regex, val) => new RegExp(regex).test(val);

const removeBtnActiveClass = () =>
  percentBtn.forEach((item) => item.classList.remove('calc__btn--active'));

const setErrorState = function (e, msg) {
  e.target.classList.add('calc__input--error');
  e.target.setAttribute('aria-invalid', 'true');
  e.target.setAttribute('aria-describedBy', msg);
  e.target.previousElementSibling.lastElementChild.textContent = msg;
};

const setSuccessState = function (e) {
  e.target.removeAttribute('aria-invalid');
  e.target.removeAttribute('aria-describedBy');
  e.target.classList.remove('calc__input--error');
  e.target.previousElementSibling.lastElementChild.textContent = '';
};

const setPercentageBtnsState = function (e) {
  percentBtn.forEach(() => {
    removeBtnActiveClass();
    customInput.value = '';
    customInput.classList.remove('calc__input--error');
    e.target.classList.add('calc__btn--active');
    resetBtn.removeAttribute('disabled');

    currentTip = e.target.value;
    calcTotalAmount(currentTip);
  });
};

const resetAll = function () {
  currentTip = 0;
  removeBtnActiveClass();
  resetBtn.setAttribute('disabled', true);

  inputs.forEach((el) => {
    el.value = '';
    el.classList.remove('calc__input--error');
  });
  errorTexts.forEach((el) => (el.textContent = ''));
  amountNumbers.forEach((el) => (el.textContent = '$0.00'));
};

const calcTotalAmount = (tipPercentage) => {
  const bill = billInput.value;
  const people = peopleInput.value;
  const calcTipPerPerson = ((bill / 100) * tipPercentage) / people;
  const calcTotalPerPerson = bill / people + calcTipPerPerson;

  if (bill > 0 && bill < 999999 && people > 0 && people < 99) {
    tipAmount.textContent = `$${calcTipPerPerson.toFixed(2)}`;
    totalAmount.textContent = `$${calcTotalPerPerson.toFixed(2)}`;
  } else if (bill > 0) {
    totalAmount.textContent = `$${(bill / 1).toFixed(2)}`;
  } else if (bill === '' || people === '') {
    tipAmount.textContent = `$0.00`;
    totalAmount.textContent = `$0.00`;
  }
};

const validateInput = function (e, ...regex) {
  const value = e.target.value;

  resetBtn.removeAttribute('disabled');

  if (value === '0') setErrorState(e, "Can't be zero");
  else if (
    (value > 999999 && e.target.name === 'bill') ||
    (value > 99 && e.target.name === 'number of people')
  )
    setErrorState(e, 'WTF!!! WHO ARE YOU???');
  else if (testRegExp(regex[0], value) || testRegExp(regex[1], value))
    setErrorState(e, 'Positive numbers only');
  else if (testRegExp(regex[2], value))
    setErrorState(e, "Can't start with zero");
  else if (value.split(/[\.]/).length > 2)
    setErrorState(e, "Can't have two dots");
  else {
    setSuccessState(e);
    calcTotalAmount(currentTip);
  }
};

const validateCustomInput = function (e) {
  const value = e.target.value;

  removeBtnActiveClass();
  resetBtn.removeAttribute('disabled');

  if (
    value < 0 ||
    value > 100 ||
    value === '0' ||
    value.split(/[\.]/).length > 2 ||
    testRegExp(regExes.dot, value) ||
    testRegExp(regExes.num, value) ||
    testRegExp(regExes.zero, value) ||
    testRegExp(regExes.letter, value)
  ) {
    e.target.classList.add('calc__input--error');
  } else {
    currentTip = value;
    calcTotalAmount(currentTip);
    e.target.classList.remove('calc__input--error');
  }

  value === '' && e.target.classList.remove('calc__input--error');
};

resetBtn.addEventListener('click', resetAll);
percentBtn.forEach((item) =>
  item.addEventListener('click', setPercentageBtnsState)
);

customInput.addEventListener('input', validateCustomInput);
billInput.addEventListener('input', (e) =>
  validateInput(e, regExes.num, regExes.letter, regExes.zero)
);
peopleInput.addEventListener('input', (e) =>
  validateInput(e, regExes.people, regExes.letter, regExes.zero)
);

window.addEventListener('load', () => {
  resetBtn.setAttribute('disabled', true);
  inputs.forEach((input) => (input.value = ''));
});
