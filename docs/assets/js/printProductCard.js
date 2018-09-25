(function (){
  var storage = sessionStorage;

  console.log(storage.getItem("productName"));
  $("#product_name").text(storage.getItem("productName"));
  console.log(storage.getItem("productDescription"));
  $("#product_description").text(storage.getItem("productDescription"));
  console.log(storage.getItem("productCost"));
  $("#product_cost").text(storage.getItem("productCost"));
  console.log(storage.getItem("productUnitPrice"));
  $("#product_unit_price").text(storage.getItem("productUnitPrice"));

  var numberOfMaterialAttachments = storage.getItem("numberOfMaterialAttachments");
  console.log(numberOfMaterialAttachments);
  for(var i=0; i<numberOfMaterialAttachments; i++){
    var $name = storage.getItem('attachmentMaterialName'+i);
    console.log($name);
    $('#attachments').append(
      $('<tr>').append(
        $('<td>').addClass('attachment')
        .append($name)
      )
    )
  }

})();
