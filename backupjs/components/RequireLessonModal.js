import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import 'react-toastify/scss/main.scss';
import { toastInit } from '~src/utils';
import { requestLessonAPI } from '~src/api/studentAPI';
import {
	FETCH_ERROR,
	REQUEST_SUCCESS,
	FILL_NOTES,
	MAX_200,
} from '~components/common/Constant/toast';

import styles from '~components/RequireLessonModal.module.scss';

const RequireLessonModal = ({
	BookingID,
	avatar = 'default-avatar.png',
	TeacherUID,
	TeacherName,
	LessionMaterial,
	LessionName,
	SpecialRequest = null,
	date,
	start,
	end,
	DocumentName,
	SkypeID,
	callback,
}) => {
	const [state, setState] = useState(
		SpecialRequest == null ? '' : SpecialRequest,
	);
	const requireLesson = () => toast.success(REQUEST_SUCCESS, toastInit);
	const requireLessonFail = () => toast.error(FETCH_ERROR, toastInit);
	const requireLessonAlert1 = () => toast.warn(FILL_NOTES, toastInit);
	const requireLessonAlert2 = () => toast.warn(MAX_200, toastInit);

	const fetchAPI = async params => {
		const res = await requestLessonAPI(params);
		let result = res.Code;
		if (result === 1) {
			//Success
			requireLesson();
			callback && callback(params.SpecialRequest, BookingID, TeacherUID);
		} else {
			//Fail
			requireLessonFail();
		}
	};

	const onSubmitRequire = () => {
		if (state == null) {
			requireLessonAlert1();
			return;
		}
		if (state.length <= 0) {
			requireLessonAlert1();
		} else if (state.length > 200) {
			requireLessonAlert2();
		} else {
			/* Call API */
			fetchAPI({
				BookingID,
				SpecialRequest: state,
			});
			$('#js-md-required').fadeOut(500, function() {
				$('#js-md-required').modal('hide');
			});
		}
	};

	useEffect(() => {
		setState(SpecialRequest);
	}, [BookingID]);

	useEffect(() => {
		feather.replace();
	}, []);

	return (
		<div
			className="modal effect-scale"
			tabIndex="-1"
			role="dialog"
			id="js-md-required"
		>
			<div
				className="modal-dialog modal-dialog-centered modal-lg"
				role="document"
			>
				<div className="modal-content">
					<form action="" className="">
						<div className="modal-body">
							<div className="cr-item lesson-info">
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
									<div className="media-body mg-l-20 pos-relative pd-b-0-f">
										<h5 className="title mg-b-10 d-flex align-items-center">
											<span className="badge badge-warning mg-r-5">
												Incoming
											</span>{' '}
											<a
												href={`/ElearnStudent/lessonDetail?ID=${BookingID}`}
												className="no-hl course-name tx-bold"
											>
												{LessionName}
											</a>
										</h5>
										<div className="course-information tx-14">
											<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
												<i
													className="feather-16 mg-r-5"
													data-feather="calendar"
												></i>
												{date}
											</span>
											<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
												<i
													className="feather-16 mg-r-5"
													data-feather="clock"
												></i>
												{`B???t ?????u: ${start}`}
											</span>
											<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
												<i
													className="feather-16 mg-r-5"
													data-feather="clock"
												></i>
												{`K???t th??c: ${end}`}
											</span>
										</div>
										{SpecialRequest && (
											<div className="course-note mg-t-15">
												<h6 className="mg-b-3">Ghi ch??:</h6>
												<p className="tx-14 mg-b-0 word-break">
													{' '}
													{SpecialRequest}{' '}
												</p>
											</div>
										)}
										{DocumentName && LessionMaterial && (
											<div className="course-docs mg-t-15">
												<h6 className="mg-b-3">T??i li???u:</h6>
												<div>
													<a
														href={LessionMaterial}
														target="_blank"
														rel="noreferrer"
													>
														{DocumentName}
													</a>
												</div>
											</div>
										)}
										<div className="required-list mg-t-15 bd-t pd-t-15">
											<div className="required-text-box metronic-form">
												<label className="tx-medium">
													Ghi ch?? cho gi??o vi??n:
												</label>
												<label className="tx-danger d-block">
													Vui l??ng vi???t b???ng Ti???ng Anh (t???i ??a 200 k?? t???)
												</label>
												<div className="form-group mg-b-5-f">
													<textarea
														name="message"
														rows="4"
														className="form-control"
														placeholder="N???i dung..."
														value={!!state ? state : ''}
														onChange={e => setState(e.target.value)}
													></textarea>
												</div>
												<label className="tx-gray-500 text-right d-block">
													{`${
														!!state && state.length > 0
															? `B???n ???? nh???p ${state.length} k?? t???`
															: '*'
													}`}
												</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-light"
								data-dismiss="modal"
							>
								????ng
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={onSubmitRequire}
							>
								S???a y??u c???u
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
export default RequireLessonModal;
