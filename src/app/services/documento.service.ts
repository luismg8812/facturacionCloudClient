import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentoModel } from '../model/documento.model';
import { TipoPagoDocumentoModel } from '../model/tipoPagoDocumento.model';
import { CuadreCajaVoModel } from '../model/cuadreCajaVo.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  constructor(public http: HttpClient) { }

  public server_api = 'https://facturacioncloud2019.herokuapp.com';

  saveDocumento(documentoId: DocumentoModel) {
    return this.http.post<any>(this.server_api + '/documento/createDocumento', documentoId);
  }

  updateDocumento(documentoId: DocumentoModel) {
    return this.http.post<any>(this.server_api + '/documento/updateDocumento', documentoId);
  }

  saveTipoPagoDocumento(tipoPagoDocumentoId: TipoPagoDocumentoModel) {
    return this.http.post<any>(this.server_api + '/documento/createTipoPagoDocumento', tipoPagoDocumentoId);
  }

  getDocumentoByTipo(tipoDocumentoId: number[], empresaId: string, usuarioId: string, cerrado: string) {
    return this.http.get<DocumentoModel[]>(this.server_api + '/documento/getDocumentoByTipo?tipoDocumentoId='+tipoDocumentoId+'&empresaId=' + empresaId + '&usuarioId=' + usuarioId + '&cerrado=' + cerrado);
  }

  getCuadreCaja(tipoDocumentoId: number[], empresaId: string, usuarioId: string, cerrado: string) {
    return this.http.get<CuadreCajaVoModel>(this.server_api + '/documento/getCuadreCaja?tipoDocumentoId='+tipoDocumentoId+'&empresaId=' + empresaId + '&usuarioId=' + usuarioId + '&cerrado=' + cerrado);
  }


}