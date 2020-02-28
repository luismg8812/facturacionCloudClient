import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentoModel } from '../model/documento.model';
import { TipoPagoDocumentoModel } from '../model/tipoPagoDocumento.model';
import { CuadreCajaVoModel } from '../model/cuadreCajaVo.model';
import { ParametrosModel } from '../model/parametros.model';
import { DocumentoOrdenModel } from '../model/documentoOrden.model';
import { NominaModel } from '../model/nomina.model';

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

  getDocumentoByTipo(tipoDocumentoId: number[], empresaId: string, usuarioId: string, cerrado: string) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getDocumentoByTipo?tipoDocumentoId='+tipoDocumentoId+'&empresaId=' + empresaId + '&usuarioId=' + usuarioId + '&cerrado=' + cerrado);
  }

  getDocumentoOrdenById(ordenId: string) {
    return this.http.get<DocumentoOrdenModel[]>(this.server_api + '/documento/getDocumentoOrdenById?ordenId='+ordenId);
  }
  
  getOrdenesByDocumentoId(documentoId: string) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getOrdenesByDocumentoId?documentoId='+documentoId);
  }

  
  
  

  getCuadreCaja(tipoDocumentoId: number[], empresaId: string, usuarioId: string, cerrado: string) {
    return this.http.get<CuadreCajaVoModel>(this.server_api + '/documento/getCuadreCaja?tipoDocumentoId='+tipoDocumentoId+'&empresaId=' + empresaId + '&usuarioId=' + usuarioId + '&cerrado=' + cerrado);
  }

  getOrdenesTrabajo(empresaId:string, placa: string,  cliente: string, fechaInicial, fechaFinal,tipoDocumentoId:number) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getOrdenesTrabajo?empresaId='+empresaId+'&placa='+placa+'&cliente=' + cliente + '&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+'&tipoDocumentoId='+tipoDocumentoId);
  }

  getNominaByEmpleado(fechaInicial,fechaFinal) {
    return this.http.get<NominaModel[]>(this.server_api + '/documento/getNominaByEmpleado?fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal);
  }
  
  getOrdenesByEmpleado(empleadoId: number,fechaInicial,fechaFinal,tipoDocumentoId:number) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getOrdenesByEmpleado?empleadoId='+empleadoId+ '&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+'&tipoDocumentoId='+tipoDocumentoId);
  }

}
