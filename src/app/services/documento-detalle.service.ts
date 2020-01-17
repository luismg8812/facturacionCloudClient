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
}
