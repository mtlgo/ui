import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DOCKER_UI_DIRECTIVES } from './shared';
import { SwarmVizDirective } from './shared/directives/swarm-viz.directive';
import { SwarmVizualizerComponent } from './swarm-vizualizer/swarm-vizualizer.component';
import { SwarmService } from './swarm/swarm.service';
import {environment} from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    SwarmVizDirective,
    SwarmVizualizerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
      SwarmService,
      { provide: 'AppConfig', useValue: environment}
      ],
  bootstrap: [AppComponent]
})
export class AppModule { }
