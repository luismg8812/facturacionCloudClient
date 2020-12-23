import { Injectable } from '@angular/core';
import { ProductoModel } from '../model/producto.model';
import { DocumentoModel } from '../model/documento.model';
import { DocumentoDetalleModel } from '../model/documentoDetalle.model';
import { ParametrosModel } from '../model/parametros.model';
import { InformeDiarioModel } from '../model/informeDiario.model';
import { EmpresaModel } from '../model/empresa.model';
import { DocumentoMapModel } from '../facturacion.cloud.model/documentoMap.model';
import { EnvioFacturacionElectronicaModel } from '../facturacion.cloud.model/envioFacturacionElectronica.model';
import { AppConfigService } from './app-config.service';
import { DataJSONModel } from '../facturacion.cloud.model/datajson.model';
import { FacturasModel } from '../facturacion.cloud.model/facturas.model';
import { DataDetalleFacturaModel } from '../facturacion.cloud.model/dataDetalleFactura.model';
import { DataDescuentosModel } from '../facturacion.cloud.model/dataDescuentos.model';
import { DataImpuestosDetalleModel } from '../facturacion.cloud.model/dataImpuestosDetalle.model';
import { DataImpuestosModel } from '../facturacion.cloud.model/dataImpuestos.model';
import { DataFacturaTotalesModel } from '../facturacion.cloud.model/dataFacturaTotales.model';
import { DataFacturaModel } from '../facturacion.cloud.model/dataFactura.model';
import { DataClienteModel } from '../facturacion.cloud.model/dataCliente.model';
import { ClienteModel } from '../model/cliente.model';

@Injectable({
	providedIn: 'root'
})
export class CalculosService {

	readonly TIPO_DOCUMENTO_NOTA_CREDITO: number = 12;
	readonly TIPO_DOCUMENTO_NOTA_DEBITO: number = 13;

	constructor() { }

	public calcularInfoDiarioNota(documento: DocumentoModel, nota: DocumentoModel, infoDiario: InformeDiarioModel) {
		infoDiario.base_19 = Number(infoDiario.base_19) - Number(documento.base_19);
		infoDiario.base_5 = Number(infoDiario.base_5) - Number(documento.base_5);
		infoDiario.iva_5 = Number(infoDiario.iva_5) - Number(documento.iva_5);
		infoDiario.iva_19 = Number(infoDiario.iva_19) - Number(documento.iva_19);
		infoDiario.total_ventas = Number(infoDiario.total_ventas) - Number(documento.total);
		infoDiario.iva_ventas = Number(infoDiario.iva_ventas) - Number(documento.iva);
		infoDiario.excento = Number(infoDiario.excento) - Number(documento.excento);
		infoDiario.costo_ventas = Number(infoDiario.costo_ventas) - Number(documento.total_costo);

		infoDiario.base_19 = Number(infoDiario.base_19) + Number(nota.base_19);
		infoDiario.base_5 = Number(infoDiario.base_5) + Number(nota.base_5);
		infoDiario.iva_5 = Number(infoDiario.iva_5) + Number(nota.iva_5);
		infoDiario.iva_19 = Number(infoDiario.iva_19) + Number(nota.iva_19);
		infoDiario.total_ventas = Number(infoDiario.total_ventas) + Number(nota.total);
		infoDiario.iva_ventas = Number(infoDiario.iva_ventas) + Number(nota.iva);
		infoDiario.excento = Number(infoDiario.excento) + Number(nota.excento);
		infoDiario.costo_ventas = Number(infoDiario.costo_ventas) + Number(nota.total_costo);
		return infoDiario;
	}

	public calcularInfoDiario(documento: DocumentoModel, infoDiario: InformeDiarioModel, anulado: boolean) {
		switch (documento.tipo_documento_id) {
			case 2:
				infoDiario.iva_5_compras = Number(infoDiario.iva_5_compras) + Number(documento.iva_5);
				infoDiario.excento_compras = Number(infoDiario.excento_compras) + Number(documento.excento);
				infoDiario.Iva_19_compras = Number(infoDiario.Iva_19_compras) + Number(documento.iva_19);
				infoDiario.base_19_compras = Number(infoDiario.base_19_compras) + Number(documento.base_19);
				infoDiario.base_5_compras = Number(infoDiario.base_5_compras) + Number(documento.base_5);
				break;
			case 10:
				infoDiario = this.asignarValorInfoDiario(documento, infoDiario, anulado);
				break;
			case 9:
				if (anulado) {
					infoDiario.total_remisiones = Number(infoDiario.total_remisiones) - Number(documento.total);
					infoDiario.iva_remisiones = Number(infoDiario.iva_remisiones) - Number(documento.iva);
					infoDiario.costo_remisiones = Number(infoDiario.costo_remisiones) - Number(documento.total_costo);
				} else {
					infoDiario.total_remisiones = Number(infoDiario.total_remisiones) + Number(documento.total);
					infoDiario.iva_remisiones = Number(infoDiario.iva_remisiones) + Number(documento.iva);
					infoDiario.costo_remisiones = Number(infoDiario.costo_remisiones) + Number(documento.total_costo);
				}
				break;
			default:
				break;
		}
		return infoDiario;
	}

	private asignarValorInfoDiario(documento: DocumentoModel, info: InformeDiarioModel, anulado: boolean) {
		//facturas
		info.cantidad_documentos = Number(info.cantidad_documentos) + 1;
		if (anulado) {
			info.base_19 = Number(info.base_19) - Number(documento.base_19);
			info.base_5 = Number(info.base_5) - Number(documento.base_5);
			info.iva_5 = Number(info.iva_5) - Number(documento.iva_5);
			info.iva_19 = Number(info.iva_19) - Number(documento.iva_19);
			info.total_ventas = Number(info.total_ventas) - Number(documento.total);
			info.iva_ventas = Number(info.iva_ventas) - Number(documento.iva);
			info.excento = Number(info.excento) - Number(documento.excento);
			info.costo_ventas = Number(info.costo_ventas) - Number(documento.total_costo);
		} else {
			info.base_19 = Number(info.base_19) + Number(documento.base_19);
			info.base_5 = Number(info.base_5) + Number(documento.base_5);
			info.iva_5 = Number(info.iva_5) + Number(documento.iva_5);
			info.iva_19 = Number(info.iva_19) + Number(documento.iva_19);
			info.total_ventas = Number(info.total_ventas) + Number(documento.total);
			info.iva_ventas = Number(info.iva_ventas) + Number(documento.iva);
			info.excento = Number(info.excento) + Number(documento.excento);
			info.costo_ventas = Number(info.costo_ventas) + Number(documento.total_costo);
		}
		if (!anulado) {
			if (info.informe_diario_id == null) {
				info.documento_inicio = documento.consecutivo_dian;
				info.documento_fin = documento.consecutivo_dian;
			} else {
				info.documento_fin = documento.consecutivo_dian;
			}
		}
		return info;
	}

	public fechaActual() {
		let fecha = new Date();
		let parametros: ParametrosModel = new ParametrosModel;
		if (parametros.ambiente == 'cloud') {
			fecha.setDate(fecha.getDate() - 0.2083);
			fecha.setDate(fecha.getDate() + 1);
		}
		return fecha;
	}

	formatTime(date) {
		var d = new Date(date);
		var hora = this.addZero(d.getHours());
		var minulos = this.addZero(d.getMinutes());
		var seg = this.addZero(d.getSeconds());
		return [hora, minulos, seg].join(':');
	}

	formatDate(date, conHora) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + (d.getDate()),
			year = d.getFullYear();

		var hora = this.addZero(d.getHours());
		var minulos = this.addZero(d.getMinutes());
		var seg = this.addZero(d.getSeconds());
		if (month.length < 2)
			month = '0' + month;
		if (day.length < 2)
			day = '0' + day;
		if (conHora) {
			return day + "-" + month + "-" + year + " " + hora + ":" + minulos + ":" + seg;
		} else {
			return [year, month, day].join('-');
		}

	}

	addZero(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}


	public fechaInicial(hoy: Date) {
		hoy = (hoy == null ? new Date() : hoy);
		hoy.setHours(0);
		hoy.setMinutes(0);
		hoy.setSeconds(0);
		return hoy;
	}

	public fechaIniBusqueda(fecha: string) {
		let date = fecha.split("-")
		let ano = date[0];
		let mes = date[1];
		let dia = date[2];
		fecha = [ano, mes, dia].join('-') + " 0:00:00";
		console.log(fecha);
		return fecha;
	}

	public fechaFinBusqueda(fecha: string) {
		let date = fecha.split("-")
		let ano = date[0];
		let mes = date[1];
		let dia = date[2];
		fecha = [ano, mes, dia].join('-') + " 23:59:59";
		console.log(fecha);
		return fecha;
	}

	public fechaIniBusquedaDate(d2: Date) {
		let d = new Date(d2);
		let month = '' + (d.getMonth() + 1);
		let day = '' + (d.getDate());
		let year = "" + d.getFullYear();
		if (month.length < 2)
			month = '0' + month;
		if (day.length < 2)
			day = '0' + day;
		let fecha = [year, month, day].join('-') + " 0:00:00";
		console.log(fecha);
		return fecha;
	}

	public fechaFinBusquedaDate(d2: Date) {
		let d = new Date(d2);
		let month = '' + (d.getMonth() + 1);
		let day = '' + (d.getDate());
		let year = "" + d.getFullYear();
		if (month.length < 2)
			month = '0' + month;
		if (day.length < 2)
			day = '0' + day;
		let fecha = [year, month, day].join('-') + " 23:59:59";
		console.log(fecha);
		return fecha;
	}


	public fechaInicial1(hoy: string) {
		console.log(hoy)
		let hoy1: Date = new Date(hoy);
		hoy1.setHours(0);
		hoy1.setMinutes(0);
		hoy1.setSeconds(0);
		return hoy1;
	}

	public fechaFinal(hoy: Date) {
		hoy = (hoy == null ? new Date() : hoy);
		hoy.setHours(23);
		hoy.setMinutes(59);
		hoy.setSeconds(59);
		return hoy;
	}

	public fechaFinal1(hoy: string) {
		let hoy1 = new Date(hoy);
		hoy1.setHours(23);
		hoy1.setMinutes(59);
		hoy1.setSeconds(59);
		return hoy1;
	}



	public validarPromo(ps: ProductoModel, cantidad: number) {
		console.log("valida promocion");
		let valido: boolean = true;
		if (ps.promo == null) {
			valido = false;
			return valido;
		}
		if (ps.promo != 1) {
			valido = false;
			return valido;
		}
		if (ps.kg_promo == null) {
			valido = false;
			return valido;
		} else {
			let can = cantidad == null ? 0.0 : cantidad;
			console.log(ps.kg_promo+":"+Number(can));
			if (ps.kg_promo > Number(can)) {
				valido = false;
				return valido;
			}
		}
		return valido;
	}

	public ordenar(productos: Array<DocumentoDetalleModel>) {
		let temp: Array<DocumentoDetalleModel> = [];
		for (let ddV of productos) {
			if (ddV.varios == 1) {
				temp.push(ddV);
			}
		}
		for (let ddV of productos) {
			let existe1 = temp.find(existe => existe.documento_detalle_id == ddV.documento_detalle_id);
			if (existe1 == undefined) {
				temp.push(ddV);
			}
		}
		return temp;
	}

	public calcularExcento(doc: DocumentoModel, productos: Array<DocumentoDetalleModel>) {
		let totalReal: number = 0.0;
		let exectoReal: number = 0.0;
		let gravado: number = 0.0;
		let ivatotal: number = 0.0;
		let peso: number = 0.0;
		let iva5: number = 0.0;
		let iva19: number = 0.0;
		let base5: number = 0.0;
		let base19: number = 0.0;
		let costoTotal: number = 0.0;
		// aqui voy toca poner a sumar las variables nuebas para que se reflejen
		// en el info diario
		for (var i = 0; i < productos.length; i++) {
			let costoPublico: number = productos[i].parcial;
			let costo = productos[i].costo_producto * productos[i].cantidad;
			var iva1 = productos[i].impuesto_producto / 100.0;
			let peso1 = productos[i].peso_producto;
			peso1 = peso1 * productos[i].cantidad;
			totalReal = Number(totalReal) + Number(costoPublico);
			costoTotal = costoTotal + costo;
			let temp: number = 0;
			ivatotal = ivatotal + ((costoPublico / (1 + iva1)) * iva1);
			peso = peso + peso1;
			// si es iva del 19 se agrega al documento junto con la base
			if (iva1 == 0.19) {
				iva19 = iva19 + ((costoPublico / (1 + iva1)) * iva1);
				base19 = base19 + (costoPublico / (1 + iva1));
			}
			// si es iva del 5 se agrega al documento junto con la base
			if (iva1 == 0.05) {
				iva5 = iva5 + ((costoPublico / (1 + iva1)) * iva1);
				base5 = base5 + (costoPublico / (1 + iva1));
			}
			if (iva1 > 0.0) {
				temp = costoPublico / (1 + iva1);
				gravado += temp;
			} else {
				temp = Number(costoPublico);
				exectoReal = Number(exectoReal) + temp;
			}
		}
		doc.total = totalReal;
		doc.saldo = totalReal;
		doc.excento = exectoReal;
		doc.gravado = gravado;
		doc.iva = ivatotal;
		doc.peso_total = peso;
		doc.iva_5 = iva5;
		doc.iva_19 = iva19;
		doc.base_5 = base5;
		doc.base_19 = base19;
		doc.total_costo = costoTotal;
		return doc;
	}

	public centrarDescripcion(nombre: string, maxTamanoNombre: number) {
		console.log(nombre);
		let tamanoNombre: number = nombre.length;
		let espacio: string = "";
		if (maxTamanoNombre < tamanoNombre) {
			return nombre;
		}
		let tamanoEspacio: number = (maxTamanoNombre - tamanoNombre) / 2;
		if (tamanoNombre != 0) {
			for (var j = 0; j < tamanoEspacio; j++) {
				espacio += " ";
			}
		}
		nombre = espacio + nombre;
		return nombre;
	}

	public cortarDescripcion(nombre: string, maxTamanoNombre: number) {
		let unit: string = "";
		nombre = (nombre == undefined ? "" : nombre);
		let tamañoCantidad: number = (nombre == undefined ? 0 : nombre.length);
		if (tamañoCantidad > maxTamanoNombre) {
			unit = nombre.trim().substring(0, maxTamanoNombre);
		} else {
			unit = nombre.trim();
			for (var j = tamañoCantidad; j < maxTamanoNombre; j++) {
				unit = unit + " ";
			}
		}
		return unit;
	}

	public cortarCantidades(cantidad: string, maxTamanoUnit: number) {
		let unit: string = "";
		let tamañoCantidad: number = cantidad.length;
		if (tamañoCantidad > maxTamanoUnit) {
			unit = unit.substring(0, maxTamanoUnit);
		} else {
			unit = cantidad;
			for (var j = tamañoCantidad; j < maxTamanoUnit; j++) {
				unit = " " + unit;
			}
		}
		return unit;
	}

	public crearOjb(empresa: EmpresaModel, docu: DocumentoMapModel, clientes: Array<ClienteModel>) {
		let enviado = new EnvioFacturacionElectronicaModel();
		enviado.key = AppConfigService.key_invoice;
		enviado.datajson = this.asignarDataJson(empresa, docu, clientes);
		return enviado;
	}

	private asignarDataJson(empresa: EmpresaModel, docu: DocumentoMapModel, clientes: Array<ClienteModel>) {
		let dataJson: DataJSONModel = new DataJSONModel();
		dataJson.nitEmpresa = empresa.nit;
		dataJson.facturas = this.asignarFacturas(docu, clientes);
		return dataJson;
	}

	private asignarFacturas(docu: DocumentoMapModel, clientes: Array<ClienteModel>) {
		let facturas: Array<FacturasModel> = [];
		let factura: FacturasModel = new FacturasModel();
		factura.dataCliente = this.asignarDataCliente(docu, clientes);
		factura.dataFactura = this.asignarDataFactura(docu);
		factura.dataFacturaTotales = this.dataFacturaTotales(docu);
		factura.dataImpuestos = this.asignarDataImpuestosFactura(docu);
		factura.dataDetalleFactura = this.asignarDetalles(docu);
		facturas.unshift(factura);
		return facturas;
	}

	asignarDetalles(docu: DocumentoMapModel) {
		let dataDetalleFactura: Array<DataDetalleFacturaModel> = [];
		for (let detalle of docu.documentoDetalle) {
			let impuesto: number = Number(detalle.impuesto_producto) / 100;
			let datadetalle: DataDetalleFacturaModel = new DataDetalleFacturaModel();
			datadetalle.cantidad = "" + detalle.cantidad;
			datadetalle.codigoProducto = "" + detalle.producto_id;
			datadetalle.nombreProducto = detalle.descripcion;
			datadetalle.precio = "" + detalle.unitario;
			datadetalle.subtotal = "" + (detalle.parcial / (1 + impuesto))
			datadetalle.impuestos = this.dataDataImpuestosDetalle(detalle);
			datadetalle.descuentos = this.dataDescuentosDetalle(detalle);
			datadetalle.totalDescuentos = "0"// agregar descuetos al detalle
			datadetalle.totalImpuestos = "" + (detalle.parcial / (1 + impuesto)) * impuesto;
			dataDetalleFactura.unshift(datadetalle);
		}
		return dataDetalleFactura;
	}

	dataDescuentosDetalle(detalle: DocumentoDetalleModel) {
		let datadescuentos: Array<DataDescuentosModel> = [];
		let datadescuento: DataDescuentosModel = new DataDescuentosModel();
		datadescuento.allowance_charge_reason = "DESCUENTO GENERAL";
		datadescuento.amount = "0";
		datadescuento.base_amount = "" + detalle.unitario;
		datadescuento.charge_indicator = "false";
		datadescuento.multiplier_factor_numeric = "0"
		datadescuentos.unshift(datadescuento);
		return datadescuentos;
	}

	dataDataImpuestosDetalle(detalle: DocumentoDetalleModel) {
		let impuesto: number = Number(detalle.impuesto_producto) / 100;
		let dataImpuestos: Array<DataImpuestosDetalleModel> = [];
		let iva: DataImpuestosDetalleModel = new DataImpuestosDetalleModel();
		iva.codigoImpuesto = "01";
		iva.nombreImpuesto = "IVA";
		iva.porcentajeImpuesto = "" + detalle.impuesto_producto;
		iva.valorImpuestoCalculado = "" + (detalle.parcial / (1 + impuesto)) * impuesto;
		dataImpuestos.unshift(iva);
		return dataImpuestos;
	}

	asignarDataImpuestosFactura(docu: DocumentoMapModel) {
		let dataImpuestos: Array<DataImpuestosModel> = [];
		if (docu.documento.iva_5 > 0) {
			let iva5: DataImpuestosModel = new DataImpuestosModel();
			iva5.codigoImpuesto = "01";
			iva5.nombreImpuesto = "IVA";
			iva5.porcentajeImpuesto = "5.00";
			iva5.valorImpuestoCalculado = "" + docu.documento.iva_5;
			iva5.subtotalBase = "" + docu.documento.base_5
			dataImpuestos.unshift(iva5);
		}

		if (docu.documento.iva_19 > 0) {
			let iva19: DataImpuestosModel = new DataImpuestosModel();
			iva19.codigoImpuesto = "01";
			iva19.nombreImpuesto = "IVA";
			iva19.porcentajeImpuesto = "19.00";
			iva19.valorImpuestoCalculado = "" + docu.documento.iva_19;
			iva19.subtotalBase = "" + docu.documento.base_19
			dataImpuestos.unshift(iva19);
		}

		if (docu.documento.excento > 0) {
			let exento: DataImpuestosModel = new DataImpuestosModel();
			exento.codigoImpuesto = "01";
			exento.nombreImpuesto = "IVA";
			exento.porcentajeImpuesto = "0.00";
			exento.valorImpuestoCalculado = "0.00";
			exento.subtotalBase = "" + docu.documento.excento;
			dataImpuestos.unshift(exento);
		}


		return dataImpuestos;
	}

	dataFacturaTotales(docu: DocumentoMapModel) {
		let dataFacturaTotales: DataFacturaTotalesModel = new DataFacturaTotalesModel();
		dataFacturaTotales.descuentos = "" + docu.documento.descuento;
		dataFacturaTotales.subtotal = "" + (Number(docu.documento.base_19) + Number(docu.documento.base_5) + Number(docu.documento.excento));
		dataFacturaTotales.totalApagar = "" + docu.documento.total;
		dataFacturaTotales.totalImpuestos = "" + (docu.documento.iva == null ? (Number(docu.documento.iva_5) + Number(docu.documento.iva_19)) : docu.documento.iva);
		return dataFacturaTotales;
	}

	asignarDataFactura(docu: DocumentoMapModel) {
		let dataFactura: DataFacturaModel = new DataFacturaModel();
		dataFactura.codigoFactura = docu.documento.consecutivo_dian;
		dataFactura.descripcionCorrecion = ""
		dataFactura.sssueDate = this.formatDate(docu.documento.fecha_registro, false);
		dataFactura.issueTime = this.formatTime(docu.documento.fecha_registro);
		switch (docu.documento.tipo_documento_id) {
			case 10:
				dataFactura.invoiceTypeCode = "01";
				break;
			case 12:
				dataFactura.invoiceTypeCode = "91";
				dataFactura.tipoCorreccion = "3";
				dataFactura.codigoNota = docu.documento.documento_id;
				dataFactura.descripcionCorrecion = docu.documento.descripcion_trabajador;
				break;
			case 13:
				dataFactura.invoiceTypeCode = "92";
				dataFactura.tipoCorreccion = "3";
				dataFactura.codigoNota = docu.documento.documento_id;
				dataFactura.descripcionCorrecion = docu.documento.descripcion_trabajador;
				break;
			default:
				break;
		}
		dataFactura.metodoDePago = "1";
		dataFactura.formaDePago = "10";
		dataFactura.paymentDueDate = "0000-00-00";// si es a credito mando esta fecha  
		return dataFactura;
	}

	asignarDataCliente(docu: DocumentoMapModel, clientes: Array<ClienteModel>) {
		let datacliente: DataClienteModel = new DataClienteModel();
		let cliente = clientes.find(client => client.cliente_id === docu.documento.cliente_id);
		datacliente.additionalAccountIDCliente = "" + cliente.fact_tipo_empresa_id;//+ cliente.cliente_id; //tipo empresa juridica
		datacliente.codigoTipoIdentificacionCliete = "13"; //TO DO cambiar por los valores que de ever
		datacliente.identificacionCliente = cliente.documento;
		datacliente.nombreCliente = cliente.nombre + " " + cliente.apellidos+ " "+cliente.razon_social;
		datacliente.codigoMunicipioCliente = "11001";
		datacliente.direccionCliente = cliente.direccion;
		datacliente.telefonoCliente = cliente.celular == "" ? cliente.fijo : cliente.celular;
		datacliente.emailCliente = cliente.mail;
		return datacliente;
	}

}
