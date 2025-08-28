import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzBannerHeaderComponent } from './hz-banner-header.component';

describe('HzBannerHeaderComponent', () => {
  let component: HzBannerHeaderComponent;
  let fixture: ComponentFixture<HzBannerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzBannerHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzBannerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
