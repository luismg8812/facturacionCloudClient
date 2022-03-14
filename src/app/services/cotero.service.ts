import { Injectable } from '@angular/core';
import { CoteroModel } from '../model/cotero.model';
import {HttpClient} from '@angular/common/http';
import { ParametrosModel } from '../model/parametros.model';

@Injectable({
  providedIn: 'root'
})
export class CoteroService {

  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;

  public saveCotero(coteroId:CoteroModel){
    return this.http.put<any>(this.server_api+'/cotero/saveCotero',coteroId);
  }

  updateCotero(coteroId:CoteroModel){
    return this.http.post<any>(this.server_api+'/cotero/updateCotero',coteroId);
  }

  public getCoteros(empresaId:string){
    return this.http.get<[CoteroModel]>(this.server_api+'/cotero/getCoteros?empresaId='+empresaId);
  }



  constructor(public http:HttpClient) { }
}
