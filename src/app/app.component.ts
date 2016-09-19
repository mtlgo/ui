import { Component, OnInit, Inject } from '@angular/core';
import { SwarmService } from './swarm/swarm.service';
import { Observable }     from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Docker UI';
  nodes: Array<any>;
  services: Array<any>;
  tasks: Observable<Array<any>>;
  errorMessage : any;

  constructor(private swarmService : SwarmService,   @Inject('AppConfig') private appConfig:any) {
     // this.appConfig = config;
  }

  ngOnInit() { 
      this.swarmService.listNodes()
                   .subscribe(
                     nodes => this.nodes = nodes,
                     error => this.errorMessage = <any>error);
      this.swarmService.listServices()
                   .subscribe(
                     services => this.services = services,
                     error => this.errorMessage = <any>error);
     this.swarmService.listTasks()
                   .subscribe(
                     tasks => {console.log('getTasks',tasks);   this.services = tasks},
                     error => this.errorMessage = <any>error);
  }
}
