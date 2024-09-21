import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelClassComponent } from './cancel-class.component';

describe('CancelClassComponent', () => {
  let component: CancelClassComponent;
  let fixture: ComponentFixture<CancelClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelClassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
