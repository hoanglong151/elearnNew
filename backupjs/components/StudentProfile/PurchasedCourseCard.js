import React, { useState, useEffect, useReducer } from 'react'
import ReactDOM from 'react-dom'

const PurchasedCourseCard = ({
  CoursesID,
  avatar="default-avatar.png",
  CoursesName,
  total,
  completed,
  incoming,
  canceled,
  status,
  start,
  end,
  CourseMaterial,
}) => {
  return (
    <li className="cr-item lesson-info">
      <div className="media">
        <div className="teacher-information">
          <a className="teacher-avatar" href="#">
            <img src={`../assets/img/${avatar}`} className="teacher-image" alt="Avatar" />
          </a>
        </div>
        <div className="media-body  mg-l-20 pos-relative">
          <h5 className="mg-b-10 ">
            <span className={`badge badge-${status == "ongoing" ? "warning" : "success"}`}>
              {status == "ongoing" ? "On Going" : "Finished"}</span> {" "}
            <a href="/ElearnStudent/lessonDetail" className="course-name tx-semibold">{CoursesName}</a>
          </h5>
          <div className="course-information tx-14">
            <span className="mg-r-5 tx-gray-900 tx-medium">Expiry Date:</span>
            <span className="mg-r-15 tx-gray-600 tx-medium"><i className="fa fa-clock  tx-info mg-r-5" />Start: {start}</span>
            <span className="mg-r-15 tx-gray-600 tx-medium"><i className="fa fa-clock  tx-info mg-r-5" />End: {end}</span>
          </div>
          <div className="course-note mg-t-5 d-flex flex-wrap align-items-center">
            <h6 className="mg-r-5 mg-b-0">Course material:</h6>
            <p className="tx-14 mg-b-0 tx-gray-600 tx-medium">{CourseMaterial}</p>
          </div>
          <div className="set-result pd-10 bg-light mg-t-15 rounded-5">
            <div className="d-flex flex-wrap">
              <div className="lesson-sum wd-50p mg-b-5">
                <span className="icon"><i className="fa fa-book" />
                  Total Lessons:</span>
                <span className="score tx-bold">{total}</span>
              </div>
              <div className="lesson-sum wd-50p mg-b-5">
                <span className="icon"><i className="fa fa-book-open" />
                  Incoming Lessons:</span>
                <span className="score tx-bold">{incoming}</span>
              </div>
              <div className="lesson-sum wd-50p mg-b-5">
                <span className="icon"><i className="fas fa-book-open" />
                  Completed Lessons:</span>
                <span className="score tx-bold">{completed}</span>
              </div>
              <div className="lesson-sum wd-50p mg-b-5">
                <span className="icon"><i className="fas fa-sign-out-alt" />
                  Cancellation/Absences:</span>
                <span className="score tx-bold">{canceled}</span>
              </div>
            </div>
          </div>
          <div className="course-actions">
            <div className="action-left">
              {
                status == "ongoing" ?
                  <a href="/ElearnStudent/bookingLesson" className="btn btn-sm btn-primary mg-r-10" target="_blank" rel="noopener"><i className="fa fa-book mg-r-5" />
                Book lessons</a> :
                  <a href="/ElearnStudent/lessonDetail" className="btn btn-sm btn-warning mg-r-10" target="_blank" rel="noopener"><i className="fas fa-vote-yea mg-r-5" />
                 Overview lesson</a>
              }
            </div>
            <div className="action-right">
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default PurchasedCourseCard;