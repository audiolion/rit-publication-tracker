'use strict';

(function() {

class DashboardController {

  $http : Object;
  results : [Object];
  comment : string;


  constructor($http) {
    this.$http = $http;
  }

  getDashboardData(searchTerm: string) {
    this.$http.get('/api/papers/author/' + searchTerm).then(response => {
      if(response.status === 200) {
        this.results = response.data
      } else {
        this.results = null;
      }
    });
  }

  postPaper(paper){
    console.dir(paper);
    this.$http.post('/api/papers', paper).then(function(){
      paper.email = "";
      paper.title = "";
      paper.citation = "";
      paper.keywords = "";
      paper.abstract = "";
    });
    
  }

  putPaper(id, edit){
    this.$http.put('/api/papers/' + id, edit).then(function() {
      edit.title = "";
      edit.citation = "";
      edit.abstract = "";
    });
    ;
  }

  deletePaper(id: number){
    this.$http.delete('/api/papers/id/' + id);
  }
}

angular.module('publicationTrackerApp')
  .controller('DashboardController', DashboardController);

})();