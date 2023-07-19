import { TestBed } from '@angular/core/testing';

import { UsersRetrieveServiceService } from './users-retrieve-service.service';

describe('UsersRetrieveServiceService', () => {
  let service: UsersRetrieveServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersRetrieveServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
