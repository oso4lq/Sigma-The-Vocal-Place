import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagcloudComponent } from './tagcloud.component';

describe('TagcloudComponent', () => {
  let component: TagcloudComponent;
  let fixture: ComponentFixture<TagcloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagcloudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagcloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
