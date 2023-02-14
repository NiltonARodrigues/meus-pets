import { OwnersFormComponent } from './../owners-form/owners-form.component';
import { OwnersComponent } from './../owners.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '',component: OwnersComponent},
  { path: 'new',component: OwnersFormComponent},
  { path: 'edit/:id',component: OwnersFormComponent}

];

@NgModule({

    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

})
export class OwnersRoutingModule { }
