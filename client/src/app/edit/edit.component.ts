import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  author = [];
  id = {};
  name_error = "";

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService){
  }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => this.id = params['id']);
    this.fillEditBox(this.id);
  }
  
  fillEditBox(id): void { 
    console.log("fillEditBox:", id);
    let observable = this._httpService.getAuthorById(id);
    observable.subscribe(data => {
      console.log("Got our task!", data);
      if(data['message'] == "Error"){
        this._router.navigate(['/pagenotfound']);
      };
      this.author = data['data'];
    });
  };

  onClickUpdate(){
    if(this.author['name'].length < 3){
      this.name_error = "A name must be at least 3 characters!"
      console.log(this.name_error);
    } else {
      let observable = this._httpService.updateAuthor(this.author);
      observable.subscribe(data => {
        console.log("Got our post back!", data);
        this.author = [];
      });
      this._router.navigate(['/home']);
    }
  };

}
