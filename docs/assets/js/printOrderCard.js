(function () {
  var storage = sessionStorage;

  console.log(storage.getItem("orderName"));
  document.getElementById("order_name").innerHTML = storage.getItem("orderName");
  console.log(storage.getItem("orderRepresentative"));
  document.getElementById("order_repesentative").innerHTML = storage.getItem("orderRepresentative");
  console.log(storage.getItem("orderCustomerRepresentative"));
  document.getElementById("order_customer_repesentative").innerHTML = storage.getItem("orderCustomerRepresentative");
  console.log(storage.getItem("orderDescription"));
  document.getElementById("order_description").innerHTML = storage.getItem("orderDescription");
  console.log(storage.getItem("orderTotalCost"));
  document.getElementById("order_cost").innerHTML = storage.getItem("orderTotalCost");
  console.log(storage.getItem("orderTotalUnitPrice"));
  document.getElementById("order_total_unit_price").innerHTML = storage.getItem("orderTotalUnitPrice");


  var numberOfMaterialAttachments = storage.getItem("numberOfMaterialAttachments");
  console.log(numberOfMaterialAttachments);

  //
  // for(var i=0; i<numberOfMaterialAttachments; i++){
  //   var $name = storage.getItem('attachmentMaterialName'+i);
  //   console.log($name);
  //   $('#attachments').append(
  //     $('<tr>').append(
  //       $('<td>').addClass('attachment')
  //       .append($name)
  //     )
  //   )
  // }

})();
