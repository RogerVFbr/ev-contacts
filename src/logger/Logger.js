export class Logger {

    constructor(user, opType) {
        this.user = user;
        this.opType = opType;
    }

    getLog() {
        var logs = JSON.parse(localStorage.getItem("logger") || "[]");
        return logs;
    }

    log(message) {
        var today = new Date();
        var date = today.getDate() + ' / '+(today.getMonth()+1) + ' / '+today.getFullYear()
            + " - " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var log = {
            time: date,
            name: this.user,
            type: this.opType,
            message: message
        }

        var logs = JSON.parse(localStorage.getItem("logger") || "[]");
        logs.unshift(log);
        localStorage.setItem("logger", JSON.stringify(logs));
    }

    clearLog() {
        localStorage.setItem("logger", JSON.stringify([]));
    }
}