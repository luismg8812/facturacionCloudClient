import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CalculosService } from '../services/calculos.service';
import { DocumentoDetalleService } from '../services/documento-detalle.service';
import { EmpleadoModel } from '../model/empleado.model';
import { EmpleadoService } from '../services/empleado.service';
import { UsuarioModel } from '../model/usuario.model';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-movimiento-productos',
  templateUrl: './movimiento-productos.component.html',
  styleUrls: ['./movimiento-productos.component.css']
})
export class MovimientoProductosComponent implements OnInit { 

  constructor(public documentoDetalleService: DocumentoDetalleService,
    public usuarioService: UsuarioService,
    public empleadoService: EmpleadoService,
    public calculosService: CalculosService) { }

  public total: number = 0;
  public ganancia: number = 0;
  public empresaId: number;
  public dias: Array<any>;
  public empleados: Array<EmpleadoModel>;
  public usuarios: Array<UsuarioModel>;

  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;
  @ViewChild("fechaIni") fechaIni: ElementRef;
  @ViewChild("fechaFin") fechaFin: ElementRef;
  @ViewChild("empleadoPV") empleadoPV: ElementRef;
  @ViewChild("usuariosPV") usuariosPV: ElementRef;

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getEmpleados(this.empresaId);
    this.getUsuarios(this.empresaId);
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  exportTableToExcel() {
    console.log();
    let filename = "movimiento_productos";
    var dataType = 'application/vnd.ms-excel';
    var texto = [];
    let tamanoMax: number = 40;
    texto.push("Vendedor;fecha;Factura #; producto;Cantidad;valor unitario;Total;% venta;ganancia\n");
    for (let p of this.dias) {
      texto.push(p.vendedor + ";" + p.fecha_registro + ";" + p.consecutivo_dian + ";" + p.nombre + ";" + p.cantidad + ";" + p.unitario + ";" + p.parcial + ";" + p.porcentaje_venta + ";" + p.gana+ '\n');
    }
    // Specify file name
    filename = filename ? filename + '.csv' : 'excel_data.csv';
    var blob = new Blob(texto, {
      type: dataType
    });
    this.descargarArchivo(blob, filename)

  }

  descargarArchivo(contenidoEnBlob, nombreArchivo) {
    const url = window.URL.createObjectURL(contenidoEnBlob);
    const link = this.downloadZipLink.nativeElement;
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  calcular() {
   // if(this.empleadoPV.nativeElement.value==""){
   //   alert("El empleado es obligatorio");
   //   return;
   // }
    this.total = 0;
    this.ganancia = 0;
    let ini: string = this.fechaIni.nativeElement.value;
    let fin: string = this.fechaFin.nativeElement.value;
    if (ini != '' && fin != '') {
      ini = this.calculosService.fechaIniBusqueda(this.fechaIni.nativeElement.value);
      fin = this.calculosService.fechaFinBusqueda(this.fechaFin.nativeElement.value);
    } else {
      let date: Date = new Date();
      date.setDate(1);
      ini = date.toLocaleString();
      date.setDate(30);
      fin = date.toLocaleString();
    }
    this.documentoDetalleService.getDocumentosByFechaAndTipo(ini, fin,
      this.empleadoPV.nativeElement.value,
      this.usuariosPV.nativeElement.value, this.empresaId
    ).subscribe(res => {
      this.dias = res;
      for (let dia of res) {
        this.total = Number(this.total) + Number(dia.parcial);
        this.ganancia = Number(this.ganancia) + Number(dia.gana);
      }
    });
  } 

  getEmpleados(empresaId: number) {
    this.empleadoService.getEmpleadoAll(empresaId).subscribe(res => {
      this.empleados = res;
    });
  }

  nombreClienteFun(id) {

    let cliente = this.empleados.find(cliente => cliente.empleado_id == id);
    if (cliente == undefined) {
      return "";
    } else {
      return cliente.nombre;
    }
  }

  getUsuarios(empresaId: number) {
    this.usuarioService.getByUsuario(null, empresaId.toString(), null).subscribe(res => {
      this.usuarios = res;
    });
  }

}
