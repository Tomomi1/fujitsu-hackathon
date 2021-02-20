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


$("#getApiFromDb").submit((e) => {
	e.preventDefault();
	if (document.getElementById('address').value) {
	  getLatLng(document.getElementById('address').value, (latlng) => getApiFromDb(latlng));
	}
})

const getDb = () => {
	let positionOut = '<h2 class="mb-4">Position Data</h2>';
	db.collection("position")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					positionOut += `
						<ul class="mb-6">
							<li>position: { lat: ${data.lat}, lng: ${data.lng} }</li>
						</ul>
					`;
				});
				document.getElementById('position').innerHTML = positionOut;
			});

		let output = `
			<hr>
			<h2 class="mb-4">Store Data</h2>
			<table class="table">
				<thread>
					<tr>
						<th style="width:200px;">Store Name</th>
						<th style="width:200px;">lat</th>
						<th style="width:200px;">lng</th>
						<th style="width:200px;">store url</th>
						<th style="width:200px;">congestion</th>
					</tr>
				</thread>
			</table>
		`;

	db.collection("stores")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					output += `
					<table class="table">
						<tbody>
							<tr id="store-table-td">
								<td style="width: 20%;">${data.name}</td>
								<td style="width: 20%;">${data.lat}</td>
								<td style="width: 20%;">${data.lng}</td>
								<td style="width: 20%;">${data.storeUrl}</td>
								<td style="width: 20%;">${data.congestion}</td>
							</tr>
						</tbody>
					</table>
					`;
				});
				document.getElementById('output').innerHTML = output;
			});
}


const deleteData = async () => {
	await db.collection("stores").get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			console.log(doc.id, " => ", doc.data());
			db.collection("stores").doc(doc.id).delete().then(function() {
				console.log("stores: Document successfully deleted!");
				}).catch(function(error) {
						console.error("stores: Error removing document: ", error);
				});
		});
	});

	await db.collection("position").get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			console.log(doc.id, " => ", doc.data());
			db.collection("position").doc(doc.id).delete().then(function() {
				console.log("position: Document successfully deleted!");
				}).catch(function(error) {
						console.error("position: Error removing document: ", error);
				});
		});
	});
}

// (delete ->) post -> get -> delete
const getApiFromDb = async (latLng) => {
	// 初期化
	await deleteData()

	// post
	let latitude = latLng["lat"];
	let longitude = latLng["lng"];

	db.collection("position")
		.add({
			lat: latitude,
			lng: longitude
		})
		.then(function (docRef) {
			console.log("position: Document written with ID: ", docRef.id);
		})
		.catch(function (error) {
			console.error("position: Error adding document: ", error);
		});

	const range = 3;
	const count = 50;
	const apiUrl = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=fa9d37307b2c626a&lat=${latitude}&lng=${longitude}&range=${range}&type=lite&count=${count}&format=jsonp`;
	await $.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'jsonp',
		jsonpCallback: 'callback'
	}).done(function(data) {
		shopData = data.results.shop
		$.each(shopData, function(index, value){
			db.collection("stores")
				.add({
					name: value.name,
					lat: value.lat,
					lng: value.lng,
					storeUrl: value.urls.pc,
					photoUrl: value.photo.pc.l,
					congestion: Math.random()
				})
				.catch(function (error) {
					console.error("Error adding document: ", error);
				});
			})
	}).fail((err) => console.log(err));
	console.log("POST COMPLETE")

	// get
	getDb();
	console.log("GET COMPLETE")
}