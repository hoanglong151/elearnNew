import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { randomId } from '~src/utils';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'react-js-pagination';

import styles from '~components/StudentMessage/StudentMessage.module.scss';
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
let initialState = [
	{
		id: randomId(),
		time: new Date(),
		content:
			'Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor',
	},
	{
		id: randomId(),
		time: '2020-08-14T11:01:22',
		content:
			'Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor',
	},
	{
		id: randomId(),
		time: '2020-08-14T10:01:22',
		content:
			'Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor',
	},
	{
		id: randomId(),
		time: '2020-08-13T11:01:22',
		content:
			'Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor',
	},
	{
		id: randomId(),
		time: '2020-07-29T16:34:22',
		content:
			'Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor',
	},
	{
		id: randomId(),
		time: '2020-05-29T16:34:22',
		content:
			'Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor',
	},
	{
		id: randomId(),
		time: '2020-01-29T16:34:22',
		content:
			'Lorem isum favor Lorem isum favor Lorem isum favor Lorem isum favor',
	},
];
const StudentMessage = () => {
	const [state, setState] = useState(null);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const { t, i18n } = useTranslation('common');
	const handlePageChange = pageNumber => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAPI();
		}
	};

	const getAPI = async () => {
		setLoading(true);
		setState(initialState);
		setPageSize(5);
		setTotalResult(initialState.length);
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
			<div className="card card-custom shadow">
				<div className="card-body">
					<div className="notification-wrap">
						{loading ? (
							<>
								<div
									className="d-flex pd-b-10"
									style={{ borderBottom: '1px solid #eee' }}
								>
									<Skeleton circle={true} height={48} width={48} />
									<div className="mg-l-10 w-100">
										<Skeleton
											className="d-block mg-y-5"
											height={12}
											width={66}
										/>
										<Skeleton className="mg-b-10" height={20} width={`80%`} />
									</div>
								</div>
								<div
									className="d-flex pd-y-10"
									style={{ borderBottom: '1px solid #eee' }}
								>
									<Skeleton circle={true} height={48} width={48} />
									<div className="mg-l-10 w-100">
										<Skeleton
											className="d-block mg-y-5"
											height={12}
											width={66}
										/>
										<Skeleton className="mg-b-10" height={20} width={`70%`} />
									</div>
								</div>
								<div
									className="d-flex pd-y-10"
									style={{ borderBottom: '1px solid #eee' }}
								>
									<Skeleton circle={true} height={48} width={48} />
									<div className="mg-l-10 w-100">
										<Skeleton
											className="d-block mg-y-5"
											height={12}
											width={66}
										/>
										<Skeleton className="mg-b-10" height={20} width={`90%`} />
									</div>
								</div>
								<div
									className="d-flex pd-y-10"
									style={{ borderBottom: '1px solid #eee' }}
								>
									<Skeleton circle={true} height={48} width={48} />
									<div className="mg-l-10 w-100">
										<Skeleton
											className="d-block mg-y-5"
											height={12}
											width={66}
										/>
										<Skeleton className="mg-b-10" height={20} width={`70%`} />
									</div>
								</div>
								<div className="d-flex pd-t-10">
									<Skeleton circle={true} height={48} width={48} />
									<div className="mg-l-10 w-100">
										<Skeleton
											className="d-block mg-y-5"
											height={12}
											width={66}
										/>
										<Skeleton className="mg-b-10" height={20} width={`60%`} />
									</div>
								</div>
							</>
						) : !!state && state.length > 0 ? (
							state.map(item => (
								<div className="notification-item d-flex" key={item.id}>
									<div className="avatar avatar-md avatar-online flex-shrink-0">
										<img
											src="../assets/img/teacher.jpg"
											className="rounded-circle"
											alt="Avatar"
										/>
									</div>
									<div className="mg-l-10">
										<span
											className="notification-time tx-gray-500 font-italic"
											style={{ fontSize: '12px' }}
										>
											{moment(item.time)
												.startOf('minute')
												.fromNow()}
										</span>
										<p className="notification-content mg-0 position-relative word-break">
											{item.content}
										</p>
									</div>
								</div>
							))
						) : (
							<div className="text-center">
								<span className="d-block tx-danger tx-medium">
									Bạn không có thông báo nào
								</span>
								<img
									src="../assets/img/no-booking.svg"
									alt="image"
									className="wd-200 mg-b-15"
								/>
							</div>
						)}
						{pageSize < totalResult && (
							<Pagination
								innerClass="pagination justify-content-end mt-3"
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
				</div>
			</div>
			<div className="Footer">
				<Footer />
			</div>
		</>
	);
};
// ReactDOM.render(<StudentMessage />, document.getElementById('react-message'));
ReactDOM.render(
	<I18nextProvider i18n={i18next}>
		<StudentMessage />
	</I18nextProvider>,
	document.getElementById('react-message'),
);
