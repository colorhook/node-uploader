var uploader = require('../lib/uploader');

var options = {
    url: 'http://localhost/labs/zhengxie/upload.php',
    files: {
      'file1': 'file1.txt',
      'file2': 'file2.txt'
    },
    data: {
      username: 'xiaobai'
    }
}

var callback = function(err, response){
  console.log(response);
}

uploader.upload(options, callback);