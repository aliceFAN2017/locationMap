import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { icon, latLng, marker, tileLayer, circle } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  // layers
  LAYER_OCM = {
    id: 'opencyclemap',
    name: 'Open Cycle Map',
    enabled: true,
    layer: tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Open Cycle Map'
    })
  };

  LAYER_OSM = {
    id: 'openstreetmap',
    name: 'Open Street Map',
    enabled: false,
    layer: tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Open Street Map'
    })
  };

  // values binding to leaflet directives
  layersControlOptions = { position: 'bottomright'};
  baseLayers = {
    'Open Street Map': this.LAYER_OSM.layer,
    'Open Cycle Map': this.LAYER_OCM.layer
  };

  options = {
    zoom: 10,
    center: latLng(46.879966, -121.726909)
  };

  layersControl = {
    baseLayers: this.baseLayers,
    overlays: {}
  };

  searchLocation = "Washington DC";
  foundLocations: Object;
  zoom = this.options.zoom;
  latitude = this.options.center.lat;
  longitude = this.options.center.lng;

  constructor(private http: HttpClient) { }

  ngOnInit() {

  }

  zoomTo(): void {
    this.options.zoom =  this.zoom;
  }

  panTo(): void {
    this.options.center = latLng(this.latitude, this.longitude);
  }

  search(): void {
    this.http.get(`http://dev.virtualearth.net/REST/v1/Locations/US/${this.searchLocation}?key=AoM2ICOKcALZ_0d23UAqfY1iPtHldvCtIdMNOImk--jWnkfJLaDWXTFzwl984EBo`)
      .subscribe(data => this.foundLocations = data['resourceSets'][0]['resources']);
  }

  setMarker(lat, long): void {
    let layer = circle([ lat, long ], { radius: 3000 });
    let CM = {
      id: 'circlemarker',
      name: 'Circle Marker',
      enabled: true,
      layer: layer
    };
    let overlayLayers = {
      'Circle Marker': CM.layer
    };

    this.layersControl.overlays = overlayLayers;

    this.options.center = latLng(lat, long)
  }
}
