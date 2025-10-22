import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzInfoActionsComponent } from './hz-info-actions.component';

describe('HzInfoActionsComponent', () => {
  let component: HzInfoActionsComponent;
  let fixture: ComponentFixture<HzInfoActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzInfoActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzInfoActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
