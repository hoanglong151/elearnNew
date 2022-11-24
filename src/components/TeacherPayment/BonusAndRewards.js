import React, { useState, useEffect } from 'react';
import { getSalaryTeacher } from '~src/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'react-js-pagination';
import NumberFormat from 'react-number-format';
import moment from 'moment';
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

const yearOptions = [
	{
		value: 0,
		label: '2020',
	},
	{
		value: 1,
		label: '2021',
	},
	{
		value: 2,
		label: '2022',
	},
	{
		value: 3,
		label: '2023',
	},
	{
		value: 4,
		label: '2024',
	},
	{
		value: 5,
		label: '2025',
	},
	{
		value: 6,
		label: '2026',
	},
	{
		value: 7,
		label: '2027',
	},
	{
		value: 8,
		label: '2028',
	},
	{
		value: 9,
		label: '2029',
	},
	{
		value: 10,
		label: '2030',
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
	const {
		Additions,
		Deductions,
		NewStudentSignUp,
		ReasonforAdditions,
		ReasonforDeduction,
		ReasonforOtherBonus,
		Rewards,
		TeacherReferal,
	} = data;
	console.log("Data here: ", data);
	return (
		<tr>
			<td data-title="No." className="tx-center">
				{others.number + 1 || 0}
			</td>
			<td data-title="Student Referal" className="tx-nowrap">
				<NumberFormat
					value={`${NewStudentSignUp}`}
					displayType={'text'}
					thousandSeparator={true}
					suffix={'$'}
				/>
			</td>

			<td
				data-title="Teacher Referal"
				className="tx-center"
			>
				<NumberFormat
					value={`${TeacherReferal}`}
					displayType={'text'}
					thousandSeparator={true}
					suffix={'$'}
				/>
			</td>
			<td data-title="Rewards" className="tx-center">
				<NumberFormat
					value={`${Rewards}`}
					displayType={'text'}
					thousandSeparator={true}
					suffix={'$'}
				/>
			</td>
			<td data-title="Reason for OtherBonus" className="tx-center">
				{ReasonforOtherBonus}
			</td>
			<td data-title="Deductions" className="tx-center">
				<NumberFormat
					value={`${Deductions}`}
					displayType={'text'}
					thousandSeparator={true}
					suffix={'$'}
				/>
			</td>
			<td data-title="Reason for Deduction" className="tx-center">
				{ReasonforDeduction}
			</td>
			<td data-title="Additions" className="tx-center">
				<NumberFormat
					value={`${Additions}`}
					displayType={'text'}
					thousandSeparator={true}
					suffix={'$'}
				/>
			</td>
			<td data-title="Reason for Additions" className="tx-center">
				{ReasonforAdditions}
			</td>
		</tr>
	);
};

const now = new Date();
const BonusAndRewards = ({dataBonus}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState();
	const [selectedSection, setSelectedSection] = useState(typeOptions[0]);
	const [month, setMonth] = useState(monthOptions[now.getMonth()]);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [year, setYear] = useState(yearOptions[1]);
	
	useEffect(() => {
		setData(dataBonus);
		if(dataBonus) {
			setIsLoading(false);
		}
	},[dataBonus]);
	return (
		<>
			<div className="mg-b-30">
				<Accordion>
					<Card>
						<Accordion.Toggle as={Card.Header} eventKey="0">
							<div className="d-flex align-items-center justify-content-between">
								<div className="d-flex align-items-center  flex-grow-1">
									<h5 className="tx-dark mg-lg-b-0 mg-b-0">Bonus & Rewards</h5>
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
								<div className="mg-t-30">
									<table className="table responsive-table-vertical table-schedule-log table-hover ">
										<thead className="thead-primary">
											<tr className="gv-bg-table">
												<th className="tx-center">No.</th>
												<th className="tx-left">Student Referral</th>
												<th className="tx-center">Teacher Referral</th>
												<th className="tx-center">Other Bonus</th>
												<th className="tx-center">Reason for Other Bonus</th>
												<th className="tx-center">Deductions</th>
												<th className="tx-center">Reason for Deduction</th>
												<th className="tx-center">Additions</th>
												<th className="tx-center">Reason for Additions</th>
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
														key={`${index}`}
														data={{
															Additions: item.Additions,
															Deductions: item.Deductions,
															NewStudentSignUp: item.NewStudentSignUp,
															ReasonforAdditions: item.ReasonforAdditions,
															ReasonforDeduction: item.ReasonforDeduction,
															ReasonforOtherBonus: item.ReasonforOtherBonus,
															Rewards: item.Rewards,
															TeacherReferal: item.TeacherReferal,
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
								<div className="d-flex flex-wrap justify-content-between mg-t-30">
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

export default BonusAndRewards;
