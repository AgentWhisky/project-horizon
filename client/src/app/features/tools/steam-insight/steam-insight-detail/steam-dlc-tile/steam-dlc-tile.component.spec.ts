import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamDlcTileComponent } from './steam-dlc-tile.component';

describe('SteamDlcTileComponent', () => {
  let component: SteamDlcTileComponent;
  let fixture: ComponentFixture<SteamDlcTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamDlcTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SteamDlcTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
