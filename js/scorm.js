/* =========================================================
   SCORM 1.2 ADAPTER
   ========================================================= */

class ScormAPI {
    constructor() {
        this.api = null;
        this.initialized = false;
        this.connected = false;
    }

    get mode() {
        return this.connected ? "SCORM 1.2" : "Standalone";
    }

    init() {
        return this.initialize();
    }

    findAPI(win) {
        let attempts = 0;

        while (
            win &&
            !win.API &&
            win.parent &&
            win.parent !== win &&
            attempts < 20
        ) {
            attempts += 1;
            win = win.parent;
        }

        return win?.API || null;
    }

    initialize() {
        if (this.initialized) {
            return true;
        }

        try {
            this.api = this.findAPI(window);

            if (!this.api) {
                console.info(
                    "[SCORM] LMS API not found. Running standalone."
                );

                this.initialized = true;
                this.connected = false;

                return true;
            }

            const result = this.api.LMSInitialize("");

            this.connected = result === "true";
            this.initialized = true;

            if (this.connected) {
                console.info("[SCORM] Connected to LMS.");
            }

            return this.connected;
        } catch (error) {
            console.warn(
                "[SCORM] Initialization failed:",
                error
            );

            this.initialized = true;
            this.connected = false;

            return false;
        }
    }

    getValue(element) {
        if (!this.connected) {
            return "";
        }

        try {
            return this.api.LMSGetValue(element);
        } catch (error) {
            console.warn(
                `[SCORM] LMSGetValue failed: ${element}`,
                error
            );

            return "";
        }
    }

    setValue(element, value) {
        if (!this.connected) {
            return false;
        }

        try {
            return (
                this.api.LMSSetValue(
                    element,
                    String(value)
                ) === "true"
            );
        } catch (error) {
            console.warn(
                `[SCORM] LMSSetValue failed: ${element}`,
                error
            );

            return false;
        }
    }

    commit() {
        if (!this.connected) {
            return true;
        }

        try {
            return (
                this.api.LMSCommit("") === "true"
            );
        } catch (error) {
            console.warn(
                "[SCORM] Commit failed:",
                error
            );

            return false;
        }
    }

    getSuspendData() {
        return this.getValue(
            "cmi.suspend_data"
        );
    }

    setSuspendData(data) {
        return this.setValue(
            "cmi.suspend_data",
            data
        );
    }

    recordInteraction(interaction, response = "", result = "neutral") {
        if (!this.connected) {
            return;
        }

        const { id, type = "other", response: answer = response,
            result: outcome = result } = typeof interaction === "object"
            ? interaction
            : { id: interaction };

        try {
            const count = Number(
                this.getValue(
                    "cmi.interactions._count"
                )
            ) || 0;

            this.setValue(
                `cmi.interactions.${count}.id`,
                id
            );

            this.setValue(
                `cmi.interactions.${count}.type`,
                type
            );

            this.setValue(
                `cmi.interactions.${count}.student_response`,
                answer
            );

            this.setValue(
                `cmi.interactions.${count}.result`,
                outcome
            );

            this.setValue(
                `cmi.interactions.${count}.time`,
                this.getTime()
            );
        } catch (error) {
            console.warn(
                "[SCORM] Interaction recording failed:",
                error
            );
        }
    }

    setScore(score, max = 100, min = 0) {
        this.setValue(
            "cmi.core.score.raw",
            score
        );

        this.setValue(
            "cmi.core.score.max",
            max
        );

        this.setValue(
            "cmi.core.score.min",
            min
        );
    }

    setLessonStatus(status) {
        this.setValue(
            "cmi.core.lesson_status",
            status
        );
    }

    complete({
        score = 0,
        passed = score >= 80
    } = {}) {
        this.setScore(score);

        this.setLessonStatus(
            passed ? "passed" : "completed"
        );

        this.commit();
    }

    suspend() {
        this.setLessonStatus("incomplete");
        this.commit();
    }

    getTime() {
        const now = new Date();

        return [
            String(now.getHours()).padStart(2, "0"),
            String(now.getMinutes()).padStart(2, "0"),
            String(now.getSeconds()).padStart(2, "0")
        ].join(":");
    }

    terminate() {
        if (!this.initialized || !this.connected) {
            return true;
        }

        try {
            this.commit();

            const result =
                this.api.LMSFinish("");

            this.connected = false;

            return result === "true";
        } catch (error) {
            console.warn(
                "[SCORM] LMSFinish failed:",
                error
            );

            return false;
        }
    }
}

const scorm = new ScormAPI();

export default scorm;
export { ScormAPI, scorm };
