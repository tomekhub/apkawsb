import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapService } from './map.service';
import { AirStation } from './airStation.model';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

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
  querySubscription: Subscription;
  lat: number;
  lng: number;

  constructor(private mapService: MapService, private apollo: Apollo) {}

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      console.log(position);
    })
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: QueryAirStations
      })
      .valueChanges.subscribe(({ data }: {data: {wsb_air: AirStation[]}}) => {
        console.log(data.wsb_air);
        this.airStations = data.wsb_air;
      });
  }
  getColor(pm10: number) {
    if(pm10 < 50) { return 'green' }
    else if (pm10 < 200) { return 'orange' }
    else return 'red'
  }
  ngOnDestroy() {
    this.airStationsSub.unsubscribe();
    this.querySubscription.unsubscribe();
  }
}
