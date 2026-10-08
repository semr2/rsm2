// ui/quiz.js

export class QuizUI {

  constructor(container) {
    this.container = container;
    this.index = 0;
    this.answers = {};
  }


  render(assessment) {

    this.assessment = assessment;
    this.index = 0;
    this.answers = {};

    this.renderQuestion();
  }


  renderQuestion() {

    const question =
      this.assessment.questions[
        this.index
      ];


    if (!question) {

      this.finish();

      return;
    }


    this.container.innerHTML = `

      <div class="assessment">

        <header class="assessment-header">

          <div>

            <span>
              NORTHSTAR SECURITY AWARENESS
            </span>

            <h1>
              Knowledge Check
            </h1>

          </div>

          <div class="question-counter">
            ${this.index + 1}
            /
            ${this.assessment.questions.length}
          </div>

        </header>


        <main class="assessment-question">

          <div class="question-number">
            QUESTION ${this.index + 1}
          </div>

          <h2>
            ${this.escape(
              question.question
            )}
          </h2>


          <div class="assessment-options">

            ${question.options.map(
              option => `

                <label
                  class="assessment-option"
                >

                  <input
                    type="radio"
                    name="answer"
                    value="${this.escape(
                      option.id
                    )}"
                  />

                  <span>
                    ${this.escape(
                      option.text
                    )}
                  </span>

                </label>
              `
            ).join("")}

          </div>


          <button
            id="next-question"
          >
            ${
              this.index ===
              this.assessment.questions.length - 1
                ? "FINISH ASSESSMENT"
                : "NEXT QUESTION"
            }
          </button>


          <div
            id="quiz-message"
          ></div>

        </main>

      </div>
    `;


    this.container
      .querySelector(
        "#next-question"
      )
      ?.addEventListener(
        "click",
        () => this.submitAnswer()
      );
  }


  submitAnswer() {

    const selected =
      this.container.querySelector(
        'input[name="answer"]:checked'
      );


    if (!selected) {

      this.container.querySelector(
        "#quiz-message"
      ).textContent =
        "Please select an answer.";

      return;
    }


    const question =
      this.assessment.questions[
        this.index
      ];


    this.answers[question.id] =
      selected.value;


    if (
      this.index ===
      this.assessment.questions.length - 1
    ) {

      this.finish();

      return;
    }


    this.index++;

    this.renderQuestion();
  }


  finish() {

    let correct = 0;

    for (
      const question
      of this.assessment.questions
    ) {

      if (
        this.answers[question.id] ===
        question.correctAnswer
      ) {
        correct++;
      }
    }


    const total =
      this.assessment.questions.length;


    const score =
      Math.round(
        (correct / total) * 100
      );


    const passingScore =
      this.assessment.passingScore ||
      80;


    const passed =
      score >= passingScore;


    this.container.innerHTML = `

      <div class="assessment-result">

        <span>
          ASSESSMENT COMPLETE
        </span>

        <h1>
          ${passed
            ? "Assessment Passed"
            : "Assessment Not Passed"}
        </h1>


        <div class="score-circle">

          <strong>
            ${score}%
          </strong>

          <small>
            Score
          </small>

        </div>


        <p>
          ${correct}
          of
          ${total}
          questions answered correctly.
        </p>


        <button
          id="assessment-complete"
        >
          CONTINUE
        </button>

      </div>
    `;


    this.container
      .querySelector(
        "#assessment-complete"
      )
      ?.addEventListener(
        "click",
        () => {

          this.onComplete?.({
            score,
            correct,
            total,
            passed,
            answers: this.answers
          });
        }
      );
  }


  onComplete(callback) {
    this._callback = callback;
  }


  get onComplete() {
    return this._callback;
  }


  set onComplete(callback) {
    this._callback = callback;
  }


  escape(value = "") {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}


export default QuizUI;