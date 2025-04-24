import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseConvertConversionDialogComponent } from './base-convert-conversion-dialog.component';

describe('BaseConvertConversionDialogComponent', () => {
  let component: BaseConvertConversionDialogComponent;
  let fixture: ComponentFixture<BaseConvertConversionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseConvertConversionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseConvertConversionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
