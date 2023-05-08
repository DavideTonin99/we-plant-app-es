import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Essenza} from "../../model/albero.model";
import * as lunr from 'lunr';

/*
  Generated class for the ElasticlunrProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ElasticlunrProvider {
  essenzaIndex: any;
  essenzaSet: Map<number, Essenza> = new Map();

  constructor(public http: HttpClient) {
  }

  initEssenza(res: Array<Essenza>) {
    this.essenzaIndex = lunr(function () {
      this.field('essenza');
      this.pipeline.after(lunr.stopWordFilter, lunr.generateStopWordFilter([]))
      this.pipeline.remove(lunr.stopWordFilter)
      this.pipeline.remove(lunr.stemmer)
      /*this if for searching with wildcards -> https://github.com/olivernn/lunr.js/issues/256*/
      this.searchPipeline.remove(lunr.stemmer)
      res.forEach(essenza => {
        this.add({'essenza': essenza.genereESpecie, 'id': essenza.id, 'genereESpecie': essenza.genereESpecie});
      })
    });
    res.forEach(essenza => {
      this.essenzaSet.set(essenza.id, essenza)
    })
  }


  public searchEssenza(essenza: string) {
    return this.essenzaIndex.search(`essenza:${essenza}*`)
  }

  getEsssenzaById(essenzaId: string) {
    return this.essenzaSet.get(Number(essenzaId))
  }
}
