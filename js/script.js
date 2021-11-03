let currentTip = 0;

const resetBtn = document.querySelector('.js-reset');
const inputs = document.querySelectorAll('.js-input');
const listItems = document.querySelectorAll('.js-item');
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

const colors = {
  primary: 'hsl(183, 100%, 15%)',
  success: 'hsl(172, 67%, 45%)',
  error: 'hsl(10, 44%, 59%)',
};

const testRegExp = (regex, val) => new RegExp(regex).test(val);

const removeBtnActiveClass = () =>
  listItems.forEach((item) => item.classList.remove('calc__item--active'));

const setStateStyle = (input, ...colors) => {
  const [color, caretColor, outlineColor] = colors;

  input.style.color = `${color}`;
  input.style.caretColor = `${caretColor}`;
  input.style.outline = `0.2rem solid ${outlineColor}`;
};

const setErrorState = function (e, msg) {
  setStateStyle(e.target, colors.error, colors.error, colors.error);
  e.target.previousElementSibling.lastElementChild.textContent = msg;
};

const setSuccessState = function (e) {
  setStateStyle(e.target, colors.primary, colors.success, colors.success);
  e.target.previousElementSibling.lastElementChild.textContent = '';
};

const setInputOutline = function (e) {
  inputs.forEach((input) => {
    if (e.target.closest('.js-input')) {
      resetBtn.removeAttribute('disabled');
      input.style.outline = `0.2rem solid transparent`;
      e.target.style.outline = `0.2rem solid ${colors.success}`;
    } else {
      input.style.outline = `0.2rem solid transparent`;
      e.target.style.outline = `0.2rem solid transparent`;
    }
  });
};

const setPercentageBtnsState = function (e) {
  listItems.forEach(() => {
    removeBtnActiveClass();
    customInput.value = '';
    customInput.style.outline = '0';
    customInput.style.color = `${colors.primary}`;
    resetBtn.removeAttribute('disabled');
    e.target.classList.add('calc__item--active');

    currentTip = e.target.dataset.percentage;
    calcTotalAmount(currentTip);
  });
};

const resetAll = function () {
  currentTip = 0;
  removeBtnActiveClass();

  inputs.forEach((el) => {
    el.value = '';
    el.style.outline = 0;
    el.style.color = `${colors.primary}`;
    el.style.caretColor = `${colors.success}`;
  });
  errorTexts.forEach((el) => (el.textContent = ''));
  amountNumbers.forEach((el) => (el.textContent = '$0.00'));

  resetBtn.setAttribute('disabled', true);
};

const calcTotalAmount = (tipPercentage) => {
  const bill = billInput.value;
  const people = peopleInput.value;
  const calcTipPerPerson = ((bill / 100) * tipPercentage) / people;
  const calcTotalPerPerson = bill / people + calcTipPerPerson;

  if (bill > 0 && people > 0) {
    tipAmount.textContent = `$${calcTipPerPerson.toFixed(2)}`;
    totalAmount.textContent = `$${calcTotalPerPerson.toFixed(2)}`;
  } else if (bill > 0) {
    totalAmount.textContent = `$${(bill / 1).toFixed(2)}`;
  }
};

const validateInput = function (e, ...regex) {
  const value = e.target.value;

  resetBtn.removeAttribute('disabled');

  if (value === '0') setErrorState(e, "Can't be zero");
  else if (value > 999999) setErrorState(e, 'WTF!!! WHO ARE YOU???');
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

  if (
    value < 0 ||
    value > 100 ||
    value === '0' ||
    value.split(/[\.]/).length > 2 ||
    testRegExp(regExes.dot, value) ||
    testRegExp(regExes.num, value) ||
    testRegExp(regExes.zero, value) ||
    testRegExp(regExes.letter, value)
  )
    setStateStyle(e.target, colors.error, colors.error, colors.error);
  else {
    setStateStyle(e.target, colors.primary, colors.success, colors.success);

    currentTip = value;
    calcTotalAmount(currentTip);
  }

  value === '' && (e.target.style.outline = '0');

  resetBtn.removeAttribute('disabled');

  removeBtnActiveClass();
};

resetBtn.addEventListener('click', resetAll);
document.addEventListener('click', setInputOutline);
listItems.forEach((item) =>
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
  inputs.forEach((input) => (input.value = ''));
  resetBtn.setAttribute('disabled', true);
});
