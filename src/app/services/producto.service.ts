import { Injectable } from '@angular/core';
import { ProductoModel } from '../model/producto.model';
import {HttpClient} from '@angular/common/http';
import { ParametrosModel } from '../model/parametros.model';
import { GrupoModel } from '../model/grupo.model';


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

  public getProductosByGrupo(empresaId:string,grupoId:string,proveedorId:string){
    return this.http.get<ProductoModel[]>(this.server_api+'/producto/getProductosByGrupo?empresaId='+empresaId+'&grupoId='+grupoId+'&proveedorId='+proveedorId);
  }

  public getProductoById(productoId:string,empresaId:string){
    return this.http.get<ProductoModel>(this.server_api+'/producto/getProductoById?empresaId='+empresaId+'&productoId='+productoId);
  }

  public getGruposByEmpresa(empresaId:string){
    return this.http.get<GrupoModel[]>(this.server_api+'/producto/getGruposByEmpresa?empresaId='+empresaId);
  }

  

  public updateCantidad(productoId:ProductoModel){
    return this.http.put<any>(this.server_api+'/producto/updateCantidad',productoId);
  }

  public inactivar(productoId:ProductoModel){
    return this.http.put<any>(this.server_api+'/producto/inactivar',productoId);
  }

  public updateProducto(productoId:ProductoModel){
    return this.http.put<any>(this.server_api+'/producto/updateProducto',productoId);
  }

  public saveProducto(productoId:ProductoModel){
    return this.http.put<any>(this.server_api+'/producto/saveProducto',productoId);
  }
  

  
  
}
