import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import * as d3 from '../shared/lib/custom-bundled-d3';
import * as _ from 'lodash';
import { Task, Node , Service} from './models';

@Component({
    selector: 'app-swarm-vizualizer',
    templateUrl: './swarm-vizualizer.component.html',
    styleUrls: ['./swarm-vizualizer.component.scss'],
    encapsulation : ViewEncapsulation.None
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
    rootWorkspace: any;
    rootNode: any;

    constructor(private el: ElementRef) { }

    ngOnInit() {
        console.log('SwarmVizDirective:ngAfterViewInit');
      //  this.createWorkspace();
        this.generateData();
        this.structureDataAndPack();
    }

    createWorkspace() {

        this.rootWorkspace = d3.select(this.el.nativeElement)
            .append('svg')
                .attr('viewBox', `0 0 ${this.width} ${this.height}`)
                .attr('preserveAspectRatio', 'xMinYMin meet');
        console.log('SwarmVizDirective:createWorkspace', this.rootWorkspace);

    }

    generateData() {

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


    activateSimulation() {
        // console.log('SwarmVizDirective:doSimulation', this.tasks);
        // let simulation = d3.forceSimulation(this.rootNode)
        //     .velocityDecay(0.2)
        //     .force('x', d3.forceX().strength(.0005))
        //     .force('y', d3.forceY().strength(.0005))
        // //.force('cluster', this.clustering.bind(this))
        // .force('collide', this.collide.bind(this))

        // .on('tick', this.ticked.bind(this));

         let simulation = d3.forceSimulation<Task>()
            .force('collide', d3.forceCollide( function(d: any){return d.r + 8; }).iterations(16) )
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('y', d3.forceY(0.05))
            .force('x', d3.forceX(0.05));

            //  let ticked = function() {
            //     node
            //         .attr('cx', function(d) { return d.x; })
            //         .attr('cy', function(d) { return d.y; });
            //  };

            //  simulation
            //     .nodes(data.nodes)
            //     .on('tick', ticked);
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
        let nComplex = _.map(complex, (node) => {
            let tasksIndexedByServiceName = _.groupBy(node.children, 'service.name');
            let nodeChildren = _.transform(tasksIndexedByServiceName, function(result, value, key) {
               result.push({
                        serviceName: key,
                        children: value
                    });
            }, []);
            node.children = nodeChildren;
            return node;
        });
        console.log('newStructure', nComplex);

        let pack = d3.pack()
            .size([700, 700])
            .padding(5);
        // let shadowWorkspace = this.rootWorkspace
        //                             .append('g');
        _.each(nComplex, (node, i) => {
            console.log('node', node);
            let root = d3.hierarchy(node)
                .sum((o: any) => { return o instanceof Task ?  o.stats.cpu : o.children.length; });
            pack(root);
            console.log('SwarmVizDirective:structureDataAndPack: root', root);

            let width = d3.scaleLinear()
                            .domain([0, nComplex.length - 1])
                            .range([0, 500]);
                            console.log(i, width(i));


            let workspace = d3.select(this.el.nativeElement).select('div.complete-dashboard')
                                    .append('div')
                                        .attr('class', 'node-container')
                                    .append('svg')
                                        .attr('viewBox', `0 0 ${this.width} ${this.height}`)
                                        .attr('preserveAspectRatio', 'xMinYMin meet');
            let nodeGroup = workspace.append('g')
                                        .attr('transform', (d) => { return 'translate(' + 0+ ',' + 0 + ')'; })
                                        .attr('class', node.hostName);

            let circles = nodeGroup.selectAll('g')
                                .data<any>(root.descendants())
                                    .enter().append('g')
                                    .attr('transform',  (d) => { return 'translate(' + d.x + ',' + d.y + ')'; });
            let ticked = function() {

             };
            
            d3.forceSimulation([nodeGroup,circles])
                .force('center',d3.forceCenter(500,500))
                 .on('tick', ticked);
            console.log('SwarmVizDirective:structureDataAndPack', circles);
            circles.append('circle')
                .attr('id', function (d) { return d.data.name; })
                .attr('r', function (d) { return d.r; })
                .style('fill', function (d) { return color(d.depth); });
            circles.append('title')
                .text(function(d) { return `${d.data.name}-${d.data.stats ? d.data.stats.cpu :d.data.name}`; });

           
        });

    }
}
