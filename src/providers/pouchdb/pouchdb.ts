import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import PouchDB from 'pouchdb';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';
import {ConfigProvider} from "../config/config";

/*
  Generated class for the PouchdbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PouchdbProvider {
  db;

  constructor(public http: HttpClient,
              private configProvider: ConfigProvider) {
    this.db = new PouchDB('nino-app', {auto_compaction: true});
  }


  saveAttachment() {
    let attachment = new Blob(['Is there life on Mars?'], {type: 'image/jpeg'});
    this.db.putAttachment('doc', 'att.txt', attachment, 'text/plain').then((result) => {
      // handle result
    }).catch((err) => {
      console.log(err);
    });
  };

  /**
   * Create local resource
   * @param resourceName
   */
  createResource(resourceName) {
    let resource = {
      _id: resourceName,
      elements: [],
      lastSyncDate: this.configProvider.initalDate,
    }
    return this.db.post(resource).then((newResource) => {
      return this.db.get(newResource.id)
    })
  }

  /**
   *Delete document if exists and create a new one
   * @param id
   * @param data
   */
  create(id, data) {
    return this.db.get(id).then((doc) => {
      return this.db.put({
        _id: id,
        _rev: doc._rev,
        data: data
      })
    }).catch(() => {
      return this.db.put({
        _id: id,
        data: data
      })
    });

  }

  /**
   * Delete an existing document
   * @param {string} docId
   * @param {string} docRev
   */

  remove(id: string): Observable<any> {
    return new Observable((observer) => {
      this.db.get(id).then((doc) => {
        this.db.remove(doc).then(res => {
          observer.next(res)
          observer.complete();
        }).catch(err => {
          console.log('err 1', err)
          observer.error()
        })
      }).catch(err2 => {
        console.log('err 2', err2)
        observer.error()
      })
    })
  }

  /**
   *
   * @param id
   */
  fetch(id) {
    return Observable.fromPromise(this.db.get(id))
  }

  /**
   * Get existing local resource or crate if not exists
   * @param resourceName
   */
  getResource(resourceName) {
    return Observable.fromPromise(this.db.get(resourceName))
      .catch((error) => {
        if (error.status == '404') {//if not exists
          let resource = {
            _id: resourceName,
            elements: [],
            lastSyncDate: this.configProvider.initalDate,
          }
          return Observable.fromPromise(this.db.post(resource));
        }
      })
  }

  getImageResource(id, imageResourceName) {
    return this.db.getAttachment(id, imageResourceName).then((responce) => {
      return responce
    }).catch((error) => {
      if (error.status == '404') {//if not exists
        return null
      }
    })
  }

  /**
   * Update existing resource
   * @param resource
   */
  updateResource(resource) {
    return Observable.fromPromise(this.db.put(resource));
  }

}
