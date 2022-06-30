import { allQuestions } from "./questions.js";

const CHOICEBUTTONCLASS = "choice-button";
const SCOREBOARDELCLASS = "scoreboard-entry";
const INITIALSCLASS = "scoreboard-initials";
const SCORECLASS = "scoreboard-score";

// Number of quiz questions and how many options they have
const QUIZQUESTIONLENGTH = 50;
const QUESTIONSIZE = 4;

// Number of seconds of the quiz and penalty for an incorrect answer
const QUIZTIMELENGTH = 1200;
const INCORRECTPENALTY = 15;
const FOOTERTIME = 60000;

// Points for each correct question and seconds remaining on the clock
const QUESTIONVALUE = 100;
const TIMEVALUE = 1;

const SCORESKEY = "scores";

let highScores = [];

let questionsCorrect;
let finalScore;
let quizTimer;
let footerTimeout;

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
let scoreboardEl = highScoreScreenEl.querySelector("#scoreboard");

let resultsScreenEl = document.getElementById("results-screen");
let questionScoreEl = resultsScreenEl.querySelector("#questions-score");
let timerScoreEl = resultsScreenEl.querySelector("#timer-score");
let totalScoreEl = resultsScreenEl.querySelector("#total-score");

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

    // Init Data
    loadScores();

    // Init Start Screen
    // Start Screen Buttons
    let startButton = startScreenEl.querySelector("#start-button");
    startButton.addEventListener("click", startQuiz);

    // Init Quiz Screen
    // Add event listeners to all the quiz buttons
    let questionButtons = quizScreenEl.getElementsByClassName(CHOICEBUTTONCLASS);
    for(var i = 0; i < questionButtons.length; i++) {
        questionButtons[i].addEventListener("click", submitQuestion);
    }

    // Init High Score Screen
    // High Score Screen Buttons
    highScoreButton.addEventListener("click", showHighScores);
    let backButton = highScoreScreenEl.querySelector("#go-back");
    backButton.addEventListener("click", goBack);
    let clearButton = highScoreScreenEl.querySelector("#clear-scores");
    clearButton.addEventListener("click", clearScores);
    populateLeaderBoard();

    // Init Results Screen
    let initialsField = resultsScreenEl.querySelector("input")
    initialsField.value = "";
    let saveScoreButton = resultsScreenEl.querySelector("button");
    saveScoreButton.addEventListener("click", saveScore);

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
    questionsCorrect = 0;
    updateScoreElement();

    showHUD();

    // Fill first question
    nextQuestion(quizQuestionEl);

    showQuiz();
    // Start timer at the very end to be more generous
    quizTimer.start();

}

function nextQuestion(skeleton) {
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
        questionsCorrect++;
        updateScoreElement();
    } else {
        quizTimer.decrement(INCORRECTPENALTY);
    }
    
    nextQuestion(quizQuestionEl);

    // Display correct/incorrect
    let footerString = "";
    if (correct) {
        footerString = "Correct!";
    } else {
        footerString = "Incorrect!";
    }
    
    clearTimeout(footerTimeout);
    // Add timer to remove this
    questionFooterEl.querySelector("p").textContent = footerString;
    questionFooterEl.style.display = "flex";
    footerTimeout = setTimeout(() => {
        questionFooterEl.style.display = "none";
    }, FOOTERTIME);
}

function endQuiz() {
    // Score the remaining time
    finalScore = calculateScore();
    updateScoreElement();

    hideHUD();
    
    // Populate Results Score Card
    populateScoreCard();

    showResultsScreen();
}

function calculateScore() {
    let questionSubscore = questionsCorrect * QUESTIONVALUE;
    let timerSubscore = quizTimer.timeRemaining * TIMEVALUE;
    return questionSubscore + timerSubscore;
}

function updateScoreElement() {
    scoreText.textContent = questionsCorrect;
}

function fillQuestionSkeleton(skeleton, question) {
    let header = skeleton.querySelector("h1");
    header.textContent = question.prompt;
    
    if (question.code) {
        let snippet = skeleton.querySelector("pre");
        if (snippet === null) {
            snippet = document.createElement("pre");
        }
        snippet.innerText = question.code;

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

function populateLeaderBoard() {
    scoreboardEl.innerHTML = "";
    highScores.forEach(score => {
        let scoreElement = createLeaderboardElement(score);
        scoreboardEl.appendChild(scoreElement);
    });
}

function createLeaderboardElement(scoreEntry) {
    let scoreElement = document.createElement("div");
    scoreElement.classList.add(SCOREBOARDELCLASS);

    let initials = document.createElement("p");
    initials.classList.add(INITIALSCLASS);
    initials.textContent = scoreEntry.initials;

    let score = document.createElement("p");
    score.classList.add(SCORECLASS);
    score.textContent = scoreEntry.score;

    scoreElement.appendChild(initials);
    scoreElement.appendChild(score);

    return scoreElement;
}

function populateScoreCard() {
    let questionSubscore = questionsCorrect * QUESTIONVALUE;
    let timerSubscore = quizTimer.timeRemaining * TIMEVALUE;
    let totalScore = questionSubscore + timerSubscore;

    let questionScoreText = `${questionsCorrect} correct questions X ${QUESTIONVALUE} points = ${questionSubscore}`;
    questionScoreEl.textContent = questionScoreText;
    
    let timerScoreText = `${quizTimer.timeRemaining} seconds remaining X ${TIMEVALUE} points = ${timerSubscore}`;
    timerScoreEl.textContent = timerScoreText;
    
    let totalScoreText = `Your final score is ${totalScore}`;
    totalScoreEl.textContent = totalScoreText;
}

function saveScore(event) {
    event.preventDefault();

    let initialsField = resultsScreenEl.querySelector("input");

    let scoreEntry = {initials: initialsField.value, score: finalScore};

    addScore(scoreEntry);
    writeScores(highScores);
    populateLeaderBoard();

    initialsField.value = "";
    finalScore = 0;
    updateScoreElement();

    endResults();
}

function addScore(scoreEntry) {
    console.debug(highScores);
    if (highScores.length < 1) {
        highScores.push(scoreEntry);
    }
    else {
        var inserted = false;
        for (var i = 0; i < highScores.length; i++) {
            if (scoreEntry.score > highScores[i].score) {
                highScores.splice(i, 0, scoreEntry);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            highScores.push(scoreEntry);
        }
    }
    
    highScores = highScores.slice(0, 10);
}

function clearScores() {
    highScores = [];
    writeScores(highScores);
    populateLeaderBoard();
}

function loadScores() {
    let retrievedScores = localStorage.getItem(SCORESKEY);
    console.debug("retrievedScores: " + retrievedScores);
    if (retrievedScores === null) {
        writeScores([]);
    } else {
        try {
            highScores = JSON.parse(retrievedScores);
        } catch (error) {
            console.error("Bad stored JSON. Resetting high scores.");
            clearScores();
        }
    }
    console.debug(highScores);
}

function writeScores(scores) {
    localStorage.setItem(SCORESKEY, JSON.stringify(scores));
}

function endResults() {
    activeElement.style.display = "none";
    activeElement = startScreenEl;
    showHighScores();
}

function showHUD() {
    quizHUD.style.display = "flex";
}

function hideHUD() {
    quizHUD.style.display = "none";
}

// State machine/screen transition functions
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

// Hide current screen, show dst screen
function transitionScreen(dst) {
    if (activeElement === dst) {
        return;
    }

    activeElement.style.display = "none";
    previousElement = activeElement;
    activeElement = dst;
    activeElement.style.display = "flex";
}

// Go to the previous screen
// Undo of transitionScreen
function goBack() {
    activeElement.style.display = "none";
    let temp = activeElement;
    activeElement = previousElement;
    previousElement = temp;
    activeElement.style.display = "flex";
}

init();

let debugSection = document.querySelector("#debug-section");

let timerTester = document.querySelector("#timer-test");
timerTester.addEventListener("click", testTimer);

let questionGenerateTester = document.querySelector("#question-generate-test")
questionGenerateTester.addEventListener("click", testQuestionGeneration);

let scoresButton = debugSection.querySelector("#fill-scores");
scoresButton.addEventListener("click", fillScores);

let resultsButton = debugSection.querySelector("#show-results-screen");
resultsButton.addEventListener("click", showResultsScreen);

let quizButton = debugSection.querySelector("#show-quiz");
quizButton.addEventListener("click", jumpToQuiz);

function fillScores() {
    let dummyScores = [
        { initials: "QWE", score: 752 },
        { initials: "QWE", score: 742 },
        { initials: "QWE", score: 740 },
        { initials: "QWE", score: 738 },
        { initials: "QWE", score: 553 },
        { initials: "QWE", score: 542 },
        { initials: "QWE", score: 521 },
        { initials: "QWE", score: 342 },
        { initials: "QWE", score: 121 },
        { initials: "QWE", score: 12 },
    ];

    highScores = dummyScores;
    populateLeaderBoard();
}

function someFunctionality() {
    console.debug("Some Functionality");
}

function testTimer() {
    console.debug("testTimer");
    let timerTextElement = document.querySelector("#timer-time");
    let thisTimer = new Timer(5, timerTextElement, someFunctionality);
    thisTimer.start();
}

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

function jumpToQuiz() {
    fillQuestionSkeleton(quizQuestionEl, allQuestions[6]);
    showHUD();
    showQuiz();
}
