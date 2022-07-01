import { allQuestions } from "./questions.js";

// Classes used when creating and selecting elements
const CHOICEBUTTONCLASS = "choice-button";
const PRECLASS = "floating-card"
const SCOREBOARDELCLASS = "scoreboard-entry";
const INITIALSCLASS = "scoreboard-initials";
const SCORECLASS = "scoreboard-score";

// Number of quiz questions
const QUIZQUESTIONLENGTH = 20;
// Number of choices each question has
const QUESTIONSIZE = 4;

// Number of seconds of the quiz and penalty for an incorrect answer
const QUIZTIMELENGTH = 200;
// Seconds penalty for each incorrect answer
const INCORRECTPENALTY = 15;
// Time the correct/incorrect footer stays on screen
const FOOTERTIME = 2000;

// Point value of each correct question 
const QUESTIONVALUE = 100;
// Point value of each second remaining on the clock
const TIMEVALUE = 1;
// Size of the leaderboard
const LEADERBOARDSIZE = 10;
// Local storage key to store the scores
const SCORESKEY = "scores";

// Forward declaration of the object the stores and manages the leaderboard and high scores
let leaderBoard;

// Forward declaration of the object that manages the timer and timer element
let quizTimer;

// Forward declarations of variables
let questionsCorrect;
let finalScore;
let footerTimeout;

let questionIndexIter;

// Elements in the bar at the top of the screen
let highScoreButton = document.getElementById("highscore-button");
let quizHUD = document.getElementById("quiz-hud");
let timerText = document.getElementById("timer-text");
let scoreText = document.getElementById("score-text");

// Screen elements for use in navigation and querying sub elements
// Start screen elements
let startScreenEl = document.getElementById("start-screen");
// Quiz screen elements
let quizScreenEl = document.getElementById("quiz-screen");
let quizQuestionEl = quizScreenEl.querySelector("#quiz-question");
let questionFooterEl = quizScreenEl.querySelector("#question-footer");
// High score screen elements
let highScoreScreenEl = document.getElementById("highscore-screen");
let scoreboardEl = highScoreScreenEl.querySelector(".scores-holder");
// Results screen elements
let resultsScreenEl = document.getElementById("results-screen");
let questionScoreEl = resultsScreenEl.querySelector("#questions-score");
let timerScoreEl = resultsScreenEl.querySelector("#timer-score");
let totalScoreEl = resultsScreenEl.querySelector("#total-score");

// Current and previous screen elements to track navigation
let activeElement;
let previousElement;

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

class LeaderBoard {
    constructor(leaderBoardElement, maxSize) {
        this.scores = [];
        this.leaderBoardElement = leaderBoardElement
        this.maxSize = maxSize;
    }

    init() {
        this.loadScores();
        this.updateLeaderBoardElement();
    }

    addScore(scoreEntry) {
        if (this.scores.length < 1) {
            this.scores.push(scoreEntry);
        }
        else {
            var inserted = false;
            for (var i = 0; i < this.scores.length; i++) {
                if (scoreEntry.score > this.scores[i].score) {
                    this.scores.splice(i, 0, scoreEntry);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                this.scores.push(scoreEntry);
            }
        }
        
        this.scores = this.scores.slice(0, this.maxSize);
        this.writeScores();
        this.updateLeaderBoardElement();
    }

    clearScores() {
        this.scores = [];
        this.writeScores();
        this.updateLeaderBoardElement();
    }

    loadScores() {
        let retrievedScores = localStorage.getItem(SCORESKEY);
        if (retrievedScores === null) {
            this.writeScores([]);
        } else {
            try {
                this.scores = JSON.parse(retrievedScores);
            } catch (error) {
                console.error("Bad stored JSON. Resetting high scores.");
                this.clearScores();
            }
        }
    }

    writeScores() {
        localStorage.setItem(SCORESKEY, JSON.stringify(this.scores));
    }

    updateLeaderBoardElement() {
        this.leaderBoardElement.innerHTML = "";
        this.scores.forEach(score => {
            let scoreElement = this.createScoreElement(score);
            this.leaderBoardElement.appendChild(scoreElement);
        });
    }
    
    createScoreElement(scoreEntry) {
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
}

function init() {

    // Init Start Screen
    // Start Screen Buttons
    let startButton = startScreenEl.querySelector("#start-button");
    startButton.addEventListener("click", startQuizHandler);

    // Init Quiz Screen
    // Add event listeners to all the quiz buttons
    let questionButtons = quizScreenEl.getElementsByClassName(CHOICEBUTTONCLASS);
    for(var i = 0; i < questionButtons.length; i++) {
        questionButtons[i].addEventListener("click", submitQuestionHandler);
    }

    // Init High Score Screen
    // High Score Screen Buttons
    leaderBoard = new LeaderBoard(scoreboardEl, LEADERBOARDSIZE);
    leaderBoard.init();

    highScoreButton.addEventListener("click", showHighScoresHandler);
    let backButton = highScoreScreenEl.querySelector("#go-back");
    backButton.addEventListener("click", goBackHandler);
    let clearButton = highScoreScreenEl.querySelector("#clear-scores");
    clearButton.addEventListener("click", clearScoresHandler);


    // Init Results Screen
    let initialsField = resultsScreenEl.querySelector("input")
    initialsField.value = "";
    let saveScoreButton = resultsScreenEl.querySelector("button");
    saveScoreButton.addEventListener("click", saveScoreHandler);

    // Set the active element to the default
    activeElement = startScreenEl;
}

/* 
 * 
 * 
 *  Section of functions that drive the quiz  
 * 
 *
 */
// Starts the quiz
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

// Returns an iterator of numbers between [0, possibleChoices) of length min(chosen, possibleChoices)
// Chosen is the number of elements to pick, possibleChoices is the total number of elements to pick from
function chooseQuestionIndices(chosen, possibleChoices) {
    let numToPick = Math.min(chosen, possibleChoices);

    let indexSet = new Set();
    while (indexSet.size < numToPick) {
        let newIndex = Math.floor(Math.random() * possibleChoices);
        indexSet.add(newIndex);
    }

    return indexSet.values();
}

// Handles progressing to the next question in the quiz
// Checks if there are more elements
// Fills the empty element with the next question
function nextQuestion(emptyQuestionElement) {
    let nextQuestionIndex = questionIndexIter.next();
    if (nextQuestionIndex.done) {
        // No more questions
        quizTimer.stop();
        endQuiz();
    } else {
        fillQuestionElement(emptyQuestionElement, allQuestions[nextQuestionIndex.value]);
    }
}

// Fills an empty question element with the contents of a question object
function fillQuestionElement(element, question) {
    let header = element.querySelector("h1");
    header.textContent = question.prompt;
    
    if (question.code) {
        let snippet = element.querySelector("pre");
        if (snippet === null) {
            snippet = document.createElement("pre");
            snippet.classList.add(PRECLASS);
        }
        snippet.innerText = question.code;

        let header = element.querySelector("h1");
        header.insertAdjacentElement("afterend", snippet);
    } else {
        let snippet = element.querySelector("pre");
        if (snippet) {
            snippet.remove();
        }
    }

    let buttons = element.querySelectorAll("button");

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
    
    // Add timer to remove this
    clearTimeout(footerTimeout);
    questionFooterEl.querySelector("p").textContent = footerString;
    questionFooterEl.style.display = "flex";
    footerTimeout = setTimeout(() => {
        questionFooterEl.style.display = "none";
    }, FOOTERTIME);
}

function endQuiz() {
    // Score the remaining time
    finalScore = calculateScore(questionsCorrect, quizTimer.timeRemaining);

    hideHUD();
    
    // Populate Results Score Card
    populateScoreCard();

    showResultsScreen();
}

// Calculates the final score from a number of correct questions and seconds remaining on the clock
// Returns a score number
function calculateScore(numCorrect, timeRemaining) {
    let questionSubscore = numCorrect * QUESTIONVALUE;
    let timerSubscore = timeRemaining * TIMEVALUE;
    return questionSubscore + timerSubscore;
}

// Updates the value of the score element in the HUD with the number of correct questions
function updateScoreElement() {
    scoreText.textContent = questionsCorrect;
}

// Function to populate the results screen scorecard
function populateScoreCard() {
    let questionSubscore = questionsCorrect * QUESTIONVALUE;
    let timerSubscore = quizTimer.timeRemaining * TIMEVALUE;
    let totalScore = questionSubscore + timerSubscore;

    let questionScoreHtml = `<span>${questionsCorrect}</span> CORRECT QUESTIONS X <span>${QUESTIONVALUE}</span> POINTS = <span>${questionSubscore}</span>`;
    questionScoreEl.innerHTML = questionScoreHtml;
    
    let timerScoreHtml = `<span>${quizTimer.timeRemaining}</span> SECONDS REMAINING X <span>${TIMEVALUE}</span> POINTS = <span>${timerSubscore}</span>`;
    timerScoreEl.innerHTML = timerScoreHtml;
    
    let totalScoreHtml = `YOUR FINAL SCORE IS <span>${totalScore}</span>`;
    totalScoreEl.innerHTML = totalScoreHtml;
}

/*
 *  Functions to handle and marshal button clicks
 */
function startQuizHandler(event) {
    startQuiz(event);
}

function submitQuestionHandler(event) {
    submitQuestion(event);
}

function showHighScoresHandler(event) {
    showHighScores(event);
}

function goBackHandler(event) {
    goBack(event);
}

function saveScoreHandler(event) {
    event.preventDefault();

    let initialsField = resultsScreenEl.querySelector("input");
    let initials = initialsField.value;

    if (initials.length < 1) {
        initials = "---";
    } else {
        while (initials.length < 3) {
            initials = initials.padEnd(3, " ");
        }
    }
    let scoreEntry = {initials: initials, score: finalScore};

    leaderBoard.addScore(scoreEntry);

    initialsField.value = "";
    finalScore = 0;

    endResults();
}

function clearScoresHandler(event) {
    leaderBoard.clearScores();
}

/*  
 * 
 * 
 *  Section of functions that handle moving between screens 
 * 
 *
 */
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