import { TestBed } from '@angular/core/testing';

import { ClassesFirebaseService } from './classes-firebase.service';

describe('ClassesFirebaseService', () => {
  let service: ClassesFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassesFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
