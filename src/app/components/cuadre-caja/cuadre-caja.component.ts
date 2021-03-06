import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivacionModel } from 'src/app/model/activacion';
import { CuadreCajaVoModel } from 'src/app/model/cuadreCajaVo.model';
import { EmpleadoModel } from 'src/app/model/empleado.model';
import { GrupoModel } from 'src/app/model/grupo.model';
import { ImpresoraEmpresaModel } from 'src/app/model/impresoraEmpresa.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ImpresionService } from 'src/app/services/impresion.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-cuadre-caja',
  templateUrl: './cuadre-caja.component.html',
  styleUrls: ['./cuadre-caja.component.css']
})
export class CuadreCajaComponent implements OnInit {

  readonly BLOQ_CUADRE_CAJA: string = '17';
  readonly VER_REMISIONES: string = '5';

  readonly TIPO_IMPRESION_PDFCARTA: number = 3;
  readonly TIPO_IMPRESION_TXT80MM: number = 1;
  readonly TIPO_IMPRESION_TXT50MM: number = 2;

  public cuadreCajaActivo: boolean = false;
  public verRemisionesActivo: boolean = false;
  public empleados: Array<EmpleadoModel>;
  public grupoList: Array<GrupoModel>;



  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;


  constructor(public usuarioService: UsuarioService,
    public empresaService: EmpresaService,
    public documentoService: DocumentoService,
    public impresionService: ImpresionService,
    public clienteService: ClienteService,
    public productoService: ProductoService,
    public empleadoService: EmpleadoService) {
    console.log("cargando cuadre de caja");
    this.inicio();
  }

  public cuadreCajaVo: CuadreCajaVoModel = new CuadreCajaVoModel();
  public usuarioId: number;
  public empresaId: number;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;

  public activaciones: Array<ActivacionModel> = [];

  ngOnInit() {

    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getImpresorasEmpresa(this.empresaId);
    this.getEmpleados(this.empresaId);
    this.getGrupos();
  }

  imprimirOrden(impresora) {
    if (Number(this.cuadreCajaVo.documentos_no_impresos) > 0) {
      alert("Existen " + this.cuadreCajaVo.documentos_no_impresos + " documentos no impresos");
      return;
    }
    if (impresora.value == "") {
      impresora.value = 1;
    }
    let tipoImpresion = 0;
    for (var i = 0; i < this.impresoraEmpresa.length; i++) {
      if (impresora.value == this.impresoraEmpresa[i].numero_impresora) {
        tipoImpresion = this.impresoraEmpresa[i].tipo_impresion_id;
      }
    }
    if (tipoImpresion == 0) {
      alert("No existen impresoras configuradas para la empresa");
      return;
    }
    let nombreUsuario = localStorage.getItem("nombreUsuario");
    console.log(tipoImpresion);
    let tituloDocumento: string = "";
    tituloDocumento = "Cuadre_caja" + "_" + nombreUsuario + "_" + this.cuadreCajaVo.diferencia + "_" + tipoImpresion;
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      let empr = res;

     
      switch (tipoImpresion) {
        case this.TIPO_IMPRESION_TXT80MM:
          this.descargarArchivo(this.impresionService.imprimirCuadreTxt80(this.cuadreCajaVo, empr[0], nombreUsuario), tituloDocumento + '.txt');
          break;
        case this.TIPO_IMPRESION_TXT50MM:
          this.descargarArchivo(this.impresionService.imprimirCuadreTxt50(this.cuadreCajaVo, empr[0], nombreUsuario), tituloDocumento + '.txt');
          break;

        default:
          alert("no tiene un tipo impresion");
          //Impresion.imprimirPDF(getDocumento(), getProductos(), usuario(), configuracion, impresora,
          //    enPantalla, e);
          break;
      }
    });
  }

  descargarArchivo(contenidoEnBlob, nombreArchivo) {
    const url = window.URL.createObjectURL(contenidoEnBlob);
    const link = this.downloadZipLink.nativeElement;
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  inicio() {
    console.log("calculando cuadre de caja");
    this.cuadreCajaVo = new CuadreCajaVoModel;
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.empresaId = Number(localStorage.getItem("empresa_id"));
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
        let cerrado = '0'; //tra todos los documentos que no han sido cerrados 
        if (this.verRemisionesActivo) {
          tiposDocumento.push(9); //se agrea tipo documento remision si tiene activos remisiones en cuadre de caja 
        }
        tiposDocumento.push(10); // se agrega factura de venta
        this.documentoService.getCuadreCaja(tiposDocumento, company.toString(), user.toString(), cerrado).subscribe(res => {
          console.log(res);
          this.cuadreCajaVo = res[0];
          this.cuadreCajaVo.total_facturas = Number(this.cuadreCajaVo.total_facturas) + Number(this.cuadreCajaVo.total_notas);
          console.log(this.cuadreCajaVo.abonos);
          this.asignarValoresNulos();
          this.calcularTotalIngresos();
          this.calcularEnCaja();
          this.calcularDiferencia();
          this.ventaEmpleados();
          this.ventaGrupos();
          this.ventaSubGrupos();
        });
      }
    });
  }

  ventaEmpleados() {

    let idEmpleados: number[] = [];
    for (let id of this.empleados) {
      idEmpleados.push(id.empleado_id);
    }
    this.documentoService.getNominaByEmpleado("", "", idEmpleados, "10").subscribe(res => {
      console.log(res);
      this.cuadreCajaVo.empleados = res;

    });

  }

  ventaGrupos() {
    this.documentoService.getVentasPorGrupos(this.usuarioId,"","",true).subscribe(res => {
      console.log(this.cuadreCajaVo);
      this.cuadreCajaVo.grupos = res;
    });

  }

  ventaSubGrupos() {
    this.documentoService.getVentasPorSubGrupos(this.usuarioId,"","",true).subscribe(res => {
      console.log(this.cuadreCajaVo);
      this.cuadreCajaVo.SubGrupos = res;
    });
  }

  asignarValoresNulos() {
    this.cuadreCajaVo.abonos = this.cuadreCajaVo.abonos == undefined ? 0 : this.cuadreCajaVo.abonos;
    this.cuadreCajaVo.avanceEfectivo = this.cuadreCajaVo.avanceEfectivo == undefined ? 0 : this.cuadreCajaVo.avanceEfectivo;
    this.cuadreCajaVo.chequesRecogidos = this.cuadreCajaVo.chequesRecogidos == undefined ? 0 : this.cuadreCajaVo.chequesRecogidos;
    this.cuadreCajaVo.otros = this.cuadreCajaVo.otros == undefined ? 0 : this.cuadreCajaVo.otros;
    this.cuadreCajaVo.base = this.cuadreCajaVo.base == undefined ? 0 : this.cuadreCajaVo.base;
    this.cuadreCajaVo.consignaciones = this.cuadreCajaVo.consignaciones == undefined ? 0 : this.cuadreCajaVo.consignaciones;
    this.cuadreCajaVo.fajos = this.cuadreCajaVo.fajos == undefined ? 0 : this.cuadreCajaVo.fajos;
    this.cuadreCajaVo.moneda = this.cuadreCajaVo.moneda == undefined ? 0 : this.cuadreCajaVo.moneda;
    this.cuadreCajaVo.varios = this.cuadreCajaVo.varios == undefined ? 0 : this.cuadreCajaVo.varios;
    this.cuadreCajaVo.gastado = this.cuadreCajaVo.gastado == undefined ? 0 : this.cuadreCajaVo.gastado;
    this.cuadreCajaVo.nomina = this.cuadreCajaVo.nomina == undefined ? 0 : this.cuadreCajaVo.nomina;
    this.cuadreCajaVo.descuento = this.cuadreCajaVo.descuento == undefined ? 0 : this.cuadreCajaVo.descuento;
    this.cuadreCajaVo.propina = this.cuadreCajaVo.propina == undefined ? 0 : this.cuadreCajaVo.propina;
    this.cuadreCajaVo.retiro_caja = this.cuadreCajaVo.retiro_caja == undefined ? 0 : this.cuadreCajaVo.retiro_caja;
  }

  calcularTotalIngresos() {
    let totalingresos = 0.0;
    totalingresos = Number(this.cuadreCajaVo.total_facturas) +
      Number(this.cuadreCajaVo.base) +
      Number(this.cuadreCajaVo.abonos) +
      Number(this.cuadreCajaVo.avanceEfectivo) +
      Number(this.cuadreCajaVo.chequesRecogidos) +
      Number(this.cuadreCajaVo.otros) +
      Number(this.cuadreCajaVo.consignaciones);
    this.cuadreCajaVo.totalIngresos = totalingresos;
  }

  calcularEnCaja() {
    let totalCaja = 0.0;
    totalCaja = Number(this.cuadreCajaVo.moneda) +
      Number(this.cuadreCajaVo.fajos) +
      Number(this.cuadreCajaVo.efectivo) +
      Number(this.cuadreCajaVo.cheques) +
      Number(this.cuadreCajaVo.tarjetas) +
      Number(this.cuadreCajaVo.varios) +
      Number(this.cuadreCajaVo.vales) +
      Number(this.cuadreCajaVo.gastado) +
      Number(this.cuadreCajaVo.nomina) +
      Number(this.cuadreCajaVo.descuento) +
      Number(this.cuadreCajaVo.propina) +
      Number(this.cuadreCajaVo.retiro_caja) +
      Number(this.cuadreCajaVo.cartera);
    this.cuadreCajaVo.totalCaja = totalCaja;
    this.calcularDiferencia();
  }

  calcularDiferencia() {
    this.cuadreCajaVo.diferencia = Number(this.cuadreCajaVo.totalIngresos) - Number(this.cuadreCajaVo.totalCaja)
  }

  getImpresorasEmpresa(empresaId: number) {
    this.clienteService.getImpresorasEmpresa(empresaId.toString()).subscribe(res => {
      this.impresoraEmpresa = res;
      console.log("impresoras configuradas en la empresa:" + res.length);
    });
  }

  getEmpleados(empresaId: number) {
    this.empleadoService.getEmpleadoAll(empresaId).subscribe(res => {
      this.empleados = res;
      console.log("lista de empleados cargados: " + this.empleados.length);
    });
  }

  getGrupos() {
    this.productoService.getGruposByEmpresa(this.empresaId.toString()).subscribe(async res => {
      this.grupoList = res;
    });
  }

}
