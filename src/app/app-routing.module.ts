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
import { ClienteComponent } from './cliente/cliente.component';
import { InventarioFisicoComponent } from './inventario-fisico/inventario-fisico.component';
import { MovimientoMesComponent } from './movimiento-mes/movimiento-mes.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { CierresComponent } from './cierres/cierres.component';
import { InformeDiarioComponent } from './informe-diario/informe-diario.component';
import { EnvioDocumentosComponent } from './envio-documentos/envio-documentos.component';

const routes: Routes = [
   { path: 'login', component: LoginComponent },
   { path: 'ventasDia', component: VentasDiaComponent},
   { path: 'menu', component: MenuComponent },
   { path: 'usuario', component: UsuarioComponent },
   { path: 'ot', component: OtComponent },
   { path: 'gestionOrden', component: GestionOrdenComponent },
   { path: 'nomima', component: NominaComponent },
   { path: 'empleado', component: EmpleadoComponent },
   { path: 'cliente', component: ClienteComponent },
   { path: 'infoMovimiento', component: InfoMovimientoComponent },
   { path: 'inventarioFisico', component: InventarioFisicoComponent },
   { path: 'entradasAlmacen', component: MovimientoMesComponent },
   { path: 'proveedor', component: ProveedorComponent },
   { path: 'Cierre', component: CierresComponent },
   { path: 'envioDocumentos', component: EnvioDocumentosComponent },
   { path: 'informeDiario', component: InformeDiarioComponent },
   { path: '', component: MenuComponent, pathMatch:'full' },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
