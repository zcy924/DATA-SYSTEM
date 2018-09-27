import { NgModule } from '@angular/core';
import { SystemRoutingModule } from './system.routing';
import { SharedModule } from '@shared/shared.module';
import { SystemService } from './system.service';
import { SapaceSquareService } from './space-square/space-square.service';

const modules = [SharedModule, SystemRoutingModule];
const components = [];
@NgModule({
  imports: [...modules],
  exports: [],
  declarations: [...components],
  providers: [SystemService,SapaceSquareService],
})
export class SystemModule {}
