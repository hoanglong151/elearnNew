import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import GridSalary from './GridSalary';
import PaymentHistory from './PaymentHistory';
import { getSalaryTeacher } from '~src/api/teacherAPI';
import { getClassHistory } from '~src/api/teacherAPI';
import { getPaymentInfo } from '~src/api/teacherAPI';
import { getPaymentHistory } from '~src/api/teacherAPI';
import ClassesDetail from './ClassesDetail';
import ParticipationDetail from './ParticipationDetail';
import BonusAndRewards from './BonusAndRewards';
import Pagination from 'react-js-pagination';
import Adjustment from './Adjustment';
import Select from 'react-select';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { toastInit } from '~src/utils';
const fakeData = [ 
	{
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

let count = 0;

const now = new Date();
const TeacherPayment = () => {
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState({});
	const [selectedSection, setSelectedSection] = useState(typeOptions[0]);
	const [month, setMonth] = useState(monthOptions[now.getMonth()]);
	const [year, setYear] = useState(yearOptions[1]);
	const [isLoading, setIsLoading] = useState(true);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [dataClass, setDataClass] = useState({});
	const [dataSalary, setDataSalary] = useState({});
	const [dataBonus, setDataBonus] = useState({});

	const [totalRs, setTotalRs] = useState(0);

	console.log("Selection: ", selectedSection);

	console.log("RS ben nay: ", totalResult);

	const loadPaymentData = async () => {
		setIsLoading(true);
		const res = await getPaymentInfo({
			Date:
				selectedSection.value === 1
					? moment(
							new Date(`${month.value + 1}/01/${year.value + 20}`),
							'MM/DD/YYYY',
					  ).format('DD/MM/YYYY')
					: moment(
							new Date(`${month.value + 1}/16/${year.value + 20}`),
							'MM/DD/YYYY',
					  ).format('DD/MM/YYYY'),
		});
		if (res.Code == 1){
			count ++;
			if (
				count > 1			
			);
		} setDataSalary(res.Data);
		setIsLoading(false);
	};
	const loadClassesAPI = async () => {
		setIsLoading(true);
		try{
			const res = await getClassHistory({
				Page: parseInt(pageNumber), //Int
				Date:
					selectedSection.value === 1
						? moment(
								new Date(`${month.value + 1}/01/${year.value + 20}`),
								'MM/DD/YYYY',
						).format('DD/MM/YYYY')
						: moment(
								new Date(`${month.value + 1}/16/${year.value + 20}`),
								'MM/DD/YYYY',
						).format('DD/MM/YYYY'),
			});
			res.Code === 1 ? setDataClass(res.Data) : setDataClass([]);
			setTotalResult(res.TotalResult);
			setPageSize(res.PageSize)
			
			
		} catch (error){
			console.log(JSON.stringify(error));
		}
		setIsLoading(false);
	};
	const loadSalaryClassesAPI = async () => {
		setIsLoading(true);
		try {
			const res = await getSalaryTeacher({
				Date:
				selectedSection.value === 1
					? moment(
							new Date(`${month.value + 1}/01/${year.value + 20}`),
							'MM/DD/YYYY',
					  ).format('DD/MM/YYYY')
					: moment(
							new Date(`${month.value + 1}/16/${year.value + 20}`),
							'MM/DD/YYYY',
					  ).format('DD/MM/YYYY'),
			});
			console.log("loadSalaryClassesAPI: ",res.Data)
			res.Code === 1 ? setDataBonus(res.Data) : setDataBonus([]);
			setPageSize(res.PageSize);
			// setTotalRs(res?.TotalResult);
		} catch (error) {
			console.log(JSON.stringify(error));
		}
		setIsLoading(false);
	};
	const loadHisClassesAPI = async () => {
		setIsLoading(true);
		const params = {
			Page: parseInt(pageNumber),
			Date:
				selectedSection.value === 1
					? moment(
							new Date(`${month.value + 1}/01/${year.value + 20}`),
							'MM/DD/YYYY',
					  ).format('DD/MM/YYYY')
					: moment(
							new Date(`${month.value + 1}/16/${year.value + 20}`),
							'MM/DD/YYYY',
					  ).format('DD/MM/YYYY'),
		};
		const res = await getPaymentHistory(params);
		res.Code === 1 ? setData(res.Data) : setData([]);
		setPageSize(10);
		// setTotalResult(fakeData.length);
		// setData(fakeData);
		setIsLoading(false);
	};
	useEffect(() => {
		loadPaymentData();
	}, [selectedSection, month, year]);
	useEffect(() => {
		loadClassesAPI();
	}, [selectedSection, month, year , pageNumber]);
	useEffect(() => {
		loadSalaryClassesAPI();
	}, [selectedSection, month, year]);
	useEffect(() => {
		loadHisClassesAPI();
	}, [selectedSection, month, year]);
	return (
		<>
			{/*title trang*/}
			<div className="d-flex flex-sm-nowrap flex-wrap select-flex" style={{width:"520px",marginLeft:"auto"}}>
						<div className="d-flex">
							<div className="mg-r-10 wd-200">
								<Select
									options={typeOptions}
									onChange={setSelectedSection}
									defaultValue={selectedSection}
									formatOptionLabel={({ value, label }) => {
										return value === 1 ? (
											<span>
												1<sup>st</sup> to 15<sup>th</sup>
											</span>
										) : (
											<span>
												16<sup>th</sup> to end
											</span>
										);
									}}
								/>
								{/* <select className="form-control" value={selectedSection} onChange={(event) => setSelectedSection(event.target.value)} >
                                <option value="1">The first 2 weeks </option>
                                <option value="2">2 weeks later</option>
                            </select> */}
							</div>
							<div className="wd-150 flex-grow-1  mg-r-10">
								<Select
									options={monthOptions}
									onChange={setMonth}
									defaultValue={month}
									
								/>
								{/* <select className="form-control" value={month} onChange={(event) => setMonth(event.target.value)}>
                                {new Array(12).fill().map((ele, index) => {
                                    return <option key={`${index}`} value={index + 1}>{monthNames[index]}</option>;
                                })}
                            </select> */}
							</div>
							<div className="wd-150 flex-grow-1">
								<Select
									options={yearOptions}
									onChange={setYear}
									defaultValue={year}
								/>
							</div>
						</div>
					</div>
			<GridSalary  dataSalary={dataSalary} />
			<div className="payment__wrap mg-b-30 mg-t-30">
				<div className="box-white">
					<ClassesDetail dataClass={dataClass} totalResultPage={totalResult} selectionDate={selectedSection} monthDate={month} pageSizePage={pageSize}/>
					
				</div>
					
				<ParticipationDetail dataClass={dataClass} totalResultPage={totalResult} selectionDate={selectedSection} monthDate={month} pageSizePage={pageSize}/>
				<BonusAndRewards dataBonus={dataBonus}/>
				{/* <Adjustment /> */}
				<ToastContainer />
			</div>
		</>
	);
};

const domContainer = document.getElementById('react-teacher-payment');
ReactDOM.render(<TeacherPayment />, domContainer);
