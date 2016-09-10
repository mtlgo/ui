import { Directive, ElementRef, Input, Renderer , AfterViewInit, AfterContentInit} from '@angular/core';
import * as d3 from '../lib/custom-bundled-d3';

@Directive({
    selector: '[appToto]'
})
export class SwarmVizDirective implements AfterContentInit {
    width: number = 960;
    height: number = 500;
    padding: number = 1.5; // separation between same-color nodes
    clusterPadding: number = 6; // separation between different-color nodes
    maxRadius: number = 12;

    n: number = 200; // total number of nodes
    m: number = 10; // number of distinct clusters

    @Input() nodes: Array<any>;
    constructor(private el: ElementRef, private renderer: Renderer) {
    }


    ngAfterContentInit() {
        console.log('SwarmVizDirective:ngAfterViewInit');
        // The largest node for each cluster.
        let clusters = new Array(this.m);
        // let color = d3.scale.category10()
        //                 .domain(d3.range(m));
        let nodes = d3.range(this.n).map(() => {
            let i = Math.floor(Math.random() * this.m),
                r = Math.sqrt((i + 1) / this.m * -Math.log(Math.random())) * this.maxRadius,
                d = { cluster: i, radius: r };
            if (!clusters[i] || (r > clusters[i].radius)) { clusters[i] = d; };
            return d;
        });

       console.log('nodes', nodes);
        // d3.pack()
        //     .size([this.width, this.height])
        //     .entry((d) => { return d.children; })
        //     .value(function (d) { return d.r * d.r; })
        //     .nodes(new Node());

        // let force = d3.forceSimulation(nodes)
        //     .size([this.width, this.height])
        //     .gravity(.02)
        //     .charge(0)
        //     .on('tick', tick)
        //     .start();
        console.log('el',this.el.nativeElement);
        let svg = d3.select(this.el.nativeElement)
                    //  .append('svg')
                    //  .attr('width', this.width)
                    //  .attr('height', this.height);

         let node = svg.selectAll('circle')
                    .data(nodes)
                    .enter().append('circle')
                    // .style('fill',  (d) => { return color(d.cluster); })
        //     .call(force.drag);

        // node.transition()
        //     .duration(750)
        //     .delay(function (d, i) { return i * 5; })
        //     .attrTween('r', function (d) {
        //         let i = d3.interpolate(0, d.radius);
        //         return function (t) { return d.radius = i(t); };
        //     });

        // function tick(e) {
        //     node
        //         .each(cluster(10 * e.alpha * e.alpha))
        //         .each(collide(.5))
        //         .attr('cx',  (d) => { return d['x']; })
        //         .attr('cy', function (d) { return d['y']; });
        // }


        // Move d to be adjacent to the cluster node.
        function cluster(alpha) {
            return function (d) {
                let cluster = clusters[d.cluster];
                if (cluster === d) return;
                let x = d.x - cluster.x,
                    y = d.y - cluster.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + cluster.radius;
                if (l != r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    cluster.x += x;
                    cluster.y += y;
                }
            };
        }

        // Resolves collisions between d and all other circles.
        // function collide(alpha) {
        //     let quadtree = d3.quadtree(nodes);
        //     return function (d) {
        //         let r = d.radius + this.maxRadius + Math.max(this.padding, this.clusterPadding),
        //             nx1 = d.x - r,
        //             nx2 = d.x + r,
        //             ny1 = d.y - r,
        //             ny2 = d.y + r;
        //         quadtree.visit(function (quad, x1, y1, x2, y2) {
        //             if (quad. && (quad.point !== d)) {
        //                 let x = d.x - quad.point['x'],
        //                     y = d.y - quad.point['y'],
        //                     l = Math.sqrt(x * x + y * y),
        //                     r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? this.padding : this.clusterPadding);
        //                 if (l < r) {
        //                     l = (l - r) / l * alpha;
        //                     d.x -= x *= l;
        //                     d.y -= y *= l;
        //                     quad.point['x'] += x;
        //                     quad.point['y'] += y;
        //                 }
        //             }
        //             return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        //         });
        //     };
        // }
    }

}
