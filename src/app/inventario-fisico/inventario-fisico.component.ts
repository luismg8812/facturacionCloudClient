import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { ProductoModel } from '../model/producto.model';
import { GrupoModel } from '../model/grupo.model';
import { SubGrupoModel } from '../model/subGrupo.model';
import { ProductoPreciosModel } from '../model/productoPrecios.model';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-inventario-fisico',
  templateUrl: './inventario-fisico.component.html',
  styleUrls: ['./inventario-fisico.component.css']
})
export class InventarioFisicoComponent implements OnInit {

  public empresaId: number;
  public productosAll: Array<ProductoModel>;
  public productosCargar: Array<ProductoModel> = [];
  public grupoList: Array<GrupoModel>;
  public subGrupoList: Array<SubGrupoModel>;
  
  public proveedorList: Array<any>;
  public marcaList: Array<any>;
  public indexModificarSelect: number = 0;
  public productoEliminar: ProductoModel;
  public productoNew: ProductoModel = new ProductoModel();
  public productoPrecioNew:ProductoPreciosModel=new ProductoPreciosModel();
  public grupoNew: GrupoModel = new GrupoModel();
  public subGrupoNew: SubGrupoModel = new SubGrupoModel();
  @ViewChild("downloadZipLink") downloadZipLink: ElementRef;

  public totalRegistros: number = 0;
  public registrosNuevosCargados: number = 0;
  public registrosNuevosActualizados: number = 0;
  public registrosActualizados: number = 0;
  public registrosErroneos: number = 0;
  public separador: string = ';';

  public mensaje: string = "";
  public texto = [];

  constructor(public productoService: ProductoService) { }

  ngOnInit() {
    this.empresaId = Number(localStorage.getItem("empresa_id"));
    this.getProductosByEmpresa(this.empresaId);
    this.getGrupos();
    this.getSubGrupos();

  }

  editarGrupo(grupo: GrupoModel) {
    this.grupoNew = grupo;
  }

  editarSubGrupo(grupo: SubGrupoModel) {
    this.subGrupoNew = grupo;
  }

  

  CrearSubGrupo() {
    console.log(this.subGrupoNew);
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.subGrupoNew.nombre == "") {
      mensageError += "nombre\n";
      valido = false;
    }
    if (valido == false) {
      alert(mensageError);
      return;
    }
    if (this.subGrupoNew.sub_grupo_id == null) {
      this.subGrupoNew.empresa_id = this.empresaId;
      this.productoService.saveSubGrupo(this.subGrupoNew).subscribe(res => {
        if (res.code == 200) {
          this.subGrupoNew = new SubGrupoModel();
          $('#crearSubGrupoNewModal').modal('hide');
          this.getSubGrupos();
        } else {
          alert("error creando grupo, por favor inicie nuevamente la creación del producto, si persiste consulte a su proveedor");
          return;
        }
      });
    } else {
      this.productoService.updateSubGrupo(this.subGrupoNew).subscribe(res => {
        if (res.code == 200) {
          this.subGrupoNew = new SubGrupoModel();
          $('#crearSubGrupoNewModal').modal('hide');
          this.getSubGrupos();
        } else {
          alert("error creando grupo, por favor inicie nuevamente la creación del producto, si persiste consulte a su proveedor");
          return;
        }
      });
    }
  }

  CrearGrupo() {
    console.log(this.grupoNew);
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.grupoNew.nombre == "") {
      mensageError += "nombre\n";
      valido = false;
    }
    if (valido == false) {
      alert(mensageError);
      return;
    }
    if (this.grupoNew.grupo_id == null) {
      this.grupoNew.empresa_id = this.empresaId;
      this.productoService.saveGrupo(this.grupoNew).subscribe(res => {
        if (res.code == 200) {
          this.grupoNew = new GrupoModel();
          $('#crearGrupoNewModal').modal('hide');
          this.getGrupos();
        } else {
          alert("error creando grupo, por favor inicie nuevamente la creación del producto, si persiste consulte a su proveedor");
          return;
        }
      });
    } else {
      this.productoService.updateGrupo(this.grupoNew).subscribe(res => {
        if (res.code == 200) {
          this.grupoNew = new GrupoModel();
          $('#crearGrupoNewModal').modal('hide');
          this.getGrupos();
        } else {
          alert("error creando grupo, por favor inicie nuevamente la creación del producto, si persiste consulte a su proveedor");
          return;
        }
      });
    }


  }

  exportTableToExcel() {
    let filename = "plantilla_cargue";
    var dataType = 'application/vnd.ms-excel';
    var texto = [];
    let tamanoMax: number = 40;
    texto.push("producto_id;grupo_id;nombre_grupo;marca_id;nombre_marca;,granel;estado;nombre" +
      ";proveedor_id;nombre_proveedor;costo;costo_publico;impuesto;codigo_barras;peso" +
      ";balanza;cantidad\n");
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

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(this.separador);
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  uploadListener($event: any) {
    this.texto = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {
      console.log("si es csv");
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow);
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Formato del archivo invalido, los formatos permitidos son: .csv");
      //this.fileReset();  
      return;

    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {

    this.totalRegistros = csvRecordsArray.length - 2;
    this.registrosNuevosCargados = 0;
    this.registrosNuevosActualizados = 0;
    this.registrosActualizados = 0;
    this.registrosErroneos = 0;
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord: string = csvRecordsArray[i].split(this.separador);
      if (curruntRecord.length == Number(headerLength.length)) {
        let valido: boolean = true;
        let producto: ProductoModel = new ProductoModel();
        //deben hacerse las validaciones de los datos entrantes
        //validacion id
        console.log("aqui entra");
        let id = curruntRecord[0].trim()
        let grupo= curruntRecord[1].trim();
        let estado= curruntRecord[6].trim();
        let nombre = curruntRecord[7].trim();
        let costo = curruntRecord[9].trim();
        let costoPublico = curruntRecord[10].trim();
        let impuesto = curruntRecord[11].trim();
        let codigoBarras = curruntRecord[12].trim();
        let peso = curruntRecord[13].trim();
        let granel = curruntRecord[14].trim();
        let balanza = curruntRecord[15].trim();
        let cantidad = curruntRecord[16].trim();
        if (id != "") {
          if (isNaN(Number(id))) {
            this.texto.push("Error en la linea " + i + " El campo " + headerLength[0] + " no es numerico" + '\n');
            valido = false;
          }
          let produc = this.productosAll.find(productof => productof.producto_id.toString()  == id);
          if(produc==undefined){
            this.texto.push("Error en la linea " + i + " El id " + id  + ' no existe\n');
            valido = false;
          }else{
            producto=produc;
          }
        }

        let grup = this.grupoList.find(grupos => grupos.grupo_id.toString()  == grupo);
        if(grup==undefined){
          this.texto.push("Error en la linea " + i + " El grupo '" + grupo  + "' no existe\n");
          valido = false;
        }
        if(estado==""){
          this.texto.push("Error en la linea " + i + " El campo " + headerLength[6]  + " es obligatorio" + '\n');
          valido = false;
        }else{
          if(!(estado=="1" || estado=="0")){
            this.texto.push("Error en la linea " + i + " El campo " + headerLength[6]  + " debe ser '1' o '0'" + '\n');
            valido = false;
          }
        }
        if(nombre==""){
          this.texto.push("Error en la linea " + i + " El campo " + headerLength[7]  + " es obligatorio" + '\n');
          valido = false;
        }
        if (costo != "") {
          if (isNaN(Number(costo))) {
            this.texto.push("Error en la linea " + i + " El campo " + headerLength[11] + " no es numerico" + '\n');
            valido = false;
          }
        }
        if (costoPublico != "") {
          if (isNaN(Number(costoPublico))) {
            this.texto.push("Error en la linea " + i + " El campo " + headerLength[12] + " no es numerico" + '\n');
            valido = false;
          }
        }
        if (impuesto != "") {
          if (isNaN(Number(impuesto))) {
            this.texto.push("Error en la linea " + i + " El campo " + headerLength[13] + " no es numerico" + '\n');
            valido = false;
          }
        }
        if (cantidad != "") {
          if (isNaN(Number(cantidad))) {
            this.texto.push("Error en la linea " + i + " El campo " + headerLength[17] + " no es numerico" + '\n');
            valido = false;
          }
        }else{
          this.texto.push("Error en la linea " + i + " El campo " + headerLength[17]  + " es obligatorio" + '\n');
          valido = false;
          
        } 
        if (valido) {
          producto.producto_id = Number(id);
          producto.estado=Number(estado);
          producto.grupo_id=grupo;
          producto.nombre = nombre;
          producto.costo = Number(costo);
          producto.costo_publico = Number(costoPublico);
          producto.impuesto = Number(impuesto);
          producto.codigo_barras = codigoBarras;
          producto.peso=peso==""?0:Number(peso);
          producto.granel=granel==""?0:Number(granel);
          producto.balanza=balanza==""?0:Number(balanza);
          
          //csvRecord.firstName = curruntRecord[1].trim();  
          //csvRecord.lastName = curruntRecord[2].trim();  
          //csvRecord.age = curruntRecord[3].trim();  
          //csvRecord.position = curruntRecord[4].trim();  
          //csvRecord.mobile = curruntRecord[5].trim();  
          this.productosCargar.push(producto);
          if (id == "") {
            this.registrosNuevosCargados = this.registrosNuevosCargados + 1
          } else {
            this.registrosActualizados = this.registrosActualizados + 1
          }

        } else {
          console.log(this.texto);
          this.registrosErroneos = this.registrosErroneos + 1
        }

      }
      else {
        //error de que no tiene las mismas columnas
      }

    }

  }

  descargarDetalle() {

    var blob = new Blob(this.texto, {
      type: 'text/plain'
    });
    this.descargarArchivo(blob, "detalle.txt")
  }

  cargarArchivo() {
    if ($('#fotoRepuesto')[0].files[0] == undefined) {
      alert("El archivo de cargue es obligatorio");
      return;
    }
    $('#cargueMasivoModal').modal('hide');
    for (let pro of this.productosCargar) {
      if(pro.producto_id==0){
        pro.empresa_id = this.empresaId;
      this.productoService.saveProducto(pro).subscribe(res => {
        if (res.code == 200) {
          this.productoService.getProductosByEmpresa(this.empresaId.toString()).subscribe(async res => {
            this.productosAll = res;
            await this.delay(100);
            this.posInicial();
          });
        } else {
          alert("error creando producto, por favor inicie nuevamente la creación del producto, si persiste consulte a su proveedor");
          return;
        }
      });
      }else{
        this.productoService.updateProducto(pro).subscribe(async res => {
          if (res.code == 200) {
    
          } else {
            alert("error actualizando la cantidad del producto en el inventario, pero el documento es correcto");
            return;
          }
        });
      }
      
    }
    console.log(this.productosCargar);

  }

  CrearProducto() {
    console.log(this.productoNew);
    let valido: boolean = true;
    let mensageError: string = "Son obligatorios:\n ";
    if (this.productoNew.nombre == "") {
      mensageError += "nombre\n";
      valido = false;
    }
    if (valido == false) {
      alert(mensageError);
      return;
    }

    this.productoNew.empresa_id = this.empresaId;
    this.productoService.saveProducto(this.productoNew).subscribe(res => {
      if (res.code == 200) {
        this.productoNew = new ProductoModel();
        $('#crearProductoModal').modal('hide');
        this.productoService.getProductosByEmpresa(this.empresaId.toString()).subscribe(async res => {
          this.productosAll = res;
          await this.delay(100);
          this.posInicial();
        });
        this.productoPrecioNew.producto_id=res.producto_id;
        this.productoService.saveProductoPrecios(this.productoPrecioNew).subscribe();
      } else {
        alert("error creando producto, por favor inicie nuevamente la creación del producto, si persiste consulte a su proveedor");
        return;
      }
    });

  }

  limpiar() {
    this.productoNew = new ProductoModel();
  }

  limpiarGrupo() {
    this.grupoNew = new GrupoModel();
  }

  limpiarSubGrupo() {
    this.subGrupoNew = new SubGrupoModel();
  }


  getGrupos() {
    this.productoService.getGruposByEmpresa(this.empresaId.toString()).subscribe(async res => {
      this.grupoList = res;
    });
  }

  getSubGrupos() {
    this.productoService.getSubGruposByEmpresa(this.empresaId.toString()).subscribe(async res => {
      this.subGrupoList = res;
    });
  }

  cambioPrecioLista(producto: ProductoModel, element) {
    console.log(element.value);

    this.mensaje = "Producto Editado: " + producto.nombre + " valor actual: " + element.value;
    if (element.id.substr(0, 7) == 'nombre_') {
      this.mensaje = this.mensaje.replace("valor", "nombre");
      this.mensaje = this.mensaje + " nombre anterior: " + producto.nombre;
      console.log(producto.nombre);
      producto.nombre = element.value;
    }
    if (element.id.substr(0, 9) == 'cantidad_') {
      this.mensaje = this.mensaje.replace("valor", "cantidad");
      this.mensaje = this.mensaje + " cantidad anterior: " + producto.cantidad;
      producto.cantidad = element.value;
    }
    if (element.id.substr(0, 6) == 'costo_') {
      this.mensaje = this.mensaje.replace("valor", "costo");
      this.mensaje = this.mensaje + " costo anterior: " + producto.costo;
      producto.costo = element.value;
    }
    if (element.id.substr(0, 8) == 'publico_') {
      this.mensaje = this.mensaje.replace("valor", "costo publico");
      this.mensaje = this.mensaje + " costo publico anterior: " + producto.costo_publico;
      producto.costo_publico = element.value;
    }
    if (element.id.substr(0, 9) == 'impuesto_') {
      this.mensaje = this.mensaje.replace("valor", "impuesto");
      this.mensaje = this.mensaje + " impuesto anterior: " + producto.impuesto;
      console.log(producto.impuesto);
      producto.impuesto = element.value;
    }
    if (element.id.substr(0, 8) == 'balanza_') {
      this.mensaje = this.mensaje.replace("valor", "balanza");
      this.mensaje = this.mensaje + " balanza anterior: " + producto.balanza;
      producto.balanza = element.value;
    }
    if (element.id.substr(0, 7) == 'barras_') {
      this.mensaje = this.mensaje.replace("valor", "codigo barras");
      this.mensaje = this.mensaje + " codigo barras anterior: " + producto.codigo_barras;
      producto.codigo_barras = element.value;
    }
    if (element.id.substr(0, 6) == 'promo_') {
      this.mensaje = this.mensaje.replace("valor", "promo");
      this.mensaje = this.mensaje + " promo anterior: " + producto.promo;
      producto.promo = element.value;
    }
    if (element.id.substr(0, 13) == 'public_promo_') {
      this.mensaje = this.mensaje.replace("valor", "publico promo");
      this.mensaje = this.mensaje + " publico promo anterior: " + producto.pub_promo;
      producto.pub_promo = element.value;
    }
    if (element.id.substr(0, 8) == 'kg_promo') {
      this.mensaje = this.mensaje.replace("valor", "kg_promo");
      this.mensaje = this.mensaje + " kg_promo anterior: " + producto.kg_promo;
      producto.kg_promo = element.value;
    }
    this.productoService.updateProducto(producto).subscribe(async res => {
      if (res.code == 200) {

      } else {
        alert("error actualizando la cantidad del producto en el inventario, pero el documento es correcto");
        return;
      }
    });
  }

  seleccionarEliminarItem(producto: ProductoModel) {
    this.productoEliminar = producto;
    this.productoService.inactivar(producto).subscribe(async res => {
      this.productoService.getProductosByEmpresa(this.empresaId.toString()).subscribe(async res => {
        this.productosAll = res;
        await this.delay(100);
        this.posInicial();
      });
    });
  }



  indexFocus(producto: ProductoModel) {
    for (var i = 0; i < this.productosAll.length; i++) {
      if (this.productosAll[i].producto_id ==
        producto.producto_id) {
        this.indexModificarSelect = i;
        break;
      }
    }
  }


  getProductosByEmpresa(empresaId: number) {
    this.productoService.getProductosByEmpresa(empresaId.toString()).subscribe(async res => {
      this.productosAll = res;
      await this.delay(100);
      this.posInicial();
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  posInicial() {
    $("#nombre_" + this.productosAll[0].producto_id).focus();
    console.log("#nombre_" + this.productosAll[0].producto_id);
    $("#nombre_" + this.productosAll[0].producto_id).select();
  }

  validar(prefix: string) {
    if (this.productosAll.length > (this.indexModificarSelect + 1)) {
      this.indexModificarSelect = this.indexModificarSelect + 1;
      let idModificarSelect = prefix + this.productosAll[this.indexModificarSelect].producto_id;
      $("#" + idModificarSelect).focus();
      $("#" + idModificarSelect).select();

    }
  }

  validarBajar(prefix: string) {
    if (0 < this.indexModificarSelect) {
      this.indexModificarSelect = this.indexModificarSelect - 1;
      let idModificarSelect = prefix + this.productosAll[this.indexModificarSelect].producto_id;
      $("#" + idModificarSelect).focus();
      $("#" + idModificarSelect).select();
    }
  }

  validarDerecha(prefix: string) {
    let idModificarSelect = prefix + this.productosAll[this.indexModificarSelect].producto_id;
    $("#" + idModificarSelect).focus();
    $("#" + idModificarSelect).select();
  }

  controlTeclas(event, element) {
    // this.mensaje="";
    if (event.keyCode == 40) { //cuando se presiona la tacla abajo
      console.log(element.id.substr(0, 14));
      if (element.id.substr(0, 7) == 'borrar_') {
        if (this.productosAll.length > (this.indexModificarSelect + 1)) {
          this.indexModificarSelect = this.indexModificarSelect + 1;
          let idModificarSelect = "borrar_" + this.productosAll[this.indexModificarSelect].producto_id;
          $("#" + idModificarSelect).focus();
        }
      }
      if (element.id.substr(0, 7) == 'nombre_') {
        this.validar('nombre_');
        return;
      }
      if (element.id.substr(0, 9) == 'cantidad_') {
        this.validar('cantidad_');
        return;
      }
      if (element.id.substr(0, 6) == 'costo_') {
        this.validar('costo_');
        return;
      }
      if (element.id.substr(0, 8) == 'publico_') {
        this.validar('publico_');
        return;
      }
      if (element.id.substr(0, 9) == 'impuesto_') {
        this.validar('impuesto_');
        return;
      }
      if (element.id.substr(0, 8) == 'balanza_') {
        this.validar('balanza_');
        return;
      }
      if (element.id.substr(0, 7) == 'barras_') {
        this.validar('barras_');
        return;
      }
      if (element.id.substr(0, 6) == 'promo_') {
        this.validar('promo_');
        return;
      }
      if (element.id.substr(0, 13) == 'public_promo_') {
        this.validar('public_promo_');
        return;
      }
      if (element.id.substr(0, 8) == 'kg_promo') {
        this.validar('kg_promo');
        return;
      }

    }
    if (event.keyCode == 38) { //cuando se presiona la tacla arriba
      if (element.id.substr(0, 7) == 'borrar_') {
        this.validarBajar('borrar_');
        return;
      }
      if (element.id.substr(0, 7) == 'nombre_') {
        this.validarBajar('nombre_');
        return;
      }
      if (element.id.substr(0, 9) == 'cantidad_') {
        this.validarBajar('cantidad_');
        return;
      }
      if (element.id.substr(0, 6) == 'costo_') {
        this.validarBajar('costo_');
        return;
      }
      if (element.id.substr(0, 8) == 'publico_') {
        this.validarBajar('publico_');
        return;
      }
      if (element.id.substr(0, 9) == 'impuesto_') {
        this.validarBajar('impuesto_');
        return;
      }
      if (element.id.substr(0, 8) == 'balanza_') {
        this.validarBajar('balanza_');
        return;
      }
      if (element.id.substr(0, 7) == 'barras_') {
        this.validarBajar('barras_');
        return;
      }
      if (element.id.substr(0, 6) == 'promo_') {
        this.validarBajar('promo_');
        return;
      }
      if (element.id.substr(0, 13) == 'public_promo_') {
        this.validarBajar('public_promo_');
        return;
      }
      if (element.id.substr(0, 8) == 'kg_promo') {
        this.validarBajar('kg_promo');
        return;
      }
    }
    if (event.keyCode == 39) { //cuando se presiona la tacla derecha
      if (element.id.substr(0, 7) == 'borrar_') {
        this.validarDerecha('nombre_');
        return;
      }
      if (element.id.substr(0, 7) == 'nombre_') {
        this.validarDerecha('cantidad_');
        return;
      }
      if (element.id.substr(0, 9) == 'cantidad_') {
        this.validarDerecha('costo_');
        return;
      }
      if (element.id.substr(0, 6) == 'costo_') {
        this.validarDerecha('publico_');
        return;
      }
      if (element.id.substr(0, 8) == 'publico_') {
        this.validarDerecha('impuesto_');
        return;
      }
      if (element.id.substr(0, 9) == 'impuesto_') {
        this.validarDerecha('balanza_');
        return;
      }
      if (element.id.substr(0, 8) == 'balanza_') {
        this.validarDerecha('barras_');
        return;
      }
      if (element.id.substr(0, 7) == 'barras_') {
        this.validarDerecha('promo_');
        return;
      }
      if (element.id.substr(0, 6) == 'promo_') {
        this.validarDerecha('public_promo_');
        return;
      }
      if (element.id.substr(0, 13) == 'public_promo_') {
        this.validarDerecha('kg_promo');
        return;
      }
    }
    if (event.keyCode == 37) { //cuando se presiona la tacla izq
      console.log(element.id);
      if (element.id.substr(0, 7) == 'nombre_') {
        this.validarDerecha('borrar_');
        return;
      }
      if (element.id.substr(0, 9) == 'cantidad_') {
        this.validarDerecha('nombre_');
        return;
      }
      if (element.id.substr(0, 6) == 'costo_') {
        this.validarDerecha('cantidad_');
        return;
      }
      if (element.id.substr(0, 8) == 'publico_') {
        this.validarDerecha('costo_');
        return;
      }
      if (element.id.substr(0, 9) == 'impuesto_') {
        this.validarDerecha('publico_');
        return;
      }
      if (element.id.substr(0, 8) == 'balanza_') {
        this.validarDerecha('impuesto_');
        return;
      }
      if (element.id.substr(0, 7) == 'barras_') {
        this.validarDerecha('balanza_');
        return;
      }
      if (element.id.substr(0, 6) == 'promo_') {
        this.validarDerecha('barras_');
        return;
      }
      if (element.id.substr(0, 13) == 'public_promo_') {
        this.validarDerecha('promo_');
        return;
      }
      if (element.id.substr(0, 8) == 'kg_promo') {
        this.validarDerecha('public_promo_');
        return;
      }
    }

  }

}
