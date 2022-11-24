import React, { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import { getPaymentHistory } from '~src/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'react-js-pagination';
import NumberFormat from 'react-number-format';

const RenderRow = ({ data }) => {
	return (
		<tr>
			<td data-title="Salery period" className="tx-left wd-md-150">
				{data.SalaryPeriod}
			</td>
			<td data-title="Total salary" className="tx-center">
				<NumberFormat
					value={`${data.Salary}`}
					displayType={'text'}
					thousandSeparator={true}
					suffix={'$'}
				/>
			</td>
			<td data-title="Date" className="tx-center">
				{data.CreatedDate}
			</td>
			<td data-title="Note" className="tx-center">
				{data.Note}
			</td>
		</tr>
	);
};
const now = new Date();
const PaymentHistory = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);

	const loadHistoryAPI = async () => {
		setIsLoading(true);
		const params = {
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
		};
		const res = await getPaymentHistory(params);
		res.Code === 1 ? setData(res.Data) : setData([]);
		setIsLoading(false);
	};

	useEffect(() => {
		loadHistoryAPI();
	}, [pageNumber]);

	return (
		<div className="card card-custom">
			<div className="card-header d-md-flex justify-content-between align-items-center pd-x-20-f pd-y-15-f">
				<h5 className="tx-dark mg-lg-b-0 mg-b-15">Payment history</h5>
				<div className="gv-datime-luong">
					<div className="form-row from-to-group" id="filter-time">
						<div className="d-flex flex-wrap-0 form-row pd-x-5 flex-grow-1">
							<div className="wd-sm-200 pd-x-5 wd-100p mg-b-10 mg-sm-b-0">
								<Flatpickr
									options={{
										dateFormat: 'd/m/Y',
										mode: 'single',
										maxDate: new Date(),
									}}
									className="form-control"
									onChange={date => setFromDate(date)}
									placeholder="From date"
								/>
							</div>
							<div className="wd-sm-200 pd-x-5 wd-100p">
								<Flatpickr
									options={{
										dateFormat: 'd/m/Y',
										maxDate: new Date(),
										mode: 'single',
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
									placeholder="To date"
								/>
							</div>
						</div>
						<div className="flex-grow-0 tx-right flex-shrink-0 pd-x-5 wd-100p wd-sm-auto tx-left mg-t-10 mg-sm-t-0">
							<button
								type="button"
								className="btn btn-primary wd-100p wd-sm-auto"
								onClick={loadHistoryAPI}
							>
								<i className="fa fa-search" />
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="card-body pd-20-f">
				<div className="">
					<table className="table responsive-table-vertical table-schedule-log table-hover ">
						<thead className="thead-primary">
							<tr className="gv-bg-table">
								<th className="tx-left">Salary Period</th>
								<th className="tx-center">Payment Amount</th>
								<th className="tx-center">Payment Date</th>
								<th className="tx-center">Notes</th>
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
									</tr>
								</>
							) : !!data && !!data.length > 0 ? (
								data.map((item, index) => (
									<RenderRow key={`${index}`} data={item} />
								))
							) : (
								<tr>
									<td colSpan={4}>
										<span className="tx-danger d-block tx-center tx-medium tx-16">
											No history record.
										</span>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				
			</div>
		</div>
	);
};

export default PaymentHistory;
