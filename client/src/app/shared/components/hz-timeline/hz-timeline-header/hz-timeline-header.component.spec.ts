import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzTimelineHeaderComponent } from './hz-timeline-header.component';

describe('HzTimelineHeaderComponent', () => {
  let component: HzTimelineHeaderComponent;
  let fixture: ComponentFixture<HzTimelineHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzTimelineHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzTimelineHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
