import { Component, OnInit, Inject } from '@angular/core';
import { SwarmService } from './swarm/swarm.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Docker UI';
    nodes: Array<any>;
    services: Array<any>;
    tasks: any;
    errorMessage: any;

    constructor(private swarmService: SwarmService, @Inject('AppConfig') private appConfig: any) {
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
            tasks => { this.tasks = tasks; },
            error => this.errorMessage = <any>error);
    }

    // generateData() {
    //     let numberOfTasks: number = 50;
    //     let numberOfNodes: number = 3;

    //     let nodeFactory = (index) => {
    //         let node = new Node();
    //         let data = {
    //             id: index,
    //             hostName: `host-${index}`,
    //             isManager: index === 0
    //         };
    //         return _.assign(node, data);
    //     };
    //     let taskFactory = (index, node: Node) => {
    //         let task = new Task();
    //         let data = {
    //             id: index,
    //             name: `task-${index}`,
    //             node: node,
    //             stats: {
    //                 cpu: Math.random() * 100
    //             },
    //             service: _.assign(new Service(), { name: this.services[index % this.services.length] })
    //         };
    //         return _.assign(task, data);
    //     };


    //     this.nodes = _.range(numberOfNodes).map((i) => { return nodeFactory(i); });
    //     this.tasks = _.range(numberOfTasks).map((i) => {
    //         let node = this.nodes[_.random(this.nodes.length - 1)];
    //         return taskFactory(i, node);
    //     });

    // }
}
