import { Injectable } from '@angular/core';
import { ProductoModel } from '../model/producto.model';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(public http:HttpClient) { }

  public server_api ='https://facturacioncloud2019.herokuapp.com';
  public getProductosByEmpresa(empresaId:string){
    return this.http.get<ProductoModel[]>(this.server_api+'/producto/getProductosByEmpresa?empresaId='+empresaId);
  }
}
