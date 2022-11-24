import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import StudentCommentItem from '~components/common/StudentComment/StudentCommentItem';
import SkeletonFeedback from '~components/common/Skeleton/SkeletonFeedback';
import Pagination from 'react-js-pagination';

import { getFeedbackOverviewAPI } from '~src/api/studentAPI';
import { getListEvaluationAPI } from '~src/api/studentAPI';

import styles from '~components/Feedback/Feedback.module.scss';  
import Select, { components } from 'react-select';
import { appSettings } from '~src/config';
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
const FeedbackOption = props => {
	const { data, children } = props;
	const numberStar = parseInt(data.value);

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
		<components.Option {...props}>
			<div className="d-flex justify-content-between align-items-center">
				{numberStar > 0 ? (
					<>
						<span>
							{[...Array(numberStar)].map((item, index) => {
								return (
									<i key={`${index}`} className="fas fa-star tx-warning"></i>
								);
							})}
						</span>
						<span>({data.count})</span>
					</>
				) : (
					<>
						<span>Tất cả đánh giá</span>
						<span>({data.count})</span>
					</>
				)}
			</div>
		</components.Option>
	);
};

const Feedback = () => {
	const [overview, setOverview] = useState({});
	const [loading, setLoading] = useState(false);
	const [loadingListEvaluation, setLoadingListEvaluation] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [filterOption, setFilterOption] = useState({
		label: 'Tất cả đánh giá',
		value: '0',
		count: overview.AllEvaluation,
	});
	const [feedback, setFeedback] = useState([]);
	const [rate, setRate] = useState(0);
	const { t, i18n } = useTranslation('common');
	const handlePageChange = pageNumber => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			_GetListEvaluationAPI({
				Rate: rate,
				Page: pageNumber,
			});
		}
	};

	const getOverViewAPI = async () => {
		setLoading(true);
		const res = await getFeedbackOverviewAPI();
		if (res.Code === 1) {
			setOverview(res.Data);
		}
		setLoading(false);
	};

	const _GetListEvaluationAPI = async params => {
		setLoadingListEvaluation(true);
		const res = await getListEvaluationAPI(params);
		if (res.Code === 1) {
			setFeedback(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		}
		setPage(params.Page);
		setLoadingListEvaluation(false);
	};

	const fetchListEvaluation = e => {
		let rateFilter = parseInt(e.target.value);
		if (rateFilter === rate) return;
		setRate(rateFilter);
		_GetListEvaluationAPI({
			Rate: rateFilter,
			Page: 1,
		});
	};

	useEffect(() => {
		_GetListEvaluationAPI({
			Rate: parseInt(filterOption?.value) ?? 0,
			Page: 1,
		});
	}, [filterOption]);

	useEffect(() => {
		getOverViewAPI();
	}, []);

	return (
		<>
			<div className="Header">
				<Header />
			</div>
			<div className="ProfileSidebar">
				<ProfileSidebar />
			</div>
			{!loading && (
				<>
					<div className="d-sm-flex align-items-center justify-content-between mg-b-30">
						<h4 className="mg-b-0 gradient-heading">
							<i className="fas fa-comment-dots"></i>
							{t('feedback')}
						</h4>
						{overview && Object.keys(overview).length > 0 && (
							<div className="form-group d-inline-block wd-200 mg-b-0-f mg-t-15 mg-sm-t-0-f">
								<Select
									components={{ Option: FeedbackOption }}
									value={filterOption}
									onChange={value => setFilterOption(value)}
									styles={appSettings.selectStyle}
									options={[
										{
											label: 'Tất cả đánh giá',
											value: '0',
											count: overview.AllEvaluation,
										},
										{
											label: '5 Stars',
											count: overview.EvaluationRate5,
											value: '5',
										},
										{
											label: '4 Stars',
											count: overview.EvaluationRate4,
											value: '4',
										},
										{
											label: '3 Stars',
											count: overview.EvaluationRate3,
											value: '3',
										},
										{
											label: '2 Stars',
											count: overview.EvaluationRate3,
											value: '2',
										},
										{
											label: '1 Stars',
											count: overview.EvaluationRate3,
											value: '1',
										},
									]}
									getOptionLabel={option => option.label}
									getOptionValue={option => option.value}
								/>
								{/* <select
									className="form-control main-color bg-white"
									style={{ fontFamily: 'FontAwesome' }}
									onChange={fetchListEvaluation}
								>
									<option value="0">Tất cả ({overview.AllEvaluation})</option>
									<option value="5">
										&#xf005; &#xf005; &#xf005; &#xf005; &#xf005; (
										{overview.EvaluationRate5})
									</option>
									<option value="4">
										&#xf005; &#xf005; &#xf005; &#xf005; (
										{overview.EvaluationRate4})
									</option>
									<option value="3">
										&#xf005; &#xf005; &#xf005; ({overview.EvaluationRate3})
									</option>
									<option value="2">
										&#xf005; &#xf005; ({overview.EvaluationRate2})
									</option>
									<option value="1">
										&#xf005; ({overview.EvaluationRate1})
									</option>
								</select> */}
							</div>
						)}
					</div>
					<div className="fb-summary-container">
						{overview && Object.keys(overview).length > 0 ? (
							<>
								<p className="tx-16 mg-b-0">
									{t('themostrecent100feedbacksoftheteachers')}:{' '}
									<span className="tx-warning tx-20 tx-bold">
										{overview.Avarage}
									</span>
								</p>
							</>
						) : (
							!loading && (
								<div className="tx-center">
									<span className="d-block text-center tx-danger tx-medium">
										Không có dữ liệu
									</span>
									<img
										src="../assets/img/error.svg"
										alt="image"
										className="wd-200 mg-b-15"
									/>
								</div>
							)
						)}
					</div>
				</>
			)}
			<div className="feedback-container">
				{loadingListEvaluation ? (
					<SkeletonFeedback />
				) : (
					<div className="fb-list">
						{!!feedback && feedback.length > 0 ? (
							feedback.map(item => (
								<StudentCommentItem
									key={item.ElearnBookingID}
									ScheduleTimeVN={item.ScheduleTimeVN}
									TeacherName={item.TeacherName}
									TeacherIMG={item.TeacherIMG}
									TeacherUID={item.TeacherUID}
									Note={item.Note}
									Rate={item.Rate}
									LinkDetail={item.LinkDetail}
									DocumentName={item.DocumentName}
								/>
							))
						) : (
							<div className="card card-custom shadow">
								<div className="card-body tx-center">
									<span className="d-block tx-center tx-danger tx-medium">
										Bạn không có phản hồi{' '}
										{filterOption.value !== '0' && (
											<>
												{filterOption.value}
												<i className="fa fa-star"></i>
											</>
										)}{' '}
										nào
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

// ReactDOM.render(<Feedback />, document.getElementById('react-feedback'));
ReactDOM.render(
	<I18nextProvider i18n={i18next}>
		<Feedback />
	</I18nextProvider>,
	document.getElementById('react-feedback'),
);
