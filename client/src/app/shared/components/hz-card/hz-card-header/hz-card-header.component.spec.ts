import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzCardHeaderComponent } from './hz-card-header.component';

describe('HzCardHeaderComponent', () => {
  let component: HzCardHeaderComponent;
  let fixture: ComponentFixture<HzCardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzCardHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzCardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
