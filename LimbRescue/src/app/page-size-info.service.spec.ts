import { TestBed } from '@angular/core/testing';

import { PageSizeInfoService } from './page-size-info.service';

describe('PageSizeInfoService', () => {
  let service: PageSizeInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageSizeInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
