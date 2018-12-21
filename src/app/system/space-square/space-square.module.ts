import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CreateSpaceComponent } from './component/create-sapce.component';
import { SpaceSquareService } from './space-square.service';
import { CompanyManageService } from '../company-manage/company-manage.service';


const components = [];
const modals = [CreateSpaceComponent];
@NgModule({
  imports: [SharedModule],
  exports: [...components],
  declarations: [...components, ...modals],
  providers: [SpaceSquareService,CompanyManageService],
  entryComponents: [...modals],
})
export class SpaceSquareModule {}
