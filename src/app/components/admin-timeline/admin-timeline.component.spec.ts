import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTimelineComponent } from './admin-timeline.component';

describe('AdminTimelineComponent', () => {
  let component: AdminTimelineComponent;
  let fixture: ComponentFixture<AdminTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
