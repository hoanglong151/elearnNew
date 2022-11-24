import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import styled from 'styled-components';

import { BookOpen } from '@styled-icons/boxicons-regular/BookOpen';
import { OpenBook } from '@styled-icons/entypo/OpenBook';
import { CancelCircle } from '@styled-icons/icomoon/CancelCircle';
import { TextDocument } from '@styled-icons/entypo/TextDocument';

import LessonHistoryCard from '~components/LessonHistoryCard';
import LessonUpcomingCard from '~components/LessonUpcomingCard';

import RatingLessonModal from '~components/RatingLessonModal';
import RequireLessonModal from '~components/RequireLessonModal';
import CancelBookingLessonModal from '~components/CancelBookingLessonModal';
import PopUpCancelLesson from '~components/PopUpCancelLesson';
import SkeletonLessonCard from '~components/common/Skeleton/SkeletonLessonCard';
import { NOT_DATA_FOUND } from '~components/common/Constant/message';

import { convertDateFromTo, checkCancelTime } from '~src/utils.js';
import { getLessons, getCoursesInfoAPI } from '~src/api/studentAPI';
import { ToastContainer } from 'react-toastify';

import { toast } from 'react-toastify';
import 'react-toastify/scss/main.scss';
import { toastInit } from '~src/utils';
import {
	CANCEL_BOOKING_SUCCESS,
	FETCH_ERROR,
} from '~components/common/Constant/toast';

import { appSettings } from '~src/config';
import styles from '~components/StudentDashboard/StudentDashboard.module.scss';
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
const styledIcon = `
  color: ${appSettings.colors.primary};
  width: 30px;
  height: 30px;
`;
const BookOpenIcon = styled(BookOpen)`
	${styledIcon}
`;
const OpenBookIcon = styled(OpenBook)`
	${styledIcon}
`;
const CancelCircleIcon = styled(CancelCircle)`
	${styledIcon}
`;
const TextDocumentIcon = styled(TextDocument)`
	${styledIcon}
`;

const initialCancelLesson = {
	BookingID: '',
	LessionName: '',
	date: '',
	start: '',
	end: '',
	reason: '',
};
const initialRatingLesson = {
	BookingID: '',
	TeacherUID: '',
	TeacherName: '',
};
const initialRequireLesson = {
	BookingID: '',
	avatar: '',
	TeacherUID: '',
	TeacherName: '',
	LessionName: '',
	LessionMaterial: '',
	SpecialRequest: '',
	date: '',
	start: '',
	end: '',
	DocumentName: '',
	SkypeID: '',
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

const Dashboard = () => {
	const [state, setState] = useState({});
	const [lock, setLock] = useState({
		id: '',
		lock: false,
	});
	const [stateCancelLesson, setStateCancelLesson] = useState(
		initialCancelLesson,
	);
	const [stateRatingLesson, setStateRatingLesson] = useState(
		initialRatingLesson,
	);
	const [stateRequireLesson, setStateRequireLesson] = useState(
		initialRequireLesson,
	);
	const [loading, setLoading] = useState(false);

	const [courseInfo, setCourseInfo] = useState(null);
	const [loadingCourseInfo, setLoadingCourseInfo] = useState(false);

	const cancelToastFail = () => toast.error(FETCH_ERROR, toastInit);

	const handleRatingLesson = (BookingID, TeacherUID, TeacherName) => {
		setStateRatingLesson({
			...stateRatingLesson,
			BookingID,
			TeacherUID,
			TeacherName,
		});
	};
	const { t, i18n } = useTranslation('common');

	const handleRequireLesson = (
		BookingID,
		avatar,
		TeacherUID,
		TeacherName,
		LessionMaterial,
		LessionName,
		SpecialRequest,
		date,
		start,
		end,
		DocumentName,
		SkypeID,
	) => {
		setStateRequireLesson({
			...stateRequireLesson,
			BookingID,
			avatar,
			TeacherUID,
			TeacherName,
			LessionMaterial,
			LessionName,
			SpecialRequest,
			date,
			start,
			end,
			DocumentName,
			SkypeID,
		});
	};

	const handleCancelBooking = (BookingID, LessionName, date, start, end) => {
		setStateCancelLesson({
			...stateCancelLesson,
			BookingID,
			LessionName,
			date,
			start,
			end,
		});
	};

	const cbCancelBooking = (
		id,
		result,
		LessionName,
		date,
		start,
		end,
		reason,
	) => {
		if (result === -1) {
			//Start Call API, lock the card
			setLock({
				id,
				lock: true,
			});
		} else {
			//After call API, unlock the card
			setLock({
				id,
				lock: false,
			});
			if (result === 1) {
				//If cancel lesson success
				let newUpcomingLessions = [...state.UpcomingLessions].filter(
					item => item.BookingID !== id,
				);
				setState({
					...state,
					UpcomingLessions: newUpcomingLessions,
				});
				setStateCancelLesson({
					...stateCancelLesson,
					reason,
				});
				$('#md-cancel-schedule-popup').modal('show');
			} else cancelToastFail(); //Cancel Lesson Fail
		}
	};

	const cbRatingLesson = (result, message, rating, BookingID, TeacherUID) => {
		if (result === 1) {
			//Rating Success
			let newState = { ...state };
			const index = newState.LessionHistory.findIndex(
				item => item.BookingID === BookingID && item.TeacherUID === TeacherUID,
			);
			newState.LessionHistory[index].Rate = rating;
			setState(newState);
		}
	};

	const cbRequireLesson = (SpecialRequest, BookingID, TeacherUID) => {
		let newState = { ...state };
		const index = newState.UpcomingLessions.findIndex(
			item => item.BookingID === BookingID && item.TeacherUID === TeacherUID,
		);
		newState.UpcomingLessions[index].SpecialRequest = SpecialRequest;
		setState(newState);
	};

	const getAPI = async () => {
		setLoading(true);
		const res = await getLessons();
		if (res.Code === 1) {
			setState(res.Data);
		}
		setLoading(false);
	};

	const _getCoursesInfoAPI = async () => {
		setLoadingCourseInfo(true);
		const res = await getCoursesInfoAPI();
		if (res.Code === 1) {
			setCourseInfo({
				...res.Data,
				Message: '',
			});
		} else {
			setCourseInfo({
				Message: res.Message,
			});
		}
		setLoadingCourseInfo(false);
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

		$(function() {
			$('[data-toggle="tooltip"]').tooltip();
		});
		getAPI();
		_getCoursesInfoAPI();
	}, []);

	return (
		<>
			<div className="Header">
				<Header />
			</div>
			<div className="ProfileSidebar">
				<ProfileSidebar />
			</div>
			<div className="overall__summary pd-15">
				{!!courseInfo && !courseInfo.Message ? (
					<>
						{courseInfo.Message !== undefined ? (
							<>
								<div className="overall__summary-info d-flex flex-wrap">
									<div className="course-info">
										<div className="d-flex align-items-center mg-b-30">
											<div className={`course-image mg-r-15`}>
												<img
													src={`../../assets/img/course.svg`}
													className={`wd-60 ht-60 round-circle`}
												/>
											</div>
											<div className={`flex-grow-1`}>
												<a
													href="#"
													className="tx-bold d-block mg-b-5 tx-primary"
												>
													<span className="course-name">
														{courseInfo.CoursesName}
													</span>
												</a>

												<div className="level d-flex flex-wrap  tx-14">
													<div className="start-level my-10 mg-r-30">
														<span className={`mg-r-5 tx-light`}>
															{t('entrylevel')}:{' '}
														</span>
														<span className={`tx-medium`}>
															{!!courseInfo.LevelEnglishPresent
																? courseInfo.LevelEnglishPresent
																: 'Chưa rõ'}
														</span>
													</div>
													<div className="end-level my-10">
														<span className={`mg-r-5 tx-light`}>
															{t('targetlevel')}:{' '}
														</span>
														<span className={`tx-medium`}>
															{!!courseInfo.LevelEnglishDesire
																? courseInfo.LevelEnglishDesire
																: 'Chưa rõ'}
														</span>
													</div>
												</div>
											</div>
										</div>

										<div className="course-progress">
											<div className="progress-wrap">
												<div className="progress-course-bar position-relative">
													<div className="date d-flex flex-wrap justify-content-between">
														<div className="start-date">
															<span>
																{!!courseInfo.StartDate
																	? moment(courseInfo.StartDate).format(
																			'DD/MM/YYYY',
																	  )
																	: 'Chưa bắt đầu'}
															</span>
														</div>
														<div className="end-date">
															<span>
																{!!courseInfo.EndDate
																	? moment(courseInfo.EndDate).format(
																			'DD/MM/YYYY',
																	  )
																	: 'Chưa kết thúc'}
															</span>
														</div>
													</div>
													<div className="progress-bar-wrap">
														<div
															className="progress-bar-wrap-fill"
															data-toggle="tooltip"
															data-placement="top"
															title={`${parseInt(courseInfo.Process * 100)}%`}
															style={{
																width: `${parseInt(courseInfo.Process * 100)}%`,
															}}
														></div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>{' '}
								<div className="overall__summary-summary pd-t-15 d-flex flex-wrap justify-content-between">
									<div className="left d-flex flex-wrap flex-grow-1">
										<div className="summary-item student-summary-item">
											<BookOpenIcon />
											<div className="mg-l-10 title">
												<label className="d-block label">
													{t('lessoncompleted')}
												</label>
												<label className="d-block bold count">
													{!!state &&
														!!state.StudyProcess &&
														state.StudyProcess.CompleteLessions}
												</label>
											</div>
										</div>
										<div className="summary-item student-summary-item">
											<TextDocumentIcon />
											<div className="mg-l-10 title">
												<label className="d-block label">
													{t('lessonsbooked')}
												</label>
												<label className="d-block bold count">
													{!!state &&
														!!state.StudyProcess &&
														state.StudyProcess.NumberOfLessionsLeft}
												</label>
											</div>
										</div>
										<div className="summary-item student-summary-item">
											<OpenBookIcon />
											<div className="mg-l-10 title">
												<label className="d-block label">
													{t('lessonscancelled')}
												</label>
												<label className="d-block bold count">
													{!!state &&
														!!state.StudyProcess &&
														state.StudyProcess.CancelLessions}
												</label>
											</div>
										</div>
										<div className="summary-item student-summary-item">
											<CancelCircleIcon />
											<div className="mg-l-10 title">
												<label className="d-block label">
													{t('noshowlessons')}
												</label>
												<label className="d-block bold count">
													{!!state &&
														!!state.StudyProcess &&
														state.StudyProcess.NumberOfAbsences}
												</label>
											</div>
										</div>
										<div className="summary-item student-summary-item">
											<TextDocumentIcon />
											<div className="mg-l-10 title">
												<label className="d-block label">
													{t('remaininglessons')}
												</label>
												<label className="d-block bold count">
													{!!state &&
														!!state.StudyProcess &&
														state.StudyProcess.TotalLesson -
															state.StudyProcess.CompleteLessions -
															state.StudyProcess.NumberOfLessionsLeft -
															state.StudyProcess.NumberOfAbsences}
												</label>
											</div>
										</div>
									</div>
									{/*  <div className="right">
                  <div className="summary-item">
                    <div>
                      <img src="https://images.unsplash.com/photo-1595534005229-688989c4bf82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
                      <img src="https://images.unsplash.com/photo-1595534005229-688989c4bf82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
                      <img src="https://images.unsplash.com/photo-1595534005229-688989c4bf82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
                      <img src="https://images.unsplash.com/photo-1595534005229-688989c4bf82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
                      <img src="https://images.unsplash.com/photo-1595534005229-688989c4bf82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
                      <span className="other-person bold">5+</span>
                    </div>
                  </div>
                </div> */}
								</div>
							</>
						) : (
							''
						)}
					</>
				) : (
					<div className="tx-center pd-y-30">
						<img
							src={`../../assets/img/course.svg`}
							className={`wd-200 round-circle mg-b-15`}
						/>
						<span className="d-block tx-center tx-danger tx-medium">
							{courseInfo && courseInfo.Message}
						</span>
					</div>
				)}
			</div>
			{!state ? (
				<NOT_DATA_FOUND />
			) : (
				<>
					<div className="lesson mg-t-45 animated fadeInUp am-animation-delay-1">
						<div className="d-xl-flex align-items-center justify-content-between ">
							<h4 className="title-section">{t('upcominglessons')}</h4>
						</div>
						{!!state.UpcomingLessions &&
						!!state.UpcomingLessions &&
						state.UpcomingLessions.length + state.UpcomingLessions.length ===
							0 ? (
							<div className="empty-error tx-center mg-y-15 cr-item bg-white rounded-5 pd-15 shadow">
								<img
									src="../assets/img/no-booking.svg"
									alt="image"
									className="wd-200 mg-b-15"
								/>
								<p className=" tx-danger tx-medium">
									Bạn không có buổi học nào sắp tới
								</p>
								<a
									href="/ElearnStudent/bookingLesson"
									className="btn btn-primary"
								>
									{t('bookinglesson')}
								</a>
							</div>
						) : (
							''
						)}
						<div className="course-horizental mg-t-15">
							<ul className="list-wrap">
								{loading ? (
									<SkeletonLessonCard />
								) : (
									!!state.UpcomingLessions &&
									state.UpcomingLessions.length > 0 &&
									state.UpcomingLessions.map(item => (
										<LessonUpcomingCard
											key={item.BookingID}
											BookingID={item.BookingID}
											TeacherUID={item.TeacherUID}
											avatar={item.TeacherIMG}
											TeacherName={item.TeacherName}
											LessionName={item.LessionName}
											LessionMaterial={item.LessionMaterial}
											SpecialRequest={item.SpecialRequest}
											start={convertDateFromTo(item.ScheduleTimeVN).fromTime}
											end={convertDateFromTo(item.ScheduleTimeVN).endTime}
											date={convertDateFromTo(item.ScheduleTimeVN).date}
											DocumentName={item.DocumentName}
											SkypeID={item.SkypeID}
											FileAudio={item.FileAudio}
											FileAudio1={item.FileAudio1}
											FileAudio2={item.FileAudio2}
											LinkMaterials={item.LinkMaterials}
											onHandleCancelBooking={handleCancelBooking}
											onHandleRequireLesson={handleRequireLesson}
											lock={lock}
											cancelable={checkCancelTime(
												convertDateFromTo(item.ScheduleTimeVN).dateObject,
											)}
										/>
									))
								)}
							</ul>
						</div>
					</div>
					<div className="lesson mg-t-45 animated fadeInUp am-animation-delay-2">
						<div className="d-xl-flex align-items-center justify-content-between ">
							<h4 className="title-section">{t('lessoncompleted')}</h4>
							<a
								href={'/ElearnStudent/lessonHistory'}
								className="link d-flex align-items-center"
							>
								<i className="fas fa-list mg-r-5"></i>
								{t('viewlessonhistory')}
							</a>
						</div>
						<div className="course-horizental mg-t-15">
							<ul className="list-wrap">
								{loading ? (
									<SkeletonLessonCard />
								) : !!state.LessionHistory &&
								  state.LessionHistory.length > 0 ? (
									state.LessionHistory.map(item => (
										<LessonHistoryCard
											key={item.BookingID}
											BookingID={item.BookingID}
											TeacherUID={item.TeacherUID}
											avatar={item.TeacherIMG}
											TeacherName={item.TeacherName}
											LessionName={item.LessionName}
											Status={item.Status}
											start={convertDateFromTo(item.Schedule).fromTime}
											end={convertDateFromTo(item.Schedule).endTime}
											date={convertDateFromTo(item.Schedule).date}
											Rate={item.Rate}
											onHandleRatingLesson={handleRatingLesson}
										/>
									))
								) : (
									<div className="empty-error tx-center mg-y-15 cr-item bg-white rounded-5 pd-15 shadow">
										<img
											src="../assets/img/no-booking.svg"
											alt="image"
											className="wd-200 mg-b-15"
										/>
										<p className=" tx-danger tx-medium">
											Chưa có buổi học nào hoàn thành
										</p>
									</div>
								)}
							</ul>
						</div>
					</div>
				</>
			)}
			<RatingLessonModal
				BookingID={stateRatingLesson.BookingID}
				TeacherUID={stateRatingLesson.TeacherUID}
				TeacherName={stateRatingLesson.TeacherName}
				callback={cbRatingLesson}
			/>

			<RequireLessonModal
				BookingID={stateRequireLesson.BookingID}
				avatar={stateRequireLesson.avatar}
				TeacherUID={stateRequireLesson.TeacherUID}
				TeacherName={stateRequireLesson.TeacherName}
				LessionName={stateRequireLesson.LessionName}
				LessionMaterial={stateRequireLesson.LessionMaterial}
				SpecialRequest={stateRequireLesson.SpecialRequest}
				date={stateRequireLesson.date}
				start={stateRequireLesson.start}
				end={stateRequireLesson.end}
				DocumentName={stateRequireLesson.DocumentName}
				SkypeID={stateRequireLesson.SkypeID}
				callback={cbRequireLesson}
			/>

			<CancelBookingLessonModal
				BookingID={stateCancelLesson.BookingID}
				LessionName={stateCancelLesson.LessionName}
				date={stateCancelLesson.date}
				start={stateCancelLesson.start}
				end={stateCancelLesson.end}
				callback={cbCancelBooking}
			/>

			<PopUpCancelLesson
				LessionName={stateCancelLesson.LessionName}
				date={stateCancelLesson.date}
				start={stateCancelLesson.start}
				end={stateCancelLesson.end}
				reason={stateCancelLesson.reason}
			/>
			<ToastContainer />
			<div className="Footer">
				<Footer />
			</div>
		</>
	);
};
// ReactDOM.render(
// 	<Dashboard />,
// 	document.getElementById('react-account-dashboard'),
// );
ReactDOM.render(
	<I18nextProvider i18n={i18next}>
		<Dashboard />
	</I18nextProvider>,
	document.getElementById('react-account-dashboard'),
);
