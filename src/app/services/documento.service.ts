import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentoModel } from '../model/documento.model';
import { TipoPagoDocumentoModel } from '../model/tipoPagoDocumento.model';
import { CuadreCajaVoModel } from '../model/cuadreCajaVo.model';
import { ParametrosModel } from '../model/parametros.model';
import { DocumentoOrdenModel } from '../model/documentoOrden.model';
import { NominaModel } from '../model/nomina.model';
import { TipoDocumentoModel } from '../model/tipoDocumento.model';
import { DocumentoInvoiceModel } from '../model/documentoInvoice.model';
import { InvoiceModel } from '../model/invoice.model';
import { DocumentoNotaModel } from '../model/documentoNota.model';
import { RetirosCajaModel } from '../model/retirosCaja.model';

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

  saveInvoice(documentoId: DocumentoInvoiceModel) {
    return this.http.post<any>(this.server_api + '/documento/saveInvoice', documentoId);
  }

  saveDocumentoNota(documentoId: DocumentoNotaModel) {
    return this.http.post<any>(this.server_api + '/documento/saveDocumentoNota', documentoId);
  }

  saveRetiro(documentoId: RetirosCajaModel) {
    return this.http.post<any>(this.server_api + '/documento/saveRetiro', documentoId);
  }

  

  updateDocumentoNota(documentoId: DocumentoNotaModel) {
    return this.http.post<any>(this.server_api + '/documento/updateDocumentoNota', documentoId);
  }
  

  getDocumentoInvoiceByDocumento(documentoId) {
    return this.http.get<DocumentoInvoiceModel[]>(this.server_api + '/documento/getDocumentoInvoiceByDocumento?documentoId='+documentoId);
  }

  getDocumentoNotaByDocumento(documentoId) {
    return this.http.get<DocumentoNotaModel[]>(this.server_api + '/documento/getDocumentoNotaByDocumento?documentoId='+documentoId);
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

  deleteDocumento(documento_id: DocumentoModel) {
    return this.http.post<any>(this.server_api + '/documento/deleteDocumento', documento_id);
  }

  deleteDocumentoOrdenByDocumento(documento_id: DocumentoModel) {
    return this.http.post<any>(this.server_api + '/documento/deleteDocumentoOrdenByDocumento', documento_id);
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

  getUltimoDocumentoId() {
    return this.http.get<any>(this.server_api + '/documento/getUltimoDocumentoId');
  }

  
  
  getOrdenesByDocumentoId(documentoId: string) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getOrdenesByDocumentoId?documentoId='+documentoId);
  }


  getByDocumentoId(documentoId: string) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getByDocumentoId?documentoId='+documentoId);
  }
  

  getTiposDocumento() {
    return this.http.get<TipoDocumentoModel[]>(this.server_api + '/documento/getTiposDocumento');
  }

  getInvoice() {
    return this.http.get<InvoiceModel[]>(this.server_api + '/documento/getInvoice');
  }

  getCuadreCaja(tipoDocumentoId: number[], empresaId: string, usuarioId: string, cerrado: string) {
    return this.http.get<CuadreCajaVoModel>(this.server_api + '/documento/getCuadreCaja?tipoDocumentoId='+tipoDocumentoId+'&empresaId=' + empresaId + '&usuarioId=' + usuarioId + '&cerrado=' + cerrado);
  }

  borrarOrdenesEn0(ordenes: string[] ) {
    return this.http.get<CuadreCajaVoModel>(this.server_api + '/documento/borrarOrdenesEn0?ordenes='+ordenes);
  }

  

  getOrdenesTrabajo(empresaId:string, placa: string,  cliente: string, fechaInicial, fechaFinal,tipoDocumentoId:number,idUsuario:string) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getOrdenesTrabajo?empresaId='+empresaId+'&placa='+placa+'&cliente=' + cliente + '&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+'&tipoDocumentoId='+tipoDocumentoId+'&idUsuario='+idUsuario);
  }

  getOrdenesTrabajoEn0(empresaId:number, tipoDocumentoId:number) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getOrdenesEnCero?empresaId='+empresaId+'&tipoDocumentoId='+tipoDocumentoId);
  }

  getNominaByEmpleado(fechaInicial,fechaFinal,idEmpleados: number[],tipoDocumentoId:string) {
    return this.http.get<NominaModel[]>(this.server_api + '/documento/getNominaByEmpleado?fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+"&idEmpleados="+idEmpleados+"&tipoDocumentoId="+tipoDocumentoId);
  }

  getVentasPorGrupos(usuarioId,fechaInicial,fechaFinal,conCierre:boolean) {
    return this.http.get<any>(this.server_api + '/documento/getVentasPorGrupos?usuarioId=' + usuarioId +'&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+ '&conCierre=' + conCierre);
  }

  getVentasPorSubGrupos(usuarioId,fechaInicial,fechaFinal,conCierre:boolean) {
    return this.http.get<any>(this.server_api + '/documento/getVentasPorSubGrupos?usuarioId=' + usuarioId +'&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+ '&conCierre=' + conCierre);
  }

  getDocumentosByFechaAndTipo(fechaInicial,fechaFinal,empleadoId:string,tipoDocumentoId:string,usuarioId:string,empresaId:number,autorizacion:string) {
    return this.http.get<any[]>(this.server_api + '/documento/getDocumentosByFechaAndTipo?fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+"&idEmpleados="+empleadoId+"&tipoDocumentoId="+tipoDocumentoId+"&usuarioId="+usuarioId+"&empresaId="+empresaId+"&autorizacion="+autorizacion);
  }

  getDocumentosByFechaAndTipoDetalle(fechaInicial,fechaFinal,empleadoId:string,tipoDocumentoId:string,usuarioId:string,empresaId:number) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getDocumentosByFechaAndTipoDetalle?fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+"&idEmpleados="+empleadoId+"&tipoDocumentoId="+tipoDocumentoId+"&usuarioId="+usuarioId+"&empresaId="+empresaId);
  }

  

  getRetirosByFechaAndTipo(fechaInicial,fechaFinal,usuario_hace_id:string,usuario_aplica_id:string,empresaId:number) {
    return this.http.get<RetirosCajaModel[]>(this.server_api + '/documento/getRetirosByFechaAndTipo?fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+"&usuario_hace_id="+usuario_hace_id+"&usuario_aplica_id="+usuario_aplica_id+"&empresaId="+empresaId);
  }

  

  getDocumentoForFacturacionElectronica(fechaInicial,fechaFinal,tipoDocumentoId:Array<string>,consecutivoDian:string,documentoId:string,invoiceId:number,empresaId:number) {
    return this.http.get<any[]>(this.server_api + '/documento/getDocumentoForFacturacionElectronica?fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+"&tipoDocumentoId="+tipoDocumentoId+"&consecutivoDian="+consecutivoDian+"&documentoId="+documentoId+"&invoiceId="+invoiceId+"&empresaId="+empresaId);
  }
  
  
  getOrdenesByEmpleado(empleadoId: number,fechaInicial,fechaFinal,tipoDocumentoId:number) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getOrdenesByEmpleado?empleadoId='+empleadoId+ '&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+'&tipoDocumentoId='+tipoDocumentoId);
  }

  getOrdenesByEmpleados(empleadoId: number[],fechaInicial,fechaFinal,tipoDocumentoId:number) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getOrdenesByEmpleados?empleadoId='+empleadoId+ '&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+'&tipoDocumentoId='+tipoDocumentoId);
  }

  getDocumentoByTipoAndFecha(tipoDocumentoId: string,usuarioId: string,empleadoId: string, fechaInicial,fechaFinal, consecutivoDian:string,documentoId:string,clienteId: string,proveedorId:string,empresaId: number  ) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getDocumentoByTipoAndFecha?tipoDocumentoId='+tipoDocumentoId+'&empresaId=' + empresaId + '&usuarioId=' + usuarioId + '&empleadoId=' + empleadoId+'&consecutivoDian=' + consecutivoDian+'&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal+ '&documentoId=' + documentoId+ '&clienteId=' + clienteId+ '&proveedorId=' + proveedorId);
  }

  public getDocumentosByTipoPago(empresaId:number,tipoDocumentoId:string,fechaInicial,fechaFinal) {
    return this.http.get<any>(this.server_api + '/documento/getDocumentosByTipoPago?empresaId=' + empresaId+ '&tipoDocumentoId=' + tipoDocumentoId+ '&fechaInicial=' + fechaInicial+ '&fechaFinal=' + fechaFinal);
  }

  public getCarteraClientes(clienteId,proveedorId,fechaInicial,fechaFinal,empresaId,tipoDocumentoId:number) {
    return this.http.get<any>(this.server_api + '/documento/getCarteraClientes?empresaId=' + empresaId+ '&clienteId=' + clienteId+'&proveedorId=' + proveedorId+ '&fechaInicial=' + fechaInicial+ '&fechaFinal=' + fechaFinal+ '&tipoDocumentoId=' + tipoDocumentoId);
  }

  

  getGananciaDocumentos(fechaInicial,fechaFinal, empresaId: number  ) {
    return this.http.get<any>(this.server_api + '/documento/getGananciaDocumentos?empresaId=' + empresaId +'&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal);
  }

  getTerceros(fechaInicial,fechaFinal, tipoTercero:string,tipoDocumento:number, montoDesde:number, empresaId: number ,montoHasta:number ) {
    return this.http.get<any>(this.server_api + '/documento/getTerceros?empresaId=' + empresaId +'&fechaInicial=' + fechaInicial + '&fechaFinal=' + fechaFinal
    + '&tipoTercero=' + tipoTercero+ '&tipoDocumento=' + tipoDocumento+ '&montoDesde=' + montoDesde+ '&montoHasta=' + montoHasta);
  }

  public getTipoPagoByDocumento(documentoId:string) {
    return this.http.get<any>(this.server_api + '/documento/getTipoPagoByDocumento?documentoId=' + documentoId);
  }
  
}
