import React, { useState, useEffect, useReducer } from 'react'
import ReactDOM from 'react-dom'

import styles from "~components/LessonUpcomingCard.module.scss"
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

const LessonUpcomingCard = ({
  BookingID,
  avatar = "default-avatar.png",
  TeacherUID,
  TeacherName,
  LessionName,
  LessionMaterial,
  SpecialRequest = null,
  start,
  end,
  date,
  DocumentName = null,
  SkypeID,
  FileAudio,
  FileAudio1,
  FileAudio2,
  onHandleCancelBooking,
  onHandleRequireLesson,
  lock = {
    id: '',
    lock: false
  },
  cancelable = false,
}) => {

  const handleRequireLesson = (BookingID, avatar, TeacherUID, TeacherName, LessionMaterial, LessionName, SpecialRequest, date, start, end, DocumentName, SkypeID) => {
    onHandleRequireLesson(BookingID, avatar, TeacherUID, TeacherName, LessionMaterial, LessionName, SpecialRequest, date, start, end, DocumentName, SkypeID)
  }

  const handleCancelBooking = (e, BookingID, LessionName, date, start, end) => {
    e.preventDefault()
    onHandleCancelBooking(BookingID, LessionName, date, start, end)
  }
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
  }, [])

  return (
    <li className="cr-item upcoming-lesson lesson-info position-relative">
      <div className={`${lock.id === BookingID && lock.lock ? '' : 'd-none'}`} style={{ zIndex: "99", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}></div>
      <div className="media">
        <div className="teacher-information">
          <a className="teacher-avatar" href={`/ElearnStudent/teacherDetail?ID=${TeacherUID}`}>
            <img src={avatar === "default-avatar.png" ?
              `../assets/img/${avatar}` : avatar}
              className="teacher-image" alt="Avatar"
              onError={(e) => { e.target.onerror = null; e.target.src = "../assets/img/default-avatar.png" }} />
            <p className="course-teacher tx-14 tx-gray-800 tx-normal mg-b-0 tx-center mg-t-5 d-block">
              {TeacherName}</p>
          </a>
        </div>
        <div className="media-body mg-l-20 pos-relative">
          <div>
            <h5 className="mg-b-10 mg-t-10 mg-sm-t-0">
              <span className="badge badge-warning">{t('incoming')}</span>{' '}
              <span className="no-hl course-name tx-bold">{LessionName}</span>
            </h5>
            <div className="course-information tx-14">
              <span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
                <i className="feather-16 mg-r-5" data-feather="calendar"></i>
                {date}</span>
              <span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
                <i className="feather-16 mg-r-5" data-feather="clock"></i>
                {`${t('start')}: ${start}`}</span>
              <span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
                <i className="feather-16 mg-r-5" data-feather="clock"></i>
                {`${t('end')}: ${end}`}</span>
            </div>
            {
              SpecialRequest && <div className="course-note mg-t-15">
                <h6 className="mg-b-3 tx-bold">Ghi chú cho giáo viên:</h6>
                <p className="tx-14 mg-b-0 word-break">{SpecialRequest}</p>
              </div>
            }
            {
              !!DocumentName && <div className="course-docs mg-t-15">
                <h6 className="mg-b-3 tx-bold">{t('materials')}:</h6>
                <div> <a href={LessionMaterial} target="_blank">{DocumentName}</a></div>
              </div>
            }
             {
              !!FileAudio && <div className="course-docs mg-t-15">
                <h6 className="mg-b-3 tx-bold">{t('audio-file')} 1 :</h6>
                <div> <a href={FileAudio} target="_blank">Download</a></div>
              </div>
            }
            {
              !!FileAudio1 && <div className="course-docs mg-t-15">
                <h6 className="mg-b-3 tx-bold">{t('audio-file')} 2 :</h6>
                <div> <a href={FileAudio1} target="_blank">Download</a></div>
              </div>
            }
            {
              !!FileAudio2 && <div className="course-docs mg-t-15">
                <h6 className="mg-b-3 tx-bold">{t('audio-file')} 3 :</h6>
                <div> <a href={FileAudio2} target="_blank">Download</a></div>
              </div>
            }
          </div>
          <div className="course-actions mg-t-15">
            <div className="action-left">
              <a href={`skype:${SkypeID}?chat`}
                className="btn btn-sm btn-info d-flex justify-content-center align-items-center tx-medium"
                rel="noopener">
                <div><i className="fab fa-skype mg-r-5"></i>{t('joinclass-1')}</div>
              </a>
              <a href={"#"} className="btn btn-sm btn-light tx-medium" data-toggle="modal" data-target="#js-md-required"
                onClick={() => handleRequireLesson(
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
                  SkypeID)}>
                <i className="fas fa-edit mg-r-5"></i>{t('note-1')}</a>
            </div>
            <div className="action-right">
              {
                cancelable ? <a href={"#"} className="btn btn-sm btn-outline-danger d-flex justify-content-center align-items-center tx-medium"
                  rel="noopener" data-toggle="tooltip"
                  title="Bạn chỉ có thể hủy lớp 30 phút trước khi vào học !!"
                  onClick={(e) => handleCancelBooking(e, BookingID, LessionName, date, start, end)}
                  data-toggle="modal" data-target="#md-cancel-schedule"
                  data-placement="top">
                  <div><i className="fas fa-times-circle"></i> {t('cancelclass-1')}</div>
                </a> : <button disabled className="btn btn-block btn-disabled btn-sm" data-toggle="tooltip" title="Bạn không thể hủy lớp 30 phút trước khi vào học !!" data-placement="top">
                    <i className="fas fa-times-circle"></i> {t('cancelclass-1')}</button>
              }
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default LessonUpcomingCard;

// ReactDOM.render(
// 	<I18nextProvider i18n={i18next}>
// 		<LessonUpcomingCard />
// 	</I18nextProvider>,
// 	document.getElementById('react-account-dashboard'),
// );