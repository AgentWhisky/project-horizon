import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamInsightComponent } from './steam-insight.component';

describe('SteamInsightComponent', () => {
  let component: SteamInsightComponent;
  let fixture: ComponentFixture<SteamInsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamInsightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SteamInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
