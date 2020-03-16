import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { ProductoModel } from '../model/producto.model';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-inventario-fisico',
  templateUrl: './inventario-fisico.component.html',
  styleUrls: ['./inventario-fisico.component.css']
})
export class InventarioFisicoComponent implements OnInit {

  public empresaId: number;
  public productosAll: Array<ProductoModel>;
  public grupoList: Array<any>;
  public proveedorList: Array<any>;
  public marcaList: Array<any>;
  public indexModificarSelect: number = 0;
  public productoEliminar: ProductoModel;
  public productoNew: ProductoModel = new ProductoModel();

  public mensaje: string = "";

  constructor(public productoService: ProductoService) { }

  ngOnInit() {
    this.empresaId = Number(sessionStorage.getItem("empresa_id"));
    this.getProductosByEmpresa(this.empresaId);

  }

  CrearProducto() {
     console.log(this.productoNew);
    let valido: boolean = true;
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
    this.productoService.saveProducto(this.productoNew).subscribe(res => {
      if (res.code == 200) {
        this.productoNew = new ProductoModel();
        $('#crearProductoModal').modal('hide');
        this.productoService.getProductosByEmpresa(this.empresaId.toString()).subscribe(async res => {
          this.productosAll = res;
          await this.delay(100);
          this.posInicial();
        });
      } else {
        alert("error creando producto, por favor inicie nuevamente la creación del producto, si persiste consulte a su proveedor");
        return;
      }
    });

  }

  limpiar() {
    this.productoNew = new ProductoModel();
  }

  cambioPrecioLista(producto: ProductoModel, element) {
    console.log(element.value);

    this.mensaje = "Producto Editado: " + producto.nombre + " valor actual: " + element.value;
    if (element.id.substr(0, 7) == 'nombre_') {
      this.mensaje = this.mensaje.replace("valor", "nombre");
      this.mensaje = this.mensaje + " nombre anterior: " + producto.nombre;
      console.log(producto.nombre);
      producto.nombre = element.value; 
    }
    if (element.id.substr(0, 9) == 'cantidad_') {
      this.mensaje = this.mensaje.replace("valor", "cantidad");
      this.mensaje = this.mensaje + " cantidad anterior: " + producto.cantidad;
      producto.cantidad = element.value;
    }
    if (element.id.substr(0, 6) == 'costo_') {
      this.mensaje = this.mensaje.replace("valor", "costo");
      this.mensaje = this.mensaje + " costo anterior: " + producto.costo;
      producto.costo = element.value;
    }
    if (element.id.substr(0, 8) == 'publico_') {
      this.mensaje = this.mensaje.replace("valor", "costo publico");
      this.mensaje = this.mensaje + " costo publico anterior: " + producto.costo_publico;
      producto.costo_publico = element.value;
    }
    if (element.id.substr(0, 9) == 'impuesto_') {
      this.mensaje = this.mensaje.replace("valor", "impuesto");
      this.mensaje = this.mensaje + " impuesto anterior: " + producto.impuesto;
      console.log(producto.impuesto);
      producto.impuesto = element.value;
    }
    if (element.id.substr(0, 8) == 'balanza_') {
      this.mensaje = this.mensaje.replace("valor", "balanza");
      this.mensaje = this.mensaje + " balanza anterior: " + producto.balanza;
      producto.balanza = element.value;
    }
    if (element.id.substr(0, 7) == 'barras_') {
      this.mensaje = this.mensaje.replace("valor", "codigo barras");
      this.mensaje = this.mensaje + " codigo barras anterior: " + producto.codigo_barras;
      producto.codigo_barras = element.value;
    }
    if (element.id.substr(0, 6) == 'promo_') {
      this.mensaje = this.mensaje.replace("valor", "promo");
      this.mensaje = this.mensaje + " promo anterior: " + producto.promo;
      producto.promo = element.value;
    }
    if (element.id.substr(0, 13) == 'public_promo_') {
      this.mensaje = this.mensaje.replace("valor", "publico promo");
      this.mensaje = this.mensaje + " publico promo anterior: " + producto.pub_promo;
      producto.pub_promo = element.value;
    }
    if (element.id.substr(0, 8) == 'kg_promo') {
      this.mensaje = this.mensaje.replace("valor", "kg_promo");
      this.mensaje = this.mensaje + " kg_promo anterior: " + producto.kg_promo;
      producto.kg_promo = element.value;
    }
    this.productoService.updateProducto(producto).subscribe(async res => {
      if (res.code == 200) {

      } else {
        alert("error actualizando la cantidad del producto en el inventario, pero el documento es correcto");
        return;
      }
    });
  }

  seleccionarEliminarItem(producto: ProductoModel) {
    this.productoEliminar = producto;
    this.productoService.inactivar(producto).subscribe(async res => {
      this.productoService.getProductosByEmpresa(this.empresaId.toString()).subscribe(async res => {
        this.productosAll = res;
        await this.delay(100);
        this.posInicial();
      });
    });
  }



  indexFocus(producto: ProductoModel) {
    for (var i = 0; i < this.productosAll.length; i++) {
      if (this.productosAll[i].producto_id ==
        producto.producto_id) {
        this.indexModificarSelect = i;
        break;
      }
    }
  }


  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(async res => {
      this.productosAll = res;
      await this.delay(100);
      this.posInicial();
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  posInicial() {
    $("#nombre_" + this.productosAll[0].producto_id).focus();
    console.log("#nombre_" + this.productosAll[0].producto_id);
    $("#nombre_" + this.productosAll[0].producto_id).select();
  }

  validar(prefix: string) {
    if (this.productosAll.length > (this.indexModificarSelect + 1)) {
      this.indexModificarSelect = this.indexModificarSelect + 1;
      let idModificarSelect = prefix + this.productosAll[this.indexModificarSelect].producto_id;
      $("#" + idModificarSelect).focus();
      $("#" + idModificarSelect).select();

    }
  }

  validarBajar(prefix: string) {
    if (0 < this.indexModificarSelect) {
      this.indexModificarSelect = this.indexModificarSelect - 1;
      let idModificarSelect = prefix + this.productosAll[this.indexModificarSelect].producto_id;
      $("#" + idModificarSelect).focus();
      $("#" + idModificarSelect).select();
    }
  }

  validarDerecha(prefix: string) {
    let idModificarSelect = prefix + this.productosAll[this.indexModificarSelect].producto_id;
    $("#" + idModificarSelect).focus();
    $("#" + idModificarSelect).select();
  }

  controlTeclas(event, element) {
    // this.mensaje="";
    if (event.keyCode == 40) { //cuando se presiona la tacla abajo
      console.log(element.id.substr(0, 14));
      if (element.id.substr(0, 7) == 'borrar_') {
        if (this.productosAll.length > (this.indexModificarSelect + 1)) {
          this.indexModificarSelect = this.indexModificarSelect + 1;
          let idModificarSelect = "borrar_" + this.productosAll[this.indexModificarSelect].producto_id;
          $("#" + idModificarSelect).focus();
        }
      }
      if (element.id.substr(0, 7) == 'nombre_') {
        this.validar('nombre_');
        return;
      }
      if (element.id.substr(0, 9) == 'cantidad_') {
        this.validar('cantidad_');
        return;
      }
      if (element.id.substr(0, 6) == 'costo_') {
        this.validar('costo_');
        return;
      }
      if (element.id.substr(0, 8) == 'publico_') {
        this.validar('publico_');
        return;
      }
      if (element.id.substr(0, 9) == 'impuesto_') {
        this.validar('impuesto_');
        return;
      }
      if (element.id.substr(0, 8) == 'balanza_') {
        this.validar('balanza_');
        return;
      }
      if (element.id.substr(0, 7) == 'barras_') {
        this.validar('barras_');
        return;
      }
      if (element.id.substr(0, 6) == 'promo_') {
        this.validar('promo_');
        return;
      }
      if (element.id.substr(0, 13) == 'public_promo_') {
        this.validar('public_promo_');
        return;
      }
      if (element.id.substr(0, 8) == 'kg_promo') {
        this.validar('kg_promo');
        return;
      }

    }
    if (event.keyCode == 38) { //cuando se presiona la tacla arriba
      if (element.id.substr(0, 7) == 'borrar_') {
        this.validarBajar('borrar_');
        return;
      }
      if (element.id.substr(0, 7) == 'nombre_') {
        this.validarBajar('nombre_');
        return;
      }
      if (element.id.substr(0, 9) == 'cantidad_') {
        this.validarBajar('cantidad_');
        return;
      }
      if (element.id.substr(0, 6) == 'costo_') {
        this.validarBajar('costo_');
        return;
      }
      if (element.id.substr(0, 8) == 'publico_') {
        this.validarBajar('publico_');
        return;
      }
      if (element.id.substr(0, 9) == 'impuesto_') {
        this.validarBajar('impuesto_');
        return;
      }
      if (element.id.substr(0, 8) == 'balanza_') {
        this.validarBajar('balanza_');
        return;
      }
      if (element.id.substr(0, 7) == 'barras_') {
        this.validarBajar('barras_');
        return;
      }
      if (element.id.substr(0, 6) == 'promo_') {
        this.validarBajar('promo_');
        return;
      }
      if (element.id.substr(0, 13) == 'public_promo_') {
        this.validarBajar('public_promo_');
        return;
      }
      if (element.id.substr(0, 8) == 'kg_promo') {
        this.validarBajar('kg_promo');
        return;
      }
    }
    if (event.keyCode == 39) { //cuando se presiona la tacla derecha
      if (element.id.substr(0, 7) == 'borrar_') {
        this.validarDerecha('nombre_');
        return;
      }
      if (element.id.substr(0, 7) == 'nombre_') {
        this.validarDerecha('cantidad_');
        return;
      }
      if (element.id.substr(0, 9) == 'cantidad_') {
        this.validarDerecha('costo_');
        return;
      }
      if (element.id.substr(0, 6) == 'costo_') {
        this.validarDerecha('publico_');
        return;
      }
      if (element.id.substr(0, 8) == 'publico_') {
        this.validarDerecha('impuesto_');
        return;
      }
      if (element.id.substr(0, 9) == 'impuesto_') {
        this.validarDerecha('balanza_');
        return;
      }
      if (element.id.substr(0, 8) == 'balanza_') {
        this.validarDerecha('barras_');
        return;
      }
      if (element.id.substr(0, 7) == 'barras_') {
        this.validarDerecha('promo_');
        return;
      }
      if (element.id.substr(0, 6) == 'promo_') {
        this.validarDerecha('public_promo_');
        return;
      }
      if (element.id.substr(0, 13) == 'public_promo_') {
        this.validarDerecha('kg_promo');
        return;
      }
    }
    if (event.keyCode == 37) { //cuando se presiona la tacla izq
      console.log(element.id);
      if (element.id.substr(0, 7) == 'nombre_') {
        this.validarDerecha('borrar_');
        return;
      }
      if (element.id.substr(0, 9) == 'cantidad_') {
        this.validarDerecha('nombre_');
        return;
      }
      if (element.id.substr(0, 6) == 'costo_') {
        this.validarDerecha('cantidad_');
        return;
      }
      if (element.id.substr(0, 8) == 'publico_') {
        this.validarDerecha('costo_');
        return;
      }
      if (element.id.substr(0, 9) == 'impuesto_') {
        this.validarDerecha('publico_');
        return;
      }
      if (element.id.substr(0, 8) == 'balanza_') {
        this.validarDerecha('impuesto_');
        return;
      }
      if (element.id.substr(0, 7) == 'barras_') {
        this.validarDerecha('balanza_');
        return;
      }
      if (element.id.substr(0, 6) == 'promo_') {
        this.validarDerecha('barras_');
        return;
      }
      if (element.id.substr(0, 13) == 'public_promo_') {
        this.validarDerecha('promo_');
        return;
      }
      if (element.id.substr(0, 8) == 'kg_promo') {
        this.validarDerecha('public_promo_');
        return;
      }
    }

  }

}
