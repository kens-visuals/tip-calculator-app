const ZERO_REGEX = /0\d+/g;
const NUM_REGEX = /[^0-9\.]+/g;
const PEOPLE_REGEX = /[^0-9]+/g;
const NEGATIVE_REGEX = /[\-]+/g;
const LETTER_REGEX = /[a-zA-Z,/<>\?;':""[\]\\{}\|`~!@#\$%\^&\*()_=\+]+/g;

const resetBtn = document.querySelector('.js-reset');
const customInput = document.querySelector('.js-input--custom');
const items = document.querySelectorAll('.js-item');
const inputs = document.querySelectorAll('.js-input');
const numbers = document.querySelectorAll('.js-number');
const errorTexts = document.querySelectorAll('.js-error-text');
const percentageBtns = document.querySelectorAll('.js-percentage');

const [billInput, custom, peopleInput] = inputs;
const [tipAmount, totalAmount] = numbers;
const [billErrorText, percentageErrorText, peopleErrorText] = errorTexts;

const testRegexp = (regex, val) => new RegExp(regex).test(val);

const setActiveState = function () {
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      resetBtn.removeAttribute('disabled');

      items.forEach((i) => i.classList.remove('calc__item--active'));
      e.target.classList.add('calc__item--active');
    });
  });
};

const setErrorState = function (e, msg) {
  e.target.previousElementSibling.lastElementChild.textContent = msg;
  e.target.style.outline = '0.2rem solid hsl(10, 44%, 59%)';
  items.forEach((i) => i.classList.remove('calc__item--active'));
};

const setSuccessState = function (e) {
  e.target.previousElementSibling.lastElementChild.textContent = '';
  e.target.style.outline = '0.2rem solid hsl(172, 67%, 45%)';
};

const validateInput = function (e, ...regex) {
  let value = e.target.value;

  resetBtn.removeAttribute('disabled');

  if (!value || value === '0') setErrorState(e, "Can't be zero");
  else if (testRegexp(regex[0], value) || testRegexp(regex[1], value))
    setErrorState(e, 'Positive numbers only');
  else if (testRegexp(regex[2], value))
    setErrorState(e, "Can't start with zero");
  else setSuccessState(e);
};

// const validateBillInput = function (e) {
//   let value = e.target.value;

//   resetBtn.removeAttribute('disabled');
//   // e.target.value = e.target.value.replace(/[a-zA-Z\\\_]*/g, '');

//   if (!value || value === '0') {
//     setErrorState(e, "Can't be zero");
//   } else if (NUM_REGEX.test(value) || LETTER_REGEX.test(value))
//     setErrorState(e, "Can't be special character");
//   else if (value < 0 || NEGATIVE_REGEX.test(value))
//     setErrorState(e, "Can't be negative");
//   else if (ZERO_REGEX.test(value)) setErrorState(e, "Can't start with zero");
//   else setSuccessState(e);
// };

const validateCustomInput = function (e) {
  const value = e.target.value;

  resetBtn.removeAttribute('disabled');

  if (NUM_REGEX.test(value) || LETTER_REGEX.test(value))
    customInput.style.outline = '0.2rem solid hsl(10, 44%, 59%)';
  else if (NUM_REGEX.test(value) || value < 0 || NEGATIVE_REGEX.test(value))
    customInput.style.outline = '0.2rem solid hsl(10, 44%, 59%)';
  else customInput.style.outline = '0.2rem solid hsl(172, 67%, 45%)';

  if (value === '') customInput.style.outline = 0;
};

// const validatePeopleInput = function (e) {
//   const value = e.target.value;

//   resetBtn.removeAttribute('disabled');

//   if (!value || value === '0') setErrorState(e, "Can't be zero");
//   else if (PEOPLE_REGEX.test(value) || LETTER_REGEX.test(value))
//     setErrorState(e, 'Only numbers allowed');
//   else if (value < 0 || NEGATIVE_REGEX.test(value))
//     setErrorState(e, "Can't be negative");
//   else if (ZERO_REGEX.test(value)) setErrorState(e, "Can't start with zero");
//   else setSuccessState(e);
// };

const resetAll = function () {
  customInput.value = '';
  customInput.style.outline = '0';
  inputs.forEach((el) => {
    el.value = '';
    el.style.outline = '0';
  });
  errorTexts.forEach((el) => (el.textContent = ''));
  items.forEach((i) => i.classList.remove('calc__item--active'));

  if ([billInput, peopleInput, customInput].every((el) => el.value === ''))
    resetBtn.setAttribute('disabled', true);
};

resetBtn.addEventListener('click', resetAll);
customInput.addEventListener('keyup', validateCustomInput);
billInput.addEventListener('keyup', (e) =>
  validateInput(e, NUM_REGEX, LETTER_REGEX, ZERO_REGEX)
);
peopleInput.addEventListener('keyup', (e) =>
  validateInput(e, PEOPLE_REGEX, LETTER_REGEX, ZERO_REGEX)
);

window.onload = () =>
  [...inputs].map((el) => {
    el.value = '';
    resetBtn.setAttribute('disabled', true);
  });

(() => {
  setActiveState();
})();
