import { Injectable } from '@angular/core';
import { ParametrosModel } from '../model/parametros.model';
import { HttpClient } from '@angular/common/http';
import { EmpleadoModel } from '../model/empleado.model';
import { ProductoEmpleadoModel } from '../model/productoEmpleado.model';
import { PagosEmpleadoModel } from '../model/pagosEmpleado.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  parametros: ParametrosModel = new ParametrosModel;
  public server_api = this.parametros.serverUrl;

  constructor(public http: HttpClient) { }

  getEmpleadoAll(empresaId:number) {
    return this.http.get<EmpleadoModel[]>(this.server_api + '/empleado/empleadoAll?empresaId='+empresaId);
  }

  getPagosEmpleadosAll() {
    return this.http.get<PagosEmpleadoModel[]>(this.server_api + '/empleado/getPagosEmpleadosAll');
  }

  saveEmpleado(empleado: EmpleadoModel) {
    return this.http.post<any>(this.server_api + '/empleado/createEmpleado', empleado);
  }

  saveProductoEmpleado(productoEmpleado: ProductoEmpleadoModel) {
    return this.http.post<any>(this.server_api + '/empleado/createProductoEmpleado', productoEmpleado);
  }

  updateEmpleado(empleado: EmpleadoModel) {
    return this.http.put<any>(this.server_api + '/empleado/updateEmpleado', empleado);
  }

  getProductoEmpleadoByEmpleado(empleadoId:number,fechaInicial,fechaFinal) {
    return this.http.get<ProductoEmpleadoModel[]>(this.server_api + '/empleado/getProductoEmpleadoByEmpleado?empleadoId='+empleadoId+ '&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal);
  }

  
}
