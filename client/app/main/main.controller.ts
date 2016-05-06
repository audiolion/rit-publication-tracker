'use strict';

(function() {

class MainController {

  $http : Object;
  results : [Object];
  searchTypes : [Object];
  searchType : Object;
  comment : string;
  noResults : boolean;
  lastSearch : Object;


  constructor($http) {
    this.$http = $http;
    this.searchTypes = [
      {
        display: 'Title',
        endpoint: '/title'
      },
      {
        display: 'Author',
        endpoint: '/author/'
      },
      {
        display: 'Keywords',
        endpoint: '/keywords/'
      }
     ];
    this.searchType = this.searchTypes[0];
    this.noResults = false;
    this.lastSearch = null;
  }

  search(searchType: {display: string, endpoint: string}, searchTerm: string) {
    this.$http.get('/api/papers' + searchType.endpoint + searchTerm).then(response => {
      this.lastSearch = { field: searchType.display, searchTerm: searchTerm };
      if(response.status === 200) {
        this.results = response.data
        if (this.results.length < 1) {
          this.noResults = true;
        } else {
          this.noResults = false;
        }
      } else {
        this.results = null;
        this.noResults = true;
      }
    });
  }

  getTopPapers(endpoint: string, numResults: number) {
    this.$http.get('/api/papers/' + endpoint + numResults).then(response => {
      if (response.status === 200) {
        this.results = response.data
        if (this.results.length < 1) {
          this.noResults = true;
        } else {
          this.noResults = false;
        }
      } else {
        this.results = null;
        this.noResults = true;
      }
    });
  }


  /**postComment(result){
    result.comments.push(this.comment);
    this.$http.post('/api/earthporn/usercomments/post/' + result.id + '/' + this.comment);
    this.comment = null;
  }*/
}

angular.module('publicationTrackerApp')
  .controller('MainController', MainController);

})();