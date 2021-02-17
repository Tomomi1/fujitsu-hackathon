// Initialize and add the map
function initMap() {
	// The location of current position
	const currentPosition = { lat: 35.710439, lng: 139.775332 };
	const options = {
		zoom: 20,
	  center: currentPosition,
	};
	// The map, centered at coords
	const map = new google.maps.Map(document.getElementById("map"), options);

	// add marker
	addMarker({
		coords: { lat: 35.710439, lng: 139.775332 },
		iconUrl: './images/blue-icon.png',
		content: '<h1>store!</h1>'
	});

	// Add Marker and infoWindow function
	function addMarker(props){
		const marker = new google.maps.Marker({
			position: props.coords,
			map: map,
			icon: {
				url: props.iconUrl
			},
		});

		// info window setting
		const infoWindow = new google.maps.InfoWindow({
			content: props.content
		});

		marker.addListener('click', function(){
			infoWindow.open(map, marker);
		});
	}
}