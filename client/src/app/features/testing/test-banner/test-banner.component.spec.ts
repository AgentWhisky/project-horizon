import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBannerComponent } from './test-banner.component';

describe('TestBannerComponent', () => {
  let component: TestBannerComponent;
  let fixture: ComponentFixture<TestBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
