import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';
  pages: Array<{ title: string, component: string, icon: string }>;

  constructor(public platform: Platform) {
    this.pages = [
      { title: 'Estoque', component: 'HomePage', icon: 'home' },
      { title: 'Sair', component: 'LoginPage', icon: 'exit' }
    ];
  }

  openPage(page): void {
    this.nav.setRoot(page.component);
  }
}
