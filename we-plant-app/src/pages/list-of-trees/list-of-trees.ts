import { Component } from '@angular/core';

import { AlertController, IonicPage, NavController, NavParams, Thumbnail } from 'ionic-angular';

import { AlberoProvider } from "../../providers/albero/albero";
import { Albero } from '../../model/albero.model';


@IonicPage()
@Component({
    selector: 'page-list-of-trees',
    templateUrl: 'list-of-trees.html'
})
export class ListOfTreesComponent {

    numberOfTrees: number = 10;
    treeList: Array<Albero> = [];
    isEmbedded: boolean = true;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alberoProvider: AlberoProvider,
        public alertCtrl: AlertController
    ) {
        // Get all the trees
        this.alberoProvider.getAllTreesSortedByLastUpdate().subscribe((trees: Array<Albero>) => {
            this.treeList = trees;
        }, err => {
            console.error(err);
            this.alertCtrl.create({
                message: "Errore durante il caricamento dei dati.",
                buttons: [{ text: "Ok" }]
            }).present();
        });
        //
        // Set the number of trees to show
        let numberOfTreesParam = this.navParams.get('numberOfTrees');
        if (isNaN(numberOfTreesParam) || numberOfTreesParam === null || numberOfTreesParam === undefined) { }
        else {
            this.numberOfTrees = numberOfTreesParam;
        }
        //
        // Set if it's an embedded component or a page
        if (this.navParams.get('isEmbedded') === false) {
            this.isEmbedded = this.navParams.get('isEmbedded');
        }
    }

    showAllTrees() {
        this.navCtrl.push("ListOfTreesComponent", { numberOfTrees: 0 , isEmbedded : false})
    }

    goToDetails(tree) {
        sessionStorage.setItem('albero', JSON.stringify(tree));
        this.navCtrl.push("AlberoDetailsPage", { albero: tree })
    }
}
