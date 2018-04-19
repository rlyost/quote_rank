import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  author = [];
  id = {};

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService) {
  }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => this.id = params['id']);
    console.log(this.id);
    this.getQuotesFromService(this.id);
  }
  getQuotesFromService(id) {
    let observable = this._httpService.getAuthorById(id);
    observable.subscribe(data => {
      console.log("Got our data!", data);
      this.author = data['data'];
      console.log("this.author in quotes.comp:", this.author)
    });
  }

  vote(id, rank, authorid, x) {
    if (x == 'up') {
      rank++;
    } else {
      rank--;
    };
    let observable = this._httpService.updateRank(id, rank, authorid);
    observable.subscribe(data => {
      console.log("Got our data!", data);
    });
    this.getQuotesFromService(this.id);
  }

  deleteQuote(authorid, quoteid) {
    let observable = this._httpService.destroyQuote(authorid, quoteid);
    observable.subscribe(data => {
      console.log("Got our data!", data);
    });
    this.getQuotesFromService(authorid);
  }

}
