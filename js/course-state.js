/* =========================================================
   COURSE STATE
   ========================================================= */
import scorm from "./scorm.js";

const STORAGE_KEY =
    "northstar_backup_best_practices_state";

const DEFAULT_STATE = {
    currentStep: 0,

    completed: false,

    progress: {
        completedSteps: []
    },

    score: 0,

    finalScore: null,
    quizScore: 0,
    quizAnswers: {},
    passed: false,
    devices: {
        workstation: "normal"
    },
    interactions: {},

    assessment: {
        started: false,
        completed: false,
        score: 0,
        correct: 0,
        total: 0,
        passed: false,
        answers: {}
    },

    decisions: {},

    backup: {
        storageConnected: false,
        schedule: "manual",
        documents: false,
        desktop: false,
        downloads: false,
        lastBackup: null,
        backupCreated: false,
        restoreTested: false
    },

    reflection: "",

    metadata: {
        startedAt: null,
        lastUpdatedAt: null
    }
};

function deepClone(value) {
    return JSON.parse(
        JSON.stringify(value)
    );
}

class CourseState {
    constructor(scorm = null) {
        this.scorm = scorm;
        this._restored = false;

        this.data =
            deepClone(DEFAULT_STATE);

        this.load();
    }

    load() {
        let restored = false;

        try {
            const local =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (local) {
                this.data = this.merge(
                    DEFAULT_STATE,
                    JSON.parse(local)
                );

                restored = true;
            }
        } catch (error) {
            console.warn(
                "[STATE] Local state unavailable:",
                error
            );
        }

        if (!restored && this.scorm) {
            this.loadFromSCORM();
        }

        this._restored = restored || this.data.currentStep > 0 ||
            this.data.progress.completedSteps.length > 0;

        if (!this.data.metadata.startedAt) {
            this.data.metadata.startedAt =
                new Date().toISOString();
        }

        this.touch();
        this.save();
    }

    loadFromSCORM() {
        try {
            const raw =
                this.scorm.getSuspendData();

            if (!raw) {
                return;
            }

            const parsed =
                JSON.parse(raw);

            this.data = this.merge(
                DEFAULT_STATE,
                parsed
            );

            console.info(
                "[STATE] Restored from SCORM."
            );
        } catch (error) {
            console.warn(
                "[STATE] Invalid SCORM suspend data:",
                error
            );
        }
    }

    merge(base, override) {
        const output =
            deepClone(base);

        Object.keys(override || {})
            .forEach((key) => {
                if (
                    override[key] &&
                    typeof override[key] === "object" &&
                    !Array.isArray(
                        override[key]
                    )
                ) {
                    output[key] =
                        this.merge(
                            output[key] || {},
                            override[key]
                        );
                } else {
                    output[key] =
                        override[key];
                }
            });

        return output;
    }

    get(path) {
        return path
            .split(".")
            .reduce(
                (obj, key) =>
                    obj?.[key],
                this.data
            );
    }

    set(path, value) {
        const keys =
            path.split(".");

        let target =
            this.data;

        for (
            let i = 0;
            i < keys.length - 1;
            i += 1
        ) {
            if (
                !target[keys[i]] ||
                typeof target[keys[i]] !== "object"
            ) {
                target[keys[i]] = {};
            }

            target =
                target[keys[i]];
        }

        target[
            keys[keys.length - 1]
        ] = value;

        this.touch();
        this.save();
    }

    update(values = {}) {
        this.data =
            this.merge(
                this.data,
                values
            );

        this.touch();
        this.save();
    }

    completeStep(
        stepId,
        result = {}
    ) {
        const completed =
            this.data.progress
                .completedSteps;

        if (!completed.includes(stepId)) {
            completed.push(stepId);
        }

        this.data.decisions[stepId] =
            result;

        this.touch();
        this.save();
    }

    isStepComplete(stepId) {
        return this.data.progress
            .completedSteps
            .includes(stepId);
    }

    reset() {
        this.data =
            deepClone(DEFAULT_STATE);

        this.data.metadata.startedAt =
            new Date().toISOString();

        this.save();
    }

    touch() {
        this.data.metadata
            .lastUpdatedAt =
            new Date().toISOString();
    }

    save() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    this.data
                )
            );
        } catch (error) {
            console.warn(
                "[STATE] Local save failed:",
                error
            );
        }

        if (this.scorm) {
            try {
                this.scorm.setSuspendData(
                    JSON.stringify(
                        this.data
                    )
                );

                this.scorm.commit();
            } catch (error) {
                console.warn(
                    "[STATE] SCORM save failed:",
                    error
                );
            }
        }
    }

    getSnapshot() {
        return deepClone(
            this.data
        );
    }

    get currentStep() { return this.data.currentStep; }
    set currentStep(value) { this.data.currentStep = Number(value) || 0; }
    get devices() { return this.data.devices; }
    get finalScore() { return this.data.finalScore; }
    set finalScore(value) { this.data.finalScore = value; }
    get quizScore() { return this.data.quizScore; }
    set quizScore(value) { this.data.quizScore = Number(value) || 0; }
    get quizAnswers() { return this.data.quizAnswers; }
    get passed() { return this.data.passed; }
    set passed(value) { this.data.passed = Boolean(value); }

    loadResumable() {
        if (!this._restored && this.scorm) this.load();
        return this._restored;
    }

    markComplete(stepIndex) {
        const completed = this.data.progress.completedSteps;
        if (!completed.includes(stepIndex)) completed.push(stepIndex);
        this.data.currentStep = Number(stepIndex) + 1;
        if (this.data.currentStep >= 18) this.data.completed = true;
        this.touch();
        this.save();
    }

    recordDecision(id, choice, earned = 0, max = 0) {
        this.data.decisions[id] = { choice, earned, max };
        this.touch();
        this.save();
    }

    trackInteraction(id) {
        const record = this.data.interactions[id] || { count: 0 };
        record.count += 1;
        record.lastSeenAt = new Date().toISOString();
        this.data.interactions[id] = record;
        this.touch();
        this.save();
    }
}

const state = new CourseState(scorm);

export default CourseState;
export {
    CourseState,
    DEFAULT_STATE,
    state
};
