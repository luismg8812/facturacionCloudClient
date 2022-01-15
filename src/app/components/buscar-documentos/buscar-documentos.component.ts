import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivacionModel } from 'src/app/model/activacion';
import { ClienteModel } from 'src/app/model/cliente.model';
import { ConfiguracionModel } from 'src/app/model/configuracion.model';
import { DocumentoModel } from 'src/app/model/documento.model';
import { DocumentoDetalleModel } from 'src/app/model/documentoDetalle.model';
import { DocumentoInvoiceModel } from 'src/app/model/documentoInvoice.model';
import { DocumentoNotaModel } from 'src/app/model/documentoNota.model';
import { EmpleadoModel } from 'src/app/model/empleado.model';
import { EmpresaModel } from 'src/app/model/empresa.model';
import { ImpresoraEmpresaModel } from 'src/app/model/impresoraEmpresa.model';
import { InformeDiarioModel } from 'src/app/model/informeDiario.model';
import { ProductoModel } from 'src/app/model/producto.model';
import { ProveedorModel } from 'src/app/model/proveedor.model';
import { SubProductoModel } from 'src/app/model/subProducto.model';
import { TipoDocumentoModel } from 'src/app/model/tipoDocumento.model';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { CalculosService } from 'src/app/services/calculos.service';
import { CierreService } from 'src/app/services/cierre.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DocumentoDetalleService } from 'src/app/services/documento-detalle.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ImpresionService } from 'src/app/services/impresion.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FacturaModel } from 'src/app/vo/factura.model';
import { Router } from '@angular/router';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-buscar-documentos',
  templateUrl: './buscar-documentos.component.html',
  styleUrls: ['./buscar-documentos.component.css']
})
export class BuscarDocumentosComponent implements OnInit {

  public usuarios: Array<UsuarioModel>;
  public empleados: Array<EmpleadoModel>;
  public proveedores: Array<ProveedorModel>;
  public clientes: Array<ClienteModel> = [];
  public tiposDocumento: Array<TipoDocumentoModel>;
  public documentos: Array<DocumentoModel>;
  public activaciones: Array<ActivacionModel>;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;
  public itemsFactura: Array<DocumentoDetalleModel> = [];
  public tituloFactura: string = "";
  public empresaId: number;
  public documentoSelect: DocumentoModel = new DocumentoModel();
  public cambioFechaActivo: boolean = false;
  public anularFacturaActivo: boolean = false;
  public copiaFacturaActivo: boolean = false;
  public editarFacturaActivo: boolean = false;
  public usuarioId: number;
  public factura: FacturaModel;
  public configuracion: ConfiguracionModel;
  public productoIdSelect: ProductoModel = undefined;
  public productosAll: Array<ProductoModel>;
  public productosSelectList: Array<ProductoModel> = [];
  public tipos: string = "";
  public informeDiario: InformeDiarioModel;

  readonly ANULAR_FACTURA: string = '6';
  readonly COPIA_FACTURA: string = '11';
  readonly CAMBIO_FECHA: string = '22';
  readonly EDITAR_FACTURA: string = '34';
  readonly TIPO_IMPRESION_TXT80MM: number = 1;
  readonly TIPO_IMPRESION_TXT50MM: number = 2;
  readonly TIPO_IMPRESION_PDFCARTA: number = 3;
  readonly TIPO_IMPRESION_PDF80MM: number = 4;
  readonly TIPO_IMPRESION_PDF50MM: number = 5;
  readonly TIPO_IMPRESION_TXTMEDIANABOR: number = 6;

  readonly NOTA_CREDITO: number = 12;
  readonly NOTA_DEBITO: number = 13;
  readonly INVOICE_SIN_ENVIAR: number = 1;

  public fechaI: string = "";


  @ViewChild("tipoDocumento") tipoDocumento: ElementRef;
  @ViewChild("cajeroBuscar") cajeroBuscar: ElementRef;
  @ViewChild("empleadoBuscar") empleadoBuscar: ElementRef;
  @ViewChild("fechaIniBuscar") fechaIniBuscar: ElementRef;
  @ViewChild("fechaFinBuscar") fechaFinBuscar: ElementRef;
  @ViewChild("consecutivoDianBuscar") consecutivoDianBuscar: ElementRef;
  @ViewChild("internoBuscar") internoBuscar: ElementRef;
  @ViewChild("clientePV1") clientePV1: ElementRef;
  @ViewChild("proveedorBuscar") proveedorBuscar: ElementRef;
  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;

  constructor(public usuarioService: UsuarioService,
    private router: Router,
    public empleadoService: EmpleadoService,
    public empresaService: EmpresaService,
    public impresionService: ImpresionService,
    public productoService: ProductoService,
    public calculosService: CalculosService,
    public documentoDetalleService: DocumentoDetalleService,
    public documentoService: DocumentoService,
    public cierreService: CierreService,
    public proveedorService: ProveedorService,
    public clienteService: ClienteService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.usuarioId = Number(localStorage.getItem("usuario_id"));
    this.getUsuarios(this.empresaId);
    this.getEmpleados(this.empresaId);
    this.getclientes(this.empresaId);
    this.getProveedores(this.empresaId);
    this.getTiposDocumento();
    this.getActivaciones(this.usuarioId);
    this.getImpresorasEmpresa(this.empresaId);
    this.getProductosByEmpresa(this.empresaId);
    this.fechasBusqueda();
    this.factura = new FacturaModel();

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

  confirmarNota(observacion) {
    let newDocu: DocumentoModel = this.documentoSelect;
    if (observacion.value == "") {
      alert("La descripción del error es obligatoria");
      return;
    }
    this.documentoService.getByDocumentoId(this.documentoSelect.documento_id).subscribe(factura => {
      if (newDocu.total == factura[0].total) {
        alert("Los valores totales de la factura y de la nota son iguales, por lo cual no se creará la Nota");
        return;
      }
      newDocu.descripcion_trabajador = observacion.value;
      newDocu.fecha_registro = new Date();
      newDocu.usuario_id = this.usuarioId;
      newDocu.invoice_id = this.INVOICE_SIN_ENVIAR;
      newDocu.cufe = "";
      if (newDocu.total < factura[0].total) {
        newDocu.tipo_documento_id = this.NOTA_CREDITO;
      } else {
        newDocu.tipo_documento_id = this.NOTA_DEBITO;
      }
      this.documentoService.saveDocumento(newDocu).subscribe(res => {
        if (res.code == 200) {
          newDocu.documento_id = res.documento_id;
          let documentoInvoice: DocumentoInvoiceModel = new DocumentoInvoiceModel()
          documentoInvoice.documento_id = res.documento_id;
          documentoInvoice.fecha_registro = new Date();
          documentoInvoice.invoice_id = this.INVOICE_SIN_ENVIAR;
          this.crearNotaDocumento(newDocu, factura[0]);
          $('#notaModal').modal('hide');
          this.documentoService.saveInvoice(documentoInvoice).subscribe(res => {
            if (res.code == 200) {
              console.log("Se agrega estado para facturación electrónica");
            } else {
              alert("error creando documento, por favor inicie nuevamente la creación del documento, si persiste consulte a su proveedor");
              return;
            }
          });
          for (let deta of this.itemsFactura) {
            deta.documento_id = newDocu.documento_id;
            this.documentoDetalleService.saveDocumentoDetalle(deta).subscribe(res => {
              if (res.code != 200) {
                alert("Error agregando producto: " + res.error);
              }
            });
          }
          for (let p of this.productosSelectList) {
            this.productoService.updateProducto(p).subscribe(res => {
              if (res.code != 200) {
                alert("Error agregando producto: " + res.error);
              }
            });
          }

        } else {
          alert("error creando documento, por favor inicie nuevamente la creación del documento");
          return;
        }
      });
    });
  }

  crearNotaDocumento(nota: DocumentoModel, factura: DocumentoModel) {
    this.documentoService.getDocumentoNotaByDocumento(factura.documento_id).subscribe(res => {
      for (let nota of res) {
        nota.estado = 0;
        this.documentoService.updateDocumentoNota(nota).subscribe(res => {
          if (res.code == 200) {
            console.log("se edita documento nota");
          } else {
            alert("error creando documento Nota, tener en cuenta el error");
            return;
          }
        });
      }
      let newDocuNota: DocumentoNotaModel = new DocumentoNotaModel();
      newDocuNota.estado = 1;
      newDocuNota.documento_id = factura.documento_id;
      newDocuNota.documento_nota_id = nota.documento_id;
      this.documentoService.saveDocumentoNota(newDocuNota).subscribe(res => {
        if (res.code == 200) {
          console.log("se agrega documento nota");
          factura.nota_id = res.documento_nota_id;
          this.documentoService.updateDocumento(factura).subscribe(res => {
            if (res.code != 200) {
              alert("error creando documento, por favor inicie nuevamente la creación del documento");
              return;
            }
          });
        } else {
          alert("error creando documento NOta, tener en cuenta el error");
          return;
        }
      });
    });

  }

  cerrarNota() {
    $('#notaModal').modal('hide');
  }

  adjuntarProducto(cantidad) {
    if (this.productoIdSelect == undefined) {
      alert("Debe seleccionar un articulo primero");
      return;
    }
    if (cantidad.value == "") {
      alert("Debe seleccionar la cantidad primero");
      return;
    }
    this.asignarDocumentoDetalle(cantidad.value, this.productoIdSelect.costo_publico);
  }

  cambioCantidad(cantidad) {
    if (isNaN(cantidad.value)) {
      console.log("no es numérico:" + cantidad.value);
      return;
    }
    if (cantidad.value < 0) {
      console.log("la cantidad no puede ser negativa:" + cantidad.value);
      return;
    }
    let id = cantidad.id.toString().replace("c_", "");
    for (let i = 0; i < this.itemsFactura.length; i++) {
      if (this.itemsFactura[i].documento_detalle_id.toString() == id) {
        this.itemsFactura[i].cantidad = cantidad.value;
        this.itemsFactura[i].parcial = Number(cantidad.value) * this.itemsFactura[i].unitario;
        this.documentoSelect = this.calculosService.calcularExcento(this.documentoSelect, this.itemsFactura);
        break;
      }
    }
  }

  borrarItem(borrar) {

    let id = borrar.id.toString().replace("d_", "");
    for (let i = 0; i < this.itemsFactura.length; i++) {
      if (this.itemsFactura[i].documento_detalle_id.toString() == id) {
        this.productoIdSelect = this.productosAll.find(product => product.producto_id === this.itemsFactura[i].producto_id);
        this.updateCantidad(this.itemsFactura[i], 'suma');
        this.itemsFactura.splice(i, 1);
        this.documentoSelect = this.calculosService.calcularExcento(this.documentoSelect, this.itemsFactura);

        break;
      }
    }
  }

  exportTableToExcel(tableID) {
    console.log(tableID);
    let filename = "documentos";
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = tableID
    var texto = [];
    let tamanoMax: number = 40;
    
    texto.push("numero interno;proveedor;cliente;usuario crea;autorizacion DIAN;empleado;fecha registro;consecutivo DIAN;"+
    "total;exento;saldo;descuento;iva_5;iva_19;base_5;base_19;fecha_vencimiento\n");
    for (let p of this.documentos) {
      let nombreCliente:ClienteModel = this.clientes.find(cliente => cliente.cliente_id == p.cliente_id);
      texto.push(p.documento_id + ";" + " " + ";" + nombreCliente.nombre+ " "+nombreCliente.apellidos+" " +nombreCliente.razon_social + ";" + " " + ";" + " " + ";" + " " + ";" + p.fecha_registro + ";" +
       p.consecutivo_dian + ";" + p.total  + ";" + p.excento + ";" + p.saldo+ ";" + p.descuento + ";" + p.iva_5+ ";" +
        Number(p.iva_19)+ ";" + p.base_5+ ";" + p.base_19+ ";" + p.fecha_vencimiento+ '\n');
    }


    // Specify file name
    filename = filename ? filename + '.csv' : 'excel_data.csv';



    var blob = new Blob(texto, {
      type: dataType
    });
    this.descargarArchivo(blob, filename)

  }
  

  cambioFecha(fechaVencimiento){
    this.documentoSelect.fecha_registro=fechaVencimiento.value;
    console.log(this.documentoSelect.fecha_registro);
     this.documentoService.updateDocumento(this.documentoSelect).subscribe(res => {
       if (res.code != 200) {
         alert("error creando documento, por favor inicie nuevamente la creación del documento");
         return;
       }else{
        $('#cambioFechaModal').modal('hide');
        
       }
     });
   }

  cambioUnitario(unitario) {
    if (isNaN(unitario.value)) {
      alert("no es numérico:" + unitario.value);
      return;
    }
    if (unitario.value < 0) {
      alert("el valor unitario no puede ser negativa:" + unitario.value);
      return;
    }
    let id = unitario.id.toString().replace("u_", "");
    for (let i = 0; i < this.itemsFactura.length; i++) {
      if (this.itemsFactura[i].documento_detalle_id.toString() == id) {
        this.itemsFactura[i].unitario = unitario.value;
        this.itemsFactura[i].parcial = Number(unitario.value) * this.itemsFactura[i].cantidad;
        this.documentoSelect = this.calculosService.calcularExcento(this.documentoSelect, this.itemsFactura);
        break;
      }
    }
  }

  private asignarDocumentoDetalle(cantidad: number, costo_publico: number) {
    let docDetalle = new DocumentoDetalleModel();
    docDetalle.cantidad = cantidad;
    docDetalle.saldo = Number(this.productoIdSelect.cantidad);
    docDetalle.impuesto_producto = Number(this.productoIdSelect.impuesto);
    docDetalle.peso_producto = Number(this.productoIdSelect.peso);
    docDetalle.producto_id = this.productoIdSelect.producto_id;
    docDetalle.documento_id = this.documentoSelect.documento_id;
    docDetalle.descripcion = this.productoIdSelect.nombre;
    docDetalle.costo_producto = this.productoIdSelect.costo;
    docDetalle.fecha_registro = new Date;
    docDetalle.estado = 1;
    //se valida promocion
    if (this.calculosService.validarPromo(this.productoIdSelect, cantidad)) {
      let precioPromo: number = this.productoIdSelect.pub_promo;
      let cantidadPromo: number = this.productoIdSelect.kg_promo;
      let unitarioPromo: number = precioPromo / cantidadPromo;
      docDetalle.parcial = cantidad * unitarioPromo;
      docDetalle.unitario = unitarioPromo;
    } else {
      if (cantidad != null && costo_publico != null) {
        docDetalle.parcial = cantidad * costo_publico;
        docDetalle.unitario = costo_publico;
      } else {
        docDetalle.parcial = 0;
        docDetalle.unitario = 0;
      }
    }
    console.log(docDetalle);
    this.itemsFactura.unshift(docDetalle);
    this.documentoSelect = this.calculosService.calcularExcento(this.documentoSelect, this.itemsFactura);
    this.updateCantidad(docDetalle, 'resta');
  }

  updateCantidad(anterior: DocumentoDetalleModel, operacion: string) {
    let newCantidad: number = this.productoIdSelect.cantidad;
    let product: ProductoModel = new ProductoModel();
    product = this.productoIdSelect;
    if (operacion == 'suma') {
      product.cantidad = Number(newCantidad) + Number(anterior.cantidad);
    } else {
      product.cantidad = Number(newCantidad) - Number(anterior.cantidad);
    }
    //this.restarCantidadesSubProducto(anterior, operacion);
    this.productosSelectList.push(product);
    console.log(product);
  }

  private restarCantidadesSubProducto(productoSelect3: DocumentoDetalleModel, operacion: string) {
    this.productoService.getSubProductoByProductoId(productoSelect3.producto_id).subscribe(res => {
      let subProductoList: Array<SubProductoModel> = res;
      for (let p of subProductoList) {
        this.productoService.getProductoById(p.producto_hijo.toString(), this.empresaId.toString()).subscribe(result => {
          let obj = result[0];
          if (operacion == 'suma') {
            obj.cantidad = Number(obj.cantidad) + Number(p.cantidad);
          } else {
            obj.cantidad = Number(obj.cantidad) - Number(p.cantidad);
          }
          this.productoService.updateCantidad(obj).subscribe();
        });
      }
    });
  }

  articuloSelect(element) {
    console.log("articulo select:" + element.value);
    let productoNombre: string = element.value;
    this.productoIdSelect = this.productosAll.find(product => product.nombre === productoNombre);
    console.log(this.productoIdSelect);
  }

  tiposPagoNombres(documento_id) {
    //console.log("documento:" + documento_id);

  }

  editarFactura(documentoCopi: DocumentoModel) {
    console.log("entra a editar factura"+ documentoCopi.documento_id);
    localStorage.setItem("factura_editar", documentoCopi.documento_id);
    //this.router.navigate(['/user']);
    $('#buscarDocumentoXFech').modal('hide');
    let currentUrl = '/ventasDia';
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
    
  }


  imprimirCopia(documentoCopi: DocumentoModel) {
    this.documentoSelect = documentoCopi;
    let tipoImpresion = 0;
    for (var i = 0; i < this.impresoraEmpresa.length; i++) {
      if (this.documentoSelect.impresora == Number(this.impresoraEmpresa[i].numero_impresora)) {
        tipoImpresion = this.impresoraEmpresa[i].tipo_impresion_id;
      }
    }

    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      this.documentoDetalleService.getDocumentoDetalleByDocumento(this.documentoSelect.documento_id).subscribe(res1 => {
        this.itemsFactura = res1;
        console.log("detalles encontrados:" + res.length);
        switch (this.documentoSelect.tipo_documento_id) {

          case 1:
            this.tituloFactura = " ENTRADA POR GUIA";
            break;
          case 2:
            this.tituloFactura = "ENTRADA ALMACEN";
            break;
          case 6:
            this.tituloFactura = "SALIDAS ALMACEN";
            break;
          case 12:
            this.tituloFactura = "NOTA CREDITO";
            break;
          case 13:
            this.tituloFactura = "NOTA DEBITO";
            break;
          case 10:
            this.tituloFactura = "FACTURA DE VENTA";
            break;
          case 4:
            this.tituloFactura = "No. DE COTIZACIÓN";
            break;
          case 9:
            this.tituloFactura = "FACTURA DE VENTA.";
            break;
          default:
            break;
        }
        this.documentoService.getTipoPagoByDocumento(this.documentoSelect.documento_id).subscribe(res3 => {
          this.tipos = res3[0].nombre;
          this.imprimirFactura(1, res[0], tipoImpresion);
        });


      });
    });

  }

  imprimirFactura(numeroImpresiones: number, empresa: EmpresaModel, tipoImpresion: number) {
    console.log("entra a imprimir factura");
    let tituloDocumento: string = "";
    if (numeroImpresiones == undefined) {
      numeroImpresiones = 1;
    }
    tituloDocumento = this.tituloFactura + "_" + this.documentoSelect.consecutivo_dian + "_" + this.documentoSelect.impresora + "_false_" + numeroImpresiones + "_" + tipoImpresion;
    this.factura.documento = this.documentoSelect;
    this.factura.nombreTipoDocumento = this.tituloFactura;
    this.factura.detalle = this.itemsFactura
    this.factura.titulo = tituloDocumento;
    this.factura.empresa = empresa;
    this.factura.tipoPago = this.tipos;
    let formato = "";
    this.factura.nombreUsuario = localStorage.getItem("nombreUsuario");
    this.factura.cliente = this.clientes.find(cliente => cliente.cliente_id == this.documentoSelect.cliente_id);
    for (var i = 0; i < numeroImpresiones; i++) {
      switch (tipoImpresion) {
        case this.TIPO_IMPRESION_TXT80MM:
          formato = ".txt";
          this.descargarArchivo(this.impresionService.imprimirFacturaTxt80(this.factura, this.configuracion), tituloDocumento + formato);
          break;
        case this.TIPO_IMPRESION_TXT50MM:
          formato = ".txt";
          this.descargarArchivo(this.impresionService.imprimirFacturaTxt50(this.factura, this.configuracion), tituloDocumento + formato);
          break;
        case this.TIPO_IMPRESION_TXTMEDIANABOR:
          formato = ".txt";
          this.descargarArchivo(this.impresionService.imprimirFacturaTxtMediaNabor(this.factura, this.configuracion), tituloDocumento + formato);
          break;

        case this.TIPO_IMPRESION_PDF80MM:
          formato = ".pdf";
          this.impresionService.imprimirFacturaPdf80(this.factura, this.configuracion, false);
          break;
        case this.TIPO_IMPRESION_PDF50MM:
          formato = ".pdf";
          this.impresionService.imprimirFacturaPdf50(this.factura, this.configuracion, false);
          break;
        case this.TIPO_IMPRESION_PDFCARTA:
          this.impresionService.imprimirFacturaPDFCarta(this.factura, this.configuracion, false);
          break;
        default:
          alert("no tiene un tipo impresion configurado el sistema");
          //return;
          //Impresion.imprimirPDF(getDocumento(), getProductos(), usuario(), configuracion, impresora,
          //    enPantalla, e);
          break;
      }
    }
  }

  closeModal() {
    $('#detalleDocumentoModal').modal('hide');
  }

  nombreClienteFun(id) {

    let cliente = this.clientes.find(cliente => cliente.cliente_id == id);
    if (cliente == undefined) {
      return "";
    } else {
      return cliente.nombre + " " + cliente.apellidos + " " + cliente.razon_social;
    }
  }



  detalleDocumento(documento: DocumentoModel) {
    this.tipos = "";
    this.documentoSelect = documento;
    this.documentoDetalleService.getDocumentoDetalleByDocumento(documento.documento_id).subscribe(res => {
      this.itemsFactura = res;
      console.log("detalles encontrados:" + res.length);
    });
    this.documentoService.getTipoPagoByDocumento(documento.documento_id).subscribe(res => {
      for (let c of res) {
        this.tipos = this.tipos + c.nombre + ": " + c.valor + "\n";
        console.log(this.tipos);
      }
      return this.tipos;
    });
  }

  buscarDocumentos() {
    let tipoDocumento: string = this.tipoDocumento.nativeElement.value;
    let cajeroBuscar: string = this.cajeroBuscar.nativeElement.value;
    let empleadoBuscar: string = this.empleadoBuscar.nativeElement.value;
    let fechaIniBuscar: string = this.fechaIniBuscar.nativeElement.value;
    let fechaFinBuscar: string = this.fechaFinBuscar.nativeElement.value;
    let consecutivoDianBuscar: string = this.consecutivoDianBuscar.nativeElement.value;
    let internoBuscar: string = this.internoBuscar.nativeElement.value;
    let clientePV: string = this.clientePV1.nativeElement.value;
    let proveedorBuscar: string = this.proveedorBuscar.nativeElement.value;
    if (tipoDocumento == "") {
      tipoDocumento = "10";
    }

    fechaIniBuscar = this.calculosService.fechaIniBusqueda(this.fechaIniBuscar.nativeElement.value);


    fechaFinBuscar = this.calculosService.fechaFinBusqueda(this.fechaFinBuscar.nativeElement.value);
    let proveedor = this.proveedores.find(proveedor => proveedor.nombre == proveedorBuscar);
    let cliente1 = this.clientes.find(cliente => (cliente.nombre + ' ' + cliente.apellidos + ' ' + cliente.razon_social + ' - ' + cliente.documento) == clientePV);
    let cliente_id = "";
    if (cliente1 != undefined) {
      cliente_id = cliente1.cliente_id.toString();
    }
    let proveedor_id = "";
    if (proveedor != undefined) {
      proveedor_id = proveedor.proveedor_id.toString();
    }
    console.log(tipoDocumento);
    this.documentoService.getDocumentoByTipoAndFecha(tipoDocumento, cajeroBuscar, empleadoBuscar, fechaIniBuscar, fechaFinBuscar,
      consecutivoDianBuscar, internoBuscar, cliente_id, proveedor_id, this.empresaId).subscribe(res => {
        this.documentos = res;
      });

  }

  getActivaciones(user: number) {
    this.usuarioService.getActivacionByUsuario(user.toString()).subscribe(res => {
      this.activaciones = res;
      for (var e = 0; e < this.activaciones.length; e++) {
        if (this.activaciones[e].activacion_id == this.CAMBIO_FECHA) {
          console.log("cambio de fecha activo");
          this.cambioFechaActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.ANULAR_FACTURA) {
          console.log("anular factura activo");
          this.anularFacturaActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.COPIA_FACTURA) {
          console.log("copia factura activo");
          this.copiaFacturaActivo = true;
        }
        if (this.activaciones[e].activacion_id == this.EDITAR_FACTURA) {
          console.log("editar factura activo");
          this.editarFacturaActivo = true;
        }

      }
    });
  }

  getUsuarios(empresaId: number) {
    this.usuarioService.getByUsuario(null, empresaId.toString(), null).subscribe(res => {
      this.usuarios = res;
    });
  }

  getImpresorasEmpresa(empresaId: number) {
    this.clienteService.getImpresorasEmpresa(empresaId.toString()).subscribe(res => {
      this.impresoraEmpresa = res;
      console.log("impresoras configuradas en la empresa:" + res.length);
    });
  }

  getConfiguracion(empresaId: number) {
    this.clienteService.getConfiguracionByEmpresa(empresaId.toString()).subscribe(res => {
      this.configuracion = res[0];
    });
  }

  getEmpleados(empresaId: number) {
    this.empleadoService.getEmpleadoAll(empresaId).subscribe(res => {
      this.empleados = res;
      console.log("lista de empleados cargados: " + this.empleados.length);
    });
  }

  getclientes(empresaId: number) {
    this.clienteService.getClientesByEmpresa(empresaId.toString()).subscribe(res => {
      this.clientes = res;
      console.log("lista de clientes cargados: " + this.clientes.length);
    });
  }

  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(res => {
      this.productosAll = res;
    });
  }

  getTiposDocumento() {
    this.documentoService.getTiposDocumento().subscribe(res => {
      this.tiposDocumento = res;
    });
  }

  getProveedores(empresaId: number) {
    this.proveedorService.getProveedoresByEmpresa(empresaId.toString()).subscribe(res => {
      this.proveedores = res;
      console.log("lista de proveedores cargados: " + this.proveedores.length);
    });
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  descargarArchivo(contenidoEnBlob, nombreArchivo) {
    const url = window.URL.createObjectURL(contenidoEnBlob);
    const link = this.downloadZipLink.nativeElement;
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }


}
