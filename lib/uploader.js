var fs = require('fs'),
  url = require('url'),
  http = require('http'),
  https = require('https');


var each = function (obj, callback) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      callback(obj[i], i, obj);
    }
  }
}
//构建上传文件的请求body
var buildRequest = function (files, params) {
  var boundary = '------multipartformboundary' + (new Date).getTime();
  var dashdash = '--';
  var crlf = '\r\n';

  /* Build RFC2388. */
  var builder = '';

  builder += dashdash;
  builder += boundary;
  builder += crlf;

  each(files, function (item, key) {
    builder += 'Content-Disposition: form-data; name="' + key + '"';
    //支持文件名为中文
    builder += '; filename="' + encodeURIComponent(item.replace(/.+\//, '')) + '"';
    builder += crlf;

    builder += 'Content-Type: application/octet-stream';
    builder += crlf;
    builder += crlf;

    /* 写入文件 */
    builder += fs.readFileSync(item, "binary");
    builder += crlf;
    /* 写入边界 */
    builder += dashdash;
    builder += boundary;
    builder += crlf;
  });

  /* 传递额外参数 */
  for (var i in params) {
    if (params.hasOwnProperty(i)) {
      builder += dashdash;
      builder += boundary;
      builder += crlf;

      builder += 'Content-Disposition: form-data; name="' + i + '"';
      builder += crlf;
      builder += crlf;
      //支持参数为中文
      builder += encodeURIComponent(params[i]);
      builder += crlf;
    }
  }


  /* 写入边界 */
  builder += dashdash;
  builder += boundary;
  builder += dashdash;
  builder += crlf;
  //console.log(builder);
  return {
    contentType: 'multipart/form-data; boundary=' + boundary,
    body: builder
  }
}

/**
 * 上传文件
 * @param {Object} options 文件上传的设置项
 *     @param {String} options.url 服务器接收地址
 *     @param {String|Array} options.files 上传的文件名，文件名数组
 *     @param {Object} options.data 上传携带的额外表单数据
 * @param {Function} callback 上传过程的回调函数
 * @example
        uploader.upload({
          url: 'http://my-service.com/upload-endpoint',
          file: 'photo.png',
          data: {
            username: 'xiaobai'
          }
        }, function(e, response){
          if(!e){
            console.log(response);
          }
        });
 **/
exports.upload = function (options, callback) {
  var seriveEndpoint = options.url,
    serviceParsed = url.parse(seriveEndpoint),
    requestOptions = {
      host: serviceParsed.hostname,
      port: serviceParsed.port,
      path: serviceParsed.pathname
    },
    httpRequest,
    onRequestCompleted = function (response) {
      var resBody = '';
      response.on('data', function (chunk) {
        resBody += chunk;
      });
      response.on('end', function () {
        callback && callback(null, resBody);
      });
    };

  var requestData = buildRequest(options.files, options.data);
  requestOptions.method = "POST";
  requestOptions.headers = {
    'Content-Type': requestData.contentType,
    'Content-Length': requestData.body.length
  }
  if (serviceParsed.protocol === 'https:') {
    httpRequest = https.request(requestOptions, onRequestCompleted);
  } else {
    httpRequest = http.request(requestOptions, onRequestCompleted);
  }
  httpRequest.write(requestData.body, "binary");
  httpRequest.on('error', function (e) {
    callback && callback(e);
  });
  httpRequest.end();
};