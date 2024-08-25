import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapyczComponent } from './mapycz.component';

describe('MapyczComponent', () => {
  let component: MapyczComponent;
  let fixture: ComponentFixture<MapyczComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapyczComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapyczComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
