// CCC QuizConnect - 게임 엔진 및 총괄 제어 스크립트

document.addEventListener("DOMContentLoaded", () => {
  // Game States
  let currentState = {
    userName: "",
    userTeam: "",
    currentQuestionIndex: 0,
    score: 0,
    timerInterval: null,
    timeLeft: 15, // 15 seconds per question
    maxTime: 15,
    answered: false
  };

  // DOM Elements - Screens
  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");

  // DOM Elements - Inputs & Controls
  const userNameInput = document.getElementById("user-name");
  const userTeamInput = document.getElementById("user-team");
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");

  // DOM Elements - Quiz HUD
  const currentQNum = document.getElementById("current-q-num");
  const totalQNum = document.getElementById("total-q-num");
  const liveScore = document.getElementById("live-score");
  const timerBar = document.getElementById("timer-bar");
  const questionCategory = document.getElementById("question-category");
  const questionText = document.getElementById("question-text");
  const choicesContainer = document.getElementById("choices-container");

  // DOM Elements - Result Page
  const resultEmoji = document.getElementById("result-emoji");
  const resultTitle = document.getElementById("result-title");
  const scoreProgress = document.getElementById("score-progress");
  const finalScoreValue = document.getElementById("final-score-value");
  const resultFeedback = document.getElementById("result-feedback");
  const leaderboardBody = document.getElementById("leaderboard-body");

  // --- SPA Screen Routing with Animation ---
  function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove("active");
    setTimeout(() => {
      fromScreen.style.display = "none";
      toScreen.style.display = "block";
      setTimeout(() => {
        toScreen.classList.add("active");
      }, 50);
    }, 400); // matching CSS opacity transition
  }

  // --- Start Game Flow ---
  startBtn.addEventListener("click", () => {
    const name = userNameInput.value.trim();
    const team = userTeamInput.value.trim();

    if (!name) {
      alert("지체님의 이름을 입력해주세요!");
      userNameInput.focus();
      return;
    }
    if (!team) {
      alert("소속 조(예: 3조)를 입력해주세요!");
      userTeamInput.focus();
      return;
    }

    // Set user info
    currentState.userName = name;
    currentState.userTeam = team;
    currentState.score = 0;
    currentState.currentQuestionIndex = 0;

    // Reset HUD
    liveScore.textContent = "0";
    totalQNum.textContent = window.quizQuestions.length;

    switchScreen(startScreen, quizScreen);
    setTimeout(loadQuestion, 500);
  });

  // --- Load Question ---
  function loadQuestion() {
    currentState.answered = false;
    const currentQ = window.quizQuestions[currentState.currentQuestionIndex];

    // HUD Update
    currentQNum.textContent = currentState.currentQuestionIndex + 1;
    questionCategory.textContent = currentQ.category;
    questionText.textContent = currentQ.question;
    liveScore.textContent = currentState.score;

    // Timer Reset
    currentState.timeLeft = currentState.maxTime;
    timerBar.style.width = "100%";
    timerBar.className = "timer-bar"; // reset warnings

    // Choices Render
    choicesContainer.innerHTML = "";
    currentQ.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.className = "choice-btn";
      button.dataset.index = index;

      const alphabets = ["A", "B", "C", "D"];
      button.innerHTML = `
        <div class="choice-prefix">${alphabets[index]}</div>
        <div class="choice-text">${escapeHTML(option)}</div>
        <div class="choice-status-icon"></div>
      `;

      button.addEventListener("click", () => handleChoiceSelection(index));
      choicesContainer.appendChild(button);
    });

    // Start Timer Interval
    startTimer();
  }

  // --- Timer Operations ---
  function startTimer() {
    clearInterval(currentState.timerInterval);
    
    // Ticking every 100ms for ultra-smooth layout rendering
    const tickMs = 100;
    currentState.timerInterval = setInterval(() => {
      currentState.timeLeft -= tickMs / 1000;
      
      // Calculate width percentage
      const percent = (currentState.timeLeft / currentState.maxTime) * 100;
      timerBar.style.width = `${Math.max(0, percent)}%`;

      // Warning color triggers
      if (currentState.timeLeft <= 4) {
        timerBar.classList.add("danger");
        timerBar.classList.remove("warning");
      } else if (currentState.timeLeft <= 8) {
        timerBar.classList.add("warning");
      }

      // Timeout logic
      if (currentState.timeLeft <= 0) {
        clearInterval(currentState.timerInterval);
        handleTimeout();
      }
    }, tickMs);
  }

  // --- Selection Handler ---
  function handleChoiceSelection(selectedIndex) {
    if (currentState.answered) return;
    currentState.answered = true;
    clearInterval(currentState.timerInterval);

    const currentQ = window.quizQuestions[currentState.currentQuestionIndex];
    const correctIndex = currentQ.correctIndex;
    const choiceButtons = choicesContainer.querySelectorAll(".choice-btn");

    // Disable all options
    choiceButtons.forEach(btn => btn.classList.add("disabled"));

    if (selectedIndex === correctIndex) {
      // Correct!
      choiceButtons[selectedIndex].classList.add("selected-correct");
      choiceButtons[selectedIndex].querySelector(".choice-status-icon").innerHTML = 
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      
      currentState.score += currentQ.points;
      liveScore.textContent = currentState.score;
    } else {
      // Incorrect!
      choiceButtons[selectedIndex].classList.add("selected-incorrect");
      choiceButtons[selectedIndex].querySelector(".choice-status-icon").innerHTML = 
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

      // Highlight Correct Answer
      choiceButtons[correctIndex].classList.add("show-correct-unselected");
    }

    // Move next after 2 seconds delay
    setTimeout(goToNextQuestion, 2000);
  }

  // --- Timeout Handler ---
  function handleTimeout() {
    currentState.answered = true;
    const currentQ = window.quizQuestions[currentState.currentQuestionIndex];
    const correctIndex = currentQ.correctIndex;
    const choiceButtons = choicesContainer.querySelectorAll(".choice-btn");

    choiceButtons.forEach(btn => btn.classList.add("disabled"));
    
    // Highlight correct answer in orange warning flash
    choiceButtons[correctIndex].classList.add("show-correct-unselected");

    // Add quick visual status that time is out
    const timeoutOverlay = document.createElement("div");
    timeoutOverlay.style.textAlign = "center";
    timeoutOverlay.style.marginTop = "12px";
    timeoutOverlay.style.color = "var(--incorrect)";
    timeoutOverlay.style.fontWeight = "600";
    timeoutOverlay.textContent = "⏱️ 시간 초과! 아쉽습니다.";
    choicesContainer.appendChild(timeoutOverlay);

    setTimeout(goToNextQuestion, 2000);
  }

  // --- Transition to Next Question or Results ---
  function goToNextQuestion() {
    currentState.currentQuestionIndex++;
    if (currentState.currentQuestionIndex < window.quizQuestions.length) {
      loadQuestion();
    } else {
      finishGame();
    }
  }

  // --- Finish Game & Save Scores ---
  function finishGame() {
    // Save to Local Database (localStorage)
    saveScore(currentState.userName, currentState.userTeam, currentState.score);

    // Render Radial Score Circle
    const totalQuestions = window.quizQuestions.length;
    const percent = (currentState.score / (totalQuestions * 25)) * 100;
    
    // SVG circular math (radius 70, perimeter 440)
    const dashoffset = 440 - (440 * percent) / 100;
    scoreProgress.style.strokeDashoffset = dashoffset;
    finalScoreValue.textContent = currentState.score;

    // Personal Greetings & Feedback based on Score
    let titleMessage = "";
    let emoji = "";
    let scoreFeedback = "";

    if (currentState.score === 100) {
      emoji = "👑";
      titleMessage = "완벽한 마스터!";
      scoreFeedback = `대단합니다! <strong>${currentState.userTeam}</strong>의 <strong>${currentState.userName}</strong> 지체님은 모든 문제를 맞췄습니다! 해커톤 명예의 전당 등극 완료! 🚀`;
    } else if (currentState.score >= 50) {
      emoji = "✨";
      titleMessage = "훌륭합니다!";
      scoreFeedback = `좋은 실력이에요! <strong>${currentState.userTeam}</strong>의 <strong>${currentState.userName}</strong> 지체님, 공동체 모임에서 더 신나게 퀴즈를 공유해 보세요! 🎉`;
    } else {
      emoji = "💡";
      titleMessage = "아쉬운 한 걸음!";
      scoreFeedback = `<strong>${currentState.userTeam}</strong>의 <strong>${currentState.userName}</strong> 지체님, 조금만 더 노력하면 만점도 문제없습니다! 한 번 더 도전해 볼까요? 🔥`;
    }

    resultEmoji.textContent = emoji;
    resultTitle.textContent = titleMessage;
    resultFeedback.innerHTML = scoreFeedback;

    // Render Board
    renderLeaderboard();

    // Route Screen
    switchScreen(quizScreen, resultScreen);
  }

  // --- Restart Game ---
  restartBtn.addEventListener("click", () => {
    switchScreen(resultScreen, startScreen);
    userNameInput.value = "";
    userTeamInput.value = "";
    scoreProgress.style.strokeDashoffset = 440; // reset radial ring animation
  });

  // --- Local Database Scoring Logic (Top 5 Leaderboard) ---
  function saveScore(name, team, score) {
    const scores = JSON.parse(localStorage.getItem("ccc_quiz_leaderboard")) || [];
    
    // Add new score
    const newEntry = {
      name: name,
      team: team,
      score: score,
      timestamp: new Date().getTime()
    };
    
    scores.push(newEntry);
    
    // Sort by Score (Desc), then Time (Asc)
    scores.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
    
    // Keep only Top 5
    const topFive = scores.slice(0, 5);
    localStorage.setItem("ccc_quiz_leaderboard", JSON.stringify(topFive));
  }

  function renderLeaderboard() {
    leaderboardBody.innerHTML = "";
    const scores = JSON.parse(localStorage.getItem("ccc_quiz_leaderboard")) || [];

    if (scores.length === 0) {
      leaderboardBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">아직 기록이 없습니다. 첫 주인공이 되어보세요!</td></tr>`;
      return;
    }

    scores.forEach((entry, index) => {
      const row = document.createElement("tr");
      
      // Highlight active user row
      const isActive = (entry.name === currentState.userName && entry.team === currentState.userTeam && entry.score === currentState.score);
      if (isActive) {
        row.className = "highlight";
      }

      // Rank badges
      let rankContent = "";
      if (index === 0) rankContent = `<span class="rank-badge rank-1">1</span>`;
      else if (index === 1) rankContent = `<span class="rank-badge rank-2">2</span>`;
      else if (index === 2) rankContent = `<span class="rank-badge rank-3">3</span>`;
      else rankContent = `<span class="rank-badge rank-other">${index + 1}</span>`;

      row.innerHTML = `
        <td>${rankContent}</td>
        <td>${escapeHTML(entry.name)}</td>
        <td>${escapeHTML(entry.team)}</td>
        <td style="text-align: right; font-weight: 700; color: var(--neon-cyan);">${entry.score}점</td>
      `;
      leaderboardBody.appendChild(row);
    });
  }

  // --- Helpers ---
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
