# node-uploader - An uploader utility for Node

## Install

```shell
npm install node-uploader
```

## Usage

```javascript
var uploader = require('node-uploader');
/**
 * @param {Object} options 文件上传的设置项
 *     @param {String} options.url 服务器接收地址
 *     @param {Object} options.files 上传的文件哈希
 *     @param {Object} options.data 上传携带的额外表单数据
 * @param {Function} callback 上传过程的回调函数
 */
uploader.upload({
  url: 'http://my-service.com/upload-endpoint',
  files: {
    key1: 'photo.png',
    key2: 'data.txt'
  },
  data: {
    username: 'xiaobai'
  }
}, function(e, response){
  if(!e){
    console.log(response);
  }
});
```


## Licence

ATT is free to use under MIT license. 

## Bugs & Feedback

Please feel free to [report bugs](http://github.com/colorhook/node-uploader/issues) or [feature requests](http://github.com/colorhook/node-uploader/pulls).
You can send me private message on `github`, or send me an email to: [colorhook@gmail.com]