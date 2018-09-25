(function (){
  var storage = sessionStorage;

  console.log(storage.getItem("productName"));
  document.getElementById("product_name").innerHTML = storage.getItem("productName");
  console.log(storage.getItem("productDescription"));
  document.getElementById("product_description").innerHTML = storage.getItem("productDescription");
  console.log(storage.getItem("productCost"));
  document.getElementById("product_cost").innerHTML = storage.getItem("productCost");
  console.log(storage.getItem("productUnitPrice"));
  document.getElementById("product_unit_price").innerHTML = storage.getItem("productUnitPrice");
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
