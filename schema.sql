-- CCC QuizConnect - Database Schema Design
-- PostgreSQL / Supabase 호환 스키마 설계도

-- 1. 퀴즈 질문 테이블 (quiz_questions)
-- 퀴즈 문항을 저장하고 관리하는 데이터 테이블입니다.
CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,                           -- 카테고리 (예: 성경, CCC, 넌센스)
    question TEXT NOT NULL,                                  -- 퀴즈 질문 내용
    options TEXT[] NOT NULL,                                 -- 4지선다 보기 배열 (텍스트 배열 타입)
    correct_index INT NOT NULL CHECK (correct_index BETWEEN 0 AND 3), -- 정답 인덱스 (0~3)
    points INT DEFAULT 25,                                   -- 각 문항당 배점
    hint TEXT,                                               -- 사용자 힌트 내용
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 사용자 스코어 테이블 (users_scores)
-- 지체들의 이름, 소속 조, 그리고 달성한 최종 점수를 저장하는 랭킹 보드용 테이블입니다.
CREATE TABLE IF NOT EXISTS users_scores (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,                         -- 지체 이름
    user_team VARCHAR(100) NOT NULL,                         -- 소속 조 (예: 3조)
    score INT NOT NULL,                                      -- 취득 점수
    completed_time INT NOT NULL,                             -- 총 소요 시간 (초 단위)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성: 높은 점수 순 및 등록 시간 순으로 빠르게 조회하기 위한 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_scores_rank ON users_scores (score DESC, created_at ASC);

-- 3. 초기 샘플 데이터 삽입 트리거 (선택사항)
-- 데이터베이스 구축 시 자동으로 샘플 퀴즈가 적재되도록 처리합니다.
INSERT INTO quiz_questions (category, question, options, correct_index, points, hint)
VALUES 
('성경', '성령의 9가지 열매 중 가장 먼저 언급되는 것은 무엇일까요?', ARRAY['사랑', '희락', '화평', '오래 참음'], 0, 25, '갈라디아서 5장 22절을 떠올려보세요!'),
('CCC 슬로건', 'CCC의 브랜드 아이덴티티 슬로건인 ''We code with AI, we build for OOOO''에서 빈칸에 들어갈 단어는?', ARRAY['future', 'people', 'church', 'mission'], 1, 25, '우리의 기술은 사람을 향합니다.'),
('해커톤 역사', '올해 CCC AI 해커톤 오리엔테이션이 성황리에 열린 최초의 날짜는 언제일까요?', ARRAY['2026년 5월 15일', '2026년 5월 20일', '2026년 5월 23일', '2026년 5월 24일'], 2, 25, '본격 준비가 시작되었던 토요일입니다.'),
('넌센스', '세상에서 가장 외로운 구글 AI 서비스는 무엇일까요?', ARRAY['제미나이-싱글', '제미나이-고독함', '제미나이-외로워성', '제미나이-혼자있성'], 2, 25, '구글 제미나이 AI 명칭을 유쾌하게 비틀어보세요.')
ON CONFLICT DO NOTHING;
