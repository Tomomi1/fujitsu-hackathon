async function initMap() {
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
  // const auth = firebase.auth()

	let map = undefined;
	let iconUrl = undefined;
	let description = undefined;
	let color = undefined;
	let infoWindowList = [];
	let cardOutput = undefined;
	let count = 0;

	$(document).ready(async function () {
		const positionSnapshot = await db.collection("position")
			.get();

		positionSnapshot.forEach((doc) => {
			const data = doc.data();
			const currentPosition = { lat: parseFloat(data.lat), lng: parseFloat(data.lng) };
			const options = {
				zoom: 20,
				center: currentPosition,
			};
			map = new google.maps.Map(document.getElementById("map"), options);
			// console.log("new Map")
			// console.log(map)
		});

		const storesSnapshot = await db.collection("stores")
			.get();
		storesSnapshot.forEach((doc) => {
			const data = doc.data();
			if (data.congestion <= 0.7) {
				iconUrl = './images/blue-icon.png';
				description = "〇 空いています";
				color = "green";
			} else if (data.congestion <= 0.9){
				iconUrl = './images/yellow-icon.png';
				description = "△ 少し混雑しています";
				color = "#FF9933";
			} else {
				iconUrl = './images/red-icon.png';
				description = "✕ 満席です";
				color = "red";
			}
			const windowContent = `
					<h5 id="content" class="display-8 mt-3 mb-0">${data.name}</h5>
					<hr class="mt-0">
					<h5 id="window-description" style="color: ${color}" class="display-8 mt-3 mb-0">${description}</h5>
				`;

			const thumbsUp = true
				? "./images/buttons/thumbs_up_blue.png"
				: "./images/buttons/thumbs_up_gray.png"
			const thumbsDown = true
				? "./images/buttons/thumbs_down_blue.png"
				: "./images/buttons/thumbs_down_gray.png"

			const content = `
				<div class="width: 100%">
					<div class="col-8">
						<div class="d-flex justify-content-between  align-items-center p-2">
							<h5 id="content" class="display-8 col-8 m-0 font-weight-bold">${data.name}</h5>
							<div class="d-flex justify-content-end col-4">
								<div class="d-flex align-items-center mr-4">
									<button class="btn ml=30" id="thumbs-up">
										<img src=${thumbsUp} alt="thumbs_up"">
									</button>
									<p class="m-0">12</p>
								</div>
								<div class="d-flex align-items-center mr-4">
									<button class="btn ml=30" id="thumbs-down">
										<img src=${thumbsDown} alt="thumbs_down">
									</button>
									<p class="m-0">3</p>
								</div>
							</div>
						</div>
						<hr class="mt-0">
						<ul>
							<li>
								<a id="content" href="${data.storeUrl}">店舗URL</a>
							</li>
						</ul>
						<img src="${data.photoUrl}" class="ml-4" width="300" height="300">
					</div>
				</div>
			`;

			count++;
			if (count<6) {
				cardOutput += `
					<div class="card card-body mb-3 col">
							<h3>${data.name}</h3>
							<p>${description}</p>
					</div>
				`;
			}

			addMarker({
				coords: { lat: parseFloat(data.lat), lng: parseFloat(data.lng) },
				iconUrl: iconUrl,
				content: content,
				windowContent: windowContent
			});
		});

		$(document).ready(function () {
			$("#thumbs-up").on("click", () => {
				getThumbsUp();
			});
			$("#thumbs-down").on("click", () => {
				getThumbsDown();
			});
		});

		function getThumbsUp(){
			console.log("thumbs-up")
		}

		function getThumbsDown(){
			console.log("thumbs-down")
		}

		// Add Marker and infoWindow function
		function addMarker(props) {
			// console.log("addMarker")
			// console.log(map)
			const marker = new google.maps.Marker({
				position: props.coords,
				map: map,
				icon: {
					url: props.iconUrl
				},
			});


			// info window setting
			const infoWindow = new google.maps.InfoWindow({
				content: props.windowContent
			});
			infoWindowList = [...infoWindowList, infoWindow];

			marker.addListener('click', function () {
				infoWindowList.forEach(item => {
					item.close();
				})
				infoWindow.open(map, marker);
				const output = props.content;
				document.getElementById('output').innerHTML = output;
				document.getElementById('output').innerHTML = cardOutput;
			});
		}

		// ユーザー認証
		const handleLogin = async () => {
			const provider = new firebase.auth.GoogleAuthProvider();
			if (!provider) return
			try {
				await auth.signInWithPopup(provider);
				const user = auth.currentUser;
				if (user) await push(`/basePatient/${user.uid}`);
			} catch (error) {
				console.log(error);
			}
		};

		const handleLogout = async () => {
			try {
				await auth.signOut();
				console.log('logout');
			} catch (error) {
				console.log(error);
			}
		};

		$("#login_btn").on("click", () => {
			handleLogin();
		});
		$("#logout_btn").on("click", () => {
			handleLogout();
		});
	});
}
