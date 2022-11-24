import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import NotificationItem from './NotificationItem';
import SkeletonNotification from '~components/common/Skeleton/SkeletonNotification';
import Pagination from 'react-js-pagination';
import { getAllNotification } from '~src/api/studentAPI';
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
const Notification = () => {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [state, setState] = useState([]);
	const [loading, setLoading] = useState(false);
	const { t, i18n } = useTranslation('common');
	const handlePageChange = pageNumber => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAPI({
				page: pageNumber,
			});
		}
	};

	const getAPI = async params => {
		setLoading(true);
		const res = await getAllNotification(params);
		if (res.Code === 1) {
			setState(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
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
		getAPI({
			page,
		});
	}, []);

	return (
		<>
			<div className="Header">
				<Header />
			</div>
			<div className="ProfileSidebar">
				<ProfileSidebar />
			</div>
			<div className="d-xl-flex align-items-center justify-content-between mg-b-15">
				<h4 className="mg-b-0 gradient-heading">
					<i className="fas fa-bell" /> {t('notification')}
				</h4>
			</div>
			<div className="blog__wrapper">
				<div className="row row-sm mg-b-25 blog-list">
					{loading ? (
						<SkeletonNotification />
					) : !!state && Array.isArray(state) && state.length > 0 ? (
						state.map(item => (
							<div
								className="col-md-6 col-lg-4 mg-t-20"
								key={item.NotificationID}
							>
								<NotificationItem
									NotificationID={item.NotificationID}
									NotificationTitle={item.NotificationTitle}
									NotificationIMG={item.NotificationIMG}
									CreatedBy={item.CreatedBy}
									CreatedDate={item.CreatedDate}
									NotificationContent={item.NotificationContent}
									URL={item.URL}
								/>
							</div>
						))
					) : (
						<div className="col-12">
							<span className="tx-danger tx-medium">
								Hiện không có thông báo nào
							</span>
						</div>
					)}
				</div>
				{pageSize < totalResult && (
					<Pagination
						innerClass="pagination justify-content-center"
						activePage={page}
						itemsCountPerPage={pageSize}
						totalItemsCount={totalResult}
						pageRangeDisplayed={3}
						itemClass="page-item"
						linkClass="page-link"
						onChange={handlePageChange.bind(this)}
					/>
				)}
			</div>
			<div className="Header">
				<Footer />
			</div>
		</>
	);
};

// ReactDOM.render(
// 	<Notification />,
// 	document.getElementById('react-notification'),
// );
ReactDOM.render(
	<I18nextProvider i18n={i18next}>
		<Notification />
	</I18nextProvider>,
	document.getElementById('react-notification'),
);
