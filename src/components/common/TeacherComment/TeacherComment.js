import React from 'react';
import ReactDOM from 'react-dom';

import {
    CSSTransition,
} from 'react-transition-group';
import styles from './TeacherComment.module.scss'


const TeacherComment = ({ data: { id, teacherName, teacherAvatar, dateTime, commentContent, editted }, handleUpdateComment, editable=true }) => {
    const [content, setContent] = React.useState(commentContent);
    const [editContent, setEditContent] = React.useState(content);
    const [editComment, setEditComment] = React.useState(false);

    const _showEditBox = () => {
        setEditContent(content);
        setEditComment(true);
    }

    const _hideEditBox = () => {
        setEditContent(content);
        setEditComment(false);

    }

    const _saveEditComment = () => {
        setContent(editContent);
        handleUpdateComment(id, editContent);
        setEditComment(false);
    }

    const _onChange = (event) => {
        event.preventDefault();
        setEditContent(event.target.value);
    }


    return (
        <>
            <div className="tc-comment">
                <img src={teacherAvatar} alt="avatar " className="avatar avatar rounded-circle object-fit" />
                {!editComment && (
                    <div className="tc-content">
                        <div className={`box ${editable ? `pd-r-35-f` : 'pd-r-0-f'}`}>
                            <p className="teacher-name">{teacherName}</p>
                            <p className="mg-b-0">{content}</p>
                        </div>
                        <div className="meta">
                            <div className="date">{!!editted ? `Edited at ${moment(dateTime).format('hh:mm A')} | ${moment(dateTime).format('DD/MM/YYYY')}` : `Comment at ${moment(dateTime).format('hh:mm A')} | ${moment(dateTime).format('DD/MM/YYYY')}`}</div>
                        </div>
                        <span type="button" className="edit-box" onClick={_showEditBox}><i className="fa fa-edit" /></span>
                    </div>

                )}
                <CSSTransition
                    timeout={300}
                    in={editComment}
                    classNames="edit"
                    onEnter={() => setEditComment(true)}
                    onExited={() => setEditComment(false)}
                >   
                    <>
                    {editComment && (<div className="edit-form flex-grow-1 mg-l-10 rounded-10 bd-1 bd-primary">
                        <textarea className="form-control" rows="5" onChange={_onChange} value={editContent} />
                        <div className="mg-t-10">
                            <button type="button" className="btn btn-primary mg-r-10 btn-sm" onClick={_saveEditComment}><i className="fa fa-save mg-r-5"></i> Save</button>
                            <button type="button" className="btn btn-light btn-sm" onClick={_hideEditBox}><i className="fa fa-times mg-r-5"></i> Cancel</button>
                        </div>
                    </div>)}
                    </>
                </CSSTransition>
            </div>
        </>
    )
}

export default TeacherComment;