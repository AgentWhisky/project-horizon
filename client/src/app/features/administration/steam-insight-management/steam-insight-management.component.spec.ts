import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteamInsightManagementComponent } from './steam-insight-management.component';

describe('SteamInsightManagementComponent', () => {
  let component: SteamInsightManagementComponent;
  let fixture: ComponentFixture<SteamInsightManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamInsightManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SteamInsightManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
