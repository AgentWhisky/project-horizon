import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzImageViewDialogComponent } from './hz-image-view-dialog.component';

describe('HzImageViewDialogComponent', () => {
  let component: HzImageViewDialogComponent;
  let fixture: ComponentFixture<HzImageViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzImageViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzImageViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
