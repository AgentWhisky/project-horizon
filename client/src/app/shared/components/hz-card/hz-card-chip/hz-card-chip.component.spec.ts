import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzCardChipComponent } from './hz-card-chip.component';

describe('HzCardChipComponent', () => {
  let component: HzCardChipComponent;
  let fixture: ComponentFixture<HzCardChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzCardChipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzCardChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
