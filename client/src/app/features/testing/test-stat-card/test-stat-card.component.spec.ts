import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStatCardComponent } from './test-stat-card.component';

describe('TestStatCardComponent', () => {
  let component: TestStatCardComponent;
  let fixture: ComponentFixture<TestStatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestStatCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestStatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
