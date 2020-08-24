import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioModel } from '../model/usuario.model';
import { CalculosService } from '../services/calculos.service';
import { RetirosCajaModel } from '../model/retirosCaja.model';
import { DocumentoService } from '../services/documento.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-retiros-caja',
  templateUrl: './retiros-caja.component.html',
  styleUrls: ['./retiros-caja.component.css']
})
export class RetirosCajaComponent implements OnInit {

  constructor( public usuarioService: UsuarioService,
    public documentoService: DocumentoService,
    public calculosService: CalculosService) { 
   
  }

  @ViewChild("fechaIni") fechaIni: ElementRef;
  @ViewChild("fechaFin") fechaFin: ElementRef;
  @ViewChild("realizadoPor") realizadoPor: ElementRef;
  @ViewChild("realizadoA") realizadoA: ElementRef;
  public empresaId: number;
  public usuarios: Array<UsuarioModel>;
  public retiros: Array<RetirosCajaModel>;
  public retiroNew: RetirosCajaModel = new RetirosCajaModel;


  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getUsuarios(this.empresaId);
  }

  calcular() {
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
    this.documentoService.getRetirosByFechaAndTipo(ini, fin,
      this.realizadoPor.nativeElement.value,this.realizadoA.nativeElement.value, this.empresaId
    ).subscribe(res => {
      this.retiros = res;
    });
  }

  crearRetiro() {
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.retiroNew.usuario_aplica_id== null) {
      mensageError += "usuario aplica\n";
      valido = false;
    }
    if (this.retiroNew.usuario_hace_id == null) {
      mensageError += "usuario hace\n";
      valido = false;
    }
    if (this.retiroNew.valor <= 0) {
      mensageError += "el valor debe ser mayor de 0 \n";
      valido = false;
    }
   
    if (valido == false) {
      alert(mensageError);
      return;
    }
 
    let empresaId = localStorage.getItem("empresa_id");
    this.retiroNew.empresa_id = Number(empresaId);
    let rolId: number[] = [];

 
    if (this.retiroNew.retiro_caja_id != null) {
     console.log("modificar retiro");
    } else {  
      this.documentoService.saveRetiro(this.retiroNew ).subscribe(res => {
        if (res.code == 200) {
          $('#exampleModal').modal('hide');
          this.retiroNew=new RetirosCajaModel();
        } else {
          alert("Algo salio mal Creando el usuario... Comunicate con soporte");
          return;
        }
      });
    }

  }

  nombreUsuarioFun(id) {

    let cliente = this.usuarios.find(cliente => cliente.usuario_id == id);
    if (cliente == undefined) {
      return "";
    } else {
      return cliente.nombre;
    }
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  getUsuarios(empresaId: number) {
    this.usuarioService.getByUsuario(null, empresaId.toString(), null).subscribe(res => {
      this.usuarios = res;
    });
  }

}
