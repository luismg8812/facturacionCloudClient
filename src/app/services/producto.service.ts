import { Injectable } from '@angular/core';
import { ProductoModel } from '../model/producto.model';
import {HttpClient} from '@angular/common/http';
import { ParametrosModel } from '../model/parametros.model';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(public http:HttpClient) { }

  parametros: ParametrosModel = new ParametrosModel;
  public server_api =this.parametros.serverUrl;
  public getProductosByEmpresa(empresaId:string){
    return this.http.get<ProductoModel[]>(this.server_api+'/producto/getProductosByEmpresa?empresaId='+empresaId);
  }

  public getProductoById(productoId:string,empresaId:string){
    return this.http.get<ProductoModel>(this.server_api+'/producto/getProductoById?empresaId='+empresaId+'&productoId='+productoId);
  }

  public updateCantidad(productoId:ProductoModel){
    return this.http.put<any>(this.server_api+'/producto/updateCantidad',productoId);
  }
}
