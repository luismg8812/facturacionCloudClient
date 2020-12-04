import { Component, OnInit } from '@angular/core';
import { DocumentoDetalleModel } from 'src/app/model/documentoDetalle.model';
import { ProductoModel } from 'src/app/model/producto.model';
import { TipoDocumentoModel } from 'src/app/model/tipoDocumento.model';
import { CalculosService } from 'src/app/services/calculos.service';
import { DocumentoDetalleService } from 'src/app/services/documento-detalle.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.css']
})
export class KardexComponent implements OnInit {

  constructor(public calculosService:CalculosService,
    public productoService:ProductoService,
    public documentoService:DocumentoService,
    public documentoDetalleService:DocumentoDetalleService) { }

  public fechaI: string = "";
  public documentoDetelleList:Array<any>=[];
  public empresaId: number;
  public productosAll: Array<ProductoModel>;
  public tiposDocumento: Array<TipoDocumentoModel>;

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getProductosByEmpresa(this.empresaId);
    this.fechasBusqueda();
    this.getTiposDocumento();  
  }

  fechasBusqueda() {  
    let date: Date = new Date();
    let mes: string = "" + (date.getMonth() - 4);
    if (mes.length == 1) {
      mes = '0' + mes;
    }
    let ano = date.getFullYear();
    this.fechaI = ano + "-" + mes + "-" + '01';
    console.log(this.fechaI);
  }

  nombreTipoDocumentoFun(id) {
    let tipoDo = this.tiposDocumento.find(cliente => cliente.tipo_documento_id == id);
    if (tipoDo == undefined) {
      return "";
    } else {
      return tipoDo.nombre;
    }
  }

  public buscar(fechaInicial, fechaFinal,producto){
    console.log(producto.value);
    let ini: string = fechaInicial.value;
    let fin: string = fechaFinal.value;
    let productoId="";
    let nombreParcial="";
    let productoSelect:ProductoModel= this.productosAll.find(product => product.nombre === producto.value);
    if(productoSelect==undefined){
      nombreParcial=producto.value;
    }else{
      productoId=productoSelect.producto_id.toString();
    }
    
    if(nombreParcial=="" && productoId==""){
      alert("La selección del producto es obligatoria");
      return;
    }
    console.log(fechaInicial.value);
    if (ini != '' && fin != '') {
      ini = this.calculosService.fechaIniBusqueda(fechaInicial.value);
      fin = this.calculosService.fechaFinBusqueda(fechaFinal.value);
    } else {
      let date: Date = new Date();
      date.setDate(1);
      ini = date.toLocaleString();
      date.setDate(30);
      fin = date.toLocaleString();
    }
    this.documentoDetalleService.getKardex(ini, fin, productoId, nombreParcial,this.empresaId).subscribe(res => {
      this.documentoDetelleList = res;
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

}
