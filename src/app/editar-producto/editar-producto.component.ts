import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductoModel } from '../model/producto.model';
import { ProductoService } from '../services/producto.service';
import { ProveedorModel } from '../model/proveedor.model';
import { ProveedorService } from '../services/proveedor.service';
import { GrupoModel } from '../model/grupo.model';
import { SubGrupoModel } from '../model/subGrupo.model';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {
  public productoNew: ProductoModel = new ProductoModel();
  public productosAll: Array<ProductoModel>;
  public empresaId: number;
  public proveedores: Array<ProveedorModel>;
  public marcaList: Array<any>;
  public grupoList: Array<GrupoModel>;
  public subGrupoList: Array<SubGrupoModel>;
  @ViewChild("articuloPV1") articuloPV1: ElementRef;

  constructor(public productoService:ProductoService,
    public proveedorService:ProveedorService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getProductosByEmpresa(this.empresaId);
    this.getProveedores(this.empresaId);
    this.getGrupos(this.empresaId);
    this.getSubGrupos(this.empresaId);
  }

  CrearProducto() {
    console.log(this.productoNew);
   let valido: boolean = true;
   if (this.productoNew.producto_id == null) {
    alert("No hay productos seleccionados");
    return;
   }
   let mensageError: string = "Son obligatorios:\n ";
   if (this.productoNew.nombre == "") {
     mensageError += "nombre\n";
     valido = false;
   }
   if (valido == false) {
     alert(mensageError);
     return;
   }

   this.productoNew.empresa_id = this.empresaId;
   this.productoService.updateProducto(this.productoNew).subscribe(res => {
     if (res.code == 200) {
       this.productoNew = new ProductoModel();
       $('#editarProduct').modal('hide');
       this.productoService.getProductosByEmpresa(this.empresaId.toString()).subscribe(async res => {
         this.productosAll = res;
       });
     } else {
       alert("error creando producto, por favor inicie nuevamente la creación del producto, si persiste consulte a su proveedor");
       return;
     }
   });
   this.productoNew= new ProductoModel();
   this.articuloPV1.nativeElement.value="";
 }

 async scapeTecla(element) {
 }

 delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  getGrupos(empresaId: number) {
    this.productoService.getGruposByEmpresa(empresaId.toString()).subscribe(res => {
      this.grupoList = res;
      console.log("lista de grupos cargados: " + this.grupoList.length);
    });
  }

  getSubGrupos(empresaId: number) {
    this.productoService.getSubGruposByEmpresa(empresaId.toString()).subscribe(res => {
      this.subGrupoList = res;
      console.log("lista de grupos cargados: " + this.subGrupoList.length);
    });
  }

  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(res => {
      this.productosAll = res;
    });
  }

  articuloSelect(element) {
    console.log("articulo select:" + element.value);
    let productoNombre: string = element.value;
    this.productoNew = this.productosAll.find(product => product.nombre === productoNombre);
    console.log(this.productoNew);
  }


  getProveedores(empresaId: number) {
    this.proveedorService.getProveedoresByEmpresa(empresaId.toString()).subscribe(res => {
      this.proveedores = res;
      console.log("lista de proveedores cargados: " + this.proveedores.length);
    });
  }

}
