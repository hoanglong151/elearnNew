import React from 'react';
import ReactDOM from 'react-dom';
import styles from './teacherClassRooms.module.scss';
import { getAllClass, getUpcomingClass } from '~src/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import UpComingTable from '~components/table/UpComingTable';
import AllClassesTable from '~components/table/AllClassesTable';
import MissingFeedbackTable from '~components/table/MissingFeedbackTable';
import StudentInformationModal from '~components/StudentInformationModal';
import { Tab } from 'react-bootstrap';

const TeacherClassRooms = () => {
	const [studentId, setStudentId] = React.useState(null);
	const mdStudentInfo = React.useRef(true);
	const [activeTab, setActiveTab] = React.useState('upcoming');
	const showStudentModal = studentId => {
		setStudentId(studentId);
		$(mdStudentInfo.current).modal('show');
	};

	const unMountComponents = () => {
		mdStudentInfo.current = false;

		// setActiveTab('upcoming');
	};
	const getParamsUrl = () => {
		if (typeof window == undefined) return;
		const params = new URLSearchParams(window.location.search);
		return params;
	};
	React.useEffect(() => {
		console.log(
			'unMountComponents this.props.location.search =================== ',
		);
		const params = getParamsUrl();
		// if (!params.has('ID')) return;
		var t = params.get('t');

		if (t === 'upcoming' || t === 'missing' || t === 'allclass') {
			setActiveTab(t);
		}

		console.log(params.get('t'));
		return unMountComponents;
	}, []);
	let url = new URL('http://localhost:8080/teacher/teacherClassRooms.html');
	let params = { id: 'tab-2' };
	Object.keys(params).forEach(key =>
		url.searchParams.append(key, params['tab-2']),
	);
	console.log(url);
	fetch(url.href)
		.then(res => res.json())
		.then(val => {
			console.log(val);
		});

	return (
		<>
			<div className="teacher__detail__wrap ">
				<div className="teacher__detail ">
					<div className="teacher-body mg-t-0-f card card-custom">
						<div className="tab-navigation teacher-custom card-body pd-y-15-f">
							<ul className="list-tab" id="js-list-tab">
								<li
									className={`tab-item`}
									onClick={() => setActiveTab('upcoming')}
								>
									<a
										className={`tab-link ${
											activeTab === 'upcoming' ? 'active' : ''
										}`}
									>
										<i className="far fa-calendar-alt"></i> Upcoming classes
									</a>
								</li>
								<li
									className={`tab-item`}
									onClick={() => setActiveTab('missing')}
								>
									<a
										className={`tab-link ${
											activeTab === 'missing' ? 'active' : ''
										}`}
									>
										<i className="far fa-comment-alt"></i> Missing feedback
									</a>
								</li>
								<li
									className={`tab-item`}
									onClick={() => setActiveTab('allclass')}
								>
									<a
										className={`tab-link ${
											activeTab === 'allclass' ? 'active' : ''
										}`}
									>
										<i className="far fa-calendar-check"></i> All Classes
									</a>
								</li>
							</ul>
						</div>
						<div className="teacher__info-wrap pd-t-0-f card-body">
							<Tab.Container activeKey={activeTab} defaultActiveKey={activeTab}>
								<Tab.Content>
									<Tab.Pane eventKey="upcoming" id="tab-1">
										<UpComingTable showStudentModal={showStudentModal} />
									</Tab.Pane>
									<Tab.Pane eventKey="missing" id="tab-2">
										<MissingFeedbackTable />
									</Tab.Pane>
									<Tab.Pane eventKey="allclass" id="tab-3">
										<AllClassesTable showStudentModal={showStudentModal} />
									</Tab.Pane>
								</Tab.Content>
							</Tab.Container>
						</div>
					</div>
				</div>
			</div>

			<StudentInformationModal ref={mdStudentInfo} studentId={studentId} />
		</>
	);
};

const domContainer = document.getElementById('react-teacher-classrooms');
ReactDOM.render(<TeacherClassRooms />, domContainer);
