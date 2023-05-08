export interface Tags {
  name: string;
}

export interface Stop {
  id: number;
  poiId: string;
  reached: boolean;
  startTime?: any;
  endTime?: any;
  stopType: string;
  visitId: number;
  lat: number;
  lon: number;
  tags: Tags;
  _source: any;
}

export interface Tags2 {
  name: string;
}

export interface NextStop {
  id: number;
  poiId: string;
  reached: boolean;
  startTime?: any;
  endTime?: any;
  stopType: string;
  visitId: number;
  lat: number;
  lon: number;
  tags: Tags2;
}

export interface GeocodedWaypoint {
  geocoderStatus: string;
  partialMatch: boolean;
  placeId: string;
  types: string[];
}

export interface Distance {
  inMeters: number;
  humanReadable: string;
}

export interface Duration {
  inSeconds: number;
  humanReadable: string;
}

export interface StartLocation {
  lat: number;
  lng: number;
}

export interface EndLocation {
  lat: number;
  lng: number;
}

export interface Polyline {
  encodedPath: string;
}

export interface Step {
  htmlInstructions: string;
  distance: Distance;
  maneuver: string;
  duration: Duration;
  startLocation: StartLocation;
  endLocation: EndLocation;
  steps?: any;
  polyline: Polyline;
  travelMode: string;
  transitDetails?: any;
}

export interface Distance2 {
  inMeters: number;
  humanReadable: string;
}

export interface Duration2 {
  inSeconds: number;
  humanReadable: string;
}

export interface StartLocation2 {
  lat: number;
  lng: number;
}

export interface EndLocation2 {
  lat: number;
  lng: number;
}

export interface Leg {
  steps: Step[];
  distance: Distance2;
  duration: Duration2;
  durationInTraffic?: any;
  arrivalTime?: any;
  departureTime?: any;
  startLocation: StartLocation2;
  endLocation: EndLocation2;
  startAddress: string;
  endAddress: string;
}

export interface OverviewPolyline {
  encodedPath: string;
}

export interface Northeast {
  lat: number;
  lng: number;
}

export interface Southwest {
  lat: number;
  lng: number;
}

export interface Bounds {
  northeast: Northeast;
  southwest: Southwest;
}

export interface Route {
  summary: string;
  legs: Leg[];
  waypointOrder: number[];
  overviewPolyline: OverviewPolyline;
  bounds: Bounds;
  copyrights: string;
  fare?: any;
  warnings: string[];
}

export interface DirectionsResult {
  geocodedWaypoints: GeocodedWaypoint[];
  routes: Route[];
}

export class Visit {
  id: number;
  lastLat: number;
  lastLon: number;
  exitPoiId?: any;
  maxVisitTime: number;
  minutesToGo: number;
  startTime?: any;
  createdDate: Date;
  modifiedDate: Date;
  maxVisitLengthMeters: number;
  active: boolean;
  inProgress: boolean;
  difficulty: string;
  userId: number;
  stops: Stop[] = [];
  nextStop: NextStop;
  nextStopTime?: any;
  startPointId?: number;
  startPoint: Stop;
  endPoint: Stop;
  endPointId?: number;
  routeResponsePath?: any;
  timeMessage?: any;
  routeUrl: string;
  directionsResult: DirectionsResult;
  pois: any[];
}
