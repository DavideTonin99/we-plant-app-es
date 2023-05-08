export class Albero {

  constructor() {
    this.images = [];
    this.essenza = new Essenza();
  }

  id: number;
  entityid: number;
  idPianta: number;
  codiceArea: number;
  nomeComune: string;
  classeAltezza: number;
  altezza?: number;
  diametroFusto?: number;
  diametro?: number;  wkt: string;
  aggiornamento: string;
  nota?: any;
  tipoDiSuolo?: any;
  dataImpianto?: any;
  dataPrimaRilevazione?: any;
  dataAbbattimento?: any;
  dataUltimoAggiornamento?: any;
  noteTecniche?: any;
  essenza: Essenza;
  essenzaId: number;
  essenzaNomeComune: string;
  images: Array<Image>;
  mainId: number;
  deleted: boolean;
  public posizione?: string
}

export class Essenza {
  id: number;
  idComune: number;
  tipoVerde: string;
  nomeComune: string;
  valoreSicurezza: string;
  valoreBioAmbientale: string;
  provenienza?: any;
  descrizione?: any;
  usieCuriosita?: any;
  genere?: any;
  specie?: any;
  genereESpecie?: string;
}

export interface Image {
  id: number;
  createDate: Date;
  modifiedDate: Date;
  name: string;
  format: string;
  location: string;
  imagePath: string;
  thumbnailPath: string;
  alberoId: number;
  alberoNomeComune: string;
  poiId?: any;
  poiName?: any;
  cratedById?: number;

}
