import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewClassFormComponent } from './new-class-form.component';

describe('NewClassFormComponent', () => {
  let component: NewClassFormComponent;
  let fixture: ComponentFixture<NewClassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewClassFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewClassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
