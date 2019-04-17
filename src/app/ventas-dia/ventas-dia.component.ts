import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DocumentoModel } from '../model/documento.model';
import { UsuarioService } from '../services/usuario.service';
import { ActivacionModel } from '../model/activacion';
import { ClienteService } from '../services/cliente.service';
import { ClienteModel } from '../model/cliente.model';
import { ProductoService } from '../services/producto.service';
import { ProductoModel } from '../model/producto.model';
import { DocumentoDetalleVoModel } from '../model/documentoDetalleVo.model';

@Component({
  selector: 'app-ventas-dia',
  templateUrl: './ventas-dia.component.html',
  styleUrls: ['./ventas-dia.component.css']
})
export class VentasDiaComponent implements OnInit {

  @ViewChild("clientePV") clientePV: ElementRef;
  @ViewChild("tipoDocumentoPV") tipoDocumentoPV: ElementRef;
  @ViewChild("empleadoPV") empleadoPV: ElementRef;

  constructor(public usuarioService:UsuarioService, public clienteService:ClienteService,public productoService:ProductoService) {
    let  empresa_id:string = sessionStorage.getItem("empresa_id");
    
   }

  public document: DocumentoModel;
  public activaciones: Array<ActivacionModel>;
  public clientes: Array<ClienteModel>;
  public productosAll: Array<ProductoModel>;
  public clienteActivo: boolean = false;
  public guiaTransporteActivo: boolean = false;
  public clienteObligatorioActivo: boolean = false;
  public empreadoActivo: boolean = false;
  public codigoBarrasActivo: boolean = false;
  public descuentosActivo: boolean = false;
  public clienteSelect: string;
  public tipoDocumentSelect: string;
  private empleadoSelect: string;
  private productoSelect: string;
  private productos: Array<DocumentoDetalleVoModel>;

  ngOnInit() {
    let  empresa_id:string = sessionStorage.getItem("empresa_id");
    //this.estadoDivBotones("d-block");
    //this.siguientePV.nativeElement.focus();
    //this.estadoDivProducto("d-none") // se muestra el div de producto
    //this.CodigoBarrasPV.nativeElement.classList.add("d-none");
    var userLogin = sessionStorage.getItem("usuario_id");
    this.getclientes(empresa_id);
    this.getActivaciones(userLogin);
    
    this.getProductosByEmpresa(empresa_id);
    this.clienteActivo = false;
    this.guiaTransporteActivo = false;
    this.clienteObligatorioActivo = false;
    this.empreadoActivo = false;
    this.codigoBarrasActivo = false;
    this.clienteSelect = "";
    this.tipoDocumentSelect = "";
    this.empleadoSelect = "";
    this.document = new DocumentoModel();
    this.productos = [];
  }

  enterTecla(element) {
  }

  scapeTecla(element) {
  }

  getActivaciones(user: string) {
    this.usuarioService.getActivacionByUsuario(user).subscribe(res => {
      this.activaciones = res;
    });
  }

  getclientes(empresaId:string) {
    this.clienteService.getClientesByEmpresa(empresaId).subscribe(res => {
      this.clientes = res;
      console.log(this.clientes);
    });
  }

  getProductosByEmpresa(empresaId:string) {
    this.productoService.getProductosByEmpresa(empresaId).subscribe(res => {
      this.productosAll = res;
      console.log(this.productosAll);
    });
  }
}
