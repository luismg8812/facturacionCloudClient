import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { VentasDiaComponent } from './ventas-dia/ventas-dia.component';
import { OtComponent } from './ot/ot.component';
import { GestionOrdenComponent } from './gestion-orden/gestion-orden.component';
import { NominaComponent } from './nomina/nomina.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { InfoMovimientoComponent } from './info-movimiento/info-movimiento.component';

const routes: Routes = [
   { path: 'login', component: LoginComponent },
   { path: 'ventasDia', component: VentasDiaComponent},
   { path: 'menu', component: MenuComponent },
   { path: 'usuario', component: UsuarioComponent },
   { path: 'ot', component: OtComponent },
   { path: 'gestionOrden', component: GestionOrdenComponent },
   { path: 'nomima', component: NominaComponent },
   { path: 'empleado', component: EmpleadoComponent },
   { path: 'infoMovimiento', component: InfoMovimientoComponent },
   { path: '', component: MenuComponent, pathMatch:'full' },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
