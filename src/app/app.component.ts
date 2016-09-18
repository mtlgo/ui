import { Component, OnInit } from '@angular/core';
import { SwarmService } from './swarm/swarm.service';
import {Node} from './swarm-vizualizer/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Docker UI';
  nodes: Array<Node>;

  constructor(private swarmService : SwarmService) {


  }

  ngOnInit() {
      return this.swarmService.listNodes()
                    .then((nodes) => {
                        this.nodes = nodes ;
                        console.log('couocu', nodes);
                        return nodes;
                    });
  }
}
