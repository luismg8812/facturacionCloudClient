import { Component, OnInit } from '@angular/core';
import { EmpresaModel } from 'src/app/model/empresa.model';
import { ProductoModel } from 'src/app/model/producto.model';
import { TrasladoModel } from 'src/app/model/traslado.model';
import { TrasladoDetalleModel } from 'src/app/model/trasladoDetalle.model';
import { CalculosService } from 'src/app/services/calculos.service';
import { ProductoService } from 'src/app/services/producto.service';
import { TrasladosService } from 'src/app/services/traslados.service';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-aceptacion-mercancia',
  templateUrl: './aceptacion-mercancia.component.html',
  styleUrls: ['./aceptacion-mercancia.component.css']
})
export class AceptacionMercanciaComponent implements OnInit {

  constructor(public calculosService: CalculosService,
    public trasladosService: TrasladosService,
    public productoService: ProductoService,
    public usuarioService: UsuarioService) { }

  public fechaI: string = "";
  public trasladosList: Array<TrasladoModel>;
  public empresaList: Array<EmpresaModel>;
  public trasladoSelect: TrasladoModel = new TrasladoModel();
  public trasladoDetalleSelectList: Array<TrasladoDetalleModel> = [];
  public usuarioId: number;
  public empresaId: number;

  ngOnInit() {
    this.fechasBusqueda();
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getEmpresas();

  }

  fechasBusqueda() {
    let date: Date = new Date();
    let mes: string = "" + (date.getMonth() + 1);
    if (mes.length == 1) {
      mes = '0' + mes;
    }
    let ano = date.getFullYear();
    this.fechaI = ano + "-" + mes + "-" + '01';
    console.log(this.fechaI);
  }

  gestionTraslado(traslado: TrasladoModel) {
    $('#gestionModal').modal('show');
    this.trasladoSelect = traslado;
    this.trasladosService.getTrasladoDetalleByTrasladoId(traslado.traslado_id).subscribe(res => {
      this.trasladoDetalleSelectList = res;
      console.log(res);
    });
  }

  isOk(t: TrasladoDetalleModel) {
    return (Number(t.cantidad_aceptada) + Number(t.cantidad_rechazada) == t.cantidad_traslado) ? 'OK' : '';
  }

  compararCantidad(trasladoDetalle: TrasladoDetalleModel, element) {
    if (element.value == "") {
      return;
    }
    if (element.value < 0) {
      alert("El valor no puede ser negativo");
      return;
    }
    if (isNaN(element.value)) {
      alert("no es numérico:" + element.value);
      return;
    }
    if (element.value > trasladoDetalle.cantidad_traslado) {
      alert("La cantidad aceptada no puede ser mayor que la cantidad solicitada para el traslado");
      return;
    }
    trasladoDetalle.cantidad_aceptada = element.value;
    trasladoDetalle.cantidad_rechazada = Number(trasladoDetalle.cantidad_traslado) - Number(element.value);
    console.log(element.value);
    console.log(trasladoDetalle);
  }

  gestionar() {
    let traslado:number = 0;
    let aceptado:number = 0;
    for (let d of this.trasladoDetalleSelectList) {
      traslado = Number(traslado) + Number(d.cantidad_traslado);
      aceptado = Number(aceptado) + Number(d.cantidad_aceptada) + Number(d.cantidad_rechazada);
    }
    if (traslado.toString() != aceptado.toString()) {
      alert("No se ha gestionado todos los items");
      return;
    }
    this.trasladoSelect.estado = 1;
    this.trasladoSelect.usuario_aprueba_id = this.usuarioId;
    this.trasladosService.updateTraslado(this.trasladoSelect).subscribe(resTras => {//falta
      if (resTras.code == 200) {
        $('#gestionModal').modal('hide');
        this.trasladosService.deleteTrasladoDetalle(this.trasladoSelect).subscribe(resDelete => {//falta
          for (let p of this.trasladoDetalleSelectList) {
            p.traslado_detalle_id = null;
            p.estado = 1;
            p.traslado_id = this.trasladoSelect.traslado_id;
            this.trasladosService.saveTrasladoDetalle(p).subscribe();
            this.productoService.getProductoById(p.producto_id.toString(), this.trasladoSelect.empresa_origen_id.toString()).subscribe(res => {
              let producto: ProductoModel = res[0];
              producto.cantidad = Number(producto.cantidad) - Number(p.cantidad_aceptada);
              this.productoService.getProductoByCodBarras(producto.codigo_barras, this.trasladoSelect.empresa_destino_id.toString()).subscribe(resNew => {
                if(resNew.length>1){
                  alert("Existen productos con el mismo codigo de barras\n"+resNew[0].nombre+"\n"+resNew[1].nombre);
                }
                let productoNew: ProductoModel = resNew[0];
                if (productoNew == undefined) {
                  console.log("Se crea nuevo producto");
                  productoNew = new ProductoModel();
                  productoNew.porcentaje_venta = producto.porcentaje_venta;
                  productoNew.promo = producto.promo;
                  productoNew.proveedor_id = producto.proveedor_id;
                  productoNew.pub_promo = producto.pub_promo;
                  productoNew.registro_sanitario = producto.registro_sanitario;
                  productoNew.stock_max = producto.stock_max;
                  productoNew.stock_min = producto.stock_min;
                  productoNew.sub_grupo_id = producto.sub_grupo_id;
                  productoNew.sub_producto = producto.sub_producto;
                  productoNew.utilidad_sugerida = producto.utilidad_sugerida;
                  productoNew.varios = producto.varios;
                  productoNew.activo = producto.activo;
                  productoNew.balanza = producto.balanza;
                  productoNew.cantidad = 0;
                  productoNew.codigo_barras = producto.codigo_barras;
                  productoNew.costo = producto.costo;
                  productoNew.costo_publico = producto.costo_publico;
                  productoNew.cum = producto.cum;
                  productoNew.empresa_id = this.trasladoSelect.empresa_destino_id;
                  productoNew.estado = producto.estado;
                  productoNew.fecha_registro = new Date();
                  productoNew.fecha_vencimiento = producto.fecha_vencimiento;
                  productoNew.granel = producto.granel;
                  productoNew.grupo_id = producto.grupo_id;
                  productoNew.impuesto = producto.impuesto;
                  productoNew.kg_promo = producto.kg_promo;
                  productoNew.laboratorio = producto.laboratorio;
                  productoNew.lote = producto.lote;
                  productoNew.marca_id = producto.marca_id;
                  productoNew.nombre = producto.nombre;
                  productoNew.peso = producto.peso;
                }
                productoNew.cantidad = Number(productoNew.cantidad) + Number(p.cantidad_aceptada);
                if(productoNew.producto_id==null){
                  console.log("se crea producto");
                  this.productoService.saveProducto(productoNew).subscribe(save => {
                  });
                }else{
                  console.log("se edita producto");
                  this.productoService.updateProducto(productoNew).subscribe(save => {
                  });
                }
                this.productoService.updateProducto(producto).subscribe(save => {
                });
                
              });
            });
          }
        });
      }
    });
    //creacion de pruductos
    //
  }

  buscarTraslados(empresaOrigen, empresaDestino, fechaInicial, fechaFinal, estado) {
    let ini: string = fechaInicial.value;
    let fin: string = fechaFinal.value;
    let empresaOrigenId = "";
    let empresaDestinoId = "";
    if (ini != '' && fin != '') {

      ini = this.calculosService.fechaIniBusqueda(fechaInicial.value);
      fin = this.calculosService.fechaFinBusqueda(fechaFinal.value);

    } else {
      let date: Date = new Date();
      date.setDate(1);
      ini = date.toLocaleString();
      date.setDate(30);
      fin = date.toLocaleString();
    }
    if (empresaOrigen.value != "") {
      empresaOrigenId = "" + empresaOrigen.value;
    }
    if (empresaDestino.value != "") {
      empresaDestinoId = "" + empresaOrigen.value;
    }
    this.trasladosService.getTraslados(empresaOrigenId, empresaDestinoId, ini, fin, estado.value).subscribe(res => {
      this.trasladosList = res;
    });
  }

  nombreEmpresa(id) {
    if (id == null) {
      return "";
    }
    let tipo = this.empresaList.find(tipos => tipos.empresa_id == id);
    if (tipo == undefined) {
      return "";
    } else {
      return tipo.nombre;
    }
  }

  getEmpresas() {
    this.usuarioService.getEmpresas().subscribe((res) => {
      this.empresaList = res;
    });
  }


}
