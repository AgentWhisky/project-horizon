import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseConvertTileComponent } from './base-convert-tile.component';

describe('BaseConvertTileComponent', () => {
  let component: BaseConvertTileComponent;
  let fixture: ComponentFixture<BaseConvertTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseConvertTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseConvertTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
