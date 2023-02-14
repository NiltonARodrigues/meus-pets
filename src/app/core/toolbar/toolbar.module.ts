import { SharedModule } from './../../shared/shared.module';
import { ToolbarComponent } from './toolbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[ToolbarComponent]
})
export class ToolbarModule { }
