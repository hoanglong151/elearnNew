export const appSettings = {
	baseURL: 'https://app.e-learn.com.vn/Api',
	key: 'VnVOQG0zODlNb25hRGV2',
	colors: {
		second: '#fd5e8e',
		primary: '#fd7e14',
	},
	selectStyle: {
		control: (oldStyle, state) => {
			return {
				...oldStyle,
				borderColor:
					state.isFocused || state.isSelected || state.isHovered
						? '#fd7e14 !important'
						: '#c0ccda',
				outline: 0,
				boxShadow: state.isFocused
					? '0 0 0 0.2rem rgba(253, 126, 20, 0.25)'
					: 'none',
				borderRadius: '3px',
			};
		},
		multiValue: (oldStyle, state) => {
			return {
				...oldStyle,
				backgroundColor: '#ff750138',
				color: '#fd7e14',
				fontWeight: '500',
				border: '1px solid #fd7914',
			};
		},
		multiValueLabel: (oldStyle, state) => {
			return {
				...oldStyle,
				color: '#fd7e14',
			};
		},
		option: (oldStyle, state) => {
			return {
				...oldStyle,
				backgroundColor: state.isSelected
					? '#fd7e14'
					: state.isFocused
					? 'rgba(253, 126, 20, 0.25)'
					: '#fff',
			};
		},
	},
	UID: 61262, //61240 teacher || 1071 student
};