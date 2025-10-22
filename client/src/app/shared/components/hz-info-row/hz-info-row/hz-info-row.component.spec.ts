import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzInfoRowComponent } from './hz-info-row.component';

describe('HzInfoRowComponent', () => {
  let component: HzInfoRowComponent;
  let fixture: ComponentFixture<HzInfoRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzInfoRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzInfoRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
