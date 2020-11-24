import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BonoModel } from 'src/app/model/bono.model';
import { ClienteModel } from 'src/app/model/cliente.model';
import { EmpresaModel } from 'src/app/model/empresa.model';
import { ImpresoraEmpresaModel } from 'src/app/model/impresoraEmpresa.model';
import { TipoBonoModel } from 'src/app/model/tipoBono.model';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { VehiculoModel } from 'src/app/model/vehiculo.model';
import { BonoService } from 'src/app/services/bono.service';
import { CalculosService } from 'src/app/services/calculos.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ImpresionService } from 'src/app/services/impresion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { BonoVOModel } from 'src/app/vo/bonoVO.model';
import { FacturaModel } from 'src/app/vo/factura.model';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-bonos',
  templateUrl: './bonos.component.html',
  styleUrls: ['./bonos.component.css']
})
export class BonosComponent implements OnInit {

  public fechaI: string = "";
  public empresaId: number;
  public clientes: Array<ClienteModel>;
  public bonosList: Array<any>;
  public usuarioId: number;
  public usuarioList: Array<UsuarioModel> = [];
  public bonoNew: BonoModel = new BonoModel();
  public tipoBonoList: Array<TipoBonoModel>;
  public vehiculosEmpresa: Array<VehiculoModel>;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;
  public empresa:EmpresaModel;
  public factura: FacturaModel=new FacturaModel();
  public bonoSelect:BonoModel=new BonoModel();

  readonly TIPO_DOCUMENTO_ORDEN_TRABAJO: number = 11;
  readonly TIPO_IMPRESION_TXT80MM: number = 1;
  readonly TIPO_IMPRESION_TXT50MM: number = 2;

  @ViewChild("placaCrearBono") placaCrearBono: ElementRef;
  @ViewChild("lineaCrearBono") lineaCrearBono: ElementRef;
  @ViewChild("tipoCrearBono") tipoCrearBono: ElementRef;
  @ViewChild("totalCrearBono") totalCrearBono: ElementRef;
  @ViewChild("observacionCrearBono") observacionCrearBono: ElementRef;
  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;

  constructor(public bonoService: BonoService,
    public calculosService: CalculosService,
    public usuarioService: UsuarioService,
    public empresaService:EmpresaService,
    public impresionService:ImpresionService,
    public clienteService: ClienteService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.fechasBusqueda();
    this.getclientes(this.empresaId);
    this.buscarUsuarios();
    this.tiposBono();
    this.vehiculos();
    this. getImpresorasEmpresa() ;
    this.getEmpresa();
  }

  imprimirDetalleBono(bono){
    this.bonoService.getBonoById(bono.bono_id).subscribe(res => {
      this.bonoSelect=res[0];
     
    });
    
  }

  cerrar(){
    $('#abonoModa').modal('hide');
    
  }

  imprimirBono(impresora) {
    if (this.impresoraEmpresa.length == 0) {
      alert("No existen impresoras configuradas para la empresa");
      return;
    }
    if (impresora.value == "") {
      impresora.value = 1;
    }
    
    let tipoImpresion = 0;

    for (var i = 0; i < this.impresoraEmpresa.length; i++) {
      console.log(this.impresoraEmpresa[i].tipo_impresion_id + ":" + impresora.value);
      if (impresora.value == this.impresoraEmpresa[i].numero_impresora) {
        tipoImpresion = this.impresoraEmpresa[i].tipo_impresion_id;
        console.log(this.impresoraEmpresa[i]);
        break;
      }
    }
    if (tipoImpresion == 0) {
      alert("La impresora seleccionada no esta configurada para la empresa");
      return;
    }
    console.log(tipoImpresion);
    let tituloDocumento: string = "";
    tituloDocumento = "Bono" +  "_" + impresora.value + "_" + tipoImpresion;
    let vo:BonoVOModel= new BonoVOModel();
    vo.bono=this.bonoSelect;
    let vehitemp:VehiculoModel= this.vehiculosEmpresa.find(t => t.vehiculo_id == this.bonoSelect.vehiculo_id);
    vo.placa=vehitemp.linea_vehiculo;

      this.factura.bono = vo;
      this.factura.titulo = tituloDocumento;
      this.factura.empresa = this.empresa;
      this.factura.nombreTipoDocumento = "BONO " + this.tipoBonoList.find(t => t.tipo_bono_id == this.bonoSelect.tipo_bono_id).nombre; 
      
      this.factura.nombreUsuario = localStorage.getItem("nombreUsuario");
      //this.factura.cliente = this.clientes.find(cliente => cliente.cliente_id == this.documento.cliente_id);
      switch (tipoImpresion) {
        case this.TIPO_IMPRESION_TXT80MM:
          this.descargarArchivo(this.impresionService.imprimirBonoTxt80(this.factura), tituloDocumento + '.txt');
          break;
        case this.TIPO_IMPRESION_TXT50MM:
          this.descargarArchivo(this.impresionService.imprimirOrdenTxt50(this.factura), tituloDocumento + '.txt');
          break;
        default:
          alert("El tipo de impresion seleccionado no se encuetra configurado para su empresa");
        return;
      }
      $('#imprimirBonoModal').modal('hide');
  }

  

  descargarArchivo(contenidoEnBlob, nombreArchivo) {
    const url = window.URL.createObjectURL(contenidoEnBlob);
    const link = this.downloadZipLink.nativeElement;
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
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

  editarBono(bono){
    this.bonoService.getBonoById(bono.bono_id).subscribe(res => {
      this.bonoNew=res[0];
      
    });
  }

  preConsumirBono(bono){
    this.bonoService.getBonoById(bono.bono_id).subscribe(res => {
      this.bonoSelect=res[0];
    });
  }

  consumirBono(){
    this.bonoSelect.estado='1';
    this.bonoService.updateBono(this.bonoSelect).subscribe(res => {
      $('#consumirModal').modal('hide');
    });
  }

  guardarBono() {
    let placa = this.placaCrearBono.nativeElement.value;
    let lineaCrearBono = this.lineaCrearBono.nativeElement.value;
    let tipoCrearBono = this.tipoCrearBono.nativeElement.value;
    let totalCrearBono = this.totalCrearBono.nativeElement.value;
    let observacionCrearBono = this.observacionCrearBono.nativeElement.value;

    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    console.log(placa);
    if (placa == "") {
      mensageError += "Placa\n";
      valido = false;
    }
    if (totalCrearBono == "") {
      mensageError += "Total \n";
      valido = false;
    }
    if (valido == false) {
      alert(mensageError);
      return;
    }
    let bono: BonoModel = (this.bonoNew.bono_id==null?new BonoModel():this.bonoNew);
    bono.empresa_id = this.empresaId;
    bono.fecha_registro = new Date();
    bono.estado = '0';
    bono.observacion = observacionCrearBono;
    bono.usuario_id = this.usuarioId;
    bono.tipo_bono_id = tipoCrearBono;
    bono.total=totalCrearBono;
    let vehiculo = this.vehiculosEmpresa.find(v => v.placa.toUpperCase() == placa.toUpperCase());
    if (vehiculo == undefined) {
      vehiculo = new VehiculoModel();
      vehiculo.placa = placa.toUpperCase();
      vehiculo.linea_vehiculo= lineaCrearBono;
      this.clienteService.saveVehiculo(vehiculo).subscribe(res => {
        bono.vehiculo_id = res.vehiculo_id;
        this.bonoService.saveBono(bono).subscribe(res => {
          if (res.code == "200") {
            this.bonoSelect=bono;
            this.bonoSelect.bono_id=res.bono_id;
           this. vehiculos();
            $('#crearBonoModal').modal('hide');
            $('#imprimirBonoModal').modal('show');
          }
        });
      });
    } else {
      bono.vehiculo_id = vehiculo.vehiculo_id;
      this.bonoService.saveBono(bono).subscribe(res => {
        if (res.code == "200") {
          this.bonoSelect=bono;
          this.bonoSelect.bono_id=res.bono_id;
         this. vehiculos();
          $('#crearBonoModal').modal('hide');
          $('#imprimirBonoModal').modal('show');
        }
      });
    }
  }

  buscarBonos(placa, client, fechaIni, fechaFin, bono, estado) {
    let idCliente = "";
    let tipoDocumentoId = this.TIPO_DOCUMENTO_ORDEN_TRABAJO;
    let ini: string = fechaIni.value;
    let fin: string = fechaFin.value;
    console.log(fechaIni.value);
    if (ini != '' && fin != '') {

      ini = this.calculosService.fechaIniBusqueda(fechaIni.value);
      fin = this.calculosService.fechaFinBusqueda(fechaFin.value);

    } else {
      let date: Date = new Date();
      date.setDate(1);
      ini = date.toLocaleString();
      date.setDate(30);
      fin = date.toLocaleString();
    }
    if (client.value != "") {
      let cliente = this.clientes.find(cliente => (cliente.nombre + " " + cliente.apellidos + " - " + cliente.documento) == client.value);
      idCliente = cliente.cliente_id.toString();
    }
    this.bonoService.getBonosByEmpresa(placa.value, idCliente, ini, fin, bono.value, estado.value, this.empresaId).subscribe(res => {
      this.bonosList = res;
    });
  }

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;
      console.log("lista de clientes cargados: " + this.clientes.length);
    });
  }

  cerrarCrearBono() {
    $('#crearBonoModal').modal('hide');
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  nombreUsuario() {
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    let id = this.usuarioId;
    let usuario = this.usuarioList.find(usuario => usuario.usuario_id == id);
    return usuario == undefined ? "" : usuario.nombre;
  }

  buscarUsuarios() {
    this.usuarioService.getByUsuario(null, this.empresaId.toString(), null).subscribe(res => {
      this.usuarioList = res;
    });
  }

  tiposBono() {
    this.bonoService.getTiposBono().subscribe(res => {
      this.tipoBonoList = res;
    });
  }

  vehiculos() {
    this.clienteService.getVehiculos().subscribe(res => {
      this.vehiculosEmpresa = res;
      console.log("vehiculos:" + res.length);
    });
  }

  getImpresorasEmpresa() {
    this.clienteService.getImpresorasEmpresa(this.empresaId.toString()).subscribe(res => {
      this.impresoraEmpresa = res;
      console.log("impresoras configuradas en la empresa:" + res.length);
    });
  }

  getEmpresa() {
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      this.empresa = res[0];
    });
  }

}
