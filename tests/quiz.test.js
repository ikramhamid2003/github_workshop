// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
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
} = require("../src/quiz.js");

test("createQuiz returns a fresh initial state and copies the question list", () => {
  const questions = [{ answer: 1 }];
  const state = createQuiz(questions);

  assert.deepEqual(state, {
    questions,
    current: 0,
    score: 0,
    answered: false,
    timeLeft: 15,
  });
  assert.notEqual(state.questions, questions);
  assert.deepEqual(questions, [{ answer: 1 }]);
});

test("answerQuestion records a correct answer without mutating the input state", () => {
  const original = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(original, 1);

  assert.equal(result.correct, true);
  assert.equal(result.state.score, 1);
  assert.equal(result.state.answered, true);
  assert.equal(original.score, 0);
  assert.equal(original.answered, false);
});

test("answerQuestion records an incorrect answer without increasing the score", () => {
  const original = createQuiz([{ answer: 1 }]);
  const result = answerQuestion(original, 0);

  assert.equal(result.correct, false);
  assert.equal(result.state.score, 0);
  assert.equal(result.state.answered, true);
  assert.equal(original.answered, false);
});

test("answerQuestion does not change an already answered quiz state", () => {
  const answered = { ...createQuiz([{ answer: 1 }]), answered: true };
  const result = answerQuestion(answered, 1);

  assert.equal(result.correct, false);
  assert.equal(result.state, answered);
});

test("isQuizFinished detects the end of the question list", () => {
  const state = createQuiz([{ answer: 0 }]);

  assert.equal(isQuizFinished(state), false);
  assert.equal(isQuizFinished({ ...state, current: 1 }), true);
});

test("advanceQuestionState resets answer and timer state for the next question", () => {
  const state = {
    ...createQuiz([{ answer: 0 }, { answer: 1 }]),
    answered: true,
    timeLeft: 4,
  };
  const next = advanceQuestionState(state);

  assert.equal(next.current, 1);
  assert.equal(next.answered, false);
  assert.equal(next.timeLeft, 15);
  assert.equal(state.current, 0);
  assert.equal(state.answered, true);
  assert.equal(state.timeLeft, 4);
});

test("tickQuestion decrements time and marks the question answered at zero", () => {
  const state = { ...createQuiz([{ answer: 0 }]), timeLeft: 1 };
  const next = tickQuestion(state);

  assert.equal(next.timeLeft, 0);
  assert.equal(next.answered, true);
  assert.equal(state.timeLeft, 1);
  assert.equal(state.answered, false);
});

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A for exactly 90%", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B for exactly 75%", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade gives a C for exactly 50%", () => {
  assert.equal(getGrade(50), "C");
});

test("getFeedbackMessage returns an encouraging message for each grade", () => {
  assert.equal(getFeedbackMessage("A"), "Excellent work!");
  assert.equal(getFeedbackMessage("B"), "Great job!");
  assert.equal(getFeedbackMessage("C"), "Nice effort!");
  assert.equal(getFeedbackMessage("Keep practicing"), "Keep practicing - you've got this!");
});

test("formatTimeLeft includes seconds and the timer icon", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
});

test("formatTimeLeft formats warning and expired times", () => {
  assert.equal(formatTimeLeft(5), "⏱ 5s");
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});
