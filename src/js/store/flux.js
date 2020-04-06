import { Redirect } from "react-router-dom";

const apiHost = "https://3000-a8a7f3bc-6169-402e-85b3-198f34b5a0a1.ws-us02.gitpod.io";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: "",
			database: [
				{
					title: "TOPESEL 32GB Micro SD Card 2 Pack Memory Cards with High Speed Compatible",
					asin: "B07Z7V34RG",
					link:
						"https://www.amazon.com/gp/slredirect/picassoRedirect.html/ref=sspa_dk_detail_8?ie=UTF8&adId=A0194495351Y18X7XSCFH&qualifier=1584522116&id=7310208867779930&widgetName=sp_detail2&url=%2Fdp%2FB07Z7V34RG%2Fref%3Dsspa_dk_detail_8%3Fpsc%3D1",
					image: "https://m.media-amazon.com/images/I/41aXdpW8KyL._AC_SR160,160_.jpg",
					rating: 4.5,
					ratings_total: 105,
					is_prime: true,
					prices: [
						{
							symbol: "$",
							value: 12.99,
							currency: "USD",
							raw: "$12.99"
						}
					]
				},
				{
					title: "2 Pack of 128GB MicroSD Card with Adapter,U3 A1 MicroSDXC Card 667X",
					asin: "B07YG4TMYL",
					link:
						"https://www.amazon.com/gp/slredirect/picassoRedirect.html/ref=sspa_dk_detail_6?ie=UTF8&adId=A097389530Q9W9NMDT7JM&qualifier=1584522116&id=7310208867779930&widgetName=sp_detail2&url=%2Fdp%2FB07YG4TMYL%2Fref%3Dsspa_dk_detail_6%3Fpsc%3D1",
					image: "https://m.media-amazon.com/images/I/41xhiMUeR6L._AC_SR160,160_.jpg",
					rating: 4.5,
					ratings_total: 123,
					is_prime: true,
					prices: [
						{
							symbol: "$",
							value: 42.99,
							currency: "USD",
							raw: "$42.99"
						}
					]
				},
				{
					title: "Estone 5pcs 1GB SD Cards Security Digital Memory Card with High Speed Compatible",
					asin: "B00N3RMW3A",
					link:
						"https://www.amazon.com/gp/slredirect/picassoRedirect.html/ref=sspa_dk_detail_7?ie=UTF8&adId=A02363681UC9JYCAOGFUO&qualifier=1584522116&id=7310208867779930&widgetName=sp_detail2&url=%2Fdp%2FB00N3RMW3A%2Fref%3Dsspa_dk_detail_7%3Fpsc%3D1",
					image: "https://m.media-amazon.com/images/I/51-mFKe2iEL._AC_SR160,160_.jpg",
					rating: 4.5,
					ratings_total: 193,
					is_prime: true,
					prices: [
						{
							symbol: "$",
							value: 24.99,
							currency: "USD",
							raw: "$24.99"
						}
					]
				}
			],
			create_user: "",
			token: null,
			cart: [],
			cartTotal: 0,
			removeFromCart: []
		},
		actions: {
			saveToken: token => {
				let store = getStore();
				setStore({ token: token });
			},
			createContact: email => {
				fetch(apiHost + "/subscribe", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						contact: {
							email: email
						}
					})
				})
					.then(resp => resp.json())
					.then(response => {
						setStore({ message: response.message });
					});
			},
			createUser: (name, lastname, email, address, city, country, password, history) => {
				//history.push("/registration/confirmation");
				let store = getStore();
				return fetch(apiHost + "/register", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						name: name,
						lastname: lastname,
						email: email,
						address: address,
						city: city,
						country: country,
						password: password
					})
				})
					.then(resp => resp.json())
					.then(response => {
						setStore({ create_user: response.message });
						history.push("/registration/confirmation");
					});
				//.then(() => history.push("/registration/confirmation"));
			},
			login: (email, password) => {
				let store = getStore();
				return fetch(apiHost + "/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: email,
						password: password
					})
				})
					.then(resp => resp.json())
					.then(response => {
						localStorage.setItem("usertoken", JSON.stringify(response.jwt));
						setStore({ token: response.jwt, name: response.name });
					});
			},
			logout: () => {
				setStore({
					token: null
				});
				localStorage.clear();
			},
			addToCart: item => {
				let store = getStore();
				let itemCheck = store.cart.filter(current => item.id === current.id);
				// console.log("itemCheck: ", itemCheck);

				if (itemCheck.length > 0) {
					let index = store.cart.findIndex(current => item.id === current.id);
					store.cart[index].count++;
					// console.log(store.cart[index].count);
				} else {
					item.count = 1;
					store.cart.push(item);
				}

				setStore(store);
			},
			getQty: () => {
				let store = getStore();

				let qty = store.cart.reduce((total, current) => total + current.count, 0);
				// console.log(qty);
				return qty;
			},
			updateCartTotal: () => {
				let store = getStore();

				let cartTotal = store.cart.map(item => {
					return item.count * item.price;
				});
				// console.log(cartTotal);

				store.cartTotal = cartTotal.reduce((total, current) => total + current, 0);

				setStore(store);
			},
			searchbarAPI: input => {
				var url = new URL("https://api.rainforestapi.com/request");
				var params = {
					api_key: process.env.API_KEY,
					type: "search",
					amazon_domain: "amazon.com",
					search_term: input,
					sort_by: "price_high_to_low"
				};
				url.search = new URLSearchParams(params).toString();
				return fetch(url)
					.then(resp => resp.json())
					.then(response => {
						console.log(response);
						setStore({ database: response.search_results });
					});
			},
			increaseQty: index => {
				let store = getStore();
				let editItem = { ...store.cart[index], count: store.cart[index].count + 1 };

				let newArray = [...store.cart];
				newArray[index] = editItem;

				setStore({ cart: newArray });
			},
			decreaseQty: index => {
				let store = getStore();
				if (store.cart[index].count > 0) {
					let editItem = { ...store.cart[index], count: store.cart[index].count - 1 };

					let newArray = [...store.cart];
					newArray[index] = editItem;

					setStore({ cart: newArray });
				}
			},
			deleteSingleItem: itemId => {
				let store = getStore();
				let newArray = store.cart.filter(item => {
					return item.id !== itemId;
				});
				setStore({ cart: newArray });
			},
			removeAllItems: () => {
				let store = getStore();
				setStore({ cart: [] });
			}
		}
	};
};

export default getState;
