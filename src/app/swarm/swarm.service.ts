import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import {Node} from '../swarm-vizualizer/models';
@Injectable()
export class SwarmService {
    nodes: Array<Node>;
  
  constructor(private http: Http) { }
  
  private apiPath = '/nodes';

  listNodes(): Promise<Array<Node>> {
      if(!this.nodes){
          this.nodes=[];
      }
      this.nodes.push(new Node());
      return Promise.resolve(this.nodes);
  }
}
