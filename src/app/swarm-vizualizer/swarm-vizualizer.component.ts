import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from '../shared/lib/custom-bundled-d3';
import * as _ from 'lodash';
import { Task, Node , Service} from './models';

@Component({
    selector: 'app-swarm-vizualizer',
    templateUrl: './swarm-vizualizer.component.html',
    styleUrls: ['./swarm-vizualizer.component.css']
})
export class SwarmVizualizerComponent implements OnInit {
    width: number = 960;
    height: number = 500;
    padding: number = 1.5; // separation between same-color nodes
    clusterPadding: number = 6; // separation between different-color nodes
    maxRadius: number = 450;


    numberOfTasks: number = 50;
    numberOfNodes: number = 3;

    tasks: Task[];
    nodes: Node[];
    tasksCircles: any;
    rootWorkspace: any;

    constructor(private el: ElementRef) { }

    ngOnInit() {
        console.log('SwarmVizDirective:ngAfterViewInit');
        this.createWorkspace();
        this.prepareData();
        //this.createContainersCircles();
        this.activateSimulation();
        this.structureDataAndPack();
    }

    createWorkspace() {
        this.rootWorkspace = d3.select(this.el.nativeElement)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g').attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
        console.log('SwarmVizDirective:createWorkspace', this.rootWorkspace);

    }

    prepareData() {

        let nodeFactory = (index) => {
            let node = new Node();
            let data = {
                id: index,
                hostName: `host-${index}`
            };
            return _.assign(node, data);
        };
        let taskFactory = (index, node: Node) => {
            let task = new Task();
            let _services: Array<string> = ['nginx', 'redis', 'node', 'alpine'];
            let data = {
                id: index,
                name: `task-${index}`,
                node: node,
                stats: {
                    cpu: Math.random() * 100
                },
                service: _.assign(new Service(), { name: _services[index % _services.length]})
            };
            return _.assign(task, data);
        };
        this.nodes = _.range(this.numberOfNodes).map((i) => { return nodeFactory(i); });
        this.tasks = _.range(this.numberOfTasks).map((i) => {
            let node = this.nodes[_.random(this.nodes.length - 1)];
            return taskFactory(i, node);
        });
    }

    createContainersCircles() {
        let color = d3.scaleOrdinal(d3.schemeCategory20);
        this.tasksCircles = this.rootWorkspace.append('g')
            .datum(this.tasks)
            .selectAll('.circle')
            .data(d => d)
            .enter().append('circle')
            .attr('r', (d) => d.stats.cpu)
            .attr('fill', (d) => color(d.node.id))
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
    }

    activateSimulation() {
        console.log('SwarmVizDirective:doSimulation', this.tasks);
        let simulation = d3.forceSimulation(this.tasks)
            .velocityDecay(0.2)
            .force('x', d3.forceX().strength(.0005))
            .force('y', d3.forceY().strength(.0005));
        //.force('cluster', this.clustering.bind(this))
        //.force('collide', this.collide.bind(this))

        //.on('tick', this.ticked.bind(this));
    }

    structureDataAndPack() {
        let color = d3.scaleOrdinal(d3.schemeCategory20c);
        let structure = (t: Task[]) => {
            return _.reduce(t, (hierarchy, task, key) => {
                let existingNode = _.find(hierarchy, ['id', task.node.id]);
                if (existingNode) {
                    existingNode.children.push(task);
                } else {
                    let obj = {
                        id: task.node.id,
                        hostName: task.node.hostName,
                        children: [task]
                    };
                    hierarchy.push(obj);
                }


                return hierarchy;
            }, []);
        };
        console.log('nodes', this.nodes);
        console.log('tasks', this.tasks);

        let complex = structure(this.tasks);
        console.log('SwarmVizDirective:structureDataAndPack: complex', complex);
        let rootNodeData = {
            name: 'root',
            children: complex
        };
        let root = d3.hierarchy(rootNodeData)
            .sum((t: any) => { return t.stats ? t.stats.cpu : 1337; });
        let pack = d3.pack()
            .size([this.width / 2, this.height / 2])
            .padding(5);
        pack(root);
        console.log('SwarmVizDirective:structureDataAndPack: root', root);
        let node = this.rootWorkspace
            .selectAll('g')
            .data(root.descendants())
                .enter().append('g')
                .attr('transform', function (d) { console.log('d', d); return 'translate(' + d.x + ',' + d.y + ')'; });
        console.log('SwarmVizDirective:structureDataAndPack', node);
        node.append('circle')
            .attr('id', function (d) { return d.data.name; })
            .attr('r', function (d) { return d.r; })
            .style('fill', function (d) { return color(d.depth); });
        node.append('title')
            .text(function(d) { return d.data.name; });

    }

    packing(alpha) {

    }

    ticked() {
        this.tasksCircles
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y);
    }
    // These are implementations of the custom forces.
    clustering(alpha) {
        this.tasks.forEach((d: any) => {
            let node = _.find<any>(this.nodes, d.id);
            if (node.id === d.id) return;
            let x = d.x - node.x,
                y = d.y - node.y,
                l = Math.sqrt(x * x + y * y),
                r = d.r + node.r;
            if (l !== r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                node.x += x;
                node.y += y;
            }
        });
    }

    collide(alpha) {
        let tasks = this.tasks;
        let quadtree = d3.quadtree<Task>()
            .x((d) => d[0])
            .y((d) => d[1])
            .addAll(tasks);

        this.tasks.forEach((d: any) => {
            let r = d.r + this.maxRadius + Math.max(this.padding, this.clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit((quad: any, x1, y1, x2, y2) => {

                if (quad.data && (quad.data !== d)) {
                    let x = d.x - quad.data.x,
                        y = d.y - quad.data.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.r + quad.data.r + (d.cluster === quad.data.cluster ? this.padding : this.clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.data.x += x;
                        quad.data.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        });
    }

}
