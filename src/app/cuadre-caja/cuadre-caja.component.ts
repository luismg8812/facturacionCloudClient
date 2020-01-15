import { Component, OnInit } from '@angular/core';
import { CuadreCajaVoModel } from '../model/cuadreCajaVo.model';
import { UsuarioService } from '../services/usuario.service';
import { ActivacionModel } from '../model/activacion';
import { DocumentoService } from '../services/documento.service';

@Component({
  selector: 'app-cuadre-caja',
  templateUrl: './cuadre-caja.component.html',
  styleUrls: ['./cuadre-caja.component.css']
})
export class CuadreCajaComponent implements OnInit {

  readonly BLOQ_CUADRE_CAJA: string = '17';
  readonly VER_REMISIONES: string = '5';

  public cuadreCajaActivo: boolean = false;
  public verRemisionesActivo: boolean = false;

  constructor(public usuarioService: UsuarioService, public documentoService: DocumentoService) {
    console.log("cuadre cargado");
    this.inicio();
    console.log("cuadre cargado");
  }

  public cuadreCajaVo: CuadreCajaVoModel = new CuadreCajaVoModel();
  public usuarioId: number;
  public empresaId: number;

  public activaciones: Array<ActivacionModel> = [];

  ngOnInit() {

  }

  inicio() {
    console.log("calculando cuadre de caja");
    this.cuadreCajaVo = new CuadreCajaVoModel;
    this.usuarioId = Number(sessionStorage.getItem("usuario_id"));
    this.empresaId = Number(sessionStorage.getItem("empresa_id"));
    //this.getActivaciones(this.usuarioId);
    this.calcularCuadreCaja(this.usuarioId, this.empresaId);
  }

  calcularCuadreCaja(user: number, company: number) {
    this.usuarioService.getActivacionByUsuario(user.toString()).subscribe(res => {
      this.activaciones = res;
      for (var e = 0; e < this.activaciones.length; e++) {
        if (this.activaciones[e].activacion_id == this.BLOQ_CUADRE_CAJA) {
          console.log("cuadre de caja bloq");
          this.cuadreCajaActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.VER_REMISIONES) {
          console.log("ver remisiones activo");
          this.verRemisionesActivo = true;
        }

      }
      if (!this.cuadreCajaActivo) {
        let tiposDocumento: number[] = [];
        let cerrado ='0'; //tra todos los documentos que no han sido cerrados 
        if (this.verRemisionesActivo) {
          tiposDocumento.push(9); //se agrea tipo documento remision si tiene activos remisiones en cuadre de caja 
        }
        tiposDocumento.push(10); // se agrega factura de venta
        this.documentoService.getCuadreCaja(tiposDocumento,  company.toString(),user.toString(), cerrado).subscribe(res => {
          console.log(res);
          this.cuadreCajaVo =res;
          this.calcularTotalIngresos();
        });      
      }
    });
    

  }

  calcularTotalIngresos(){
    let totalingresos=0.0;
    totalingresos= Number(this.cuadreCajaVo.totalFacturas)+
                   Number( this.cuadreCajaVo.base)+
                   Number( this.cuadreCajaVo.abonosDia)+
                   Number( this.cuadreCajaVo.avanceEfectivo)+
                   Number( this.cuadreCajaVo.chequesRecogidos)+
                   Number( this.cuadreCajaVo.otros)+
                   Number( this.cuadreCajaVo.base)+
                   Number( this.cuadreCajaVo.consignaciones);
    this.cuadreCajaVo.totalIngresos=totalingresos;           
  }

}
