import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimeTrackerComponent } from './time-tracker/time-tracker.component';
import { HeaderComponent } from './common/header/header.component';
import { ButtonComponent } from './common/button/button.component';
import { TrackerCardComponent } from './common/tracker-card/tracker-card.component';
import { ModalComponent } from './common/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    TimeTrackerComponent,
    HeaderComponent,
    ButtonComponent,
    TrackerCardComponent,
    ModalComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
