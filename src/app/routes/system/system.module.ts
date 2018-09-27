import { NgModule } from '@angular/core';
import { SystemRoutingModule } from './system.routing';
import { SharedModule } from '@shared/shared.module';
import { SystemService } from './system.service';

const modules = [SharedModule, SystemRoutingModule];
const components = [];
@NgModule({
  imports: [...modules],
  exports: [],
  declarations: [...components],
  providers: [SystemService],
})
export class SystemModule {}
