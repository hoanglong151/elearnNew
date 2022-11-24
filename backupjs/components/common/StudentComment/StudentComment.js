import React,{ useEffect} from 'react';
import ReactDOM from 'react-dom';
import styles from '~components/common/StudentComment/StudentCommentItem.module.scss';
import { decodeHTML } from "~src/utils"
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import common_en from '../../../public/static/locales/en/language.json';
import common_vi from '../../../public/static/locales/vi/language.json';
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
const StudentCommentItem = ({
  ScheduleTimeVN,
  TeacherName,
  TeacherIMG,
  TeacherUID,
  Note,
  Rate,
  LinkDetail,
  DocumentName,

  CreatedDate,
  Evaluation,
  StudentIMG,
  StudentName,
}) => {
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
	}, []);
  return (
    <div className="fb-item">
      <div className="fb-avatar">
        <img src={!!TeacherIMG ? TeacherIMG : !!StudentIMG ? StudentIMG : "../assets/img/default-avatar.png"}
        alt="avatar" className="avatar"
        onError={(e)=>{e.target.onerror = null; e.target.src="../assets/img/default-avatar.png"}} />
      </div>
      <div className="fb-info">
        <div className="name-rating">
          {
            !!TeacherName ?
            <a className="no-hl" href={`/ElearnStudent/teacherDetail?ID=${TeacherUID}`}><p className="name">{TeacherName}</p></a>: 
            !!StudentName ?
            <p className="name">{StudentName}</p>: ""
          }
          <div className="rating-wrap">
            <div className="rating-stars">
              <span className="empty-stars">
                <i className="star fa fa-star"></i>
                <i className="star fa fa-star"></i>
                <i className="star fa fa-star"></i>
                <i className="star fa fa-star"></i>
                <i className="star fa fa-star"></i>
              </span>
              <span className="filled-stars" style={{ width: `${Rate * 20}%` }}>
                <i className="star fa fa-star"></i>
                <i className="star fa fa-star"></i>
                <i className="star fa fa-star"></i>
                <i className="star fa fa-star"></i>
                <i className="star fa fa-star"></i>
              </span>
            </div>
          </div>
        </div>
        <div className="feedback-comment">
        <p className="word-break" dangerouslySetInnerHTML={{ __html: decodeHTML(!!Note ? Note: !!Evaluation ? Evaluation : "") }}></p>
        </div>
        <div className="metas">
          {
            ScheduleTimeVN ? <div className="meta">{t('bktime')}: <span>{ScheduleTimeVN} </span>  </div>:
            CreatedDate ? <div className="meta">{t('bktime')}: <span>{moment(CreatedDate).format("LLLL")}</span> </div>: ""
          }
          {
            DocumentName && <div className="meta">{DocumentName}</div>
          }
        </div>
        {
          LinkDetail && <div className="readmore">
          <a href={LinkDetail}>{t('view-details')} <i className="fas fa-arrow-right"></i></a>
          </div>
        }
      </div>
    </div>
  )
}

export default StudentCommentItem;
