import React, { useEffect, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { appSettings } from '~src/config';
import Select, { components } from 'react-select';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

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
const FlatOption = props => {
	const { data } = props;
	return (
		<components.Option {...props}>
			<div className="d-flex align-items-center">
				<span className={`flag-icon flag-icon-${data.flag}`}></span>
				<span className="mg-l-10">{data.label}</span>
			</div>
		</components.Option>
	);
};
const Header = () => {
	const { t, i18n } = useTranslation('common');
	let language = window.localStorage.getItem('language');
	const [lang, setLang] = useState(
		(() => {
			if (!!!language) {
				language = 'vi';
				window.localStorage.setItem('language', 'vi');
			}
			return LangOptions.find(
				item => item.value === (language.includes('en') ? 'en' : 'vi'),
			);
		})(),
	);

	const _handleChangeSelect = selected => {
		setLang(selected);
		i18n.changeLanguage(selected.value === 'en' ? 'en' : 'vi');
		window.localStorage.setItem('language', JSON.stringify(selected.value));
	};
	const setSelectLanguage = key => {
		setLang(LangOptions.find(item => item.value === key));
	};

	return (
		<>
			<header className="navbar navbar-header navbar-header-fixed">
				<div className="container">
					<div className="navbar-brand">
						<a className="df-logo">
							<img src="../assets/img/logo.png" alt="logo" />
						</a>
					</div>
					{/* navbar-brand */}
					<div id="navbarMenu" className="navbar-menu-wrapper">
						<div className="navbar-menu-header">
							<a className="df-logo">
								Mona<span>Media</span>
							</a>
							<a id="mainMenuClose">
								<i data-feather="x" />
							</a>
						</div>
						{/* navbar-menu-header */}
					</div>
					{/* navbar-menu-wrapper */}
					<div className="navbar-right">
						{appSettings.UID === 20 ? (
							<>
								<a id="navbarSearch" className="search-link">
									<i data-feather="search" className="" />
								</a>
								<div className="dropdown dropdown-message">
									<a className="dropdown-link new-indicator open-chat-nav">
										<i data-feather="message-square" className="" />
										<span>5</span>
									</a>
								</div>

								<div className="dropdown dropdown-notification">
									<a
										className="dropdown-link new-indicator"
										data-toggle="dropdown"
									>
										<i data-feather="bell" className="" />
										<span>2</span>
									</a>
									<div className="dropdown-menu dropdown-menu-right">
										<div className="dropdown-header">Notifications</div>
										<a className="dropdown-item">
											<div className="media">
												<div className="avatar avatar-sm avatar-online">
													<img
														src="../assets/img/teacher.jpg"
														className="rounded-circle"
														alt=""
													/>
												</div>

												<div className="media-body mg-l-15">
													<p>
														Congratulate <strong>Socrates Itumay</strong> for
														work anniversaries
													</p>
													<span>Mar 15 12:32pm</span>
												</div>
												{/* media-body */}
											</div>
											{/* media */}
										</a>
										<a className="dropdown-item">
											<div className="media">
												<div className="avatar avatar-sm avatar-online">
													<img
														src="../assets/img/teacher.jpg"
														className="rounded-circle"
														alt=""
													/>
												</div>

												<div className="media-body mg-l-15">
													<p>
														<strong>Joyce Chua</strong> just created a new blog
														post
													</p>
													<span>Mar 13 04:16am</span>
												</div>
												{/* media-body */}
											</div>
											{/* media */}
										</a>
										<a className="dropdown-item">
											<div className="media">
												<div className="avatar avatar-sm avatar-online">
													<img
														src="../assets/img/teacher.jpg"
														className="rounded-circle"
														alt=""
													/>
												</div>

												<div className="media-body mg-l-15">
													<p>
														<strong>Althea Cabardo</strong> just created a new
														blog post
													</p>
													<span>Mar 13 02:56am</span>
												</div>
												{/* media-body */}
											</div>
											{/* media */}
										</a>
										<a className="dropdown-item">
											<div className="media">
												<div className="avatar avatar-sm avatar-online">
													<img
														src="../assets/img/teacher.jpg"
														className="rounded-circle"
														alt=""
													/>
												</div>

												<div className="media-body mg-l-15">
													<p>
														<strong>Adrian Monino</strong> added new comment on
														your photo
													</p>
													<span>Mar 12 10:40pm</span>
												</div>
												{/* media-body */}
											</div>
											{/* media */}
										</a>
										<div className="dropdown-footer">
											<a>View all Notifications</a>
										</div>
									</div>
									{/* dropdown-menu */}
								</div>

								<div className="dropdown dropdown-profile">
									<a
										className="dropdown-link"
										data-toggle="dropdown"
										data-display="static"
									>
										<div className="avatar flex-shrink-0">
											<img
												src="../assets/img/teacher.jpg"
												className="rounded-circle"
												alt=""
											/>
										</div>
										<span className="username">
											<span className="mg-l-10 bold">Phuong Uyen</span>
											<i className="fa fa-caret-down mg-l-10 "></i>
										</span>
									</a>
									{/* dropdown-link */}
									<div className="dropdown-menu dropdown-menu-right tx-13">
										<div className="avatar avatar-lg mg-b-15">
											<img
												src="../assets/img/teacher.jpg"
												className="rounded-circle"
												alt=""
											/>
										</div>
										<h6 className="tx-semibold mg-b-5">Trần Lê Phương Uyên</h6>
										<p className="mg-b-25 tx-12 tx-color-03">Administrator</p>
										<a href="/teacherProfile.html" className="dropdown-item">
											<i data-feather="user" /> View Profile
										</a>
										<div className="dropdown-divider" />
										<a className="dropdown-item">
											<i data-feather="log-out" />
											Sign Out
										</a>
									</div>
									{/* dropdown-menu */}
								</div>
							</>
						) : (
							<div className="group-action-header">
								<div className="wd-150" style={{ marginRight: '15px' }}>
									<Select
										options={LangOptions}
										isSearchable={false}
										formatOptionLabel={context => (
											<div className="d-flex align-items-center">
												<span
													className={`flag-icon flag-icon-${context.flag}`}
												></span>
												<span className="mg-l-10">{context.label}</span>
											</div>
										)}
										components={{
											Option: FlatOption,
											IndicatorSeparator: () => null,
										}}
										styles={appSettings.selectStyle}
										value={lang}
										onChange={_handleChangeSelect}
									/>
								</div>
								<a
									href={`https://www.facebook.com/Globalelearn.DayTiengAnhTrucTuyen1kem1`}
									className="action-icon facebook-icon"
									target="_blank"
									rel="noreferrer"
								>
									<i className="fab fa-facebook-f"></i>
								</a>
								<a
									href={`mailto:support@e-learn.com.vn`}
									className="action-icon email-icon"
									target="_blank"
									rel="noreferrer"
								>
									<i className="far fa-envelope"></i>
								</a>
								<a
									href={`/log-in`}
									className="action-icon log-out"
									style={{ width: '100px' }}
								>
									<i className="fas fa-sign-out-alt mg-r-5"></i>
									{t('auth.logout')}
								</a>
							</div>
						)}
						{/* dropdown */}
					</div>
					{/* navbar-right */}
				</div>
			</header>
			{appSettings.UID === 20 && (
				<div className="bottom-header">
					<div className="container">
						<a id="js-burger-menu" className="burger-menu-bottom">
							<i data-feather="menu" />
						</a>
						<ul className="hd-menu-list" data-title="GLOBAL E-LEARN">
							<li className="menu-link">
								<a href={`teacherHome.html`} className="link-icon active">
									Home
								</a>
							</li>
							<li className="menu-link">
								<a href={`teacherBooking.html`} className="link-icon">
									Booking
								</a>
							</li>
							<li className="menu-link">
								<a href={`teacherClassRooms.html`} className="link-icon">
									Classrooms
								</a>
							</li>
							<li className="menu-link">
								<a href={`teacherLibrary.html`} className="link-icon">
									Library
								</a>
							</li>
							<li className="menu-link">
								<a href={`teacherReport.html`} className="link-icon">
									Monthly Statistics
								</a>
							</li>
							<li className="menu-link">
								<a href={`teacherPayment.html`} className="link-icon">
									Payment
								</a>
							</li>
							<li className="menu-link">
								<a href={`teacherFeedback.html`} className="link-icon">
									Feedbacks
								</a>
							</li>
							<li className="menu-link">
								<a href={`teacherSupport.html`} className="link-icon">
									Support
								</a>
							</li>
						</ul>
						<div className="menu-overlay" />
					</div>
				</div>
			)}
		</>
	);
};

// const domContainer = document.getElementById('header');
// //domContainer.classList.add('custom-header-student');
// // if (domContainer) ReactDOM.render(<Header />, domContainer);
// ReactDOM.render(
// 	<I18nextProvider i18n={i18next}>
// 		<Header />
// 	</I18nextProvider>,
// 	domContainer,
// );

export default Header;
