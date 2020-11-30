import { Component, OnInit } from '@angular/core';
import { ClaseModel } from 'src/app/model.contabilidad/clase.model';
import { RowModel } from 'src/app/model.contabilidad/row.model';
import { CuentasContablesService } from 'src/app/services/cuentas-contables.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-cuentas-contables',
  templateUrl: './cuentas-contables.component.html',
  styleUrls: ['./cuentas-contables.component.css']
})
export class CuentasContablesComponent implements OnInit {

  public rows: RowModel[] = [];
  public clases: ClaseModel[] = [];
  public empresaId: number;

  readonly TIPO_CLASE: string = "Clase";
  readonly TIPO_GRUPO: string = "Grupo";
  readonly TIPO_CUENTA: string = "Cuenta";
  readonly SUB_TIPO_CUENTA: string = "SubCuenta";
  readonly AUXILIAR: string = "Auxiliar";


  constructor(public cuentasContablesService: CuentasContablesService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.inicio();
  }

  inicio() {
    this.getClases(this.empresaId);
  }

  clickPlus(row: RowModel) {
    let remove: boolean = false;
    switch (row.tipo) {
      case this.TIPO_CLASE:
        this.getGrupoByClase(row, remove);
        $("#" + row.codigo).addClass("d-none");
        $("#n_" + row.codigo).removeClass("d-none")
        break;
      case this.TIPO_GRUPO:
        this.getCuentaByGrupo(row, remove);
        $("#" + row.codigo).addClass("d-none");
        $("#n_" + row.codigo).removeClass("d-none")
        break;
      case this.TIPO_CUENTA:
        this.getSubCuentaByCuenta(row, remove);
        $("#" + row.codigo).addClass("d-none");
        $("#n_" + row.codigo).removeClass("d-none")
        break;
        case this.SUB_TIPO_CUENTA:
        this.getAuxiliarBySubCuenta(row, remove);
        $("#" + row.codigo).addClass("d-none");
        $("#n_" + row.codigo).removeClass("d-none")
        break; 
        
      default:
        break;
    }
  }

  espacio(espacio: number) {
    let retorno = espacio;
    switch (espacio) {
      case 4:
        retorno = 3;
        break;
      case 6:
        retorno = 4;
        break;
      case 8:
        retorno = 5;
        break;
      default:
        break;
    }
    return retorno;
  }

  clickMinus(row: RowModel) {
    let remove: boolean = true;
    switch (row.tipo) {
      case this.TIPO_CLASE:
        this.getGrupoByClase(row, remove);
        $("#" + row.codigo).removeClass("d-none");
        $("#n_" + row.codigo).addClass("d-none")
        break;
      case this.TIPO_GRUPO:
        this.getCuentaByGrupo(row, remove);
        $("#" + row.codigo).removeClass("d-none");
        $("#n_" + row.codigo).addClass("d-none")
        break;
      case this.TIPO_CUENTA:
        this.getSubCuentaByCuenta(row, remove);
        $("#" + row.codigo).removeClass("d-none");
        $("#n_" + row.codigo).addClass("d-none")
        break;
        case this.SUB_TIPO_CUENTA:
        this.getAuxiliarBySubCuenta(row, remove);
        $("#" + row.codigo).removeClass("d-none");
        $("#n_" + row.codigo).addClass("d-none")
        break;

      default:
        break;
    }
  }

  getCuentaByGrupo(grupoId: RowModel, remove: boolean) {
    console.log(grupoId);
    this.cuentasContablesService.getCuentaByGrupo(grupoId.id).subscribe(res => {
      let index = this.getIndex(grupoId);
      for (let g of res) {
        let row: RowModel = new RowModel();
        row.nombre = g.nombre;
        row.codigo = g.codigo;
        row.id = g.cuenta_id;
        row.tipo = this.TIPO_CUENTA;
        if (remove) {
          this.rows.splice(index + 1, 1)
        } else {
          this.rows.splice(index + 1, 0, row)
          index++;
        }

      }
      console.log("lista de clases cargadas: " + res.length);
    });
  }

  getSubCuentaByCuenta(cuentaId: RowModel, remove: boolean) {
    console.log(cuentaId);
    this.cuentasContablesService.getSubCuentaByCuenta(cuentaId.id).subscribe(res => {
      let index = this.getIndex(cuentaId);
      for (let g of res) {
        let row: RowModel = new RowModel();
        row.nombre = g.nombre;
        row.codigo = g.codigo;
        row.id = g.sub_cuenta_id;
        row.tipo = this.SUB_TIPO_CUENTA;
        if (remove) {
          this.rows.splice(index + 1, 1)
        } else {
          this.rows.splice(index + 1, 0, row)
          index++;
        }

      }
      console.log("lista de subcuetas cargadas: " + res.length);
    });
  }

  getAuxiliarBySubCuenta(subCuentaId: RowModel, remove: boolean) {
    console.log(subCuentaId);
    this.cuentasContablesService.getAuxiliarBySubCuenta(subCuentaId.id).subscribe(res => {
      let index = this.getIndex(subCuentaId);
      for (let g of res) {
        let row: RowModel = new RowModel();
        row.nombre = g.nombre;
        row.codigo = g.codigo;
        row.id = g.auxiliar_id;
        row.tipo = this.AUXILIAR;
        if (remove) {
          this.rows.splice(index + 1, 1)
        } else {
          this.rows.splice(index + 1, 0, row)
          index++;
        }

      }
      console.log("lista de subcuetas cargadas: " + res.length);
    });
  }

  getIndex(row: RowModel) {
    let index = 0;
    console.log(this.rows.length);
    for (var i = 1; i < this.rows.length; i++) {
      console.log(row.codigo + ":" + this.rows[i].codigo);
      if (row.codigo == this.rows[i].codigo) {
        index = i;
        console.log("index:" + index);
        break;
      }
    }
    return index;
  }

  getGrupoByClase(claseId: RowModel, remove: boolean) {
    this.cuentasContablesService.getGrupoByClase(claseId.id).subscribe(res => {
      let index = this.getIndex(claseId);
      for (let g of res) {
        let row: RowModel = new RowModel();
        row.nombre = g.nombre;
        row.codigo = g.codigo;
        row.id = g.grupo_contable_id;
        row.tipo = this.TIPO_GRUPO;
        if (remove) {
          this.rows.splice(index + 1, 1)
        } else {
          this.rows.splice(index + 1, 0, row)
          index++;
        }
      }
      console.log("lista de clases cargadas: " + res.length);
    });
  }

  getClases(empresaId: number) {
    this.cuentasContablesService.getClasesContables(empresaId).subscribe(res => {
      this.clases = res;
      for (let c of this.clases) {
        let row: RowModel = new RowModel();
        row.nombre = c.nombre;
        row.codigo = c.codigo;
        row.id = c.clase_id;
        row.tipo = this.TIPO_CLASE;
        this.rows.push(row);
      }
      console.log("lista de clases cargadas: " + this.clases.length);
    });
  }

}
