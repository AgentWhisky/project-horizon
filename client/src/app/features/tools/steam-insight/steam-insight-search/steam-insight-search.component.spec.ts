import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamInsightSearchComponent } from './steam-insight-search.component';

describe('SteamInsightSearchComponent', () => {
  let component: SteamInsightSearchComponent;
  let fixture: ComponentFixture<SteamInsightSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamInsightSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SteamInsightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
