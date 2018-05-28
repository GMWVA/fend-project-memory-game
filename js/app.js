// Global varibles
const deck = document.querySelector('.deck');
const icons = document.querySelectorAll('.card i');
const moveCount = document.querySelector('span.moves');
const resetButton = document.querySelector('.restart');
const stars = document.querySelector('.stars');
const star = '<li><i class="fa fa-star"></i></li>';
const timer = document.querySelector('.timer');
const winModal = document.querySelector('#winModal');
const button = document.querySelector('.btn');
const winMessage = document.querySelector('.modal-content p');

// Local varibles
let cardsArr = [];
let compareArr = [];
let matched = 0;
let moves = 0;
let mins = 0;
let secs = 0;
let click = 0;
let time = timer.innerHTML;
let clockId;
let starCount = 0;

/*
 * Create a list that holds all of your cards
 */

// Grab icon names and push to array function
function loadCards(Arr) {
  icons.forEach(function(elm) {
    Arr.push(elm.className);
  });
}

// Reset listener function
function resetEvent() {
  resetButton.addEventListener('click', reset);
}

//  Reset function
function reset() {
  window.location.reload();
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//  Setup function
function setBoard(Arr) {
  let newArr = shuffle(Arr);
  let newCard = '';
  let count = 1;
  cardsArr.forEach(function(elm) {
    newCard += `<li id="card${count}" class="card"><i class="${elm}"></i></li>`;
    count++;
  });
  deck.innerHTML = newCard;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Card selection listener function
function deckEvent() {
  deck.addEventListener('click', function(evt) {
    click++;
    if (evt.target.nodeName !== 'LI') {
      return;
    }
    const clickedCard = evt.target;
    // display
    display(clickedCard);
    // compare
    compare(clickedCard);
    // timer
    timerStart();
  });
}

// Display function
function display(card) {
  card.classList.add('open', 'show', 'turn');
}

// Compare function
function compare(card) {
  if (compareArr.length === 0) {
    compareArr.push(card);
    return;
  } else {
    compareArr.push(card);
    if (
      compareArr[0].innerHTML === card.innerHTML &&
      compareArr[0].id !== card.id
    ) {
      match(compareArr);
    } else {
      noMatch(compareArr);
    }
  }
}

// Match function
function match(cards) {
  matched++;
  cards.forEach(function(elm) {
    elm.classList.add('match');
  });
  compareArr = [];
  increaseMoves();
  starCheck();
  win();
}

// No match function
function noMatch(cards) {
  cards.forEach(function(elm) {
    elm.classList.add('noMatch');
    setTimeout(function() {
      cards.forEach(function(elm) {
        elm.classList.remove('open', 'show', 'turn', 'noMatch');
      });
    }, 1000);
  });
  compareArr = [];
  increaseMoves();
  starCheck();
}

// Move counter function
function increaseMoves() {
  moves++;
  moveCount.textContent = `${moves}`;
}

// Stars function
function starCheck() {
  if (moves <= 8) {
    stars.innerHTML = `${star}${star}${star}`;
    starCount = 3;
  } else if (moves >= 9 && moves <= 16) {
    stars.innerHTML = `${star}${star}`;
    starCount = 2;
  } else {
    stars.innerHTML = `${star}`;
    starCount = 1;
  }
}

// Timer function
function timerStart() {
  if (click === 1) {
    const clock = setInterval(function() {
      secs++;
      if (secs === 60) {
        mins++;
        secs = 0;
      }
      timer.innerHTML = `${mins} mins ${secs} secs`;
    }, 1000);
    clockId = clock;
  }
}

// Reset timer function
function timerReset() {
  timer.innerHTML = `${mins} mins ${secs} secs`;
}

// Stop timer function
function timerStop() {
  clearInterval(clockId);
}

// Modal function
function showModal(modal) {
  modal.style.display = 'block';
  winMessage.innerHTML = `<strong>You Win!</strong>
  <p>You Beat The Game In Only ${moves} Moves.</p>
  <p>With A Time Of ${mins} Minutes and ${secs} seconds</p>
  <p>You Got ${starCount} Stars!`;
}

// Play again listener function
button.addEventListener('click', reset);

// Win function
function win() {
  if (matched === 8) {
    timerStop();
    showModal(winModal);
  }
}

// ------------------------------------------------------------------------------------------------------

//  App function
function main() {
  resetEvent();
  deckEvent();
  timerReset();
  loadCards(cardsArr);
  setBoard(cardsArr);
}

// App start
main();
