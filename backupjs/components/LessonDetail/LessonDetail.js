import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import SkeletonLessonDetail from '~components/common/Skeleton/SkeletonLessonDetail';
import RatingLessonModal from '~components/RatingLessonModal';
import { getEvaluation } from '~src/api/studentAPI';
import { ToastContainer } from 'react-toastify';
import { decodeHTML } from '~src/utils';
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
import styles from '~components/LessonDetail/LessonDetail.module.scss';

const renderRatingStars = rate => {
	return rate == 5 ? (
		<span className="badge badge-light text-white bg-success mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Excellent
		</span>
	) : rate == 4 ? (
		<span className="badge badge-light text-white bg-success mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Good
		</span>
	) : rate == 3 ? (
		<span className="badge badge-light text-white bg-info mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Average
		</span>
	) : rate == 2 ? (
		<span className="badge badge-light text-white bg-warning mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Bad
		</span>
	) : rate == 1 ? (
		<span className="badge badge-light text-white bg-danger mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Very Bad
		</span>
	) : (
		<span className="badge badge-light text-white bg-black-4 mg-l-5">
			Not Rated
		</span>
	);
};
const LangOptions = [
	{
		value: 'vi',
		label: 'Vietnamese',
		flag: 'vn',
	},
	{
		value: 'en',
		label: 'English',
		flag: 'us',
	},
];
const LessonDetail = () => {
	const [state, setState] = useState({});
	const [loading, setLoading] = useState(false);

	const getAPI = async params => {
		setLoading(true);
		const res = await getEvaluation(params);
		if (res.Code === 1) {
			setState(res.Data);
		}
		setLoading(false);
	};

	const { t, i18next } = useTranslation('common');
	const onCallbackRating = (result, message, rating, BookingID, TeacherUID) => {
		if (result === 1) {
			setState({
				...state,
				StudentEvaluation: message,
				StudentRate: rating,
			});
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
	}, []);
	useEffect(() => {
		let search = window.location.search;
		let params = new URLSearchParams(search);
		let ID = params.get('ID');
		getAPI({
			ElearnBookingID: ID,
		});
	}, []);

	return (
		<>
			{loading ? (
				<SkeletonLessonDetail />
			) : (
				<>
					<div className="Header">
						<Header />
					</div>
					<div className="ProfileSidebar">
						<ProfileSidebar />
					</div>
					<div className="media-body-wrap pd-15 shadow">
						<div className="row">
							<div className="col-md-6 col-sm-12">
								{/* <!--thông tin buổi học--> */}
								<div className="st-thontinbuoihoc">
									<h5 className="main-title">{t('courseinformation')}</h5>
									<div className="infomation__wrap">
										<div className="st-time">
											<p className="st-teacher-text">
												<i className="fa fa-book st-icon wd-20 mg-r-5"></i>
												<span>
													{t('courseplan')}: <span>{state.DocumentName}</span>
												</span>
											</p>
										</div>
										<div className="st-time">
											<p className="st-time-text">
												<i className="fa fa-user-clock st-icon wd-20 mg-r-5"></i>
												<span className="tx-black tx-normal">
													{t('lessonschedule')}:{' '}
												</span>
												<span>{state.ScheduleTimeVN}</span>
											</p>
										</div>
										<div className="st-time">
											<p className="st-teacher-text">
												<i className="fas fa-chalkboard-teacher st-icon wd-20 mg-r-5"></i>
												<span>{t('teachername')}:</span>{' '}
												<span className="st-tengv">{state.TeacherName}</span>
											</p>
										</div>
										<div className="st-time">
											<p className="st-teacher-text">
												<i className="fa fa-book-open st-icon wd-20 mg-r-5"></i>
												<span>
													{t('materials')}:{' '}
													<a
														href={state.MaterialLink}
														target="_blank"
														rel="noreferrer"
													>
														{state.Material}
													</a>{' '}
												</span>
											</p>
										</div>
									</div>
								</div>
								{/* <!--/thông tin buổi học--> */}
							</div>
							<div className="col-md-6 col-sm-12">
								{/* <!--thang danh gia--> */}
								<div className="st-thangdanhgia">
									<h5 className="main-title">{t('feedback')}</h5>
									{(state.Rate == 0 || state.Rate) && (
										<div className="d-block mg-b-15 st-rating">
											<div className="cell text-left">
												<i className="fas fa-chalkboard-teacher st-icon wd-20 mg-r-5"></i>
												<span className="mg-r-5">{t('teachername')}:</span>
												<div className="d-inline-block st-noidung-rating">
													<div className="rating-stars">
														<span className="empty-stars">
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
														</span>
														<span
															className="filled-stars"
															style={{ width: `${state.Rate * 20}%` }}
														>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
														</span>
													</div>
													{renderRatingStars(state.Rate)}
												</div>
											</div>
										</div>
									)}
									{(state.StudentRate == 0 || state.StudentRate) && (
										<div className="d-block st-rating">
											<div className="cell text-left">
												<i className="fas fa-user-graduate st-icon wd-20 mg-r-5"></i>
												<span className="mg-r-5">{t('student')}:</span>
												<div className="d-inline-block st-noidung-rating">
													<div className="rating-stars">
														<span className="empty-stars">
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
														</span>
														<span
															className="filled-stars"
															style={{ width: `${state.StudentRate * 20}%` }}
														>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
														</span>
													</div>
													{renderRatingStars(state.StudentRate)}
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="review__wrap mg-t-15 sec">
							<h5 className="main-title">{t('nhanxet')}</h5>
							{/*  <!--Đánh giá giáo viên--> */}
							<div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">{t('teacher’sfeedback')}</h5>
								</div>
								{state.Note ? (
									<div className="st-item-danhgia tx-gray-500">
										<p
											className="word-break"
											dangerouslySetInnerHTML={{
												__html: decodeHTML(state.Note),
											}}
										></p>
									</div>
								) : (
									''
								)}
							</div>
							{/* <!--/Đánh giá giáo viên-->*/}
							{/* <!--/Đánh giá ngữ pháp-->*/}
							<div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">{t('grammar')}</h5>
								</div>
								<div className="row">
									{state.Grammar ? (
										<div className="col-12">
											<div className="st-item-danhgia tx-gray-500">
												<p
													className="word-break"
													dangerouslySetInnerHTML={{
														__html: decodeHTML(state.Grammar),
													}}
												></p>
											</div>
										</div>
									) : (
										''
									)}
								</div>
							</div>
							{/* <!--/Đánh giá ngữ pháp-->
                      <!--Đánh giá phát âm--> */}
							<div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">{t('pronunciation')}</h5>
								</div>
								<div className="row">
									{state.Pronunciation ? (
										<div className="col-12">
											<div className="st-item-danhgia tx-gray-500">
												<p
													className="word-break"
													dangerouslySetInnerHTML={{
														__html: decodeHTML(state.Pronunciation),
													}}
												></p>
											</div>
										</div>
									) : (
										''
									)}
								</div>
							</div>
							{/* <!--/Đánh giá phát âm-->
                      <!--Đánh giá từ vựng--> */}
							<div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">{t('vocabulary')}</h5>
								</div>
								<div className="row">
									{state.Vocabulary ? (
										<div className="col-12">
											<div className="st-item-danhgia tx-gray-500">
												<p
													className="word-break"
													dangerouslySetInnerHTML={{
														__html: decodeHTML(state.Vocabulary),
													}}
												></p>
											</div>
										</div>
									) : (
										''
									)}
								</div>
							</div>
							{/* <!--/Đánh giá từ vựng-->
                      <!--Từ cần ghi nhớ--> */}
							<div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">
										{t('oralexpressionandsentencedevelopment')}
									</h5>
								</div>
								{state.SentenceDevelopmentAndSpeak ? (
									<div className="st-item-danhgia tx-gray-500">
										<p
											className="word-break"
											dangerouslySetInnerHTML={{
												__html: decodeHTML(state.SentenceDevelopmentAndSpeak),
											}}
										></p>
									</div>
								) : (
									''
								)}
							</div>
							{/* <!--/Từ cần ghi nhớ-->
                   			<!--Đánh giá học viên--> */}
							<div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">
										{t('student’sfeedbackaboutthelesson')}
									</h5>
								</div>
								{Object.keys(state).length === 0 ? (
									''
								) : state.StudentEvaluation ? (
									<div className="st-item-danhgia tx-gray-500">
										<p
											className="word-break"
											dangerouslySetInnerHTML={{
												__html: decodeHTML(state.StudentEvaluation),
											}}
										></p>
									</div>
								) : (
									<>
										<p className="tx-danger">
											Bạn chưa đánh giá về lớp học này
										</p>
										<button
											className="btn btn-primary mg-r-10"
											data-toggle="modal"
											data-target="#js-md-rate"
										>
											Đánh Giá
										</button>
									</>
								)}
							</div>
						</div>
						<RatingLessonModal
							BookingID={state.ElearnBookingID}
							TeacherUID={state.TeacherUID}
							TeacherName={state.TeacherName}
							callback={onCallbackRating}
						/>
					</div>
					<div className="Footer">
						<Footer />
					</div>
				</>
			)}
			<ToastContainer />
		</>
	);
};

// ReactDOM.render(
// 	<LessonDetail />,
// 	document.getElementById('react-lesson-detail'),
// );
ReactDOM.render(
	<I18nextProvider i18n={i18next}>
		<LessonDetail />
	</I18nextProvider>,
	document.getElementById('react-lesson-detail'),
);
