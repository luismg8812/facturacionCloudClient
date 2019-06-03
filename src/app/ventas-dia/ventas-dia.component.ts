import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DocumentoModel } from '../model/documento.model';
import { UsuarioService } from '../services/usuario.service';
import { ActivacionModel } from '../model/activacion';
import { ClienteService } from '../services/cliente.service';
import { ClienteModel } from '../model/cliente.model';
import { ProductoService } from '../services/producto.service';
import { ProductoModel } from '../model/producto.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { DocumentoService } from '../services/documento.service';
import { CalculosService } from '../services/calculos.service';
import { DocumentoDetalleService } from '../services/documento-detalle.service';
import { Router } from '@angular/router';
import { ConfiguracionModel } from '../model/configuracion.model';
import { TipoPagoModel } from '../model/tipoPago.model';
import { TipoPagoDocumentoModel } from '../model/tipoPagoDocumento.model';
import { EmpresaService } from '../services/empresa.service';
import { ImpresoraEmpresaModel } from '../model/impresoraEmpresa.model';
import { ImpresionService } from '../services/impresion.service';
import { FacturaModel } from '../vo/factura.model';
import { EmpresaModel } from '../model/empresa.model';


@Component({
  selector: 'app-ventas-dia',
  templateUrl: './ventas-dia.component.html',
  styleUrls: ['./ventas-dia.component.css']
})
export class VentasDiaComponent implements OnInit {

  readonly CLIENTE_FACTURACION: string = '19';
  readonly GUIA_TRANSPORTE: string = '8';
  readonly CLIENTE_OBLIGATORIO: string = '14';
  readonly EMPLEADOS: string = '18';
  readonly CODIGO_BARRAS: string = '7';
  readonly DESCUENTOS: string = '10';
  readonly MULTIPLE_IMPRESORA: string = '4';
  readonly TIPOS_PAGOS: string = '20';

  readonly TIPO_DOCUMENTO_FACTURA: number = 10;






  @ViewChild("clientePV") clientePV: ElementRef;
  @ViewChild("tipoDocumentoPV") tipoDocumentoPV: ElementRef;
  @ViewChild("empleadoPV") empleadoPV: ElementRef;

  constructor(public usuarioService: UsuarioService, public clienteService: ClienteService, public productoService: ProductoService,
    public documentoService: DocumentoService, public calculosService: CalculosService, public documentoDetalleService: DocumentoDetalleService,
    private router: Router, public empresaService: EmpresaService, public impresionService: ImpresionService) { }

  public document: DocumentoModel;
  public tituloFactura: string;
  public activaciones: Array<ActivacionModel>;
  public clientes: Array<ClienteModel>;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;
  public configuracion: ConfiguracionModel;
  public productosAll: Array<ProductoModel>;
  public tipoPagosAll: Array<TipoPagoModel>;
  public clienteActivo: boolean = false;
  public guiaTransporteActivo: boolean = false;
  public clienteObligatorioActivo: boolean = false;
  public empreadoActivo: boolean = false;
  public codigoBarrasActivo: boolean = false;
  public descuentosActivo: boolean = false;
  public multipleImpresoraActivo: boolean = false;
  public TipoPagosActivo: boolean = false;
  public clienteSelect: number;
  public empresaId: number;
  public usuarioId: number;
  public tipoDocumentSelect: number;
  public empleadoSelect: string;
  public productoIdSelect: ProductoModel;
  public imp: string;
  public productos: Array<DocumentoDetalleModel>;
  public factura:FacturaModel;

  @ViewChild("CodigoBarrasPV") CodigoBarrasPV: ElementRef;
  @ViewChild("articuloPV") articuloPV: ElementRef;
  @ViewChild("codigoPV") codigoPV: ElementRef;
  @ViewChild("cantidadPV") cantidadPV: ElementRef;
  @ViewChild("precioPV") precioPV: ElementRef;
  @ViewChild("grameraPV") grameraPV: ElementRef;

  //botones de acciones
  @ViewChild("siguientePV") siguientePV: ElementRef;
  @ViewChild("anteriorPV") anteriorPV: ElementRef;
  @ViewChild("primeraPV") primeraPV: ElementRef;
  @ViewChild("ultimaPV") ultimaPV: ElementRef;
  @ViewChild("buscarPV") buscarPV: ElementRef;
  @ViewChild("nuevaPV") nuevaPV: ElementRef;
  @ViewChild("imprimirPV") imprimirPV: ElementRef;
  @ViewChild("opcionPV") opcionPV: ElementRef;
  @ViewChild("finPV") finPV: ElementRef;


  //div botones de acciones
  @ViewChild("divSiguiente") divSiguiente: ElementRef;
  @ViewChild("divAnterior") divAnterior: ElementRef;
  @ViewChild("divPrimera") divPrimera: ElementRef;
  @ViewChild("divUltima") divUltima: ElementRef;
  @ViewChild("divBuscar") divBuscar: ElementRef;
  @ViewChild("divNueva") divNueva: ElementRef;
  @ViewChild("divImprimir") divImprimir: ElementRef;
  @ViewChild("divOpciones") divOpciones: ElementRef;
  @ViewChild("divFin") divFin: ElementRef;
  @ViewChild("imprimirBtn") imprimirBtn: ElementRef;


  @ViewChild("divImprimirModal") divImprimirModal: ElementRef;
  @ViewChild("divCantidad") divCantidad: ElementRef; // div de donde se busca  la cantidad
  @ViewChild("divCodigo") divCodigo: ElementRef; // div de donde se busca el codigo del producto
  @ViewChild("divArticulo") divArticulo: ElementRef; // div de donde se busca el articulo
  @ViewChild("divUnitario") divUnitario: ElementRef; // div de donde se busca el articulo
  @ViewChild("divParcial") divParcial: ElementRef; // div de donde se busca el articulo
  @ViewChild("enPantallaPV") enPantallaPV: ElementRef; // div de donde se busca el articulo


  //impresion

  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;
  @ViewChild("impresoraLavel") impresoraLavel: ElementRef;
  @ViewChild("impresoraPV") impresoraPV: ElementRef; // controla la impresora que se desea imprimir
  @ViewChild("descuentoPV") descuentoPV: ElementRef;
  @ViewChild("descuentoLavel") descuentoLavel: ElementRef;
  @ViewChild("tipoPagoLavel") tipoPagoLavel: ElementRef;
  @ViewChild("tipoPagoPV") tipoPagoPV: ElementRef;
  @ViewChild("valorTipoPagoLavel") valorTipoPagoLavel: ElementRef;
  @ViewChild("valorTipoPagoPV") valorTipoPagoPV: ElementRef;
  @ViewChild("efectovoPV") efectovoPV: ElementRef;
  @ViewChild("continuaImpresionPV") continuaImpresionPV: ElementRef;

  ngOnInit() {
    this.empresaId = Number(sessionStorage.getItem("empresa_id"));
    this.estadoDivBotones("d-block");
    this.siguientePV.nativeElement.focus();
    this.estadoDivProducto("d-none") // se muestra el div de producto
    this.CodigoBarrasPV.nativeElement.classList.add("d-none");
    this.usuarioId = Number(sessionStorage.getItem("usuario_id"));
    this.factura=new FacturaModel();
    sessionStorage.removeItem("documentoIdSelect");
    sessionStorage.removeItem("productoIdSelect");
    this.getProductosByEmpresa(this.empresaId);
    this.clienteActivo = false;
    this.guiaTransporteActivo = false;
    this.clienteObligatorioActivo = false;
    this.empreadoActivo = false;
    this.codigoBarrasActivo = false;
    this.clienteSelect = null;
    this.tipoDocumentSelect = null;
    this.empleadoSelect = "";
    this.document = new DocumentoModel();
    this.productos = [];
    this.tipoPagoPV.nativeElement.title = '1.Efectivo 2.Credito 3.Cheque 4.Consignación 5.Tarjeta 6.Vale. Si ingresa varios tipos de pago hagalo separados por un espacio ej: 1,2,3';
    this.getclientes(this.empresaId);
    this.getConfiguracion(this.empresaId);
    this.getActivaciones(this.usuarioId);
    this.getImpresorasEmpresa(this.empresaId);
  }

  clienteSelectFun(element) {
    if (this.clienteObligatorioActivo && element.value == '') {
      alert("El cliente es obligatorio");
      return;
    } else {
      if (element.value == "") {
        alert("se creará cliente");
      } else {
        let cliente = this.clientes.find(product => product.nombre === element.value);
        this.clienteSelect = cliente.cliente_id;
        this.document.cliente_id = this.clienteSelect;
        this.factura.cliente=cliente;
      }

    }
    console.log("cliente select:" + element.value);
    if (this.guiaTransporteActivo) {
      this.tipoDocumentoPV.nativeElement.focus();
    } else {
      if (this.empreadoActivo) {
        this.empleadoPV.nativeElement.focus();
      } else {
        if (this.codigoBarrasActivo) {
          this.CodigoBarrasPV.nativeElement.classList.add("d-block");
          this.CodigoBarrasPV.nativeElement.focus();
        } else {
          this.articuloPV.nativeElement.focus();
        }
      }
    }

  }

  tipoDocumentoSelect(element) {
    switch (element.value) {
      case '': {
        console.log("factura de venta por defecto");
        this.tipoDocumentSelect = 10;
        this.factura.nombreTipoDocumento="FACTURA DE VENTA";
        break;
      }
      case 'c':
      case 'C': {
        this.tipoDocumentSelect = 4;
        console.log("cotizacion");
        this.factura.nombreTipoDocumento="COTIZACIÓN";
        break;
      }
      case 'r':
      case 'R': {
        this.tipoDocumentSelect = 9;
        console.log("remision");
        this.factura.nombreTipoDocumento="FACTURA DE VENTA.";
        break;
      }
      case 'f':
      case 'F': {
        this.tipoDocumentSelect = 10;
        this.factura.nombreTipoDocumento="FACTURA DE VENTA";
        console.log("Factura");
        break;
      }
      default: {
        console.log("incorrecto");
        alert("Tipo de documento invalido");
        element.value = '';
        return;
      }
    }
    this.document.tipo_documento_id = this.tipoDocumentSelect;
    if (this.empreadoActivo) {
      this.empleadoPV.nativeElement.focus();
    } else {
      if (this.codigoBarrasActivo) {
        this.CodigoBarrasPV.nativeElement.classList.add("d-block");
        this.CodigoBarrasPV.nativeElement.focus();
      } else {
        this.articuloPV.nativeElement.focus();
      }
    }
  }

  empleadoSelectFunt(element) {
    this.empleadoSelect = element.value;
    if (this.codigoBarrasActivo) {
      this.CodigoBarrasPV.nativeElement.classList.add("d-block");
      this.CodigoBarrasPV.nativeElement.focus();
    } else {
      this.articuloPV.nativeElement.focus();
    }
  }

  codigoBarrasSelect(element) {

    if (element.value == '') {
      this.articuloPV.nativeElement.focus();
    } else {
      console.log("TODO//busqueda de producto por codigo de barras:" + element.value);
    }
  }

  ocultarCodigoBarras() {
    this.CodigoBarrasPV.nativeElement.classList.remove("d-block");
    this.CodigoBarrasPV.nativeElement.classList.add("d-none");
  }

  productoEnter(element) {
    if (element.value == '') {
      this.codigoPV.nativeElement.focus();
    }
  }

  codigoProductoSelect(element) {
    if (element.value == '') {
      if (this.codigoBarrasActivo) {
        this.CodigoBarrasPV.nativeElement.classList.remove("d-none");
        this.CodigoBarrasPV.nativeElement.classList.add("d-block");
        this.CodigoBarrasPV.nativeElement.focus();
      } else {
        this.articuloPV.nativeElement.focus();
      }
    } else {
      console.log("TO DO// busqueda de código de producto")
    }
  }



  articuloSelect(element) {
    console.log("articulo select:" + element.value);

    let productoNombre: string = element.value;
    this.productoIdSelect = this.productosAll.find(product => product.nombre === productoNombre);
    console.log(this.productoIdSelect);
    if (this.productoIdSelect.varios) {
      this.precioPV.nativeElement.classList.add("d-block");
      this.precioPV.nativeElement.classList.remove("d-none");
      this.precioPV.nativeElement.focus();
    } else {
      if (this.productoIdSelect.balanza == '1') {
        this.getGramera();// este metodo
        this.grameraPV.nativeElement.classList.add("d-block");
        this.grameraPV.nativeElement.classList.remove("d-none");
        this.grameraPV.nativeElement.focus();
      } else {
        this.cantidadPV.nativeElement.focus();
      }
    }
  }

  getGramera() {

  }

  enterTecla(element) {
    console.log(element.id);
    if (element.id == "nuevaPV") {
      this.nuevafactura();
    }

    if (element.id == "clientePV") {
      this.clienteSelectFun(element);
    }
    if (element.id == "tipoDocumentoPV") {
      this.tipoDocumentoSelect(element);
    }
    if (element.id == "empleadoPV") {
      this.empleadoSelectFunt(element);
    }
    if (element.id == "CodigoBarrasPV") {
      this.codigoBarrasSelect(element);
    }
    if (element.id == "articuloPV") {
      this.productoEnter(element);
    }
    if (element.id == "codigoPV") {
      this.codigoProductoSelect(element);
      console.log("enter en producto");
    }
    if (element.id == "cantidadPV") {
      this.cantidadEnter(element);
    }
    if (element.id == "precioPV") {
      this.precioEnter(element);
    }
    if (element.id == "descuentoPV") {
      this.descuentoEnter();
    }
    if (element.id == "impresoraPV") {
      this.impresoraEnter();
    }
    if (element.id == "tipoPagoPV") {
      this.valorTipoPagoPV.nativeElement.focus();

    }
    if (element.id == "valorTipoPagoPV") {
      this.efectovoPV.nativeElement.focus();
    }
    if (element.id == "efectovoPV") {
      this.efectivoEnter(element);
    }
    if (element.id == "enPantallaPV") {
      this.continuaImpresionPV.nativeElement.focus();
    }

    if (element.id == "continuaImpresionPV") {
      this.enterContinuarImpresion(element);

    }
  }

  enterContinuarImpresion(element) {
    if (this.document.documento_id == "") {
      alert("El documento esta corructo, por favor vuelva a crearlo");
      return;
    }
    console.log(this.configuracion);
    let numImpresiones = this.configuracion.numero_impresion;
    let impresora = this.impresoraPV.nativeElement.value;
    if (this.document.tipo_documento_id == null) {
      this.document.tipo_documento_id = this.TIPO_DOCUMENTO_FACTURA;
    }
    if (this.document.cliente_id == null) {
      //si el cliente es nulo se asigna el varios por defecto
      this.document.cliente_id = 1;
    }
    //this.document.mac= Calculos.conseguirMAC2()); ver como se hace la mag desde el cliente..
    this.document.impreso = 1;
    this.verificarDescuento();
    this.calcularProporcion();
    this.calcularInfoDiario();
    this.asignarTipoPago();
    this.asignarConsecutivo(numImpresiones);



  }

  calcularInfoDiario() {
    let fechaDocumento: Date = this.document.fecha_registro;
    //let fechaInicio = this.calculosService.fechaInicial(fechaDocumento);
    //let fechaFinal = this.calculosService.fechaFinal(fechaDocumento);
		/*let  infoList = documentoService.buscarInfodiarioByFecha(fechaInicio, fechaFinal);
		boolean anulado = false;
		try {
			InfoDiario infoDiario = Calculos.calcularInfoDiario(getDocumento(), infoList, e, anulado);

			if (infoDiario.getInfoDiarioId() == null) {
				documentoService.save(infoDiario);
			} else {
				documentoService.update(infoDiario);
			}

		} catch (FactException e1) {
			log.error("Error calculando registro de informe diario" + e1.getMessage());
		}*/
  }

  asignarTipoPago() {
    let des1 = this.descuentoPV.nativeElement.value;
    let tiposPagosList: TipoPagoModel[] = [];
    if (des1 == "") {
      //si no se agrega un tipo de pago se agrega efectivo por defecto efectivo 
      let tipoPagoDocumento: TipoPagoDocumentoModel = new TipoPagoDocumentoModel();
      tipoPagoDocumento.documento_id = this.document.documento_id;
      tipoPagoDocumento.fecha_registro = new Date;
      tipoPagoDocumento.tipo_pago_id = 1;//efectivo por defecto
      tipoPagoDocumento.valor = this.document.total;
      this.documentoService.saveTipoPagoDocumento(tipoPagoDocumento).subscribe(res => {

      });
    } else {

    }
  }

  verificarDescuento() {
    let des1 = this.descuentoPV.nativeElement.value;
    if (des1 != 0.0 && des1 != "") {
      let desTemp = 0.0; // si el descuento es mayor o menor que 100 entonces se calcula el
      // descuento en %
      desTemp = 0.0;
      if (des1 < -100.0 || des1 > 100.0) {
        this.document.descuento = des1;
        desTemp = (des1 * 100) / this.document.total;
        console.log("% descuento:" + desTemp);
      } else {
        this.document.descuento = (this.document.total * des1) / 100;
        desTemp = des1;
        console.log("% descuento:" + desTemp);
      }
      if (desTemp < -50 || desTemp > 50) {
        return;
      }
      let des = desTemp / 100;
      let temp: DocumentoDetalleModel[];
      for (var i = 0; i < this.productos.length; i++) {
        let parcialDescuento = this.productos[i].parcial + (this.productos[i].parcial * des);
        let unitarioDescuento = this.productos[i].unitario + (this.productos[i].unitario * des);
        this.productos[i].parcial = parcialDescuento;
        this.productos[i].unitario = unitarioDescuento;
        temp.unshift(this.productos[i]);
      }
      let totalTemp = this.document.total;
      let ivaTemp = this.document.iva + (this.document.iva * des);
      let excentoTemp = this.document.excento + (this.document.excento * des);
      let gravadoTemp = this.document.gravado + (this.document.gravado * des);
      this.document.total = totalTemp;
      this.document.saldo = totalTemp;
      this.document.iva = ivaTemp;
      this.document.excento = excentoTemp;
      this.document.gravado = gravadoTemp;
      this.productos = temp;
      // se valida si el descuento es mayor o menor a 1.5
      /*if (desTemp >= 1.5 || desTemp <= -1.5) {
        Evento evento = new Evento();
        TipoEvento tipoEvento = new TipoEvento();
        tipoEvento.setTipoEventoId(2l); // se asigna tipo evento igual a
                        // descuento mayor al 1.5
        evento.setFechaRegistro(new Date());
        evento.setTipoEventoId(tipoEvento);
        evento.setUsuarioId(usuario());
        evento.setCampo("" + getDocumento().getDocumentoId());
        evento.setValorActual("" + totalTemp);
        evento.setValorAnterior("" + getDescuento());
        eventoService.save(evento);
      }*/

      if (des1 < -100.0 || des1 > 100.0) {
        this.document.descuento = des1;
        desTemp = (des1 * 100) / this.document.total;
        console.log("% descuento:" + desTemp);
      } else {
        this.document.descuento = (this.document.total * des1) / 100;
        desTemp = des1;
        console.log("% descuento:" + desTemp);
      }
      if (desTemp < -50 || desTemp > 50) {
        alert("El descuento no puede ser mayor o menor al 50%");
        return;
      }
    }
  }

  imprimirFactura(numeroImpresiones: number, empresa: EmpresaModel) {
    console.log("entra a imprimir factura");
    let tituloDocumento: string = "";
    let impresora = this.impresoraPV.nativeElement.value;
    if (impresora == "") {
      impresora = 1;
    }
    let pantalla = this.enPantallaPV.nativeElement.value;
    if(pantalla==""){
      pantalla="false";
    }
    if(numeroImpresiones==undefined){
      numeroImpresiones=1;
    }
    let tipoImpresion = "";
     
    for (var i = 0; i < this.impresoraEmpresa.length; i++) {
      console.log(numeroImpresiones);
      if (impresora == this.impresoraEmpresa[i].numero_impresora) {
        tipoImpresion = this.impresoraEmpresa[i].tipo_impresion;
      }
    }
    console.log(tipoImpresion);
    tituloDocumento = this.tituloFactura + "_" + this.document.consecutivo_dian + "_" + impresora + "_" + pantalla + "_" + numeroImpresiones + "_" + tipoImpresion;
    
   this.factura.documento = this.document;
   this.factura.detalle = this.productos
   this.factura.titulo = tituloDocumento;
   this.factura.empresa = empresa;
   this.factura.nombreUsuario= sessionStorage.getItem("nombreUsuario"); 
    for (var i = 0; i < numeroImpresiones; i++) {
    switch (tipoImpresion) {
      case "TXT":
        this.descargarArchivo(this.impresionService.imprimirFacturaTxt(this.factura, this.configuracion), tituloDocumento+'.txt');
        break;
      default:
        alert("no tiene un tipo impresion");
        //Impresion.imprimirPDF(getDocumento(), getProductos(), usuario(), configuracion, impresora,
        //    enPantalla, e);
        break;
    }
    }
  }

  descargarArchivo(contenidoEnBlob, nombreArchivo) {
    const url = window.URL.createObjectURL(contenidoEnBlob);
    const link = this.downloadZipLink.nativeElement;
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  asignarConsecutivo(numImpresiones: number) {
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      let empr = res;
      console.log(empr);
      let con: number;
      let consecutivo: string;
      switch (this.document.tipo_documento_id) {
        case 9:
          con = empr[0].consecutivo;
          consecutivo = res[0].letra_consecutivo + con;
          this.document.consecutivo_dian = consecutivo;
          console.log("consecutivo documentoId: " + consecutivo);
          this.tituloFactura = "FACTURA DE VENTA.";
          break;
        case 4:
          this.document.consecutivo_dian = this.document.documento_id// es necesario asignar el
          // consecutivo dian
          console.log("consecutivo Cotizacion: " + this.document.consecutivo_dian);
          this.tituloFactura = "No. DE COTIZACIÓN";
          break;
        default:
          // log
          console.log(empr[0].consecutivo);
          con = empr[0].consecutivo + 1;
          // dentro de try se valida si faltan 500 facturas para
          // llegar hasta el tope

          let topeConsecutivo = res[0].autorizacion_hasta;
          let consegutivo = con;
          if (consegutivo + 500 > topeConsecutivo) {
            alert(" se esta agotando el consegutivo DIAN");
          }
          if (consegutivo > topeConsecutivo) {
            alert("Se agotó el consecutivo DIAN");
            return;
          }

          consecutivo = res[0].letra_consecutivo + con.toString();
          console.log("consecutivo Dian: " + consecutivo);
          this.document.consecutivo_dian = consecutivo;
          this.tituloFactura = "FACTURA DE VENTA";
          res[0].consecutivo = con;
          this.empresaService.updateConsecutivoEmpresa(empr[0]).subscribe(emp => {
            console.log("consecutivo actualizado");
            console.log(this.document);
            this.documentoService.updateDocumento(this.document).subscribe(res => {
              if (res.code != 200) {
                alert("error creando documento, por favor inicie nuevamente la creación del documento");
                return;
              }
              this.imprimirFactura(numImpresiones, empr[0]);
              this.limpiar();
              this.scapeTecla(null);
            });
          });

          break;
      }
    });
  }


  calcularProporcion() {
    //TODO hay que calcular la proporcion, crear las tablas
    //hacer los metodos de busqueda aqui
  }

  cancelarImpresion() {
    console.log("presiona cancelar impresion");
    this.divImprimirModal.nativeElement.classList.remove("d-block");
    this.divImprimirModal.nativeElement.classList.add("d-none");
    this.scapeTecla(null);
  }

  efectivoEnter(element) {
    let efectivo: number = element.value;
    if (!isNaN(efectivo) && element.value != '') {

      this.document.cambio = efectivo - this.document.total;
    }
    this.enPantallaPV.nativeElement.focus();
  }

  impresoraEnter() {
    if (this.TipoPagosActivo) {
      this.tipoPagoPV.nativeElement.focus();
    } else {
      this.efectovoPV.nativeElement.focus();
    }
  }

  descuentoEnter() {
    if (this.multipleImpresoraActivo) {
      this.impresoraPV.nativeElement.focus();
    } else {
      if (this.TipoPagosActivo) {
        this.tipoPagoPV.nativeElement.focus();
      } else {
        this.efectovoPV.nativeElement.focus();
      }
    }
  }


  precioEnter(element) {
    if (this.codigoBarrasActivo) {
      this.CodigoBarrasPV.nativeElement.classList.add("d-block");
      this.CodigoBarrasPV.nativeElement.focus();
    } else {
      this.articuloPV.nativeElement.focus();
    }
    let precio = this.precioPV.nativeElement.value;
    this.articuloPV.nativeElement.value = "";
    this.CodigoBarrasPV.nativeElement.value = "";

    console.log("precio enter:" + precio);
    if (isNaN(precio)) {
      console.log("no es numérico:" + precio);
      return;
    }
    if (precio == null || precio == '' || precio <= 0) {
      return;
    }
    this.asignarDocumento(1); //se asigna cantidad 1 en x01
  }



  cantidadEnter(element) {
    let cantidad: number = this.cantidadPV.nativeElement.value;
    if (cantidad > 1500) {
      alert("La cantidad no puede ser mayor a 1500");
      return;
    }
    if (this.codigoBarrasActivo) {
      this.CodigoBarrasPV.nativeElement.classList.add("d-block");
      this.CodigoBarrasPV.nativeElement.focus();
    } else {
      this.articuloPV.nativeElement.focus();
    }
    this.articuloPV.nativeElement.value = "";
    this.CodigoBarrasPV.nativeElement.value = "";
    this.cantidadPV.nativeElement.value = "";
    console.log("cantidad enter:" + cantidad);
    if (isNaN(cantidad)) {
      console.log("no es numérico:" + cantidad);
      return;
    }
    if (cantidad == null || cantidad <= 0) {
      return;
    }

    console.log("//TODO aqui hacer la validacion de stock min");
    console.log("//TODO aqui hacer la validacion de que el producto se agotó");

    this.asignarDocumento(cantidad);


  }

  private asignarDocumento(cantidad) {
    if (this.document.documento_id == "") {
      this.document.fecha_registro = this.calculosService.fechaActual();
      this.document.usuario_id = this.usuarioId;
      this.document.empresa_id = this.empresaId;
      this.document.invoice = 1; // se envia invoice por enviar
      this.documentoService.saveDocumento(this.document).subscribe(res => {
        if (res.code == 200) {
          this.document.documento_id = res.documento_id;
          this.asignarDocumentoDetalle(cantidad);
        } else {
          alert("error creando documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    } else {
      this.asignarDocumentoDetalle(cantidad);
      console.log(this.document);

    }
  }




  private asignarDocumentoDetalle(cantidad: number) {
    let docDetalle = new DocumentoDetalleModel();
    docDetalle.cantidad = cantidad;
    docDetalle.impuesto_producto = Number(this.productoIdSelect.impuesto);
    docDetalle.peso_producto = Number(this.productoIdSelect.peso);
    docDetalle.producto_id = this.productoIdSelect.producto_id;
    docDetalle.documento_id = this.document.documento_id;
    docDetalle.nombre_producto = this.productoIdSelect.nombre;
    docDetalle.costo_producto = this.productoIdSelect.costo;
    docDetalle.fecha_registro = this.calculosService.fechaActual();
    docDetalle.estado = 1;
    //se valida promocion
    if (this.calculosService.validarPromo(this.productoIdSelect, cantidad)) {
      let precioPromo: number = this.productoIdSelect.pub_promo;
      let cantidadPromo: number = this.productoIdSelect.kg_promo;
      let unitarioPromo: number = precioPromo / cantidadPromo;
      docDetalle.parcial = cantidad * unitarioPromo;
      docDetalle.unitario = unitarioPromo;
    } else {
      if (cantidad != null && this.productoIdSelect.costo_publico != null) {
        if (this.productoIdSelect.varios) {
          let precio: number = this.precioPV.nativeElement.value;

          console.log("precio");
          console.log(precio);
          docDetalle.parcial = precio;
          docDetalle.unitario = precio;
          this.precioPV.nativeElement.value = "";
        } else {
          docDetalle.parcial = cantidad * this.productoIdSelect.costo_publico;
          docDetalle.unitario = this.productoIdSelect.costo_publico;

        }
      } else {
        docDetalle.parcial = 0;
        docDetalle.unitario = 0;
      }
    }
    console.log(docDetalle);
    this.documentoDetalleService.saveDocumentoDetalle(docDetalle).subscribe(res => {
      if (res.code == 200) {
        docDetalle.documento_detalle_id = res.documento_detalle_id;
        this.productos.unshift(docDetalle);
      } else {
        alert("Error agregando producto: " + res.error);
      }
      this.document = this.calculosService.calcularExcento(this.document, this.productos);
      this.documentoService.updateDocumento(this.document).subscribe(res => {
        if (res.code != 200) {
          alert("error creando documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
      let newCantidad: number = this.productoIdSelect.cantidad;
      this.productoIdSelect.cantidad = newCantidad - docDetalle.cantidad;
      this.restarCantidadesSubProducto(docDetalle);
      this.productoService.updateCantidad(this.productoIdSelect).subscribe(res => {
        if (res.code == 200) {
          //buscar la poscicion del producto y restarle la cantidad en el arreglo de productos
        } else {
          alert("error actualizando la cantidad del producto en el inventario, pero el documento es correcto");
          return;
        }
      });

    });
  }

  private restarCantidadesSubProducto(productoSelect3: DocumentoDetalleModel) {
    console.log("TODO hacer (copiar)la logica de restar cantidades subproducto");
  }

  scapeTecla(element) {
    this.estadoDivBotones("d-block");
    this.estadoDivProducto("d-none") // se muestra el div de producto
    this.divImprimirModal.nativeElement.classList.remove("d-block");
    this.divImprimirModal.nativeElement.classList.add("d-none");
    this.siguientePV.nativeElement.focus();

  }

  controlTeclas(event, element) {
    if (event.keyCode == 39) { //cuando se presiona la tacla derecha 				
      if (element.id == 'siguientePV') {
        this.anteriorPV.nativeElement.focus();
        return;
      }
      if (element.id == 'anteriorPV') {
        this.primeraPV.nativeElement.focus();
        return;
      }
      if (element.id == 'primeraPV') {
        this.ultimaPV.nativeElement.focus();
        return;
      }
      if (element.id == 'ultimaPV') {
        this.buscarPV.nativeElement.focus();
        return;
      }
      if (element.id == 'buscarPV') {
        this.nuevaPV.nativeElement.focus();
        return;
      }
      if (element.id == 'nuevaPV') {
        this.imprimirPV.nativeElement.focus();
        return;
      }
      if (element.id == 'imprimirPV') {
        this.opcionPV.nativeElement.focus();
        return;
      }
      if (element.id == 'opcionPV') {
        this.finPV.nativeElement.focus();
        return;
      }
    }
    if (event.keyCode == 37) { //cuando se presiona la tacla izq 				
      if (element.id == 'anteriorPV') {
        this.siguientePV.nativeElement.focus();
        return;
      }
      if (element.id == 'primeraPV') {
        this.anteriorPV.nativeElement.focus();
        return;
      }
      if (element.id == 'ultimaPV') {
        this.primeraPV.nativeElement.focus();
        return;
      }
      if (element.id == 'buscarPV') {
        this.ultimaPV.nativeElement.focus();
        return;
      }
      if (element.id == 'nuevaPV') {
        this.buscarPV.nativeElement.focus();
        return;
      }
      if (element.id == 'imprimirPV') {
        this.nuevaPV.nativeElement.focus();
        return;
      }
      if (element.id == 'opcionPV') {
        this.imprimirPV.nativeElement.focus();
        return;
      }
      if (element.id == 'finPV') {
        this.opcionPV.nativeElement.focus();
        return;
      }
    }
    if (event.keyCode == 78) { //cuando se presiona la tacla N 		 
      this.nuevafactura();
    }
    if (event.keyCode == 70) { //cuando se presiona la tacla f
      this.router.navigate(['/login']);
    }
    if (event.keyCode == 73) { //cuando se presiona la tacla i 		 
      this.imprimirModal();
    }
  }

  limpiar() {
    this.estadoDivBotones("d-block");
    this.siguientePV.nativeElement.focus();
    this.estadoDivProducto("d-none") // se muestra el div de producto
    this.CodigoBarrasPV.nativeElement.value = "";
    this.CodigoBarrasPV.nativeElement.classList.add("d-none"); this.clienteActivo = false;
    this.guiaTransporteActivo = false;
    this.clienteObligatorioActivo = false;
    this.empreadoActivo = false;
    this.codigoBarrasActivo = false;
    this.clienteSelect = null;
    this.productoIdSelect = null;
    this.tipoDocumentSelect = null;
    this.empleadoSelect = "";
    this.document = new DocumentoModel();
    this.clientePV.nativeElement.value = "";
    this.tipoDocumentoPV.nativeElement.value = "";
    this.empleadoPV.nativeElement.value = "";
    this.articuloPV.nativeElement.value = "";
    this.codigoPV.nativeElement.value = "";
    this.cantidadPV.nativeElement.value = "";
    this.precioPV.nativeElement.value = "";
    this.productos = [];
    this.descuentoPV.nativeElement.value = "";
    this.efectovoPV.nativeElement.value = "";
    this.tituloFactura = "";
    this.factura=new FacturaModel();

  }

  nuevafactura() {
    console.log("nueva factura");
    this.limpiar();
    this.estadoDivBotones("d-none");
    this.estadoDivProducto("d-block") // se muestra el div de producto
    for (var e = 0; e < this.activaciones.length; e++) {
      if (this.activaciones[e].activacion_id == this.CLIENTE_FACTURACION) {
        console.log("cliente activo");
        this.clienteActivo = true;
      }
      if (this.activaciones[e].activacion_id == this.GUIA_TRANSPORTE) {
        console.log("guia de trasporte activa");
        this.guiaTransporteActivo = true;
      }
      if (this.activaciones[e].activacion_id == this.CLIENTE_OBLIGATORIO) {
        console.log("cliente obligatorio");
        this.clienteObligatorioActivo = true;
      }
      if (this.activaciones[e].activacion_id == this.EMPLEADOS) {
        console.log("empleado activado");
        this.empreadoActivo = true;
      }
      if (this.activaciones[e].activacion_id == this.CODIGO_BARRAS) {
        console.log("codigo barras activado");
        this.codigoBarrasActivo = true;
      }
      if (this.activaciones[e].activacion_id == this.DESCUENTOS) {
        console.log("descuentos activos ");
        this.descuentosActivo = true;
      }
      if (this.activaciones[e].activacion_id == this.MULTIPLE_IMPRESORA) {
        console.log("multiple impresora activos ");
        this.multipleImpresoraActivo = true;
      }
      if (this.activaciones[e].activacion_id == this.TIPOS_PAGOS) {
        console.log("tipos pagos activos ");
        this.TipoPagosActivo = true;
      }
    }
    if (this.clienteActivo) {
      this.clientePV.nativeElement.focus();
    } else {
      if (this.guiaTransporteActivo) {
        this.tipoDocumentoPV.nativeElement.focus();
      } else {
        if (this.empreadoActivo) {
          this.empleadoPV.nativeElement.focus();
        } else {
          if (this.codigoBarrasActivo) {
            this.CodigoBarrasPV.nativeElement.classList.add("d-block");
            this.CodigoBarrasPV.nativeElement.focus();
          } else {
            this.articuloPV.nativeElement.focus();
          }
        }
      }
    }
  }

  imprimirModal() {
    if (this.document.documento_id == "") {
      alert("debe crear primero una factura");
      return;
    }
    this.divImprimirModal.nativeElement.classList.remove("d-none");
    this.divImprimirModal.nativeElement.classList.add("d-block");
    let contador = 0;

    if (this.descuentosActivo) {
      this.descuentoLavel.nativeElement.classList.remove("d-none");
      this.descuentoLavel.nativeElement.classList.add("d-block");
      this.descuentoPV.nativeElement.classList.remove("d-none");
      this.descuentoPV.nativeElement.classList.add("d-block");
    }
    if (this.multipleImpresoraActivo) {
      this.impresoraLavel.nativeElement.classList.remove("d-none");
      this.impresoraLavel.nativeElement.classList.add("d-block");
      this.impresoraPV.nativeElement.classList.remove("d-none");
      this.impresoraPV.nativeElement.classList.add("d-block");
    }
    if (this.TipoPagosActivo) {
      this.valorTipoPagoLavel.nativeElement.classList.remove("d-none");
      this.valorTipoPagoLavel.nativeElement.classList.add("d-block");

      this.tipoPagoLavel.nativeElement.classList.remove("d-none");
      this.tipoPagoLavel.nativeElement.classList.add("d-block");

      this.tipoPagoPV.nativeElement.classList.remove("d-none");
      this.tipoPagoPV.nativeElement.classList.add("d-block");

      this.valorTipoPagoPV.nativeElement.classList.remove("d-none");
      this.valorTipoPagoPV.nativeElement.classList.add("d-block");
    }

    if (this.descuentosActivo) {
      this.descuentoPV.nativeElement.focus();
    } else {
      if (this.multipleImpresoraActivo) {
        this.impresoraPV.nativeElement.focus();
      } else {
        if (this.TipoPagosActivo) {
          this.tipoPagoPV.nativeElement.focus();
        } else {
          this.efectovoPV.nativeElement.focus();
        }
      }
    }
  }

  getActivaciones(user: number) {
    this.usuarioService.getActivacionByUsuario(user.toString()).subscribe(res => {
      this.activaciones = res;
    });
  }


  getImpresorasEmpresa(empresaId: number) {
    this.clienteService.getImpresorasEmpresa(empresaId.toString()).subscribe(res => {
      this.impresoraEmpresa = res;
    });
  }

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;

    });
  }

  getConfiguracion(empresaId: number) {
    this.clienteService.getConfiguracionByEmpresa(empresaId.toString()).subscribe(res => {
      this.configuracion = res;
    });
  }

  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(res => {
      this.productosAll = res;
    });
  }

  getTipoPago() {
    this.clienteService.getTipoPago().subscribe(res => {
      this.tipoPagosAll = res;
    });
  }

  estadoDivBotones(visible: string) {
    if (visible == "d-block") {
      this.divSiguiente.nativeElement.classList.add("d-block");
      this.divAnterior.nativeElement.classList.add("d-block");
      this.divPrimera.nativeElement.classList.add("d-block");
      this.divUltima.nativeElement.classList.add("d-block");
      this.divBuscar.nativeElement.classList.add("d-block");
      this.divNueva.nativeElement.classList.add("d-block");
      this.divImprimir.nativeElement.classList.add("d-block");
      this.divOpciones.nativeElement.classList.add("d-block");
      this.divFin.nativeElement.classList.add("d-block");
    } else {
      this.divSiguiente.nativeElement.classList.add("d-none");
      this.divAnterior.nativeElement.classList.add("d-none");
      this.divPrimera.nativeElement.classList.add("d-none");
      this.divUltima.nativeElement.classList.add("d-none");
      this.divBuscar.nativeElement.classList.add("d-none");
      this.divNueva.nativeElement.classList.add("d-none");
      this.divImprimir.nativeElement.classList.add("d-none");
      this.divOpciones.nativeElement.classList.add("d-none");
      this.divFin.nativeElement.classList.add("d-none");

      this.divSiguiente.nativeElement.classList.remove("d-block");
      this.divAnterior.nativeElement.classList.remove("d-block");
      this.divPrimera.nativeElement.classList.remove("d-block");
      this.divUltima.nativeElement.classList.remove("d-block");
      this.divBuscar.nativeElement.classList.remove("d-block");
      this.divNueva.nativeElement.classList.remove("d-block");
      this.divImprimir.nativeElement.classList.remove("d-block");
      this.divOpciones.nativeElement.classList.remove("d-block");
      this.divFin.nativeElement.classList.remove("d-block");
    }
  }

  estadoDivProducto(visible: string) {
    if (visible == "d-block") {
      this.divCantidad.nativeElement.classList.add("d-block");
      this.divCodigo.nativeElement.classList.add("d-block");
      this.divArticulo.nativeElement.classList.add("d-block");
      this.divUnitario.nativeElement.classList.add("d-block");
      this.divParcial.nativeElement.classList.add("d-block");
      this.divCantidad.nativeElement.classList.remove("d-none");
      this.divCodigo.nativeElement.classList.remove("d-none");
      this.divArticulo.nativeElement.classList.remove("d-none");
      this.divUnitario.nativeElement.classList.remove("d-none");
      this.divParcial.nativeElement.classList.remove("d-none");

    } else {
      this.divCantidad.nativeElement.classList.add("d-none");
      this.divCodigo.nativeElement.classList.add("d-none");
      this.divArticulo.nativeElement.classList.add("d-none");
      this.divUnitario.nativeElement.classList.add("d-none");
      this.divParcial.nativeElement.classList.add("d-none");
      this.divCantidad.nativeElement.classList.remove("d-block");
      this.divCodigo.nativeElement.classList.remove("d-block");
      this.divArticulo.nativeElement.classList.remove("d-block");
      this.divUnitario.nativeElement.classList.remove("d-block");
      this.divParcial.nativeElement.classList.remove("d-block");
    }
  }

  ocultarPrecio() {
    this.precioPV.nativeElement.classList.remove("d-block");
    this.precioPV.nativeElement.classList.add("d-none");
  }
  ocultarGramera() {
    this.grameraPV.nativeElement.classList.remove("d-block");
    this.grameraPV.nativeElement.classList.add("d-none");
  }

  formatearNumber(number:number){
    let formato:string="";
    formato=new Intl.NumberFormat().format(number);
    return formato;
  }

}
