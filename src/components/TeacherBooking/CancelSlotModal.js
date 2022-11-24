import React from 'react';
const CancelSlotModal = ({ data, handleCancelSlot }) => {
	const {
		id,
		date,
		teacherTime,
		vnTime,
		studentName,
		lessonName,
		courseName,
	} = data;
	const [reason, setReason] = React.useState('');
	const _onSubmit = e => {
		e.preventDefault();
		handleCancelSlot({ ...data, reason });
		setReason('');
	};
	return (
		<div
			className="modal fade effect-scale"
			data-backdrop="static"
			data-keyboard="false"
			id="md-cancel-slot"
			tabIndex={-1}
			role="dialog"
			aria-labelledby="cancel-slot"
			aria-hidden="true"
		>
			<div
				className="modal-dialog modal-dialog-centered modal-sm"
				role="document"
			>
				<div className="modal-content">
					<div className="modal-header bg-danger">
						<h5 className="mg-b-0 tx-white">Warning !!</h5>
					</div>
					<div className="modal-body">
						<p>
							Course: <span className="tx-medium">{courseName}</span>
						</p>
						<p>
							Lesson: <span className="tx-medium">{lessonName}</span>
						</p>
						<p>
							Student name: <span className="tx-medium">{studentName}</span>
						</p>
						<p>
							Your time: <span className="tx-medium">{teacherTime}</span>
						</p>
						<p>
							VN time: <span className="tx-medium">{vnTime}</span>
						</p>

						<div className="form-group">
							<textarea
								rows={3}
								className="form-control"
								placeholder="Reason"
								value={reason}
								onChange={e => setReason(e.target.value)}
							></textarea>
						</div>
						<p className="tx-danger">Do you want to cancel this lesson ?</p>
					</div>
					<div className="modal-footer bd-t-0 pd-t-0">
						<button
							type="button"
							className="btn btn-light btn-sm"
							data-dismiss="modal"
						>
							Cancel
						</button>
						<button
							type="button"
							className="btn btn-flat btn-sm tx-primary"
							onClick={_onSubmit}
						>
							Yes, cancel it
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CancelSlotModal;
