import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonTriggersComponent } from './button-triggers.component';

describe('ButtonTriggersComponent', () => {
  let component: ButtonTriggersComponent;
  let fixture: ComponentFixture<ButtonTriggersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonTriggersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonTriggersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
