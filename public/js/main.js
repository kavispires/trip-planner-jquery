$(function initializeMap (){

  var fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
  }, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
  }, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
  }, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
  }];

  var mapCanvas = document.getElementById('map-canvas');

  var currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  var iconURLs = {
    hotel: '/images/lodging_0star.png',
    restaurant: '/images/restaurant.png',
    activity: '/images/star-3.png'
  };

  function drawMarker (type, coords) {
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var iconURL = iconURLs[type];
    var marker = new google.maps.Marker({
      icon: iconURL,
      position: latLng
    });
    marker.setMap(currentMap);
  }

  drawMarker('hotel', [40.705137, -74.007624]);
  drawMarker('restaurant', [40.705137, -74.013940]);
  drawMarker('activity', [40.716291, -73.995315]);

  var currentDay = 1;
  var dayPlans = [{}];
// $('.remove').prop("disabled",true);

//populate select options
hotels.forEach(function(hotel){
  $('#hotel-choices').append( `<option value=${hotel.name}> ${hotel.name}</option>`)   
})
restaurants.forEach(function(restaurant){
  $('#restaurant-choices').append( `<option value=${restaurant.name}> ${restaurant.name}</option>`)   
})
activities.forEach(function(activity){
  $('#activity-choices').append( `<option value=${activity.name}>${activity.name}</option>`)   
})

//small blue plus buttons functionality
$('#hotel-add').click(function(){
  if(dayPlans[currentDay-1]===undefined){
    dayPlans.push({})
  } 
  dayPlans[currentDay-1].hotel_name = $('#hotel-choices').val()
  $('#hot-name').text(dayPlans[currentDay-1].hotel_name)
})

$('#restaurant-add').click(function(){
  if(dayPlans[currentDay-1]===undefined){
    dayPlans.push({})
  }
  if(dayPlans[currentDay-1].restaurant_name ===undefined) { 
    dayPlans[currentDay-1].restaurant_name = [$('#restaurant-choices').val()]
  }else {
    if(!dayPlans[currentDay-1].restaurant_name.includes($('#restaurant-choices').val())) {
      dayPlans[currentDay-1].restaurant_name.push($('#restaurant-choices').val() )
    }
  }
  $('#my-restaurants').empty();
  dayPlans[currentDay-1].restaurant_name.forEach(function(rest) {
    $('#my-restaurants').append(`<li style='list-style-type:none'>${rest}</li>`)
  })

})

$('#activity-add').click(function(){
  if(dayPlans[currentDay-1]===undefined){
    dayPlans.push({})
  } 
  if(dayPlans[currentDay-1].activity_name ===undefined) { 
    dayPlans[currentDay-1].activity_name = [$('#activity-choices').val()]
  }else {
    if(!dayPlans[currentDay-1].activity_name.includes($('#activity-choices').val())) {
      dayPlans[currentDay-1].activity_name.push($('#activity-choices').val() )
    }
  }
  $('#my-activities').empty();
  dayPlans[currentDay-1].activity_name.forEach(function(act) {
    $('#my-activities').append(`<li style='list-style-type:none'>${act}</li>`)
  })
})

// add day button
$('#day-add').click(function(){
  dayPlans.push({})
  $('#hot-name').text('')
  $('#my-restaurants').empty();
  $('#my-activities').empty();
  $('.current-day').removeClass('current-day')
  $(`<button id="justday" value=${dayPlans.length} class="btn btn-circle day-btn day current-day">${dayPlans.length}</button>`).insertBefore(this)
  currentDay = dayPlans.length
  $('#day-title span').text(`Day ${currentDay}`);

})

//change active class of button and redefine current day variable
$('.day-buttons').on('click', '.day', function(){
  $('.day').removeClass('current-day');
  $(this).addClass('current-day');
  currentDay = $(this).text()
  $('#day-title span').text(`Day ${currentDay}`);
  //populate html with current days' data
  $('#hot-name').empty()
  $('#my-restaurants').empty();
  $('#my-activities').empty();

  $('#hot-name').text(dayPlans[currentDay-1].hotel_name)

  if(dayPlans[currentDay-1].restaurant_name) {
    dayPlans[currentDay-1].restaurant_name.forEach(function(rest) {
      $('#my-restaurants').append(`<li style='list-style-type:none'>${rest}</li>`)
    })
  }

  if(dayPlans[currentDay-1].activity_name) {
    dayPlans[currentDay-1].activity_name.forEach(function(act) {
      $('#my-activities').append(`<li style='list-style-type:none'>${act}</li>`)
    })
  }

}); //day-buttons end


$('.remove').click(function(){
  if($('.current-day').prev().length) {
    dayPlans.splice(currentDay-1,1)
    $('.current-day').prev().addClass('current-day')
    $('.current-day').last().remove()
  }else {
    if( $('.current-day').next().hasClass('adder')) {
      dayPlans = [{}]
    }else {
      dayPlans.splice(currentDay-1,1)
      $('.current-day').next().addClass('current-day')
      $('.current-day').first().remove()
      $('.current-day').val(1)
    }
  }

  $('.day').each(function () {

    if($(this).val()>$('.current-day').val()) {
      $(this).val( $(this).val()-1)
    }
    $(this).text($(this).val())
  });

  currentDay =  $('.current-day').val()
  $('#day-title span').text(`Day ${currentDay}`);
  if(dayPlans.length===0){
    $('.remove').prop("disabled",true);
  }
  //repopulate fields
  if(dayPlans.length===1&&Object.keys(dayPlans[0]).length===0){
    $('#hot-name').text('')
    $('#my-restaurants').empty();
    $('#my-activities').empty();
  }else {
    $('#hot-name').text(dayPlans[currentDay-1].hotel_name)
    $('#my-restaurants').empty();
    dayPlans[currentDay-1].restaurant_name.forEach(function(rest) {
      $('#my-restaurants').append(`<li style='list-style-type:none'>${rest}</li>`)
    })
    $('#my-activities').empty();
      dayPlans[currentDay-1].activity_name.forEach(function(act) {
    $('#my-activities').append(`<li style='list-style-type:none'>${act}</li>`)
    })
  }

}) //remove end


});




