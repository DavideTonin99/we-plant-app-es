
export class StartEndPoint {

  lat: number;
  lon: number;
  poiId: string;
  visitId: number;


  constructor(lat: number, lon: number, poiId: string, visitId: number) {
    this.lat = lat;
    this.lon = lon;
    this.poiId = poiId;
    this.visitId = visitId;
  }
}
