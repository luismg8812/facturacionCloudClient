import { Component, OnInit } from '@angular/core';
import { EmpresaModel } from 'src/app/model/empresa.model';
import { ProductoModel } from 'src/app/model/producto.model';
import { RequerimientoModel } from 'src/app/model/requerimiento.model';
import { RequerimientoDetalleModel } from 'src/app/model/requerimientoDetalle.model';
import { CalculosService } from 'src/app/services/calculos.service';
import { ProductoService } from 'src/app/services/producto.service';
import { TrasladosService } from 'src/app/services/traslados.service';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-requerimiento',
  templateUrl: './requerimiento.component.html',
  styleUrls: ['./requerimiento.component.css']
})
export class RequerimientoComponent implements OnInit {

  public fechaI: string = "";
  public empresaList: Array<EmpresaModel>;
  public productosAll: Array<ProductoModel>;
  public productosSelectList: Array<RequerimientoDetalleModel> = [];
  public requerimientosList: Array<RequerimientoModel> = [];
  public empresaId: number;
  public productoIdSelect: ProductoModel;
  public usuarioId: number;
  public req: RequerimientoModel = new RequerimientoModel();
  public total: number = 0;
  public obs:string ="";

  constructor(public usuarioService: UsuarioService,
    public productoService: ProductoService,
    public calculosService: CalculosService,
    public trasladosService: TrasladosService) { }


  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.fechasBusqueda();
    this.getEmpresas();
    this.getProductosByEmpresa(this.empresaId);
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

  crear() {

    this.req = new RequerimientoModel();
    this.req.empresa_id = this.empresaId;
    this.req.estado = 0;
    this.req.fecha_registro = new Date();
    this.req.usuario_id = this.usuarioId;
    $('#crearModal').modal('show');
    this.productosSelectList = [];
  }

  editar(r: RequerimientoModel) {
    this.req = r;
    this.total = this.req.total;
    this.obs=this.req.observacion;
    this.trasladosService.getRequerimientoDetalleByRequerimientoId(r.requerimiento_id).subscribe(res => {
      this.productosSelectList = res;
      $('#crearModal').modal('show');
    });
  }

  articuloSelect(element) {
    console.log("articulo select:" + element.value);
    let productoNombre: string = element.value;
    this.productoIdSelect = this.productosAll.find(product => product.nombre === productoNombre);
    console.log(this.productoIdSelect);
  }

  desAgregar(d: RequerimientoDetalleModel) {
    const index = this.productosSelectList.indexOf(d, 0);
    if (index > -1) {
      this.productosSelectList.splice(index, 1);
    }
    this.total = 0;
    for (let p of this.productosSelectList) {
      this.total = Number(this.total) + Number(p.parcial);
    }
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

    let repetido = this.productosSelectList.find(product => product.producto_id === this.productoIdSelect.producto_id);
    if (repetido != undefined) {
      alert("El producto ya se encuentra en la lista");
      return;
    }
    let rd: RequerimientoDetalleModel = new RequerimientoDetalleModel();
    rd.cantidad = cantidad.value;
    rd.descripcion = this.productoIdSelect.nombre;
    rd.estado = 1;
    rd.fecha_registro = new Date();
    rd.parcial = Number(cantidad.value) * Number(this.productoIdSelect.costo_publico);
    rd.unitario = this.productoIdSelect.costo_publico;
    rd.producto_id = this.productoIdSelect.producto_id;
    rd.requerimiento_id
    this.productosSelectList.push(rd);
    this.total = 0;
    articuloPV.value = "";
    cantidad.value = "";
    for (let p of this.productosSelectList) {
      this.total = Number(this.total) + Number(p.parcial);
    }

  }

  buscarSolicitudes(empresa, fechaInicial, fechaFinal) {
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
    this.trasladosService.getRequerimientos(empresaId, ini, fin).subscribe(res => {
      this.requerimientosList = res;
    });
  }

  confirmarRequerimiento() {
    console.log(this.req.observacion);
    this.req.total = this.total;
    this.req.observacion = this.obs;
    if (this.req.requerimiento_id == null) {
      this.trasladosService.saveRequerimiento(this.req).subscribe(res => {
        if (res.code == 200) {

          console.log("requerimiento creado");
          //esto es para el editar
          this.req.requerimiento_id = res.requerimiento_id;

          //this.req.fecha_registro = new Date(res.fecha_registro);
          $('#crearModal').modal('hide');
          for (let p of this.productosSelectList) {
            p.requerimiento_id = this.req.requerimiento_id;
            this.trasladosService.saveRequerimientoDetalle(p).subscribe();
          }
        } else {
          alert("error creando documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    } else {
      this.trasladosService.updateRequerimiento(this.req).subscribe(res => {//falta
        if (res.code == 200) {
          $('#crearModal').modal('hide');
          this.trasladosService.deleteRequerimientoDetalle(this.req).subscribe(res => {//falta
            for (let p of this.productosSelectList) {
              p.requerimiento_detalle_id=null;
              p.requerimiento_id = this.req.requerimiento_id;
              this.trasladosService.saveRequerimientoDetalle(p).subscribe();
            }
          });
        }
      });
    }

  }

  detalleRequerimiento(requerimiento: RequerimientoModel) {
    $('#detalleModal').modal('show');
    this.req = requerimiento;
    this.total = this.req.total;
    this.trasladosService.getRequerimientoDetalleByRequerimientoId(requerimiento.requerimiento_id).subscribe(res => {
      this.productosSelectList = res;
    });
  }

  getEmpresas() {
    this.usuarioService.getEmpresas().subscribe((res) => {
      this.empresaList = res;
    });
  }

  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(res => {
      this.productosAll = res;
    });
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
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
}
