import { observable, action } from "mobx";

class LocationStore {
	@observable hash: string = '';
	@observable q: string = '';

	constructor(){
		window.addEventListener("hashchange", this.locationHashChanged, false);
		this.locationHashChanged({newURL:window.location.href});
	}

	@action.bound
	locationHashChanged = ( e ) => {
		let _hash = e.newURL.split('#')[1] || '';
		let [hash, q] = _hash.split('?');
		this.hash = hash;
		this.q = q;
	}
}

export default LocationStore;