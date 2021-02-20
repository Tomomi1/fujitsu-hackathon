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


document.getElementById('getAPI').addEventListener('click', getApi);
document.getElementById('setLatLng').addEventListener('submit', getMyApi);
document.getElementById('getDB').addEventListener('click', getDb);
document.getElementById('postData').addEventListener('submit', postData);
document.getElementById('deleteData').addEventListener('click', deleteData);
document.getElementById('getApiFromDb').addEventListener('submit', getApiFromDb);

function getApi(){
	const keyid = 'dd0bc37d5f3fe1ef3a42ee10080ba867';
	const latitude = 35.673092;
	const longitude = 139.75992;
	const range = 3;
	const apiUrl = "https://api.gnavi.co.jp/PhotoSearchAPI/v3/";
	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'jsonp',
		jsonpCallback: 'callback'
	}).done(function(data) {
		console.log(data)
		let output = `
			<h2 class="mb-4">Store Info</h2>
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
		shopData = data.results.shop
		$.each(shopData, function(index, value){
			output += `
			<table class="table">
				<tbody>
					<tr id="store-table-td">
						<td style="width: 25%;">${value.name}</td>
						<td style="width: 25%;">${value.lat}</td>
						<td style="width: 25%;">${value.lng}</td>
						<td style="width: 25%;">${value.urls.pc}</td>
					</tr>
				</tbody>
			</table>
			`;
			})
		document.getElementById('output').innerHTML = output;
	}).fail((err) => console.log(err));
}


function getMyApi(e){
	e.preventDefault();

	let latitude = document.getElementById('lat').value;
	let longitude = document.getElementById('lng').value;

	const range = 3;
	const apiUrl = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=fa9d37307b2c626a&lat=${latitude}&lng=${longitude}&range=${range}&type=lite&count=100&format=jsonp`;
	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'jsonp',
		jsonpCallback: 'callback'
	}).done(function(data) {
		console.log(data)
		let output = `
			<h2 class="mb-4">Store Info</h2>
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
		shopData = data.results.shop
		$.each(shopData, function(index, value){
			output += `
			<table class="table">
				<tbody>
					<tr id="store-table-td">
						<td style="width: 25%;">${value.name}</td>
						<td style="width: 25%;">${value.lat}</td>
						<td style="width: 25%;">${value.lng}</td>
						<td style="width: 25%;">${value.urls.pc}</td>
					</tr>
				</tbody>
			</table>
			`;
			})
		document.getElementById('output').innerHTML = output;
	}).fail((err) => console.log(err));
}


function getDb(){
	let output = `
		<h2 class="mb-4">Firestore Data</h2>
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


function postData(e){
	e.preventDefault();	

	let latitude = document.getElementById('post-lat').value;
	let longitude = document.getElementById('post-lng').value;

	const range = 3;
	const count = 3;
	const apiUrl = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=fa9d37307b2c626a&lat=${latitude}&lng=${longitude}&range=${range}&type=lite&count=${count}&format=jsonp`;
	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'jsonp',
		jsonpCallback: 'callback'
	}).done(function(data) {
		console.log(data)
		let output = `
			<h2 class="mb-4">Store Info</h2>
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
		shopData = data.results.shop
		$.each(shopData, function(index, value){
			output += `
			<table class="table">
				<tbody>
					<tr id="store-table-td">
						<td style="width: 25%;">${value.name}</td>
						<td style="width: 25%;">${value.lat}</td>
						<td style="width: 25%;">${value.lng}</td>
						<td style="width: 25%;">${value.urls.pc}</td>
					</tr>
				</tbody>
			</table>
			`;
			db.collection("stores")
				.add({
					name: value.name,
					lat: value.lat,
					lng: value.lng,
					storeUrl: value.urls.pc,
				})
				.then(function (docRef) {
					console.log("Document written with ID: ", docRef.id);
				})
				.catch(function (error) {
					console.error("Error adding document: ", error);
				});
			})
		document.getElementById('output').innerHTML = output;
	}).fail((err) => console.log(err));
}


function deleteData(){
	db.collection("stores").get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			console.log(doc.id, " => ", doc.data());
			db.collection("stores").doc(doc.id).delete().then(function() {
				console.log("Document successfully deleted!");
				}).catch(function(error) {
						console.error("Error removing document: ", error);
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

	const range = 3;
	const count = 100;
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