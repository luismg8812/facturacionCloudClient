import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
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
import { VentasDiaComponent } from './ventas-dia/ventas-dia.component';
import { CuadreCajaComponent } from './cuadre-caja/cuadre-caja.component';
import { OtComponent } from './ot/ot.component';
import { GestionOrdenComponent } from './gestion-orden/gestion-orden.component';
import { NominaComponent } from './nomina/nomina.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { InfoMovimientoComponent } from './info-movimiento/info-movimiento.component';
import { ClienteComponent } from './cliente/cliente.component';
import { InventarioFisicoComponent } from './inventario-fisico/inventario-fisico.component';
import { SocketService } from './services/socket.service';
import { BuscarDocumentosComponent } from './buscar-documentos/buscar-documentos.component';
import { MovimientoMesComponent } from './movimiento-mes/movimiento-mes.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { CierresComponent } from './cierres/cierres.component';

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
    CierresComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [AngularFireAuth,
    LoginComponent,
    AngularFireStorage,
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
