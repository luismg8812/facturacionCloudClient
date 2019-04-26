import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoDetalleService {

  constructor(public http:HttpClient) { }

  public server_api ='https://facturacioncloud2019.herokuapp.com';

  saveDocumentoDetalle(documentoDetalleId:DocumentoDetalleModel){
    return this.http.post<any>(this.server_api+'/documentoDetalle/createDocumentoDetalle',documentoDetalleId);
  }
}
