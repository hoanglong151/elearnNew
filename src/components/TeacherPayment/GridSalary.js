import React, { useState, useEffect } from 'react';
import styles from './GridSalary.module.scss';
import { getPaymentInfo } from '~src/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import moment from 'moment';
import Select from 'react-select';
import { appSettings } from '~src/config';
import NumberFormat from 'react-number-format';
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

const now = new Date();
const GridSalary = ({dataSalary}) => {
	const [data, setData] = useState();
	const [selectedSection, setSelectedSection] = useState(typeOptions[0]);
	const [month, setMonth] = useState(monthOptions[now.getMonth()]);
	const [year, setYear] = useState(yearOptions[1]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setData(dataSalary);
		if(dataSalary) {
			setIsLoading(false);
		}
	},[dataSalary]);
	
	return (
		<>
			<div className="pay-title">
				<div className="d-md-flex justify-content-between align-items-center">
					<h3 className="mg-md-b-0 text-dark tx-bold mg-b-15">
						MONTHLY PAYMENT
					</h3>
					
				</div>
			</div>
			<hr className="kengang" />
			{/*Bang luong tong hop*/}
			<div className="d-table wd-100p tb-salary">
				<div className="table-row form-row">
					{/*  <div className="col-lg-4 mg-b-15 mg-lg-b-0">
                        <div className="card ht-100p">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <p className="pay-syn-title">Participation Incentives</p>

                                    <p className="pay-syn-money">{!isLoading ? <NumberFormat value={`${parseFloat(data.FinishedClass) + parseFloat(data.CourseDeduction)}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={20} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text">Total classes</p>

                                    <p className="pay-syn-text">{!isLoading ? <NumberFormat value={`${data.TotalClasses}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text">Finished class</p>
                                    <p className="pay-syn-text">{!isLoading ? <NumberFormat value={`${data.FinishedClass}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text mg-b-0">Course deduction</p>
                                    <p className="pay-syn-text mg-b-0">{!isLoading ? <NumberFormat value={`${data.CourseDeduction}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mg-b-15 mg-lg-b-0">
                        <div className="card ht-100p">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <p className="pay-syn-title">Other Incentives</p>

                                    <p className="pay-syn-money">{!isLoading ? <NumberFormat value={`${parseFloat(data.TeacherRefferalFee) + parseFloat(data.NewStudentSignup) + parseFloat(data.Rewards)}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={20} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text">Teacher Refferal Fee</p>
                                    <p className="pay-syn-text">{!isLoading ? <NumberFormat value={`${data.TeacherRefferalFee}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text">New Student Signup</p>
                                    <p className="pay-syn-text">{!isLoading ? <NumberFormat value={`${data.NewStudentSignup}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text mg-b-0">Rewards</p>
                                    <p className="pay-syn-text mg-b-0">{!isLoading ? <NumberFormat value={`${data.Rewards}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mg-b-15 mg-lg-b-0">
                        <div className="card ht-100p">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <p className="pay-syn-title">Adjustments</p>
                                    <p className="pay-syn-money">{!isLoading ? <NumberFormat value={`${parseFloat(data.BaseSalary) + parseFloat(data.Additions) + parseFloat(data.Deductions)}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={20} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text">Base salary</p>
                                    <p className="pay-syn-text">{!isLoading ? <NumberFormat value={`${data.BaseSalary}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text">Additions</p>

                                    <p className="pay-syn-text">{!isLoading ? <NumberFormat value={`${data.Additions}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text mg-b-0">Deductions</p>

                                    <p className="pay-syn-text mg-b-0">{!isLoading ? <NumberFormat value={`${data.Deductions}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                 */}

					<div className="col-lg-3 mg-b-15 mg-lg-b-0">
						<div className="card ht-100p">
							<div className="card-body">
								<div className="d-flex justify-content-between">
									<p className="pay-syn-title">Classes</p>
									<p className="pay-syn-money">
										{!isLoading ? (
											<NumberFormat
												value={`${parseFloat(data.FinishedClass)}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={''}
											/>
										) : (
											<Skeleton count={1} width={40} height={20} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">Finished classes</p>
									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.FinishedClass}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={''}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-3 mg-b-15 mg-lg-b-0">
						<div className="card ht-100p">
							<div className="card-body">
								<div className="d-flex justify-content-between">
									<p className="pay-syn-title">Participation Incentives</p>

									<p className="pay-syn-money">
										{!isLoading ? (
											<NumberFormat
												value={`${parseFloat(data.ParticipationIncentives) -
													parseFloat(data.CourseDeduction)}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={''}
											/>
										) : (
											<Skeleton count={1} width={40} height={20} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">Participation</p>

									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.ParticipationIncentives}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={''}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">Course Deduction</p>
									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.CourseDeduction}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={''}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-3 mg-b-15 mg-lg-b-0">
						<div className="card ht-100p">
							<div className="card-body">
								<div className="d-flex justify-content-between">
									<p className="pay-syn-title">Bonus, Rewards &amp; Adjustments</p>

									<p className="pay-syn-money">
										{!isLoading ? (
											<NumberFormat
												value={`${parseFloat(data.TeacherRefferalFee) +
													parseFloat(data.NewStudentSignup) +
													parseFloat(data.Rewards)}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={''}
											/>
										) : (
											<Skeleton count={1} width={40} height={20} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">Teacher Referral</p>

									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.TeacherRefferalFee}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={''}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">New Student Signup</p>
									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.NewStudentSignup}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={''}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text mg-b-0">Other rewards</p>
									<p className="pay-syn-text mg-b-0">
										{!isLoading ? (
											<NumberFormat
												value={`${data.Rewards}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={''}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-3 mg-b-15 mg-lg-b-0">
						<div className="card ht-100p">
							<div className="card-body">
								<div className="d-flex justify-content-between">
									<p className="pay-syn-title">Adjustments</p>

									<p className="pay-syn-money">
										{!isLoading ? (
											<NumberFormat
												value={`${parseFloat(data.Additions) +
													parseFloat(data.Deductions)}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={''}
											/>
										) : (
											<Skeleton count={1} width={40} height={20} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">Addition</p>

									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.Additions}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={''}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">Deduction</p>
									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.Deductions}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={''}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<h3 className="tx-right mg-t-15 tx-normal">
				Net salary:{' '}
				<span className="tx-primary tx-medium">
					{!isLoading ? (
						<NumberFormat
							value={`${data.NetIncome}`}
							displayType={'text'}
							thousandSeparator={true}
							suffix={''}
						/>
					) : (
						<Skeleton count={1} width={40} height={25} />
					)}
				</span>
			</h3>
			{/*/Bang luong tong hop*/}
		</>
	);
};

export default GridSalary;
