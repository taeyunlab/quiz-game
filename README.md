<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CCC QuizConnect - 공동체 맞춤형 미니 퀴즈 게임</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Shifting Neon Cosmic Background -->
  <div class="background-glow">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  </div>

  <div class="container">
    <div class="glass-card">
      
      <!-- ================= START SCREEN ================= -->
      <section id="start-screen" class="screen active">
        <h1>CCC QuizConnect</h1>
        <p class="subtitle">공동체 맞춤형 실시간 미니 퀴즈</p>
        
        <div class="form-group">
          <label for="user-name">이름 (Name)</label>
          <input type="text" id="user-name" class="input-glow" placeholder="지체님의 이름을 적어주세요" required autocomplete="off">
        </div>
        
        <div class="form-group" style="margin-bottom: 36px;">
          <label for="user-team">소속 조 (Team)</label>
          <input type="text" id="user-team" class="input-glow" placeholder="예: 3조 / 여호수아조" required autocomplete="off">
        </div>
        
        <button id="start-btn" class="btn-primary">
          <span>퀴즈 시작하기</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </section>

      <!-- ================= QUIZ SCREEN ================= -->
      <section id="quiz-screen" class="screen">
        <div class="quiz-header">
          <div class="badge">문항 <span id="current-q-num">1</span> / <span id="total-q-num">4</span></div>
          <div class="score-tracker">현재 점수: <span id="live-score">0</span>점</div>
        </div>
        
        <!-- SVG/CSS-based Countdown Timer Bar -->
        <div class="timer-container">
          <div id="timer-bar" class="timer-bar"></div>
        </div>
        
        <div class="question-card">
          <span id="question-category" class="category-tag">CATEGORY</span>
          <h2 id="question-text" class="question-text">질문이 여기에 표시됩니다.</h2>
        </div>
        
        <div class="choices-grid" id="choices-container">
          <!-- 4 option buttons will be rendered dynamically -->
        </div>
      </section>

      <!-- ================= RESULT SCREEN ================= -->
      <section id="result-screen" class="screen">
        <div class="result-container">
          <div class="celebration-icon" id="result-emoji">🎉</div>
          <h1 id="result-title">수고하셨습니다!</h1>
          
          <!-- Animated radial score gauge -->
          <div class="score-circle-container">
            <svg class="score-svg" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#06b6d4" />
                  <stop offset="100%" stop-color="#6366f1" />
                </linearGradient>
              </defs>
              <circle class="score-bg-ring" cx="80" cy="80" r="70" />
              <circle id="score-progress" class="score-progress-ring" cx="80" cy="80" r="70" />
            </svg>
            <div class="score-text-overlay">
              <span id="final-score-value" class="score-value">0</span>
              <span class="score-total">/ 100점</span>
            </div>
          </div>
          
          <p id="result-feedback" class="result-feedback">
            <strong>7조</strong>의 홍길동 지체님, 대단해요!<br>공동체 퀴즈를 모두 풀었습니다!
          </p>
          
          <!-- Local Leaderboard Section -->
          <div class="leaderboard-section">
            <div class="leaderboard-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>명예의 전당 (Top 5)</span>
            </div>
            
            <table class="leaderboard-table">
              <thead>
                <tr>
                  <th style="width: 15%">순위</th>
                  <th style="width: 35%">이름</th>
                  <th style="width: 25%">소속 조</th>
                  <th style="width: 25%; text-align: right;">점수</th>
                </tr>
              </thead>
              <tbody id="leaderboard-body">
                <!-- Dynamically populated -->
              </tbody>
            </table>
          </div>
          
          <button id="restart-btn" class="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
            <span>다시 도전하기</span>
          </button>
        </div>
      </section>
      
    </div>
  </div>

  <!-- Load Quiz Data & App Engine -->
  <script src="js/quizData.js"></script>
  <script src="app.js"></script>
</body>
</html>
