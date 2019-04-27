var mongoose = require('mongoose');
var Post = require('./post');

mongoose.connect('mongodb://wgbadmin:wgbadmin1@ds227594.mlab.com:27594/the-wgb', { useNewUrlParser: true }).then(
  (res) => {
   console.log("Connected to Database Successfully.");
  }
).catch(() => {
  console.log("Connection to Database failed.");
});


var hostels = [ 

    new Hostel({
        title: '',
        body: '',
        tags: '',
        url: '',
        author: ''
    }),
    new Hostel({
        title: '',
        body: '',
        tags: '',
        url: '',
        author: ''
    }),
    new Hostel({
        title: '',
        body: '',
        tags: '',
        url: '',
        author: ''
    }), 
    

];

var done = 0;
for (var i = 0; i < hostels.length; i++){
    hostels[i].save(function(){
        done++;
        if(done === hostels.length){
            exit();
    }   
 });
}

function exit(){
    mongoose.disconnect(); 
}
