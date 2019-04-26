import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { DocumentoModel } from '../model/documento.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  constructor(public http:HttpClient) { }

  public server_api ='https://facturacioncloud2019.herokuapp.com';

  saveDocumento(documentoId:DocumentoModel){
    return this.http.post<any>(this.server_api+'/documento/createDocumento',documentoId);
  }

  updateDocumento(documentoId:DocumentoModel){
    return this.http.post<any>(this.server_api+'/documento/updateDocumento',documentoId);
  }
}
