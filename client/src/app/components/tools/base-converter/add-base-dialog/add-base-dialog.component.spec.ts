import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBaseDialogComponent } from './add-base-dialog.component';

describe('AddBaseDialogComponent', () => {
  let component: AddBaseDialogComponent;
  let fixture: ComponentFixture<AddBaseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBaseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
