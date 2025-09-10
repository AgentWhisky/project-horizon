import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzStatCardValueComponent } from './hz-stat-card-value.component';

describe('HzStatCardValueComponent', () => {
  let component: HzStatCardValueComponent;
  let fixture: ComponentFixture<HzStatCardValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzStatCardValueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzStatCardValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
