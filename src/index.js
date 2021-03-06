import words from './words';

const maxGuesses = 5;
let guessesLeft = maxGuesses;
const category = randomCategory();
const word = randomWord(category);
const wordLetters = [...word];
const guessedLetters = new Set();

function randomCategory() {
  let categories = [];

  for (const entry of words.entries()) {
    let [index, object] = entry;
    categories.push(object);
  }

  return categories[Math.floor(Math.random() * categories.length)];
}

function randomWord(category) {
  return category.words[Math.floor(Math.random() * category.words.length)].toUpperCase();
}

hangman({word, maxGuesses: maxGuesses});

function hangman({word, maxGuesses = 5}) {
  const components = [
    alphabetComponent(),
    categoryComponent(category),
    wordComponent(word),
    guessesLeftComponent(maxGuesses),
    newWordComponent()
  ];

  appContainer().innerHTML = components.join('');
  addLetterClickListeners();
}

function alphabetComponent(letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ') {
  return `
    <div id="alphabet">
      <ul>
        ${[...letters].map(letter => `<li class="${letter}">${letter}</li>`).join('')}
      </ul>
    </div>
`;
}

function categoryComponent(category) {
  return `<div id="category">${category.category}</div>`;
}

function wordComponent(word) {
  return `
    <div id="word">
      <ul>
        ${[...word].map(letter => {
          if (letter === '-') {
            return `<li disabled="disabled">${letter}</li>`;
          } else if (letter === ' ') {
            return `<li class="space" disabled="disabled">&nbsp;</li>`;
          } else {
            return `<li class="${letter}">${letter}</li>`;
          }
        }).join('')}  
      </ul>
    </div>`;
}

function guessesLeftComponent(guessesLeft) {
  return `<div id="guesses">${guessesLeft}</div>`;
}

function newWordComponent() {
  return `<div id="new-word" onclick="window.location.reload();">
            <i class="fa fa-arrow-right" aria-hidden="true"></i>
          </div>`;
}

function appContainer() {
  return document.querySelector('#app');
}

function addLetterClickListeners() {
  const letters = Array.from(document.querySelectorAll('#alphabet li'));
  letters.forEach(letter => letter.addEventListener('click', event => letterClickListener(letter)));
}

function letterClickListener(element) {
  const letter = element.className;
  const letters = Array.from(document.querySelectorAll(`li.${letter}`));
  letters.forEach(letter => letter.setAttribute('disabled', 'disabled'));

  updateGameStatus(letter);
}

function updateGameStatus(letter) {
  const alreadyGuessedLetter = guessedLetters.has(letter);

  if (!alreadyGuessedLetter) {
    guessedLetters.add(letter);
  }

  const guessed = wordLetters.filter(letter => !['-', ' '].includes(letter)).every(letter => guessedLetters.has(letter));

  if (guessed) {
    appContainer().innerHTML += '<div id="game-result" onclick="window.location.reload();">:-)</div>';
  } else if (!alreadyGuessedLetter && !wordLetters.includes(letter)) {
    guessesLeft--;
    document.querySelector('#guesses').innerHTML = String(guessesLeft);

    if (guessesLeft === 0) {
      appContainer().innerHTML += '<div id="game-result" onclick="window.location.reload();">:-(</div>';
    }
  }
}
