import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import Skeleton from 'react-loading-skeleton';
import TeacherSupportModal from '~components/TeacherSupportModal';
import { ToastContainer } from 'react-toastify';
import SkeletonLessonHistoryCard from '~components/common/Skeleton/SkeletonLessonHistoryCard';

import styles from '~components/StudentSupport/StudentSupport.module.scss';
import Header from '~src/components/Header';
import Footer from '~src/components/Footer';
import ProfileSidebar from '~src/components/ProfileSidebar';
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
const initialState = [
	{
		id: 11,
		author: 'Hoàng Văn Thái',
		location: 'Việt Nam',
		avatar:
			'http://e-learn.monamedia.net/Upload/imageform/b91bcbcf-2de9-436e-8795-725625409da5X93BLS1J78XN5DFQJ264EXY6NUYRWS438JOFKC9V.jpg',
		title: 'Tăng số lượng bài giảng',
		content: `<p>Greetings!</p>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </p>
    <p>Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. </p>
    <p>Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem.</p><p><span>Sincerely yours,</span><br /><strong>Mona Media Team</strong></p>`,
		date: new Date(),
		files: [
			{
				id: 1,
				name: 'File 1',
				url: 'https://drive.google.com/drive/',
			},
			{
				id: 2,
				name: 'File 2',
				url: 'https://drive.google.com/drive/',
			},
		],
		status: 1,
	},
	{
		id: 12,
		author: 'Trần Văn A',
		location: 'U.S.',
		avatar: null,
		title: 'Không book được bài học',
		content: `<p>Greetings!</p>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </p>
    <p>Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. </p>
    <p>Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem.</p><p><span>Sincerely yours,</span><br /><strong>Mona Media Team</strong></p>`,
		date: new Date(),
		status: 2,
		files: [
			{
				id: 1,
				name: 'File 3',
				url: 'https://drive.google.com/drive/',
			},
		],
	},
	{
		id: 13,
		author: 'Hoàng Văn Thái',
		location: 'Việt Nam',
		avatar: null,
		title: 'Đơn xin nghỉ phép',
		content: `<p>Greetings!</p>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </p>
    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC.</p>
    <p>Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem.</p><p><span>Sincerely yours,</span><br /><strong>Mona Media Team</strong></p>`,
		date: new Date(),
		status: 3,
		files: [
			{
				id: 1,
				name: 'File 4',
				url: 'https://drive.google.com/drive/',
			},
			{
				id: 2,
				name: 'File 5',
				url: 'https://drive.google.com/drive/',
			},
		],
	},
];

const StudentSupport = () => {
	const [state, setState] = useState([]);
	const [filter, setFilter] = useState(0);
	const [showDetail, setShowDetail] = useState(false);
	const [selectedDetail, setSelectedDetail] = useState(null);
	const [loading, setLoading] = useState(false);
	const { t, i18n } = useTranslation('common');
	let filteredState = [...state];
	if (filter !== 0) {
		filteredState = filteredState.filter(item => item.status === filter);
	}

	const _showDetail = (e, item) => {
		e.preventDefault();
		setShowDetail(true);
		setSelectedDetail(item);
		if (typeof window == undefined) return;
		window.history.pushState(
			{ item: item },
			'Detail Stage',
			`${window.location.pathname}?ID=${item.id}`,
		);
	};

	const handleClickBack = () => {
		setShowDetail(false);
		setSelectedDetail(null);
		if (typeof window == undefined) return;
		window.history.pushState(
			null,
			'Support Stage',
			`${window.location.pathname}`,
		);
	};

	const checkDetailUrl = resState => {
		if (typeof window == undefined) return;
		const params = new URLSearchParams(window.location.search);
		console.log(params);
		if (params.has('ID')) {
			const index = resState.findIndex(item => item.id == params.get('ID'));
			if (index !== -1) {
				setShowDetail(true);
				setSelectedDetail(resState[index]);
			}
		}
	};

	const getAPI = async () => {
		setLoading(true);
		setState(initialState);
		setLoading(false);
		checkDetailUrl(initialState);
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
		getAPI();
	}, []);

	return (
		<>
			<div className="Header">
				<Header />
			</div>
			<div className="ProfileSidebar">
				<ProfileSidebar />
			</div>
			<div className="d-xl-flex justify-content-between mg-b-30">
				<h4 className="mg-b-0-f d-block gradient-heading">
					<i className="fas fa-calendar-alt"></i>SUPPORT CENTER
				</h4>
				<button
					type="button"
					className="btn btn-primary"
					data-toggle="modal"
					data-target="#md-teacher-support"
					id="contactsub"
				>
					<i className="fa fa-plus mg-r-10"></i>Ticket
				</button>
			</div>
			<div className="media-body-wrap pd-15 shadow">
				{showDetail ? (
					<DetailBox state={selectedDetail} _onClickBack={handleClickBack} />
				) : (
					<>
						<div className="tab-navigation">
							<ul className="list-tab align-items-stretch" id="js-list-tab">
								<li className="tab-item h-auto">
									<a
										href={'#'}
										className={`${filter === 0 ? 'active' : ''} tab-link h-100`}
										data-index={0}
										onClick={e => {
											e.preventDefault();
											setFilter(0);
										}}
									>
										TẤT CẢ
									</a>
								</li>
								<li className="tab-item h-auto">
									<a
										href={'#'}
										className={`${filter === 1 ? 'active' : ''} tab-link h-100`}
										data-index={0}
										onClick={e => {
											e.preventDefault();
											setFilter(1);
										}}
									>
										ĐÃ XỬ LÝ
									</a>
								</li>
								<li className="tab-item h-auto">
									<a
										href={'#'}
										className={`${filter === 2 ? 'active' : ''} tab-link h-100`}
										data-index={0}
										onClick={e => {
											e.preventDefault();
											setFilter(2);
										}}
									>
										ĐANG XỬ LÝ
									</a>
								</li>
								<li className="tab-item h-auto">
									<a
										href={'#'}
										className={`${filter === 3 ? 'active' : ''} tab-link h-100`}
										data-index={0}
										onClick={e => {
											e.preventDefault();
											setFilter(3);
										}}
									>
										ĐÃ HỦY
									</a>
								</li>
							</ul>
						</div>
						<div className="table-responsive mg-b-15 mg-t-30">
							<table className="table table-custom table-borderless">
								<thead>
									<tr>
										<th>Tiêu đề</th>
										<th>Ngày gửi</th>
										<th>Trạng thái</th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<>
											<SkeletonLessonHistoryCard column={3} />
											<SkeletonLessonHistoryCard column={3} />
											<SkeletonLessonHistoryCard column={3} />
										</>
									) : (
										!!filteredState &&
										filteredState.length > 0 &&
										filteredState.map(item => (
											<tr key={`${item.id}`}>
												<td>
													{' '}
													<span>
														<a
															href={`#`}
															className="sup-item-table-tieude"
															onClick={e => _showDetail(e, item)}
														>
															{item.title}
														</a>
													</span>
													<br />
												</td>
												<td>
													<span className="sup-item-table-gio">
														{moment(item.date).format('DD/MM/YYYY HH:mm')}
													</span>{' '}
													<br />
												</td>
												<td>
													<span
														className={`badge badge-${
															item.status === 1
																? 'success'
																: item.status === 2
																? 'warning'
																: 'danger'
														} pd-5 tx-12 wd-75`}
													>
														{item.status === 1
															? 'Đã xử lý'
															: item.status === 2
															? 'Đang xử lý'
															: 'Đã hủy'}
													</span>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</>
				)}
			</div>
			<TeacherSupportModal />
			<ToastContainer />
			<div className="Footer">
				<Footer />
			</div>
		</>
	);
};

const DetailBox = ({ state, _onClickBack }) => {
	const [loading, setLoading] = useState(false);

	return (
		<>
			<div className="">
				<button
					type="button"
					className="btn btn-sm btn-light mg-b-15"
					onClick={_onClickBack}
				>
					<i className="fas fa-arrow-left mg-r-5"></i> Back
				</button>
				<div className="mg-b-30 bd-b pd-b-10 d-flex align-items-center justify-content-between">
					<h5 className="mg-b-0 pd-r-5">
						{loading ? (
							<Skeleton width={200} height={25} />
						) : (
							state?.title ?? ''
						)}
					</h5>
					<span className="tx-gray-300">
						{loading ? (
							<Skeleton width={100} height={25} />
						) : (
							moment(state?.date).format('DD/MM/YYYY HH:mm') ?? ''
						)}
					</span>
				</div>
				<div className="d-flex align-items-center">
					<span className="avatar avatar-md">
						{loading ? (
							<Skeleton circle={true} width={48} height={48} />
						) : (
							<img
								src={state?.avatar ?? '../assets/img/default-avatar.png'}
								className="rounded-circle"
								alt="Avatar"
								onError={e => {
									e.target.onerror = null;
									e.target.src = '../assets/img/default-avatar.png';
								}}
							/>
						)}
					</span>
					<div className="mg-l-10">
						<h6 className="tx-semibold mg-b-0">
							{loading ? (
								<Skeleton width={100} height={25} />
							) : (
								state?.author ?? ''
							)}
						</h6>
						<span className="tx-color-03">
							{loading ? (
								<Skeleton width={100} height={25} />
							) : (
								state?.location ?? ''
							)}
						</span>
					</div>
				</div>
				{loading ? (
					<div className="pd-y-30">
						<Skeleton count={5} />
					</div>
				) : (
					<div
						className="pd-y-30"
						dangerouslySetInnerHTML={{ __html: state?.content ?? '' }}
					></div>
				)}
				<div className="file-include pd-y-15 bd-t">
					<h6>File attachment:</h6>
					<div className="d-flex align-items-center flex-wrap">
						{loading ? (
							<Skeleton width={100} height={25} />
						) : (
							!!state &&
							!!state.files &&
							[...state.files].map(file => (
								<a
									key={`${file.id}`}
									href={file.url}
									target="_blank"
									className="mg-5"
								>
									<i className="fas fa-file mg-r-5"></i> {file.name}
								</a>
							))
						)}
					</div>
				</div>
			</div>
		</>
	);
};

ReactDOM.render(
	<I18nextProvider i18n={i18next}>
		<StudentSupport />
	</I18nextProvider>,
	document.getElementById('react-student-support'),
);
