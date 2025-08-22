import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzTimelineComponent } from './hz-timeline.component';

describe('HzTimelineComponent', () => {
  let component: HzTimelineComponent;
  let fixture: ComponentFixture<HzTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
