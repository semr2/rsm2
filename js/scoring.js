/**
 * Scoring engine.
 * Final assessment score for the backup best-practices course.
 * Pass mark: 80 percent.
 */
import { state } from './course-state.js';
import { scorm } from './scorm.js';

export const PASS_MARK = 80;
export const SCENARIO_TOTAL = 0;
export const QUIZ_TOTAL = 100;

export function computeFinalScore() {
  const total = Math.max(0, Math.min(100, Math.round(Number(state.quizScore) || 0)));
  return {
    scenarioEarned: 0,
    scenarioMax: 0,
    quizEarned: total,
    quizMax: QUIZ_TOTAL,
    total,
    passed: total >= PASS_MARK,
  };
}

export function commitFinalScore() {
  const result = computeFinalScore();
  state.finalScore = result.total;
  state.passed = result.passed;
  state.save();
  scorm.setScore(result.total, 100);
  scorm.setLessonStatus(result.passed ? 'passed' : 'failed');
  return result;
}
