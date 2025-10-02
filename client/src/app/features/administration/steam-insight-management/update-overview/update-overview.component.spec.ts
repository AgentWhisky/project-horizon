import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOverviewComponent } from './update-overview.component';

describe('UpdateOverviewComponent', () => {
  let component: UpdateOverviewComponent;
  let fixture: ComponentFixture<UpdateOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
