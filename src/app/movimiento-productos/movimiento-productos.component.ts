import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CalculosService } from '../services/calculos.service';
import { DocumentoDetalleService } from '../services/documento-detalle.service';
import { EmpleadoModel } from '../model/empleado.model';
import { EmpleadoService } from '../services/empleado.service';

@Component({
  selector: 'app-movimiento-productos',
  templateUrl: './movimiento-productos.component.html',
  styleUrls: ['./movimiento-productos.component.css']
})
export class MovimientoProductosComponent implements OnInit {

  constructor(public documentoDetalleService: DocumentoDetalleService,
    public empleadoService: EmpleadoService,
    public calculosService: CalculosService) { }

  public total: number = 0;
  public ganancia: number = 0;
  public empresaId: number;
  public dias: Array<any>;
  public empleados: Array<EmpleadoModel>;

  @ViewChild("fechaIni") fechaIni: ElementRef;
  @ViewChild("fechaFin") fechaFin: ElementRef;
  @ViewChild("empleadoPV") empleadoPV: ElementRef;
  @ViewChild("usuariosPV") usuariosPV: ElementRef;

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getEmpleados(this.empresaId);
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  calcular() {
    this.total = 0;
    this.ganancia = 0;
    let ini: string = this.fechaIni.nativeElement.value;
    let fin: string = this.fechaFin.nativeElement.value;
    if (ini != '' && fin != '') {
      ini = this.calculosService.fechaInicial1(this.fechaIni.nativeElement.value).toLocaleString();
      fin = this.calculosService.fechaFinal1(this.fechaFin.nativeElement.value).toLocaleString();
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


}
