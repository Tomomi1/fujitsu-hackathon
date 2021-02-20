function initMap() {
	const firebaseConfig = {
		apiKey: "AIzaSyAcNw0Z3v7gHBioPxBoJvV87Pcb_N5bvxM",
		authDomain: "fujitsu-hackathon-88d5d.firebaseapp.com",
		databaseURL: "https://fujitsu-hackathon-88d5d-default-rtdb.firebaseio.com",
		projectId: "fujitsu-hackathon-88d5d",
		storageBucket: "fujitsu-hackathon-88d5d.appspot.com",
		messagingSenderId: "848966983003",
		appId: "1:848966983003:web:426d4eed4f9ee9d9a0ce7e",
		measurementId: "G-X0TQNNYVCJ"
	};
	firebase.initializeApp(firebaseConfig);
	const db = firebase.firestore();
	
	
	$(document).ready(function () {
		db.collection("position")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					const currentPosition = { lat: parseFloat(data.lat), lng: parseFloat(data.lng) };
					const options = {
						zoom: 20,
						center: currentPosition,
					};
					const map = new google.maps.Map(document.getElementById("map"), options);
				});
			});
		});
	
	$(document).ready(function () {
		db.collection("stores")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					const content = `
						<ul>
							<li>${data.name}</li>
							<li>${data.lat}</li>
							<li>${data.lng}</li>
							<li>${data.storeUrl}</li>
						</ul>
					`;
					addMarker({
						coords: { lat: parseFloat(data.lat), lng: parseFloat(data.lng) },
						iconUrl: './images/blue-icon.png',
						content: content
					});
				});
			});
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

