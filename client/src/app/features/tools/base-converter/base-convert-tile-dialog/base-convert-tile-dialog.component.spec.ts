import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseConvertTileDialogComponent } from './base-convert-tile-dialog.component';

describe('BaseConvertTileDialogComponent', () => {
  let component: BaseConvertTileDialogComponent;
  let fixture: ComponentFixture<BaseConvertTileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseConvertTileDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseConvertTileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
