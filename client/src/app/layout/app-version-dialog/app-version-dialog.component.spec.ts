import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppVersionDialogComponent } from './app-version-dialog.component';

describe('AppVersionDialogComponent', () => {
  let component: AppVersionDialogComponent;
  let fixture: ComponentFixture<AppVersionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppVersionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppVersionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
