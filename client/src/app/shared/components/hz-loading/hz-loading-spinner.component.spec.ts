import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzLoadingSpinnerComponent } from './hz-loading-spinner.component';

describe('HzLoadingSpinnerComponent', () => {
  let component: HzLoadingSpinnerComponent;
  let fixture: ComponentFixture<HzLoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzLoadingSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HzLoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
