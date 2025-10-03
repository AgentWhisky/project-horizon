import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzBreadcrumbComponent } from './hz-breadcrumb.component';

describe('HzBreadcrumbComponent', () => {
  let component: HzBreadcrumbComponent;
  let fixture: ComponentFixture<HzBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzBreadcrumbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
