import React, { useState, useEffect, createRef } from 'react';
import ReactDOM from 'react-dom';
import Skeleton from 'react-loading-skeleton';
import { getUpcomingClass, addScheduleLog } from '~src/api/teacherAPI';
import Pagination from 'react-js-pagination';
import { Popover, OverlayTrigger, Overlay } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';

const UpcomingRow = ({ data, showStudentModal }) => {
	const {
		BookingID,
		ScheduleTimeVN,
		ScheduleTimeUTC,
		StudentName,
		StudentUID,
		DocumentName,
		LessionName,
		SkypeID,
		StatusString,
		Status,
		LessionMaterial,
		GenderID,
			FileAudio = '',
		FileAudio1 = '',
		FileAudio2 = '',
		LinkMaterials = '',
		TeacherGuide = '',
		SpecialRequest,
	} = data;
	const handleEnterClass = async e => {
		e.preventDefault();
		try {
			const res = addScheduleLog({ BookingID });
		} catch (error) {
			console.log(error?.message ?? `Can't add schedule log !!`);
		}
		window.location.href = `skype:${SkypeID}?chat`;
	};

	const popover = (
		<Popover id="popover-basic">
			<Popover.Title as="h3">Student note</Popover.Title>
			<Popover.Content>{SpecialRequest}</Popover.Content>
		</Popover>
	);

	return (
		<tr>
			<td className="clr-time">
				<div className="mg-b-5">
					<span className=" mg-r-5">
						<i className="fa fa-clock tx-primary"></i> VN time:
					</span>
					<span className="tx-gray-500">{ScheduleTimeVN}</span>
				</div>
				<div className="mg-b-5">
					<span className=" mg-r-5">
						<i className="fa fa-clock tx-primary"></i> Your time:
					</span>
					<span className="tx-gray-500">{ScheduleTimeUTC}</span>
				</div>
			</td>
			<td className="clr-lesson">
				<div className="mg-b-5">
					<span className=" mg-r-5">Course:</span>
					<span className="tx-gray-500">{DocumentName}</span>
				</div>
				<div className="mg-b-5">
					<span className=" mg-r-5">Lesson:</span>
					<span className="tx-gray-500">{LessionName}</span>
				</div>
			</td>
			<td className="clr-student">
				<a
					href={`#`}
					onClick={e => {
						e.preventDefault();
						showStudentModal(StudentUID);
					}}
					className="clrm-studentname"
				>
					{StudentName}
					<i
						className={`fa fa-${
							GenderID === 1 ? 'mars' : GenderID === 2 ? 'venus' : 'genderless'
						} mg-l-10 clrm-icon-male`}
					/>
				</a>
			</td>
			<td className="tx-center">
				{SpecialRequest && SpecialRequest !== '' && (
					<OverlayTrigger
						trigger="click"
						placement="auto"
						overlay={popover}
						rootClose
					>
						<a
							href="#"
							className="d-inline-block pd-5 tx-gray-500 text-hover-primary"
							tabIndex="0"
						>
							<i className="fas fa-file-alt tx-24 "></i>
						</a>
					</OverlayTrigger>
				)}
			</td>
			<td className="clr-time">
				{
					!!FileAudio && <div className="mg-b-5">
					<span className=" mg-r-5 tx-nowrap">
						<i className="tx-primary"></i> File Audio 1:
					</span>
					<span className="tx-gray-500"><a href={FileAudio}>Download</a></span>
				</div>
				}
				{
					!!FileAudio1 && <div className="mg-b-5">
					<span className=" mg-r-5 tx-nowrap">
						<i className="tx-primary"></i> File Audio 2:
					</span>
					<span className="tx-gray-500"><a href={FileAudio1}>Download</a></span>
				</div>
				}
				{
					!!FileAudio2 && <div className="mg-b-5">
					<span className=" mg-r-5 tx-nowrap">
						<i className="tx-primary"></i> File Audio 3:
					</span>
					<span className="tx-gray-500"><a href={FileAudio2}>Download</a></span>
				</div>
				}
				{
					!!LinkMaterials && <div className="mg-b-5">
					<span className=" mg-r-5 tx-nowrap">
						<i className="tx-primary"></i> Link Materials:
					</span>
					<span className="tx-gray-500"><a href={LinkMaterials}>View</a></span>
				</div>
				}
				{
					!!TeacherGuide && <div className="mg-b-5">
					<span className=" mg-r-5 tx-nowrap">
						<i className="tx-primary"></i> Teacher Guide:
					</span>
					<span className="tx-gray-500"><a href={TeacherGuide}>Download</a></span>
				</div>
				}
			</td>
			<td className="clr-status">
				<span
					className={`badge badge-${
						Status === 1 ? 'primary tx-white' : 'success'
					} pd-5`}
				>
					{Status === 1 ? 'BOOKED' : 'FINISHED'}
				</span>
				<span
					className={`badge badge-${Status === 1 ? 'warning' : 'success'} pd-5`}
				>
					{StatusString && StatusString.toString().toUpperCase()}
				</span>
				{/* {status === 1 && <span className="badge badge-warning pd-5">BOOKED</span>}
                {status === 2 && <span className="badge badge-success pd-5">FINISHED</span>} */}
			</td>
			<td className="clr-actions">
				<a
					href={LessionMaterial}
					className="btn btn-sm btn-warning rounded-5 mg-r-10"
					target="_blank"
					rel="noopener"
				>
					<i className="fa fa-book-open clrm-icon" /> Material
				</a>
				<a
					href={`skype:${SkypeID}?chat`}
					className=" btn btn-sm btn-warning rounded-5"
					onClick={handleEnterClass}
				>
					<i className="fab fa-skype clrm-icon" /> Go to Classroom
				</a>
			</td>
		</tr>
	);
};

const UpCommingTable = ({ showStudentModal }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);

	const loadUpcomingClasses = async () => {
		try {
			const res = await getUpcomingClass({ Page: pageNumber });
			if (res?.Code && res.Code === 1) {
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log('Code response khác 1');
			}
			setIsLoading(false);
			return;
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
		setData([]);
	};

	useEffect(() => {
		loadUpcomingClasses();
	}, [pageNumber]);

	return (
		<>
			<div className="table-responsive mg-b-15">
				<table className="table table-classrooms table-borderless responsive-table table-hover">
					<thead className="thead-primary">
						<tr className="">
							<th className="clr-time">Schedule</th>
							<th className="clr-lesson">Lesson</th>
							<th className="clr-student">Student</th>
							<th className="clr-student">Note</th>
							<th className="clr-time">File Audio </th>
							<th className="clr-status">Status</th>
							<th className="clr-action">Actions</th>
						</tr>
					</thead>
					{/*1 item*/}
					<tbody>
						{isLoading ? (
							<>
								<tr>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
								</tr>
								<tr>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
								</tr>
								<tr>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
									<td>
										<Skeleton />
									</td>
								</tr>
							</>
						) : !!data && !!data.length > 0 ? (
							data.map(item => (
								<UpcomingRow
									key={`${item.BookingID}`}
									data={item}
									showStudentModal={showStudentModal}
								/>
							))
						) : (
							<tr>
								<td colSpan={6}>
									<span className="tx-danger d-block tx-center tx-medium tx-16">
										No upcoming classes.
									</span>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{totalResult > pageSize && (
				<Pagination
					innerClass="pagination"
					activePage={pageNumber}
					itemsCountPerPage={pageSize}
					totalItemsCount={totalResult}
					pageRangeDisplayed={5}
					onChange={page => setPageNumber(page)}
					itemClass="page-item"
					linkClass="page-link"
					activeClass="active"
				/>
			)}
		</>
	);
};

export default UpCommingTable;
