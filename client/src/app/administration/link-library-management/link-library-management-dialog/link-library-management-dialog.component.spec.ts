import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkLibraryManagementDialogComponent } from './link-library-management-dialog.component';

describe('LinkLibraryManagementDialogComponent', () => {
  let component: LinkLibraryManagementDialogComponent;
  let fixture: ComponentFixture<LinkLibraryManagementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkLibraryManagementDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkLibraryManagementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
