import moment from 'moment';

export const randomId = () => {
	let dt = new Date().getTime();
	const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (dt + Math.random() * 16) % 16 | 0;
		dt = Math.floor(dt / 16);
		return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
	});
	return uuid;
};

export const convertDay = date => {
	let arrayDate = date.split('/');
	date = new Date(`${arrayDate[1]}/${arrayDate[0]}/${arrayDate[2]}`).getDay();
	switch (date) {
		case 0:
			return 'Sunday';
			break;
		case 1:
			return 'Monday';
			break;
		case 2:
			return 'Tuesday';
			break;
		case 3:
			return 'Wednesday';
			break;
		case 4:
			return 'Thursday';
			break;
		case 5:
			return 'Friday';
			break;
		default:
			return 'Saturday';
			break;
	}
};

export const convertTime = time => {
	time = time.split(':')[0];
	return time <= 12 ? 'AM' : 'PM';
};

export const nationMapToFlag = nation => {
	let map = {
		ca: 'Canada',
		my: 'Malaysia',
		vn: ['Viet Nam', 'Việt Nam'],
		us: 'U.S.',
		jp: 'Japan',
		kr: 'South Korea',
		ph: 'Philippines',
		bg: 'Bangladesh',
		id: 'India',
		th: 'Thailand',
		cn: 'China',
		id: 'Indonesia',
		in: 'India',
	};
	let result;
	for (const [key, value] of Object.entries(map)) {
		if (value === nation || value.includes(nation)) {
			result = key;
			break;
		}
	}
	return result;
};

export const convertDateFromTo = dateStr => {
	const dateArr = dateStr.split('-');
	const date = moment(dateArr[0].trim(), 'DD/MM/YYYY HH:mm').format(
		'dddd, DD/MM/YYYY',
	);
	const dateObject = moment(dateArr[0].trim(), 'DD/MM/YYYY HH:mm').toDate();
	const fromTime = moment(dateArr[0].trim(), 'DD/MM/YYYY HH:mm').format(
		'HH:mm',
	);
	const endTime = dateArr[1].trim();
	return {
		dateObject,
		date,
		fromTime,
		endTime,
	};
};

export const getDifferentMinBetweenTime = (startDate, endDate) => {
	const startTime = startDate.getTime();
	const endTime = endDate.getTime();
	const diffTime = endTime - startTime;
	return Math.floor((diffTime / 1000 / 60) << 0);
};

export const checkCancelTime = startTime => {
	console.log(startTime);
	const diff = getDifferentMinBetweenTime(new Date(startTime), new Date());
	console.log(diff);
	const b = Math.abs(diff) > 30 ? true : false;
	console.log(b);
	return Math.abs(diff) > 30 ? true : false;
};

export const getFormattedDate = dateStr => {
	let result = dateStr;
	if (dateStr && dateStr.includes('-')) {
		const dateArr = dateStr.split('-');
		result = `${dateArr[2].substring(0, 2)}/${dateArr[1]}/${dateArr[0]}`;
	}
	return result;
};

export const toastInit = {
	position: 'top-right',
	autoClose: 3000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: false,
	draggable: true,
	progress: undefined,
};

export const decodeHTML = str => {
	const el = document.createElement('textarea');
	el.innerHTML = str;
	return el.value;
};
export function encodeHTML(s) {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/"/g, '&quot;');
}

export const convertDDMMYYYYtoMMDDYYYY = str => {
	return `${str.split('/')[1]}/${str.split('/')[0]}/${str.split('/')[2]}`;
};

export const nonAccentVietnamese = str => {
	str = str.toLowerCase();
	str = str.replace(
		/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g,
		'a',
	);
	str = str.replace(
		/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g,
		'e',
	);
	str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, 'i');
	str = str.replace(
		/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g,
		'o',
	);
	str = str.replace(
		/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g,
		'u',
	);
	str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, 'y');
	str = str.replace(/\u0111/g, 'd');
	// Some system encode vietnamese combining accent as individual utf-8 characters
	str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
	str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
	return str;
};

export const searchTextInTable = (queryString = '', table) => {
	if (!table) return;
	let filterString = nonAccentVietnamese(queryString).toUppercase();
	let rows = table.querySelectorAll('tbody tr');
	[...rows].map(row => {
		let txt = nonAccentVietnamese(tr.textContent);
		if (txt.toUppercase().indexOf(filterString) > -1) {
			row.style.display = '';
		} else {
			row.style.display = 'none';
		}
	});
};
