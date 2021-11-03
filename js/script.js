const resetBtn = document.querySelector('.js-reset');
const inputs = document.querySelectorAll('.js-input');
const listItems = document.querySelectorAll('.js-item');
const amountNumbers = document.querySelectorAll('.js-number');
const errorTexts = document.querySelectorAll('.js-error-text');
const percentageBtns = document.querySelectorAll('.js-percentage');

let tip = 0;
const [tipAmount, totalAmount] = amountNumbers;
const [billInput, customInput, peopleInput] = inputs;

const regExes = {
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

const errorStyle = (input) => {
  input.style.color = `${colors.error}`;
  input.style.caretColor = `${colors.error}`;
  input.style.outline = `0.2rem solid ${colors.error}`;
};

const succesStyle = (input) => {
  input.style.color = `${colors.primary}`;
  input.style.caretColor = `${colors.success}`;
  input.style.outline = `0.2rem solid ${colors.success}`;
};

const setErrorState = function (e, msg) {
  errorStyle(e.target);
  e.target.previousElementSibling.lastElementChild.textContent = msg;
};

const setSuccessState = function (e) {
  succesStyle(e.target);
  e.target.previousElementSibling.lastElementChild.textContent = '';
};

const calcTotalAmount = (tipPercentage) => {
  const bill = billInput.value;
  const people = peopleInput.value;

  if (bill > 0 && people > 0) {
    const calcTipPerPerson = ((bill / 100) * tipPercentage) / people;
    const calcTotalPerPerson = bill / people + calcTipPerPerson;

    tipAmount.textContent = `$${calcTipPerPerson.toFixed(2)}`;
    totalAmount.textContent = `$${calcTotalPerPerson.toFixed(2)}`;
  }
};

const selectTip = function () {
  listItems.forEach((item) =>
    item.addEventListener('click', (e) => {
      tip = e.target.dataset.percentage;

      calcTotalAmount(tip);
    })
  );
};

const validateInput = function (e, ...regex) {
  let value = e.target.value;

  resetBtn.removeAttribute('disabled');

  if (!value || value === '0') setErrorState(e, "Can't be zero");
  else if (testRegExp(regex[0], value) || testRegExp(regex[1], value))
    setErrorState(e, 'Positive numbers only');
  else if (testRegExp(regex[2], value))
    setErrorState(e, "Can't start with zero");
  else if (value.split(/[\.]/).length > 2)
    setErrorState(e, "Can't have two dots");
  else {
    setSuccessState(e);
    calcTotalAmount(tip);
  }
};

const validateCustomInput = function (e) {
  const value = e.target.value;

  if (
    value < 0 ||
    value === '0' ||
    value.split(/[\.]/).length > 2 ||
    testRegExp(regExes.num, value) ||
    testRegExp(regExes.zero, value) ||
    testRegExp(regExes.letter, value)
  )
    errorStyle(e.target);
  else {
    succesStyle(e.target);

    tip = customInput.value;

    calcTotalAmount(tip);
  }

  value === '' && (e.target.style.outline = '0');

  resetBtn.removeAttribute('disabled');

  removeBtnActiveClass();
};

const resetAll = function () {
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

resetBtn.addEventListener('click', resetAll);
customInput.addEventListener('input', validateCustomInput);
billInput.addEventListener('input', (e) =>
  validateInput(e, regExes.num, regExes.letter, regExes.zero)
);
peopleInput.addEventListener('input', (e) =>
  validateInput(e, regExes.people, regExes.letter, regExes.zero)
);

const setActiveState = function () {
  listItems.forEach((item) =>
    item.addEventListener('click', (e) => {
      listItems.forEach(() => {
        removeBtnActiveClass();
        customInput.value = '';
        customInput.style.outline = '0';
        customInput.style.color = `${colors.primary}`;
        resetBtn.removeAttribute('disabled');
        e.target.classList.add('calc__item--active');
      });
    })
  );
};

const setInputOutline = function () {
  inputs.forEach((input) =>
    input.addEventListener('click', (e) => {
      inputs.forEach((input) => {
        resetBtn.removeAttribute('disabled');
        input.style.outline = `0.2rem solid transparent`;
        e.target.style.outline = `0.2rem solid ${colors.success}`;
      });
    })
  );
};

window.onload = () => {
  inputs.forEach((input) => (input.value = ''));
  resetBtn.setAttribute('disabled', true);
};

(() => {
  selectTip();
  setActiveState();
  setInputOutline();
})();
