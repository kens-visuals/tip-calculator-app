const regExes = {
  zero: /0\d+/g,
  num: /[^0-9\.]+/g,
  people: /[^0-9]+/g,
  letter: /[a-zA-Z,/<>\?;':""[\]\\{}\|`~!@#\$%\^&\*()_=\+]+/g,
};

const colors = {
  primary: 'hsl(183, 100%, 15%)',
  error: 'hsl(10, 44%, 59%)',
  success: 'hsl(172, 67%, 45%)',
};

const resetBtn = document.querySelector('.js-reset');
const items = document.querySelectorAll('.js-item');
const inputs = document.querySelectorAll('.js-input');
const numbers = document.querySelectorAll('.js-number');
const errorTexts = document.querySelectorAll('.js-error-text');
const percentageBtns = document.querySelectorAll('.js-percentage');

const [billInput, customInput, peopleInput] = inputs;
const [tipAmount, totalAmount] = numbers;

const testRegExp = (regex, val) => new RegExp(regex).test(val);

const errorStyle = (input) => {
  input.style.outline = `0.2rem solid ${colors.error}`;
  input.style.color = `${colors.error}`;
  input.style.caretColor = `${colors.error}`;
};
const succesStyle = (input) => {
  input.style.outline = `0.2rem solid ${colors.success}`;
  input.style.color = `${colors.primary}`;
  input.style.caretColor = `${colors.success}`;
};

const setActiveState = function () {
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      resetBtn.removeAttribute('disabled');

      items.forEach((item) => item.classList.remove('calc__item--active'));
      e.target.classList.add('calc__item--active');
    });
  });
};

const setErrorState = function (e, msg) {
  errorStyle(e.target);
  e.target.previousElementSibling.lastElementChild.textContent = msg;
  items.forEach((i) => i.classList.remove('calc__item--active'));
};
const setSuccessState = function (e) {
  succesStyle(e.target);
  e.target.previousElementSibling.lastElementChild.textContent = '';
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
  else setSuccessState(e);
};

const validateCustomInput = function (e) {
  const value = e.target.value;

  resetBtn.removeAttribute('disabled');

  if (testRegExp(regExes.num, value) || testRegExp(regExes.letter, value))
    errorStyle(e.target);
  else if (value < 0) errorStyle(e.target);
  else if (value.split(/[\.]/).length > 2) errorStyle(e.target);
  else succesStyle(e.target);

  value === '' && (customInput.style.outline = '0');

  items.forEach((item) => item.classList.remove('calc__item--active'));
};

const resetAll = function () {
  inputs.forEach((el) => {
    el.value = '';
    el.style.outline = 0;
    el.style.color = `${colors.primary}`;
    el.style.caretColor = `${colors.success}`;
  });

  errorTexts.forEach((el) => (el.textContent = ''));
  items.forEach((item) => item.classList.remove('calc__item--active'));

  [billInput, peopleInput, customInput].every((el) => el.value === '') &&
    resetBtn.setAttribute('disabled', true);
};

resetBtn.addEventListener('click', resetAll);
customInput.addEventListener('keyup', validateCustomInput);
billInput.addEventListener('keyup', (e) =>
  validateInput(e, regExes.num, regExes.letter, regExes.zero)
);
peopleInput.addEventListener('keyup', (e) =>
  validateInput(e, regExes.people, regExes.letter, regExes.zero)
);

window.onload = () =>
  [...inputs].map((el) => {
    el.value = '';
    resetBtn.setAttribute('disabled', true);
  });

(() => {
  setActiveState();
})();
