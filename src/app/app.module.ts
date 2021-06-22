import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UsuarioComponent } from './usuario/usuario.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { CuadreCajaComponent } from './components/cuadre-caja/cuadre-caja.component';
import { OtComponent } from './ot/ot.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { SocketService } from './services/socket.service';
import { BuscarDocumentosComponent } from './components/buscar-documentos/buscar-documentos.component';
import { MovimientoMesComponent } from './components/movimiento-mes/movimiento-mes.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { CierresComponent } from './cierres/cierres.component';
import { InformeDiarioComponent } from './components/informe-diario/informe-diario.component';
import { EnvioDocumentosComponent } from './envio-documentos/envio-documentos.component';
import { AppConfigService } from './services/app-config.service';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { MovimientoProductosComponent } from './movimiento-productos/movimiento-productos.component';
import { EditarProductoComponent } from './editar-producto/editar-producto.component';
import { InfoGananciaComponent } from './info-ganancia/info-ganancia.component';
import { ReporteProductosComponent } from './reporte-productos/reporte-productos.component';
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
import { TrasladoComponent } from './components/traslado/traslado.component';
import { AceptacionMercanciaComponent } from './components/aceptacion-mercancia/aceptacion-mercancia.component';
import { ReporteTercerosComponent } from './components/reporte-terceros/reporte-terceros.component';
import { CarteraClientesComponent } from './components/cartera-clientes/cartera-clientes.component';
import { ControlInventarioComponent } from './components/control-inventario/control-inventario.component';
import { HojaDeVidaArticuloComponent } from './components/hoja-de-vida-articulo/hoja-de-vida-articulo.component';

export function initializeApp(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    UsuarioComponent,
    EmpresaComponent,
    VentasDiaComponent,
    CuadreCajaComponent,
    OtComponent,
    GestionOrdenComponent,
    NominaComponent,
    EmpleadoComponent,
    InfoMovimientoComponent,
    ClienteComponent,
    InventarioFisicoComponent,
    BuscarDocumentosComponent,
    MovimientoMesComponent,
    ProveedorComponent,
    CierresComponent,
    InformeDiarioComponent,
    EnvioDocumentosComponent,
    EstadoDocumentosComponent,
    MovimientoProductosComponent,
    EditarProductoComponent,
    InfoGananciaComponent,
    ReporteProductosComponent,
    CarteraClientesComponent,
    RetirosCajaComponent,
    LiberarCuadreComponent,
    CarteraProveedoresComponent,
    TutorialesComponent,
    CuentasContablesComponent,
    BonosComponent,
    KardexComponent,
    RequerimientoComponent,
    TrasladoComponent,
    AceptacionMercanciaComponent,
    ReporteTercerosComponent,
    ControlInventarioComponent,
    HojaDeVidaArticuloComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    HttpClientModule,
    FormsModule,
    NgxQRCodeModule
  ],
  providers: [AngularFireAuth, 
    LoginComponent,
    AngularFireStorage,
    SocketService,
    AppConfigService,
    { provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
