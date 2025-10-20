import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzInfoValueComponent } from './hz-info-value.component';

describe('HzInfoValueComponent', () => {
  let component: HzInfoValueComponent;
  let fixture: ComponentFixture<HzInfoValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzInfoValueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzInfoValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
