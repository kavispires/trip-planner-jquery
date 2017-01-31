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

  populateHTML();
});

function populateHTML() {
  console.log('its getting called');
  // Loop through hotels and populate #hotel-choices
  hotels.forEach(function(hotel, index, array) {
    var thehtml = '<option value="' + hotel.id + '">' + hotel.name + '</option>'
    $('#hotel-choices').append(thehtml);
  });
  // Loop through restaurants and populate #restaurant-choices
  restaurants.forEach(function(restaurant, index, array) {
    var thehtml = '<option value="' + restaurant.id + '">' + restaurant.name + '</option>'
    $('#restaurant-choices').append(thehtml);
  });
  // Loop through activtes and populate #activity-choices
  activities.forEach(function(activity, index, array) {
    var thehtml = '<option value="' + activity.id + '">' + activity.name + '</option>'
    $('#activity-choices').append(thehtml);
  });
}

var userChoices = {
  selectedHotel: 1,
  selectedRestaurant: 1,
  selectedActivity: 1,

  currentDay: 1,
  intineraries: [
    {
      hotel: null,
      restaurants: [],
      activities: []
    }
  ]
};

$('#hotel-choices').on('change', function() {
  userChoices.selectedHotel = +$(this).val();
});

$('#hotel-add').on('click', function() {
  // Update hotel name inside intineraries
  userChoices.intineraries[userChoices.currentDay - 1].hotel = hotels[userChoices.selectedHotel - 1];


});

$('#restaurant-choices').on('change', function() {
  userChoices.selectedRestaurant = +$(this).val();
});

$('#restaurant-add').on('click', function() {
  // Update hotel name inside intineraries
  userChoices.intineraries[userChoices.currentDay - 1].restaurants.push(restaurants[userChoices.selectedRestaurant - 1]); 
});

$('#activity-choices').on('change', function() {
  userChoices.selectedActivity = +$(this).val();
});

$('#activity-add').on('click', function() {
  // Update hotel name inside intineraries
  userChoices.intineraries[userChoices.currentDay - 1].activities.push(activities[userChoices.selectedActivity - 1]); 


});


var totalItins = 1;



/* INTINERARY */

$('.day-buttons').on('click', '.x', function(){
  $('.x').removeClass('current-day');
  $(this).addClass('current-day');
  userChoices.currentDay = +$(this).text();
  console.log(userChoices.currentDay);

  $('#day-title span').text('Day ' + userChoices.currentDay);
});

$('#day-add').on('click', function() {
  totalItins++
 var obj = {
      hotel: '',
      restaurants: [],
      activities: []
    }
    userChoices.intineraries.push(obj)


  $("<button class='btn btn-circle day-btn x'>"+totalItins+"</button>").insertBefore($(this))
})



















