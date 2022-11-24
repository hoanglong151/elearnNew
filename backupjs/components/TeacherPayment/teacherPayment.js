import React from 'react';
import ReactDOM from 'react-dom';
import GridSalary from './GridSalary';
import PaymentHistory from './PaymentHistory';
import ClassesDetail from './ClassesDetail';
import ParticipationDetail from './ParticipationDetail';
import BonusAndRewards from './BonusAndRewards';
import Adjustment from './Adjustment';
const TeacherPayment = () => {
	return (
		<>
			{/*title trang*/}
			<GridSalary />

			<div className="payment__wrap mg-b-30 mg-t-30">
				<ClassesDetail />
				<ParticipationDetail />
				<BonusAndRewards />
				{/* <Adjustment /> */}
			</div>
		</>
	);
};

const domContainer = document.getElementById('react-teacher-payment');
ReactDOM.render(<TeacherPayment />, domContainer);
