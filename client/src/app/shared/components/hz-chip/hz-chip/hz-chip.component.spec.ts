import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzChipComponent } from './hz-chip.component';

describe('HzChipComponent', () => {
  let component: HzChipComponent;
  let fixture: ComponentFixture<HzChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzChipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
