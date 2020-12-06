import { Injectable } from '@angular/core';
import { ProductoModel } from '../model/producto.model';
import {HttpClient} from '@angular/common/http';
import { ParametrosModel } from '../model/parametros.model';
import { GrupoModel } from '../model/grupo.model';
import { SubGrupoModel } from '../model/subGrupo.model';
import { ProductoPreciosModel } from '../model/productoPrecios.model';
import { SubProductoModel } from '../model/subProducto.model';


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

  public getProductosByGrupo(empresaId:string,grupoId:string,proveedorId:string,agotado:boolean,stock:boolean,estrella:boolean,subGrupoId:string){
    return this.http.get<ProductoModel[]>(this.server_api+'/producto/getProductosByGrupo?empresaId='+empresaId+'&grupoId='+grupoId+'&proveedorId='+proveedorId+'&agotado='+agotado+'&stock='+stock+'&estrella='+estrella+'&subGrupoId='+subGrupoId);
  }

  public getProductoById(productoId:string,empresaId:string){
    return this.http.get<ProductoModel[]>(this.server_api+'/producto/getProductoById?empresaId='+empresaId+'&productoId='+productoId);
  }

  getProductoByCodBarras(codBarras:string,empresaId:string){
    return this.http.get<ProductoModel[]>(this.server_api+'/producto/getProductoByCodBarras?empresaId='+empresaId+'&codBarras='+codBarras);
  } 

  getProductoByNombre(nombre:string,empresaId:string){
    return this.http.get<ProductoModel[]>(this.server_api+'/producto/getProductoByNombre?empresaId='+empresaId+'&nombre='+nombre);
  }

  public getProductoPreciosById(productoId:number){
    return this.http.get<ProductoPreciosModel[]>(this.server_api+'/producto/getProductoPreciosById?productoId='+productoId);
  }

  public getSubProductoByProductoId(productoId:number){
    return this.http.get<SubProductoModel[]>(this.server_api+'/producto/getSubProductoByProductoId?productoId='+productoId);
  }

  public getGruposByEmpresa(empresaId:string){
    return this.http.get<GrupoModel[]>(this.server_api+'/producto/getGruposByEmpresa?empresaId='+empresaId);
  }

  public getSubGruposByEmpresa(empresaId:string){
    return this.http.get<SubGrupoModel[]>(this.server_api+'/producto/getSubGruposByEmpresa?empresaId='+empresaId);
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

  public updateProductoPrecios(productoId:ProductoPreciosModel){ 
    return this.http.put<any>(this.server_api+'/producto/updateProductoPrecios',productoId);
  }

  public saveProducto(productoId:ProductoModel){
    return this.http.put<any>(this.server_api+'/producto/saveProducto',productoId);
  }

  public saveSubProducto(subProductoId:SubProductoModel){
    return this.http.put<any>(this.server_api+'/producto/saveSubProducto',subProductoId); 
  }

  deleteSubProducto(subProducto: SubProductoModel) {
    return this.http.put<any>(this.server_api + '/producto/deleteSubProducto', subProducto);
  }

  
  public saveProductoPrecios(productoId:ProductoPreciosModel){
    return this.http.put<any>(this.server_api+'/producto/saveProductoPrecios',productoId);
  }
  
  public saveGrupo(grupoId:GrupoModel){
    return this.http.put<any>(this.server_api+'/producto/saveGrupo',grupoId);
  }

  public saveSubGrupo(grupoId:SubGrupoModel){
    return this.http.put<any>(this.server_api+'/producto/saveSubGrupo',grupoId);
  }


  public updateGrupo(grupoId:GrupoModel){
    return this.http.put<any>(this.server_api+'/producto/updateGrupo',grupoId);
  }

  public updateSubGrupo(grupoId:SubGrupoModel){
    return this.http.put<any>(this.server_api+'/producto/updateSubGrupo',grupoId);
  }
  
  
  
  
}
