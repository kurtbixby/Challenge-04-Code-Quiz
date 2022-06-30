import { allQuestions } from "./questions.js";
// Look into using require and a .json file

const CHOICEBUTTONCLASS = "choice-button";

// Number of quiz questions and how many options they have
const QUIZQUESTIONLENGTH = 4;
const QUESTIONSIZE = 4;

// Number of seconds of the quiz and penalty for an incorrect answer
const QUIZTIMELENGTH = 200;
const INCORRECTPENALTY = 15;

// Points for each correct question and seconds remaining on the clock
const QUESTIONVALUE = 100;
const TIMEVALUE = 1;

let quizTimer;
let score;

let questionIndexIter;

let highScoreButton = document.getElementById("highscore-button");
let quizHUD = document.getElementById("quiz-hud");
let timerText = document.getElementById("timer-text");
let scoreText = document.getElementById("score-text");

let activeElement;
let previousElement;

let startScreenEl = document.getElementById("start-screen");

let quizScreenEl = document.getElementById("quiz-screen");
let quizQuestionEl = quizScreenEl.querySelector("#quiz-question");
let questionFooterEl = quizScreenEl.querySelector("#question-footer");

let highScoreScreenEl = document.getElementById("highscore-screen");

let resultsScreenEl = document.getElementById("results-screen");

class Timer {
    constructor(timerLength, timerElement, callback) {
        this.timeRemaining = timerLength;
        this.timerElement = timerElement;
        this.callback = callback;
        this.interval = null;
    }
    
    decrement(seconds) {
        this.timeRemaining = Math.max(0, this.timeRemaining - seconds);
        this.updateTimerElement();

        if (this.timeRemaining == 0) {
            if (this.interval != null) {
                this.stop();
            }
            this.callback();
        }
    }
    
    tick = () => {
        this.decrement(1);
    }

    start() {
        this.updateTimerElement();
        this.interval = setInterval(this.tick, 1000);
    }

    stop() {
        clearInterval(this.interval);
        this.updateTimerElement();
    }

    updateTimerElement() {
        this.timerElement.textContent = this.timeRemaining;
    }
}

function init() {
    // Start Screen Buttons
    let startButton = startScreenEl.querySelector("#start-button");
    startButton.addEventListener("click", startQuiz);

    // Add event listeners to all the quiz buttons
    let questionButtons = quizScreenEl.getElementsByClassName(CHOICEBUTTONCLASS);
    for(var i = 0; i < questionButtons.length; i++) {
        questionButtons[i].addEventListener("click", submitQuestion);
    }

    // High Score Screen Buttons
    highScoreButton.addEventListener("click", showHighScores);
    let backButton = highScoreScreenEl.querySelector("#go-back");
    backButton.addEventListener("click", goBack);
    let clearButton = highScoreScreenEl.querySelector("#clear-scores");
    clearButton.addEventListener("click", clearScores);

    let saveScoreButton = resultsScreenEl.querySelector("button");
    saveScoreButton.addEventListener("click", saveScore);

    score = 0;
    activeElement = startScreenEl;
}

// Returns an iterator of numbers between [0, possibleChoices) of length max(chosen, possibleChoices)
// Chosen is the number of elements to pick, possibleChoices is the total number of elements to pick from
function chooseQuestionIndices(chosen, possibleChoices) {
    let numToPick = Math.max(chosen, possibleChoices);
    let indices = [];

    let indexSet = new Set();
    while (indexSet.size < chosen) {
        let newIndex = Math.floor(Math.random() * possibleChoices);
        indexSet.add(newIndex);
    }

    return indexSet.values();
}

function startQuiz() {

    // Setup quiz question indices and remaining time
    questionIndexIter = chooseQuestionIndices(QUIZQUESTIONLENGTH, allQuestions.length);

    // Initialize the timer
    quizTimer = new Timer(QUIZTIMELENGTH, timerText, endQuiz);

    // Initialize the score
    showHUD();

    // Fill first question
    updateQuestion(quizQuestionEl);

    showQuiz();
    // Start timer at the very end to be more generous
    quizTimer.start();

}

function updateQuestion(skeleton) {
    let nextQuestionIndex = questionIndexIter.next();
    if (nextQuestionIndex.done) {
        // No more questions
        quizTimer.stop();
        endQuiz();
    } else {
        fillQuestionSkeleton(skeleton, allQuestions[nextQuestionIndex.value]);
    }
}

function submitQuestion(event) {
    let button = event.currentTarget;

    if (!button.matches("." + CHOICEBUTTONCLASS)) {
        return;
    }
    event.stopPropagation();

    // Determine correctness
    let correct = button.dataset.correct;

    // Update score
    // Update timer
    if (correct) {
        score += QUESTIONVALUE;
        updateScoreElement();
    } else {
        quizTimer.decrement(INCORRECTPENALTY);
    }
    
    updateQuestion(quizQuestionEl);

    // Display correct/incorrect
    let footerString = "";
    if (correct) {
        footerString = "Correct!";
    } else {
        footerString = "Incorrect!";
    }
    
    // Add timer to remove this
    questionFooterEl.querySelector("p").textContent = footerString;
    questionFooterEl.style.display = "block";

}

function endQuiz() {
    // Score the remaining time
    score = TIMEVALUE * quizTimer.timeRemaining;
    
    showResultsScreen();
}

function updateScoreElement() {

}

/* 
Creates the following HTML skeleton to fill with data
<div class="quiz-question">
    <h1></h1>
    <button class="choice-button">A: <span></span></button>
    <button class="choice-button">B: <span></span></button>
    <button class="choice-button">C: <span></span></button>
    <button class="choice-button">D: <span></span></button>
</div>
*/
// function createQuestionSkeletonElement() {
//     let questionElement = document.createElement("div");
//     questionElement.classList.add("quiz-question");

//     let header = document.createElement("h1");
//     questionElement.appendChild(header);

//     for (var i = 0; i < QUESTIONSIZE; i++) {
//         let choiceButton = document.createElement("button");
//         choiceButton.classList.add(CHOICEBUTTONCLASS);

//         let buttonName = "";
//         switch (i) {
//             case 0:
//                 buttonName = "A: ";
//                 break;
//             case 1:
//                 buttonName = "B: ";
//                 break;
//             case 2:
//                 buttonName = "C: ";
//                 break;
//             case 3:
//                 buttonName = "D: ";
//                 break;
//         }
//         choiceButton.innerText = buttonName;
//         let buttonSpan = document.createElement("span");
//         choiceButton.appendChild(buttonSpan);
//         choiceButton.addEventListener("click", submitQuestion);

//         questionElement.appendChild(choiceButton);
//     }

//     return questionElement;
// }

function fillQuestionSkeleton(skeleton, question) {
    let header = skeleton.querySelector("h1");
    header.textContent = question.prompt;
    
    if (question.code) {
        let snippet = document.createElement("pre");
        snippet.innerHTML = question.code;

        let header = skeleton.querySelector("h1");
        header.insertAdjacentElement("afterend", snippet);
    } else {
        let snippet = skeleton.querySelector("pre");
        if (snippet) {
            snippet.remove();
        }
    }

    let buttons = skeleton.querySelectorAll("button");

    for (let i = 0; i < QUESTIONSIZE; i++) {
        let button = buttons[i];
        let choice = question.choices[i];

        if (choice === question.answer) {
            button.dataset.correct = true;
        } else {
            button.dataset.correct = "";
        }
        button.querySelector("span").innerText = choice;
    }
}

function saveScore(event) {
    event.preventDefault();

    let initialsField = resultsScreenEl.querySelector("input");
    let initials = initialsField.value;
    let retrievedScore = 0;

    console.debug("saving score: " + retrievedScore);
    initialsField.value = "";
    endResults();
}

function clearScores() {

}

function endResults() {
    activeElement.style.display = "none";
    activeElement = startScreenEl;
    showHighScores();
}

function showHUD() {
    quizHUD.style.display = "block";
}

// State machine transition functions
function showQuiz() {
    transitionScreen(quizScreenEl);
}

function showHighScores() {
    transitionScreen(highScoreScreenEl);
}

function showResultsScreen() {
    transitionScreen(resultsScreenEl);
}

function showStartScreen() {
    transitionScreen(startScreenEl);
}

function transitionScreen(dst) {
    activeElement.style.display = "none";
    previousElement = activeElement;
    activeElement = dst;
    activeElement.style.display = "block";
}

function goBack() {
    activeElement.style.display = "none";
    let temp = activeElement;
    activeElement = previousElement;
    previousElement = temp;
    activeElement.style.display = "block";
}

init();

let debugSection = document.querySelector("#debug-buttons");
let resultsButton = debugSection.querySelector("#show-results-screen");

resultsButton.addEventListener("click", showResultsScreen);

let timerTester = document.querySelector("#timer-test");
// console.debug(timerTester);
timerTester.addEventListener("click", testTimer);

function someFunctionality() {
    console.debug("Some Functionality");
}

function testTimer() {
    console.debug("testTimer");
    let timerTextElement = document.querySelector("#timer-time");
    let thisTimer = new Timer(5, timerTextElement, someFunctionality);
    thisTimer.start();
}

let questionGenerateTester = document.querySelector("#question-generate-test")
questionGenerateTester.addEventListener("click", testQuestionGeneration);

function testQuestionGeneration() {
    console.debug("Testing Question Generation");
    let indices = chooseQuestionIndices(10, allQuestions.length);
    
    let result = indices.next();
    while (!result.done) {
        console.debug("Index: " + result.value);
        let question = allQuestions[result.value];
        console.debug("Question");
        console.debug(question);

        let createdElement = createQuestionElement(question);

        quizContainerElement.appendChild(createdElement);

        result = indices.next();
    }
}
