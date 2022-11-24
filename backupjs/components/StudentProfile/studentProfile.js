import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import StudentForm from './StudentForm';
import PurchasedCourseList from './PurchasedCourseList';
import PaymentHistory from './PaymentHistory';
import { ToastContainer } from 'react-toastify';

import styles from '~components/StudentProfile/StudentProfile.module.scss';
import Header from '~src/components/Header';
import Footer from '~src/components/Footer';
import ProfileSidebar from '~src/components/ProfileSidebar';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import common_en from '../../public/static/locales/en/language.json';
import common_vi from '../../public/static/locales/vi/language.json';
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
const StudentProfile = () => {
	const [showTab, setShowTab] = useState(1);
	const { t, i18n } = useTranslation('common');

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
	}, []);
	return (
		<>
			<div className="Header">
				<Header />
			</div>
			<div className="ProfileSidebar">
				<ProfileSidebar />
			</div>
			<div class="d-xl-flex align-items-center justify-content-between mg-b-15">
				<h4 class="mg-b-0 gradient-heading">
					<i class="fas fa-address-card"></i>
					{t('mypage')}
				</h4>
			</div>
			<div className="teacher__detail__wrap card-box">
				<div className="teacher__detail">
					<div className="teacher-body mg-t-0-f">
						<div className="tab-navigation">
							<ul className="list-tab align-items-stretch" id="js-list-tab">
								<li className="tab-item h-auto">
									<a
										href={'#'}
										className={`${
											showTab === 1 ? 'active' : ''
										} tab-link h-100`}
										data-index={0}
										onClick={e => {
											e.preventDefault();
											setShowTab(1);
										}}
									>
										<i className="fas fa-user mg-r-5"></i>
										{t('mypage')}
									</a>
								</li>
								<li className="tab-item h-auto">
									<a
										href={'#'}
										className={`${
											showTab === 2 ? 'active' : ''
										} tab-link h-100`}
										data-index={0}
										onClick={e => {
											e.preventDefault();
											setShowTab(2);
										}}
									>
										<i className="fas fa-lock mg-r-5"></i>
										{t('changepassword')}
									</a>
								</li>
								<li className="tab-item h-auto">
									<a
										href={'#'}
										className={`${
											showTab === 3 ? 'active' : ''
										} tab-link h-100`}
										data-index={0}
										onClick={e => {
											e.preventDefault();
											setShowTab(3);
										}}
									>
										<i className="fas fa-credit-card mg-r-5"></i>
										{t('paymentinformation')}
									</a>
								</li>
							</ul>
						</div>
						<div className="tab-navigation-content">
							<div className="swiper-container" id="js-teacher__info">
								<div className="teacher__info-wrap swiper-wrapper">
									<div
										className={`${
											showTab === 1 || showTab === 2 ? 'active' : ''
										} swiper-slide`}
									>
										<div className="slide-tab-content pd-b-15-f">
											<div className="content-block mg-b-0-f">
												<div className="introduce-content">
													<StudentForm tabDisplay={showTab} />
												</div>
											</div>
										</div>
									</div>
									<div
										className={`${showTab === 3 ? 'active' : ''} swiper-slide`}
									>
										<div className="slide-tab-content pd-b-15-f">
											<div className="payment-tab">
												{showTab === 3 && <PaymentHistory />}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<ToastContainer />
			</div>
			<div className="Footer">
				<Footer />
			</div>
		</>
	);
};
// ReactDOM.render(
// 	<StudentProfile />,
// 	document.getElementById('react-student-profile'),
// );
ReactDOM.render(
	<I18nextProvider i18n={i18next}>
		<StudentProfile />
	</I18nextProvider>,
	document.getElementById('react-student-profile'),
);
