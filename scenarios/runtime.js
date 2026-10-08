// Small renderer for the scenario data files. It keeps authored steps focused
// on course content while providing one consistent, keyboard accessible flow.
import { clearOverlays } from "../ui/feedback.js";
import RestoreUI from "../ui/restore.js";
import { commitFinalScore } from "../js/scoring.js";

let restoreWindow = null;
let restoreUI = null;

const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]));

function contentFor(step) {
  const lines = [];
  const addList = (heading, values = [], ordered = false) => {
    if (!values.length) return;
    const tag = ordered ? "ol" : "ul";
    lines.push(`<h3>${escapeHTML(heading)}</h3><${tag}>${values.map((item) =>
      `<li>${escapeHTML(typeof item === "string" ? item : item.text || item.title || item.description || "")}</li>`
    ).join("")}</${tag}>`);
  };

  for (const line of step.narrative || []) {
    lines.push(`<p><b>${escapeHTML(line.speaker || "")}</b> ${escapeHTML(line.text || "")}</p>`);
  }
  for (const line of step.call?.dialogue || []) {
    lines.push(`<p><b>${escapeHTML(line.speaker || "")}</b> ${escapeHTML(line.text || "")}</p>`);
  }
  addList("What to do", step.instructions, true);
  addList("Key details", step.facts);
  if (step.task?.filename) lines.push(`<p>Open <b>${escapeHTML(step.task.filename)}</b> in the simulated workspace.</p>`);
  if (step.simulatedFile?.contents) addList(step.simulatedFile.name, step.simulatedFile.contents);
  if (step.error) {
    lines.push(`<h3>${escapeHTML(step.error.title)}</h3><p>${escapeHTML(step.error.message)}</p><p>${escapeHTML(step.error.details)}</p><p>${escapeHTML(step.error.recovery)}</p>`);
  }
  if (step.lesson) {
    if (step.lesson.title) lines.push(`<h3>${escapeHTML(step.lesson.title)}</h3>`);
    if (step.lesson.explanation) lines.push(`<p>${escapeHTML(step.lesson.explanation)}</p>`);
    addList("Remember", step.lesson.points || step.lesson.components || step.lesson.lessons);
  }
  if (step.summary) {
    lines.push(`<h3>${escapeHTML(step.summary.title || "Summary")}</h3>`);
    addList("What you learned", step.summary.points);
  }
  if (step.restoreTask?.prompt) lines.push(`<p>${escapeHTML(step.restoreTask.prompt)}</p>`);
  if (step.storage) lines.push(`<p>${escapeHTML(step.storage.label)} · ${escapeHTML(step.storage.capacity || "")}</p>`);
  if (step.crashScreen) lines.push(`<p>${escapeHTML(step.crashScreen.message)}</p>`);
  if (step.restartSequence) addList("Restart sequence", step.restartSequence.map((item) => item.text));
  if (step.challenge?.prompt) lines.push(`<p>${escapeHTML(step.challenge.prompt)}</p>`);
  if (step.reflection?.prompt) lines.push(`<p>${escapeHTML(step.reflection.prompt)}</p>`);
  return lines.join("");
}

function optionsFor(step) {
  if (step.choices?.length) return step.choices.map((choice) => ({ id: choice.id, label: choice.label, detail: choice.outcome?.message }));
  if (step.reflection?.options?.length) return step.reflection.options.map((option) => ({ id: option.id, label: option.label }));
  if (step.challenge?.configurations?.length) return step.challenge.configurations.map((item) => ({ id: item.id, label: item.title, detail: item.feedback, correct: item.risk }));
  if (step.challenge?.options?.length) return step.challenge.options.map((label) => ({ id: label, label, correct: step.challenge.correct?.includes(label) }));
  return [];
}

function showScenarioForm(step, ctx, fields, complete) {
  const values = {};
  const interactionId = step.interaction?.id || step.id;
  const render = (message = "") => {
    const markup = fields.map((field) => `<label class="scenario-field">${escapeHTML(field.label)}<select name="${escapeHTML(field.id)}" required><option value="">Choose an option</option>${field.options.map((option) => `<option${values[field.id] === option ? " selected" : ""}>${escapeHTML(option)}</option>`).join("")}</select></label>`).join("");
    const dialog = ctx.panel({
      title: step.title,
      body: `${`<p><b>Objective:</b> ${escapeHTML(step.objective || "")}</p>`}${contentFor(step)}<form class="scenario-form">${markup}</form>${message ? `<p class="form-feedback" role="status">${escapeHTML(message)}</p>` : ""}`,
      choices: [{ label: step.submit?.label || "SUBMIT", kind: "btn-primary", onClick: () => {
        const valid = fields.every((field) => values[field.id]);
        if (!valid) {
          render("Choose an answer for every field before submitting.");
          return;
        }
        const correct = fields.every((field) => values[field.id] === field.correct);
        ctx.engine.track(interactionId, JSON.stringify(values), correct ? "correct" : "wrong");
        if (!correct) {
          render("Some answers need review. Check the incident details and try again.");
          return;
        }
        const ticketId = step.success?.ticketId;
        ctx.panel({
          title: "Request submitted",
          body: `<p>${escapeHTML(step.success?.message || "Your request was submitted to the simulated IT support team.")}</p>${ticketId ? `<p>Ticket: <b>${escapeHTML(ticketId)}</b></p>` : ""}`,
          choices: [{ label: "CONTINUE", kind: "btn-primary", onClick: complete }],
        });
      }}],
    });
    dialog?.querySelectorAll("select[name]").forEach((select) => {
      select.addEventListener("change", () => { values[select.name] = select.value; });
    });
  };
  render();
}

function showAssessment(step, ctx) {
  const questions = step.assessment.questions;
  let index = 0;
  const ask = () => {
    const question = questions[index];
    ctx.panel({
      title: `${step.title} · ${index + 1} of ${questions.length}`,
      body: `<p>${escapeHTML(question.question)}</p>`,
      ariaLabel: `Question ${index + 1} of ${questions.length}: ${question.question}`,
      choices: question.options.map((option) => ({
        label: option.text,
        kind: "btn-secondary",
        onClick: () => {
          const ok = Boolean(option.correct);
          ctx.state.quizAnswers[question.id] = { choice: option.id, ok };
          ctx.state.save();
          ctx.engine.track(question.id, option.id, ok ? "correct" : "wrong");
          ctx.panel({
            title: ok ? "Correct" : "Review this point",
            body: `<p>${escapeHTML(ok ? "That is correct." : "That is not the best answer.")}</p>`,
            choices: [{ label: index === questions.length - 1 ? "SEE RESULTS" : "NEXT QUESTION", kind: "btn-primary", onClick: () => {
              index += 1;
              if (index < questions.length) ask();
              else finish();
            }}],
          });
        },
      })),
    });
  };
  const finish = () => {
    const correct = questions.filter((question) => ctx.state.quizAnswers[question.id]?.ok).length;
    ctx.state.quizScore = Math.round((correct / questions.length) * 100);
    const result = commitFinalScore();
    const passed = result.passed && result.total >= (step.assessment.passingScore || 80);
    ctx.state.passed = passed;
    ctx.state.save();
    ctx.panel({
      title: passed ? "Course complete" : "Assessment complete",
      body: `<p>Your score is <b>${result.total}%</b>. ${passed ? "You passed." : `The pass mark is ${step.assessment.passingScore || 80}%.`}</p>`,
      choices: [{ label: "RESTART COURSE", kind: "btn-primary", onClick: () => { ctx.state.reset(); window.location.reload(); } }],
      ariaLabel: `Assessment complete. Score ${result.total} percent.`,
    });
  };
  if (step.instructions?.length) {
    ctx.panel({
      title: step.title,
      body: `<p><b>Objective:</b> ${escapeHTML(step.objective || "")}</p>${contentFor(step)}<p>The assessment has ${questions.length} questions. Your final score is based on your answers.</p>`,
      ariaLabel: `${step.title}. Assessment instructions`,
      choices: [{ label: "START ASSESSMENT", kind: "btn-primary", onClick: ask }],
    });
  } else ask();
}

export function enterScenario(step, ctx) {
  const focus = step.environment?.focus;
  const view = ["office", "monitor", "phone", "hardware", "cleanpc", "establish"].includes(focus) ? focus :
    focus === "workstation" || focus === "desk" ? "monitor" : "office";
  ctx.env?.setView?.(view);
  // App-driven tasks have their own launch and completion handlers. Keep the
  // free-exploration monitor hotspot for steps where it cannot bypass them.
  ctx.sys?.setActive?.(view === "monitor" && !step.application ? ["monitor"] : []);

  if (step.assessment?.questions?.length) {
    showAssessment(step, ctx);
    return;
  }
  const options = optionsFor(step);
  const headline = `<p><b>Objective:</b> ${escapeHTML(step.objective || "")}</p>${contentFor(step)}`;
  const interactionId = step.interaction?.id || step.completion?.interactionId || step.id;
  const complete = () => {
    ctx.engine.track(interactionId, "completed");
    step.onComplete?.({ state: ctx.state, step });
    ctx.engine.complete();
  };
  if (step.tour?.length) {
    let tourIndex = 0;
    const showTourCard = () => {
      const item = step.tour[tourIndex];
      const isFirst = tourIndex === 0;
      const isLast = tourIndex === step.tour.length - 1;
      ctx.panel({
        title: item.title,
        body: `${isFirst ? `<p><b>Objective:</b> ${escapeHTML(step.objective || "")}</p>${contentFor(step)}` : ""}<p>${escapeHTML(item.text)}</p><p class="small-note">Office tour · ${tourIndex + 1} of ${step.tour.length}</p>`,
        ariaLabel: `${item.title}. Office tour step ${tourIndex + 1} of ${step.tour.length}`,
        choices: [{
          label: isLast ? (step.interaction?.label || "START SIMULATION") : "NEXT",
          kind: "btn-primary",
          onClick: () => {
            ctx.engine.track(`${step.id}_tour_${tourIndex + 1}`, "viewed");
            if (isLast) complete();
            else {
              tourIndex += 1;
              showTourCard();
            }
          },
        }],
      });
    };
    showTourCard();
    return;
  }
  const monitorChoice = view === "monitor" && !step.application
    ? [{
        label: "OPEN WORKSTATION",
        kind: "btn-secondary",
        onClick: () => ctx.sys?.activate?.("monitor"),
      }]
    : [];
  if (step.ticket?.fields?.length) {
    showScenarioForm(step, ctx, step.ticket.fields, complete);
    return;
  }
  if (step.portal?.form?.category?.options?.length) {
    showScenarioForm(step, ctx, [{ id: "category", label: "Problem category", ...step.portal.form.category }], complete);
    return;
  }
  if (step.application === "restore-center" && step.restoreTask) {
    if (!restoreWindow) {
      restoreWindow = document.createElement("section");
      restoreWindow.className = "app-window restore-window";
      restoreWindow.setAttribute("aria-label", "Backup restore center");
      restoreUI = new RestoreUI(restoreWindow);
    }
    restoreUI.render({ filename: step.restoreTask.filename });
    ctx.desktop.registerWindow("restore", restoreWindow);
    restoreUI.onComplete(() => {
      ctx.desktop.hide();
      ctx.panel({
        title: step.success?.title || "Restore complete",
        body: `<p>${escapeHTML(step.success?.message || "The selected file was restored.")}</p><p>${escapeHTML(step.success?.lesson || "Test backups regularly to confirm recovery works.")}</p>`,
        choices: [{ label: "CONTINUE", kind: "btn-primary", onClick: complete }],
      });
    });
    ctx.panel({
      title: step.title,
      body: `${headline}<p>Select the backup and destination, then restore the report.</p>`,
      choices: [{ label: "OPEN RESTORE CENTER", kind: "btn-primary", onClick: () => {
        clearOverlays();
        ctx.desktop.show("Alice’s Workstation");
        ctx.desktop.openApp("restore");
      }}],
    });
    return;
  }
  const fileName = step.task?.filename || step.targetFile?.name;
  if (step.application === "file-manager" && fileName && ctx.fileManager) {
    ctx.panel({
      title: step.title,
      body: `${headline}<p>Open <b>${escapeHTML(fileName)}</b> in the simulated Documents folder.</p>`,
      choices: [{ label: "OPEN FILE MANAGER", kind: "btn-primary", onClick: () => {
        clearOverlays();
        ctx.desktop.show("Alice’s Workstation");
        ctx.desktop.openApp("files");
        ctx.fileManager.onFileOpen((openedName) => {
          if (openedName !== fileName) return;
          ctx.fileManager.onFileOpen(null);
          if (step.error) ctx.fileManager.showCorruptedFile(fileName);
          ctx.desktop.hide();
          if (step.error) {
            ctx.panel({
              title: step.error.title,
              body: `<p>${escapeHTML(step.error.message)}</p><p>${escapeHTML(step.error.details)}</p><p>${escapeHTML(step.error.recovery)}</p>`,
              choices: (step.choices || []).map((choice) => ({
                label: choice.label,
                kind: "btn-secondary",
                onClick: () => ctx.panel({
                  title: choice.outcome?.type === "failure" ? "Recovery unavailable" : "Continue",
                  body: `<p>${escapeHTML(choice.outcome?.message || "No backup copy was found.")}</p>`,
                  choices: [{ label: "CONTINUE", kind: "btn-primary", onClick: complete }],
                }),
              })),
            });
          } else {
            ctx.panel({
              title: step.simulatedFile?.name || fileName,
              body: `${step.feedback?.success ? `<p>${escapeHTML(step.feedback.success)}</p>` : ""}${contentFor(step)}`,
              choices: [{ label: "CONTINUE", kind: "btn-primary", onClick: complete }],
            });
          }
        });
      }}],
    });
    return;
  }
  const challengeItems = step.challenge?.configurations || step.challenge?.options;
  if (challengeItems?.length) {
    const selected = new Set();
    const items = step.challenge.configurations
      ? step.challenge.configurations.map((item) => ({ id: item.id, label: item.title, correct: item.risk }))
      : step.challenge.options.map((label) => ({ id: label, label, correct: step.challenge.correct?.includes(label) }));
    const renderChallenge = (result) => {
      const body = `${headline}<p>${escapeHTML(step.challenge.prompt || "Select all that apply.")}</p>${result ? `<p>${escapeHTML(result)}</p>` : `<p>${selected.size} selected</p>`}`;
      ctx.panel({
        title: step.title,
        body,
        ariaLabel: `${step.title}. ${step.challenge.prompt || "Select all that apply."}`,
        choices: [
          ...(result ? [] : items.map((item) => ({
            label: `${selected.has(item.id) ? "☑" : "☐"} ${item.label}`,
            kind: "btn-secondary",
            onClick: () => { selected.has(item.id) ? selected.delete(item.id) : selected.add(item.id); renderChallenge(); },
          }))),
          ...(result ? [{ label: "CONTINUE", kind: "btn-primary", onClick: complete }] : [{
            label: "SUBMIT SELECTION",
            kind: "btn-primary",
            onClick: () => {
              const expected = new Set(items.filter((item) => item.correct).map((item) => item.id));
              const correct = expected.size > 0 && expected.size === selected.size && [...expected].every((id) => selected.has(id));
              ctx.engine.track(interactionId, [...selected].join(","), correct ? "correct" : "wrong");
              renderChallenge(correct ? "Correct. You identified the right principles." : "Review your choices and the guidance above.");
            },
          }]),
        ],
      });
    };
    renderChallenge();
    return;
  }
  const label = step.interaction?.label || (options.length ? "CHOOSE" : "CONTINUE");
  if (!options.length) {
    ctx.panel({ title: step.title, body: headline, choices: [...monitorChoice, { label, kind: "btn-primary", onClick: complete }], ariaLabel: `${step.title}. ${step.objective || ""}` });
    return;
  }
  ctx.panel({
    title: step.title,
    body: headline,
    ariaLabel: `${step.title}. ${step.objective || ""}`,
    choices: [...options.map((option) => ({
      label: option.label,
      kind: "btn-secondary",
      onClick: () => {
        ctx.engine.track(interactionId, option.id, option.correct === undefined ? "neutral" : option.correct ? "correct" : "wrong");
        ctx.panel({
          title: option.correct === undefined ? "Response recorded" : option.correct ? "Good choice" : "Review this risk",
          body: `<p>${escapeHTML(option.detail || step.feedback?.success || step.challenge?.prompt || "Your response has been recorded.")}</p>`,
          choices: [{ label: "CONTINUE", kind: "btn-primary", onClick: complete }],
        });
      },
    })), ...monitorChoice],
  });
}
