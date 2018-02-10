/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { SwarmVizualizerComponent } from './swarm-vizualizer.component';
import { ElementRef } from '@angular/core';

class MockElementRef implements ElementRef {
  nativeElement = {};
}

describe('Component: SwarmVizualizer', () => {
  it('should create an instance', () => {
    let component = new SwarmVizualizerComponent(new MockElementRef());
    expect(component).toBeTruthy();
  });
});
