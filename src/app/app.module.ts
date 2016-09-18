import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DOCKER_UI_DIRECTIVES } from './shared';
import { SwarmVizDirective } from './shared/directives/swarm-viz.directive';
import { SwarmVizualizerComponent } from './swarm-vizualizer/swarm-vizualizer.component';
import { SwarmService } from './swarm/swarm.service';

@NgModule({
  declarations: [
    AppComponent,
    SwarmVizDirective,
    SwarmVizualizerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [SwarmService],
  bootstrap: [AppComponent]
})
export class AppModule { }
