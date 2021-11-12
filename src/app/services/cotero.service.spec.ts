import { TestBed } from '@angular/core/testing';

import { CoteroService } from './cotero.service';

describe('CoteroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoteroService = TestBed.get(CoteroService);
    expect(service).toBeTruthy();
  });
});
