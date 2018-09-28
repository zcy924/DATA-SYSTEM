import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CreateSpaceComponent } from './component/create-sapce.component';


const components = [];
const modals = [CreateSpaceComponent];
@NgModule({
  imports: [SharedModule],
  exports: [...components],
  declarations: [...components, ...modals],
  providers: [],
  entryComponents: [...modals],
})
export class SpaceSquareModule {}
