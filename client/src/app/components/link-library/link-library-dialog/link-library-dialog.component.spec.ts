import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkLibraryDialogComponent } from './link-library-dialog.component';

describe('LinkLibraryDialogComponent', () => {
  let component: LinkLibraryDialogComponent;
  let fixture: ComponentFixture<LinkLibraryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkLibraryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkLibraryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
