/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SwarmService } from './swarm.service';

describe('Service: SwarmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SwarmService]
    });
  });

  it('should ...', inject([SwarmService], (service: SwarmService) => {
    expect(service).toBeTruthy();
  }));
});
