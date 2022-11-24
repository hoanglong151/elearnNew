import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import SkeletonBlogCard from '~components/common/Skeleton/SkeletonBlogCard';
import { getNotificationDetailAPI } from '~src/api/studentAPI';
import { getFormattedDate } from '~src/utils';
import styles from '~components/BlogDetail/BlogDetail.module.scss';
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
const BlogDetail = () => {
	const [state, setState] = useState(null);
	const [loading, setLoading] = useState(false);
	const { t, i18n } = useTranslation('common');
	const getAPI = async params => {
		setLoading(true);
		const res = await getNotificationDetailAPI(params);
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
		let search = window.location.search;
		let params = new URLSearchParams(search);
		let ID = params.get('ID');
		getAPI({
			NotificationID: ID,
		});
	}, []);

	return (
		<div className="media-body">
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb breadcrumb-style1 mg-b-15">
					<li className="breadcrumb-item tx-primary">
						<a href="/ElearnStudent/notification">
							<i className="fas fa-bell mg-r-5"></i> {t('notification')}
						</a>
					</li>
					{!!state && (
						<li className="breadcrumb-item active" aria-current="page">
							{state.NotificationTitle}
						</li>
					)}
				</ol>
			</nav>
			{loading ? (
				<SkeletonBlogCard />
			) : (
				<>
					<div className="Header">
						<Header />
					</div>
					<div className="ProfileSidebar">
						<ProfileSidebar />
					</div>
					{!!state ? (
						<div className="content-blog pd-15 shadow rounded-5">
							<div className="post-detail-cover">
								<img
									src={state.NotificationIMG}
									alt="banner"
									className="banner-img"
								/>
							</div>
							<div className="post-content">
								<div className="thread_title">
									<span>{state.NotificationTitle}</span>
								</div>
								<div className="author">
									{/* <a href={"#"} className="avatar">
              <img src={state.IMG ? state.IMG : "../assets/img/default-avatar.png"} alt="avatar" />
              </a> */}
									<div className="author-information">
										<span className="main-color bg-transparent username">
											<span className="hasVerifiedBadge">
												{state.CreatedBy}
											</span>
										</span>
										<div className="date-comment-view">
											<span className="date">
												<span
													className="DateTime"
													title={moment(state.CreatedDate).format('LLLL')}
												>
													{getFormattedDate(state.CreatedDate)}
												</span>
											</span>
										</div>
									</div>
								</div>
								<article
									dangerouslySetInnerHTML={{
										__html: state.NotificationContent,
									}}
								></article>
							</div>
						</div>
					) : (
						<div className="card card-custom shadow">
							<div className="card-body tx-center">
								<span className="d-block tx-center tx-danger tx-medium">
									Không có thông báo nào
								</span>
								<img
									src="../assets/img/no-booking.svg"
									alt="image"
									className="wd-200 mg-b-15"
								/>
							</div>
						</div>
					)}{' '}
					<div className="Footer">
						<Footer />
					</div>
				</>
			)}
		</div>
	);
};

// ReactDOM.render(<BlogDetail />, document.getElementById('react-blog-detail'));
ReactDOM.render(
	<I18nextProvider i18n={i18next}>
		<BlogDetail />
	</I18nextProvider>,
	document.getElementById('react-blog-detail'),
);
