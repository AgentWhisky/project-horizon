import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkTagDialogComponent } from './link-tag-dialog.component';

describe('LinkTagDialogComponent', () => {
  let component: LinkTagDialogComponent;
  let fixture: ComponentFixture<LinkTagDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkTagDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkTagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
