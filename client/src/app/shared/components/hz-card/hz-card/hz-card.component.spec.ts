import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzCardComponent } from './hz-card.component';

describe('HzCardComponent', () => {
  let component: HzCardComponent;
  let fixture: ComponentFixture<HzCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
