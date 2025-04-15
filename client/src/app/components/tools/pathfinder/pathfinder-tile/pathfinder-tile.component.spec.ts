import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathfinderTileComponent } from './pathfinder-tile.component';

describe('PathfinderTileComponent', () => {
  let component: PathfinderTileComponent;
  let fixture: ComponentFixture<PathfinderTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathfinderTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathfinderTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
