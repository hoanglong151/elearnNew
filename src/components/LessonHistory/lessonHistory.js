import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import LessonItem from './LessonItem';
import Pagination from 'react-js-pagination';
import { getLessonHistory } from '~src/api/studentAPI';
import { convertDateFromTo } from '~src/utils.js';
import SkeletonLessonHistoryCard from '~components/common/Skeleton/SkeletonLessonHistoryCard';
import Flatpickr from 'react-flatpickr';
import styles from '~components/LessonHistory/lessonHistory.module.scss';
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
let start = '';
let end = '';

const initialState = {
	fromDate: '',
	toDate: '',
};

const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'STATE_CHANGE': {
			return {
				...prevState,
				[payload.key]: payload.value,
			};
		}
		default:
			return prevState;
			break;
	}
};

const LessonHistory = () => {
	const [searchInput, dispatch] = useReducer(reducer, initialState);
	const [data, setData] = useState({});
	const { t, i18n } = useTranslation('common');
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);

	const [loading, setLoading] = useState(true);

	const getAPI = async params => {
		setLoading(true);
		const res = await getLessonHistory(params);
		if (res.Code === 1) {
			setData(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		} else {
			setData({});
		}
		setLoading(false);
	};

	const handlePageChange = pageNumber => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAPI({
				FromDate: searchInput.fromDate,
				ToDate: searchInput.toDate,
				Page: pageNumber,
			});
		}
	};

	const onSubmit = e => {
		e.preventDefault();
		getAPI({
			FromDate: searchInput.fromDate,
			ToDate: searchInput.toDate,
			Page: 1,
		});
		setPage(1);
		start = searchInput.fromDate;
		end = searchInput.toDate;
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
			FromDate: searchInput.fromDate,
			ToDate: searchInput.toDate,
			Page: 1,
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
					<i className="fas fa-calendar-check"></i>
					{t('lessonhistory')}
				</h4>
			</div>
			<div className="fb-summary-container pd-x-20-f pd-b-0-f pd-t-20-f ">
				<form
					action=""
					method="get"
					noValidate
					className="st-date metronic-form"
					onSubmit={onSubmit}
				>
					<div className="row">
						<div className="col-12 col-sm-6 col-md-4 form-group">
							<Flatpickr
								placeholder={t('fromdate')}
								options={{
									dateFormat: 'd/m/Y',
									maxDate: searchInput.toDate,
									static: true,
								}}
								className="form-control"
								onChange={(selectedDates, dateStr, instance) => {
									dispatch({
										type: 'STATE_CHANGE',
										payload: { key: 'fromDate', value: dateStr },
									});
								}}
							/>
						</div>
						<div className="col-12 col-sm-6 col-md-4 form-group">
							<Flatpickr
								placeholder={t('todate')}
								options={{
									dateFormat: 'd/m/Y',
									minDate: searchInput.fromDate,
									static: true,
								}}
								className="form-control"
								onChange={(selectedDates, dateStr, instance) => {
									dispatch({
										type: 'STATE_CHANGE',
										payload: { key: 'toDate', value: dateStr },
									});
								}}
							/>
						</div>
						<div className="form-group col-md-4">
							<button type="submit" className="btn btn-primary btn-block">
								<i className="fa fa-search mg-r-5"></i>
								{t('search')}
							</button>
						</div>
					</div>
				</form>
			</div>
			<div className="table-responsive shadow bg-white rounded-5">
				<table className="table">
					<thead className="thead-primary">
						<tr>
							<th>{t('scheduletime')}</th>
							<th>{t('courseplan')}</th>
							<th>{t('syllabus')}</th>
							<th>{t('lessonname')}</th>
							<th>{t('audio-file')}</th>
							<th>{t('teachername')}</th>
							<th>{t('status')}</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<SkeletonLessonHistoryCard column={6} />
						) : !!data && Array.isArray(data) && data.length > 0 ? (
							data.map(item => (
								<LessonItem
									key={item.BookingID}
									BookingID={item.BookingID}
									DocumentID={item.DocumentID}
									CoursesName={item.CoursesName}
									DocumentName={item.DocumentName}
									DocumentDetailID={item.DocumentDetailID}
									LessionName={item.LessionName}
									LessonDetail={item.LessonDetail}
									LessionMaterial={item.LessionMaterial}
									start={convertDateFromTo(item.Schedule).fromTime}
									end={convertDateFromTo(item.Schedule).endTime}
									date={item.Schedule}
									TeacherUID={item.TeacherUID}
									TeacherName={item.TeacherName}
									Status={item.Status}
									StatusString={item.StatusString}
									FileAudio={item.FileAudio}
									FileAudio1={item.FileAudio1}
									FileAudio2={item.FileAudio2}
								/>
							))
						) : data.length == 0 ? (
							<tr className="bg-transparent">
								<td colSpan="6" className="tx-center">
									<span className="tx-danger tx-medium">
										{start.length > 0 && end.length > 0
											? `Bạn chưa đăng ký lớp học nào từ ${
													start.length > 0 ? `${start}` : ''
											  }  ${end.length > 0 ? `đến ${end}` : ''}`
											: start.length == 0 && end.length == 0
											? `Bạn chưa đăng ký lớp học nào`
											: start.length == 0
											? `Bạn chưa đăng ký lớp học nào trước ${end}`
											: `Bạn chưa đăng ký lớp học nào sau ${start}`}
									</span>
									<img
										src="../assets/img/no-booking.svg"
										alt="image"
										className="wd-200 d-block mx-auto"
									/>
									<a
										href="/ElearnStudent/bookingLesson"
										className="btn btn-primary"
									>
										Đặt lịch học
									</a>
								</td>
							</tr>
						) : (
							!loading && (
								<tr className="bg-transparent">
									<td colSpan="6" className="tx-center">
										<span className="d-block text-center tx-danger tx-medium">
											Đã có lỗi xảy ra, xin vui lòng thử lại
										</span>
										<img
											src="../assets/img/error.svg"
											alt="image"
											className="wd-200 mg-b-15"
										/>
									</td>
								</tr>
							)
						)}
					</tbody>
				</table>
			</div>
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
			<div className="Footer">
				<Footer />
			</div>
		</>
	);
};

// ReactDOM.render(
// 	<LessonHistory />,
// 	document.getElementById('react-lesson-history'),
// );
ReactDOM.render(
	<I18nextProvider i18n={i18next}>
		<LessonHistory />
	</I18nextProvider>,
	document.getElementById('react-lesson-history'),
);
