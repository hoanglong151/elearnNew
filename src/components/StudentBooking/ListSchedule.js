import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { GetScheduleTeacherAPI, getLessonBookAPI } from '~src/api/studentAPI';
import { toast } from 'react-toastify';
import 'react-toastify/scss/main.scss';
import { toastInit } from '~src/utils';
import { BOOKING_SUCCESS } from '~components/common/Constant/toast';

const ListSchedule = ({
	learnTime,
	TeacherUID,
	TeacherIMG,
	TeacherName,
	Rate,
	date,
	Start,
	End,
	ScheduleListData,
	handleBooking,
	onBookTeacherUID,
	onBookStudyTimeID,
	onBookDate,
	modalRef,
	onTouchBooking,
}) => {
	const [scheduleList, setSchedule] = useState([]);
	const [loading, setLoading] = useState(false);
	const [opening, setOpening] = useState(false);
	const bookingToast = () => toast.success(BOOKING_SUCCESS, toastInit);

	const onHandleBooking = async (
		StudyTimeID,
		LessionName,
		TeacherUID,
		TeacherIMG,
		TeacherName,
		Rate,
		date,
		start,
		end,
		BookingID,
	) => {
		setOpening(true);
		try {
			const res = await getLessonBookAPI({ StudyTimeID, Date: date, });
			if (res.Code === 1) {
				setTimeout(() => {
					handleBooking(
						StudyTimeID,
						LessionName,
						TeacherUID,
						TeacherIMG,
						TeacherName,
						Rate,
						date,
						start,
						end,
						BookingID,
					);
				}, 100);
				// $(modalRef.current).modal('show');
				setTimeout(() => {
					onTouchBooking && onTouchBooking();
				}, 200);
			} else {
				toast.error(
					res?.Message ??
						'Không thể đặt buổi học này, vui lòng chọn buổi khác !!',
					toastInit,
				);
			}
		} catch (error) {
			toast.error('Lỗi đặt lịch học, vui lòng thử lại sau !!', toastInit);
		}
		setOpening(false);
	};

	const getAPI = async () => {
		// setLoading(true);
		// const res = await GetScheduleTeacherAPI({
		// 	TeacherUID,
		// 	Date: date,
		// });
		// if (res.Code === 1) {
			setSchedule(ScheduleListData);
		// }
		// setLoading(false);
	};
	useEffect(() => {
		getAPI();
	}, [date]);

	useEffect(() => {
		let newSchedule = [...scheduleList];

		let index = newSchedule.findIndex(
			i =>
				i.StudyTimeID == onBookStudyTimeID &&
				i.TeacherUID == onBookTeacherUID &&
				moment(i.Start).format('DD/MM/YYYY') == onBookDate,
		);

		if (index !== -1) {
			newSchedule[index].bookStatus = true;
			setSchedule(newSchedule);
			bookingToast();
		}
	}, [onBookTeacherUID, onBookStudyTimeID, onBookDate]);

	return loading ? (
		<div className="overlay">
			<div className="lds-ellipsis">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	) : (
		<>
			{!!scheduleList &&
				!!learnTime &&
				learnTime.length > 0 &&
				learnTime.map((item, index) => {
					let bookedFilter = scheduleList.filter(item => item.bookStatus);
					let availableFilter = scheduleList.filter(
						item => !item.bookStatus && item.available,
					);

					let status = '';
					let StudyTimeID = '';
					let BookingID = '';
					let LessionName = '';
					let start = '';
					let end = '';
					bookedFilter.map(x => {
						if (
							new Date(x.Start).getHours() === parseInt(item.split(':')[0]) &&
							new Date(x.Start).getMinutes() === parseInt(item.split(':')[1])
						)
							status = 'registed';
					});
					availableFilter.map(x => {
						if (
							new Date(x.Start).getHours() === parseInt(item.split(':')[0]) &&
							new Date(x.Start).getMinutes() === parseInt(item.split(':')[1])
						) {
							start = new Date(x.Start);
							end = new Date(x.End);
							StudyTimeID = x.StudyTimeID;
							BookingID = x.BookingID;
							LessionName = x.title;
							status = 'available';
						}
					});
					return (
						status == 'available' &&
						<li className={status} key={index}>
							<span className="time">{item}</span>
							<span className="status">
								{status == 'available' ? (
									<button
										disabled={opening}
										className="open-lessionwish"
										 data-toggle="modal"
										 data-target="#md-book-schedule"
										onClick={() =>
											onHandleBooking(
												StudyTimeID,
												LessionName,
												TeacherUID,
												TeacherIMG,
												TeacherName,
												Rate,
												moment(start).format('DD/MM/YYYY'),
												moment(start).format('HH:mm A'),
												moment(end).format('HH:mm A'),
												BookingID,
											)
										}
									>
										{opening ? 'checking..' : 'Đang mở'}
									</button>
								) : status == 'registed' ? (
									'Đã đăng ký'
								) : (
									''
								)}
							</span>
						</li>
					);
				})}
		</>
	);
};

export default ListSchedule;
