export namespace TimeTrackerModel {
    export interface TimeTrackData {
        taskId: string,
        taskName: string,
        history: string[],
        historyEnable: boolean,
        timerDisplay: string,
        buttonTextLabel: string,
        isTimerRunning: boolean,
    }
}