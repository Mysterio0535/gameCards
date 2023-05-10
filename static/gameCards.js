const moves = document.getElementById("movesCount");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let card;
let interval;

let firstCard = false;
let secondCard = false;

// items array
const items = [
  { name: "squirrel", image: "pngwing.com.png" },
  { name: "lion", image: "pngwing.com (2).png" },
  { name: "dog", image: "pngwing.com (1).png" },
  { name: "elephant", image: "pngwing.com (3).png" },
  { name: "zebra", image: "pngwing.com (4).png" },
  { name: "picatchu", image: "pngwing.com (12).png" },
  { name: "unicorn", image: "pngwing.com (6).png" },
  { name: "tRex", image: "pngwing.com (7).png" },
  { name: "stiracozavr", image: "pngwing.com (8).png" },
];

// інтервал
let seconds = 0;
let minutes = 0;

// ходи та перемога
let movesCount = 0,
  winCount = 0;

//таймер
var timeGenerator = () => {
  seconds += 1;
  //хвилини
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes <  10 ? `0${minutes}` : minutes;
  // додаєм видимий час
  timeValue.innerHTML = `<span>Час:</span> ${minutesValue} : ${secondsValue} `;

};

// створюємо рахунок ходів
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Ходи:</span>  ${movesCount}`;
};

// розташовуємо рандомно об'єкти
// створюємо розмір сітки
const generateRandom = (size = 4) => {
  let tempArray = [...items];
  //
  let cardValue = [];
  // розмір
  size = (size * size) / 2;
  // random
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValue.push(tempArray[randomIndex]);
    //після вибору потрібно видаляєм об'єкт з масиву
    tempArray.splice(randomIndex, 1);
  }
  return cardValue;
};

const matrixGenerator = (cardValue, size = 4) => {
  gameContainer.innerHTML = "";
  cardValue = [...cardValue, ...cardValue];
  //перетасовка
  cardValue.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
<div class="card-container" data-card-value="${cardValue[i].name}">
<div class="card-before">?</div>
<div class="card-after">
<img src ="${cardValue[i].image}" class="image"></div>
</div>
`;
  }
  //grid
  gameContainer.style.gridTemplateColumns = `repeat(${size}, 100px)`;

  card = document.querySelectorAll(".card-container");
  card.forEach((card) => {
    card.addEventListener("click", () => {
      //якщо вибрана карта не збігається то карта яка була вибрана до неї ігнорується
      if(this.classList.contains('active'))
      //

      if (!card.classList.contains("matched")) {
        // flip
        card.classList.add("flipped");
        if (!firstCard) {
          secondCard = card;
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          // збільшуємо кількість ходів оскільки гравець вибрав другу карту
          movesCounter();
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            // якщо обидні карти збігаються то додаємо відповідний клас щоб вони ігнорувались надалі
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            // встановлюємо для першої карти фолс так як тепер наступна карта буде першою
            firstCard = false;
            // збільшуємо кількість виграшів оскільки карти були однакові
            winCount += 1;

            if (winCount == Math.floor(cardValue.length / 2)) {
              result.innerHTML = `<h2>Ви виграли!</h2><h4> Ходи : ${movesCount} </h4> `;
              stopGame();
            }
          } else {
            // якщо карти не збігаються перевертаєм їх до звичайного стану
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 1000);
          }
        }
      }
    });
  });
};
// початок гри
// видаляємо початкову кнопку старт і показуємо саму гру
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //починаємо відлік в таймері та ходів
  interval = setInterval(timeGenerator,  1000,);
  moves.innerHTML = `<span>Ходи: </span> ${movesCount}`;

  initializer();
});

// кінець гри
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//
const initializer = () => {
  winCount = 0;
  let cardValue = generateRandom();
  console.log(cardValue);
  matrixGenerator(cardValue);
};
