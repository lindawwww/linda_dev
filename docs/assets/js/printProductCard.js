(function (){
  var storage = sessionStorage;

  console.log(storage.getItem("productName"));
  $("#product_name").text(storage.getItem("productName"));
  console.log(storage.getItem("productDescription"));
  document.getElementById('product_description').innerHTML = storage.getItem('productDescription');
  console.log(storage.getItem("productCost"));
  $("#product_cost").text(storage.getItem("productCost"));
  console.log(storage.getItem("productUnitPrice"));
  $("#product_unit_price").text(storage.getItem("productUnitPrice"));

  var numberOfMaterialAttachments = storage.getItem("numberOfMaterialAttachments");
  console.log(numberOfMaterialAttachments);
  for(var i=0; i<numberOfMaterialAttachments; i++){
    var $name = storage.getItem('attachmentMaterialName'+i);
    var $artisan = storage.getItem('partsArtisan'+i);
    var $unitPrice = storage.getItem('partsUnitPrice'+i);
    console.log($name);
    console.log($artisan);
    console.log($unitPrice);
    $('#attachments').append(
      $('<tr>').append(
        $('<td>').addClass('attachment')
        .append($name)
        $('<td>').addClass('attachment')
        .append($artisan)
        $('<td>').addClass('attachment')
        .append($unitPrice)
      )
    )
  }

})();
