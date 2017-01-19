var source, destination;
var directionsDisplay;
var autocompleteStart;
var autocompleteEnd;
var map;
var directionsService = new google.maps.DirectionsService();
google.maps.event.addDomListener(window, 'load', function () {

    autocompleteStart=new google.maps.places.Autocomplete($("#startAddress")[0],
        {types: ['geocode'], componentRestrictions: {country: 'us'}}, function(elem,k){
            console.log(elem);
        });
    autocompleteEnd=new google.maps.places.Autocomplete($("#endAddress")[0],
        {types: ['geocode'], componentRestrictions: {country: 'us'}});
    directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': true });

    var us = new google.maps.LatLng(37.0902, -95.7129);
    var mapOptions = {
        zoom: 7,
        center: us,
        componentRestrictions: {country: "us"}
    };
    map = new google.maps.Map($('.dvMap')[0], mapOptions);
});
function GetRoute() {
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel($('.dvPanel')[0]);
    //*********DIRECTIONS AND ROUTE**********************//
    source = $("#startAddress")[0].value;
    destination = $("#endAddress")[0].value;

    if(source==""||destination==""){
        alert("Please enter the address!");
        return;
    }
    else{
        var request = {
            origin: source,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });

        //*********DISTANCE AND DURATION**********************//
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [source],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIA,
            avoidHighways: false,
            avoidTolls: false
        }, function (response, status) {
            if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
                var distanceinMeters = response.rows[0].elements[0].distance.value;
                var distance = getMiles(distanceinMeters);
                var duration = response.rows[0].elements[0].duration.text;
                var dvDistance = $(".totalDistance")[0];
                dvDistance.innerHTML = "";
                dvDistance.innerHTML += "Distance: " + distance + " "+"miles" + "<br />";
                dvDistance.innerHTML += "Duration:" + duration;
                if($(".totalDistance").css('display')=="none"){
                    $(".totalDistance").slideToggle({duration: 1000});
                }
            } else {
                alert("Unable to find the distance via road.");
            }
        });
    }
}

function getMiles(meters){
    var miles = meters*0.000621371192;
    return (Math.floor(miles*100)/100) ;
}
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocompleteStart.setBounds(circle.getBounds());
            autocompleteEnd.setBounds(circle.getBounds());
        });
    }
}
