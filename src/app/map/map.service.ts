import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  URL = 'https://api.waqi.info/mapq/bounds/?bounds=54.30049911593032,18.259277343750004,54.587979893849614,18.907470703125004&inc=placeholders&k=_2Y2EvHB9mHVodMydDSSJWXmpjdEU9LStXFkYzYg==&_=1553155197263';

  constructor(private http: HttpClient) { }

  fetchData(): Observable<any> {
    return this.http.get(this.URL);
    // return of('elkoo');
  }


}
