import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HzCommandPaletteComponent } from './hz-command-palette.component';

describe('HzCommandPaletteComponent', () => {
  let component: HzCommandPaletteComponent;
  let fixture: ComponentFixture<HzCommandPaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HzCommandPaletteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HzCommandPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
