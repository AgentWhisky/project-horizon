import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzTimelineBodyComponent } from './hz-timeline-body.component';

describe('HzTimelineBodyComponent', () => {
  let component: HzTimelineBodyComponent;
  let fixture: ComponentFixture<HzTimelineBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzTimelineBodyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzTimelineBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
