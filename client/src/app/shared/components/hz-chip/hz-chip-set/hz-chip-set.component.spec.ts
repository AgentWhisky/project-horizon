import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzChipSetComponent } from './hz-chip-set.component';

describe('HzChipSetComponent', () => {
  let component: HzChipSetComponent;
  let fixture: ComponentFixture<HzChipSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzChipSetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzChipSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
