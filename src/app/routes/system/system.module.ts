import { NgModule } from '@angular/core';
import { SystemRoutingModule } from './system.routing';
import { SharedModule } from '@shared/shared.module';
import { SpaceSquareModule } from './space-square/space-square.module';

const modules = [SharedModule, SystemRoutingModule,SpaceSquareModule];
const components = [];
@NgModule({
  imports: [...modules],
  exports: [],
  declarations: [...components],
  providers: [],
})
export class SystemModule {}
