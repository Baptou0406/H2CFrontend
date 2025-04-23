import { TestBed } from '@angular/core/testing';

import { ConsommableService } from './consommable.service';

describe('ConsommableService', () => {
  let service: ConsommableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsommableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
