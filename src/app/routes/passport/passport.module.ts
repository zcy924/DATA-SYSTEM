import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PassportRoutingModule } from './passport.routing';
import { UserLoginComponent } from './login/login.component';
import { UserRegisterResultComponent } from './register-result/register-result.component';
import { UserRegisterComponent } from './register/register.component';
import { LoginService } from './login/login.service';

const modules = [SharedModule,PassportRoutingModule];
const components = [UserLoginComponent,UserRegisterResultComponent,UserRegisterComponent];
@NgModule({
  imports: [...modules],
  exports: [],
  declarations: [...components],
  providers: [LoginService],
})
export class PassportModule {}
