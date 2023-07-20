import { Component, OnInit } from '@angular/core';
import { timeTrackerData } from '../constants/mockApi';
import { TimeTrackerModel } from '../constants/timeTracker.model';

@Component({
  selector: 'app-time-tracker',
  templateUrl: './time-tracker.component.html',
  styleUrls: ['./time-tracker.component.scss'],
})
export class TimeTrackerComponent implements OnInit {
  modalOpen: boolean = false;
  disableModalClose: boolean = true;
  buttonLabel: string = 'Save';
  allTimeTrackData: TimeTrackerModel.TimeTrackData[] = [];
  searchDetails: TimeTrackerModel.TimeTrackData[] = [];
  disableBtn: boolean = true;
  totalTimeSpend: string = '00:00:00';
  inputValue: string = '';

  ngOnInit(): void {
    this.allTimeTrackData = timeTrackerData;
    this.searchDetails = timeTrackerData;
  }

  // Add New Task 
  saveTrackerTask() {
    if (this.inputValue) {
      this.allTimeTrackData.push({
        taskId: this.generateRandomTaskId(),
        taskName: this.inputValue.trim(),
        history: [],
        historyEnable: true,
        timerDisplay: '00:00:00',
        buttonTextLabel: 'Start',
        isTimerRunning: false,
      });
      this.closeModal();
    }
  }

  // Genrate Random Task Id
  generateRandomTaskId(): string {
    const timestamp = Date.now().toString(36) + 2; // Convert current timestamp to base36 string
    const randomNum = Math.floor(Math.random() * 10000).toString(36); // Generate a random number and convert it to base36 string
    return `${timestamp}-${randomNum}`;
  }

  //Open Modal
  openModal() {
    this.inputValue = '';
    this.disableBtn = true;
    this.modalOpen = true;
  }

  //Close Modal
  closeModal() {
    this.modalOpen = false;
    this.inputValue = '';
    this.disableBtn = false;
  }

  //Get Total Spend Time
  getTotalTimeSpend(timeSpend: string) {
    this.totalTimeSpend = timeSpend;
  }

  //Search Task By Task Name
  searchTimeTracker(event: Event): void {
    let searchValue = (event.target as HTMLInputElement).value.trim();
    this.allTimeTrackData = this.searchDetails.filter((searchData: any) => {
      return (
        searchData.taskName &&
        searchData.taskName
          .toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
    });
  }

  getAllTimeTrackerData(timerData: TimeTrackerModel.TimeTrackData[]) {
    this.allTimeTrackData = timerData;
    this.searchDetails = timerData;
  }

  enterInputValues(event: Event): void {
    let storeTrackerTitle = (event.target as HTMLInputElement).value.trim();
    this.disableBtn = storeTrackerTitle.length > 0 ? false : true;
  }
}
