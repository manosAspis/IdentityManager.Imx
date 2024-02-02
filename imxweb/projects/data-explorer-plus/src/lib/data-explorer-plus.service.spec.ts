import { TestBed } from '@angular/core/testing';

import { DataExplorerPlusService } from './data-explorer-plus.service';

describe('DataExplorerPlusService', () => {
  let service: DataExplorerPlusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataExplorerPlusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
