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




@Injectable({
  providedIn: 'root'
})

export class ImpresionService {
  public doc = new jsPDF();

  constructor(public calculosService: CalculosService) { }

  imprimirCuadreTxt80(factura: CuadreCajaVoModel, empresa:EmpresaModel,nombreUsuario:string) {
    //Genera un objeto Blob con los datos en un archivo TXT
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
    texto.push("CAJERO: " +nombreUsuario + "\n");//fecha
    texto.push("CAJA: " + '\n');
    texto.push("ENTREGO:______________________________" + '\n');
    texto.push("Factura inicial:.......: " + '\n');
    texto.push("Factura final:.........: " + '\n');
    texto.push('----------------------------------------\n');
    texto.push('DESCRIPCIÓN                        TOTAL\n');
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
      let efectivo: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.efectivo), 12);
      
    texto.push("Total Facturas:........:" + totalFacturas + "\n");
    texto.push("Base:..................:" + base + "\n");
    texto.push("Cheques Recogidos:.....: " + cheques + "\n");
    texto.push("Otros:.................: " + otros + "\n");
    texto.push("Recargas:..............: " + recargas + "\n");
    texto.push("TOTAL MOV. DEL DIA:....: " + totalIngresos + "\n");
    texto.push('----------------------------------------\n');
    texto.push("VR. EN FAJOS:..........: " + fajos + "\n");
    texto.push("MONEDA: ...............: " + monedas + "\n");
    texto.push("EFECTIVO:..............: " + efectivo + "\n");
    texto.push("CHEQUES:...............: " + cheques + "\n");
    texto.push("DOC. ESPECIALES:.......: 0"+  "\n");
    texto.push("TARJET DÉBIT Y CRÉDITO.: " + tarjetas + "\n");
    texto.push("VARIOS:................: " + varios + "\n");
    texto.push("VALES:.................: " + vales + "\n");
    texto.push("NOMINA:................: " + totalFacturas + "\n");
    texto.push("GASTOS:................: " + gastos + "\n");
    texto.push("PROPIAS:...............: " + propina + "\n");
    texto.push("VENTAS A CRÉDITO:......: " + credito + "\n");
   
    texto.push('----------------------------------------\n');
    texto.push((Number(factura.diferencia)< 0.0 ? "SOBRANTE" : "FALTANTE") + "$...........: "+ factura.diferencia + "\n");
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
      let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.detalle[i].parcial), 12);
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
    texto.push("VEHÍCULO: " + factura.documento.detalle_entrada + '\n');
    texto.push("LINEA: " + factura.documento.linea_vehiculo + '\n');
    texto.push("DESCRIPCIÓN CLIENTE: " + factura.documento.descripcion_cliente + '\n');
    texto.push("DIAGNOSTICO: " + factura.documento.descripcion_trabajador + '\n');
    texto.push('--------------------------------\n');
    texto.push('DESCRIPCIÓN                TOTAL\n');
    texto.push('--------------------------------\n');
    for (var i = 0; i < factura.detalle.length; i++) {
      let nombreProducto: string = this.calculosService.cortarDescripcion(factura.detalle[i].descripcion, 20);
      let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.detalle[i].parcial), 10);
      texto.push(nombreProducto + "  " + totalProducto + "\n");
    }
    texto.push('--------------------------------\n');
    texto.push("TOTAL A PAGAR:    " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 14) + '\n');
    texto.push('--------------------------------\n');
    texto.push('\n');
    texto.push("El establecimiento no se hace responsable de la pérdida o robo de objetos de valor dejados en el vehículo" + '\n');

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
      let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.ordenes[i].total), 10);
      texto.push(nombreProducto + "  " + totalProducto + "\n");
    }
    texto.push('--------------------------------\n');
    texto.push('VALES                      TOTAL\n');
    texto.push('--------------------------------\n');
    for (var i = 0; i < factura.vales.length; i++) {
      let nombreProducto: string = this.calculosService.cortarDescripcion(factura.vales[i].detalle_entrada, 20);
      let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.ordenes[i].total), 10);
      texto.push(nombreProducto + "  " + totalProducto + "\n");
    }
    texto.push('--------------------------------\n');
    texto.push('PRODUCTOS                  TOTAL\n');
    texto.push('--------------------------------\n');
    for (var i = 0; i < factura.productos.length; i++) {
      let nombreProducto: string = this.calculosService.cortarDescripcion(factura.productos[i].concepto_producto, 20);
      let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.productos[i].valor), 10);
      texto.push(nombreProducto + "  " + totalProducto + "\n");
    }
    texto.push('--------------------------------\n');
    texto.push("SUB-TOTAL:        " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.nomina.subtotal), 14) + '\n');
    texto.push("TOTAL VALES:      " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.nomina.vales), 14) + '\n');
    texto.push("TOTAL PRODUCTOS:  " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.nomina.productos), 14) + '\n');
    texto.push("PAGO AHORRO:      " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.nomina.ahorro), 14) + '\n');
    texto.push("PAGO ADMIN:       " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.nomina.admon), 14) + '\n');
    texto.push("TOTAL A PAGAR:    " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.nomina.total), 14) + '\n');
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
    texto.push(factura.nombreTipoDocumento + ": " + anulada + factura.documento.consecutivo_dian + "\n");//consecutivo
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
    texto.push('----------------------------------------\n');
    texto.push('DESCRIPCIÓN       CANT   UNIDAD    TOTAL\n');
    texto.push('----------------------------------------\n');
    for (var i = 0; i < factura.detalle.length; i++) {
      let nombreProducto: string = this.calculosService.cortarDescripcion(factura.detalle[i].nombre_producto, 17);
      let cantidadProducto: string = this.calculosService.cortarCantidades(factura.detalle[i].cantidad.toString(), 4);
      let unidadProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.detalle[i].unitario), 8);
      let totalProducto: string = this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.detalle[i].parcial), 8);
      texto.push(nombreProducto + " " + cantidadProducto + " " + unidadProducto + " " + totalProducto + "\n");
    }
    texto.push('----------------------------------------\n');
    texto.push("Valor Exento:             " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.excento), 14) + '\n');
    texto.push("Valor Gravado:            " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.gravado), 14) + '\n');
    texto.push("Iva:                      " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.iva), 14) + '\n');
    texto.push("TOTAL A PAGAR:            " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 14) + '\n');
    texto.push('----------------------------------------\n');
    texto.push("         **** FORMA DE PAGO****        \n");
    texto.push("Vr. Pago con Tarjeta:                  0" + '\n');
    texto.push("Vr. Comisión Tarjeta:                  0" + '\n');
    texto.push("Vr. Total Factura:        " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 14) + '\n');
    texto.push("fectivo:		      	  " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 14) + '\n');
    texto.push("Cambio:			          " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.cambio), 14) + '\n');
    texto.push('----------------------------------------\n');
    texto.push("Res. " + factura.empresa.resolucion_dian + "Fecha: " + factura.empresa.fecha_resolucion + '\n');
    texto.push("Rango autorizado desde: " + factura.empresa.autorizacion_desde + " a " + factura.empresa.autorizacion_hasta + '\n');
    texto.push("Factura: " + factura.empresa.t_factura + '\n');
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
    texto.push(factura.nombreTipoDocumento + ": " + anulada + factura.documento.consecutivo_dian + "\n");//consecutivo
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
    texto.push("TOTAL A PAGAR:    " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 14) + '\n');
    texto.push('--------------------------------\n');
    texto.push(this.calculosService.centrarDescripcion("*FORMA DE PAGO*", tamanoMax) + "\n");
    texto.push("Vr. Pago con Tarjeta:          0" + '\n');
    texto.push("Vr. Comisión Tarjeta:          0" + '\n');
    texto.push("Vr. Total Factura: " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 13) + '\n');
    texto.push("fectivo:		   " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 13) + '\n');
    texto.push("Cambio:			   " + this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.cambio), 13) + '\n');
    texto.push('--------------------------------\n');
    texto.push("Res. " + factura.empresa.resolucion_dian + "Fecha: " + factura.empresa.fecha_resolucion + '\n');
    texto.push("Autorizado desde: " + factura.empresa.autorizacion_desde + " a " + factura.empresa.autorizacion_hasta + '\n');
    texto.push("Factura: " + factura.empresa.t_factura + '\n');
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
    this.doc.line(19, 52, 19, 58) // vertical line    
    this.doc.line(32, 52, 32, 58) // vertical line    
    this.doc.line(114, 52, 114, 58) // vertical line    
    this.doc.line(138, 52, 138, 58) // vertical line    
    this.doc.line(157, 52, 157, 58) // vertical line    
    this.doc.line(181, 52, 181, 58) // vertical line    
    this.doc.text("N° "+factura.documento.consecutivo_dian, 175, 18);
    this.doc.text(this.calculosService.cortarDescripcion(factura.documento.fecha_registro.toString(), 19), 160, 35);

    this.doc.text(this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 15), 183, 275);
    this.doc.text(this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.descuento), 15), 183, 280);
    this.doc.text(this.calculosService.cortarCantidades(new Intl.NumberFormat().format(factura.documento.total), 15), 183, 285);
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
    this.doc.text("DESCUENTO: $", 159, 280);
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
    this.doc.text(this.calculosService.centrarDescripcion("RESOLUCION DIAN N° " + factura.empresa.resolucion_dian + " DE " + factura.empresa.fecha_resolucion, 77), 90, 16);
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



  imprimirFacturaPDFCarta(factura: FacturaModel, configuracion: ConfiguracionModel) {
    let imgData = factura.empresa.url_logo;
    let tope: number = 41.0;// esta variable controla el nuero de productos por pagina en la factura
    this.doc = new jsPDF();
    console.log("# de detalles:" + factura.detalle.length);
    let div: number = factura.detalle.length / tope;
    let numPaginas = Math.ceil(div);
    let contadorP = 0;
    let posy = 63; //controla la posicion de y para los productos
    this.getBase64ImageFromURL(imgData).subscribe(base64data => {
      let base64Image = 'data:image/jpg;base64,' + base64data;
      for (let i = 0; i < numPaginas; i++) {
        this.doc.addImage(base64Image, 'JPEG', 10, 4)
        this.crearHeader(factura, configuracion, (i + 1), numPaginas);
        this.doc.setFontType('normal');
        this.doc.setFontSize(9);
        this.doc.text("Total IVA: $" +this.calculosService.cortarDescripcion(new Intl.NumberFormat().format( factura.documento.iva),20)+"   "
                    + "Exento: $" +this.calculosService.cortarDescripcion(new Intl.NumberFormat().format( factura.documento.excento),20)+"   "
                    + "Gravado: $" +this.calculosService.cortarDescripcion(new Intl.NumberFormat().format( factura.documento.iva),20)+"   "
        , 4, 269);
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
            this.doc.text(descripcion, 35, posy);
            this.doc.text(iva, 145, posy);
            this.doc.text(this.calculosService.cortarCantidades(new Intl.NumberFormat().format(unitario), 20), 115, posy);
            this.doc.text(this.calculosService.cortarCantidades(new Intl.NumberFormat().format(parcial), 20), 182, posy);
            posy = posy + 5;
          } else {
            break;
          }
          if (e + 1 == tope) {
            this.doc.addPage();
            posy = 63;
          }
        }
      }
      this.doc.save(factura.titulo+".pdf");
    });
    this.doc.setFontSize(9);
  }

}
