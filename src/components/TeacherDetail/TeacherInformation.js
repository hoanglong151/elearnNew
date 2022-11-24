import React, { useState, useEffect, useReducer } from 'react';
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

const TeacherInformation = ({ IntroduceContent, Experience, Certificate }) => {
	const { t, i18n } = useTranslation('common');
	return (
		<>
			<div className="content-block mg-b-15-f">
				<h5 className="main-title">{t('introduce')}</h5>
				<div className="introduce-content">{IntroduceContent}</div>
			</div>
			<div className="content-block mg-b-15-f">
				<h5 className="main-title">{t('experience')}</h5>
				<div className="introduce-content">{Experience}</div>
			</div>
			<div className="content-block mg-b-15-f">
				<h5 className="main-title">{t('education')}</h5>
				<div className="introduce-content">
					{/* <h5 className="sub-title">
						<i className="fas fa-user-clock"></i>
						{t('experience')}
					</h5>
					<div className="table-responsive mg-b-15">
						<table className="table table-borderless table-exp">
							<tbody>
								{!!Experience &&
									Experience.length > 0 &&
									Experience.map((item, index) => (
										<tr key={index}>
											<td className="col-time">
												<span className="from-time">
													{item.Date.split(' - ')[0]}
												</span>
												<span className="icon mg-x-5">
													<i className="fas fa-long-arrow-alt-right"></i>
												</span>
												<span className="to-time">
													{item.Date.split(' - ')[1]}
												</span>
											</td>
											<td className="col-info">
												<p className="role">{item.ExperienceName}</p>
												<p className="description">{item.ExperienceContent}</p>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div> */}
					<h5 className="sub-title">
						<i className="fas fa-certificate"></i>
						{t('certificate')}
					</h5>
					<div className="table-responsive mg-b-30">
						<table className="table table-borderless table-exp">
							<tbody>
								{!!Certificate &&
									Certificate.length > 0 &&
									Certificate.map((item, index) => (
										<tr key={index}>
											<td className="col-time">
												<span className="from-time">{item.Date}</span>
											</td>
											<td className="col-info">
												<p className="role">{item.CertificateName}</p>
												<p className="description">{item.CertificateContent}</p>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
};

export default TeacherInformation;
