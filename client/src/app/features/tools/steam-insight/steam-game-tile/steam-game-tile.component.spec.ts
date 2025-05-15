import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamGameTileComponent } from './steam-game-tile.component';

describe('SteamGameTileComponent', () => {
  let component: SteamGameTileComponent;
  let fixture: ComponentFixture<SteamGameTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamGameTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SteamGameTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
