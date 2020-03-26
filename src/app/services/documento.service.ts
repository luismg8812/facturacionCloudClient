import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentoModel } from '../model/documento.model';
import { TipoPagoDocumentoModel } from '../model/tipoPagoDocumento.model';
import { CuadreCajaVoModel } from '../model/cuadreCajaVo.model';
import { ParametrosModel } from '../model/parametros.model';
import { DocumentoOrdenModel } from '../model/documentoOrden.model';
import { NominaModel } from '../model/nomina.model';
import { TipoDocumentoModel } from '../model/tipoDocumento.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  constructor(public http: HttpClient) { }

  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;
  saveDocumento(documentoId: DocumentoModel) {
    return this.http.post<any>(this.server_api + '/documento/createDocumento', documentoId);
  }

  saveDocumentoOrden(documentoOrdenId: DocumentoOrdenModel) {
    return this.http.post<any>(this.server_api + '/documento/createDocumentoOrden', documentoOrdenId);
  }

  

  updateDocumento(documentoId: DocumentoModel) {
    return this.http.post<any>(this.server_api + '/documento/updateDocumento', documentoId);
  }

  cierreNomina() {
    return this.http.post<any>(this.server_api + '/documento/cierreNomina',"body");
  }

  

  deleteDocumentoOrdenByOrden(documento_id: DocumentoModel) {
    return this.http.post<any>(this.server_api + '/documento/deleteDocumentoOrdenByOrden', documento_id);
  }

  
  saveTipoPagoDocumento(tipoPagoDocumentoId: TipoPagoDocumentoModel) { 
    return this.http.post<any>(this.server_api + '/documento/createTipoPagoDocumento', tipoPagoDocumentoId);
  }

  getDocumentoByTipo(tipoDocumentoId: number[], empresaId: string, usuarioId: string, cerrado: string,impreso:string) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getDocumentoByTipo?tipoDocumentoId='+tipoDocumentoId+'&empresaId=' + empresaId + '&usuarioId=' + usuarioId + '&cerrado=' + cerrado+'&impreso=' + impreso);
  }

  getDocumentoOrdenById(ordenId: string) {
    return this.http.get<DocumentoOrdenModel[]>(this.server_api + '/documento/getDocumentoOrdenById?ordenId='+ordenId);
  }
  
  getOrdenesByDocumentoId(documentoId: string) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getOrdenesByDocumentoId?documentoId='+documentoId);
  }

  
  getTiposDocumento() {
    return this.http.get<TipoDocumentoModel[]>(this.server_api + '/documento/getTiposDocumento');
  }
  

  getCuadreCaja(tipoDocumentoId: number[], empresaId: string, usuarioId: string, cerrado: string) {
    return this.http.get<CuadreCajaVoModel>(this.server_api + '/documento/getCuadreCaja?tipoDocumentoId='+tipoDocumentoId+'&empresaId=' + empresaId + '&usuarioId=' + usuarioId + '&cerrado=' + cerrado);
  }

  getOrdenesTrabajo(empresaId:string, placa: string,  cliente: string, fechaInicial, fechaFinal,tipoDocumentoId:number) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getOrdenesTrabajo?empresaId='+empresaId+'&placa='+placa+'&cliente=' + cliente + '&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+'&tipoDocumentoId='+tipoDocumentoId);
  }

  getNominaByEmpleado(fechaInicial,fechaFinal,idEmpleados: number[]) {
    return this.http.get<NominaModel[]>(this.server_api + '/documento/getNominaByEmpleado?fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+"&idEmpleados="+idEmpleados);
  }

  getDocumentosByFechaAndTipo(fechaInicial,fechaFinal,empleadoId:string,tipoDocumentoId:string,usuarioId:string,empresaId:number) {
    return this.http.get<any[]>(this.server_api + '/documento/getDocumentosByFechaAndTipo?fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+"&idEmpleados="+empleadoId+"&tipoDocumentoId="+tipoDocumentoId+"&usuarioId="+usuarioId+"&empresaId="+empresaId);
  }
  
  getOrdenesByEmpleado(empleadoId: number,fechaInicial,fechaFinal,tipoDocumentoId:number) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getOrdenesByEmpleado?empleadoId='+empleadoId+ '&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+'&tipoDocumentoId='+tipoDocumentoId);
  }

  getDocumentoByTipoAndFecha(tipoDocumentoId: string,usuarioId: number,empleadoId: number, fechaInicial,fechaFinal, consecutivoDian:number,documentoId:number,clienteId: number,proveedorId:number,empresaId: number  ) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getDocumentoByTipoAndFecha?tipoDocumentoId='+tipoDocumentoId+'&empresaId=' + empresaId + '&usuarioId=' + usuarioId + '&empleadoId=' + empleadoId+'&consecutivoDian=' + consecutivoDian+'&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+ '&documentoId=' + documentoId+ '&clienteId=' + clienteId+ '&proveedorId=' + proveedorId);
  }

}
