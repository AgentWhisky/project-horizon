import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamInsightDetailComponent } from './steam-insight-detail.component';

describe('SteamInsightDetailComponent', () => {
  let component: SteamInsightDetailComponent;
  let fixture: ComponentFixture<SteamInsightDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamInsightDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SteamInsightDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
