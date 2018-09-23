(function (){
  // document.write("<script type='text/javascript' src='docs/assets/js/script.js'></script>");
  // window.onload = function(){alert(resText);};
  // require('script.js');
  // function loadScript(url) {
  //   var script = document.createElement('script');
  //   script.type = 'text/javascript';
  //   script.src = url;
  // };
  // loadscript('docs/assets/js/script.js');

  var storage = sessionStorage;

  console.log(storage.getItem("name"));
  document.getElementById("product_name").innerHTML = storage.getItem("name");
  console.log(storage.getItem("description"));
  document.getElementById("product_description").innerHTML = storage.getItem("description");
  console.log(storage.getItem("cost"));
  document.getElementById("product_cost").innerHTML = storage.getItem("cost");
  console.log(storage.getItem("unit_price"));
  document.getElementById("product_unit_price").innerHTML = storage.getItem("unit_price");
  var numberOfAttachments = storage.getItem("numberOfAttachments");
  console.log(numberOfAttachments);

  for(var i=0; i<numberOfAttachments; i++){
    var $name = storage.getItem('attachmentName'+i);
    console.log($name);
    $('#attachments').append(
      $('<tr>').append(
        $('<td>').addClass('attachment')
        .append($name)
      )
    )
  }

  // console.log(result);
})();
//https://developers.trello.com/v1.0/docs/clientjs
// 素材ボードの取得
// APIエンドポイントの一覧：https://developers.trello.com/v1.0/reference#lists
// Client.js(実際の使い方)：https://api.trello.com/1/boards/id/lists
//
// (function(){
//
// })();
