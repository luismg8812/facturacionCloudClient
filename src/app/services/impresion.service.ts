import { Injectable } from '@angular/core';
import { DocumentoModel } from '../model/documento.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { ConfiguracionModel } from '../model/configuracion.model';
import { FacturaModel } from '../vo/factura.model';
import { CalculosService } from './calculos.service';

@Injectable({
  providedIn: 'root'
})
export class ImpresionService {

  constructor(public calculosService: CalculosService) { }

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
    texto.push("FECHA: " + this.calculosService.cortarDescripcion(factura.documento.fecha_registro.toString(), 19) + "\n");//fecha
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
    texto.push(this.calculosService.centrarDescripcion("effectivesoftware1@gmail.com", tamanoMax) + '\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
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
    texto.push(this.calculosService.centrarDescripcion("NIT. " + factura.empresa.nit + " " + factura.empresa.regimen, tamanoMax) + "\n");//nit y regimen
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.direccion, tamanoMax) + "\n");//direccion
    texto.push(this.calculosService.centrarDescripcion(factura.empresa.barrio, tamanoMax) + "\n");//barrio
    texto.push(this.calculosService.centrarDescripcion("TEL: " + factura.empresa.telefono_fijo + " " + factura.empresa.cel, tamanoMax) + "\n");//telefonos
    texto.push('\n');
    texto.push("ORDEN DE TRABAJO: " + factura.documento.documento_id + "\n");//consecutivo
    texto.push("FECHA: " + this.calculosService.cortarDescripcion(factura.documento.fecha_registro.toString(), 19) + "\n");//fecha
    texto.push("CAJERO: " + factura.nombreUsuario + "\n");//fecha
    texto.push("CAJA: " + '\n');
    if (factura.cliente != undefined) {
      texto.push("CLIENTE: " + factura.cliente.nombre + '\n');
      texto.push("NIT/CC: " + factura.cliente.documento + '\n');
      texto.push("TELEFONO: " + factura.cliente.fijo + '\n');
    }
    texto.push("VEHÍCULO: " + factura.documento.detalle_entrada + '\n');
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
    texto.push(this.calculosService.centrarDescripcion("*GRACIAS POR SU COMPRA*", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("Software desarrollado por:", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("effectivesoftware.com.co", tamanoMax) + '\n');
    texto.push(this.calculosService.centrarDescripcion("effectivesoftware1@gmail.com", tamanoMax) + '\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    return new Blob(texto, {
      type: 'text/plain'
    });
  }

  imprimirFacturaTxt(factura: FacturaModel, configuracion: ConfiguracionModel) {
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
    texto.push("CLIENTE: " + factura.cliente.nombre + '\n');
    texto.push("NIT/CC: " + factura.cliente.documento + '\n');
    texto.push("DIRECCIÓN: " + factura.cliente.direccion + '\n');
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
    texto.push(this.calculosService.centrarDescripcion("effectivesoftware1@gmail.com", tamanoMax) + '\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    texto.push('\n');
    return new Blob(texto, {
      type: 'text/plain'
    });
  }

}
