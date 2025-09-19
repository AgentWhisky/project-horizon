import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamInsightUpdateHistoryDialogComponent } from './steam-insight-update-history-dialog.component';

describe('SteamInsightUpdateHistoryDialogComponent', () => {
  let component: SteamInsightUpdateHistoryDialogComponent;
  let fixture: ComponentFixture<SteamInsightUpdateHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamInsightUpdateHistoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SteamInsightUpdateHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
