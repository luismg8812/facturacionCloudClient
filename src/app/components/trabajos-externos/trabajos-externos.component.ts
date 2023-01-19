import { Component, OnInit } from '@angular/core';
import { DocumentoDetalleModel } from 'src/app/model/documentoDetalle.model';
import { ProveedorModel } from 'src/app/model/proveedor.model';
import { DocumentoDetalleService } from 'src/app/services/documento-detalle.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { ProveedorService } from 'src/app/services/proveedor.service';

@Component({
  selector: 'app-trabajos-externos',
  templateUrl: './trabajos-externos.component.html',
  styleUrls: ['./trabajos-externos.component.css']
})
export class TrabajosExternosComponent implements OnInit {

  public proveedores: Array<ProveedorModel>;
  public empresaId: number;
  public detalles: Array<DocumentoDetalleModel>;

  constructor(public proveedorService:ProveedorService,
    public documentoDetalleService:DocumentoDetalleService) { }



  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getProveedores(this.empresaId);
  }

  buscar(proveedor, fechaIni, fechaFin,estado,orden) {
    console.log(proveedor.value);
    let proveedor1 = this.proveedores.find(prov => (prov.nombre+' '+prov.apellidos+' - '+prov.documento) == proveedor.value);   
    console.log(proveedor1);
    let id= (proveedor1==undefined?"":proveedor1.proveedor_id);
    this.documentoDetalleService.getDetalleExterno(id, fechaIni.value, fechaFin.value, 2,orden.value).subscribe(res => {
      console.log(res);
      this.detalles = res;
    });
  }

  exportTableToExcel() {
    /*let filename = "reporte_cartera";
    var dataType = 'application/vnd.ms-excel';
    var texto = [];
    let tamanoMax: number = 40;
    texto.push("fecha registro;Cliente;N. interno;Consecutivo DIAN;Valor Factura;Valor Credito;Saldo\n");
    for (let p of this.cartera) {
      texto.push(p.fecha_registro + ";" + this.nombreProveedorFun( p.proveedor_id) + ";" + p.documento_id + ";" + p.consecutivo_dian + ";" + p.total + ";" + p.valor + ";" + p.saldo+'\n');
    }
    // Specify file name
    filename = filename ? filename + '.csv' : 'reporte_cartera.csv';
    var blob = new Blob(texto, {
      type: dataType
    });
    this.descargarArchivo(blob, filename)
*/
  }

  nombreProveedorFun(id) {

    let cliente = this.proveedores.find(cliente => cliente.proveedor_id == id);
    if (cliente == undefined) {
      return ""; 
    } else {
      return cliente.nombre;
    } 
  }

  formatearNumber(number: number) {
    let formato: string = "";
    formato = new Intl.NumberFormat().format(number);
    return formato;
  }

  getProveedores(empresaId: number) {
    this.proveedorService.getProveedoresByEmpresa(empresaId.toString()).subscribe(res => {
      this.proveedores = res;
      console.log("lista de proveedores cargados: " + this.proveedores.length);
    });
  }

}
