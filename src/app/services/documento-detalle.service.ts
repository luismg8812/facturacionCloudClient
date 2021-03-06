import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { ParametrosModel } from '../model/parametros.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoDetalleService {

  constructor(public http:HttpClient) { }

  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;
  saveDocumentoDetalle(documentoDetalleId:DocumentoDetalleModel){
    return this.http.post<any>(this.server_api+'/documentoDetalle/createDocumentoDetalle',documentoDetalleId);
  }

  updateDocumentoDetalle(documentoDetalleId:DocumentoDetalleModel){
    return this.http.post<any>(this.server_api+'/documentoDetalle/updateDocumentoDetalle',documentoDetalleId);
  }

  getDocumentoDetalleByDocumento(documentoId:string) {
    return this.http.get<DocumentoDetalleModel[]>(this.server_api + '/documentoDetalle/getDocumentoDetalleByDocumento?documento_id='+documentoId);
  }

  getDocumentoDetalleByDocumentoList(documentoId:string[]) {
    return this.http.get<DocumentoDetalleModel[]>(this.server_api + '/documentoDetalle/getDocumentoDetalleByDocumentoList?documento_id='+documentoId);
  }

  getDocumentosByFechaAndTipo(fechaInicial,fechaFinal,empleadoId:string,usuarioId:string,empresaId:number) {
    return this.http.get<any[]>(this.server_api + '/documentoDetalle/getDocumentosByFechaAndTipo?fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+"&idEmpleados="+empleadoId+"&usuarioId="+usuarioId+"&empresaId="+empresaId);
  }

  getKardex(fechaInicial,fechaFinal,productoId:string,nombreParcial:string, empresaId:number) {
    return this.http.get<any[]>(this.server_api + '/documentoDetalle/getKardex?fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+"&productoId="+productoId+"&nombreParcial="+nombreParcial+"&empresaId="+empresaId);
  }
  
}
