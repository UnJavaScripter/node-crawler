'use strict';

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const writeFile = (uri, fileName) => {
    
    console.log('Will download', fileName);

    const fileRequest = request(uri)
      .pipe(
        fs.createWriteStream(fileName)
      );

    fileRequest.on('error', function(err) {
      console.log(err);
    });

    fileRequest.on('close', function(response){
      console.log(`File ${fileName} was successfully downloaded!`);
    });

}

//let url = 'http://pressbooks.com/sample-books/';
let url = process.env.URL;
let extension = process.env.EXTENSION;

request(url, (error, response, html) => {

    if(!error){
        let $ = cheerio.load(html);
        let anchorTag = $('a');
        let regex = new RegExp(extension+'$');

        // Links
        $(anchorTag).each((i, a) =>{

          let fileUrl = $(a).attr('href');
          
          if(regex.test(fileUrl)) {
            
            let fileName = decodeURI(fileUrl).match(/[^/]*$/g)[0];
            let isRemoteRoute = (/^http(?:s)?:\/\//).test($(a).attr('href'));
            
            if(isRemoteRoute){
              writeFile(fileUrl, fileName);
            }else{
              writeFile(url + fileUrl, fileName);
            }

          }

        });

    }else{
      console.log(error);
    }


});


