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


document.getElementById('getDB').addEventListener('click', getDb);
document.getElementById('deleteData').addEventListener('click', deleteData);
document.getElementById('getApiFromDb').addEventListener('submit', getApiFromDb);

function getDb(){
	let positionOut = '<h2 class="mb-4">Position Data</h2>';
	$(document).ready(function () {
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
					</tr>
				</thread>
			</table>
		`;

	$(document).ready(function () {
		db.collection("stores")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					output += `
					<table class="table">
						<tbody>
							<tr id="store-table-td">
								<td style="width: 25%;">${data.name}</td>
								<td style="width: 25%;">${data.lat}</td>
								<td style="width: 25%;">${data.lng}</td>
								<td style="width: 25%;">${data.storeUrl}</td>
							</tr>
						</tbody>
					</table>
					`;
				});
				document.getElementById('output').innerHTML = output;
			});
		});
}


function deleteData(){
	db.collection("stores").get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			console.log(doc.id, " => ", doc.data());
			db.collection("stores").doc(doc.id).delete().then(function() {
				console.log("stores: Document successfully deleted!");
				}).catch(function(error) {
						console.error("stores: Error removing document: ", error);
				});
		});
	});

	db.collection("position").get().then(function(querySnapshot) {
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
function getApiFromDb(e){
	// post
	e.preventDefault();
	let latitude = document.getElementById('submit-lat').value;
	let longitude = document.getElementById('submit-lng').value;

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
	const count = 3;
	const apiUrl = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=fa9d37307b2c626a&lat=${latitude}&lng=${longitude}&range=${range}&type=lite&count=${count}&format=jsonp`;
	$.ajax({
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

	// deleteはなぜか一番最後に行われるので手動
}