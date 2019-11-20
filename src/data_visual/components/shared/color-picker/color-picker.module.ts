import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from './color-picker.component';

@NgModule({
  imports: [ CommonModule ],
  exports: [ ColorPickerComponent ],
  declarations: [  ColorPickerComponent ]
})
export class ColorPickerModule {}
