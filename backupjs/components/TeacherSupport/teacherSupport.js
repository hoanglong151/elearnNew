import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { randomId } from '~src/utils';
import TeacherSupportModal from '~components/TeacherSupportModal';
import { ToastContainer } from 'react-toastify';
import SupportDetail from './SupportDetail';
import styles from '~components/TeacherSupport/teacherSupport.module.scss';
import { getListSupport, getOverviewSupport } from '~src/api/teacherAPI';
import Pagination from 'react-js-pagination';
import Skeleton from 'react-loading-skeleton';
import { Filter } from 'styled-icons/ionicons-solid';
import Flatpickr from 'react-flatpickr';

const TeacherSupport = () => {
	const [state, setState] = useState([]);
	const [filterState, setFilterState] = useState([]);
	const [overView, setOverView] = useState(null);
	const [filter, setFilter] = useState(0);
	const [showDetail, setShowDetail] = useState(false);
	const [detailId, setDetailId] = useState(0);
	const [pageNumber, setPageNumber] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');

	const pushHistoryState = id => {
		if (typeof window == undefined) return;
		const history = window.history;
		history.pushState(
			{ id: id },
			'Ticket detail',
			`${window.location.pathname}?id=${id}`,
		);
	};

	const showDetailBox = id => {
		setDetailId(id);
		pushHistoryState(id);
		setShowDetail(true);
	};

	const _handlefilter = index => {
		showDetail && hideDetailBox();
		setFilter(index);
		setPageNumber(1);
	};

	const hideDetailBox = () => {
		setShowDetail(false);
		window.history.pushState(
			null,
			'Teacher Support',
			`${window.location.pathname}`,
		);
	};

	const checkDetailUrl = () => {
		if (typeof window == undefined) return;
		const params = new URLSearchParams(window.location.search);
		params.has('id') && showDetailBox(params.get('id'));
	};

	const getSupportList = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await getListSupport({
				Status: parseInt(filter, 10),
				Page: parseInt(page, 10),
				FromDate:
					fromDate.length === 0
						? ''
						: moment(new Date(fromDate)).format('DD/MM/YYYY'), // string dd/mm/yyyy
				ToDate:
					toDate.length === 0
						? ''
						: moment(new Date(toDate)).format('DD/MM/YYYY'), // string dd/mm/yyyy
			});
			if (res.Code === 1) {
				setState(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			}
		} catch (error) {
			console.log(error?.message ?? 'Call api getListSupport kh??ng th??nh c??ng');
		}
		setIsLoading(false);
	};

	const refreshList = async () => {
		await getSupportList();
		await getOverView();
	};

	const getOverView = async () => {
		try {
			const res = await getOverviewSupport();
			res.Code === 1 && setOverView(res.Data);
		} catch (error) {
			console.log(
				error?.message ?? 'Call api SupportOverview kh??ng th??nh c??ng',
			);
		}
	};

	const afterCancelSuccess = ID => {
		let newState = [...state];

		var index = state.findIndex(i => i.ID === ID);
		if (index !== -1) {
			newState[index].STATUS = 4;
		}
		setFilterState({
			...newState,
		});
		hideDetailBox();
	};

	const _onSearch = () => {
		getSupportList(1);
		setPageNumber(1);
	};

	useEffect(() => {
		getSupportList(1);
	}, [filter]);

	useEffect(() => {
		getSupportList(pageNumber);
	}, [pageNumber]);

	useEffect(() => {
		getOverView();
		checkDetailUrl();
	}, []);

	return (
		<div className="sup">
			<div className="d-flex flex-wrap flex-xl-nowrap row--lg">
				<div className="wd-100p mg-xl-b-0 mg-b-30 wd-xl-300 pd-xl-x-15 d-sm-flex d-xl-block flex-shrink-0">
					<div className="card card-custom w-100">
						<div className="sub-menu card-body">
							<p
								className={`${filter === 0 &&
									'active'} d-flex align-items-center justify-content-between`}
							>
								<a className="link" onClick={() => _handlefilter(0)}>
									Total Tickets
								</a>
								<span className="badge-number">{overView?.All ?? 0}</span>
							</p>

							<p
								className={`${filter === 1 &&
									'active'} d-flex align-items-center justify-content-between`}
							>
								<a className="link" onClick={() => _handlefilter(1)}>
									Newly created
								</a>
								<span className="badge-number">{overView?.News ?? 0}</span>
							</p>
							<p
								className={`${filter === 2 &&
									'active'} d-flex align-items-center justify-content-between`}
							>
								<a className="link" onClick={() => _handlefilter(2)}>
									Processing
								</a>
								<span className="badge-number">
									{overView?.Processing ?? 0}
								</span>
							</p>
							<p
								className={`${filter === 3 &&
									'active'} d-flex align-items-center justify-content-between`}
							>
								<a className="link" onClick={() => _handlefilter(3)}>
									Ticket Closed
								</a>
								<span className="badge-number">{overView?.Answered ?? 0}</span>
							</p>
							<p
								className={`${filter === 4 &&
									'active'} d-flex align-items-center justify-content-between`}
							>
								<a className="link" onClick={() => _handlefilter(4)}>
									Ticket Canceled
								</a>
								<span className="badge-number">{overView?.Cancelled ?? 0}</span>
							</p>
							<button
								type="button"
								className="btn btn-primary btn-block mg-t-15"
								data-toggle="modal"
								data-target="#md-teacher-support"
								id="contactsub"
							>
								<i className="fa fa-plus mg-r-10"></i>New Ticket
							</button>
						</div>
					</div>
				</div>
				<div className="flex-grow-1 pd-xl-x-15 wd-100p">
					<div className="card card-custom">
						<div className="card-body pd-15-f">
							{showDetail ? (
								<SupportDetail
									onClickBack={hideDetailBox}
									detailId={detailId}
									afterCancelSuccess={afterCancelSuccess}
								/>
							) : (
								<>
									<div
										className="d-flex from-to-group mg-b-15"
										id="filter-time"
									>
										<div className="d-flex flex-wrap-0">
											<div className="wd-sm-200 mg-sm-r-10 wd-100p mg-b-10 mg-sm-b-0">
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
											<div className="wd-sm-200 mg-sm-r-10 wd-100p">
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
										<div className="flex-grow-0 tx-right flex-shrink-0 wd-100p wd-sm-auto tx-left mg-t-10 mg-sm-t-0">
											<button
												type="button"
												className="btn btn-primary wd-100p wd-sm-auto"
												onClick={_onSearch}
											>
												<i className="fa fa-search" /> Search
											</button>
										</div>
									</div>
									<div className="table-responsive mg-b-15">
										<table className="table table-borderless table-hover">
											<thead className="thead-primary">
												<tr>
													<th>Ticket title</th>
													<th>Sending date</th>
													<th className="tx-center">Status</th>
												</tr>
											</thead>
											<tbody>
												{isLoading ? (
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
												) : !!state && state.length > 0 ? (
													state.map(item => (
														<tr key={`${item.ID}`}>
															<td>
																{' '}
																<span>
																	<a
																		href="#"
																		onClick={() => showDetailBox(item.ID)}
																		className="sup-item-table-tieude"
																	>
																		{item.SupportTitle}
																	</a>
																</span>
																<br />
															</td>
															<td>
																<span className="sup-item-table-gio">
																	{moment(item.CreatedDate).format(
																		'DD/MM/YYYY',
																	)}
																</span>{' '}
																<br />
															</td>
															<td className="text-center">
																<span
																	className={`badge badge-${
																		item.STATUS === 1
																			? 'info wd-100'
																			: item.STATUS === 2
																			? 'warning wd-75'
																			: item.STATUS === 3
																			? 'success wd-75'
																			: 'danger wd-75'
																	} pd-5 tx-12 `}
																>
																	{item.STATUS === 1
																		? 'Newly created'
																		: item.STATUS === 2
																		? 'Processing'
																		: item.STATUS === 3
																		? 'Closed'
																		: 'Cancelled'}
																</span>
															</td>
														</tr>
													))
												) : (
													<tr key={`${randomId}`}>
														<td colSpan={3} className="tx-center">
															<span className="tx-bold tx-danger">
																No support ticket
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
						</div>
					</div>
				</div>
			</div>

			<TeacherSupportModal refreshList={refreshList} />
			<ToastContainer />
		</div>
	);
};

const domContainer = document.getElementById('react-teacher-support');
ReactDOM.render(<TeacherSupport />, domContainer);
