// scenarios/index.js
import step00 from "./step00-introduction.js";
import step01 from "./step01-monday-morning.js";
import step02 from "./step02-quarterly-report.js";
import step03 from "./step03-computer-crash.js";
import step04 from "./step04-restart.js";
import step05 from "./step05-corrupted-file.js";
import step06 from "./step06-no-backup.js";
import step07 from "./step07-contact-it.js";
import step08 from "./step08-support-ticket.js";
import step09 from "./step09-it-call.js";
import step10 from "./step10-backup-lesson.js";
import step11 from "./step11-backup-setup.js";
import step12 from "./step12-321-rule.js";
import step13 from "./step13-backup-security.js";
import step14 from "./step14-automatic-backup.js";
import step15 from "./step15-restore-test.js";
import step16 from "./step16-debrief.js";
import step17 from "./step17-quiz.js";
import { enterScenario } from "./runtime.js";

const definitions = [
  step00,
  step01,
  step02,
  step03,
  step04,
  step05,
  step06,
  step07,
  step08,
  step09,
  step10,
  step11,
  step12,
  step13,
  step14,
  step15,
  step16,
  step17
];

export const STEPS = definitions.map((definition) => ({
  ...definition,
  enter: (ctx) => enterScenario(definition, ctx),
}));
export const scenarios = STEPS;

export function getScenario(id) {
  return STEPS.find((scenario) => scenario.id === id);
}

export function getScenarioByIndex(index) {
  return STEPS[index] ?? null;
}

export function getScenarioCount() {
  return STEPS.length;
}

export default STEPS;
