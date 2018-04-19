import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authors = [];

  constructor(private _httpService: HttpService){
  }

  ngOnInit() {
    this.getAuthorsFromService();
  }
  getAuthorsFromService(){
    let observable = this._httpService.getAuthors()
    observable.subscribe(data => {
      console.log("Got our data!", data);
      this.authors = data['data'];
      var sortedItems = this.authors.sort(this.dynamicSort('name'));
      console.log("SORTED:", sortedItems);
    });
  }
  onClickDestroy(id){
    let observable = this._httpService.destroyAuthor(id);
    observable.subscribe(data => {
      console.log("Got our delete back!", data);
      this.authors = [];
    });
    this.getAuthorsFromService();
  };
  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }
}
