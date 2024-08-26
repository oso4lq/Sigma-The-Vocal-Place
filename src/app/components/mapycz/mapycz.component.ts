import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileJSON from 'ol/source/TileJSON';
import { fromLonLat } from 'ol/proj';
import Control from 'ol/control/Control';

@Component({
  selector: 'app-mapycz',
  standalone: true,
  imports: [],
  templateUrl: './mapycz.component.html',
  styleUrl: './mapycz.component.scss'
})
export class MapyczComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map!: Map;
  private readonly apiKey = 'f1Y41Hii6PjydSj-pb72qQeh7CeGorKmmZkiPmStogI';

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    // Initialize the map
    this.map = new Map({
      target: this.mapContainer.nativeElement,
      layers: [
        new TileLayer({
          source: new TileJSON({
            url: `https://api.mapy.cz/v1/maptiles/basic/tiles.json?apikey=${this.apiKey}`,
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([14.8981184, 49.8729317]), // Coordinates for the map center
        zoom: 16, // Initial zoom level
      }),
    });

    // Add the Mapy.cz logo control
    this.addLogoControl();
  }

  private addLogoControl(): void {
    const logoControl = new Control({
      element: this.createLogoElement(),
    });

    this.map.addControl(logoControl);
  }

  private createLogoElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'logocontrol ol-unselectable ol-control';
    element.innerHTML = '<a href="http://mapy.cz/" target="_blank"><img src="https://api.mapy.cz/img/api/logo.svg" alt="Mapy.cz"></a>';
    return element;
  }
}