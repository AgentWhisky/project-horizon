import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamInsightManagementAppViewComponent } from './steam-insight-management-app-view.component';

describe('SteamInsightManagementAppViewComponent', () => {
  let component: SteamInsightManagementAppViewComponent;
  let fixture: ComponentFixture<SteamInsightManagementAppViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamInsightManagementAppViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SteamInsightManagementAppViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
