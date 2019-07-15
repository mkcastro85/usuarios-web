import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosPaginaComponent } from './usuarios-pagina/usuarios-pagina.component';


const appRoutes: Routes = [
  { path: 'usuarios', component: UsuariosPaginaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
