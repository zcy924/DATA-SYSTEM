import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CreateSpaceComponent } from './component/create-sapce.component';
import { SpaceSquareService } from './space-square.service';


const components = [];
const modals = [CreateSpaceComponent];
@NgModule({
  imports: [SharedModule],
  exports: [...components],
  declarations: [...components, ...modals],
  providers: [SpaceSquareService],
  entryComponents: [...modals],
})
export class SpaceSquareModule {}
