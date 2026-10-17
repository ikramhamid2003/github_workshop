// Core quiz logic.
// This file has NO browser (DOM) code so it can be tested with Node.js.

const QUESTION_TIME_SECONDS = 15;

/**
 * Creates a fresh quiz state for the supplied questions.
 */
function createQuiz(questions) {
  return {
    questions: [...questions],
    current: 0,
    score: 0,
    answered: false,
    timeLeft: QUESTION_TIME_SECONDS,
  };
}

/**
 * Returns a new array with the items in random order.
 * The original array is not changed.
 */
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns true when the selected option is the correct one.
 */
function isCorrect(question, selectedIndex) {
  return question.answer === selectedIndex;
}

/**
 * Records an answer without changing the supplied state.
 */
function answerQuestion(state, selectedIndex) {
  if (state.answered || isQuizFinished(state)) {
    return { state, correct: false };
  }

  const correct = isCorrect(state.questions[state.current], selectedIndex);
  return {
    state: {
      ...state,
      score: state.score + (correct ? 1 : 0),
      answered: true,
    },
    correct,
  };
}

/**
 * Returns true when there are no more questions to answer.
 */
function isQuizFinished(state) {
  return state.current >= state.questions.length;
}

/**
 * Advances to the next question and resets its answer and timer state.
 */
function advanceQuestionState(state) {
  const current = state.current + 1;
  if (current >= state.questions.length) {
    return { ...state, current };
  }

  return {
    ...state,
    current,
    answered: false,
    timeLeft: QUESTION_TIME_SECONDS,
  };
}

/**
 * Decreases the timer by one second and marks the question answered at zero.
 */
function tickQuestion(state) {
  if (state.answered) return state;

  const timeLeft = Math.max(0, state.timeLeft - 1);
  return {
    ...state,
    timeLeft,
    answered: timeLeft === 0,
  };
}

/**
 * Converts a score into a whole-number percentage (0-100).
 */
function calculatePercentage(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

/**
 * Turns a percentage into a grade.
 * A = 90% or more, B = 75% or more, C = 50% or more.
 */
function getGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 75) return "B";
  if (percentage >= 50) return "C";
  return "Keep practicing";
}

/**
 * Returns an encouraging message for a grade.
 */
function getFeedbackMessage(grade) {
  if (grade === "A") return "Excellent work!";
  if (grade === "B") return "Great job!";
  if (grade === "C") return "Nice effort!";
  return "Keep practicing - you've got this!";
}

/**
 * Formats the remaining question time for display.
 */
function formatTimeLeft(seconds) {
  return `⏱ ${seconds}s`;
}

// Lets Node.js tests load this file. Browsers ignore this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createQuiz,
    answerQuestion,
    isQuizFinished,
    advanceQuestionState,
    tickQuestion,
    shuffle,
    isCorrect,
    calculatePercentage,
    getGrade,
    getFeedbackMessage,
    formatTimeLeft,
  };
}
