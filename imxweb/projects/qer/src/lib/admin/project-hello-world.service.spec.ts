import { TestBed } from '@angular/core/testing';

import { ProjectHelloWorldService } from './project-hello-world.service';

describe('ProjectHelloWorldService', () => {
  let service: ProjectHelloWorldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectHelloWorldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
