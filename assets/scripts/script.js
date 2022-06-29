import { allQuestions } from "./questions.js";

const CORRECTCLASS = "correct-answer";
const INCORRECTCLASS = "incorrect-answer";
const CHOICEBUTTONCLASS = "choice-button";

const QUIZTIMELENGTH = 20;
const QUIZQUESTIONLENGTH = 10;

const INCORRECTPENALTY = 15;

let highScoreButton = document.querySelector("#highscore-button");
let timerText = document.querySelector("#timer-time");

let startScreenElement = document.querySelector("#start-screen");
let quizContainerElement = document.querySelector("#quiz-container");
let resultsElement = document.querySelector("#results-screen");
let highScorePageElement = document.querySelector("#highscore-screen");

let quizTimer;

let remainingTime = 0;
let score = 0;
let questionIndexIter;

function init() {
}

// function createTimer() {
//     let newTimer = {
//         timeRemaining: QUIZTIMELENGTH,
//         timerElement: document.querySelector("#timer-time"),
//         tick: function() {
//             this.decrementTimer(1);
//         },
//         decrement: function(seconds) {
//             this.timeRemaining = Math.max(0, this.timeRemaining - 1);
//         },
//         start: function() {
//             this.interval = setInterval(this.tick, 1000);
//         }
//     }

//     return newTimer;
// }

class Timer {
    constructor(timerLength, timerElement, callback) {
        this.timeRemaining = timerLength;
        this.timerElement = timerElement;
        this.callback = callback;
        this.interval = null;
    }
    
    decrement(seconds) {
        this.timeRemaining = Math.max(0, this.timeRemaining - 1);
        if (this.timeRemaining == 0) {
            if (this.interval != null) {
                this.stop();
            }
            this.callback();
        }
    }
    
    tick = () => {
        console.debug(this);
        this.decrement(1);
        this.updateTimerElement();
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

    // indexSet.forEach(element => indices.push(element));

    // return indices;
}

function startQuiz() {

    // Setup quiz question indices and remaining time
    questionIndexIter = chooseQuestionIndices(QUIZQUESTIONLENGTH, allQuestions.length);

    // Hide the start screen
    startScreenElement.style.display = "none";

    // Initialize the timer
    quizTimer = new Timer(QUIZTIMELENGTH, timerText, endQuiz);

    // Create/show the first question
    updateQuestion();

    // Start timer at the very end to be more generous
    quizTimer.start();
}

function submitQuestion(event) {
    // Determine correctness
    let correct = event.target.matches("." + CORRECTCLASS);

    // Update score
    // Update timer
    if (correct) {
        score++;
        updateScoreElement();
    } else {
        quizTimer.decrement(INCORRECTPENALTY);
    }

    updateQuestion();

    // Append correct/incorrect element
    quizContainerElement.appendChild();
}

function updateQuestion() {
    let nextQuestionIndex = questionIndexIter.next();
    if (nextQuestionIndex.done) {
        // No more questions
        quizTimer.stop();
        endQuiz();
    }
    let newQuestion = createQuestionElement(allQuestions[nextQuestionIndex]);
    quizContainerElement.appendChild(newQuestion);
}

function endQuiz() {
    // Hide/destroy quiz questions
    quizContainerElement.style.display = "none";
    // Destroy quiz element
    quizContainerElement.innerHTML = "";

    // Create/show results screen
}

function updateScoreElement() {

}

function goToHighScores() {

}

function createQuestionElement(question) {
    let questionElement = document.createElement("div");
    question.classList.add("quiz-question");

    let header = document.createElement("h1");
    header.textContent = question.prompt;
    question.appendChild(header);

    if (question.code) {
        let code = document.createElement("pre");
        code.innerHTML = question.code;
        question.appendChild(code);
    }

    for (var i = 0; i < question.choices.length; i++) {
        let choiceButton = document.createElement("button");
        choiceButton.classList.add(CHOICEBUTTONCLASS);

        let choiceText = question.choices[i];
        if (choiceText === question.answer) {
            choiceButton.classList.add(CORRECTCLASS);
        } else {
            choiceButton.classList.add(INCORRECTCLASS);
        }
        switch (i) {
            case 0:
                choiceText = "A: " + choiceText;
                break;
            case 1:
                choiceText = "B: " + choiceText;
                break;
            case 2:
                choiceText = "C: " + choiceText;
                break;
            case 3:
                choiceText = "D: " + choiceText;
                break;
        }
        choiceButton.innerText = choiceText;
        question.appendChild(choiceButton);
    }

    return questionElement;
}

// init();
// let startButton = startScreenElement.querySelector("button");
// startButton.addEventListener("click", startQuiz);

let timerTester = document.querySelector("#timer-test");
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
