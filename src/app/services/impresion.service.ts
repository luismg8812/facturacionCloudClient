import { Injectable } from '@angular/core';
import { DocumentoModel } from '../model/documento.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { ConfiguracionModel } from '../model/configuracion.model';
import { FacturaModel } from '../vo/factura.model';
import { CalculosService } from './calculos.service';
import * as jsPDF from 'jspdf';
import { Observable, Observer } from 'rxjs';
import { DetalleNominaModel } from '../model/detalleNomina.model';
import { CuadreCajaVoModel } from '../model/cuadreCajaVo.model';
import { EmpresaModel } from '../model/empresa.model';
import { InformeDiarioVOModel } from '../model/informeDiarioVO.model';
import { UsuarioService } from './usuario.service';
import { DocumentoService } from './documento.service';
import { EnvioFacturacionElectronicaModel } from '../facturacion.cloud.model/envioFacturacionElectronica.model';
import { AppConfigService } from './app-config.service';
import { ProductoModel } from '../model/producto.model';


@Injectable({
  providedIn: 'root'
})

export class ImpresionService {
  public doc = new jsPDF();
  readonly ROL_CAJERO: string = '2';
  readonly TIPO_DOCUMENTO_FACTURA: string = '10';

  constructor(public calculosService: CalculosService,
    public documentoService: DocumentoService,
    public usuarioService: UsuarioService) { }

  imprimirCuadreTxt80(factura: CuadreCajaVoModel, empresa: EmpresaModel, nombreUsuario: string) {
    //Genera un objeto Blob con los datos en un archivo TXT
    console.log(factura);
    var texto = [];
    let tamanoMax: number = 40;
    texto.push('----------------------------------------\n');
    texto.push(this.calculosService.centrarDescripcion(empresa.nombre, tamanoMax) + "\n");//nombre empresa
    texto.push(this.calculosService.centrarDescripcion(empresa.slogan, tamanoMax) + "\n");//slogan
    texto.push(this.calculosService.centrarDescripcion(empresa.represente, tamanoMax) + "\n");//representante
    texto.push(this.calculosService.centrarDescripcion("NIT. " + empresa.nit + " " + empresa.regimen, tamanoMax) + "\n");//nit y regimen
    texto.push(this.calculosService.centrarDescripcion(empresa.direccion, tamanoMax) + "\n");//direccion
    texto.push(this.calculosService.centrarDescripcion(empresa.barrio, tamanoMax) + "\n");//barrio
    texto.push(this.calculosService.centrarDescripcion("TEL: " + empresa.telefono_fijo + " " + empresa.cel, tamanoMax) + "\n");//telefonos
    texto.push('\n');
    texto.push("CUADRE DE CAJA " + "\n");//consecutivo
    texto.push("FECHA: " + this.calculosService.cortarDescripcion(new Date().toLocaleString(), 19) + "\n");//fecha
    texto.push("CAJERO: " + nombreUsuario + "\n");//fecha
    texto.push("CAJA: " + '\n');
    texto.push("ENTREGO:______________________________" + '\n');
    texto.push("Factura inicial:.......: " + '\n');
    texto.push("Factura final:.........: " + '\n');
    texto.push('----------------------------------------\n');
    texto.push('DESCRIPCION                        TOTAL\n');
    texto.push('----------------------------------------\n');
    let totalFacturas: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.total_facturas), 12);
    let base: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.base), 12);
    let cheques: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.cheques), 12);
    let otros: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.otros), 12);
    let recargas: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(0), 12);
    let totalIngresos: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.totalIngresos), 12);
    let fajos: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.fajos), 12);
    let monedas: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.moneda), 12);
    let tarjetas: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.tarjetas), 12);
    let varios: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.varios), 12);
    let vales: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.vales), 12);
   let gastos: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.gastado), 12);
    let propina: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.propina), 12);
    let credito: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.cartera), 12);
    let retirosCaja: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.retiro_caja), 12);
    let efectivo: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.efectivo), 12);

    texto.push("Total Facturas:.........:" + totalFacturas + "\n");
    texto.push("Base:...................:" + base + "\n");
    texto.push("Cheques Recogidos:.....: " + cheques + "\n");
    texto.push("Otros:.................: " + otros + "\n"); 
    texto.push("Recargas:..............: " + recargas + "\n");
    texto.push("TOTAL MOV. DEL DIA:....: " + totalIngresos + "\n");
    texto.push('----------------------------------------\n');
    texto.push("VR. EN FAJOS:..........: " + fajos + "\n");
    texto.push("MONEDA: ...............: " + monedas + "\n");
    texto.push("EFECTIVO:..............: " + efectivo + "\n");
    texto.push("CHEQUES:...............: " + cheques + "\n");
    texto.push("DOC. ESPECIALES:.......:           0" + "\n");
    texto.push("TARJET DEBIT Y CREDITO.: " + tarjetas + "\n");
    texto.push("VARIOS:................: " + varios + "\n");
    texto.push("VALES:.................: " + vales + "\n");
    texto.push("NOMINA:................:           0" + "\n");
    texto.push("GASTOS:................: " + gastos + "\n");
    texto.push("PROPIAS:...............: " + propina + "\n");
    texto.push("VENTAS A CREDITO:......: " + credito + "\n");
    texto.push("RETIROS DE CAJA:.......: " + retirosCaja + "\n");
    texto.push('----------------------------------------\n');
    texto.push((Number(factura.diferencia) < 0.0 ? "SOBRANTE" : "FALTANTE") + "..: $" + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.diferencia), 12) + "\n");
    texto.push('----------------------------------------\n');
    console.log(factura.empleados);
    if (factura.empleados != undefined) {
      texto.push('Ventas por empleado\n');
      for (let emp of factura.empleados) {
        texto.push(emp.nombre + ":...$" + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(emp.subtotal), 12) + '\n');
      }
      texto.push('----------------------------------------\n');
    }
    if (factura.grupos != undefined) {
      texto.push('Ventas por Grupo\n');
      for (let emp of factura.grupos) {
        texto.push(emp.nombre + ":...$" + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(Number(emp.total)), 12) + '\n');
      }
      texto.push('----------------------------------------\n');
    }

    texto.push('----------------------------------------\n');
    texto.push(this.calculosService.centrarDescripcion("\n", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("Software desarrollado por:", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("info@effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    return new Blob(texto, {
      type: 'text/plain'
    });
  }

  imprimirCuadreTxt50(factura: CuadreCajaVoModel, empresa: EmpresaModel, nombreUsuario: string) {
    //Genera un objeto Blob con los datos en un archivo TXT
    var texto = [];
    let tamanoMax: number = 32;
    texto.push('--------------------------------\n');
    texto.push(this.calculosService.centrarDescripcion(empresa.nombre, tamanoMax) + "\n");//nombre empresa
    texto.push(this.calculosService.centrarDescripcion(empresa.slogan, tamanoMax) + "\n");//slogan
    texto.push(this.calculosService.centrarDescripcion(empresa.represente, tamanoMax) + "\n");//representante
    texto.push(this.calculosService.centrarDescripcion("NIT. " + empresa.nit + " " + empresa.regimen, tamanoMax) + "\n");//nit y regimen
    texto.push(this.calculosService.centrarDescripcion(empresa.direccion, tamanoMax) + "\n");//direccion
    texto.push(this.calculosService.centrarDescripcion(empresa.barrio, tamanoMax) + "\n");//barrio
    texto.push(this.calculosService.centrarDescripcion("TEL: " + empresa.telefono_fijo + " " + empresa.cel, tamanoMax) + "\n");//telefonos
    texto.push('\n');
    texto.push("CUADRE DE CAJA " + "\n");//consecutivo
    texto.push("FECHA: " + this.calculosService.cortarDescripcion(new Date().toLocaleString(), 19) + "\n");//fecha
    texto.push("CAJERO: " + nombreUsuario + "\n");//fecha
    texto.push("CAJA: " + '\n');
    texto.push("ENTREGO:______________________" + '\n');
    texto.push("Factura inicial:..: " + '\n');
    texto.push("Factura final:....: " + '\n');
    texto.push('--------------------------------\n');
    texto.push('DESCRIPCION                TOTAL\n');
    texto.push('--------------------------------\n');
    let totalFacturas: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.total_facturas).replace("COP", ""), 12);
    let base: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.base).replace("COP", ""), 12);
    let cheques: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.cheques).replace("COP", ""), 12);
    let otros: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.otros).replace("COP", ""), 12);
    let recargas: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(0).replace("COP", ""), 12);
    let totalIngresos: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.totalIngresos).replace("COP", ""), 12);
    let fajos: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.fajos).replace("COP", ""), 12);
    let monedas: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.moneda).replace("COP", ""), 12);
    let tarjetas: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.tarjetas).replace("COP", ""), 12);
    let varios: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.varios).replace("COP", ""), 12);
    let vales: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.vales).replace("COP", ""), 12);
    let gastos: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.gastado).replace("COP", ""), 12);
    let nomina: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.nomina), 12);
    let propina: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.propina).replace("COP", ""), 12);
    let credito: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.cartera).replace("COP", ""), 12);
    let efectivo: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.efectivo).replace("COP", ""), 12);
    let retirosCaja: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.retiro_caja), 12);
    texto.push("Total Facturas:...:" + totalFacturas + "\n");
    texto.push("Base:.............:" + base + "\n");
    texto.push("Cheques Recogidos.: " + cheques + "\n");
    texto.push("Otros:............: " + otros + "\n");
    texto.push("Recargas:.........: " + recargas + "\n");
    texto.push("TOTAL MOV. DEL DIA: " + totalIngresos + "\n");
    texto.push('--------------------------------\n');
    texto.push("VR. EN FAJOS:.....: " + fajos + "\n");
    texto.push("MONEDA: ..........: " + monedas + "\n");
    texto.push("EFECTIVO:.........: " + efectivo + "\n");
    texto.push("CHEQUES:..........: " + cheques + "\n");
    texto.push("DOC. ESPECIALES:..: 0" + "\n");
    texto.push("TARJET DEBI. CRED.: " + tarjetas + "\n");
    texto.push("VARIOS:...........: " + varios + "\n");
    texto.push("VALES:............: " + vales + "\n");
    texto.push("NOMINA:...........: " + nomina + "\n");
    texto.push("GASTOS:...........: " + gastos + "\n");
    texto.push("PROPIAS:..........: " + propina + "\n");
    texto.push("VENTAS A CREDITO:.: " + credito + "\n");
    texto.push("RETIROS DE CAJA:..: " + retirosCaja + "\n");
    texto.push('--------------------------------\n');
    texto.push((Number(factura.diferencia) < 0.0 ? "SOBRANTE" : "FALTANTE") + "...: $" + factura.diferencia + "\n");
    texto.push('--------------------------------\n');
    if (factura.empleados != undefined) {
      texto.push('Ventas por empleado\n');
      for (let emp of factura.empleados) {
        texto.push(emp.nombre + ":.$" + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(emp.subtotal), 12) + '\n');
      }
      texto.push('--------------------------------\n');
    }
    if (factura.grupos != undefined) {
      texto.push('Ventas por Grupo\n');
      for (let emp of factura.grupos) {
        texto.push(emp.nombre + ":.$" + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(Number(emp.total)), 10) + '\n');
      }
      texto.push('--------------------------------\n');
    }

    texto.push('--------------------------------\n');
    texto.push(this.calculosService.centrarDescripcion("\n", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("Software desarrollado por:", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("info@effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    return new Blob(texto, {
      type: 'text/plain'
    });
  }

  imprimirFacturaElectronicas(envi: Array<EnvioFacturacionElectronicaModel>) {
    //Genera un objeto Blob con los datos en un archivo TXT
    var texto = [];
    let json: string = JSON.stringify(envi);
    texto.push(json);
    return new Blob(texto, {
      type: 'text/plain'
    });
  }

  imprimirReporteProductosTxt80(productos: Array<ProductoModel>) {
    var texto = [];
    let tamanoMax: number = 40;
    texto.push(this.calculosService.centrarDescripcion("REPORTE DE PRODUCTOS", tamanoMax) + "\n");//nombre empresa
    texto.push("FECHA: " + this.calculosService.cortarDescripcion(new Date().toLocaleString(), 19) + "\n");//fecha
    texto.push('----------------------------------------\n');
    texto.push('NOMBRE                          CANTIDAD\n');
    for (let p of productos) {
      let nombreProducto: string = this.calculosService.cortarDescripcion(p.nombre, 32);
      let totalProducto: string = this.calculosService.cortarCantidades("" + p.cantidad, 5);
      texto.push(nombreProducto + "" + totalProducto + '\n');
    }
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    return new Blob(texto, {
      type: 'text/plain'
    });
  }

  imprimirReporteProductosTxt50(productos: Array<ProductoModel>) {
    var texto = [];
    let tamanoMax: number = 32;
    texto.push(this.calculosService.centrarDescripcion("REPORTE DE PRODUCTOS", tamanoMax) + "\n");//nombre empresa
    texto.push("FECHA: " + this.calculosService.cortarDescripcion(new Date().toLocaleString(), 19) + "\n");//fecha
    texto.push('--------------------------------\n');
    texto.push('NOMBRE                  CANTIDAD\n');
    for (let p of productos) {
      let nombreProducto: string = this.calculosService.cortarDescripcion(p.nombre, 26);
      let totalProducto: string = this.calculosService.cortarCantidades("" + p.cantidad, 5);
      texto.push(nombreProducto + "" + totalProducto + '\n');
    }
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    return new Blob(texto, {
      type: 'text/plain'
    });
  }

  imprimirOrdenTxt80(factura: FacturaModel) {
    //Genera un objeto Blob con los datos en un archivo TXT
    var texto = [];
    let tamanoMax: number = 40;
    texto.push('----------------------------------------\n');
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.nombre, tamanoMax) + "\n");//nombre empresa
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.slogan, tamanoMax) + "\n");//slogan
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.represente, tamanoMax) + "\n");//representante
    texto.push(this.calculosService.centrarDescripcion("NIT. " + factura.empresa.nit + " " + factura.empresa.regimen, tamanoMax) + "\n");//nit y regimen
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.direccion, tamanoMax) + "\n");//direccion
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.barrio, tamanoMax) + "\n");//barrio
    texto.push(this.calculosService.centrarDescripcion("TEL: " + factura.empresa.telefono_fijo + " " + factura.empresa.cel, tamanoMax) + "\n");//telefonos
    texto.push('\n');
    texto.push("ORDEN DE TRABAJO: " + factura.documento.documento_id + "\n");//consecutivo
    texto.push("FECHA: " + this.calculosService.cortarDescripcion(factura.documento.fecha_registro.toLocaleString(), 19) + "\n");//fecha
    texto.push("CAJERO: " + factura.documento.usuario_id + " " + factura.nombreUsuario + "\n");//fecha
    texto.push("CAJA: " + '\n');
    if (factura.cliente != undefined) {
      texto.push("CLIENTE: " + factura.cliente.nombre + '\n');
      texto.push("NIT/CC: " + factura.cliente.documento + '\n');
      texto.push("TELEFONO: " + factura.cliente.fijo + '\n');
    }
    texto.push("VEHÍCULO: " + factura.documento.detalle_entrada + '\n');
    texto.push("DESCRIPCIÓN CLIENTE: " + factura.documento.descripcion_cliente + '\n');
    texto.push("DIAGNOSTICO: " + factura.documento.descripcion_trabajador + '\n');
    texto.push(factura.documento.descripcion_trabajador + '\n');
    texto.push('----------------------------------------\n');
    texto.push('DESCRIPCIÓN                        TOTAL\n');
    texto.push('----------------------------------------\n');
    for (var i = 0; i < factura.detalle.length; i++) {
      let nombreProducto: string = this.calculosService.cortarDescripcion(factura.detalle[i].descripcion, 26);
      let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.detalle[i].parcial).replace("COP", ""), 12);
      texto.push(nombreProducto + "  " + totalProducto + "\n");
    }
    texto.push('----------------------------------------\n');
    texto.push(this.calculosService.centrarDescripcion("*****GRACIAS POR SU COMPRA*****", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("Software desarrollado por:", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("info@effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    return new Blob(texto, {
      type: 'text/plain'
    });
  }




  imprimirNominaTxt50(factura: DetalleNominaModel) {
    //Genera un objeto Blob con los datos en un archivo TXT
    var texto = [];
    let tamanoMax: number = 32;
    texto.push('--------------------------------\n');
    texto.push('\n');
    texto.push("DESPRENDIBLE DE PAGO " + "\n");//consecutivo
    texto.push("FECHA: " + this.calculosService.cortarDescripcion(new Date().toLocaleString(), 19) + "\n");//fecha
    texto.push("NOMBRE: " + this.calculosService.cortarDescripcion(factura.empleado.nombre, 23) + "\n");//fecha
    texto.push('--------------------------------\n');
    texto.push('VEHICULOS                 TOTAL\n');
    texto.push('--------------------------------\n');
    for (var i = 0; i < factura.ordenes.length; i++) {
      let nombreProducto: string = this.calculosService.cortarDescripcion(factura.ordenes[i].detalle_entrada, 20);
      let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.ordenes[i].total).replace("COP", ""), 10);
      texto.push(nombreProducto + "  " + totalProducto + "\n");
    }
    texto.push('--------------------------------\n');
    texto.push('VALES                      TOTAL\n');
    texto.push('--------------------------------\n');
    for (var i = 0; i < factura.vales.length; i++) {
      let nombreProducto: string = this.calculosService.cortarDescripcion(factura.vales[i].detalle_entrada, 20);
      let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.ordenes[i].total).replace("COP", ""), 10);
      texto.push(nombreProducto + "  " + totalProducto + "\n");
    }
    texto.push('--------------------------------\n');
    texto.push('PRODUCTOS                  TOTAL\n');
    texto.push('--------------------------------\n');
    for (var i = 0; i < factura.productos.length; i++) {
      let nombreProducto: string = this.calculosService.cortarDescripcion(factura.productos[i].concepto_producto, 20);
      let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.productos[i].valor).replace("COP", ""), 10);
      texto.push(nombreProducto + "  " + totalProducto + "\n");
    }
    texto.push('--------------------------------\n');
    texto.push("SUB-TOTAL:        " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.nomina.subtotal).replace("COP", ""), 14) + '\n');
    texto.push("TOTAL VALES:      " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.nomina.vales).replace("COP", ""), 14) + '\n');
    texto.push("TOTAL PRODUCTOS:  " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.nomina.productos).replace("COP", ""), 14) + '\n');
    texto.push("PAGO AHORRO:      " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.nomina.ahorro).replace("COP", ""), 14) + '\n');
    texto.push("PAGO ADMIN:       " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.nomina.admon).replace("COP", ""), 14) + '\n');
    texto.push("TOTAL A PAGAR:    " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.nomina.total).replace("COP", ""), 14) + '\n');
    texto.push('--------------------------------\n');
    texto.push('\n');
    texto.push(this.calculosService.centrarDescripcion("Software desarrollado por:", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("info@effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');

    return new Blob(texto, {
      type: 'text/plain'
    });
  }

  imprimirFacturaTxt80(factura: FacturaModel, configuracion: ConfiguracionModel) {
    //Genera un objeto Blob con los datos en un archivo TXT
    var texto = [];
    let tamanoMax: number = 40;
    texto.push('----------------------------------------\n');
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.nombre, tamanoMax) + "\n");//nombre empresa
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.slogan, tamanoMax) + "\n");//slogan
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.represente, tamanoMax) + "\n");//representante
    texto.push(this.calculosService.centrarDescripcion("NIT. " + factura.empresa.nit + " " + factura.empresa.regimen, tamanoMax) + "\n");//nit y regimen
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.direccion, tamanoMax) + "\n");//direccion
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.barrio, tamanoMax) + "\n");//barrio
    texto.push(this.calculosService.centrarDescripcion("TEL: " + factura.empresa.telefono_fijo + "-" + factura.empresa.cel, tamanoMax) + "\n");//telefonos
    texto.push('\n');
    let anulada: string = factura.documento.anulado == 0 ? "" : " ¡ANULADA! ";
    texto.push(factura.nombreTipoDocumento + ": " + anulada + factura.resolucionEmpresa.letra_consecutivo + factura.documento.consecutivo_dian + "\n");//consecutivo
    texto.push("FECHA: " + this.calculosService.cortarDescripcion(factura.documento.fecha_registro.toString(), 19) + "\n");//fecha
    texto.push("CAJERO: " + factura.nombreUsuario + "\n");//fecha
    texto.push("CAJA: " + '\n');
    if (factura.cliente != undefined) {
      texto.push("CLIENTE: " + factura.cliente.nombre + '\n');
      texto.push("NIT/CC: " + factura.cliente.documento + '\n');
      texto.push("DIRECCIÓN: " + factura.cliente.direccion + '\n');
    } else {
      texto.push("CLIENTE: Varios" + '\n');
      texto.push("NIT/CC:  0" + '\n');
      texto.push("DIRECCIÓN: 0" + '\n');
    }
    if (factura.documento.empleado_id != null) {
      texto.push("MESERO: " + factura.nombreEmpleado + '\n');
    }
    texto.push('----------------------------------------\n');
    texto.push('DESCRIPCIÓN       CANT   UNIDAD    TOTAL\n');
    texto.push('----------------------------------------\n');
    for (var i = 0; i < factura.detalle.length; i++) {
      let nombreProducto: string = this.calculosService.cortarDescripcion(factura.detalle[i].descripcion, 17);
      let cantidadProducto: string = this.calculosService.cortarCantidades(factura.detalle[i].cantidad.toString(), 4);
      let unidadProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.detalle[i].unitario), 8);
      let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.detalle[i].parcial), 8);
      texto.push(nombreProducto + " " + cantidadProducto + " " + unidadProducto + " " + totalProducto + "\n");
    }
    texto.push('----------------------------------------\n');
    texto.push("Valor Exento:             " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.excento), 14) + '\n');
    texto.push("Valor Gravado:            " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.gravado), 14) + '\n');
    texto.push("Iva:                      " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.iva), 14) + '\n');
    if(factura.saldo>0){
      texto.push("Saldo anterior:           " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.saldo), 14) + '\n');
    }
    texto.push("TOTAL A PAGAR:            " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(Number(factura.documento.total)+Number(factura.saldo)), 14) + '\n');
    texto.push('----------------------------------------\n');
    texto.push("         **** FORMA DE PAGO****        \n");
    texto.push("Vr. Pago con Tarjeta:                  0" + '\n');
    texto.push("Vr. Comisión Tarjeta:                  0" + '\n');
    texto.push("Vr. Total Factura:        " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 14) + '\n');
    texto.push("fectivo:		      	  " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 14) + '\n');
    texto.push("Cambio:			          " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.cambio), 14) + '\n');
    texto.push('----------------------------------------\n');
    texto.push("Res. " + factura.resolucionEmpresa.resolucion_dian + "Fecha: " + factura.resolucionEmpresa.fecha_resolucion + '\n');
    texto.push("Rango autorizado desde: " + factura.resolucionEmpresa.autorizacion_desde + " a " + factura.resolucionEmpresa.autorizacion_hasta + '\n');
    texto.push("Factura: " + factura.resolucionEmpresa.t_factura + '\n');
    texto.push('\n');
    texto.push('  *****GRACIAS POR SU COMPRA*****   \n');
    texto.push(this.calculosService.centrarDescripcion("Software desarrollado por:      ", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("info@effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    return new Blob(texto, {
      type: 'text/plain'
    });
  }

  imprimirFacturaTxt50(factura: FacturaModel, configuracion: ConfiguracionModel) {
    //Genera un objeto Blob con los datos en un archivo TXT
    var texto = [];
    let tamanoMax: number = 32;
    texto.push('--------------------------------\n');
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.nombre, tamanoMax) + "\n");//nombre empresa
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.slogan, tamanoMax) + "\n");//slogan
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.represente, tamanoMax) + "\n");//representante
    texto.push(this.calculosService.centrarDescripcion("NIT. " + factura.empresa.nit, tamanoMax) + "\n");//nit y regimen
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.regimen, tamanoMax) + "\n");//nit y regimen
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.direccion, tamanoMax) + "\n");//direccion
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.barrio, tamanoMax) + "\n");//barrio
    texto.push(this.calculosService.centrarDescripcion("TEL: " + factura.empresa.telefono_fijo + "-" + factura.empresa.cel, tamanoMax) + "\n");//telefonos
    texto.push('\n');
    let anulada: string = factura.documento.anulado == 0 ? "" : " ¡ANULADA! ";
    texto.push(factura.nombreTipoDocumento + ": " + anulada + factura.resolucionEmpresa.letra_consecutivo + factura.documento.consecutivo_dian + "\n");//consecutivo
    texto.push("FECHA: " + this.calculosService.cortarDescripcion(factura.documento.fecha_registro.toString(), 19) + "\n");//fecha
    texto.push("CAJERO: " + factura.nombreUsuario + "\n");//fecha
    texto.push("CAJA: " + '\n');
    if (factura.cliente != undefined) {
      texto.push("CLIENTE: " + factura.cliente.nombre + '\n');
      texto.push("NIT/CC: " + factura.cliente.documento + '\n');
      texto.push("DIRECCIÓN: " + factura.cliente.direccion + '\n');
    } else {
      texto.push("CLIENTE: Varios" + '\n');
      texto.push("NIT/CC:  0" + '\n');
      texto.push("DIRECCIÓN: 0" + '\n');
    }

    if (factura.documento.empleado_id != null) {
      texto.push("MESERO: " + "AQUI VA EL NOMBRE DEL MESERO " + '\n');
    }
    texto.push('--------------------------------\n');
    texto.push('DESCRIPCIÓN CANT  UNIDAD   TOTAL\n');
    texto.push('--------------------------------\n');
    for (var i = 0; i < factura.detalle.length; i++) {
      let nombreProducto: string = this.calculosService.cortarDescripcion(factura.detalle[i].descripcion, 12);
      let cantidadProducto: string = this.calculosService.cortarCantidades(factura.detalle[i].cantidad.toString(), 3);
      let unidadProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.detalle[i].unitario), 7);
      let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.detalle[i].parcial), 7);
      texto.push(nombreProducto + " " + cantidadProducto + " " + unidadProducto + " " + totalProducto + "\n");
    }
    texto.push('--------------------------------\n');
    texto.push("Valor Exento:     " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.excento), 14) + '\n');
    texto.push("Valor Gravado:    " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.gravado), 14) + '\n');
    texto.push("Iva:              " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.iva), 14) + '\n');
    if(factura.saldo>0){
      texto.push("Saldo Anterior: " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.saldo), 14) + '\n');
    }
    texto.push("TOTAL A PAGAR:    " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(Number(factura.documento.total)+Number(factura.saldo)), 14) + '\n');
    texto.push('--------------------------------\n');
    texto.push(this.calculosService.centrarDescripcion("*FORMA DE PAGO*", tamanoMax) + "\n");
    texto.push("Vr. Pago con Tarjeta:          0" + '\n');
    texto.push("Vr. Comisión Tarjeta:          0" + '\n');
    texto.push("Vr. Total Factura: " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 13) + '\n');
    texto.push("fectivo:		   " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 13) + '\n');
    texto.push("Cambio:			   " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.cambio), 13) + '\n');
    texto.push('--------------------------------\n');
    texto.push("Res. " + factura.resolucionEmpresa.resolucion_dian + "Fecha: " + factura.resolucionEmpresa.fecha_resolucion + '\n');
    texto.push("Autorizado desde: " + factura.resolucionEmpresa.autorizacion_desde + " a " + factura.resolucionEmpresa.autorizacion_hasta + '\n');
    texto.push("Factura: " + factura.resolucionEmpresa.t_factura + '\n');
    texto.push('\n');
    texto.push(this.calculosService.centrarDescripcion("*GRACIAS POR SU COMPRA*", tamanoMax) + "\n");
    texto.push(this.calculosService.centrarDescripcion("Software desarrollado por:", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("info@effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');

    return new Blob(texto, {
      type: 'text/plain'
    });
  }

  imprimirFacturaTxtMediaNabor(factura: FacturaModel, configuracion: ConfiguracionModel) {

    var texto = [];
   
    let hora=this.calculosService.cortarDescripcion(this.calculosService.formatDate(factura.documento.fecha_registro, true),18).split(" ");
    let tope = 14;
    let contador = 0;
    let espacio=0;
    factura.detalle=this.calculosService.ordenar(factura.detalle);
    let numPaginas = this.calcularHojas(tope, factura.detalle, 150,1);
    console.log(numPaginas);
    for (let i = 1; i <= numPaginas; i++) {
      if(i>=2){
        texto.push('\n');
        texto.push('\n');
        texto.push('\n');
      }
      texto.push('\n');
      texto.push('\n');
      texto.push("                                                                No. " + factura.resolucionEmpresa.letra_consecutivo + factura.documento.consecutivo_dian + '\n');
      texto.push('\n');
      if (factura.cliente != undefined) {
        texto.push("      " + this.calculosService.cortarDescripcion(factura.cliente.nombre,31) +  factura.resolucionEmpresa.resolucion_dian + " DE " +  this.calculosService.cortarDescripcion(factura.resolucionEmpresa.fecha_resolucion.toLocaleString(),10) +'\n');
        texto.push("      " + this.calculosService.cortarDescripcion(factura.cliente.documento,61) + hora[0]+'\n');
      } else {
        texto.push("      Varios" + '\n');
        texto.push("      0" + this.calculosService.cortarDescripcion(factura.cliente.documento,61) + hora[0]+ '\n');
      }
      texto.push("      " + this.calculosService.cortarDescripcion(factura.nombreUsuario,29) + ' FACTURA IMPRESA POR COMPUTADOR '+ hora[1]+'\n');
      texto.push('\n');
      texto.push('\n');
      for (let e = contador; e < factura.detalle.length; e++) {
        let nombreProducto: string = this.calculosService.cortarDescripcion(factura.detalle[e].descripcion, 34);
        let cantidadProducto: string = this.calculosService.cortarCantidades(factura.detalle[e].cantidad.toString(), 4);
        let unidadProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.detalle[e].unitario), 13);
        let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.detalle[e].parcial), 13);
        let ivaProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.detalle[e].impuesto_producto), 2);
        let varios=factura.detalle[e].varios==1?"V":" ";
        texto.push("("+varios+") "+cantidadProducto  + "   " + nombreProducto + " " + unidadProducto + " " + totalProducto +"  "+ivaProducto + "\n");
        contador = contador + 1;
        espacio=e;
        if(Number(tope)*i==e+1){
          for (let n = 0; n < (Number(tope)*i)-(e+1); n++) {
            texto.push('\n');
          }
          break;
        }
        if(contador==factura.detalle.length){
          for (let n = 0; n < (Number(tope)*i)-(e+1); n++) {
            texto.push('\n');
          }
        }
      }
      
      let total= this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 13);
      let exento= this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.excento), 18);
      let gravado= this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.gravado), 14);
      let iva =  this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.iva), 14);
      texto.push("cancela:  " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 13) + '\n');
      texto.push("Cambio:	  " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.cambio), 13) + '\n')
      texto.push(exento + "        " + gravado + "     " + iva+ "       " +  total+ '\n');
      texto.push('\n');
      texto.push("       "+factura.documento.peso_total + ' Kg\n');
      texto.push('\n');
       texto.push('\n');
       texto.push('\n');
       texto.push('\n');
       texto.push('\n');
    }
    return new Blob(texto, {
      type: 'text/plain'
    });
  }

  imprimirFacturaTxtCarta(factura: FacturaModel, configuracion: ConfiguracionModel) {
    //Genera un objeto Blob con los datos en un archivo TXT
    var texto = [];
    let tamanoMax: number = 32;
    texto.push('--------------------------------\n');
    texto.push('\n');
    return new Blob(texto, {
      type: 'text/plain'
    });
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url; img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    // console.log(dataURL);
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  private crearHeader(factura: FacturaModel, configuracion: ConfiguracionModel, pagina: number, numPaginas: number) {

    this.doc.setFontType('bold')
    this.doc.setFontSize(9);
    if (factura.documento.cufe != "") {
      this.doc.text("CUFE: " + factura.documento.cufe, 4, 269);
    }
    this.doc.text(this.calculosService.centrarDescripcion(factura.empresa.nombre, 77), 80, 5);
    this.doc.text(this.calculosService.centrarDescripcion("NIT: " + factura.empresa.nit, 77), 80, 10);

    this.doc.text(factura.nombreTipoDocumento, 165, 10);
    this.doc.text("FECHA DE EXPEDICIÓN", 163, 28);
    this.doc.setDrawColor(0);
    this.doc.setLineWidth(0.1);
    this.doc.setFillColor(255, 255, 255);
    this.doc.roundedRect(157, 12, 50, 10, 3, 3, 'FD');//N FACTURA
    this.doc.roundedRect(157, 30, 50, 10, 3, 3, 'FD'); //FECHA VENCIOMIENTO
    this.doc.roundedRect(157, 40, 50, 12, 3, 3, 'FD'); //FORMA DE PAGO
    this.doc.roundedRect(3, 40, 154, 12, 3, 3, 'FD'); //INFO CLIENTE
    this.doc.roundedRect(157, 270, 50, 20, 3, 3, 'FD'); //CAMPOS TOTAL
    this.doc.roundedRect(3, 270, 154, 8, 3, 3, 'FD'); //OBSERVACION
    this.doc.roundedRect(3, 278, 77, 12, 3, 3, 'FD'); //RECIBÍ CONFORME
    this.doc.roundedRect(80, 278, 77, 12, 3, 3, 'FD'); //FIRMA ADMINISTRADOR
    this.doc.roundedRect(3, 52, 204, 6, 3, 3, 'FD'); //NOMBRE PRODUCTO
    this.doc.roundedRect(3, 58, 204, 202, 3, 3, 'FD'); //NOMBRE PRODUCTO

    this.doc.line(19, 52, 19, 260) // vertical line    
    this.doc.line(32, 52, 32, 260) // vertical line    
    this.doc.line(114, 52, 114, 260) // vertical line    
    this.doc.line(138, 52, 138, 260) // vertical line    
    this.doc.line(157, 52, 157, 260) // vertical line    
    this.doc.line(181, 52, 181, 260) // vertical line    
    this.doc.text("N° " + factura.documento.consecutivo_dian, 175, 18);
    this.doc.text(this.calculosService.cortarDescripcion(this.calculosService.formatDate(factura.documento.fecha_registro, true), 19), 160, 35);

    this.doc.text(this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(Math.round(factura.documento.gravado + factura.documento.excento)).replace("COP", ""), 15), 183, 275);
    this.doc.text(this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(Math.round(factura.documento.iva)).replace("COP", ""), 15), 183, 280);
    this.doc.text(this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(Math.round(factura.documento.total)).replace("COP", ""), 15), 183, 285);
    //datos del cliente
    this.doc.text("CÓDIGO", 4, 57);
    this.doc.text("CANT", 20, 57);
    this.doc.text("DESCRIPCIÓN", 35, 57);
    this.doc.text("VR. UNITARIO", 115, 57);
    this.doc.text("% IVA", 140, 57);
    this.doc.text("VR. UNIT. FIN", 158, 57);
    this.doc.text("VR. TOTAL", 182, 57);
    this.doc.text("FORMA DE PAGO:", 159, 44);
    this.doc.text("VENCIMIENTO:", 159, 49);
    this.doc.text("NOMBRE:", 5, 44);
    this.doc.text("DIRECCIÓN:", 5, 49);
    this.doc.text("CC o NIT:", 110, 44);
    this.doc.text("TELEFONO:", 110, 49);
    this.doc.text("SUBTOTAL:  $", 159, 275);
    this.doc.text("IVA: $", 159, 280);
    this.doc.text("TOTAL:     $", 159, 285);

    this.doc.setFontType('normal');
    if (factura.cliente != undefined) {
      this.doc.text(factura.cliente.nombre + " " + factura.cliente.apellidos, 25, 44);
      this.doc.text(factura.cliente.direccion, 25, 49);
      this.doc.text(factura.cliente.documento, 130, 44);
      this.doc.text(factura.cliente.celular, 130, 49);
    }

    this.doc.text("Pagina " + pagina + " de " + numPaginas, 110, 39);


    this.doc.setFontSize(6);
    this.doc.text(this.calculosService.centrarDescripcion("SOMOS " + factura.empresa.regimen, 77), 90, 13);
    this.doc.text(this.calculosService.centrarDescripcion("RESOLUCION DIAN N° " + factura.resolucionEmpresa.resolucion_dian + " DE " + factura.resolucionEmpresa.fecha_resolucion, 77), 90, 16);
    this.doc.text(this.calculosService.centrarDescripcion("Actividad económica CIIU " + factura.empresa.actividad_economica, 77), 90, 19);
    this.doc.text(this.calculosService.centrarDescripcion("Representante Legal: " + factura.empresa.represente, 77), 90, 22);
    this.doc.text(this.calculosService.centrarDescripcion("Dirección: " + factura.empresa.direccion, 77), 90, 25);
    this.doc.text(this.calculosService.centrarDescripcion("Telefono: " + factura.empresa.telefono_fijo, 77), 90, 28);
    this.doc.text("RECIBÍ CONFORME: ", 4, 281);
    this.doc.text("NIT: ", 4, 286);
    this.doc.text("VENDEDOR: ADMINISTRADOR DEL SISTEMA ", 82, 288);
    this.doc.text("OBSERVACIÓN: " + factura.documento.descripcion_trabajador, 4, 275);
    this.doc.text("Software y factura realizada por effectivesoftware.com.co - info@effectivesoftware.com.co - 3185222474", 5, 292);
  }



  imprimirFacturaPDFExportar(factura: FacturaModel, configuracion: ConfiguracionModel) {
    let imgData = factura.empresa.url_logo;
    let tope: number = 39.0;// esta variable controla el nuero de productos por pagina en la factura
    this.doc = new jsPDF();
    console.log("# de detalles:" + factura.detalle.length);
    let div: number = factura.detalle.length / tope;
    let numPaginas = Math.ceil(div);
    let contadorP = 0;
    let posy = 63; //controla la posicion de y para los productos
    for (let i = 0; i < numPaginas; i++) {
      this.doc.addImage(factura.documento.qrcode, 'JPEG', 3, 2, 38, 37);
      this.crearHeader(factura, configuracion, (i + 1), numPaginas);
      this.doc.setFontType('normal');
      this.doc.setFontSize(9);
      this.doc.text("CUFE: " + factura.documento.cufe, 4, 269);
      this.doc.text("Total IVA: $" + this.calculosService.cortarDescripcion(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.iva), 20) + "   "
        + "Exento: $" + this.calculosService.cortarDescripcion(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.excento), 20) + "   "
        + "Gravado: $" + this.calculosService.cortarDescripcion(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.gravado), 20) + "   "
        , 4, 263);
      for (let e = 0; e < tope; e++) {
        if (contadorP < factura.detalle.length) {
          let codigo = factura.detalle[contadorP].documento_detalle_id;
          let cantidad = factura.detalle[contadorP].cantidad;
          let descripcion = factura.detalle[contadorP].descripcion;
          let unitario = factura.detalle[contadorP].unitario;
          let parcial = factura.detalle[contadorP].parcial;
          let iva = factura.detalle[contadorP].impuesto_producto;
          contadorP = contadorP + 1;
          this.doc.text(codigo, 4, posy);
          this.doc.text(cantidad, 20, posy);

          this.doc.text(iva, 145, posy);
          this.doc.text(this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(unitario).replace("COP", ""), 20), 115, posy);
          this.doc.text(this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(parcial), 20).replace("COP", ""), 182, posy);
          let topeLinea = 54.0;
          let linea: number = descripcion.length / topeLinea;
          let numlineas = Math.ceil(linea);
          let ini = 0;
          let fin = topeLinea;
          for (let i = 0; i <= numlineas; i++) {
            let parcial = descripcion.substring(ini, fin);
            this.doc.text(parcial, 33, posy);
            posy = posy + 5;
            ini = ini + topeLinea;
            fin = fin + topeLinea;
          }
          //posy = posy + 5;
        } else {
          break;
        }
        if (e + 1 == tope) {
          this.doc.addPage();
          posy = 63;
        }
      }
    }
    return this.doc.output('datauristring');
  }




  imprimirFacturaPdf80(factura: FacturaModel, configuracion: ConfiguracionModel, exportar: boolean) {
    //console.log(new Buffer(AppConfigService.image).toString('base64'));
    this.getBase64ImageFromURL("assets/images/logoempresa.jpg").subscribe(base64data => {
      let base64Image = 'data:image/jpg;base64,' + base64data;


      this.doc = new jsPDF();
      this.doc.setFontSize(12);
      let x = 1;
      let inicio = 4;
      let y = 2;
      this.doc.addImage(base64Image, 'JPEG', x, y, x + 68, y + 32)
      this.doc.text("-------------------------------------------------", x, y);
      y = y + inicio + 35;
      this.doc.setFontType('bold');
      this.doc.text(factura.empresa.nombre, x, y);
      this.doc.setFontSize(9);
      y = y + inicio;
      this.doc.setFontType('normal');
      this.doc.text(factura.empresa.slogan, x, y);
      y = y + inicio;
      this.doc.text(factura.empresa.represente, x, y);
      y = y + inicio;
      this.doc.text("NIT. " + factura.empresa.nit, x, y);
      y = y + inicio;
      this.doc.text(factura.empresa.regimen, x, y);
      y = y + inicio;
      this.doc.text(factura.empresa.direccion + " - " + factura.empresa.barrio, x, y);
      y = y + inicio;
      this.doc.text(factura.empresa.ciudad + " - " + factura.empresa.departamento, x, y);
      y = y + inicio;
      this.doc.text("TEL: " + factura.empresa.cel + " - " + factura.empresa.telefono_fijo, x, y);
      y = y + inicio;
      let titulo;
      if (factura.documento.tipo_documento_id == 10) {
        titulo = "FACTURA VENTA";
      } else {
        if (factura.documento.tipo_documento_id == 9) {
          titulo = "FACTURA VENTA.";
        } else {
          titulo = "CONTIZACIÓN";
        }
      }
      this.doc.setFontType('bold');
      this.doc.setFontSize(11);
      this.doc.text(titulo + ": " + factura.resolucionEmpresa.letra_consecutivo + factura.documento.consecutivo_dian, x, y);
      y = y + inicio;
      this.doc.setFontType('normal');
      this.doc.setFontSize(9);
      this.doc.text("FECHA: " + this.calculosService.formatDate(factura.documento.fecha_registro, true), x, y);
      y = y + inicio;
      this.doc.text("CAJERO: " + factura.nombreUsuario, x, y);
      y = y + inicio;
      this.doc.text("CAJA: " + factura.documento.mac, x, y);
      y = y + inicio;
      this.doc.text("CLIENTE: " + factura.cliente.nombre + " " + factura.cliente.apellidos, x, y);
      y = y + inicio;
      this.doc.text("CC/NIT: " + factura.cliente.documento, x, y);
      y = y + inicio;
      this.doc.setFontSize(12);
      this.doc.text("-------------------------------------------------", x, y);
      y = y + inicio;
      this.doc.setFontSize(9);
      this.doc.text("CANT DESCRIPCION         UNI     TOTAL     IVA", x, y);
      y = y + inicio;
      this.doc.setFontSize(12);
      this.doc.text("-------------------------------------------------", x, y);
      for (let i of factura.detalle) {
        y = y + inicio;
        this.doc.setFontSize(9);
        this.doc.text(this.calculosService.cortarCantidades("" + i.cantidad, 4), x + 4, y);
        this.doc.text(this.calculosService.cortarDescripcion(i.descripcion, 32), x + 11, y);
        y = y + inicio;
        let unitario = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(i.unitario).replace("COP", "");
        let parcial = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(i.parcial).replace("COP", "");
        let iva = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(i.impuesto_producto).replace("COP", "");
        this.doc.text(unitario + " " + parcial + " " + iva, x + 12, y);
        if (y >= 297) {
          y = 2;
          this.doc.addPage();
        }
      }
      y = y + inicio;
      this.doc.setFontSize(12);
      this.doc.text("-------------------------------------------------", x, y);
      this.doc.setFontSize(9);
      y = y + inicio;
      this.doc.text("Valor Exento: " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.excento).replace("COP", ""), 10), x, y);
      y = y + inicio;
      this.doc.text("Valor Gravado: " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.gravado).replace("COP", ""), 10), x, y);
      y = y + inicio;
      this.doc.text("Valor IVA: " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.iva).replace("COP", ""), 10), x, y);
      y = y + inicio;
      if(factura.saldo>0){
        this.doc.text("Saldo anterior: " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.saldo).replace("COP", ""), 10), x, y);
        y = y + inicio;
      }
      
      this.doc.setFontSize(12);
      this.doc.text("-------------------------------------------------", x, y);
      y = y + inicio;
      this.doc.setFontType('bold');
      this.doc.setFontSize(12);
      this.doc.text("TOTAL PAGAR: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(Number(factura.documento.total)+Number(factura.saldo)).replace("COP", ""), x, y);
      y = y + inicio;
      this.doc.setFontType('normal');
      this.doc.text("-------------------------------------------------", x, y);
      y = y + inicio;
      this.doc.setFontSize(9);
      this.doc.text("         **** FORMA DE PAGO****        ", x, y);
      y = y + inicio;
      //hacer un metodo para ir a traer los tipos de pago de este dococumento
      this.doc.text("Vr. Pago con Efectivo:  " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.total).replace("COP", ""), x, y);
      y = y + inicio;
      this.doc.text("Cambio:  " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.cambio).replace("COP", ""), x, y);
      y = y + inicio;
      this.doc.setFontSize(12);
      this.doc.text("-------------------------------------------------", x, y);
      y = y + inicio;
      this.doc.setFontSize(9);
      this.doc.text("Res. " + factura.resolucionEmpresa.resolucion_dian + " de Fecha: " + this.calculosService.formatDate(factura.resolucionEmpresa.fecha_resolucion, false), x, y);
      y = y + inicio;
      this.doc.text("Rango autorizado: " + factura.resolucionEmpresa.autorizacion_desde + " a " + factura.resolucionEmpresa.autorizacion_hasta, x, y);
      y = y + inicio;
      this.doc.text("Factura: " + factura.resolucionEmpresa.t_factura, x, y);
      y = y + inicio;
      this.doc.text("       *****GRACIAS POR SU COMPRA*****      ", x, y);
      y = y + inicio;
      this.doc.text("            Software desarrollado por:", x, y);
      y = y + inicio;
      this.doc.text("             effectivesoftware.com.co", x, y);
      y = y + inicio;
      this.doc.text("           info@effectivesoftware.com.co", x, y);
      this.doc.save(factura.titulo + ".pdf");
    });
  }

  imprimirOrdenTxt50(factura: FacturaModel) {
    //Genera un objeto Blob con los datos en un archivo TXT
    var texto = [];
    let tamanoMax: number = 32;
    texto.push('--------------------------------\n');
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.nombre, tamanoMax) + "\n");//nombre empresa
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.slogan, tamanoMax) + "\n");//slogan
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.represente, tamanoMax) + "\n");//representante
    texto.push(this.calculosService.centrarDescripcion("NIT. " + factura.empresa.nit, tamanoMax) + "\n");//nit y regimen
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.regimen, tamanoMax) + "\n");//nit y regimen
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.direccion, tamanoMax) + "\n");//direccion
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.barrio, tamanoMax) + "\n");//barrio
    texto.push(this.calculosService.centrarDescripcion("TEL: " + factura.empresa.telefono_fijo + " " + factura.empresa.cel, tamanoMax) + "\n");//telefonos
    texto.push('\n');
    texto.push("ORDEN DE TRABAJO: " + factura.documento.documento_id + "\n");//consecutivo
    texto.push("FECHA: " + this.calculosService.cortarDescripcion(factura.documento.fecha_registro.toLocaleString(), 19) + "\n");//fecha
    texto.push("CAJERO: " + this.calculosService.cortarDescripcion(factura.nombreUsuario, 23) + "\n");//fecha
    texto.push("CAJA: " + '\n');
    if (factura.cliente != undefined) {
      texto.push("CLIENTE: " + factura.cliente.nombre + '\n');
      texto.push("NIT/CC: " + factura.cliente.documento + '\n');
      texto.push("TELEFONO: " + factura.cliente.fijo + '\n');
    }
    texto.push("VEHICULO: " + factura.documento.detalle_entrada + '\n');
    texto.push("LINEA: " + factura.documento.linea_vehiculo + '\n');
    texto.push("DESCRIPCION CLIENTE: " + factura.documento.descripcion_cliente + '\n');
    texto.push("DIAGNOSTICO: " + factura.documento.descripcion_trabajador + '\n');
    texto.push('--------------------------------\n');
    texto.push('DESCRIPCION                TOTAL\n');
    texto.push('--------------------------------\n');
    for (var i = 0; i < factura.detalle.length; i++) {
      let nombreProducto: string = this.calculosService.cortarDescripcion(factura.detalle[i].descripcion, 20);
      let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.detalle[i].parcial).replace("COP", ""), 10);
      texto.push(nombreProducto + "  " + totalProducto + "\n");
    }
    texto.push('--------------------------------\n');
    texto.push("TOTAL A PAGAR:    " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.total).replace("COP", ""), 14) + '\n');
    texto.push('--------------------------------\n');
    texto.push('\n');
    texto.push("El establecimiento no se hace responsable de la perdida o robo de objetos de valor dejados en el vehiculo" + '\n');

    texto.push(this.calculosService.centrarDescripcion("*GRACIAS POR SU COMPRA*", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("Software desarrollado por:", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("info@effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');

    return new Blob(texto, {
      type: 'text/plain'
    });
  }


  imprimirOrdenPDF50(factura: FacturaModel, exportar: boolean) {
    this.getBase64ImageFromURL(factura.empresa.url_logo).subscribe(base64data => {
      let base64Image = 'data:image/jpg;base64,' + base64data;
      this.doc = new jsPDF();
      this.doc.setFontSize(10);
      let x = 1;
      let inicio = 4;
      let y = 2;
      this.doc.addImage(base64Image, 'JPEG', x, y, x + 43, y + 12)
      this.doc.text("--------------------------------", x, y);
      y = y + inicio + 15;
      this.doc.setFontType('bold');
      this.doc.text(factura.empresa.nombre, x, y);
      this.doc.setFontSize(7);
      y = y + inicio;
      this.doc.setFontType('normal');
      this.doc.text(factura.empresa.slogan, x, y);
      y = y + inicio;
      this.doc.text(factura.empresa.represente, x, y);
      y = y + inicio;
      this.doc.text("NIT. " + factura.empresa.nit, x, y);
      y = y + inicio;
      this.doc.text(factura.empresa.regimen, x, y);
      y = y + inicio;
      this.doc.text(factura.empresa.direccion + " - " + factura.empresa.barrio, x, y);
      y = y + inicio;
      this.doc.text(factura.empresa.ciudad + " - " + factura.empresa.departamento, x, y);
      y = y + inicio;
      this.doc.text("TEL: " + factura.empresa.cel + " - " + factura.empresa.telefono_fijo, x, y);
      y = y + inicio;
      let titulo = "ORDEN TRABAJO";
      this.doc.setFontType('bold');
      this.doc.setFontSize(10);
      this.doc.text(titulo + ": " + factura.documento.documento_id, x, y);
      y = y + inicio;
      this.doc.setFontType('normal');
      this.doc.setFontSize(7);
      this.doc.text("FECHA: " + this.calculosService.formatDate(factura.documento.fecha_registro, true), x, y);
      y = y + inicio;
      this.doc.text("CAJERO: " + factura.nombreUsuario, x, y);
      y = y + inicio;
      this.doc.text("CAJA: " + factura.documento.mac, x, y);
      y = y + inicio;
      if (factura.cliente != undefined) {
        this.doc.text("CLIENTE: " + factura.cliente.nombre + " " + factura.cliente.apellidos, x, y);
        y = y + inicio;
        this.doc.text("CC/NIT: " + factura.cliente.documento, x, y);
        y = y + inicio;
        this.doc.text("TELEFONO: " + factura.cliente.fijo, x, y);
        y = y + inicio;
      }
      this.doc.text("VEHICULO: " + factura.documento.detalle_entrada, x, y);
      y = y + inicio;
      this.doc.text("LINEA: " + factura.documento.linea_vehiculo, x, y);
      y = y + inicio;
      this.doc.text("DESCRIPCION CLIENTE: " + factura.documento.descripcion_cliente, x, y);
      y = y + inicio;
      this.doc.text("DIAGNOSTICO: " + factura.documento.descripcion_trabajador, x, y);
      y = y + inicio;
      this.doc.setFontSize(10);
      this.doc.text("--------------------------------", x, y);
      y = y + inicio;
      this.doc.setFontSize(7);
      this.doc.text("DESCRIPCION                TOTAL", x, y);
      y = y + inicio;
      this.doc.setFontSize(10);
      this.doc.text("--------------------------------", x, y);
      for (let i of factura.detalle) {
        y = y + inicio;
        this.doc.setFontSize(7);
        this.doc.text(this.calculosService.cortarCantidades("" + i.cantidad, 4), x + 1, y);
        this.doc.text(this.calculosService.cortarDescripcion(i.descripcion, 32), x + 8, y);
        y = y + inicio;
        let unitario = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(i.unitario).replace("COP", "");
        let parcial = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(i.parcial).replace("COP", "");
        let iva = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(i.impuesto_producto).replace("COP", "");
        this.doc.text(unitario + "  " + parcial + "  " + iva, x + 7, y);
      }
      y = y + inicio;
      this.doc.setFontSize(10);
      this.doc.text("--------------------------------", x, y);
      this.doc.setFontSize(7);
      y = y + inicio;
      this.doc.text("Valor Exento: " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.excento).replace("COP", ""), 10), x, y);
      y = y + inicio;
      this.doc.text("Valor Gravado: " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.gravado).replace("COP", ""), 10), x, y);
      y = y + inicio;
      this.doc.text("Valor IVA: " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.iva).replace("COP", ""), 10), x, y);
      y = y + inicio;
      this.doc.setFontSize(10);
      this.doc.text("--------------------------------", x, y);
      y = y + inicio;
      this.doc.setFontType('bold');
      this.doc.setFontSize(10);
      this.doc.text("TOTAL PAGAR: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.total).replace("COP", ""), x, y);
      y = y + inicio;
      this.doc.setFontType('normal');
      this.doc.text("--------------------------------", x, y);
      y = y + inicio;
      this.doc.setFontSize(7);
      this.doc.text("Res. " + factura.resolucionEmpresa.resolucion_dian + " de Fecha: " + this.calculosService.formatDate(factura.resolucionEmpresa.fecha_resolucion, false), x, y);
      y = y + inicio;
      this.doc.text("Rango autorizado: " + factura.resolucionEmpresa.autorizacion_desde + " a " + factura.resolucionEmpresa.autorizacion_hasta, x, y);
      y = y + inicio;
      this.doc.text("Fac." + factura.resolucionEmpresa.t_factura, x, y);
      y = y + inicio;
      this.doc.text(" *****GRACIAS POR SU COMPRA*****  ", x, y);
      y = y + inicio;
      this.doc.text("  Software desarrollado por:", x, y);
      y = y + inicio;
      this.doc.text("  effectivesoftware.com.co", x, y);
      y = y + inicio;
      this.doc.text(" info@effectivesoftware.com.co", x, y);
      this.doc.save(factura.titulo + ".pdf");
    });
  }



  imprimirFacturaPdf50(factura: FacturaModel, configuracion: ConfiguracionModel, exportar: boolean) {
    this.getBase64ImageFromURL("assets/images/logoempresa.jpg").subscribe(base64data => {
      let base64Image = 'data:image/jpg;base64,' + base64data;
      this.doc = new jsPDF();
      this.doc.setFontSize(10);
      let x = 1;
      let inicio = 4;
      let y = 2;
      this.doc.addImage(base64Image, 'JPEG', x, y, x + 43, y + 12)
      this.doc.text("--------------------------------", x, y);
      y = y + inicio + 15;
      this.doc.setFontType('bold');
      this.doc.text(factura.empresa.nombre, x, y);
      this.doc.setFontSize(7);
      y = y + inicio;
      this.doc.setFontType('normal');
      this.doc.text(factura.empresa.slogan, x, y);
      y = y + inicio;
      this.doc.text(factura.empresa.represente, x, y);
      y = y + inicio;
      this.doc.text("NIT. " + factura.empresa.nit, x, y);
      y = y + inicio;
      this.doc.text(factura.empresa.regimen, x, y);
      y = y + inicio;
      this.doc.text(factura.empresa.direccion + " - " + factura.empresa.barrio, x, y);
      y = y + inicio;
      this.doc.text(factura.empresa.ciudad + " - " + factura.empresa.departamento, x, y);
      y = y + inicio;
      this.doc.text("TEL: " + factura.empresa.cel + " - " + factura.empresa.telefono_fijo, x, y);
      y = y + inicio;
      let titulo;
      if (factura.documento.tipo_documento_id == 10) {
        titulo = "FACTURA VENTA";
      } else {
        if (factura.documento.tipo_documento_id == 9) {
          titulo = "FACTURA VENTA.";
        } else {
          titulo = "CONTIZACIÓN";
        }
      }
      this.doc.setFontType('bold');
      this.doc.setFontSize(10);
      this.doc.text(titulo + ": " + factura.resolucionEmpresa.letra_consecutivo + factura.documento.consecutivo_dian, x, y);
      y = y + inicio;
      this.doc.setFontType('normal');
      this.doc.setFontSize(7);
      this.doc.text("FECHA: " + this.calculosService.formatDate(factura.documento.fecha_registro, true), x, y);
      y = y + inicio;
      this.doc.text("CAJERO: " + factura.nombreUsuario, x, y);
      y = y + inicio;
      this.doc.text("CAJA: " + factura.documento.mac, x, y);
      y = y + inicio;
      this.doc.text("CLIENTE: " + factura.cliente.nombre + " " + factura.cliente.apellidos, x, y);
      y = y + inicio;
      this.doc.text("CC/NIT: " + factura.cliente.documento, x, y);
      y = y + inicio;
      this.doc.setFontSize(10);
      this.doc.text("--------------------------------", x, y);
      y = y + inicio;
      this.doc.setFontSize(7);
      this.doc.text("CANT DESCRIPC  UNI TOTAL IVA", x, y);
      y = y + inicio;
      this.doc.setFontSize(10);
      this.doc.text("--------------------------------", x, y);
      for (let i of factura.detalle) {
        y = y + inicio;
        this.doc.setFontSize(7);
        this.doc.text(this.calculosService.cortarCantidades("" + i.cantidad, 4), x + 1, y);
        this.doc.text(this.calculosService.cortarDescripcion(i.descripcion, 32), x + 8, y);
        y = y + inicio;
        let unitario = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(i.unitario).replace("COP", "");
        let parcial = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(i.parcial).replace("COP", "");
        let iva = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(i.impuesto_producto).replace("COP", "");
        this.doc.text(unitario + "  " + parcial + "  " + iva, x + 7, y);
      }
      y = y + inicio;
      this.doc.setFontSize(10);
      this.doc.text("--------------------------------", x, y);
      this.doc.setFontSize(7);
      y = y + inicio;
      this.doc.text("Valor Exento: " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.excento).replace("COP", ""), 10), x, y);
      y = y + inicio;
      this.doc.text("Valor Gravado: " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.gravado).replace("COP", ""), 10), x, y);
      y = y + inicio;
      this.doc.text("Valor IVA: " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.iva).replace("COP", ""), 10), x, y);
      y = y + inicio;
      if(factura.saldo>0){
        this.doc.text("Saldo anterior: " + this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.saldo).replace("COP", ""), 10), x, y);
        y = y + inicio;
      }
      this.doc.setFontSize(10);
      this.doc.text("--------------------------------", x, y);
      y = y + inicio;
      this.doc.setFontType('bold');
      this.doc.setFontSize(10);
      this.doc.text("TOTAL PAGAR: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(Number(factura.documento.total)+Number(factura.saldo)).replace("COP", ""), x, y);
      y = y + inicio;
      this.doc.setFontType('normal');
      this.doc.text("--------------------------------", x, y);
      y = y + inicio;
      this.doc.setFontSize(7);
      this.doc.text("         **** FORMA DE PAGO****        ", x, y);
      y = y + inicio;
      //hacer un metodo para ir a traer los tipos de pago de este dococumento
      this.doc.text("Vr. Pago con Efectivo:  " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.total).replace("COP", ""), x, y);
      y = y + inicio;
      this.doc.text("Cambio:  " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.cambio).replace("COP", ""), x, y);
      y = y + inicio;
      this.doc.setFontSize(10);
      this.doc.text("--------------------------------", x, y);
      y = y + inicio;
      this.doc.setFontSize(7);
      this.doc.text("Res. " + factura.resolucionEmpresa.resolucion_dian + " de Fecha: " + this.calculosService.formatDate(factura.resolucionEmpresa.fecha_resolucion, false), x, y);
      y = y + inicio;
      this.doc.text("Rango autorizado: " + factura.resolucionEmpresa.autorizacion_desde + " a " + factura.resolucionEmpresa.autorizacion_hasta, x, y);
      y = y + inicio;
      this.doc.text("Fac." + factura.resolucionEmpresa.t_factura, x, y);
      y = y + inicio;
      this.doc.text(" *****GRACIAS POR SU COMPRA*****  ", x, y);
      y = y + inicio;
      this.doc.text("  Software desarrollado por:", x, y);
      y = y + inicio;
      this.doc.text("  effectivesoftware.com.co", x, y);
      y = y + inicio;
      this.doc.text(" info@effectivesoftware.com.co", x, y);
      this.doc.save(factura.titulo + ".pdf");
    });
  }

  calcularHojas(tope: number, detalle: DocumentoDetalleModel[], topoLinea: number,linea:number) {
    let numeroPaginas = 1;
    let row = 0;
    for (let pro of detalle) {
      row = row + linea;
      if (pro.descripcion.length > topoLinea) {
        let linea: number = pro.descripcion.length / topoLinea;
        let numlineas = Math.ceil(linea);
        row = row + numlineas;
      }
    }
    let div: number = row / tope;
    numeroPaginas = Math.ceil(div);
    console.log("numero de paginas:" + numeroPaginas);
    return numeroPaginas;
  }


  reporteCostos(productos: Array<ProductoModel>, empresa: EmpresaModel) {
    this.doc = new jsPDF();
    let y = 20;
    let inicio = 5;
    let sumaCantidad = 0;
    let sumaCosto = 0;
    let sumaCostoTotal = 0;
    let sumaIVA = 0;
    let sumaTotal = 0;
    let pagina = 1;
    this.doc.setFontType('bold');
    this.doc.setFontSize(11);
    this.doc.text(empresa.nombre, 5, 5);
    this.doc.text("NIT: " + empresa.nit, 5, 10);
    this.doc.text("FECHA: " + new Date().toLocaleString(), 5, 15);
    this.doc.text("PAGINA: " + pagina, 100, 15);
    this.doc.setFontSize(10);
    this.doc.text("Cód.         Descripción del artículo                cant.            costo_u           Costo total        Total IVA             Total", 5, 20);
    this.doc.setFontSize(9);
    this.doc.setFontType('normal');
    for (let p of productos) {
      y = y + inicio;
      sumaCantidad = Number(sumaCantidad) + Number(p.cantidad);
      sumaCosto = Number(sumaCosto) + Number(p.costo);
      sumaCostoTotal = Number(sumaCostoTotal) + Number(p.costo) * Number(p.cantidad);
      sumaIVA = Number(sumaIVA) + Number(p.costo) * Number(p.cantidad) * 0.19;
      sumaTotal = Number(sumaTotal) + Number(p.costo) * Number(p.cantidad);
      let codigo: string = this.calculosService.cortarDescripcion("" + p.producto_id, 5);
      let nombre: string = this.calculosService.cortarDescripcion(p.nombre, 30);
      let cantidad: string = "" + new Intl.NumberFormat().format(p.cantidad);
      let impuesto: number = Number(p.impuesto) / 100;
      let costo: string = this.calculosService.cortarDescripcion(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(p.costo / (1 + impuesto)).replace("COP", ""), 10);
      let costoTotal: string = this.calculosService.cortarDescripcion(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(Number(p.costo) * Number(p.cantidad)).replace("COP", ""), 10);
      let ivaTotal: string = this.calculosService.cortarDescripcion(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(Number(p.costo) * Number(p.cantidad) * 0.19).replace("COP", ""), 10);
      let total: string = this.calculosService.cortarDescripcion(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(Number(p.costo) * Number(p.cantidad)).replace("COP", ""), 10);
      this.doc.text(codigo, 5, y);
      this.doc.text(nombre, 22, y);
      this.doc.text(cantidad, 78, y);
      this.doc.text(costo, 98, y);
      this.doc.text(costoTotal, 122, y);
      this.doc.text(ivaTotal, 150, y);
      this.doc.text(total, 175, y);
      if (y >= 297) {
        y = 20;
        this.doc.addPage();
        pagina = pagina + 1;
        this.doc.setFontType('bold');
        this.doc.setFontSize(11);
        this.doc.text(empresa.nombre, 5, 5);
        this.doc.text("NIT: " + empresa.nit, 5, 10);
        this.doc.text("FECHA: " + new Date().toLocaleString(), 5, 15);
        this.doc.text("PAGINA: " + pagina, 100, 15);
        this.doc.setFontSize(10);
        this.doc.text("Cód.         Descripción del artículo                cant.            costo_u           Costo total        Total IVA             Total", 5, 20);
        this.doc.setFontSize(9);
        this.doc.setFontType('normal');
      }
    }

    this.doc.text("_________________________________________________________________________________________________________", 5, y);
    y = y + inicio;
    //this.doc.text( ""+new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(sumaCantidad).replace("COP", ""), 78, y);
    this.doc.text("" + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(sumaCosto).replace("COP", ""), 80, y);
    this.doc.text("" + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(sumaCostoTotal).replace("COP", ""), 105, y);
    this.doc.text("" + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(sumaIVA).replace("COP", ""), 140, y);
    this.doc.text("" + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(sumaTotal).replace("COP", ""), 175, y);
    this.doc.save("reporte de costo.pdf");
  }


  imprimirFacturaPDFCarta(factura: FacturaModel, configuracion: ConfiguracionModel, exportar: boolean) {
    let imgData = factura.empresa.url_logo;
    this.doc = new jsPDF();
    console.log("# de detalles:" + factura.detalle.length);
    let topeLinea = 42.0;
    let tope: number = 41.0;// esta variable controla el nuero de productos por pagina en la factura
    let numPaginas = this.calcularHojas(tope, factura.detalle, topeLinea,2);
    let posy = 63; //controla la posicion de y para los productos
    this.getBase64ImageFromURL(imgData).subscribe(base64data => {
      let base64Image = 'data:image/jpg;base64,' + base64data;
      // for (let i = 0; i < numPaginas; i++) {
      let i = 0;
      this.doc.addImage(base64Image, 'JPEG', 10, 4)
      this.crearHeader(factura, configuracion, (i + 1), numPaginas);
      this.doc.setFontType('normal');
      this.doc.setFontSize(9);

      this.doc.text("Total IVA: $" + this.calculosService.cortarDescripcion(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.iva).replace("COP", ""), 20) + "   "
        + "Exento: $" + this.calculosService.cortarDescripcion(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.excento).replace("COP", ""), 20) + "   "
        + "Gravado: $" + this.calculosService.cortarDescripcion(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.gravado).replace("COP", ""), 20) + "   "
        , 4, 264);
      let row = 0;
      for (let contadorP of factura.detalle) {
        row = row + 2;

        let codigo = contadorP.documento_detalle_id;
        let cantidad = contadorP.cantidad;
        let descripcion = contadorP.descripcion.trim().replace(/(\r\n|\n|\r)/gm, "");
        let dividir = 1 + (Number(contadorP.impuesto_producto) / 100)
        let unitario = Number(contadorP.unitario) / dividir;
        let parcial = contadorP.parcial;
        let iva = contadorP.impuesto_producto;
        this.doc.text(codigo, 4, posy);
        this.doc.text(cantidad, 20, posy);

        this.doc.text(""+iva, 145, posy);
        this.doc.text(this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(Math.round(unitario)).replace("COP", ""), 20), 115, posy);
        this.doc.text(this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(Math.round(parcial)).replace("COP", ""), 20), 182, posy);

        let linea: number = descripcion.length / topeLinea;
        let numlineas = Math.ceil(linea);
        if (descripcion.length > topeLinea) {
          row = row + numlineas;
        }
        let ini = 0;
        let fin = topeLinea;
        for (let i = 0; i <= numlineas; i++) {
          let parcial = descripcion.substring(ini, fin);
          this.doc.text(parcial, 33, posy);
          posy = posy + 5;
          ini = ini + topeLinea;
          fin = fin + topeLinea;
        }
        if (row + 1 >= tope) {
          this.doc.addPage();
          posy = 63;
          row = 0;
          i = i + 1;
          this.doc.addImage(base64Image, 'JPEG', 10, 4)
          this.crearHeader(factura, configuracion, (i + 1), numPaginas);
          this.doc.setFontType('normal');
          this.doc.setFontSize(9);
          this.doc.text("Total IVA: $" + this.calculosService.cortarDescripcion(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.iva).replace("COP", ""), 20) + "   "
            + "Exento: $" + this.calculosService.cortarDescripcion(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.excento).replace("COP", ""), 20) + "   "
            + "Gravado: $" + this.calculosService.cortarDescripcion(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.documento.gravado).replace("COP", ""), 20) + "   "
            , 4, 264);
        }
      }
      // }
      if (exportar) {
        let vare = this.doc.output('datauristring');
        console.log(vare);
        return vare
      } else {
        this.doc.save(factura.titulo + ".pdf");
      }

    });
    this.doc.setFontSize(9);
    return this.doc.output('datauristring');
  }

  imprimirInformeDiarioPDFCarta(factura: InformeDiarioVOModel) {
    let imgData = factura.empresa.url_logo;
    this.doc = new jsPDF();
    let ini = this.calculosService.fechaIniBusquedaDate(new Date(factura.informe_diario.fecha_informe));
    let fin = this.calculosService.fechaFinBusquedaDate(new Date(factura.informe_diario.fecha_informe));
    this.getBase64ImageFromURL(imgData).subscribe(base64data => {
      this.usuarioService.usuarioByRol(this.ROL_CAJERO, factura.empresa.empresa_id, this.TIPO_DOCUMENTO_FACTURA, ini, fin).subscribe(res => {
        this.documentoService.getDocumentosByTipoPago(factura.empresa.empresa_id, this.TIPO_DOCUMENTO_FACTURA, ini, fin).subscribe(pagos => {
          let cajeros = res;
          let tipos = pagos
          let base64Image = 'data:image/jpg;base64,' + base64data;
          this.doc.addImage(base64Image, 'JPEG', 10, 4)
          this.doc.setFontType('bold')
          this.doc.setFontSize(9);
          this.doc.text(this.calculosService.centrarDescripcion(factura.empresa.nombre, 77), 80, 5);
          this.doc.text(this.calculosService.centrarDescripcion("NIT: " + factura.empresa.nit, 77), 80, 10);
          this.doc.setFontSize(6);
          this.doc.text(this.calculosService.centrarDescripcion("SOMOS " + factura.empresa.regimen, 77), 90, 13);
          this.doc.text(this.calculosService.centrarDescripcion("Representante Legal: " + factura.empresa.represente, 77), 90, 16);
          this.doc.text(this.calculosService.centrarDescripcion("Dirección: " + factura.empresa.direccion, 77), 90, 19);
          this.doc.text(this.calculosService.centrarDescripcion("Telefono: " + factura.empresa.telefono_fijo, 77), 90, 22);

          this.doc.setFontSize(9);
          this.doc.text("Comprobante de Informe Diario ", 10, 35);
          this.doc.text("Fecha informe: " + this.calculosService.formatDate(factura.informe_diario.fecha_informe, false), 10, 40);
          this.doc.text("__________________________________________________________________________________________________________", 10, 45);
          this.doc.text("# Fact. Inicial             # Fact. Final              Cant. Facturas             Valor Total Facturado ", 10, 50);
          this.doc.text("__________________________________________________________________________________________________________", 10, 51);
          this.doc.setFontType('normal')
          this.doc.text(factura.informe_diario.documento_inicio, 10, 55);
          this.doc.text(factura.informe_diario.documento_fin, 50, 55);
          this.doc.text("" + factura.informe_diario.cantidad_documentos, 80, 55);
          this.doc.text(this.calculosService.cortarCantidades(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.informe_diario.total_ventas).replace("COP", ""), 20), 100, 55);
          this.doc.setFontType('bold');

          this.doc.text("Descriminación de ventas atendidas por Cajero", 10, 65);
          this.doc.text("______________________________________________________________________________", 10, 70);
          this.doc.text("Cajero", 10, 75);
          this.doc.text("Canti. Fact      Vr. Total Facturado", 70, 75);
          this.doc.text("______________________________________________________________________________", 10, 76);
          let espacio = 80;
          let totalDocumentos = 0;
          let totalCajeros = 0;
          this.doc.setFontType('normal')
          for (let cajero of cajeros) {
            console.log(cajero);
            this.doc.text(cajero.nombre, 10, espacio);
            this.doc.text(cajero.num, 80, espacio);
            this.doc.text(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(cajero.total).replace("COP", ""), 110, espacio);
            espacio = espacio + 5;
            totalDocumentos = Number(totalDocumentos) + Number(cajero.num);
            totalCajeros = Number(totalCajeros) + Number(cajero.total);
          }
          this.doc.text("" + totalDocumentos, 80, espacio);
          this.doc.text(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(totalCajeros).replace("COP", ""), 110, espacio);
          this.doc.setFontType('bold');
          this.doc.text("______________________________________________________________________________", 10, espacio - 5);
          this.doc.text("Discriminación de Ventas por forma de Pago", 10, espacio + 10);
          this.doc.text("__________________________________________________________________________________________________________", 10, espacio + 16);
          this.doc.text("Forma de Pago ", 10, espacio + 20);
          this.doc.text("Cantidad Facturas", 110, espacio + 20);
          this.doc.text(" Valor Facturado", 150, espacio + 20);
          this.doc.text("__________________________________________________________________________________________________________", 10, espacio + 21);
          this.doc.setFontType('normal')
          espacio = espacio + 25;
          for (let tipo of tipos) {
            this.doc.text(tipo.nombre, 10, espacio);
            this.doc.text(tipo.num, 125, espacio);
            this.doc.text(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(tipo.total).replace("COP", ""), 160, espacio);
            espacio = espacio + 5;
          }
          this.doc.setFontType('bold');
          this.doc.text("Resumen Informe Diario", 10, espacio + 5);
          this.doc.text("__________________________________________________________________________________________________________", 10, espacio - 5);
          espacio = espacio + 10;
          this.doc.text("Total Ventas: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.informe_diario.total_ventas).replace("COP", ""), 10, espacio);
          this.doc.text("IVA Total: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.informe_diario.iva_ventas).replace("COP", ""), 10, espacio + 5);
          this.doc.text("IVA 19%: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.informe_diario.iva_19).replace("COP", ""), 10, espacio + 10);
          this.doc.text("IVA 5%: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.informe_diario.iva_5).replace("COP", ""), 10, espacio + 15);
          this.doc.text("Base 19%: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.informe_diario.base_19).replace("COP", ""), 10, espacio + 20);
          this.doc.text("Base 5%: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.informe_diario.base_5).replace("COP", ""), 10, espacio + 25);
          this.doc.text("Excluido: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.informe_diario.excento).replace("COP", ""), 10, espacio + 30);
          this.doc.text("Costos en Ventas: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format(factura.informe_diario.costo_ventas).replace("COP", ""), 10, espacio + 35);
          this.doc.text("Ganancias: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COP' }).format((Number(factura.informe_diario.total_ventas) - Number(factura.informe_diario.costo_ventas))).replace("COP", ""), 10, espacio + 40);
          //if(){

          //}else{
          //  this.doc.output('datauri')
          //}
          this.doc.save(factura.tituloArchivo + ".pdf");
        });
      });
    });
  }

  imprimirDetalleCargaMasiva(texto: string[]) {
    return new Blob(texto, {
      type: 'text/plain'
    });
  }
}
