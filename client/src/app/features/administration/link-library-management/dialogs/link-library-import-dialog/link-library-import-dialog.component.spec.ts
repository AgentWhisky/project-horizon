import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkLibraryImportDialogComponent } from './link-library-import-dialog.component';

describe('LinkLibraryImportDialogComponent', () => {
  let component: LinkLibraryImportDialogComponent;
  let fixture: ComponentFixture<LinkLibraryImportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkLibraryImportDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkLibraryImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
