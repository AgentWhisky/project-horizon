import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzStatCardTitleComponent } from './hz-stat-card-title.component';

describe('HzStatCardTitleComponent', () => {
  let component: HzStatCardTitleComponent;
  let fixture: ComponentFixture<HzStatCardTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzStatCardTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzStatCardTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
