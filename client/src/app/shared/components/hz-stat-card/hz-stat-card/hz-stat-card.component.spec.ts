import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzStatCardComponent } from './hz-stat-card.component';

describe('HzStatCardComponent', () => {
  let component: HzStatCardComponent;
  let fixture: ComponentFixture<HzStatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzStatCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzStatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
