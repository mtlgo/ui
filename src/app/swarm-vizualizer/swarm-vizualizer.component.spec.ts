/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { SwarmVizualizerComponent } from './swarm-vizualizer.component';

describe('Component: SwarmVizualizer', () => {
  it('should create an instance', () => {
    let component = new SwarmVizualizerComponent();
    expect(component).toBeTruthy();
  });
});


   function generateData() {

        let nodeFactory = (index) => {
            let node = new Node();
            let data = {
                id: index,
                hostName: `host-${index}`,
                isManager: index === 0
            };
            return _.assign(node, data);
        };
        let taskFactory = (index, node: Node) => {
            let task = new Task();
            let data = {
                id: index,
                name: `task-${index}`,
                node: node,
                stats: {
                    cpu: Math.random() * 100
                },
                service: _.assign(new Service(), { name: this.services[index % this.services.length] })
            };
            return _.assign(task, data);
        };


        this.nodes = _.range(this.numberOfNodes).map((i) => { return nodeFactory(i); });
        this.tasks = _.range(this.numberOfTasks).map((i) => {
            let node = this.nodes[_.random(this.nodes.length - 1)];
            return taskFactory(i, node);
        });

    }