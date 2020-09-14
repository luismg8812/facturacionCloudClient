import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { ProveedorService } from '../services/proveedor.service';
import { ProductoModel } from '../model/producto.model';
import { ClienteService } from '../services/cliente.service';
import { ImpresoraEmpresaModel } from '../model/impresoraEmpresa.model';
import { EmpresaService } from '../services/empresa.service';
import { ImpresionService } from '../services/impresion.service';
import { EmpresaModel } from '../model/empresa.model';
import { SubGrupoModel } from '../model/subGrupo.model';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-reporte-productos',
  templateUrl: './reporte-productos.component.html',
  styleUrls: ['./reporte-productos.component.css']
})
export class ReporteProductosComponent implements OnInit {

  public grupoList: Array<any>;
  public subGrupoList: Array<SubGrupoModel>;
  public proveedorList: Array<any>;
  public impresoraEmpresa: Array<ImpresoraEmpresaModel>;
  public empresaId: number;
  public empresa: EmpresaModel;
  public productos: Array<ProductoModel>;

  public agotados:boolean=false;
  public stock:boolean=false;
  public producto:boolean=false;

  readonly TIPO_IMPRESION_TXT80MM: number = 1;
  readonly TIPO_IMPRESION_TXT50MM: number = 2;
  readonly TIPO_IMPRESION_PDFCARTA: number = 3;
  readonly TIPO_IMPRESION_PDF50MM: number = 5;

  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;
  constructor(public productoService: ProductoService,
    public clienteService: ClienteService,
    public impresionService: ImpresionService,
    public empresaService: EmpresaService,
    public proveedorService: ProveedorService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getProveedores(this.empresaId);
    this.getGrupos(this.empresaId);
    this.getSubGrupos(this.empresaId);
    this.getproductos();
    this.getImpresorasEmpresa(this.empresaId);
    this.getEmpresa();
  }

  buscar(grupo, proveedores,subgrupo) {
    console.log(grupo.value);
    this.productoService.getProductosByGrupo(this.empresaId.toString(), grupo.value, proveedores.value,this.agotados,this.stock,this.producto,subgrupo.value).subscribe(res => {
      this.productos = res;
    });
  }

  reporteCostos() {
    this.impresionService.reporteCostos(this.productos, this.empresa);
  }

  estrella( element, event) {
    if(element.id=="agotado"){
      if (event.target.checked) {
        this.agotados=true;
      }else{
        this.agotados=false;
      }
      console.log(this.agotados);
    }
    if(element.id=="stock"){
      if (event.target.checked) {
        this.stock=true;
      }else{
        this.stock=false;
      }
      console.log(this.agotados);
    }
    if(element.id=="producto"){
      if (event.target.checked) {
        this.producto=true;
      }else{
        this.producto=false;
      }
      console.log(this.agotados);
    }
    
  }



  imprimirOrden(impresora) {


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
    tituloDocumento = "reporte_productos" + tipoImpresion;
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      let empr = res;
      switch (tipoImpresion) {
        case this.TIPO_IMPRESION_TXT80MM:
          this.descargarArchivo(this.impresionService.imprimirReporteProductosTxt80(this.productos), tituloDocumento + '.txt');
          break;
        case this.TIPO_IMPRESION_TXT50MM:
          this.descargarArchivo(this.impresionService.imprimirReporteProductosTxt50(this.productos), tituloDocumento + '.txt');
          break;
        case this.TIPO_IMPRESION_PDF50MM:
          // this.impresionService.imprimirOrdenPDF50(this.factura, false);
          break;
        default:
          alert("El tipo de impresion seleccionado no se encuetra configurado para su empresa");
          return;
          //Impresion.imprimirPDF(getDocumento(), getProductos(), usuario(), configuracion, impresora,
          //    enPantalla, e);
          break;
      }
      $('#imprimirModal').modal('hide');
    });

  }



  exportTableToExcel(tableID) {
    console.log(tableID);
    let filename = "productos";
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = tableID
    var texto = [];
    let tamanoMax: number = 40;
    texto.push("Producto;IdNombre;Costo Publico;costo;Cantidad;IVA;Codigo Barras;GrupoId\n");
    for (let p of this.productos) {
      texto.push(p.producto_id + ";" + p.nombre + ";" + p.costo_publico + ";" + p.costo + ";" + p.cantidad + ";" + p.impuesto + ";" + p.codigo_barras + ";" + p.grupo_id + '\n');
    }


    // Specify file name
    filename = filename ? filename + '.csv' : 'excel_data.csv';



    var blob = new Blob(texto, {
      type: dataType
    });
    this.descargarArchivo(blob, filename)

  }

  descargarArchivo(contenidoEnBlob, nombreArchivo) {
    const url = window.URL.createObjectURL(contenidoEnBlob);
    const link = this.downloadZipLink.nativeElement;
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getproductos() {
    this.productoService.getProductosByEmpresa(this.empresaId.toString()).subscribe(res => {
      this.productos = res;
    });
  }

  getGrupos(empresaId: number) {
    this.productoService.getGruposByEmpresa(empresaId.toString()).subscribe(res => {
      this.grupoList = res;
      console.log("lista de grupos cargados: " + this.grupoList.length);
    });
  }

  getSubGrupos(empresaId: number) {
    this.productoService.getSubGruposByEmpresa(empresaId.toString()).subscribe(res => {
      this.subGrupoList = res;
      console.log("lista de grupos cargados: " + this.grupoList.length);
    });
  }

  getEmpresa() {
    this.empresaService.getEmpresaById(this.empresaId.toString()).subscribe(res => {
      this.empresa = res[0];
    });
  }

  getProveedores(empresaId: number) {
    this.proveedorService.getProveedoresByEmpresa(empresaId.toString()).subscribe(res => {
      this.proveedorList = res;
      console.log("lista de proveedores cargados: " + this.proveedorList.length);
    });
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  getImpresorasEmpresa(empresaId: number) {
    this.clienteService.getImpresorasEmpresa(empresaId.toString()).subscribe(res => {
      this.impresoraEmpresa = res;
      console.log("impresoras configuradas en la empresa:" + res.length);
    });
  }

}
