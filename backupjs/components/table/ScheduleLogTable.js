import React, { useState, useEffect, createRef } from 'react';
import ReactDOM from 'react-dom';
import StudentInformationModal from '~components/StudentInformationModal';
import SkeletonTable from '~components/common/Skeleton/SkeletonTable';
import { getScheduleLog } from '~src/api/teacherAPI';
import Pagination from 'react-js-pagination';

const OperationRow = ({ data }) => {
	const {
		OparationTime,
		CreatedBy,
		ScheduleTimeOfTeacher,
		ScheduleTimeLocal,
		Previous,
		UpdatedAction,
	} = data;
	return (
		<tr>
			<td data-title="Operation time">{OparationTime}</td>

			<td data-title="Time (Local)">{ScheduleTimeOfTeacher}</td>
			<td data-title="Time (VN)">{ScheduleTimeLocal}</td>
			{/* <td className="tx-center">
                {Previous === 'Close' ? <span className="badge badge-danger">Closed</span> : <span className="badge badge-success">Open</span>}
                <span className="badge badge-danger">Closed</span>
            </td> */}
			<td data-title="Operator" className="tx-center">
				<span className="badge badge-info pd-5 tx-12">{CreatedBy}</span>
			</td>
			<td data-title="Action" className="tx-center">
				{/* {UpdatedAction === 'Close' ? <span className="badge badge-danger">Closed</span> : <span className="badge badge-success">Open</span>} */}
				{/* <span className="badge badge-success">Open</span> */}
				{<p className="mg-b-0">{UpdatedAction}</p>}
			</td>
		</tr>
	);
};

const ScheduleLogTable = ({ showStudentModal }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const loadScheduleLogData = async () => {
		try {
			const res = await getScheduleLog({
				Page: pageNumber,
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

	const _handlePageChange = value => {
		console.log('Page active is: ', value);
		setPageNumber(value);
	};

	useEffect(() => {
		loadScheduleLogData();
	}, [pageNumber]);

	return (
		<>
			{isLoading ? (
				<SkeletonTable />
			) : (
				<>
					<div className="mg-b-15">
						<table className="table responsive-table-vertical table-schedule-log table-hover">
							<thead className="thead-primary">
								<tr>
									<th>Operation time</th>
									<th>Schedule time (Your time)</th>
									<th>Schedule time (VN)</th>
									<th className="tx-center">Operator</th>
									{/* <th className="tx-center">Action</th> */}
									<th className="tx-center">Action</th>
								</tr>
							</thead>
							<tbody>
								{!!data && !!data.length > 0 ? (
									data.map((item, index) => (
										<OperationRow
											key={`${index}`}
											data={item}
											showStudentModal={showStudentModal}
										/>
									))
								) : (
									<tr>
										<td colSpan={6}>
											<span className="tx-danger d-block tx-center tx-medium tx-16">
												No data found.
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

export default ScheduleLogTable;
