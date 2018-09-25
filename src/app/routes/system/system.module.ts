import { NgModule } from '@angular/core';
import { SystemRoutingModule } from './system.routing';
import { SharedModule } from '@shared/shared.module';
import { PersonalCenterComponent } from './personal-center/personal-center.component';

const modules = [SharedModule, SystemRoutingModule];
const components = [PersonalCenterComponent];
@NgModule({
  imports: [...modules],
  exports: [],
  declarations: [...components],
  providers: [],
})
export class SystemModule {}
