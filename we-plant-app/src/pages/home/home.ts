import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import "leaflet";
import "leaflet-edgebuffer";

declare var L: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: any;
  mapLayer: any;

  constructor(public navCtrl: NavController) {

  }


  ngAfterViewInit() {
    this.loadmap();
  }

  ionViewDidEnter() {

  }

  loadmap() {
    this.map = new L.map('map', {
      center: [45.44, 10.993],
      zoom: 15,
      minZoom: 8,
      maxZoom: 18
    });
    this.mapLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        edgeBufferTiles: 1
      });

    this.mapLayer.addTo(this.map);
  }
}
