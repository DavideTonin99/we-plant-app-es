import { Moment } from 'moment';

export interface IAlberoVisit {
    id?: number;
    visitTime?: Moment;
    userId?: number;
    alberoId?: number;
}

export class AlberoVisit implements IAlberoVisit {
    constructor(public id?: number, public visitTime?: Moment, public userId?: number, public alberoId?: number) {}
}
