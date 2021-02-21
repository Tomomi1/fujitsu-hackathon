const firebaseConfig = {
	apiKey: "AIzaSyBzCSU7FmruYmLsRjgL6o0_61AuX7BLHdw",
		authDomain: "team-h.firebaseapp.com",
		projectId: "team-h",
		storageBucket: "team-h.appspot.com",
		messagingSenderId: "187492545462",
		appId: "1:187492545462:web:0a7c23abe2efc4494b8717",
		measurementId: "G-BGSR3F25EG"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth()

async function initMap() {
	let map = undefined;
	let iconUrl = undefined;
	let description = undefined;
	let color = undefined;
	let infoWindowList = [];
	let count = 0;
	let cardOutput = `
				<div id="right-content">
			`;
	const show = "block";
	const hidden = "none";
	document.getElementById("login_btn").style.display = show;
	document.getElementById("logout_btn").style.display = hidden;

	let selfEvaluation
	db.collection('evaluation').onSnapshot((collection) => {
		const user = auth.currentUser;
		selfEvaluation = user ? collection.docs
			.filter((doc) => doc.data().author === user.uid)
			.map((doc) => doc.data())
			: []
		// 表示中の店舗の評価情報(self)が存在するか
		const storeId = document.getElementById("store").dataset.id;
		const muyEva = selfEvaluation.find(x => x.storeId === storeId)
		if (muyEva) {
			const thumbsUpImg = document.getElementById("thumbs-up-img").src;
			const thumbsDownImg = document.getElementById("thumbs-down-img").src;
			if (muyEva.liked) {
				// likeの場合
				if (thumbsUpImg.includes('gray')) {
					document.getElementById("thumbs-up-img").src = thumbsUpImg.split('gray').join('blue');
				}
				if (thumbsDownImg.includes('blue')) {
					document.getElementById("thumbs-down-img").src = thumbsDownImg.split('blue').join('gray');
				}
			} else {
				// dislikeの場合
				if (thumbsUpImg.includes('blue')) {
					document.getElementById("thumbs-up-img").src = thumbsUpImg.split('blue').join('gray');
				}
				if (thumbsDownImg.includes('gray')) {
					document.getElementById("thumbs-down-img").src = thumbsDownImg.split('gray').join('blue');
				}
			}
			console.log(document.getElementById("thumbs-up-img").src);
			console.log(document.getElementById("thumbs-down-img").src);
		}
	});

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
			const data = {
				...doc.data(),
				id: doc.id
			};
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

			const storeEvaluation = selfEvaluation.filter(x => x.storeId === data.id)
			const likeCount = storeEvaluation.filter(x => x.liked === true).length
			const dislikeCount = storeEvaluation.filter(x => x.liked === false).length

			const thumbsUp = auth.currentUser
				&& storeEvaluation.filter(x => x.author === auth.currentUser.uid)
					.filter(x => x.liked === true)
					? "./images/buttons/thumbs_up_blue.png"
					: "./images/buttons/thumbs_up_gray.png"
				const thumbsDown = auth.currentUser
				&& storeEvaluation.filter(x => x.author === auth.currentUser.uid)
					.filter(x => x.liked === false)
					? "./images/buttons/thumbs_down_blue.png"
					: "./images/buttons/thumbs_down_gray.png"

			const content = `
				<div class="row width: 100% justify-content-around">
					<div class="col-8">
						<div class="d-flex justify-content-between align-items-center p-2">
							<h5 id="content" class="display-8 col-8 m-0 font-weight-bold">${data.name}</h5>
							<div id="store" data-id="${data.id}" class="d-flex justify-content-end col-4">
								<div class="d-flex align-items-center mr-4">
									<button class="btn ml=30" id="thumbs-up">
										<img id="thumbs-up-img" src=${thumbsUp} alt="thumbs_up"">
									</button>
									<p class="m-0">${likeCount}</p>
								</div>
								<div class="d-flex align-items-center mr-4">
									<button class="btn ml=30" id="thumbs-down">
										<img id="thumbs-down-img" src=${thumbsDown} alt="thumbs_down">
									</button>
									<p class="m-0">${dislikeCount}</p>
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
			`;

			count++;
			if (count<6) {
				cardOutput += `
						<div class="card card-body m-3 ml-0 col">
							<h5 id="content" class="display-8 m-0 font-weight-bold">${data.name}</h5>
									<p id="window-description" style="color: ${color}" class="display-8 ml-4 mt-2 mb-0">${description}</p>
									<hr class="mt-2">
									<p class="display-8 ml-4 mb-0">
										<a id="content" href="${data.storeUrl}">店舗URL</a>
									</p>
						</div>
				`;
			} else if (count=6){
				cardOutput += `
						</div>
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
				const output = props.content + cardOutput;
				document.getElementById('output').innerHTML = output;
			});
		}

		// いいね機能
		$(document).on("click", "#thumbs-up", () => {
			console.log("thumbs-up")
			addEvaluation(true);
		});
		$(document).on("click", "#thumbs-down", () => {
			console.log("thumbs-down")
			addEvaluation(false);
		});

		const addEvaluation = async (isLiked) => {
			const user = auth.currentUser;
			if (!user) {
				alert("ログインしてください");
				return;
			}
			console.log(selfEvaluation)
			const storeId = document.getElementById("store").dataset.id;
			if (!storeId) return;
			const evaluated = selfEvaluation.filter(x => x.storeId === storeId)
				.filter(x => x.author === user.uid)
			// すでに評価済みの場合
			if (evaluated.length) {
				if (evaluated[0].liked === isLiked) {
					console.log('評価済み');
				} else {
					console.log('未評価');
					const targetIdList = []
					const qs = await db.collection('evaluation').where("storeId", "==", storeId)
						.get()
					qs.forEach((doc) => {
						targetIdList.push({id: doc.id, ...doc.data()});
					})
					targetIdList.forEach(x => {
						const evaluationRef = db.collection("evaluation").doc(x.id);
						evaluationRef.update({storeId: x.storeId, author: x.author, liked: isLiked})
					})
				}
				return;
			}

			// まだ評価していない場合
			db.collection('evaluation').add({
				liked: isLiked,
				storeId: document.getElementById("store").dataset.id,
				author: user.uid
			})
		}

		// ユーザー認証
		const handleLogin = async () => {
			const provider = new firebase.auth.GoogleAuthProvider();
			if (!provider) return
			try {
				await auth.signInWithPopup(provider).catch(function (error) {
					// Handle Errors here.
					var errorCode = error.code;
					console.log(errorCode);
					alert(errorCode);

					var errorMessage = error.message;
					console.log(errorMessage);
					alert(errorMessage);
				});
				// ログイン中のユーザー取得
				const user = auth.currentUser;
				if (user) {
					document.getElementById("user_email").innerHTML = user.email;
				  document.getElementById("login_btn").style.display = hidden;
					document.getElementById("logout_btn").style.display = show;
				}
			} catch (error) {
				console.log(error);
			}
		};

		const handleLogout = async () => {
			try {
				document.getElementById("user_email").innerHTML = '';
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
