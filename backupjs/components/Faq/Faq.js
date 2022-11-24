import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import SkeletonFaq from '~components/common/Skeleton/SkeletonFaq';
import { getFaqAPI } from '~src/api/studentAPI';
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
const Faq = () => {
	const [state, setState] = useState([]);
	const [loading, setLoading] = useState(false);
	const { t, i18n } = useTranslation('common');
	const getAPI = async () => {
		setLoading(true);
		const res = await getFaqAPI();
		if (res.Code === 1) {
			setState(res.Data);
		}
		setLoading(false);
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

	return (
		<>
			<div className="Header">
				<Header />
			</div>
			<div className="ProfileSidebar">
				<ProfileSidebar />
			</div>
			<div className="faq-container">
				<div className="d-xl-flex align-items-center justify-content-between mg-b-15">
					<h4 className="mg-b-0 gradient-heading">
						<i className="fas fa-comment-alt"></i>
						{t('faq')}
					</h4>
				</div>
				{loading ? (
					<SkeletonFaq />
				) : (
					<div id="accordion">
						{!!state && state.length > 0 ? (
							state.map((item, index) => (
								<div className="card" key={item.ID}>
									<div className="card-header" id={item.ID}>
										<h5 className="mb-0">
											<button
												className="btn btn-link collapsed"
												data-toggle="collapse"
												aria-expanded={index === 0 ? 'true' : 'false'}
												data-target={`#collapse${item.ID}`}
												aria-controls={`collapse${item.ID}`}
											>
												{item.Title} / {item.TitleEnglish}
											</button>
										</h5>
									</div>
									<div
										data-parent="#accordion"
										id={`collapse${item.ID}`}
										className={`${index === 0 ? 'show' : ''} collapse`}
										aria-labelledby={item.ID}
									>
										<div
											className="card-body"
											dangerouslySetInnerHTML={{ __html: item.FaqContent }}
										></div>
										<div
											className="card-body"
											dangerouslySetInnerHTML={{ __html: item.FaqContentEnglish }}
										></div>
									</div>
								</div>
							))
						) : (
							<div className="card card-custom shadow">
								<div className="card-body tx-center">
									<span className="d-block tx-center tx-danger tx-medium">
										Không có câu hỏi nào
									</span>
									<img
										src="../assets/img/no-booking.svg"
										alt="image"
										className="wd-200 mg-b-15"
									/>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
			<div className="Footer">
				<Footer />
			</div>
		</>
	);
};

// ReactDOM.render(<Faq />, document.getElementById('react-faq'));
ReactDOM.render(
	<I18nextProvider i18n={i18next}>
		<Faq />
	</I18nextProvider>,
	document.getElementById('react-faq'),
);
