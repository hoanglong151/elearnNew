import React, { useState, useEffect } from 'react';
import { getClassHistory } from '~src/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'react-js-pagination';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { Accordion, Card, Button } from 'react-bootstrap';
import { randomId } from '~src/utils';
const fakeData = [
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
];
const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

Date.prototype.addDays = function(dayAdd) {
	this.setTime(this.getTime() + parseInt(dayAdd) * 24 * 60 * 60 * 1000);
	return this;
};

const monthOptions = [
	{
		value: 0,
		label: 'January',
	},
	{
		value: 1,
		label: 'February',
	},
	{
		value: 2,
		label: 'March',
	},
	{
		value: 3,
		label: 'April',
	},
	{
		value: 4,
		label: 'May',
	},
	{
		value: 5,
		label: 'June',
	},
	{
		value: 6,
		label: 'July',
	},
	{
		value: 7,
		label: 'August',
	},
	{
		value: 8,
		label: 'September',
	},
	{
		value: 9,
		label: 'October',
	},
	{
		value: 10,
		label: 'November',
	},
	{
		value: 11,
		label: 'December',
	},
];

const typeOptions = [
	{
		value: 1,
		label: '1st to 15th',
	},
	{
		value: 2,
		label: '16th to end',
	},
];

const RenderRow = ({ data, ...others }) => {
	const { scheduleTime, lessonName, studentName, finishType, amount } = data;
	return (
		<tr>
			<td data-title="No." className="tx-center">
				{others.number + 1 || 0}
			</td>
			<td data-title="Schedule time" className="tx-nowrap">
				{scheduleTime}
			</td>

			<td data-title="Lesson name" className="tx-left">
				{lessonName}
			</td>
			<td data-title="Lesson name" className="tx-center">
				{studentName}
			</td>
			<td data-title="Finish type" className="tx-center">
				{finishType}
			</td>
			<td data-title="Amount" className="tx-center">
				<NumberFormat
					value={`${amount}`}
					displayType={'text'}
					thousandSeparator={true}
					suffix={'$'}
				/>
			</td>
		</tr>
	);
};
const now = new Date();
const ClassesDetail = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [selectedSection, setSelectedSection] = useState(typeOptions[0]);
	const [month, setMonth] = useState(monthOptions[now.getMonth()]);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const loadClassesAPI = async () => {
		setIsLoading(true);
		const res = await getClassHistory({
			Date:
				selectedSection.value === 1
					? moment(
							new Date(`${month.value + 1}/01/${now.getFullYear()}`),
							'MM/DD/YYYY',
					  ).format('DD/MM/YYYY')
					: moment(
							new Date(`${month.value + 1}/16/${now.getFullYear()}`),
							'MM/DD/YYYY',
					  ).format('DD/MM/YYYY'),
		});
		if (res.Code == 1) setData(res.Data);
		setIsLoading(false);
	};

	useEffect(() => {
		loadClassesAPI();
	}, [pageNumber]);

	return (
		<>
			<div className="mg-b-30">
				<Accordion defaultActiveKey="0">
					<Card>
						<Accordion.Toggle as={Card.Header} eventKey="0">
							<div className="d-flex align-items-center justify-content-between">
								<div className="d-flex align-items-center  flex-grow-1">
									<h5 className="tx-dark mg-lg-b-0 mg-b-0">Classes</h5>
									<div className="v-divider"></div>
									<p className="mg-b-0 tx-20 tx-bold tx-primary"></p>
								</div>

								<span className="tx-black btn-collapse">
									<i className="fas fa-caret-down"></i>
								</span>
							</div>
						</Accordion.Toggle>
						<Accordion.Collapse eventKey="0">
							<Card.Body>
								<div className="">
									<table className="table responsive-table-vertical table-schedule-log table-hover table-small">
										<thead className="thead-primary">
											<tr className="gv-bg-table">
												<th className="tx-center">No.</th>
												<th className="tx-left">Schedule Time</th>
												<th className="tx-left">Lesson Name</th>
												<th className="tx-center">Student Name</th>
												<th className="tx-center">Finish Type</th>
												<th className="tx-center">Amount ($)</th>
											</tr>
										</thead>
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
												data.map((item, index) => (
													<RenderRow
														key={`${item.BookingID}`}
														data={{
															id: item.BookingID,
															scheduleTime: item.Schedule,
															lessonName: item.LessionName,
															studentName: item.StudentName,
															finishType: item.StatusString,
															amount: item.Price,
														}}
														number={index}
													/>
												))
											) : (
												<tr>
													<td colSpan={4}>
														<span className="tx-danger d-block tx-center tx-medium tx-16">
															No classes record.
														</span>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
								<div className="d-flex flex-wrap justify-content-between mg-t-15">
									<div className="tx-gray-500 mg-y-10">
										Total records: {totalResult}
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
								</div>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
				</Accordion>
			</div>
		</>
	);
};

export default ClassesDetail;
