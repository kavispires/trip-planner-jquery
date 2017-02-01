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

  init();
});

// Populate DOM 
function init() {
  // Loop through hotels and populate #hotel-choices
  hotels.forEach(function(hotel, index, array) {
    var thehtml = '<option value="' + hotel.id + '">' + hotel.name + '</option>';
    $('#hotel-choices').append(thehtml);
  });
  // Loop through restaurants and populate #restaurant-choices
  restaurants.forEach(function(restaurant, index, array) {
    var thehtml = '<option value="' + restaurant.id + '">' + restaurant.name + '</option>';
    $('#restaurant-choices').append(thehtml);
  });
  // Loop through activtes and populate #activity-choices
  activities.forEach(function(activity, index, array) {
    var thehtml = '<option value="' + activity.id + '">' + activity.name + '</option>';
    $('#activity-choices').append(thehtml);
  });
  // Add the first day to itinerary
  user.itineraries.push(user.dayTemplate);
}

var user = {
  // Store user's current choice on the select menus
  selectedHotel: 1,
  selectedRestaurant: 1,
  selectedActivity: 1,

  currentDay: 1,
  
  itineraries: [],

  dayTemplate: {
      hotel: '',
      restaurants: [],
      activities: []
  }
};

/* ===============
   OPTIONS PANEL 
   =============== */

// Watches for changes in #hotel-choices and updates the user selection
$('#hotel-choices').on('change', function() {
  user.selectedHotel = +$(this).val();
});

$('#hotel-add').on('click', function() {
  // Update hotel name inside itineraries
  user.itineraries[user.currentDay - 1].hotel = hotels[user.selectedHotel - 1];
  // Update itinerary in the DOM
  refreshItinerary();
});

$('#restaurant-choices').on('change', function() {
  user.selectedRestaurant = +$(this).val();
});

$('#restaurant-add').on('click', function() {
  // Update hotel name inside itineraries
  user.itineraries[user.currentDay - 1].restaurants.push(restaurants[user.selectedRestaurant - 1]); 
  // Update itinerary in the DOM
  refreshItinerary();
});

$('#activity-choices').on('change', function() {
  user.selectedActivity = +$(this).val();
});

$('#activity-add').on('click', function() {
  // Update hotel name inside itineraries
  user.itineraries[user.currentDay - 1].activities.push(activities[user.selectedActivity - 1]); 
  // Update itinerary in the DOM
  refreshItinerary();
});

/* ===============
   ITINERARY 
   =============== */

// Clicking on a day button, toggles current-day class and updates currentDay 
$('.day-buttons').on('click', '.day', function(){
  $('.day').removeClass('current-day');
  $(this).addClass('current-day');
  user.currentDay = +$(this).text();
  $('#day-title span').text('Day ' + user.currentDay);
  refreshItinerary();
});

// Adding a new day, pushes a template object to user.itineraries and creates a new button
$('#day-add').on('click', function() {
  user.itineraries.push(user.dayTemplate);
  $("<button class='btn btn-circle day-btn day'>" + user.itineraries.length + "</button>").insertBefore($(this));
});

// Clicking on the main day X button, removes that day completely from the database
// It also changes the currentDay to a previous one and refresh the day numbers
$('#delete-day').on('click', function(){
  $('.day-buttons button:nth-child(' + user.currentDay + ')').remove();
  user.itineraries.splice(user.currentDay - 1, 1);

  // If that was the only day available, create a blank one
  if (user.itineraries.length < 1) {
     user.itineraries.push(user.dayTemplate); 
  }
  // Updates currentDay
  user.currentDay = 1;
  // Select the first day button and turn it active, then update the number in DOM.
  $('.day-buttons button:first-Child').addClass('current-day');
  $('#day-title span').text('Day ' + user.currentDay);
  // Re-enumerate the days left
  var renumbering = 1;
  $('.day-buttons').children().each(function() {
    if ($(this).hasClass('day')) {
      $(this).text(renumbering++);
    }
  });
});

// Get currentDay and populate #itinerary according to that day's data
function refreshItinerary() {

  var currentDay = user.itineraries[user.currentDay - 1];

  // Add hotel
  var hotelItem = itemTemplate(currentDay.hotel.name);
  $('#my-hotels').html(hotelItem);

  // Add restaurants
  $('#my-restaurants').html(''); // clears DOM element
  currentDay.restaurants.forEach(function(restaurant, index) {
    var restaurantItem = itemTemplate(currentDay.restaurants[index].name);
    $('#my-restaurants').append(restaurantItem);
  });

  // Add activities
  $('#my-activities').html(''); // clears DOM element
  currentDay.activities.forEach(function(activity, index) {
    var activityItem = itemTemplate(currentDay.activities[index].name);
    $('#my-activities').append(activityItem);
  });
}

// Returns an HTML template for ech itinerary item
function itemTemplate(name) {
  if (name) {
    return  '<div class="itinerary-item">' +
            '<span class="title">' + name +'</span>' +
            '<button class="btn btn-xs btn-danger remove btn-circle">x</button>' +
            '</div>';  
  } else {
    return '';
  }
}

// NOT WORKING: The refreshItinerary, on line 188 is not picking the right array element for some reason to updating the DOM.













