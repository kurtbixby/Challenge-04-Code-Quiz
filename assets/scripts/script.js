import {allQuestions} from './questions.js';

const CORRECTCLASS = "correct-answer";
const INCORRECTCLASS = "incorrect-answer";
const CHOICEBUTTONCLASS = "choice-button";

const QUIZTIMELENGTH = 20;
const QUIZQUESTIONLENGTH = 10;

const INCORRECTPENALTY = 15;

let highScoreButton = document.querySelector("#highscore-button");
let timerText = document.querySelector("#timer-time");

let startElement = document.querySelector("#start-screen");
let quizContainerElement = document.querySelector("#quiz-container");
let resultsElement = document.querySelector("#results-screen");
let highScorePageElement = document.querySelector("#highscore-screen");

let quizTimer;

let remainingTime = 0;
let score = 0;
let questionIndexIter;

function init() {
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
    remainingTime = QUIZTIMELENGTH;

    // Hide the start screen
    startElement.style.display = "none";

    // Initialize the timer
    updateTimerElement();
    quizTimer = setInterval(tickTimer, 1000);

    // Create/show the first question
    updateQuestion();
}

function decrementTimer(seconds) {
    remainingTime = Math.max(0, remainingTime - 1);
    updateTimerElement();
    if (remainingTime <= 0) {
        clearInterval(quizTimer);
        endQuiz();
    }
    return remainingTime;
}

function tickTimer() {
    decrementTimer(1);
}

function updateTimerElement() {
    timerText.textContent = remainingTime;
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
        decrementTimer(INCORRECTPENALTY);
    }

    updateQuestion();
    quizContainerElement.appendChild
}

function updateQuestion() {
    let nextQuestionIndex = questionIndexIter.next();
    if (nextQuestionIndex.done) {
        // No more questions
        endQuiz();
    }
    let newQuestion = createQuestionElement(allQuestions[nextQuestionIndex]);
    quizContainerElement.appendChild(newQuestion);
}

function endQuiz() {
    // Stop timer
    // Hide/destroy quiz questions
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

init();
