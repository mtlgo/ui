import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import '../shared/lib/rx-operators.bundle';
import { Node, Service, Task } from '../swarm-vizualizer/models';
import Morphism from 'morphism';

@Injectable()
export class SwarmService {
  apiUrl: string;
  constructor(private http: Http, @Inject('AppConfig') private appConfig: any) {
    this.apiUrl = appConfig.apiUrl;
  }

  listNodes(): Observable<Node[]> {
    const path = `${this.apiUrl}/nodes`;
    return this.http.get(path).map(res => res.json());
  }

  listServices(): Observable<Service[]> {
    const path = `${this.apiUrl}/services`;
    return this.http.get(path).map(res => res.json());
  }

  listTasks(): Observable<Task[]> {
    const path = `${this.apiUrl}/tasks`;
    return this.http.get(path).map(res => res.json());
  }
}
