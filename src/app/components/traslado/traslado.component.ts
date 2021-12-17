import { Component, OnInit } from '@angular/core';
import { TrasladoDetalleModel } from 'src/app/model/trasladoDetalle.model';
import { EmpresaModel } from 'src/app/model/empresa.model';
import { ProductoModel } from 'src/app/model/producto.model';
import { RequerimientoModel } from 'src/app/model/requerimiento.model';
import { RequerimientoDetalleModel } from 'src/app/model/requerimientoDetalle.model';
import { TrasladoModel } from 'src/app/model/traslado.model';
import { CalculosService } from 'src/app/services/calculos.service';
import { ProductoService } from 'src/app/services/producto.service';
import { TrasladosService } from 'src/app/services/traslados.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivacionModel } from 'src/app/model/activacion';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-traslado',
  templateUrl: './traslado.component.html',
  styleUrls: ['./traslado.component.css']
})
export class TrasladoComponent implements OnInit {

  public fechaI: string = "";
  public empresaList: Array<EmpresaModel>;
  public trasladosList: Array<TrasladoModel>;
  public trasladoSelect: TrasladoModel = new TrasladoModel();
  public requerimientosList: Array<RequerimientoModel> = [];
  public productosSelectList: Array<RequerimientoDetalleModel> = [];
  public trasladoDetalleSelectList: Array<TrasladoDetalleModel> = [];
  public productosAll: Array<ProductoModel>;
  public empresaId: number;
  public productoIdSelect: ProductoModel;
  public usuarioId: number;
  public activaciones: Array<ActivacionModel>;
  public cantidadesNegativasActivo: boolean = false;

  readonly CANTIDADES_NEGATIVAS: string = '28';

  constructor(public usuarioService: UsuarioService,
    public calculosService: CalculosService,
    public productoService: ProductoService,
    public trasladosService: TrasladosService) { }


  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.fechasBusqueda();
    this.getEmpresas();
    this.getProductosByEmpresa(this.empresaId);
    this.getActivaciones(this.usuarioId);
  }

  crearTraslado() {
    this.trasladoSelect = new TrasladoModel();
    this.trasladoSelect.usuario_crea_id = this.usuarioId;
    this.trasladoDetalleSelectList = [];
    $('#crearTrasladoModal').modal('show');

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

  selectEmpresaOrigen(empresaId) {
    if (empresaId != "") {
      this.trasladoSelect.empresa_origen_id = empresaId.value;
    }

  }

  selectEmpresaDestino(empresaId) {
    if (empresaId != "") {
      this.trasladoSelect.empresa_destino_id = empresaId.value;
    }
  }

  seleccionarRequerimiento(requerimiento: RequerimientoModel) {
    this.trasladoSelect.requerimiento_id = requerimiento.requerimiento_id;
    this.trasladosService.getRequerimientoDetalleByRequerimientoId(requerimiento.requerimiento_id).subscribe(res => {
      if (!this.cantidadesNegativasActivo) {
        for (let t of this.productosSelectList) {
          let p = this.productosAll.find(product => product.producto_id === t.producto_id);
          if ((p.cantidad - t.cantidad) < 0) {
            alert("Está solicitando " + t.cantidad + " unidades de " + p.nombre + " pero solo tiene " + p.cantidad + " en inventario");
            return;
          }
        }
      }

      this.productosSelectList = res;
      console.log(this.productosSelectList);
      for (let t of this.productosSelectList) {
        let td: TrasladoDetalleModel = new TrasladoDetalleModel();
        td.descripcion = t.descripcion;
        td.estado = 1;
        td.fecha_registro = new Date()
        td.parcial = t.parcial;
        td.producto_id = t.producto_id;
        td.unitario = t.unitario;
        td.cantidad_traslado = t.cantidad;
        this.trasladoDetalleSelectList.push(td);
      }
    });
    $('#BuscarRequerimientoModal').modal('hide');
  }

  buscarRequerimiento(emprOrigen) {
    if (emprOrigen.value == "") {
      alert("Debe seleccionar una empresa origen primero");
      return;
    }
    $('#BuscarRequerimientoModal').modal('show');
  }

  desAgregar(d: TrasladoDetalleModel) {
    const index = this.trasladoDetalleSelectList.indexOf(d, 0);
    if (index > -1) {
      this.trasladoDetalleSelectList.splice(index, 1);
    }
  }

  articuloSelect(element) {
    console.log("articulo select:" + element.value);
    let productoNombre: string = element.value;
    this.productoIdSelect = this.productosAll.find(product => product.nombre === productoNombre);
    console.log(this.productoIdSelect);
  }

  detalleTraslado(traslado: TrasladoModel) {
    $('#detalleModal').modal('show');
    this.trasladoSelect = traslado;
    this.trasladosService.getTrasladoDetalleByTrasladoId(traslado.traslado_id).subscribe(res => {
      this.trasladoDetalleSelectList = res;
    });
  }

  agregar(cantidad, articuloPV) {
    if (cantidad.value == "") {
      alert("La cantidad es obligatoria");
      return;
    }
    console.log(this.productoIdSelect);
    if (this.productoIdSelect == undefined) {
      alert("producto no valido");
      return;
    }

    if ((Number(this.productoIdSelect.cantidad) - Number(cantidad.value)) < 0) {
      alert("La cantidad solicita no se encuentra en inventario");
      return;
    }

    let repetido = this.trasladoDetalleSelectList.find(product => product.producto_id === this.productoIdSelect.producto_id);
    if (repetido != undefined) {
      alert("El producto ya se encuentra en la lista");
      return;
    }
    let td: TrasladoDetalleModel = new TrasladoDetalleModel();
    td.descripcion = this.productoIdSelect.nombre;
    td.estado = 1;
    td.fecha_registro = new Date()
    td.parcial = Number(cantidad.value) * Number(this.productoIdSelect.costo_publico);
    td.producto_id = this.productoIdSelect.producto_id;
    td.unitario = this.productoIdSelect.costo_publico;
    td.cantidad_traslado = cantidad.value;
    this.trasladoDetalleSelectList.push(td);
    articuloPV.value = "";
    cantidad.value = "";
  }

  buscarSolicitudes(empresa, fechaInicial, fechaFinal, estado) {
    let ini: string = fechaInicial.value;
    let fin: string = fechaFinal.value;
    let empresaId = "";
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
    if (empresa.value != "") {
      empresaId = "" + empresa.value;
    }
    this.trasladosService.getRequerimientos(empresaId, ini, fin, estado.value).subscribe(res => {
      this.requerimientosList = res;
    });
  }

  confirmarTraslado() {
    if (this.trasladoSelect.empresa_destino_id == null) {
      alert("La empresa destino es obligatoria");
      return;
    }
    if (this.trasladoSelect.empresa_origen_id == null) {
      alert("La empresa origen es obligatoria");
      return;
    }
    if (this.trasladoDetalleSelectList.length == 0) {
      alert("Debe agregar productos para poderlos transfeir");
      return;
    }
    if ((this.trasladoSelect.empresa_origen_id != null) &&
      (this.trasladoSelect.empresa_destino_id == null) &&
      (this.trasladoSelect.empresa_origen_id == this.trasladoSelect.empresa_destino_id)) {
      alert("La empresa de destino y origen no pueden ser iguales");
      return;
    }
    console.log(this.trasladoSelect);
    if (this.trasladoSelect.traslado_id == null) {
      this.trasladosService.saveTraslado(this.trasladoSelect).subscribe(res => {
        if (res.code == 200) {

          console.log("requerimiento creado");
          //esto es para el editar
          this.trasladoSelect.traslado_id = res.traslado_id;

          //this.req.fecha_registro = new Date(res.fecha_registro);
          $('#crearTrasladoModal').modal('hide');
          for (let p of this.trasladoDetalleSelectList) {
            p.traslado_id = this.trasladoSelect.traslado_id;
            this.trasladosService.saveTrasladoDetalle(p).subscribe();
          }
          if (this.trasladoSelect.requerimiento_id != null) {
            this.trasladosService.getRequerimientoById(this.trasladoSelect.requerimiento_id).subscribe(res => {//falta
              res[0].estado = 1;
              this.trasladosService.updateRequerimiento(res[0]).subscribe();
            });
          }
        } else {
          alert("error creando documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    } else {
      this.trasladosService.updateTraslado(this.trasladoSelect).subscribe(res => {//falta
        if (res.code == 200) {
          $('#crearcrearTrasladoModalModal').modal('hide');
          this.trasladosService.deleteTrasladoDetalle(this.trasladoSelect).subscribe(res => {//falta
            for (let p of this.trasladoDetalleSelectList) {
              p.traslado_detalle_id = null;
              p.traslado_id = this.trasladoSelect.traslado_id;
              this.trasladosService.saveTrasladoDetalle(p).subscribe();
            }
          });
        }
      });
    }

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

  getEmpresas() {
    this.usuarioService.getEmpresas().subscribe((res) => {
      this.empresaList = res;
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

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(res => {
      this.productosAll = res;
    });
  }

  getActivaciones(user: number) {
    this.usuarioService.getActivacionByUsuario(user.toString()).subscribe(res => {
      this.activaciones = res;
      for (var e = 0; e < this.activaciones.length; e++) {
        if (this.activaciones[e].activacion_id == this.CANTIDADES_NEGATIVAS) {
          console.log("facturar cantidades negativas activo ");
          this.cantidadesNegativasActivo = true;
        }

      }
    });
  }
}
