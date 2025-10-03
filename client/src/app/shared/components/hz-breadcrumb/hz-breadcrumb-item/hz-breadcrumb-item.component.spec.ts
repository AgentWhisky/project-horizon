import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzBreadcrumbItemComponent } from './hz-breadcrumb-item.component';

describe('HzBreadcrumbItemComponent', () => {
  let component: HzBreadcrumbItemComponent;
  let fixture: ComponentFixture<HzBreadcrumbItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzBreadcrumbItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzBreadcrumbItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
