import { allQuestions } from "./questions.js";
// Look into using require and a .json file

const CHOICEBUTTONCLASS = "choice-button";

const QUIZTIMELENGTH = 20;
const QUIZQUESTIONLENGTH = 10;
const QUESTIONSIZE = 4;

const INCORRECTPENALTY = 15;

let highScoreButton = document.querySelector("#highscore-button");
let timerText = document.querySelector("#timer-time");

let startScreenElement = document.querySelector("#start-screen");
let quizContainerElement = document.querySelector("#quiz-container");
let resultsElement = document.querySelector("#results-screen");
let highScorePageElement = document.querySelector("#highscore-screen");

let quizTimer;

let score = 0;
let questionIndexIter;

let questionSkeleton;

class Timer {
    constructor(timerLength, timerElement, callback) {
        this.timeRemaining = timerLength;
        this.timerElement = timerElement;
        this.callback = callback;
        this.interval = null;
    }
    
    decrement(seconds) {
        this.timeRemaining = Math.max(0, this.timeRemaining - 1);
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

    // Hide the start screen
    startScreenElement.style.display = "hidden";

    // Initialize the timer
    quizTimer = new Timer(QUIZTIMELENGTH, timerText, endQuiz);

    // Initialize the score


    document.querySelectorAll(".hud-element").forEach(element => element.style.display = "block");

    // Create/show the first question
    questionSkeleton = createQuestionSkeletonElement();
    updateQuestion(questionSkeleton);

    quizContainerElement.appendChild(questionSkeleton);

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
    console.debug("Submit Question");
    console.debug(button);

    if (!button.matches("." + CHOICEBUTTONCLASS)) {
        console.debug("Doesn't match Class");
        return;
    }
    event.stopPropagation();

    console.debug("Matches Class");
    // Determine correctness
    let correct = button.dataset.correct;

    // Update score
    // Update timer
    if (correct) {
        score++;
        updateScoreElement();
    } else {
        quizTimer.decrement(INCORRECTPENALTY);
    }
    
    updateQuestion(questionSkeleton);

    // Append correct/incorrect element
    quizContainerElement.appendChild();
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
function createQuestionSkeletonElement() {
    let questionElement = document.createElement("div");
    questionElement.classList.add("quiz-question");

    let header = document.createElement("h1");
    questionElement.appendChild(header);

    for (var i = 0; i < QUESTIONSIZE; i++) {
        let choiceButton = document.createElement("button");
        choiceButton.classList.add(CHOICEBUTTONCLASS);

        let buttonName = "";
        switch (i) {
            case 0:
                buttonName = "A: ";
                break;
            case 1:
                buttonName = "B: ";
                break;
            case 2:
                buttonName = "C: ";
                break;
            case 3:
                buttonName = "D: ";
                break;
        }
        choiceButton.innerText = buttonName;
        let buttonSpan = document.createElement("span");
        choiceButton.appendChild(buttonSpan);
        choiceButton.addEventListener("click", submitQuestion);

        questionElement.appendChild(choiceButton);
    }

    return questionElement;
}

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

    console.debug("Filled question");
    console.debug(skeleton);
}

let startButton = document.querySelector("#start-button");
startButton.addEventListener("click", startQuiz);

// init();
// let startButton = startScreenElement.querySelector("button");
// startButton.addEventListener("click", startQuiz);

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
