import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzTimelineItemComponent } from './hz-timeline-item.component';

describe('HzTimelineItemComponent', () => {
  let component: HzTimelineItemComponent;
  let fixture: ComponentFixture<HzTimelineItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzTimelineItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzTimelineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
