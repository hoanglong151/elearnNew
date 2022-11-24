import React from 'react';
import ReactDOM from 'react-dom';
import Skeleton from 'react-loading-skeleton';

const SkeletonComment = () => {
    return (
        <div className="tc-comment">
            <Skeleton circle={true} width={38} height={38} />
            <div className="tc-content">
                <div className="box">
                    <p className="teacher-name">{<Skeleton />}</p>
                    <p className="mg-b-0">{<Skeleton count={4} />}</p>
                </div>
                <div className="meta">
                    <div className="date">{<Skeleton />}</div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonComment;