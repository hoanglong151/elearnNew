import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import NoteForStudentModal from '../NoteForStudentModal';
import styles from '~components/TeacherHome/teacherHome.module.scss';
import { getTeacherDashboard, cancelSchedule } from '~src/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import Flatpickr from 'react-flatpickr';
import TeacherSidebar from './TeacherSidebar';
import UpComingList from './UpComingList';
import { ToastContainer } from 'react-toastify';
import { appSettings } from '~src/config';
import Select from 'react-select';
import Header from '~src/components/Header';
import Footer from '~src/components/Footer';

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

const DateTimeFormat = new Intl.DateTimeFormat('vi-VN', {
	month: '2-digit',
	day: '2-digit',
});

const itemShowOptions = [
	{
		value: 999999,
		label: 'All lessons',
	},
	{
		value: 5,
		label: '5 lessons',
	},
	{
		value: 10,
		label: '10 lessons',
	},
];
const SituationBlock = ({
	title,
	value,
	unit,
	imageUrl,
	link,
	linkTitle,
	isLoading,
}) => {
	return (
		<div className="card rounded-10 shadow-base bd-0">
			<div className="card-body d-flex align-items-center justify-content-between bd-0-f pd-20">
				<div className="flex-shrink-0 d-flex flex-column justify-content-between">
					{imageUrl ? (
						<img src={imageUrl} className="wd-75 ht-50 object-fit mg-b-10" />
					) : (
						<Skeleton circle={true} />
					)}
					<p className="tx-14 text-center mg-b-0 tx-medium">
						{!isLoading ? title : <Skeleton />}
					</p>
					<a className="tx-12" href={link ? link : ''}>
						{!isLoading ? linkTitle : <Skeleton />}
					</a>
				</div>
				<div className="tx-center circle-value flex-shrink-0">
					<p className="mg-b-0 tx-20 tx-bold tx-gray-600">
						{!isLoading ? value : <Skeleton />}
					</p>
					<p className="text-center mg-b-0 tx-gray-400">
						{!isLoading ? unit : <Skeleton />}
					</p>
				</div>
			</div>
		</div>
	);
};

const TeacherHome = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [dashboardInfo, setDashboardInfo] = useState(null);
	const [selectShow, setSelectShow] = useState(itemShowOptions[0]);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const { t, i18n } = useTranslation('common');

	const _onFilterDate = e => {
		e.preventDefault();
		if (fromDate.value === '' || toDate.value === '') {
			alert('Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc');
			return;
		}
		console.log('Filtered, chua co API');
	};

	const getData = async () => {
		setIsLoading(true);
		try {
			const res = await getTeacherDashboard();
			if (res?.Code && res.Code === 1) {
				setDashboardInfo(res.Data);
				setIsLoading(false);
				return;
			} else {
				console.log(res);
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};

	React.useEffect(() => {
		feather.replace();
	}, [selectShow]);
	React.useEffect(() => {
		getData();
	}, []);

	return (
		<>
			<div className="Header">
				<Header />
			</div>
			<div className="">
				<div className="d-flex flex-wrap flex-xl-nowrap row--lg">
					<div className="wd-100p mg-xl-b-0 mg-b-30 wd-xl-325-f pd-xl-x-15 d-sm-flex d-xl-block flex-shrink-0">
						<TeacherSidebar />
					</div>
					<div className="flex-grow-1 pd-xl-x-15 wd-100p">
						{/* 
						<div className="dropdown-language" style={{ display: 'flex' }}>
							<button onClick={() => i18n.changeLanguage('vi')}>vi</button>
							<button onClick={() => i18n.changeLanguage('en')}>en</button>
						</div>
 						*/}
						<div className="gv-situation mg-b-15">
							{/* <div className="mg-b-15 d-lg-flex align-items-center justify-content-between">
                                <h5 className="mg-b-0">Teaching Situation</h5>
                                <div className="d-flex flex-wrap-0 form-row pd-x-5 flex-grow-1 justify-content-end" id="filter-time">
                                    <div className="wd-sm-200 pd-x-5 wd-100p mg-b-10 mg-sm-b-0">
                                        <Flatpickr
                                            options={{
                                                dateFormat: "d/m/Y",
                                                mode: 'single',
                                                maxDate: new Date()
                                            }}
                                            className="form-control"
                                            onChange={(date) => setFromDate(date)}
                                            placeholder="From date"
                                        />
                                    </div>
                                    <div className="wd-sm-200 pd-x-5 wd-100p">
                                        <Flatpickr
                                            options={{
                                                dateFormat: "d/m/Y",
                                                maxDate: new Date(),
                                                mode: 'single',
                                                onOpen: function (selectedDates, dateStr, instance) {
                                                    if (fromDate.length === 0) {
                                                        instance.set("minDate", null);
                                                        return;
                                                    }
                                                    instance.set("minDate", new Date(fromDate));
                                                }
                                            }}
                                            className="form-control"
                                            onChange={(date) => setToDate(date)}
                                            placeholder="To date"

                                        />
                                    </div>
                                    <div className="flex-grow-0 tx-right flex-shrink-0 pd-x-5">
                                        <button type="button" className="btn btn-primary " onClick={_onFilterDate}><i className="fa fa-search" /></button>
                                    </div>
                                </div>
                            </div> */}
							<div className="row">
								<div className="col-12 col-md-4 mg-b-15">
									<SituationBlock
										isLoading={isLoading}
										link={dashboardInfo?.OpenSlotURL}
										linkTitle="Manage slot"
										title="Slots Opened"
										value={dashboardInfo?.OpenSlot}
										unit="slots"
										imageUrl={'/assets/img/slot-open.png'}
									/>
								</div>
								<div className="col-12 col-md-4  mg-b-15">
									<SituationBlock
										isLoading={isLoading}
										link={dashboardInfo?.BookedSlotURl}
										linkTitle="Manage slot"
										title="Slots Booked"
										value={dashboardInfo?.BookedSlot}
										unit="slots"
										imageUrl={'/assets/img/slot-booked.png'}
									/>
								</div>
								<div className="col-12 col-md-4  mg-b-15">
									<SituationBlock
										isLoading={isLoading}
										link={dashboardInfo?.FeedbackURL}
										linkTitle="Submit Feedback"
										title="Missing Feedbacks"
										value={dashboardInfo?.Feedback}
										unit="Feedback"
										imageUrl={'/assets/img/missing-feedback.png'}
									/>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-12">
								<div className="card">
									<div className="card-body">
										<div className="align-items-center d-flex justify-content-between pd-b-15">
											<div className="d-flex align-items-center">
												<div className="">
													<h5 className="mg-b-0">Upcoming Classes</h5>
												</div>
											</div>
											<div className="wd-150">
												<Select
													options={itemShowOptions}
													styles={appSettings.selectStyle}
													onChange={setSelectShow}
													defaultValue={selectShow}
												/>
											</div>
										</div>
										<div className="gv-notice">
											<UpComingList itemShow={selectShow} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="Footer">
				<Footer />
			</div>
			<NoteForStudentModal />
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</>
	);
};

const domContainer = document.getElementById('react-teacher-home');
// ReactDOM.render(<TeacherHome />, domContainer);
ReactDOM.render(
	<I18nextProvider i18n={i18next}>
		<TeacherHome />
	</I18nextProvider>,
	domContainer,
);
