/*----- constants -----*/
const STARTING_TIME = 30;
const BOMB_DELAY = 750;

/*----- app's state (variables) -----*/
var remainingTime;
var gameOver;
var wiresCut;
var wiresToCut;
var timer;
var bombDelay;

/*----- cached element references -----*/ 
var body;
var wireBox;
var wires;
var clockText;
var resetBtn;

/*----- event listeners -----*/
function cutWire(evt) {
  // function for when a user clicks a wire to cut it
  if(!wiresCut[evt.target.id] && !gameOver) {
    //apply cut wire image
    evt.target.src = "./img/cut-" + evt.target.id + "-wire.png";
    //set state of wire to cut
    wiresCut[evt.target.id] = true;
    //was this a correct wire?
    var wireIndex = wiresToCut.indexOf(evt.target.id);
    if(wireIndex > -1) {
      //this was a good wire
      console.log(event.target.id + " was correct!");
      wiresToCut.splice(wireIndex, 1);
      if(checkForWin()) {
        endGame(true);
      }
    } else {
      //that was a bad wire
      console.log(evt.target.id + " WAS A BAD WIRE. EXPLODING IN 750ms");
      bombDelay = setTimeout(function() {
        endGame(false);
      }, BOMB_DELAY);
    }
  }
}

function resetGame() {
  // Reinitialize variables
  gameOver = false;

  // Set the wires <img> src back to the uncut pictures
  for(let i = 0; i < wires.length; i++) {
    wires[i].src = "./img/uncut-" + wires[i].id + "-wire.png";
  }
  // Display the SimCity bg
  body.classList.remove("exploded");
  body.classList.add("unexploded");

  // Put the clock text back to red
  clockText.classList.add("red");
  clockText.classList.remove("green");

  clearTimeout(bombDelay);
  clearInterval(timer);

  // Initialize game vars and start game
  initializeGame();
}

function updateClock() {
  remainingTime--;
  if(remainingTime <= 0) {
    endGame(false);
  }
  clockText.textContent = "0:00:" + remainingTime;
}

/*----- functions -----*/
/**
 * Initialize variables
 * Show uncut wires
 * Reset the timer - move into reset
 */
function initializeGame() {
  wiresToCut = [];
  wiresCut = {
    blue: false,
    green: false,
    red: false,
    white: false,
    yellow: false
  };

  remainingTime = STARTING_TIME;
  // bombDelay = BOMB_DELAY;

  // Randomly assign wires to cut
  for (let wire in wiresCut) {
    var rand = Math.random();
    if(rand > 0.5) wiresToCut.push(wire);
  }
  console.log(wiresToCut);
  //Start the game!
  timer = setInterval(updateClock, 1000);
}

function checkForWin() {
  return wiresToCut.length ? false : true;
}

function endGame(win) {
  // win: stop timer
  // win: stop the interval 
  clearTimeout(bombDelay);
  clearInterval(timer);
  gameOver = true;
  
  // win: turn the timer green
  // win: play win audio
  if(win) {
    console.log("Hooray Patrick! We saved the city!");
    clockText.classList.add("green");
    clockText.classList.remove("red");

  }
  // lose: play lose audio
  // lose: change background to exploded
  else {
    console.log("Barnacles!");
    body.classList.add("exploded");
    body.classList.remove("unexploded");
  }
}

/**
 * On DOM load, set all element references and register event listeners
 */
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded");
  body = document.body;
  
  wires = document.getElementById("wirebox").children;
  wireBox = document.getElementById("wirebox");
  clockText = document.querySelector("p");
  resetBtn = document.querySelector("button");

  wireBox.addEventListener("click", cutWire);
  resetBtn.addEventListener("click", resetGame);
  initializeGame();
});

