import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCategoryDialogComponent } from './link-category-dialog.component';

describe('LinkCategoryDialogComponent', () => {
  let component: LinkCategoryDialogComponent;
  let fixture: ComponentFixture<LinkCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkCategoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
