import { Injectable } from '@angular/core';
import { ParametrosModel } from '../model/parametros.model';
import { HttpClient } from '@angular/common/http';
import { EmpleadoModel } from '../model/empleado.model';

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

  saveEmpleado(empleado: EmpleadoModel) {
    return this.http.post<any>(this.server_api + '/empleado/createEmpleado', empleado);
  }

  updateEmpleado(empleado: EmpleadoModel) {
    return this.http.put<any>(this.server_api + '/empleado/updateEmpleado', empleado);
  }
}
