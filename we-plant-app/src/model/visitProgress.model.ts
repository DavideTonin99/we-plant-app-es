import {Visit} from "./visit.model";

export class VisitProgressModel {

  percentage: number = 0;
  startPoint: boolean = false;
  endPoint: boolean = false;
  difficulty: boolean = false;
  maxLength: boolean = false;
  maxTime: boolean = false;
  stops: boolean = false;


  update(visit: Visit) {
    let trueNumber = 0;
    if (visit.stops.length >= 2) {
      this.stops = true;
      trueNumber++;
    }
    if (!!visit.maxVisitTime) {
      this.maxTime = true;
      trueNumber++;
    }
    if (!!visit.maxVisitLengthMeters) {
      this.maxLength = true;
      trueNumber++;
    }
    if (!!visit.startPointId) {
      this.startPoint = true;
      trueNumber++;
    }
    if (!!visit.endPointId) {
      this.endPoint = true;
      trueNumber++;
    }
    if (!!visit.difficulty) {
      this.difficulty = true;
      trueNumber++;
    }
    if (trueNumber != 0) {
      this.percentage = Math.round(100 * trueNumber / 6);
    }

  }
}
