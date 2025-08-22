import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzTimelineMetaComponent } from './hz-timeline-meta.component';

describe('HzTimelineMetaComponent', () => {
  let component: HzTimelineMetaComponent;
  let fixture: ComponentFixture<HzTimelineMetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzTimelineMetaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzTimelineMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
