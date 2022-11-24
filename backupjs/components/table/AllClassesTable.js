import React, { useState, useEffect, createRef } from 'react';
import SkeletonTable from '~components/common/Skeleton/SkeletonTable';
import { getAllClass, addScheduleLog } from '~src/api/teacherAPI';
import Pagination from 'react-js-pagination';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import { appSettings } from '~src/config';
const DateTimeFormat = new Intl.DateTimeFormat('vi-VN', {
	month: '2-digit',
	day: '2-digit',
	year: 'numeric',
});

const statusOptions = [
	{
		value: 0,
		label: 'All status',
	},
	{
		value: 1,
		label: 'As Schedule',
	},
	{
		value: 2,
		label: 'Student No Show',
	},
	{
		value: 3,
		label: 'Teacher no show',
	},
	{
		value: 4,
		label: 'IT Problem',
	},
	{
		value: 5,
		label: 'Teacher Late',
	},
	{
		value: 6,
		label: 'Teacher Cancel',
	},
];

const AllClassRow = ({ data, showStudentModal }) => {
	const {
		Status,
		StatusString,
		FinishTypeString,
		ScheduleTimeVN = '',
		ScheduleTimeUTC = '',
		LessionMaterial = '',
		FileAudio = '',
		FileAudio1 = '',
		FileAudio2 = '',
		StudentName = '',
		BookingID = '',
		LessionName = '',
		SkypeID,
		StudentUID,
		DocumentName = '',
		GenderID,
		FinishedType,
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

	return (
		<tr>
			<td className="clr-id">
				<span className="tx-gray-500">{BookingID}</span>
			</td>
			<td className="clr-lesson">
				<div className="mg-b-5">
					<span className=" mg-r-5">Course:</span>
					<span className="tx-gray-500">{DocumentName}</span>
				</div>
				<div className="">
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
			<td className="clr-time">
				<div className="mg-b-5">
					<span className=" mg-r-5 tx-nowrap">
						<i className="fa fa-clock tx-primary"></i> VN time:
					</span>
					<span className="tx-gray-500">{ScheduleTimeVN}</span>
				</div>
				<div className="">
					<span className=" mg-r-5 tx-nowrap">
						<i className="fa fa-clock tx-primary"></i> Your time:
					</span>
					<span className="tx-gray-500">{ScheduleTimeUTC}</span>
				</div>
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
			</td>
			<td className="clr-status">
				<span
					className={`badge badge-${
						FinishedType === 5
							? 'primary tx-white'
							: FinishedType === 1
							? 'success'
							: 'danger'
					} pd-5`}
				>
					{FinishedType === 0
						? 'BOOKED'
						: FinishedType === 1
						? 'As Schedule'
						: FinishedType === 2
						? 'Student No Show'
						: FinishedType === 3
						? 'Teacher No Show'
						: FinishedType === 4
						? 'IT Problem'
						: FinishedType ===5
						? 'Teacher Late'
						: FinishedType === 6
						? 'Teacher Cancel'
						: 'Student Cancel'}
				</span>
				{/* {Status === 1 && <span className="badge badge-warning pd-5">BOOKED</span>}
                {Status === 2 && <span className="badge badge-success pd-5">FINISHED</span>} */}
			</td>
			<td className="clr-finishType">
				{Status === 2 && (
					<span className="tx-gray-500">{FinishTypeString}</span>
				)}
				{/* <span className="tx-gray-500">AS SCHEDULE</span>
                <span className="tx-gray-500">TEACHER NO SHOW</span>
                <span className="tx-gray-500">STUDENT NO SHOW</span>
                <span className="tx-gray-500">TEACHER LATE</span>
                <span className="tx-gray-500">IT PROBLEM</span> */}
			</td>
			<td className="clr-actions">
				{
					<a
						href={LessionMaterial}
						className="btn btn-sm btn-warning rounded-5 mg-r-10"
						target="_blank"
						rel="noreferrer"
					>
						<i className="fa fa-book-open clrm-icon" /> Material
					</a>
				}
				{Status === 1 && (
					<a
						href={`skype:${SkypeID}?chat`}
						className=" btn btn-sm btn-warning rounded-5"
						onClick={handleEnterClass}
					>
						<i className="fab fa-skype clrm-icon" /> Go to Classroom
					</a>
				)}
				{Status === 2 && (
					<a
						target="_blank"
						rel="noreferrer"
						href={`/ElearnTeacher/FeedbackDetail?ID=${BookingID}`}
						className=" btn btn-sm btn-info btn-detail rounded-5"
					>
						<i className="fas fa-info-circle" /> View Detail
					</a>
				)}
			</td>
		</tr>
	);
};

const AllClassesTable = ({ showStudentModal }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [filterStatusAllClass, setFilterStatusAllClass] = React.useState(
		statusOptions[0],
	);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState([]);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const _onFilterDate = e => {
		e.preventDefault();
		loadAllClassesData();
	};

	const _changeFilterStatusAllClass = event => {
		setFilterStatusAllClass(event.target.value);
	};

	const loadAllClassesData = async () => {
		console.log(fromDate);
		try {
			const res = await getAllClass({
				Page: parseInt(pageNumber),
				Status: parseInt(filterStatusAllClass.value),
				fromDate:
					fromDate.length === 0
						? ''
						: DateTimeFormat.format(new Date(fromDate)),
				toDate:
					toDate.length === 0 ? '' : DateTimeFormat.format(new Date(toDate)),
			});
			if (res?.Code && res.Code === 1) {
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log('Code response khác 1');
			}
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};
	useEffect(() => {
		console.log(filterStatusAllClass);
	}, [filterStatusAllClass]);

	useEffect(() => {
		loadAllClassesData();
	}, [pageNumber, filterStatusAllClass]);

	return (
		<>
			<div className="d-flex align-items-center justify-content-between mg-b-15 flex-wrap">
				<div className="wd-150 order-1 mg-t-15 mg-md-t-0">
					<Select
						options={statusOptions}
						defaultValue={filterStatusAllClass}
						onChange={values => setFilterStatusAllClass(values)}
						styles={appSettings.selectStyle}
					/>
					{/* <select name="language" id=""
                        value={filterStatusAllClass}
                        className="form-control" onChange={_changeFilterStatusAllClass}>
                        <option value="0">All status</option>
                        <option value="1">Booked</option>
                        <option value="2">Finished</option>
                    </select> */}
				</div>
				<div
					className="d-flex from-to-group wd-100p flex-md-nowrap flex-wrap wd-md-500"
					id="filter-time"
				>
					<div className="form-row flex-grow-1 mg-sm-r-5">
						<div className="col">
							<Flatpickr
								placeholder="From date"
								options={{
									dateFormat: 'd/m/Y',
									maxDate: new Date(),
								}}
								className="form-control"
								onChange={date => setFromDate(date)}
							/>
							{/* <input type="text" name="start-day " onChange={(value) =>  setFromDate(value)} className="form-control datetimepicker from-date" placeholder="From date" /> */}
						</div>
						<div className="col">
							<Flatpickr
								placeholder="To date"
								options={{
									dateFormat: 'd/m/Y',
									maxDate: new Date(),
									onOpen: function(selectedDates, dateStr, instance) {
										if (fromDate.length === 0) {
											instance.set('minDate', null);
											return;
										}
										instance.set('minDate', new Date(fromDate));
									},
								}}
								className="form-control"
								onChange={date => setToDate(date)}
							/>
						</div>
					</div>
					<div className="flex-grow-0 tx-right flex-shrink-0 mg-t-30 mg-sm-t-0">
						<button
							type="button"
							className="btn btn-primary "
							onClick={_onFilterDate}
						>
							<i className="fa fa-filter" /> Filter
						</button>
					</div>
				</div>
			</div>

			{isLoading ? (
				<SkeletonTable />
			) : (
				<>
					<div className="table-responsive mg-b-15">
						<table className="table table-classrooms table-borderless responsive-table table-hover">
							<thead className="thead-primary">
								<tr>
									<th className="clr-id">ID</th>
									<th className="clr-lesson">Lesson</th>
									<th className="clr-student">Student </th>
									<th className="clr-time">Schedule </th>
									<th className="clr-time">File Audio </th>
									<th className="clr-status">Status</th>
									<th className="clr-finishType">Finish Type</th>
									<th className="clr-actions">Actions</th>
								</tr>
							</thead>
							<tbody>
								{!!data && !!data.length > 0 ? (
									data.map(item => (
										<AllClassRow
											key={`${item.BookingID}`}
											data={item}
											showStudentModal={showStudentModal}
										/>
									))
								) : (
									<tr>
										<td colSpan={7}>
											<span className="tx-danger d-block tx-center tx-medium tx-16">
												No classes.
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
			)}
		</>
	);
};

export default AllClassesTable;
