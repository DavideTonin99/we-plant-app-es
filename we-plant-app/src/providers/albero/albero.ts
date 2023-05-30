import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ConfigProvider} from "../config/config";
import {Albero, Essenza} from "../../model/albero.model";
import {Observable} from "rxjs/Observable";
import {AlberoVisit} from "../../model/albero-visit.model";

/*
  Generated class for the AlberoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlberoProvider {

  constructor(public http: HttpClient,
              public configProvider: ConfigProvider) {
    console.log('Hello AlberoProvider Provider');
  }

  find(id: number) {
    return this.http.get<Albero>(`${this.configProvider.serverUrl}/api/custom/alberos/${id}`)
  }

  findByIdPianta(idPianta: number) {
    return this.http.get<Albero>(`${this.configProvider.serverUrl}/api/custom/alberos/by-id-pianta/${idPianta}`)
  }

  updateAlberoAndEssenza(albero: Albero) {
    return this.http.post<Albero>(`${this.configProvider.serverUrl}/api/custom/alberos/albero-and-essenza-audit`, albero)
  }

  essenzaList(): Observable<Array<Essenza>> {
    return this.http.get<Array<Essenza>>(`${this.configProvider.serverUrl}/api/custom/alberos/essenza-list`)
  }

  findPlantsWithoutId() {
    return this.http.get<Array<Albero>>(`${this.configProvider.serverUrl}/api/custom/alberos/albero-without-plant-id`)
  }

  checkIdPianta(idPianta: number ){
    return this.http.get<Boolean>(`${this.configProvider.serverUrl}/api/custom/alberos/is-id-pianta-free/${idPianta}`)

  }

  findByCodiceArea(CODICE: string) {
    return this.http.get<Array<Albero>>(`${this.configProvider.serverUrl}/api/custom/alberos/by-codice-area/${Number(CODICE)}`)
  }

  alberoVisit(alberoVisit: AlberoVisit) {
    return this.http.post<any>(`${this.configProvider.serverUrl}/api/custom/albero-visits`, alberoVisit)


  }

  getEssenzaAudit(id: number) {
    return this.http.get<Essenza>(`${this.configProvider.serverUrl}/api/custom/essenza-audits/by-essenza/${id}`)
  }

  uploadAlberoImage(imageUrl, id: number, imageName: string){

    let imageBlob = this.convertBase64ToBlob(imageUrl);
    let input = new FormData();
// Add your values in here
    input.append('data', imageBlob);

  return this.http.post(`${this.configProvider.serverUrl}/api/custom/images/upload`, input, {
    params: {'entityType': 'ALBERO', 'id': id.toString(), imageName: imageName}})
  }

  private convertBase64ToBlob(base64Image: string) {
    // Split into two parts
    const parts = base64Image.split(';base64,');

    // Hold the content type
    const imageType = parts[0].split(':')[1];

    // Decode Base64 string
    const decodedData = window.atob(parts[1]);

    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }
}
