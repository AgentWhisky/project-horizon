import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzCardBodyComponent } from './hz-card-body.component';

describe('HzCardBodyComponent', () => {
  let component: HzCardBodyComponent;
  let fixture: ComponentFixture<HzCardBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzCardBodyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzCardBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
