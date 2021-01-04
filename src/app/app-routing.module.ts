import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { OtComponent } from './ot/ot.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { MovimientoMesComponent } from './movimiento-mes/movimiento-mes.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { CierresComponent } from './cierres/cierres.component';
import { InformeDiarioComponent } from './informe-diario/informe-diario.component';
import { EnvioDocumentosComponent } from './envio-documentos/envio-documentos.component';
import { MovimientoProductosComponent } from './movimiento-productos/movimiento-productos.component';
import { EditarProductoComponent } from './editar-producto/editar-producto.component';
import { InfoGananciaComponent } from './info-ganancia/info-ganancia.component';
import { ReporteProductosComponent } from './reporte-productos/reporte-productos.component';
import { CarteraClientesComponent } from './cartera-clientes/cartera-clientes.component';
import { RetirosCajaComponent } from './retiros-caja/retiros-caja.component';
import { LiberarCuadreComponent } from './liberar-cuadre/liberar-cuadre.component';
import { CarteraProveedoresComponent } from './cartera-proveedores/cartera-proveedores.component';
import { TutorialesComponent } from './tutoriales/tutoriales.component';
import { NominaComponent } from './components/nomina/nomina.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { GestionOrdenComponent } from './components/gestion-orden/gestion-orden.component';
import { BonosComponent } from './components/bonos/bonos.component';
import { EstadoDocumentosComponent } from './components/estado-documentos/estado-documentos.component';
import { CuentasContablesComponent } from './components/cuentas-contables/cuentas-contables.component';
import { VentasDiaComponent } from './components/ventas-dia/ventas-dia.component';
import { KardexComponent } from './components/kardex/kardex.component';
import { MenuComponent } from './components/menu/menu.component';
import { RequerimientoComponent } from './components/requerimiento/requerimiento.component';
import { InventarioFisicoComponent } from './components/inventario-fisico/inventario-fisico.component';
import { InfoMovimientoComponent } from './components/info-movimiento/info-movimiento.component';

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
   { path: 'estadoDocumentos', component: EstadoDocumentosComponent },
   { path: 'movimientoProductos', component: MovimientoProductosComponent },
   { path: 'informeDiario', component: InformeDiarioComponent },
   { path: 'editarProductos', component: EditarProductoComponent },
   { path: 'infoganancia', component: InfoGananciaComponent },
   { path: 'reporteProductos', component: ReporteProductosComponent },
   { path: 'carteraClientes', component: CarteraClientesComponent },
   { path: 'carteraProveedores', component: CarteraProveedoresComponent },
   { path: 'retirosCaja', component: RetirosCajaComponent },
   { path: 'liberarCuadre', component: LiberarCuadreComponent },
   { path: 'cuentasContables', component: CuentasContablesComponent },
   { path: 'bonos', component: BonosComponent },
   { path: 'kardex', component: KardexComponent },
   { path: 'requerimiento', component: RequerimientoComponent},
   { path: '', component: MenuComponent, pathMatch:'full' },
   { path: 'tutoriales', component: TutorialesComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
