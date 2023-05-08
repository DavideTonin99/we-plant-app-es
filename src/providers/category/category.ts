import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Stop} from "../../model/visit.model";
import _ from "lodash";

/*
  Generated class for the CategoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoryProvider {

  public static VENETO_NIGHT = [
    {
      "it": "VenetoNight 2018",
      "key": "veneto_night",
      "doc_count": 6
    }
  ];
  public static POVEGLIANO = [
    {
      "it": "Povegliano veronese",
      "key": "povegliano",
      "doc_count": 3
    }
  ];
  public static TOURISM = [
    {
      "it": "Siti culturali",
      "key": "attraction",
      "doc_count": 13
    },
    {
      "it": "Musei",
      "key": "museum",
      "doc_count": 7
    },
    {
      "it": "Informazioni",
      "key": "information",
      "doc_count": 4
    },
    {
      "it": "Punto panoramico",
      "key": "viewpoint",
      "doc_count": 3
    }
  ]
  public static AMENITY = [
    {
      "it": "Parcheggi",
      "key": "parking",
      "doc_count": 13
    },
    {
      "it": "Bancomat",
      "key": "atm",
      "doc_count": 4
    },
    {
      "it": "WC",
      "key": "toilets",
      "doc_count": 7
    },
    {
      "key": "restaurant",
      "it": "Ristoranti",
      "doc_count": 129
    },
    {
      "key": "cafe",
      "it": "Cafe",
      "doc_count": 59
    },
    {
      "key": "bar",
      "it": "Bar",
      "doc_count": 25
    },
    {
      "it": "Farmacie",
      "key": "pharmacy",
      "doc_count": 23
    },
    {
      "it": "Parcheggio per le bici",
      "key": "bicycle_parking",
      "doc_count": 21
    },
    {
      "it": "Fast food",
      "key": "fast_food",
      "doc_count": 21
    },
    {
      "it": "Banche",
      "key": "bank",
      "doc_count": 20
    },
    {
      "it": "Gelaterie",
      "key": "ice_cream",
      "doc_count": 19
    },
    {
      "it": "Hotel",
      "key": "hotel",
      "doc_count": 12,
      "category": "TOURISM"
    },
    {
      "it": "B&B",
      "key": "guest_house",
      "doc_count": 11,
      "category": "TOURISM"
    },

    {
      "it": "Noleggio bici",
      "key": "bicycle_rental",
      "doc_count": 12
    },
    {
      "it": "Università e Scuole",
      "key": "school",
      "doc_count": 11
    },
    {
      "it": "Pub",
      "key": "pub",
      "doc_count": 6
    },
    {
      "it": "Ufficio postale",
      "key": "post_office",
      "doc_count": 5
    },

    {
      "it": "Distributore di benzina",
      "key": "fuel",
      "doc_count": 3
    },
    {
      "it": "Cinema",
      "key": "cinema",
      "doc_count": 2
    },
    {
      "it": "Ambasciate",
      "key": "embassy",
      "doc_count": 2
    },
    {
      "it": "Biblioteca",
      "key": "library",
      "doc_count": 2
    }

  ];

  constructor(public http: HttpClient) {
  }


  getCategoryByStop(stop: Stop){
    let category;
    if (_.has(stop, '_source.tags.tourism')) {
      category = this.getCategory(stop._source.tags.tourism);
    } else if (_.has(stop, '_source.tags.amenity')) {
      category = this.getCategory(stop._source.tags.amenity);
    }
    let categoryIt = category != null ? category.it : '';
    return categoryIt;
  }


  getCategory(key) {
    for (let category of  CategoryProvider.TOURISM) {
      if (category.key === key) {
        return category;
      }
    }
    for (let amenity of CategoryProvider.AMENITY) {
      if (amenity.key === key) {
        return amenity;
      }
    }

    for (let venetoNight of CategoryProvider.VENETO_NIGHT) {
      if (venetoNight.key === key) {
        return venetoNight;
      }
    }

  }

}
