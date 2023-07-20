import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerCardComponent } from './tracker-card.component';

describe('TrackerCardComponent', () => {
  let component: TrackerCardComponent;
  let fixture: ComponentFixture<TrackerCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackerCardComponent]
    });
    fixture = TestBed.createComponent(TrackerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
