import dateFormat from "dateformat";

export function sendNotification(message, type = "success") {
	window.dispatchEvent(
		new CustomEvent("nbmessage", { detail: { message, type } })
	);
}

export function toCamelCase(value) {
	return value.replace(/-([a-z])/g, function(g) {
		return g[1].toUpperCase();
	});
}

export function toKebabCase(string) {
	return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function urlToHashParams(hash) {
	let hashObject = {};
	if (hash.indexOf("=") > 0) {
		hash
			.split("?")[1]
			.split("&")
			.forEach(param => {
				let split = param.split("=");
				hashObject[toCamelCase(split[0])] = split[1];
			});
	}
	return hashObject;
}

export function hashParamsToURL(baseURL, values) {
	const params = [];
	Object.keys(values).forEach(key =>
		params.push(`${toKebabCase(key)}=${values[key]}`)
	);
	const hashParams = "#?" + params.join("&");
	return baseURL.split("#")[0] + hashParams;
}

export function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function timestamp() {
	let d = new Date();
	d.setMinutes(d.getMinutes() + -d.getTimezoneOffset());
	return d
		.toISOString()
		.replace("T", " ")
		.split(".")[0];
}

export function arrayToMap(array, key) {
	let a = {};
	array.forEach(b => (a[b.id] = b));
	return a;
}

export function arrayToIdx(array, idxField, valueField) {
	if (!array) return {};
	return array.reduce(
		(a, c) => Object.assign(a, { [c[idxField]]: c[valueField] }),
		{}
	);
}

export function applyAdjustmentOnMutation({ newCSS, elementId, timeoutValue }) {
	let wixdone = false;
	function subscriber(mutations) {
		if (wixdone) {
			observer.disconnect();
			return;
		}
		let found;
		mutations.some(a =>
			a.target.id === elementId ? (found = a.target) : false
		);
		if (!found) return;
		wixdone = true;
		found.parentNode.style = newCSS;
	}
	const observer = new MutationObserver(subscriber);
	const config = { attributes: true, subtree: true };
	observer.observe(document.body, config);
	window.setTimeout(() => {
		observer.disconnect();
	}, timeoutValue);
}

export function calculateEarnings(amount, product) {
	const yearlyEarnings =
		(parseInt(amount) / 100) * parseFloat(product.interest_rate);
	const yourEarnings = (yearlyEarnings / 365) * product.tenor;
	return parseInt("" + yourEarnings);
}

export function calculatePortfolioTotals(portfolioItems) {
	let returnsEarned = 0;
	let returnsDue = 0;
	let returnsTotal = 0;
	let currency = "₦";

	portfolioItems.forEach(a => {
		const calculatedEarnings = calculateEarnings(a.amount, a.productJSON);

		// returnsEarned
		if (["LIQUIDATED", "MATURED"].indexOf(a.status) >= 0) {
			returnsEarned += calculatedEarnings;
		}

		// returnsDue
		if (["BOOKED", "PROCESSING", "SUBMITTED"].indexOf(a.status) >= 0) {
			returnsDue += calculatedEarnings;
		}

		// portfolio balance
		if (
			["SUBMITTED", "BOOKED", "PROCESSING", "MATURED"].indexOf(a.status) >= 0
		) {
			returnsTotal += calculatedEarnings + parseInt(a.amount);
		}
	});
	return { returnsEarned, returnsDue, returnsTotal, currency };
}

let id = 0;
export function nextId() {
	return ++id;
}

export function removeItemsByFieldValue(
	array: any[],
	field: string,
	id: string | number
): any[] {
	return array.filter(a => a[field] !== id);
}

export function toYYYYMMDD(date) {
	if (!date) return null;
	return date.toJSON().substr(0, 10);
}

export function formatDate(value) {
	try {
		const date = dateFormat(value + "", "mm/dd/yyyy");
		return date;
	} catch (e) {
		return "-";
	}
}

export function formatDateMMDDYYYYfromYYYYMMDD(value) {
	if (!value) return '-';
	value = value.substr(0,10);
	const [y, m, d] = value.split("-");
	return [m, d, y].join("/");
}

export function correctTimezone(value) {
	const currentDate = new Date();
	const tzOffset = currentDate.getTimezoneOffset();
	const propDate = new Date(value);
	propDate.setHours(propDate.getHours() + tzOffset / 60);
	return propDate;
}

export function saveChangeDateCurry(props) {
	return value => props.onChange(value.toISOString().substr(0, 10));
}
