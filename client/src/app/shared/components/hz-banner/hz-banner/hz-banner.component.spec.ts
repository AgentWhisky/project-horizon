import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzBannerComponent } from './hz-banner.component';

describe('HzBannerComponent', () => {
  let component: HzBannerComponent;
  let fixture: ComponentFixture<HzBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
