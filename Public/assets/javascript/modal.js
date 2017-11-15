$(document).ready(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  // 
  $('#btnlog').on('click', function () {
    $('#login').modal()
    $('#login').modal('open');
  });
  $('#btnsign').on('click', function () {
    $('#signup').modal()
    $('#signup').modal('open');
  }); 



});


  
console.log("THIS IS THE PROJECT");

