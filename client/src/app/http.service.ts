import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {

  constructor(private _http: HttpClient) {
  }
  getAuthors() {
    return this._http.get('/authors');
  }
  getAuthorById(id) {
    let route_call = "/author/" + id;
    return this._http.get(route_call);
  }
  updateRank(id, rank, authorid) {
    let rankup = [id, rank, authorid];
    return this._http.put('/quote/update', rankup);
  }
  addQuote(quote) {
    console.log(quote);
    return this._http.put('/quote/new', quote);
  }
  destroyQuote(authorid, quoteid) {
    let ids = [authorid, quoteid];
    return this._http.put('/quote/remove', ids);
  }
  addAuthor(name) {
    return this._http.post('/author/new', name);
  };
  updateAuthor(editAuthor) {
    return this._http.put('/author/update', editAuthor);
  };
  destroyAuthor(id) {
    var route_call = "/author/remove/" + id;
    return this._http.delete(route_call);
  }
}
