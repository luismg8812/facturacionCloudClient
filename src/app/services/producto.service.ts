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

  public getProductoById(productoId:string,empresaId:string){
    return this.http.get<ProductoModel>(this.server_api+'/producto/getProductoById?empresaId='+empresaId+'&productoId='+productoId);
  }

  public updateCantidad(productoId:ProductoModel){
    return this.http.put<any>(this.server_api+'/producto/updateCantidad',productoId);
  }
}
