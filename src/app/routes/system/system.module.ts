import { NgModule } from '@angular/core';
import { SystemRoutingModule } from './system.routing';
import { SharedModule } from '@shared/shared.module';

const modules = [SharedModule, SystemRoutingModule];
const components = [];
@NgModule({
  imports: [...modules],
  exports: [],
  declarations: [...components],
  providers: [],
})
export class SystemModule {}
