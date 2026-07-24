const quizQuestions = [
  {
    text: "Which HTML element is used to define the main content of a document?",
    topic: "HTML",
    options: ["<main>", "<section>", "<article>", "<div>"],
    correctAnswer: "<main>",
  },
  {
    text: "Which CSS property controls the spacing between flex items?",
    topic: "Flexbox",
    options: ["gap", "margin", "padding", "border"],
    correctAnswer: "gap",
  },
  {
    text: "What does the DOM represent in web development?",
    topic: "DOM",
    options: [
      "A styling framework",
      "A browser API for server requests",
      "A tree of page elements",
      "A database layer",
    ],
    correctAnswer: "A tree of page elements",
  },
  {
    text: "Which CSS layout system is ideal for two-dimensional alignment with rows and columns?",
    topic: "Grid",
    options: ["Flexbox", "Grid", "Inline-block", "Float"],
    correctAnswer: "Grid",
  },
  {
    text: "Which JavaScript method is used to add an element to the end of an array?",
    topic: "JavaScript",
    options: ["push()", "append()", "concat()", "merge()"],
    correctAnswer: "push()",
  },
  {
    text: "Why is responsive design important for modern websites?",
    topic: "Responsive Design",
    options: [
      "It improves SEO ranking only",
      "It allows the layout to adapt to different screen sizes",
      "It replaces JavaScript",
      "It disables mobile users",
    ],
    correctAnswer: "It allows the layout to adapt to different screen sizes",
  },
  {
    text: "Which HTML attribute improves accessibility by providing descriptive text for images?",
    topic: "Accessibility",
    options: ["title", "alt", "href", "src"],
    correctAnswer: "alt",
  },
  {
    text: "Which method is commonly used to fetch data from an API in JavaScript?",
    topic: "APIs",
    options: ["fetch()", "parse()", "query()", "attach()"],
    correctAnswer: "fetch()",
  },
  {
    text: "What does GitHub primarily help developers do?",
    topic: "Git & GitHub",
    options: [
      "Host and share code repositories",
      "Compile CSS automatically",
      "Replace the browser",
      "Create databases",
    ],
    correctAnswer: "Host and share code repositories",
  },
  {
    text: "Which CSS feature helps make text easier to read and accessible on different devices?",
    topic: "CSS",
    options: [
      "font-size: 100px",
      "line-height: 1.5",
      "background-color: red",
      "display: none",
    ],
    correctAnswer: "line-height: 1.5",
  },
];

const state = {
  currentIndex: 0,
  score: 0,
  questions: [],
  selectedAnswers: [],
  timeLeft: 15,
  timerId: null,
  darkMode: false,
};

const quizCard = document.getElementById("quizCard");
const resultCard = document.getElementById("resultCard");
const questionCounter = document.getElementById("questionCounter");
const timerBadge = document.getElementById("timerBadge");
const progressBar = document.getElementById("progressBar");
const questionTopic = document.getElementById("questionTopic");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const statusMessage = document.getElementById("statusMessage");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const themeToggle = document.getElementById("themeToggle");
const resultCircle = document.getElementById("resultCircle");
const scoreValue = document.getElementById("scoreValue");
const resultPercentage = document.getElementById("resultPercentage");
const performanceMessage = document.getElementById("performanceMessage");
const correctCount = document.getElementById("correctCount");
const wrongCount = document.getElementById("wrongCount");
const bestScoreValue = document.getElementById("bestScoreValue");
const reviewList = document.getElementById("reviewList");
const bestScoreLabel = document.getElementById("bestScoreLabel");
const confettiLayer = document.getElementById("confettiLayer");

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function prepareQuestions() {
  const shuffledQuestions = shuffleArray(quizQuestions).map((question) => ({
    ...question,
    options: shuffleArray(question.options),
  }));
  state.questions = shuffledQuestions;
  state.selectedAnswers = new Array(shuffledQuestions.length).fill(null);
}

function updateProgress() {
  const current = state.currentIndex + 1;
  const total = state.questions.length;
  questionCounter.textContent = `Question ${current} of ${total}`;
  progressBar.style.width = `${(current / total) * 100}%`;
}

function updateTimer() {
  timerBadge.textContent = `${state.timeLeft}s`;
  timerBadge.classList.toggle("warning", state.timeLeft <= 5);
}

function startTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
  }

  state.timeLeft = 15;
  updateTimer();
  state.timerId = window.setInterval(() => {
    state.timeLeft -= 1;
    updateTimer();

    if (state.timeLeft <= 0) {
      clearInterval(state.timerId);
      state.timerId = null;
      handleTimeExpired();
    }
  }, 1000);
}

function renderQuestion() {
  const question = state.questions[state.currentIndex];
  if (!question) {
    return;
  }

  quizCard.classList.remove("hidden");
  resultCard.classList.add("hidden");
  updateProgress();
  questionTopic.textContent = question.topic;
  questionText.textContent = question.text;

  const selectedAnswer = state.selectedAnswers[state.currentIndex];
  optionsContainer.innerHTML = "";

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `answer-btn${selectedAnswer === option ? " active" : ""}`;
    button.setAttribute("data-option", option);
    button.textContent = option;
    optionsContainer.appendChild(button);
  });

  nextBtn.disabled = !selectedAnswer;
  nextBtn.textContent =
    state.currentIndex === state.questions.length - 1 ? "Submit Quiz" : "Next";
  statusMessage.textContent = selectedAnswer
    ? "Answer selected. Continue when ready."
    : "Choose the best answer to continue.";
  startTimer();
}

function selectAnswer(option) {
  state.selectedAnswers[state.currentIndex] = option;
  renderQuestion();
}

function showStatus(message) {
  statusMessage.textContent = message;
}

function goToNextQuestion() {
  const selectedAnswer = state.selectedAnswers[state.currentIndex];
  if (!selectedAnswer) {
    showStatus("Please select an answer before continuing.");
    return;
  }

  if (state.currentIndex === state.questions.length - 1) {
    submitQuiz();
    return;
  }

  state.currentIndex += 1;
  renderQuestion();
}

function handleTimeExpired() {
  if (state.selectedAnswers[state.currentIndex]) {
    goToNextQuestion();
    return;
  }

  state.selectedAnswers[state.currentIndex] = null;
  showStatus("Time is up! Please select an answer and continue.");
  nextBtn.disabled = true;

  if (state.currentIndex === state.questions.length - 1) {
    submitQuiz();
  }
}

function calculateScore() {
  return state.questions.reduce((score, question, index) => {
    return state.selectedAnswers[index] === question.correctAnswer
      ? score + 1
      : score;
  }, 0);
}

function getPerformanceMessage(percentage) {
  if (percentage >= 80) {
    return "Excellent 🎉";
  }
  if (percentage >= 60) {
    return "Good 👍";
  }
  return "Keep Practicing 📚";
}

function updateResultCircle(percentage) {
  resultCircle.style.setProperty("--score-percent", percentage);
}

function renderResults() {
  const total = state.questions.length;
  state.score = calculateScore();
  const percentage = Math.round((state.score / total) * 100);

  scoreValue.textContent = `${state.score}/${total}`;
  resultPercentage.textContent = `${percentage}%`;
  performanceMessage.textContent = getPerformanceMessage(percentage);
  correctCount.textContent = state.score;
  wrongCount.textContent = total - state.score;
  updateResultCircle(percentage);

  const bestStored = Number(localStorage.getItem("quiz-best-score") || 0);
  const bestScore = Math.max(bestStored, state.score);
  localStorage.setItem("quiz-best-score", String(bestScore));
  bestScoreValue.textContent = `${bestScore}/${total}`;
  bestScoreLabel.textContent = `Best Score: ${bestScore}/${total}`;

  reviewList.innerHTML = "";
  state.questions.forEach((question, index) => {
    const selectedAnswer = state.selectedAnswers[index];
    const isCorrect = selectedAnswer === question.correctAnswer;

    const item = document.createElement("div");
    item.className = `review-item ${isCorrect ? "correct" : "wrong"}`;
    item.innerHTML = `
      <div class="review-question">${question.text}</div>
      <div class="review-answer">Your answer: ${selectedAnswer || "No answer"} • Correct answer: ${question.correctAnswer}</div>
    `;
    reviewList.appendChild(item);
  });

  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");

  if (percentage > 80) {
    launchConfetti();
  }
}

function submitQuiz() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
  renderResults();
}

function resetQuiz() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }

  state.currentIndex = 0;
  state.score = 0;
  prepareQuestions();
  renderQuestion();
}

function toggleTheme() {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle("dark", state.darkMode);
  localStorage.setItem("quiz-theme", state.darkMode ? "dark" : "light");
  themeToggle.innerHTML = state.darkMode
    ? '<span aria-hidden="true">☀️</span>'
    : '<span aria-hidden="true">🌙</span>';
}

function launchConfetti() {
  confettiLayer.innerHTML = "";
  const colors = ["#5b5cf6", "#ff7a59", "#50c878", "#ffcc00"];

  for (let i = 0; i < 45; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 220}px`);
    piece.style.animationDelay = `${Math.random() * 0.2}s`;
    confettiLayer.appendChild(piece);
  }

  window.setTimeout(() => {
    confettiLayer.innerHTML = "";
  }, 2200);
}

optionsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-option]");
  if (!button) {
    return;
  }
  selectAnswer(button.getAttribute("data-option"));
});

nextBtn.addEventListener("click", goToNextQuestion);
restartBtn.addEventListener("click", resetQuiz);
themeToggle.addEventListener("click", toggleTheme);

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("quiz-theme");
  state.darkMode = savedTheme === "dark";
  document.body.classList.toggle("dark", state.darkMode);
  themeToggle.innerHTML = state.darkMode
    ? '<span aria-hidden="true">☀️</span>'
    : '<span aria-hidden="true">🌙</span>';

  prepareQuestions();
  renderQuestion();
});
