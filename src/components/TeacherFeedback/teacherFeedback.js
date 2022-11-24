import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { randomId } from '../../utils';
import TeacherComment from '../common/TeacherComment';
import SkeletonFeedback from '~components/common/Skeleton/SkeletonFeedback';
import { getFeedback, getOverviewFeedback } from '~src/api/teacherAPI';
import { CSSTransition } from 'react-transition-group';
import styles from './teacherFeedback.module.scss';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'react-js-pagination';

const feedbackDemo = [
	{
		id: randomId(),
		stName: 'Truong Van Lam',
		stAvatar: null,
		stFeedback: '',
		lessonTime: '12/06/2020 10:30AM (Vietnam Time)',
		lessonName: 'Lesson 6: ReactJS application',
		rating: '5',
	},
	{
		id: randomId(),
		stName: 'Truong Van Lam',
		stAvatar:
			'https://i.pinimg.com/236x/aa/84/88/aa8488c0bdc927ac836586c004c7cb12.jpg',
		stFeedback:
			'Buổi học rất tốt, giảng viên nhiệt tình. Giảng viên phát âm rất chuẩn chỉnh',
		lessonTime: '12/06/2020 10:30AM (Vietnam Time)',
		lessonName: 'Lesson 6: ReactJS application',
		rating: '3',
	},
];

const commentDemo = [
	{
		id: randomId(),
		dateTime: new Date(),
		teacherName: 'Kelly Clarkson',
		teacherAvatar:
			'https://i.pinimg.com/236x/aa/84/88/aa8488c0bdc927ac836586c004c7cb12.jpg',
		content: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error earum
        molestias consequatur, iusto accusantium minima est saepe porro id odit nam, numquam
        voluptates quis repudiandae veniam. Provident illum et voluptate. Lorem ipsum dolor sit,
        amet consectetur adipisicing elit. Quaerat aliquam magni impedit vitae sit expedita totam
        labore neque, dolores eos veritatis? Qui nisi, ipsa nostrum nulla labore esse dicta.
        Aspernatur`,
		editted: false,
	},
	{
		id: randomId(),
		dateTime: new Date(),
		teacherName: 'Holy Breaker',
		teacherAvatar:
			'https://i.pinimg.com/236x/aa/84/88/aa8488c0bdc927ac836586c004c7cb12.jpg',
		content: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error earum
        molestias consequatur, iusto accusantium minima est saepe porro id odit nam, numquam
        voluptates.`,
		editted: false,
	},
];

const FeedbackRow = ({
	data: {
		id,
		stName,
		stAvatar,
		stFeedback,
		lessonTime,
		lessonName,
		rating,
		FeedbackLink,
	},
}) => {
	const [content, setContent] = React.useState('');
	const [isEditing, setIsEditing] = React.useState(false);
	const _showReply = event => {
		event.preventDefault();
		setContent('');
		setIsEditing(true);
	};

	const _hideReply = event => {
		event.preventDefault();
		setContent('');
		setIsEditing(false);
	};

	const _onChange = event => {
		event.preventDefault();
		setContent(event.target.value);
	};

	const _onSubmit = event => {
		event.preventDefault();
		addComment(id, content);
		setContent('');
		setIsEditing(false);
	};

	const addComment = () => {};

	const updateComment = comments => {
		//API update comment
		console.log('Comments updated call API:', comments);
	};

	useEffect(() => console.log(isEditing), [isEditing]);
	return (
		<div className="fb-item">
			<div className="fb-avatar">
				<img
					src={stAvatar || '../assets/img/default-avatar.png'}
					alt="avatar"
					className="avatar"
				/>
			</div>
			<div className="fb-info">
				<div className="name-rating mg-b-0-f">
					<p className="name">{stName}</p>
					<div className="rating-wrap">
						<div className="rating">
							{[...Array(5)].map((el, index) =>
								5 - index <= rating ? (
									<i key={`${index}`} className="fas fa-star" />
								) : (
									<i key={`${index}`} className="far fa-star" />
								),
							)}
						</div>
					</div>
				</div>

				<div className="metas mg-b-10-f">
					<div className="meta">
						Class Time: <span className="tx-info">{lessonTime}</span>
					</div>
					<div className="meta">
						Lesson: <span className="tx-info">{lessonName}</span>
					</div>
				</div>
				<div className="feedback-comment mg-b-15-f">
					{!!stFeedback && stFeedback !== '' ? (
						<p className="word-break">{stFeedback}</p>
					) : (
						<p className="tx-danger tx-medium">
							The student didn't leave any feedback for this class
						</p>
					)}
				</div>
				<CSSTransition
					timeout={300}
					in={isEditing}
					classNames="edit"
					onEnter={() => setIsEditing(true)}
					onExited={() => setIsEditing(false)}
				>
					<>
						{isEditing && (
							<div className="reply-box">
								<div className="form-group cmt-box">
									<textarea
										rows={5}
										className="form-control"
										value={content}
										onChange={_onChange}
										placeholder="Feedback content..."
									/>
								</div>
								<div className="cmt-action">
									<a
										href={`#`}
										className="btn btn-primary mg-r-10"
										onClick={_onSubmit}
									>
										Submit
									</a>
									<a
										href={`#`}
										className="btn btn-light btn-cancel-form"
										onClick={_hideReply}
									>
										Cancel
									</a>
								</div>
							</div>
						)}
					</>
				</CSSTransition>

				{!isEditing && (
					<div className="actions">
						<a
							href={FeedbackLink}
							className="btn btn-sm btn-warning mg-r-10"
							target="_blank"
							rel="noopener"
						>
							<i className="fas fa-vote-yea mg-r-5" /> Detail lesson
						</a>
						{/* <a href={`#`} className="btn btn-sm btn-outline-twitter btn-icon btn-reply" onClick={_showReply}><i className="fas fa-reply" /> Reply</a> */}
					</div>
				)}

				{/* <div className="tc-comment-wrap">
                    {<RenderCommentFeedback feedbackId={id} updateComment={updateComment}/>}
                </div> */}
			</div>
		</div>
	);
};

const RenderCommentFeedback = ({ id, updateComment }) => {
	const [comments, setComments] = React.useState(null);
	const _onUpdateComment = (cmtId, cmtContent) => {
		setComments(
			[...comments].map(cmt =>
				cmt.id === cmtId
					? {
							...cmt,
							content: cmtContent,
							editted: true,
							dateTime: new Date(),
					  }
					: cmt,
			),
		);
		updateComment(comments);
	};

	React.useEffect(() => {
		setTimeout(() => setComments(commentDemo), 1000);
	}, []);

	return (
		<>
			{!comments && <SkeletonComment />}
			{!!comments && (
				<h6 className="mg-b-15">The teacher had commented on this feedback:</h6>
			)}
			{!!comments &&
				comments.length > 0 &&
				comments.map(comment => (
					<TeacherComment
						key={`${comment.id}`}
						data={{
							id: comment.id,
							teacherName: comment.teacherName,
							teacherAvatar: comment.teacherAvatar,
							dateTime: comment.dateTime,
							commentContent: comment.content,
							editted: comment.editted,
						}}
						handleUpdateComment={_onUpdateComment}
					/>
				))}
		</>
	);
};

const RenderSummary = ({ handFilterValue }) => {
	const [overview, setOverview] = React.useState({});
	const [isLoading, setIsLoading] = React.useState(true);

	const fetchSummary = async () => {
		setIsLoading(true);
		try {
			const res = await getOverviewFeedback();
			res.Code === 1 && setOverview(res.Data);
		} catch (error) {
			console.log(error.message);
		}
		setIsLoading(false);
	};

	const _onChangeFilter = e => {
		handFilterValue(e.target.value);
	};

	React.useEffect(() => {
		console.log(overview);
	}, [overview]);

	React.useEffect(() => {
		fetchSummary();
	}, []);

	return (
		<div className="filter-sidebar flex-shrink-0">
			<div className="fb-summary-container">
				<p className="tx-16">
					Last 100 Student Feedback Average:{' '}
					<span className="tx-primary tx-20 tx-bold">
						{isLoading ? <Skeleton width={15} /> : overview?.Avarage ?? ''}
					</span>
				</p>
				<div className="fb-summary">
					<div className="fb-type">
						<div className="fb-radio">
							<label>
								<input
									type="radio"
									name="fbType"
									group="feedback"
									value=""
									defaultChecked
									onChange={_onChangeFilter}
								/>
								<span>
									All feedbacks{' '}
									<span className="number">{overview.AllEvaluation}</span>
								</span>
							</label>
						</div>
					</div>
					<div className="fb-type">
						<div className="fb-radio">
							<label>
								<input
									type="radio"
									name="fbType"
									group="feedback"
									value="5"
									onChange={_onChangeFilter}
								/>
								<span>
									<i className="fa fa-star tx-warning"></i>
									<i className="fa fa-star tx-warning"></i>
									<i className="fa fa-star tx-warning"></i>
									<i className="fa fa-star tx-warning"></i>
									<i className="fa fa-star tx-warning"></i> Excellent{' '}
									<span className="number">
										{isLoading ? (
											<Skeleton width={15} />
										) : (
											overview?.EvaluationRate5 ?? ''
										)}
									</span>
								</span>
							</label>
						</div>
					</div>
					<div className="fb-type">
						<div className="fb-radio">
							<label>
								<input
									type="radio"
									name="fbType"
									group="feedback"
									value="4"
									onChange={_onChangeFilter}
								/>
								<span>
									<i className="fa fa-star tx-warning"></i>
									<i className="fa fa-star tx-warning"></i>
									<i className="fa fa-star tx-warning"></i>
									<i className="fa fa-star tx-warning"></i> Good
									<span className="number">
										{isLoading ? (
											<Skeleton width={15} />
										) : (
											overview?.EvaluationRate4 ?? ''
										)}
									</span>
								</span>
							</label>
						</div>
					</div>
					<div className="fb-type">
						<div className="fb-radio">
							<label>
								<input
									type="radio"
									name="fbType"
									group="feedback"
									value="3"
									onChange={_onChangeFilter}
								/>
								<span>
									<i className="fa fa-star tx-warning"></i>
									<i className="fa fa-star tx-warning"></i>
									<i className="fa fa-star tx-warning"></i> Average
									<span className="number">
										{isLoading ? (
											<Skeleton width={15} />
										) : (
											overview?.EvaluationRate3 ?? ''
										)}
									</span>
								</span>
							</label>
						</div>
					</div>
					<div className="fb-type">
						<div className="fb-radio">
							<label>
								<input
									type="radio"
									name="fbType"
									group="feedback"
									value="2"
									onChange={_onChangeFilter}
								/>
								<span>
									<i className="fa fa-star tx-warning"></i>
									<i className="fa fa-star tx-warning"></i> Bad
									<span className="number">
										{isLoading ? (
											<Skeleton width={15} />
										) : (
											overview?.EvaluationRate2 ?? ''
										)}
									</span>
								</span>
							</label>
						</div>
					</div>
					<div className="fb-type">
						<div className="fb-radio">
							<label>
								<input
									type="radio"
									name="fbType"
									group="feedback"
									value="1"
									onChange={_onChangeFilter}
								/>
								<span>
									<i className="fa fa-star tx-warning"></i> Very bad
									<span className="number">
										{isLoading ? (
											<Skeleton width={15} />
										) : (
											overview?.EvaluationRate1 ?? ''
										)}
									</span>
								</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const TeacherFeedback = () => {
	const [filterValue, setFilterValue] = React.useState('');
	const [feedbacks, setFeedbacks] = React.useState(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const [pageNumber, setPageNumber] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(null);
	const [totalResult, setTotalResult] = React.useState(null);
	const handleUpdateComment = (feedbackId, commentId, commentContent) => {
		dispatch({
			type: 'UPDATE_COMMENT',
			payload: { feedbackId, commentId, commentContent },
		});
	};

	const fetchFeedback = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await getFeedback({
				Rate: filterValue !== '' ? parseInt(filterValue) : 0,
				Page: page,
			});
			if (res.Code === 1) {
				res.Data.length > 0
					? setFeedbacks(
							res.Data.map(fb => {
								return {
									...fb,
									id: fb.StudentUID,
									stName: fb.StudentName,
									stAvatar: fb.StudentIMG,
									stFeedback: fb.Evaluation,
									lessonTime: fb?.ScheduleDate ?? '',
									lessonName: fb.Lession,
									rating: fb.Rate,
									FeedbackLink: fb.FeedbackLink,
								};
							}),
					  )
					: setFeedbacks([]);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			}
		} catch (error) {
			setFeedbacks([]);
			console.log(error.message);
		}
		setIsLoading(false);
	};

	React.useEffect(() => {
		console.log(feedbacks);
	}, [feedbacks]);

	React.useEffect(() => {
		fetchFeedback();
	}, [filterValue]);

	React.useEffect(() => {
		fetchFeedback(pageNumber);
	}, [pageNumber]);

	return (
		<>
			{/* <div className="d-xl-flex align-items-center justify-content-between mg-b-30">
                <h3 className="text-dark font-weight-bold mg-b-0">Student Feedback</h3>
            </div> */}
			<div className="feedback-container">
				<RenderSummary handFilterValue={setFilterValue} />
				<div className="fb-list">
					{isLoading ? (
						<SkeletonFeedback />
					) : (
						<>
							{!!feedbacks && feedbacks.length > 0 ? (
								[...feedbacks].map((fb, index) => (
									<FeedbackRow
										key={`${index + randomId()}`}
										data={{
											id: fb.id,
											stName: fb?.stName ?? '',
											stAvatar:
												fb?.stAvatar ?? '../assets/img/default-avatar.png',
											stFeedback: fb?.stFeedback ?? '',
											lessonTime: fb?.lessonTime ?? '',
											lessonName: fb?.lessonName ?? '',
											rating: fb.rating,
											FeedbackLink: fb.FeedbackLink,
										}}
									/>
								))
							) : (
								<div className="card card-custom">
									<div className="card-body tx-center">
										<img
											src="../assets/img/empty.svg"
											alt="empty"
											className="wd-250 mg-x-auto mg-b-30-f mg-t-30"
										/>
										<div className="tx-center tx-danger tx-16">
											No rating {filterValue}{' '}
											<i className="fa fa-star tx-warning"></i> from students
										</div>
									</div>
								</div>
							)}
							{totalResult > pageSize && (
								<Pagination
									innerClass="pagination justify-content-end"
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
		</>
	);
};

const domContainer = document.getElementById('react-teacher-feedback');
ReactDOM.render(<TeacherFeedback />, domContainer);
