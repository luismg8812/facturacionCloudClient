import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(public afauth: AngularFireAuth,private router: Router) { }

  ngOnInit() {
   this.observador();
  }

  public cerrarSesision() {
    this.afauth.auth.signOut().then(function () {
      
  
     console.log("session cerrada");
    }).catch(function (error) {
      console.log("error cerrando sesssion");
    });
    sessionStorage.removeItem('userLogin');
  }

  public observador() {
    var user = sessionStorage.getItem('userLogin');
        if (user) {
         // this.router.navigate(['/menu']);
        } else {
          this.router.navigate(['/login']);
        }
   
  }

}
