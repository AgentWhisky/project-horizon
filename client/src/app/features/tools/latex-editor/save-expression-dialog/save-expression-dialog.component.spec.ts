import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveExpressionDialogComponent } from './save-expression-dialog.component';

describe('SaveExpressionDialogComponent', () => {
  let component: SaveExpressionDialogComponent;
  let fixture: ComponentFixture<SaveExpressionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveExpressionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveExpressionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
