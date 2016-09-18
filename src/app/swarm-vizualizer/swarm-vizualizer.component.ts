import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
const textures = require('textures');
import * as d3 from '../shared/lib/custom-bundled-d3';
import * as _ from 'lodash';
import { Task, Node , Service} from './models';

@Component({
    selector: 'app-swarm-vizualizer',
    templateUrl: './swarm-vizualizer.component.html',
    styleUrls: ['./swarm-vizualizer.component.scss']
})
export class SwarmVizualizerComponent implements OnInit {
    width: number = 1000;
    height: number = 1000;
    padding: number = 1.5; // separation between same-color nodes
    clusterPadding: number = 6; // separation between different-color nodes
    maxRadius: number = 450;


    numberOfTasks: number = 50;
    numberOfNodes: number = 3;

    tasks: Task[];
    nodes: Node[];
    services: Array<string> = ['nginx', 'redis', 'node', 'alpine'];
    rootWorkspace: any;
    rootNode: any;

    // Colors for hosts ([0] for managers and [1] for nodes)
    nodesColors: Array<string> = ['#38AFB2', '#658AAB'];
    taskColor: string = '#FFF';

    constructor(private el: ElementRef) { }

    ngOnInit() {
        this.generateData();
        this.structureDataAndPack();
    }

    generateData() {

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
                service: _.assign(new Service(), { name: this.services[index % this.services.length]})
            };
            return _.assign(task, data);
        };


        this.nodes = _.range(this.numberOfNodes).map((i) => { return nodeFactory(i); });
        this.tasks = _.range(this.numberOfTasks).map((i) => {
            let node = this.nodes[_.random(this.nodes.length - 1)];
            return taskFactory(i, node);
        });

    }

    colorizeNode() {
        return d3.scaleOrdinal(this.nodesColors);
    }
    structureDataAndPack() {
        let structure = (t: Task[]) => {
            return _.reduce(t, (hierarchy, task, key) => {
                let existingNode = _.find(hierarchy, ['id', task.node.id]);
                if (existingNode) {
                    existingNode.children.push(task);
                } else {
                    hierarchy.push(_.assign(task.node, {children: [task]}) );
                }
                return hierarchy;
            }, []);
        };
        console.log('nodes', this.nodes);
        console.log('tasks', this.tasks);

        let complex = structure(this.tasks);
        console.log('SwarmVizDirective:structureDataAndPack: complex', complex);

        let nComplex = _.map(complex, (node) => {
            let tasksIndexedByServiceName = _.groupBy(node.children, 'service.name');
            let nodeChildren = _.transform(tasksIndexedByServiceName, function(result, value: any, key) {
               result.push(_.assign(value[0].service, {children: value}));
            }, []);
            node.children = nodeChildren;
            return node;
        });
        console.log('newStructure', nComplex);

        let pack = d3.pack()
            .size([900, 900])
            .padding(30);

        _.each(nComplex, (node, i) => {
            let root = d3.hierarchy(node)
                .sum((o: any) => { return o instanceof Task ?  o.stats.cpu : o.children.length; });
            pack(root);
            console.log('SwarmVizDirective:structureDataAndPack: root', root);

            let nodeTile = d3.select(this.el.nativeElement).select('.tile.is-ancestor>.tile')
                                    .append('div')
                                        .attr('class', 'node-container tile is-child');
                            nodeTile.append('h2')
                                        .attr('class', 'title is-2 has-text-centered')
                                        .text(node.hostName);


                      let nodePlaceHolder = nodeTile.append('svg')
                                        .attr('viewBox', `0 0 ${this.width} ${this.height}`)
                                        .style('width', '100%')
                                        .style('height', '100%')
                                        .attr('preserveAspectRatio', 'xMinYMin meet');
            let nodeGroup = nodePlaceHolder.append('g')
                                        .attr('transform', (d) => { return 'translate(50,50)'; })
                                        .attr('class', node.hostName);

            let circles = nodeGroup.selectAll('g')
                                .data<any>(root.descendants())
                                    .enter().append('g')
                                    .attr('transform',  (d) => { return 'translate(' + d.x + ',' + d.y + ')'; });



            console.log('SwarmVizDirective:structureDataAndPack', circles);
            circles.append('circle')
                .attr('id', function (d) { return d.data.name; })
                .attr('r', function (d) { return d.r; });

        // Style containers
        let texturize = (svg) => {
           let t = textures.lines()
                        .stroke(this.taskColor)
                        .thicker();
            svg.call(t);
            return t.url();
        };
            circles
                .filter((d) => {return d.depth === 2; })
                    //.style('fill', d => texturize(nodePlaceHolder))
                    .style('fill', (d) => { console.log(d); return this.colorizeContainer(d.data.service);})
                    .append('title')
                    .text(function(d) { return `${d.data.name}- cpu: ${Math.floor(d.data.stats.cpu)}%`; });


        // Style services packs
            //  let colorizeService = (service) => {
            //         return d3.scaleOrdinal(d3.schemeCategory20).domain(this.services)(service.name);
            // };
            circles
                .filter((d) => {return d.depth === 1; })
                    .style('fill', d => { return this.getServicePackColor(d.data); })
                    .style('opacity', 0.5)
                    .append('title')
                    .text(function(d) { return `${d.data.name}`; });

        // Style Host nodes
            let colorizeNode = (host) => {
                return d3.scaleOrdinal(this.nodesColors).domain(['manager', 'node'])( host.isManager ? 'manager' : 'node' );
            };
            circles
                .filter((d) => {return d.depth === 0; })
                    .style('fill', d => {  return colorizeNode(d.data); })
                    .style('opacity', 0.8)
                    .attr('stroke-width', 20)
                    .attr('stroke', d => { return colorizeNode(d.data); })
                        .append('title')
                        .text(function(d: any) { return `${d.data.hostName}`; });



        });

    }

    colorizeContainer(service) {
        let colors = ['#BA40BB', '#03D7BF', '#6946D5', '#FFAB00'];
        return d3.scaleOrdinal(colors).domain(this.services)(service.name);
    }


    getServiceColor(service: Service){
        let colors = ['#BA40BB', '#03D7BF', '#6946D5', '#FFAB00'];
        return d3.scaleOrdinal(colors).domain(this.services)(service.name);
    }

    getServicePackColor(service: Service){
         return '#BDBDBD';
    }
}
