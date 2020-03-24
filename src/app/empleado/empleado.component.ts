import { Component, OnInit } from '@angular/core';
import { EmpleadoModel } from '../model/empleado.model';
import { EmpleadoService } from '../services/empleado.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {

  constructor(public empleadoService: EmpleadoService) { }

  public empleados: Array<EmpleadoModel>;
  public empresaId: number;
  public empleadoCrear: EmpleadoModel = new EmpleadoModel();

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
  }

  buscar() {
    this.empleadoService.getEmpleadoAll(this.empresaId).subscribe(res => {
      this.empleados = res;
    });
  }

  limpiar() {
    this.empleadoCrear = new EmpleadoModel();
  }

  editarEmpleado(empleado:EmpleadoModel){
    this.empleadoCrear = empleado;
  }

  crearEmpleado() {
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.empleadoCrear.nombre == "") {
      mensageError += "nombre\n";
      valido = false;
    }
    if (this.empleadoCrear.apellido == "") {
      mensageError += "apellido\n";
      valido = false;
    }

    if (this.empleadoCrear.identificacion == "") {
      mensageError += "identificación\n";
      valido = false;
    }
    if (this.empleadoCrear.telefono == "") {
      mensageError += "telefono\n";
      valido = false;
    }
    if (valido == false) {
      alert(mensageError);
      return;
    }
    this.empleadoCrear.estado = this.empleadoCrear.estado ? "1" : "0";
    this.empleadoCrear.empresa_id = this.empresaId;
    if (this.empleadoCrear.empleado_id != 0) {
      this.empleadoService.updateEmpleado(this.empleadoCrear).subscribe(res => {
        if (res.code == 200) {
          $('#exampleModal').modal('hide');
        } else {
          alert("Algo salio mal modificando el empleado... Comunicate con soporte");
          return;
        }
      });
    } else {
      this.empleadoService.saveEmpleado(this.empleadoCrear).subscribe(res => {
        if (res.code == 200) {
          $('#exampleModal').modal('hide');
        } else {
          alert("Algo salio mal Creando el empleado... Comunicate con soporte");
          return;
        }
      });
    }
  }
}
