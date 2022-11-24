import React, { useState, useEffect, useReducer } from 'react'
import ReactDOM from 'react-dom'
import { toast } from 'react-toastify'
import 'react-toastify/scss/main.scss'
import { toastInit } from "~src/utils"
import { BOOKING_SUCCESS } from '~components/common/Constant/toast'
import Flatpickr from 'react-flatpickr'
import { GetScheduleTeacherAPI } from "~src/api/studentAPI"

const initialState = {
  date: moment(new Date()).format('DD/MM/YYYY'),
  startTime: `${new Date().getHours() + 1}:00`,
  endTime: "23:00",
}

const BookingScheduleMobile = ({ TeacherUID, onBookingId, handleBookLesson }) => {
  const [state, setState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [schedule, setSchedule] = useState([])
  const [learnTime, setLearnTime] = useState([])

  const bookingToastSuccess = () => toast.success(BOOKING_SUCCESS, toastInit);
  const TimeAlertToast = () => toast.warn("Hãy chọn múi giờ từ 6:00 đến 23:00", toastInit);
  const TimeAlert2Toast = () => toast.warn("Bạn không thể chọn múi giờ trong quá khứ", toastInit);

  const onHandleBooking = (StudyTimeID, LessionName, date, start, end) => {
    handleBookLesson(StudyTimeID, LessionName, date, start, end)
  }

  const handleChangeDate = (dateStr) => {
    if (moment(new Date()).format('DD/MM/YYYY') == dateStr) {
      setState({
        ...state,
        date: dateStr,
        startTime: `${new Date().getHours() + 1}:00`,
      })
    }
    else {
      setState({
        ...state,
        date: dateStr,
      })
    }
  }

  const handleChangeTime = (dateStr, key) => {
    let condition1 = state.date == moment(new Date()).format("DD/MM/YYYY") &&
      new Date().getHours() >= parseInt(dateStr.split(":")[0])

    let condition2 = key == "startTime" ?
      parseInt(dateStr.split(":")[0]) > parseInt(state.endTime.split(":")[0]) :
      parseInt(dateStr.split(":")[0]) < parseInt(state.startTime.split(":")[0])

    let condition3 = key == "startTime" ?
      parseInt(dateStr.split(":")[0]) < 6 :
      parseInt(dateStr.split(":")[0]) > 23;

    if (condition1 || condition2 || condition3) {
      setState({
        ...state,
        [key]: state[key] == " " ? "" : " ",
      })
      if (condition1) TimeAlert2Toast();
      else TimeAlertToast();
    }
    else {
      setState({
        ...state,
        [key]: dateStr,
      })
    }
  }

  const onSearch = (e) => {
    e.preventDefault()

    let x = [];
    let start = state.startTime;
    let end = state.endTime;

    if (start == "" || start == " ") {
      start = state.date == moment(new Date()).format("DD/MM/YYYY") ?
        `${new Date().getHours() + 1}:00` : "06:00";
    }
    end = end == "" || end == " " ? "23:00" : end;

    let min = Math.min(
      parseInt(start.split(":")[0]),
      parseInt(end.split(":")[0])
    )
    let max = Math.max(
      parseInt(start.split(":")[0]),
      parseInt(end.split(":")[0])
    )

    for (let i = min; i <= max; i++) {
      x.push(`${i < 10 ? '0' + i : i}:00`)
      if (i !== max)
        x.push(`${i < 10 ? '0' + i : i}:30`)
    }
    console.log(x);
    setLearnTime(x);
    getAPI({
      TeacherUID,
      Date: state.date,
      Start: start,
      End: end,
    }, null);
  }

  const getAPI = async (params, callback) => {
    setLoading(true);
    const res = await GetScheduleTeacherAPI(params);
    if (res.Code === 1) {
      setSchedule(res.Data);
    }
    !!callback && callback();
    setLoading(false);
  }

  useEffect(() => {
    if (onBookingId !== null)
      getAPI({
        TeacherUID,
        Date: state.date,
        Start: state.startTime,
        End: state.endTime,
      }, !!onBookingId ? bookingToastSuccess : null);
  }, [onBookingId]);

  return <>
    <div className="book__calendar">
      <div className={`${loading ? '' : 'd-none'} overlay`}>
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </div>
      <div id="js-book-calendar-mobile" className="fc fc-unthemed fc-ltr" height="500">
        <span className="tx-danger mg-b-15">Lịch học từ 06:00 đến 23:00</span>
        <div className="metronic-form">
          <div className="form-row">
            <div className="col-12 form-group">
              <Flatpickr
                value={state.date}
                placeholder="dd/mm/YYYY"
                options={{
                  dateFormat: "d/m/Y",
                  minDate: moment(new Date()).format('DD/MM/YYYY'),
                  static: true,
                }}
                className="form-control"
                onChange={(selectedDates, dateStr, instance) => handleChangeDate(dateStr)} />
            </div>
            <div className="col-12 form-group">
              <Flatpickr
                placeholder="Start time"
                value={state.startTime}
                options={{
                  dateFormat: "H:i",
                  enableTime: true,
                  noCalendar: true,
                  time_24hr: true,
                  minTime: state.date == moment(new Date()).format("DD/MM/YYYY") ?
                    `${new Date().getHours() + 1}:00` : "06:00",
                  maxTime: state.endTime,
                  static: true,
                }}
                className="form-control"
                onChange={(selectedDates, dateStr, instance) => handleChangeTime(dateStr, "startTime")} />
            </div>
            <div className="col-12 form-group">
              <Flatpickr
                placeholder="End time"
                value={state.endTime}
                options={{
                  dateFormat: "H:i",
                  enableTime: true,
                  noCalendar: true,
                  time_24hr: true,
                  minTime: state.startTime,
                  maxTime: "23:00",
                  static: true,
                }}
                className="form-control"
                onChange={(selectedDates, dateStr, instance) => handleChangeTime(dateStr, "endTime")} />
            </div>
          </div>
          <div className="form-row">
            <div className="col-12 form-group">
              <a href={"#"} className="submit-search btn btn-primary btn-block"
                onClick={onSearch}>
                <i className="fa fa-search mg-r-5"></i>Search</a>
            </div>
          </div>
        </div>
      </div>
      <div className="tutor-schedule d-block tutor-schedule-mobile custom-student">
        <ul className="ul-schedule">
          {
            !!schedule && schedule.length > 0 && learnTime.map((item, index) => {
              let bookedFilter = schedule.filter(item => item.bookStatus)
              let availableFilter = schedule.filter(item => !item.bookStatus && item.available)
              let status = "";
              let StudyTimeID = "";
              let BookingID = "";
              let LessionName = "";
              let start = "";
              let end = "";
              bookedFilter.map(x => {
                if (new Date(x.Start).getHours() === parseInt(item.split(":")[0]) &&
                  new Date(x.Start).getMinutes() === parseInt(item.split(":")[1]))
                  status = "registed"
              })
              availableFilter.map(x => {
                if (new Date(x.Start).getHours() === parseInt(item.split(":")[0]) &&
                  new Date(x.Start).getMinutes() === parseInt(item.split(":")[1])) {
                  start = new Date(x.Start)
                  end = new Date(x.End)
                  StudyTimeID = x.StudyTimeID;
                  BookingID = x.BookingID;
                  LessionName = x.title;
                  status = "available"
                }
              })
              return <li className={status} key={index}>
                <span className="time">{item}</span>
                <span className="status pd-r-5 float-right">
                  {
                    status == "available" ? <button
                      className="open-lessionwish"
                      data-toggle="modal"
                      data-target="#md-book-schedule"
                      onClick={() => onHandleBooking(
                        StudyTimeID,
                        LessionName,
                        moment(start).format('DD/MM/YYYY'),
                        moment(start).format('HH:mm A'),
                        moment(end).format('HH:mm A'))} >Đang mở</button> : (status == "registed" ? "Đã đăng ký" : "")
                  }
                </span>
              </li>
            })
          }
        </ul>
      </div>
    </div>
  </>
}
export default BookingScheduleMobile;