import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductoModel } from '../model/producto.model';
import { ProductoService } from '../services/producto.service';
import { ProveedorModel } from '../model/proveedor.model';
import { ProveedorService } from '../services/proveedor.service';
import { GrupoModel } from '../model/grupo.model';
import { SubGrupoModel } from '../model/subGrupo.model';
import { ProductoPreciosModel } from '../model/productoPrecios.model';
import { SubProductoModel } from '../model/subProducto.model';
import { AuditoriaModel } from '../model/auditoria.model';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {
  public productoNew: ProductoModel = new ProductoModel();
  public productoPrecioNew:ProductoPreciosModel=new ProductoPreciosModel();
  public productosAll: Array<ProductoModel>;
  public empresaId: number;
  public usuarioId: number; 
  public proveedores: Array<ProveedorModel>;
  public marcaList: Array<any>;
  public grupoList: Array<GrupoModel>;
  public subGrupoList: Array<SubGrupoModel>;
  public subProductoList:Array<SubProductoModel>=[];
  public fechaI: string = "";
  
  @ViewChild("articuloPV1") articuloPV1: ElementRef;

  constructor(public productoService:ProductoService,
    public proveedorService:ProveedorService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
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
   this.productoNew.fecha_registro=new Date(this.fechaI);
   this.productoNew.empresa_id = this.empresaId;

   let auditoria:AuditoriaModel=new AuditoriaModel();
   auditoria.aplicativo="inventario fisico";
   auditoria.empresa_id= this.empresaId;
   auditoria.observacion=" se cambia datos del producto id="+this.productoNew.producto_id+" "+this.productoNew.nombre;
   auditoria.usuario_id=this.usuarioId;
   auditoria.accion_auditoria_id=1; // cambios por inventario fisico
   auditoria.valor_actual=""+this.productoNew.costo_publico;
   this.productoService.updateProducto(this.productoNew).subscribe(res => {
     if (res.code == 200) {
      
       $('#editarProduct').modal('hide');
       this.productoService.getProductosByEmpresa(this.empresaId.toString()).subscribe(async res => {
         this.productosAll = res;
       });   
       if(this.productoPrecioNew.producto_id==null){
         this.productoPrecioNew.producto_id=res.producto_id;
        this.productoService.saveProductoPrecios(this.productoPrecioNew).subscribe();
       }else{
        this.productoService.updateProductoPrecios(this.productoPrecioNew).subscribe();
       }
       this.productoNew = new ProductoModel();
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

agregarSubProducto(articulo,cantidad){
  let producto:ProductoModel = this.productosAll.find(product => product.nombre === articulo.value);
  if(this.productoNew.producto_id==null){
    alert("Debe seleccionar un producto padre");
    return;
  }
  if(producto==undefined){
    alert("El sub producto es obligatorio");
    return;
  }
  if(cantidad.value==""){
    alert("La cantidad es obligatoria");
    return;
  }
  else{
    if (isNaN(Number(cantidad.value))) {
      alert("La cantidad no es numérica");
      return;
    }
  }
  for(let s of this.subProductoList){
    if(this.productoNew.producto_id==producto.producto_id){
      alert("No se puede agregar el mismo producto");
      return;
    }
    if(s.producto_hijo==producto.producto_id){
      alert("El producto ya se encuentra en la lista");
    }
  }
  let subProducto:SubProductoModel=new SubProductoModel();
  subProducto.producto_padre=this.productoNew.producto_id;
  subProducto.producto_hijo=producto.producto_id;
  subProducto.cantidad=cantidad.value;
  subProducto.estado=1;
  this.productoService.saveSubProducto(subProducto).subscribe(res => {
    subProducto.sub_producto_id = res.sub_producto_id;
    this.subProductoList.push(subProducto);
  });


}

nombreClienteFun(id) {
  let p = this.productosAll.find(productos => productos.producto_id == id);
  if (p == undefined) {
    return "";
  } else {
    return p.nombre;
  }
} 

eliminarSubProducto(subProducto:SubProductoModel){
  for (var i = 0; i < this.subProductoList.length; i++) {
    if (this.subProductoList[i].producto_hijo == subProducto.producto_hijo) {
      this.subProductoList.splice(i, 1);
      this.productoService.deleteSubProducto(subProducto).subscribe();
    }
  }
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
    this.productoService.getProductoPreciosById(this.productoNew.producto_id).subscribe(res => {
      if(res.length>0){
        this.productoPrecioNew=res[0];
        
      }else{
        this.productoPrecioNew=new ProductoPreciosModel();
      }
    });
    this.productoService.getSubProductoByProductoId(this.productoNew.producto_id).subscribe(res => {
     this.subProductoList=res;
    });
    this.fechasBusqueda(this.productoNew.fecha_vencimiento)
    console.log(this.productoNew);
  }

  fechasBusqueda(da:Date) {
    let date: Date = new Date(da);
    let mes: string = "" + (date.getMonth() + 1);
    let dia: string = "" + date.getDate();
    if (mes.length == 1) {
      mes = '0' + mes;
    }
    if (dia.length == 1) {
      dia = '0' + dia;
    }
    let ano = date.getFullYear();
    this.fechaI = ano + "-" + mes + "-" + dia;
    console.log(this.fechaI);
  }

  getProveedores(empresaId: number) {
    this.proveedorService.getProveedoresByEmpresa(empresaId.toString()).subscribe(res => {
      this.proveedores = res;
      console.log("lista de proveedores cargados: " + this.proveedores.length);
    });
  }

}
