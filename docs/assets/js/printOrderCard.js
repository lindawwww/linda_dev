(function () {
  var storage = sessionStorage;

  console.log(storage.getItem('orderName'));
  $('#order_name').text(storage.getItem('orderName'));
  console.log(storage.getItem('orderRepresentative'));
  $('#order_representative').text(storage.getItem('orderRepresentative'));
  console.log(storage.getItem('orderCustomerRepresentative'));
  $('#order_customer_representative').text(storage.getItem('orderCustomerRepresentative'));
  console.log(storage.getItem('orderDescription'));
  document.getElementById('order_description').innerHTML = storage.getItem('orderDescription');
  console.log(storage.getItem('orderTotalCost'));
  $('#order_total_cost').text(storage.getItem('orderTotalCost'));
  console.log(storage.getItem('orderTotalUnitPrice'));
  $('#order_total_unit_price').text(storage.getItem('orderTotalUnitPrice'));
  console.log(storage.getItem('dateReceivedOrder'));
  $('#date_received_order').text(storage.getItem('dateReceivedOrder'));


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
