/* =========================================================
   QUIZ ENGINE
   ========================================================= */

class QuizEngine {
    constructor({
        state,
        scoring,
        scorm
    }) {
        this.state = state;
        this.scoring = scoring;
        this.scorm = scorm;

        this.questions = [];
        this.currentIndex = 0;
        this.answers = {};
        this.started = false;
    }

    load(questions = []) {
        this.questions =
            Array.isArray(questions)
                ? questions
                : [];

        this.currentIndex = 0;

        this.answers = {};

        this.started = false;
    }

    start() {
        this.started = true;

        this.state.set(
            "assessment.started",
            true
        );

        this.scorm?.recordInteraction({
            id: "assessment_started",
            type: "other",
            response: "started",
            result: "neutral"
        });
    }

    getCurrentQuestion() {
        return (
            this.questions[
                this.currentIndex
            ] || null
        );
    }

    getQuestionCount() {
        return this.questions.length;
    }

    getCurrentIndex() {
        return this.currentIndex;
    }

    answer(
        questionId,
        value
    ) {
        const question =
            this.questions.find(
                (item) =>
                    item.id === questionId
            );

        if (!question) {
            return false;
        }

        this.answers[
            questionId
        ] = value;

        return true;
    }

    next() {
        if (
            this.currentIndex <
            this.questions.length - 1
        ) {
            this.currentIndex += 1;
            return true;
        }

        return false;
    }

    previous() {
        if (this.currentIndex > 0) {
            this.currentIndex -= 1;
            return true;
        }

        return false;
    }

    isComplete() {
        return (
            this.questions.length > 0 &&
            this.questions.every(
                (question) =>
                    this.answers[
                        question.id
                    ] !== undefined
            )
        );
    }

    checkQuestion(question) {
        const supplied =
            this.answers[
                question.id
            ];

        const correct =
            question.correctAnswer ??
            question.correctValues;

        if (Array.isArray(correct)) {
            const learner =
                Array.isArray(supplied)
                    ? [...supplied].sort()
                    : [supplied];

            const expected =
                [...correct].sort();

            return (
                JSON.stringify(
                    learner
                ) ===
                JSON.stringify(
                    expected
                )
            );
        }

        return (
            supplied === correct
        );
    }

    finish() {
        let correct = 0;

        for (const question of this.questions) {
            if (
                this.checkQuestion(
                    question
                )
            ) {
                correct += 1;
            }

            this.scorm?.recordInteraction({
                id: question.id,
                type: "choice",
                response: JSON.stringify(
                    this.answers[
                        question.id
                    ]
                ),
                result: this.checkQuestion(
                    question
                )
                    ? "correct"
                    : "wrong"
            });
        }

        const total =
            this.questions.length;

        const score =
            this.scoring.calculateQuizScore(
                correct,
                total
            );

        const passed =
            this.scoring.isPassing(
                score,
                80
            );

        const result = {
            score,
            correct,
            total,
            passed,
            answers: {
                ...this.answers
            }
        };

        this.scoring.recordQuizResult(
            result
        );

        this.scorm?.recordInteraction({
            id: "assessment_complete",
            type: "other",
            response: String(score),
            result: passed
                ? "correct"
                : "wrong"
        });

        return result;
    }
}

export default QuizEngine;
export { QuizEngine };