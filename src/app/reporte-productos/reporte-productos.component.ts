import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { ProveedorService } from '../services/proveedor.service';
import { ProductoModel } from '../model/producto.model';

@Component({
  selector: 'app-reporte-productos',
  templateUrl: './reporte-productos.component.html',
  styleUrls: ['./reporte-productos.component.css']
})
export class ReporteProductosComponent implements OnInit {

  public grupoList: Array<any>;
  public proveedorList: Array<any>;
  public empresaId: number;
  public productos:Array<ProductoModel>;
  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;
  constructor(public productoService:ProductoService,
    public proveedorService:ProveedorService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getProveedores(this.empresaId);
    this.getGrupos(this.empresaId);
    this.getproductos();
  }

  buscar(grupo,proveedores){
    console.log(grupo.value);
    this.productoService.getProductosByGrupo(this.empresaId.toString(),grupo.value,proveedores.value).subscribe(res => {
      this.productos = res;
    });
  }

   exportTableToExcel(tableID){
     console.log(tableID);
    let filename="productos";
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = tableID
    var texto = [];
    let tamanoMax: number = 40;
    texto.push("Nombre;Costo Publico;costo;Cantidad;IVA;Codigo Barras\n");
    for(let p of this.productos){
      texto.push(p.nombre+";"+p.costo_publico+";"+p.costo+";"+p.cantidad+";"+p.impuesto+";"+p.codigo_barras+'\n');
    }
    
    
    // Specify file name
    filename = filename?filename+'.csv':'excel_data.csv';
    

  
    var blob = new Blob(texto, {
      type: dataType
    });
       this.descargarArchivo(blob,filename)
   
}

descargarArchivo(contenidoEnBlob, nombreArchivo) {
  const url = window.URL.createObjectURL(contenidoEnBlob);
  const link = this.downloadZipLink.nativeElement;
  link.href = url;
  link.download = nombreArchivo;
  link.click();
  window.URL.revokeObjectURL(url);
}

  getproductos(){
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

}
