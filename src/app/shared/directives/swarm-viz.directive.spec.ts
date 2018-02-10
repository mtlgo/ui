/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { SwarmVizDirective } from './swarm-viz.directive';
import { Renderer, ElementRef } from '@angular/core';
import { RenderDebugInfo } from '@angular/core/src/render/api';

class MockElementRef implements ElementRef {
  nativeElement = {};
}

class MockRenderer extends Renderer {
  selectRootElement(selectorOrNode: any, debugInfo?: RenderDebugInfo) {
    throw new Error("Method not implemented.");
  }
  createElement(parentElement: any, name: string, debugInfo?: RenderDebugInfo) {
    throw new Error("Method not implemented.");
  }
  createViewRoot(hostElement: any) {
    throw new Error("Method not implemented.");
  }
  createTemplateAnchor(parentElement: any, debugInfo?: RenderDebugInfo) {
    throw new Error("Method not implemented.");
  }
  createText(parentElement: any, value: string, debugInfo?: RenderDebugInfo) {
    throw new Error("Method not implemented.");
  }
  projectNodes(parentElement: any, nodes: any[]): void {
    throw new Error("Method not implemented.");
  }
  attachViewAfter(node: any, viewRootNodes: any[]): void {
    throw new Error("Method not implemented.");
  }
  detachView(viewRootNodes: any[]): void {
    throw new Error("Method not implemented.");
  }
  destroyView(hostElement: any, viewAllNodes: any[]): void {
    throw new Error("Method not implemented.");
  }
  listen(renderElement: any, name: string, callback: Function): Function {
    throw new Error("Method not implemented.");
  }
  listenGlobal(target: string, name: string, callback: Function): Function {
    throw new Error("Method not implemented.");
  }
  setElementProperty(renderElement: any, propertyName: string, propertyValue: any): void {
    throw new Error("Method not implemented.");
  }
  setElementAttribute(renderElement: any, attributeName: string, attributeValue: string): void {
    throw new Error("Method not implemented.");
  }
  setBindingDebugInfo(renderElement: any, propertyName: string, propertyValue: string): void {
    throw new Error("Method not implemented.");
  }
  setElementClass(renderElement: any, className: string, isAdd: boolean): void {
    throw new Error("Method not implemented.");
  }
  setElementStyle(renderElement: any, styleName: string, styleValue: string): void {
    throw new Error("Method not implemented.");
  }
  invokeElementMethod(renderElement: any, methodName: string, args?: any[]): void {
    throw new Error("Method not implemented.");
  }
  setText(renderNode: any, text: string): void {
    throw new Error("Method not implemented.");
  }
  animate(element: any, startingStyles: any, keyframes: any[], duration: number, delay: number, easing: string, previousPlayers?: any[]) {
    throw new Error("Method not implemented.");
  }
}


describe('Directive: SwarmViz', () => {
  it('should create an instance', () => {
    let directive = new SwarmVizDirective(new MockElementRef(), new MockRenderer());
    expect(directive).toBeTruthy();
  });
});
