import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapService } from './map.service';
import { AirStation } from './airStation.model';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import * as geometry from 'spherical-geometry-js';
import { valueFromNode } from 'apollo-utilities';

const QueryAirStations = gql`
  query CurrentUserForProfile {
      wsb_air {
        pm10
        pm25
        temperature
        humidity
        id_air
        measurer {
          geom
        }
      }
  }
`;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  airStations: AirStation[];
  airStationsSub: Subscription;
  closestAirStation: AirStation;
  querySubscription: Subscription;
  lat: number;
  lng: number;
  panelOpen = false;


  constructor(private mapService: MapService, private apollo: Apollo) { }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: QueryAirStations
      })
      .valueChanges.subscribe(({ data }: { data: { wsb_air: AirStation[] } }) => {
        this.airStations = data.wsb_air.map((value: any) => ({
          ...value,
          distance: geometry.computeDistanceBetween(
            new geometry.LatLng(this.lat, this.lng),
            new geometry.LatLng(value.measurer.geom.coordinates[1], value.measurer.geom.coordinates[0])
          )
        }));
        this.findClosestAirStation(this.airStations);
      });
  }
  findClosestAirStation(airStations: AirStation[]) {
    this.closestAirStation = [...airStations].sort((a, b) => a.distance - b.distance)[0];
  }
  getColor(pm10: number) {
    if (pm10 < 50) {
      return 'green';
    } else if (pm10 < 200) {
      return 'orange';
    } else {
      return 'red';
    }
  }

  ngOnDestroy() {
    this.airStationsSub.unsubscribe();
    this.querySubscription.unsubscribe();
  }
}
