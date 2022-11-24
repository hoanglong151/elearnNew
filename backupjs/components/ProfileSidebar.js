import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import SideMenu from './SideMenu';
import { getProfile } from '~src/api/studentAPI';
import SkeletonProfileSidebar from '~components/common/Skeleton/SkeletonProfileSidebar';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import common_en from '../public/static/locales/en/language.json';
import common_vi from '../public/static/locales/vi/language.json';
i18next.init({
	interpolation: { escapeValue: false },
});
i18next.init({
	interpolation: { escapeValue: false },
	lng: 'vi',
	resources: {
		en: {
			common: common_en,
		},
		vi: {
			common: common_vi,
		},
	},
});
const ProfileSidebar = () => {
	const [state, setState] = useState({});
	const [loading, setLoading] = useState(false);
	const { t, i18n } = useTranslation('common');

	const getAPI = async () => {
		setLoading(true);
		const res = await getProfile();
		if (res.Code === 1) {
			setState(res.Data);
			localStorage.setItem('uid', res.Data.UID);
		}
		setLoading(false);

		if ($('.ProfileSidebar').hasClass('active')) {
			$('.sidebar-overlay').css(
				'left',
				$('.ProfileSidebar').innerWidth() + 'px',
			);
		}
	};

	useEffect(() => {
		var language = window.localStorage.getItem('language');

		if (language.includes('en')) {
			i18next.init({
				interpolation: { escapeValue: false },
				lng: 'en',
				compatibilityJSON: 'v2',
				resources: {
					en: {
						common: common_en,
					},
					vi: {
						common: common_vi,
					},
				},
			});
		} else if (language.includes('vi')) {
			i18next.init({
				interpolation: { escapeValue: false },
				lng: 'vi',
				compatibilityJSON: 'v2',
				resources: {
					en: {
						common: common_en,
					},
					vi: {
						common: common_vi,
					},
				},
			});
		}
		getAPI();
	}, []);

	return loading ? (
		<SkeletonProfileSidebar />
	) : (
		<>
			<div className="profile-sidebar pd-lg-r-25">
				<div className="sidebar-overlay"></div>
				<div className="user__infomation d-flex d-lg-block flex-wrap">
					<div className="w-100 mg-b-15">
						<div className="avatar avatar-xxl avatar-online">
							<img
								src={`${
									state.Avatar
										? state.Avatar
										: '../assets/img/default-avatar.png'
								}`}
								onError={e => {
									e.target.onerror = null;
									e.target.src = '../assets/img/default-avatar.png';
								}}
								className="rounded-circle"
								alt="Avatar"
							/>
						</div>
						<h5 className="bold tx-spacing--1 mg-t-5 text-break pd-x-5 lh-5">
							{state.FullName}
						</h5>
					</div>
					{/*  <div className="col-sm-12 col-md-6 col-lg-12  ">
          <label className="tx-sans tx-10 tx-semibold tx-uppercase tx-color-01 tx-spacing-1 mg-b-15">Contact
        Information</label>
          <ul className="list-unstyled profile-info-list mg-b-10">
            <li><i data-feather="home" /><span>{state.Address}</span></li>
            <li><i data-feather="phone" /><a href="tel:0987654321">{state.Phone}</a></li>
            <li><i data-feather="mail" /><a href={`mailto:${state.Email}`}>{state.Email}</a></li>
          </ul>
        </div> */}
					<div className="col-12 mg-sm-t-0 mg-lg-t-15 mg-lg-b-30">
						<div className="d-flex mg-b-15">
							<a
								className="btn d-block mx-auto flex-fill mg-r-2 tx-white btn-primary "
								href="/ElearnStudent/bookingLesson"
							>
								<i className="far fa-calendar-alt mg-r-5"></i>
								{t('bookinglesson')}
							</a>
						</div>
					</div>
				</div>
				<div className="user__navigation">
					<div className="w-100">
						{/* <label className="tx-sans tx-10 tx-semibold tx-uppercase tx-color-01 tx-spacing-1 mg-b-15">Navigation</label> */}
						<SideMenu />
					</div>
				</div>
			</div>
		</>
	);
};

// const domContainer = document.getElementById('js-component-profilesidebar');
// if (domContainer) {
// 	ReactDOM.render(<ProfileSidebar />, domContainer);
// }
export default ProfileSidebar;
