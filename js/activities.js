
var urlToBox = function(urlList = false) {

  var root = this;

  var bundle = [];

  var top = 'wp-json'; // types  wp-json, github or jsfiddle

  this.construct = function(urlList) {

    $('#activities').append('<div id="urltobox" />');
    if (urlList) {
      root.datatobox(urlList);
    }

  }

  this.datatobox = function(urls) {

    var src = urls;
    if (src.constructor !== Array) {
      src.push(urls); // make it an array
    }

    var countdown = urls.length;

    $.each(src, function(nr, jsonurl) {

      $.ajax({
        url: jsonurl, // json data
        contentType: 'application/json',
        dataType: 'json', // ? change this to jsonp if it is a cross org. req.
        contentType: 'json',
        async: true,
        success: function(json) {
          //console.log(json);
          countdown--;
          var list;
          if (json.data) {
            list = json.data;
          } else if (json.list) {
            list = json.list;
          } else {
            list = json;
          }
          var domain = jsonurl.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
          var type = 'custom';
          var data = [];

          if (domain.indexOf('github') !== -1) {
            /*
             * github events
             */
            type = 'github';
            $.each(list, function(idx, value) {
              var item = {};
              item.id = value.id;
              item.domain = domain;
              item.type = type;

              item.title = value.type;
              if (item.title == 'undefined') {
                item.title = value.type;
              }

              item.title += ' on ' + value.repo.name;
              item.username = value.actor.display_login;
              item.date = value.created_at;
              item.url = value.repo.url;

              item.message = '<ul>';
              $.each(value.payload.commits, function(i, commit) {
                item.message += '<li>' + commit.message + '</li>';
                return i < 3;
              });

              item.image = 'https://loremflickr.com/120/100/code,girls/all?lock=' + nr + idx;
              item.message += '</ul>';

              item.obj = value;
              data.push(item);
              bundle.push(item);

            });

          } else if (domain.indexOf('jsfiddle') !== -1) {
            /*
             * jsFiddle fiddles
             */
            type = 'jsfiddle';
            $.each(list, function(idx, value) {
              var item = {};
              var urlseg = value.url.split('/');
              item.id = urlseg[4];
              item.domain = domain;
              item.type = type;

              item.title = value.title;
              item.username = value.author;
              item.date = value.created;
              item.url = 'https:' + value.url;


              item.image = 'https://loremflickr.com/120/100/code,girls/all?lock=' + nr + idx;

              item.message = value.framework;
              if (value.description != '') {
                item.message += ' - ' + value.description;
              }

              item.obj = value;
              data.push(item);
              bundle.push(item);

            });

          } else if (jsonurl.indexOf('wp-json') !== -1) {
            /*
             * WP JSON posts
             */
            type = 'wp-json';
            $.each(list, function(idx, value) {
              var item = {};
              item.id = value.id;
              item.domain = domain;
              item.type = type;

              item.title = value.title.rendered;

              item.username = value._embedded.author[0].name;

              if (value._embedded['wp:featuredmedia']) {
                item.image = value._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
              } else {
                item.image = 'https://loremflickr.com/120/100/code,girls/all?lock=' + nr + idx;
              }

              item.date = value.modified;
              item.url = value.link;

              item.message = value.excerpt.rendered;


              item.obj = value;
              data.push(item);
              bundle.push(item);

            });

          } else {

            //var data = JSON.stringify(value);
            type = 'custom';
            $.each(list, function(idx, value) {
              var item = {};
              item.id = value.id;
              item.domain = domain;
              item.type = type;

              item.title = value.title;
              item.date = value.modified;
              item.url = value.link;
              item.message = value.message;
              item.obj = value;

              data.push(value);
              bundle.push(item);

            });

          }


          if (countdown == 0) { // all done

            bundle.sort(function(a, b) {
              var keyA = new Date(a.date),
                keyB = new Date(b.date);
              // Compare the 2 dates
              if (keyA < keyB) return 1;
              if (keyA > keyB) return -1;
              return 0;
            });

            //$('#urltobox').html('bundle:' + JSON.stringify(bundle));
            //alert('chk '+ countdown );

            var $box = $('<ul class="list-box" style="display:none;" />');
            $.each(bundle, function(idx, value) {
             var content ='';

            content += '<img src="' + value.image + '" /><div class="titlebar"><h3>' +
                value.title + '</h3><span class="date">' + value.date + '</span> <span class="user">' +
                value.username + '</span></div>' +
                '<div class="contentbar">' + value.message + '</div>';


                    content +='<p><a class="linkbar" href="' + value.url + '">' + value.url + '</a></p>';


             		$box.append($('<li id="item-' + value.id + '" class="list-item ' + value.type + '" />').html(
                	content
                )); //+ JSON.stringify(value.obj)
              // JSON.stringify(value)
            });

            $('#urltobox').append($box);

            $box.wrap('<div class="list-holder">').slideDown(500);

          }

        }
      });

    });





  }


  // init on load
  this.construct(urlList);

}

$(function() {

  //load with ajax.
  var urlList = [
    'https://www.webdesigndenhaag.net/portal/wp-json/wp/v2/posts?&per_page=15&orderby=date&order=desc&_embed',
    'https://api.github.com/users/webbouwer/events?&per_page=15&orderby=date&order=desc',
    //'https://jsfiddle.net/api/user/webbouwer/demo/list.json?&limit=15&sort=date&order=desc'
  ];

  var boxdata = new urlToBox(urlList);


});
