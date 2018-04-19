import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit {
  newquote = {};
  name_error = "";
  id = {};
  author = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService){
  }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => this.id = params['id']);
    console.log(this.id);
    this.getQuotesFromService(this.id);  
  }
  getQuotesFromService(id){
    let observable = this._httpService.getAuthorById(id);
    observable.subscribe(data => {
      console.log("Got our data!", data);
      this.author = data['data'];
      console.log("this.author in write.comp:", this.author)
    });
  }
  onClickAdd(){
    if(this.newquote['quote'].length < 3){
      this.name_error = "A quote must be at least 3 characters!"
      console.log(this.name_error);
    } else {
      this.newquote = { quote: this.newquote['quote'], author_id: this.id};
      let observable = this._httpService.addQuote(this.newquote);
      observable.subscribe(data => {
        console.log("Got our post back!", data);
        console.log(this.id);
        this.goBack(this.id);
        this.newquote = {quote: "", author_id: ""};
      });
    };
  };
  goBack(id){
    this._router.navigate(['/quotes', id]);
  };
}
