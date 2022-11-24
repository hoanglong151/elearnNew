import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import styles from '~components/LessonHistoryCard.module.scss';

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


const LessonHistoryCard = ({
	onHandleRatingLesson,
	BookingID,
	avatar = 'default-avatar.png',
	TeacherUID,
	TeacherName,
	LessionName,
	Status,
	note = '',
	start,
	end,
	date,
	Rate,
}) => {
	const handleRatingLesson = (BookingID, TeacherUID, TeacherName) => {
		onHandleRatingLesson(BookingID, TeacherUID, TeacherName);
	};
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
		feather.replace();
	}, []);

	return (
		<>
			<li className="cr-item lesson-history lesson-info">
				<div className="media">
					<div className="teacher-information">
						<a
							className="teacher-avatar"
							href={`/ElearnStudent/teacherDetail?ID=${TeacherUID}`}
						>
							<img
								src={
									avatar === 'default-avatar.png'
										? `../assets/img/${avatar}`
										: avatar
								}
								className="teacher-image"
								alt="Avatar"
								onError={e => {
									e.target.onerror = null;
									e.target.src = '../assets/img/default-avatar.png';
								}}
							/>
							<p className="course-teacher tx-14 tx-gray-800 tx-normal mg-b-0 tx-center mg-t-5 d-block">
								{TeacherName}
							</p>
						</a>
					</div>
					<div className="media-body mg-l-20 pos-relative">
						<div>
							<h5 className="mg-b-10 mg-t-10 mg-sm-t-0">
								<span className="badge badge-success">{t('finish')}</span>{' '}
								<a
									href={`/ElearnStudent/lessonDetail?ID=${BookingID}`}
									className="no-hl course-name tx-bold"
								>
									{LessionName}
								</a>
							</h5>
							<div className="course-information tx-14">
								<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
									<i className="feather-16 mg-r-5" data-feather="calendar"></i>
									{date}
								</span>
								<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
									<i className="feather-16 mg-r-5" data-feather="clock"></i>
									{`${t('start')}: ${start}`}
								</span>
								<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
									<i className="feather-16 mg-r-5" data-feather="clock"></i>
									{`${t('end')}: ${end}`}
								</span>
							</div>
							{note && (
								<div className="course-note mg-t-15">
									<h6 className="mg-b-3 tx-bold">{t('notestoteacher')}:</h6>
									<p className="tx-14 mg-b-0">{note}</p>
								</div>
							)}
							<div className="course-rate mg-t-15">
								<h6 className="mg-b-10 tx-bold">{t('evaluate-the-lesson')}:</h6>
								<div className="rating-wrap ">
									{Status === 3 || Status === 4 ? (
										<span className="tx-danger tx-medium">
											Lớp học này đã bị hủy.
										</span>
									) : Rate ? (
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
												style={{ width: `${Rate * 20}%` }}
											>
												<i className="star fa fa-star"></i>
												<i className="star fa fa-star"></i>
												<i className="star fa fa-star"></i>
												<i className="star fa fa-star"></i>
												<i className="star fa fa-star"></i>
											</span>
										</div>
									) : (
										<a
											href={'#'}
											className="rate-now"
											data-toggle="modal"
											data-target="#js-md-rate"
											onClick={() =>
												handleRatingLesson(BookingID, TeacherUID, TeacherName)
											}
										>
											Để lại đánh giá!
										</a>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</li>
		</>
	);
};

export default LessonHistoryCard;
