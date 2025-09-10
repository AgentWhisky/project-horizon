import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzStatCardGroupComponent } from './hz-stat-card-group.component';

describe('HzStatCardGroupComponent', () => {
  let component: HzStatCardGroupComponent;
  let fixture: ComponentFixture<HzStatCardGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzStatCardGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzStatCardGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
