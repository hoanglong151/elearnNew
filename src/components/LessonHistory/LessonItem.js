import React , {useEffect} from 'react';
import ReactDOM from 'react-dom';
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
const LessonItem = ({
	BookingID,
	CoursesName,
	DocumentID,
	DocumentDetailID,
	DocumentName,
	LessionName,
	LessonDetail,
	LessionMaterial,
	start,
	end,
	date,
	TeacherUID,
	TeacherName,
	Status,
	StatusString,
	FileAudio,
	FileAudio1,
	FileAudio2,
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
		<tr>
			<td style={{ letterSpacing: '0.5px' }}>{date}</td>
			<td>{CoursesName}</td>
			<td>{DocumentName}</td>
			<td style={{ whiteSpace: 'pre-line' }}><a target="_blank" href={`https://app.e-learn.com.vn${LessionMaterial}`}>
			{LessionName}
				</a></td>
				<td>
				{
					!!FileAudio && <div className="mg-b-5">
					<span className=" mg-r-5 tx-nowrap">
						<i className="tx-primary"></i> {t('audio-file')} 1:
					</span>
					<span  className="tx-gray-500"><a target="_blank" href={FileAudio}>Download</a></span>
				</div>
				}
				{
					!!FileAudio1 && <div className="mg-b-5">
					<span className=" mg-r-5 tx-nowrap">
						<i className="tx-primary"></i> {t('audio-file')} 2:
					</span>
					<span className="tx-gray-500"><a target="_blank" href={FileAudio1}>Download</a></span>
				</div>
				}
				{
					!!FileAudio2 && <div className="mg-b-5">
					<span className=" mg-r-5 tx-nowrap">
						<i className="tx-primary"></i> {t('audio-file')} 3:
					</span>
					<span className="tx-gray-500"><a target="_blank" href={FileAudio2}>Download</a></span>
				</div>
				}
			</td>
			<td className="tx-nowrap">
				<a href={`/ElearnStudent/teacherDetail?ID=${TeacherUID}`}>
					{TeacherName}
				</a>
			</td>
			<td className="tx-nowrap">
				<span className="tx-success">{StatusString}</span>
			</td>
			<td>
				{LessonDetail && LessonDetail.split('ID=')[1] !== '0' && (
					<a href={LessonDetail} className="btn btn-info btn-icon">
						<i className="fas fa-file-alt mg-r-10"></i>
						{t('detail')}
					</a>
				)}
			</td>
		</tr>
	);
};

export default LessonItem;
