import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../shared/lib/rx-operators.bundle';
import { Node, Service, Task } from '../swarm-vizualizer/models';

const Morphism = require('morphism');

@Injectable()
export class SwarmService {
    apiUrl: string;
    constructor(private http: Http, @Inject('AppConfig') private appConfig: any) {
        this.apiUrl = appConfig.apiUrl;

    }

    listNodes(): Observable<Node[]> {
        let path = `${this.apiUrl}/nodes`;
        return this.http.get(path).map<Node[]>(res => res.json());
    }

    listServices(): Observable<Service[]> {
        let path = `${this.apiUrl}/services`;
        return this.http.get(path).map<Service[]>(res => res.json());
    }

    listTasks(): Observable<any>{
        let path = `${this.apiUrl}/tasks`;
        return this.http.get(path).map(res => res.json());
    }
}
