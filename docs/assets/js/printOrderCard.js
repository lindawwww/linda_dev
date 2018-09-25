(function () {
  var storage = sessionStorage;

  console.log(storage.getItem("orderName"));
  document.getElementById("order_name").textContent = storage.getItem("orderName");
  console.log(storage.getItem("orderRepresentative"));
  document.getElementById("order_representative").textContent = storage.getItem("orderRepresentative");
  console.log(storage.getItem("orderCustomerRepresentative"));
  document.getElementById("order_customer_representative").textContent = storage.getItem("orderCustomerRepresentative");
  console.log(storage.getItem("orderDescription"));
  document.getElementById("order_description").textContent = storage.getItem("orderDescription");
  console.log(storage.getItem("orderTotalCost"));
  document.getElementById("order_cost").innerHTML = storage.getItem("orderTotalCost");
  console.log(storage.getItem("orderTotalUnitPrice"));
  document.getElementById("order_total_unit_price").innerHTML = storage.getItem("orderTotalUnitPrice");
  console.log(storage.getItem("dateReceivedOrder"));
  document.getElementById("date_received_order").textContent = storage.getItem("dateReceivedOrder");


  // var numberOfProductAttachments = storage.getItem("numberOfProductAttachments");
  // console.log(numberOfProductAttachments);

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
