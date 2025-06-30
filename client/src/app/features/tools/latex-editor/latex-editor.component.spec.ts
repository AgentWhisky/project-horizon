import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatexEditorComponent } from './latex-editor.component';

describe('LatexEditorComponent', () => {
  let component: LatexEditorComponent;
  let fixture: ComponentFixture<LatexEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatexEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatexEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
