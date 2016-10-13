const textures = require('textures');
const Morphism = require('morphism');

import { Component, OnInit, OnChanges, ElementRef, Input, SimpleChanges } from '@angular/core';
import * as d3 from '../shared/lib/custom-bundled-d3';
import * as _ from 'lodash';
import { Task, Node, Service } from './models';
import { Observable } from 'rxjs/Observable';



@Component({
    selector: 'app-swarm-vizualizer',
    templateUrl: './swarm-vizualizer.component.html',
    styleUrls: ['./swarm-vizualizer.component.scss']
})
export class SwarmVizualizerComponent implements OnInit, OnChanges {
    width: number = 1000;
    height: number = 1000;
    padding: number = 1.5; // separation between same-color nodes
    clusterPadding: number = 6; // separation between different-color nodes
    maxRadius: number = 450;


    numberOfTasks: number = 50;
    numberOfNodes: number = 3;
    // tasks: Task[];
    // nodes: Node[];
   // services: Array<string> = ['nginx', 'redis', 'node', 'alpine'];
    rootWorkspace: any;
    rootNode: any;

    // Colors for hosts ([0] for managers and [1] for nodes)
    nodesColors: Array<string> = ['#38AFB2', '#658AAB'];
    taskColor: string = '#FFF';

    mappers: any = {};

    @Input()tasks;
    @Input()nodes;
    @Input()services: Service[];
    constructor(private el: ElementRef) {
        let taskSchema = {
            id: 'ID',
            name: 'Spec.ContainerSpec.Image',
            createdAt: 'CreatedAt',
            status: ['Status.Message', 'Status.State', 'Status.Timestamp'],
            containerId: 'Status.ContainerStatus.ContainerID',
            nodeId: 'NodeID',
            serviceId: 'ServiceID',
            desiredState: 'DesiredState',
            slot: 'Slot',
            stats: () => {
                    return { cpu: Math.random() * 100 };
                }
        };
        let serviceSchema = {
            id: 'ID',
            name: 'Spec.Name',
            createdAt: 'CreatedAt',
            mode: 'Spec.Mode'
        };
        let nodeSchema = {
            id: 'ID',
            name: 'Description.Hostname',
            createdAt: 'CreatedAt',
            role: 'Spec.Role',
            status: 'Status'
        };

        _.set(this.mappers, 'taskMapper', Morphism(taskSchema));
        _.set(this.mappers, 'serviceMapper', Morphism(serviceSchema));
        _.set(this.mappers, 'nodeMapper', Morphism(nodeSchema));
     }

    ngOnInit() {
        console.log('input tasks:OnInit', this.tasks);

    }

    ngOnChanges(changes: any) {
        // this.generateData();
        if (this.tasks && this.nodes && this.services) {
            this.tasks =  _.map(this.mappers.taskMapper(this.tasks), (t) => _.assign(new Task(), t));
            this.services = _.map(this.mappers.serviceMapper(this.services), (s) => _.assign(new Service(), s));
            this.nodes = _.map(this.mappers.nodeMapper(this.nodes), (n) => _.assign(new Node(), n));
            console.log('ngOnChanges', this.nodes, this.services,  this.tasks );


            this.structureDataAndPack();
           // this.nestTasksInNodes();
        }

    }


    nestTasksInNodes() {
        let nodesWithTasks = _.groupBy(this.tasks, 'nodeId');
        let nestedNodes = _.map(nodesWithTasks, (tasks, nodeId) =>  {

           return  {
               id: nodeId,
               data: _.find(this.nodes, ['id', nodeId]),
               children : tasks
            };
        });
        console.log('stratifyData', nodesWithTasks, nestedNodes);
        return nestedNodes;
    }



    colorizeNode() {
        return d3.scaleOrdinal(this.nodesColors);
    }
    structureDataAndPack() {

        let complex = this.nestTasksInNodes();
        console.log('SwarmVizDirective:structureDataAndPack: complex', complex);

        let nComplex = _.map(complex, (node) => {
            let tasksIndexedByServiceId = _.groupBy(node.children, 'serviceId');
            let nodeChildren = _.transform(tasksIndexedByServiceId, (result, value: any, key) => {
                let service = _.find(this.services, ['id', key]);
                result.push({ id: service.id, data: service, children: value });
            }, []);
            node.children = nodeChildren;
            return node;
        });
        console.log('newStructure', nComplex);

        let pack = d3.pack()
            .size([900, 900])
            .padding(10);

        _.each<any>(nComplex, (node, i) => {
            let root = d3.hierarchy(node)
                .sum((o: any) => { return o instanceof Task ? o.stats.cpu : o.children.length; });
            pack(root);
            console.log('SwarmVizDirective:structureDataAndPack: root', root);

            let nodeTile = d3.select(this.el.nativeElement).select('.tile.is-ancestor>.tile')
                .append('div')
                .attr('class', 'node-container tile is-child');
            nodeTile.append('h2')
                .attr('class', 'title is-2 has-text-centered')
                .text(node.data.name);


            let nodePlaceHolder = nodeTile.append('svg')
                .attr('viewBox', `0 0 ${this.width} ${this.height}`)
                .style('width', '100%')
                .style('height', '100%')
                .attr('preserveAspectRatio', 'xMinYMin meet');
            let nodeGroup = nodePlaceHolder.append('g')
                .attr('transform', (d) => { return 'translate(50,50)'; })
                .attr('class', node.data.name);

            let gCircles = nodeGroup.selectAll('g')
                .data<any>(root.descendants())
                .enter().append('g')
                .attr('transform', (d) => { return 'translate(' + d.x + ',' + d.y + ')'; });



            console.log('SwarmVizDirective:Group Circles', gCircles);
            let circles = gCircles.append('circle')
                .attr('id', function (d) { return d.data.name; })
                .attr('r', function (d) { return d.r; });
            console.log('alt', circles);
            // Style containers
            let texturize = (svg) => {
                let t = textures.lines()
                    .stroke(this.taskColor)
                    .thicker();
                svg.call(t);
                return t.url();
            };
            // Containers
            circles
                .filter((d) => { return d.depth === 2; })
                // .style('fill', d => texturize(nodePlaceHolder))
                .style('fill', (d) => { return this.getServiceColor(d.data.serviceId); })
                .append('title')
                .text(function (d) { return `${d.data.name}- cpu: ${Math.floor(d.data.stats.cpu)}%`; });


            // Services
            circles
                .filter((d) => { return d.depth === 1; })
                .style('fill', d => { return this.getServicePackColor(d.data); })
                .style('opacity', 0.9)
                .append('title')
                .text(function (d) { console.log(d); return `${d.data.data.name}`; });

            // Hosts
            let colorizeNode = (host) => {
                return d3.scaleOrdinal(this.nodesColors).domain(['manager', 'worker'])(host.data.role);
            };
            circles
                .filter((d) => { return d.depth === 0; })
                .style('fill', d => { return colorizeNode(d.data); })
                .style('opacity', 0.8)
                .attr('stroke-width', 20)
                .attr('stroke', d => { return colorizeNode(d.data); })
                .append('title')
                .text(function (d: any) { return `${d.data.data.name}`; });
        });

    }

    getServiceColor(serviceId) {
        let colors = [ '#6946D5', '#BA40BB', '#FFAB00', '#03D7BF'];
        return d3.scaleOrdinal(colors).domain(_.map<Service, string>(this.services, 'id'))(serviceId);
    }

    getServicePackColor(service: Service) {
        return '#F5F5F5';
    }
}
