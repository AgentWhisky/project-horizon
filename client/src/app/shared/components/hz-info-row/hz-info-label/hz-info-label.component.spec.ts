import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzInfoLabelComponent } from './hz-info-label.component';

describe('HzInfoLabelComponent', () => {
  let component: HzInfoLabelComponent;
  let fixture: ComponentFixture<HzInfoLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzInfoLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzInfoLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
