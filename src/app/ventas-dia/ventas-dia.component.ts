import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DocumentoModel } from '../model/documento.model';
import { UsuarioService } from '../services/usuario.service';
import { ActivacionModel } from '../model/activacion';
import { ClienteService } from '../services/cliente.service';
import { ClienteModel } from '../model/cliente.model';
import { ProductoService } from '../services/producto.service';
import { ProductoModel } from '../model/producto.model';
import { DocumentoDetalleVoModel } from '../model/documentoDetalleVo.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { DocumentoService } from '../services/documento.service';
import { CalculosService } from '../services/calculos.service';
import { DocumentoDetalleService } from '../services/documento-detalle.service';


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





  @ViewChild("clientePV") clientePV: ElementRef;
  @ViewChild("tipoDocumentoPV") tipoDocumentoPV: ElementRef;
  @ViewChild("empleadoPV") empleadoPV: ElementRef;

  constructor(public usuarioService: UsuarioService, public clienteService: ClienteService, public productoService: ProductoService,
    public documentoService: DocumentoService, public calculosService: CalculosService, public documentoDetalleService: DocumentoDetalleService) {
    let empresa_id: string = sessionStorage.getItem("empresa_id");

  }

  public document: DocumentoModel;
  public activaciones: Array<ActivacionModel>;
  public clientes: Array<ClienteModel>;
  public productosAll: Array<ProductoModel>;
  public clienteActivo: boolean = false;
  public guiaTransporteActivo: boolean = false;
  public clienteObligatorioActivo: boolean = false;
  public empreadoActivo: boolean = false;
  public codigoBarrasActivo: boolean = false;
  public descuentosActivo: boolean = false;
  public clienteSelect: number;
  public empresaId: number;
  public usuarioId: number;
  public tipoDocumentSelect: number;
  public empleadoSelect: string;
  public productoIdSelect: ProductoModel;

  public productos: Array<DocumentoDetalleModel>;

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

  @ViewChild("divCantidad") divCantidad: ElementRef; // div de donde se busca  la cantidad
  @ViewChild("divCodigo") divCodigo: ElementRef; // div de donde se busca el codigo del producto
  @ViewChild("divArticulo") divArticulo: ElementRef; // div de donde se busca el articulo
  @ViewChild("divUnitario") divUnitario: ElementRef; // div de donde se busca el articulo
  @ViewChild("divParcial") divParcial: ElementRef; // div de donde se busca el articulo

  ngOnInit() {
    this.empresaId = Number(sessionStorage.getItem("empresa_id"));
    this.estadoDivBotones("d-block");
    this.siguientePV.nativeElement.focus();
    this.estadoDivProducto("d-none") // se muestra el div de producto
    this.CodigoBarrasPV.nativeElement.classList.add("d-none");
    this.usuarioId = Number(sessionStorage.getItem("usuario_id"));
    this.getclientes(this.empresaId);
    this.getActivaciones(this.usuarioId);
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
  }

  clienteSelectFun(element) {
    if (this.clienteObligatorioActivo && element.value == '') {
      alert("El cliente es obligatorio");
      return;
    } else {
      if (element.value.indexOf("|") == -1) {
        alert("se creará cliente");
      } else {
        var splitted = element.value.split("|");
        this.clienteSelect = splitted[0];
        this.document.cliente_id = this.clienteSelect;
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
        break;
      }
      case 'c':
      case 'C': {
        this.tipoDocumentSelect = 4;
        console.log("cotizacion");
        break;
      }
      case 'r':
      case 'R': {
        this.tipoDocumentSelect = 9;
        console.log("remision");
        break;
      }
      case 'f':
      case 'F': {
        this.tipoDocumentSelect = 10;
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
    if (element.id == "imprimirPV") {
      this.imprimirModal();
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
    /*
   if (element.id == "descuentoPV") {
     this.carteraPV.nativeElement.focus();
   }
   if (element.id == "carteraPV") {
     this.enterCartera(element);
   }
   if (element.id == "tarjetaPV") {
     this.enterTarjeta(element);
   }
   if (element.id == "vrTarjetaPV") {
     this.efectovoPV.nativeElement.focus();
   }
   if (element.id == "efectovoPV") {
     this.continuaImpresionPV.nativeElement.focus();
   }
   if (element.id == "continuaImpresionPV") {
     this.enterContinuarImpresion(element);

   }*/
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
    this.siguientePV.nativeElement.focus();
    this.estadoDivProducto("d-none") // se muestra el div de producto
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
    //this.descuentoPV.nativeElement.value = "";

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
  }

  getActivaciones(user: number) {
    this.usuarioService.getActivacionByUsuario(user.toString()).subscribe(res => {
      this.activaciones = res;
    });
  }

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;

    });
  }

  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(res => {
      this.productosAll = res;
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

}
