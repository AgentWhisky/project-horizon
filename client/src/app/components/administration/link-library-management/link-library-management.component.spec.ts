import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkLibraryManagementComponent } from './link-library-management.component';

describe('LinkLibraryManagementComponent', () => {
  let component: LinkLibraryManagementComponent;
  let fixture: ComponentFixture<LinkLibraryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkLibraryManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkLibraryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
