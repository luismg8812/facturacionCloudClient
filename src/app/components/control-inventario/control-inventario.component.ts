import { Component, OnInit } from '@angular/core';
import { ControlInventarioModel } from 'src/app/model/controlInventario.model';
import { ControlInventarioService } from 'src/app/services/control-inventario.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-control-inventario',
  templateUrl: './control-inventario.component.html',
  styleUrls: ['./control-inventario.component.css']
})
export class ControlInventarioComponent implements OnInit {

  constructor(public controlInventarioService: ControlInventarioService) { }

  public empresaId: number;
  public controInventarioList: Array<ControlInventarioModel>;

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.buscarInventario();
  }

  buscarInventario() {
    this.controlInventarioService.getControlInventario(this.empresaId).subscribe((res) => {
      this.controInventarioList = res;
      console.log(res);
    });
  }

}
