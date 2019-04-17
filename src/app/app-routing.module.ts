import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { VentasDiaComponent } from './ventas-dia/ventas-dia.component';

const routes: Routes = [
   { path: 'login', component: LoginComponent },
   { path: 'ventasDia', component: VentasDiaComponent},
   { path: 'menu', component: MenuComponent },
   { path: 'usuario', component: UsuarioComponent },
   { path: '', component: MenuComponent, pathMatch:'full' },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
