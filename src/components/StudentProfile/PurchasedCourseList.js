import React, { useState, useEffect, useReducer } from 'react'
import ReactDOM from 'react-dom'
import PurchasedCourseCard from "./PurchasedCourseCard"
import SkeletonLessonCard from "~components/common/Skeleton/SkeletonLessonCard"
import { randomId } from "~src/utils.js"
import Pagination from "react-js-pagination"

const initialState = [{
  CoursesID:randomId(),
  TeacherName: "Hoàng Thị Quyên",
  avatar: "interface-2.jpg",
  CoursesName: "IELST - Professional",
  total: 20,
  completed: 30,
  incoming: 20,
  canceled: 15,
  status: "ongoing",
  start: "20/04/2020",
  end: "20/12/2020",
  CourseMaterial: "ITLEST 8.0 EASY",
}, {
  CoursesID:randomId(),
  TeacherName: "Hoàng Văn Thái",
  avatar: "interface-2.jpg",
  CoursesName: "IELST - Professional",
  total: 20,
  completed: 30,
  incoming: 20,
  canceled: 15,
  status: "finished",
  start: "20/04/2020",
  end: "20/12/2020",
  CourseMaterial: "ITLEST 8.0 EASY",
}]
const PurchasedCourseList = () => {
  const [page, setPage] = useState(1)
  const [state, setState] = useState(initialState);

  const [loading, setLoading] = useState(false);

  const handlePageChange = (pageNumber) =>  {
    setPage(pageNumber);
  }

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  
  return <>
     <div className="subcription-title lh-base">
        <h5>Purchased course</h5>
        <ul className="mg-0">
          <li>You can make a schedule for the duration of the course</li>
          <li>You are only allowed to cancel the class schedule 30 minutes in advance</li>
          <li>After the course expires, you will not be allowed to schedule more classes</li>
        </ul>
        <a href="#" className="mg-t-15 d-block tx-primary"><i className="fa fa-info-circle mg-r-5" /> For more information, see our FAQ</a>
      </div>
      <div className="fb-summary-container">
        <div className="fb-summary pd-t-0-f bd-t-0-f">
          <div className="fb-type">
            <div className="fb-radio">
              <label>
                <input type="radio" name="fbType" group="feedback" defaultChecked />
                <span>All Course <span className="number">32</span></span>
              </label>
            </div>
          </div>
          <div className="fb-type">
            <div className="fb-radio">
              <label>
                <input type="radio" name="fbType" group="feedback" />
                <span>On Going <span className="number">22</span></span>
              </label>
            </div>
          </div>
          <div className="fb-type">
            <div className="fb-radio">
              <label>
                <input type="radio" name="fbType" group="feedback" />
                <span>Finished <span className="number">10</span></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="course-horizental mg-t-20">
        <ul className="list-wrap">
          {
            !!state && Array.isArray(state) && state.length > 0 && state.map(item =>
              loading ? <SkeletonLessonCard key={item.id}/> :
              <PurchasedCourseCard
                key={item.id}
                CoursesID={item.CoursesID}
                avatar={item.avatar}
                CoursesName={item.CoursesName}
                total={item.total}
                completed={item.completed}
                incoming={item.incoming}
                canceled={item.canceled}
                status={item.status}
                start={item.start}
                end={item.end}
                CourseMaterial={item.CourseMaterial} />)
          }
        </ul>
      </div>
      <Pagination
          innerClass="pagination justify-content-end"
          activePage={page}
          itemsCountPerPage={10}
          totalItemsCount={450}
          pageRangeDisplayed={3}
          itemClass="page-item"
          linkClass="page-link"
          onChange={handlePageChange.bind(this)} />
    </>
}
export default PurchasedCourseList;