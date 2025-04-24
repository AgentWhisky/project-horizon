import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathfinderCreateDialogComponent } from './pathfinder-create-dialog.component';

describe('PathfinderCreateDialogComponent', () => {
  let component: PathfinderCreateDialogComponent;
  let fixture: ComponentFixture<PathfinderCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathfinderCreateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathfinderCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
