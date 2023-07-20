import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimeTrackerModel } from '../../constants/timeTracker.model';
@Component({
  selector: 'app-tracker-card',
  templateUrl: './tracker-card.component.html',
  styleUrls: ['./tracker-card.component.scss'],
})
export class TrackerCardComponent implements OnInit {
  @Input() trackerData: TimeTrackerModel.TimeTrackData[] = [];
  @Output() trackerUpdatedData: EventEmitter<TimeTrackerModel.TimeTrackData[]> =
    new EventEmitter();
  @Output() totalTimeSpend: EventEmitter<string> = new EventEmitter();
  startTime?: number;
  cardTimers: {
    activityPoints: { startTime: Date; stopTime?: Date }[];
    timerInterval?: any;
  }[] = [];

  constructor() {}

  ngOnInit(): void {}

  //Toggle Timer Button (Stop and Start)
  toggleTimer(cardItem: TimeTrackerModel.TimeTrackData, cardIndex: number) {
    this.trackerData.forEach(
      (cardData: TimeTrackerModel.TimeTrackData, i: number) => {
        if (cardData.taskId === cardItem.taskId) {
          if (cardData.isTimerRunning) {
            cardData.buttonTextLabel = 'Start';
            this.stopTimer(cardData, i);
          } else {
            cardData.buttonTextLabel = 'Stop';
            if (cardData.history.length > 0) { //Restrict the timer when again Start the timer
              cardData.history = [];
            }
            this.startTimer(cardData, i);
          }
        }
      }
    );
  }

  formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    return `${this.formatTimerData(hours)}:${this.formatTimerData(minutes)}:${this.formatTimerData(
      seconds
    )}`;
  }

  formatTimerData(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  //Start Timer
  startTimer(cardData: TimeTrackerModel.TimeTrackData, index: number) {
    // Check if a timer is already running for this card
    if (this.cardTimers[index]?.timerInterval) {
      clearInterval(this.cardTimers[index].timerInterval);
    }

    const startTime = new Date();
    cardData.isTimerRunning = true;
    this.cardTimers[index] = {
      activityPoints: [{ startTime }],
      timerInterval: setInterval(() => {
        const currentTime = new Date();
        // this.cardTimers[index].activityPoints[this.cardTimers[index].activityPoints.length - 1].stopTime = currentTime;
        cardData.timerDisplay = this.formatTime(
          currentTime.getTime() - startTime.getTime()
        );
      }, 1000),
    };
    this.generateHistoryMessage(cardData, index);
  }

  //Stop Timer
  stopTimer(cardData: TimeTrackerModel.TimeTrackData, index: number) {
    cardData.isTimerRunning = false;
    if (this.cardTimers[index]?.timerInterval) {
      clearInterval(this.cardTimers[index].timerInterval);
      this.cardTimers[index].timerInterval = undefined;
    }

    const currentTime = new Date();
    const activityPoints = this.cardTimers[index]?.activityPoints;

    if (activityPoints && activityPoints.length > 0) {
      const lastActivityPoint = activityPoints[activityPoints.length - 1];
      if (lastActivityPoint.stopTime === undefined) {
        lastActivityPoint.stopTime = currentTime;
      } else {
        this.cardTimers[index]?.activityPoints.push({ startTime: currentTime });
      }
    } else {
      this.cardTimers[index]?.activityPoints.push({ startTime: currentTime });
    }
    this.generateHistoryMessage(cardData, index);
  }

  //Generating History Messages
  generateHistoryMessage(
    cardData: TimeTrackerModel.TimeTrackData,
    index: number
  ) {
    const activityPoints = this.cardTimers[index]?.activityPoints;
    let message = '';
    if (cardData.isTimerRunning) {
      message +=
        'Started the timer at ' +
        activityPoints[0].startTime.toLocaleString() +
        ' (active)';
    } else {
      message +=
        'Started the timer at ' +
        activityPoints[0].startTime.toLocaleString() +
        ' & Stopped at ' +
        activityPoints[0].stopTime?.toLocaleString();
    }
    this.trackerData.map((item: TimeTrackerModel.TimeTrackData) => {
      if (item.taskId == cardData.taskId) {
        item.history.push(message);
      }
    });

    const totalTimePerActivity = this.calculateTotalTimeSpend();

    // Calculate the total sum of formattedDuration
    let totalSumInSeconds = 0;
    totalTimePerActivity.forEach((activity) => {
      if (activity && activity.durationInSeconds) {
        totalSumInSeconds += activity.durationInSeconds;
      }
    });

    // Convert the total sum to HH:mm:ss format
    const totalHours = Math.floor(totalSumInSeconds / 3600);
    const totalMinutes = Math.floor((totalSumInSeconds % 3600) / 60);
    const totalSeconds = Math.floor(totalSumInSeconds % 60);

    const totalFormattedDuration = `${totalHours
      .toString()
      .padStart(2, '0')}:${totalMinutes
      .toString()
      .padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
    this.totalTimeSpend.emit(totalFormattedDuration);
  }

  //Calculate Total time spend by each Task
  calculateTotalTimeSpend() {
    const now = new Date();
    return this.cardTimers.map((activity) => {
      if (activity.activityPoints && activity.activityPoints.length > 0) {
        const startTime: Date = new Date(activity.activityPoints[0].startTime);
        const stopTime: Date = activity.activityPoints[0].stopTime
          ? new Date(activity.activityPoints[0].stopTime)
          : now;

        const durationInMilliseconds = stopTime.getTime() - startTime.getTime();
        const durationInSeconds = durationInMilliseconds / 1000;

        // Convert durationInSeconds to HH:mm:ss format
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = Math.floor(durationInSeconds % 60);

        const formattedDuration = `${hours
          .toString()
          .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`;

        return {
          startTime: startTime.toISOString(),
          stopTime: stopTime.toISOString(),
          durationInSeconds: durationInSeconds,
          formattedDuration: formattedDuration,
        };
      } else {
        return null;
      }
    });
  }

  //Delete Particular Task
  deleteTracker(cardItem: TimeTrackerModel.TimeTrackData, cardIndex: number) {
    this.trackerData = this.trackerData.filter(
      (item: TimeTrackerModel.TimeTrackData) => item.taskId !== cardItem.taskId
    );
    this.trackerUpdatedData.emit(this.trackerData);
  }
}
