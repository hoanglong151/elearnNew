import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import Pagination from 'react-js-pagination';
import SkeletonLessonHistoryCard from '~components/common/Skeleton/SkeletonLessonHistoryCard';
import { getPaymentHistoryAPI } from '~src/api/studentAPI';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import common_en from '../../public/static/locales/en/language.json';
import common_vi from '../../public/static/locales/vi/language.json';
i18next.init({
	interpolation: { escapeValue: false },
});
i18next.init({
	interpolation: { escapeValue: false },
	lng: 'vi',
	resources: {
		en: {
			common: common_en,
		},
		vi: {
			common: common_vi,
		},
	},
});
const PaymentHistory = () => {
	const [state, setState] = useState([]);
	const [loading, setLoading] = useState(false);

	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);

	const handlePageChange = pageNumber => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAPI({
				Page: pageNumber,
			});
		}
	};
	const { t, i18n } = useTranslation('common');
	const getAPI = async params => {
		setLoading(true);
		const res = await getPaymentHistoryAPI(params);
		if (res.Code === 1 && res.Data.length > 0) {
			setState(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		} else setState(null);
		setLoading(false);
	};

	useEffect(() => {
		var language = window.localStorage.getItem('language');

		if (language.includes('en')) {
			i18next.init({
				interpolation: { escapeValue: false },
				lng: 'en',
				compatibilityJSON: 'v2',
				resources: {
					en: {
						common: common_en,
					},
					vi: {
						common: common_vi,
					},
				},
			});
		} else if (language.includes('vi')) {
			i18next.init({
				interpolation: { escapeValue: false },
				lng: 'vi',
				compatibilityJSON: 'v2',
				resources: {
					en: {
						common: common_en,
					},
					vi: {
						common: common_vi,
					},
				},
			});
		}
		getAPI({
			Page: 1,
		});
	}, []);

	return (
		<>
			{/*
 <div className="subcription-title">
 <div className="d-flex flex-wrap align-items-center justify-content-between mg-b-15">
   <div className="payment wd-sm-50p wd-100p">
     <div className="list-subscription">
       <dl className="subscription-info ">
         <dt>Payment method</dt>
         <dd>
           <span><i className="fa fa-visa" />VISA</span>
         </dd>
       </dl>
       <dl className="subscription-info ">
         <dt>Name</dt>
         <dd>
           <span>TRUONG VAN LAM</span>
         </dd>
       </dl>
       <dl className="subscription-info ">
         <dt>Date Expired</dt>
         <dd>
           <span>06/2022</span>
         </dd>
       </dl>
       <dl className="subscription-info ">
         <dt>Card number:</dt>
         <dd>
           <span>XXXX-XXXX-XXXX-XXXX</span>
         </dd>
       </dl>
     </div>
   </div>
   <div className="code wd-sm-50p wd-100p">
     <div className="reference-code card pd-15 mg-x-auto mw-300">
       <dl className="subscription-info ">
         <dt>Referrence code:</dt>
         <dd>
           <span>MONA08438943</span>
         </dd>
       </dl>
       <dl className="subscription-info ">
         <dt>Promotion code:</dt>
         <dd>
           <span>MONA08438943</span>
         </dd>
       </dl>
     </div>
   </div>
 </div>
 <ul className="mg-0">
   <li>Long term plans will be expired on next payment
   date.</li>
   <li>For recurring plans, you can book a class after the
   payment date only if payment has been successfully
   tendered. Recurring payments are made at 12 PM on
   the payment date. (Lessons booked in advance will
   not be cancelled.)</li>
   <li>You can check payment history for the past year
   only.</li>
   <li>Please contact <strong>Customer Support
     (support@mona.media.com)</strong> for more
   information. </li>
 </ul>
 <div className="tx-center mg-y-15">
   <a href={"#"} className="btn btn-primary rounded-pill"><i className="fas fa-edit mg-r-5" /> Credit card</a>
 </div>
</div>*/}
			<div className="table-tiket">
				<div className="table-responsive">
					<table className="table tx-center tx-nowrap">
						<thead className="thead-primary">
							<tr>
								<th className="mw-200">{t('courseplan')}</th>
								<th>{t('classduration')}</th>
								<th>{t('totallessons')}</th>
								<th>{t('amount')}</th>
								<th>{t('paymentdate')}</th>
								<th>{t('courseduration')}</th>
								<th>{t('status')}</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<SkeletonLessonHistoryCard column={6} />
							) : !!state && Array.isArray(state) && state.length > 0 ? (
								state.map((item, index) => (
									<tr key={index}>
										<td className="tx-left mw-200">
											<span
												className="d-block tx-medium tx-primary"
												style={{ whiteSpace: 'normal' }}
											>
												{item.PlanName}
											</span>
											<span className="d-block tx-normal">
												{`Bắt đầu:`}
												<span className="tx-medium mg-l-5">{`${item.StartDate &&
													item.StartDate.split(' ')[0]}`}</span>
											</span>

											<span className="d-block tx-normal">
												{`Kết thúc:`}
												<span className="tx-medium mg-l-5">{`${item.EndDate &&
													item.EndDate.split(' ')[0]}`}</span>
											</span>
										</td>
										<td>{item.Duration}</td>
										<td>{item.TotalLesson}</td>
										<td>{item.Amount}</td>
										<td>
											{item.PaymentDate &&
												moment(item.PaymentDate).format('DD/MM/YYYY')}
										</td>
										<td>{item.ExpirationDate}</td>
										<td>
											<span
												className={`badge badge-${
													item.Status === 1
														? 'warning'
														: item.Status === 2
														? 'success'
														: 'danger'
												} pd-5 tx-12 wd-100`}
											>
												{item.Status === 1
													? 'Chưa kích hoạt'
													: item.Status === 2
													? 'Đã kích hoạt'
													: 'Hết hạn'}
											</span>
										</td>
									</tr>
								))
							) : !state ? (
								<tr className="bg-transparent">
									<td colSpan="9">
										<span className="d-block tx-danger tx-medium">
											Đã có lỗi xảy ra, xin vui lòng thử lại
										</span>
										<img
											src="../assets/img/error.svg"
											alt="image"
											className="wd-200 mg-b-15"
										/>
									</td>
								</tr>
							) : (
								<tr className="bg-transparent">
									<td colSpan="9">
										<span className="d-block tx-danger tx-medium">
											Bạn vui lòng đăng ký khóa học và làm thủ tục thanh toán
										</span>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				{pageSize < totalResult && (
					<Pagination
						innerClass="pagination justify-content-center mt-3"
						activePage={page}
						itemsCountPerPage={pageSize}
						totalItemsCount={totalResult}
						pageRangeDisplayed={3}
						itemClass="page-item"
						linkClass="page-link"
						onChange={handlePageChange.bind(this)}
					/>
				)}
			</div>
		</>
	);
};

export default PaymentHistory;
