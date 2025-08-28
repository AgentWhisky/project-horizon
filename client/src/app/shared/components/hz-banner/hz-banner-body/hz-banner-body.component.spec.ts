import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzBannerBodyComponent } from './hz-banner-body.component';

describe('HzBannerBodyComponent', () => {
  let component: HzBannerBodyComponent;
  let fixture: ComponentFixture<HzBannerBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzBannerBodyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzBannerBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
