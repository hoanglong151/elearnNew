import React, { useState, useEffect } from 'react';
import { getUpcomingClass, cancelSchedule, addScheduleLog } from '~src/api/teacherAPI';
import SkeletonLessonCard from '~components/common/Skeleton/SkeletonLessonCard';
import Skeleton from 'react-loading-skeleton';
import { convertDateFromTo as cvDate, checkCancelTime } from '~src/utils';
import CancelBookingTeacher from '~components/CancelBookingTeacher';
import LessonCard from '~components/LessonCard';
import StudentInformationModal from '~components/StudentInformationModal';

const initialState = [
    {
        "BookingID": 3,
        "TeacherUID": 1,
        "TeacherName": "Trương Công Thức",
        "StudentUID": 3,
        "StudentName": "Trương Văn Lam",
        "ScheduleTimeVN": "29/07/2020 14:00 - 14:25",
        "ScheduleTimeUTC": "29/07/2020 10:00 - 14:25",
        "DocumentName": "SOLUTION 6 - Grade 6",
        "LessionName": "Lession 3",
        "LessionMaterial": "https://drive.google.com/file/d/1_84xFBVfdeITWS9IakzeGedPnO4xafM3/view",
        "SkypeID": "live:123123",
        "SpecialRequest": " want the tutor to proactively correct my mistakes",
        "Status": 1,
        "StatusString": "Booked",
        "FinishType": 0,
        "FinishTypeString": "As shedule"
    },
    {
        "BookingID": 4,
        "TeacherUID": 1,
        "TeacherName": "Trương Công Thức",
        "StudentUID": 4,
        "StudentName": "Trương Văn Lam",
        "ScheduleTimeVN": "26/06/2020 14:00 - 14:25",
        "ScheduleTimeUTC": "26/06/2020 12:00 - 14:25",
        "DocumentName": "SOLUTION 6 - Grade 6",
        "LessionName": "Lession 4",
        "LessionMaterial": "https://drive.google.com/file/d/1_84xFBVfdeITWS9IakzeGedPnO4xafM3/view",
        "SkypeID": "live:123123",
        "SpecialRequest": " want the tutor to proactively correct my mistakes",
        "Status": 2,
        "StatusString": "Finished",
        "FinishType": 0
    }
]


let totalResult = 0;
let pageSize = 0;

const UpComingList = ({itemShow}) => {
    const [state, setState] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancelData, setCancelData] = useState(null);
    const [showCancel, setShowcancel] = useState(false);
    const [studentId, setStudentId] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const mdStudentInfo = React.useRef(true);

    const showStudentModal = (studentId) => {
        setStudentId(studentId);
        $(mdStudentInfo.current).modal('show');
    }
    const fetchData = async () => {
        setIsLoading(true);
        const res = await getUpcomingClass({ Page: pageNumber });
        if (res.Code === 1 && res.Data) {
            setState(res.Data);
            totalResult = res.TotalResult;
            pageSize = res.PageSize;
        } else {
            setState([]);
        }
        setIsLoading(false);
    }

    const handleEnterClass = async (lesson) => {
        
        try {
            const res = addScheduleLog({BookingID:lesson.BookingID});
        } catch (error) {
            console.log(error?.message ?? `Can't add schedule log !!`)
        }
        window.location.href = `skype:${lesson.SkypeID}?chat`;
    }


    const $mdCancel = $('#md-cancel-schedule');
    const handleCancelLesson = (lessonData) => {
        setCancelData({
            ...lessonData,
            lessonId: lessonData.BookingID,
            lessonName:lessonData.LessionName,
            lessonDate:cvDate(lessonData.ScheduleTimeVN).date,
            lessonStart:cvDate(lessonData.ScheduleTimeVN).fromTime,
            lessonEnd:cvDate(lessonData.ScheduleTimeVN).endTime
        });
        $mdCancel.modal('show');
    }

    const refreshListUpcoming = (bookingId) => {
        const newUpcomings = [...state].filter(item => item.BookingID !== bookingId);
        setState(newUpcomings);
        console.log(bookingId);
    }

    useEffect(() => {
        feather.replace();
    }, [state]);


    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <div className="course-horizental">
                <div className="list-wrap ">
                    <div className="table-responsive">
                        <table className="table table-custom table-borderless responsive-table">
                            <thead>
                                <tr className="tx-gray-600 tx-normal">
                                    <th>Time</th>
                                    <th>Lesson</th>
                                    <th className="tx-center"></th>
                                    <th>Student</th>
                                    <th>Note</th>
                                    <th className="tx-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td className="wd-50"><Skeleton circle={true} width={48} height={48} /></td>
                                        <td>
                                            <Skeleton count={1} />
                                            <Skeleton count={1} />
                                        </td>
                                        <td>
                                            <Skeleton count={1} />
                                            <Skeleton count={1} />
                                        </td>
                                        <td>
                                            <Skeleton count={1} />
                                            <Skeleton count={1} />
                                        </td>
                                        <td>
                                            <Skeleton count={1} />
                                            <Skeleton count={1} />
                                        </td>
                                    </tr>
                                ) : !!state && state.length > 0 ? (
                                    [...state].map((ls, index) => index < itemShow.value  && (
                                        <tr key={`${index}`}>
                                             <td>
                                                <div className="mg-b-0">
                                                    <span className=" mg-r-5"><i className="fa fa-clock tx-primary"></i> VN time:</span>
                                                    <span className="tx-gray-500">{ls.ScheduleTimeVN}</span>
                                                </div>
                                                <div className="mg-b-0">
                                                    <span className=" mg-r-5"><i className="fa fa-clock tx-primary"></i> Your time:</span>
                                                    <span className="tx-gray-500">{ls.ScheduleTimeUTC}</span>
                                                </div>

                                            </td>
                                            <td>
                                                <div className="mg-b-0">
                                                    <span className=" mg-r-5">Course:</span>
                                                    <span className="tx-gray-500">{ls.DocumentName}</span>
                                                </div>
                                                <div className="mg-b-0">
                                                    <span className=" mg-r-5">Lesson:</span>
                                                    <span className="tx-gray-500"><a href={ls.LessionMaterial} target="_blank">{ls.LessionName}</a></span>
                                                </div>
                                                {
                                                !!ls.FileAudio && <div className="mg-b-0">
                                                    <span className=" mg-r-5">Audio File:</span>
                                                    <span className="tx-gray-500"> <a href={ls.FileAudio} target="_blank">Download</a></span>
                                                </div>
                                                }
                                                 {
                                                !!ls.FileAudio1 && <div className="mg-b-0">
                                                    <span className=" mg-r-5">Audio File 1:</span>
                                                    <span className="tx-gray-500"> <a href={ls.FileAudio1} target="_blank">Download</a></span>
                                                </div>
                                                }
                                                 {
                                                !!ls.FileAudio2 && <div className="mg-b-0">
                                                    <span className=" mg-r-5">Audio File 2:</span>
                                                    <span className="tx-gray-500"> <a href={ls.FileAudio2} target="_blank">Download</a></span>
                                                </div>
                                                }
                                            </td>
                                            <td className="valign-middle tx-center">
                                                <span className="avatar avatar-md d-inline-block ">
                                                    <img src={ls.StudentIMG} alt="avatar" className="rounded-circle" />
                                                </span>
                                            </td>
                                            <td className="lg-valign-middle">
                                                <a
                                                    href={`#`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        showStudentModal(ls.StudentUID)
                                                    }} className="mg-b-0 d-inline-block tx-black"
                                                >
                                                    {ls.StudentName}
                                                </a>
                                            </td>
                                            <td className="tx-center">
				{ls.SpecialRequest && ls.SpecialRequest !== '' && (
					ls.SpecialRequest
				)}
			</td>
                                            <td className="tx-nowrap tx-right">
                                                <a onClick={(e) => {e.preventDefault(); handleEnterClass(ls)}} href={`skype:${ls.SkypeID}?chat`} className="btn btn-info btn-sm mg-r-10 " target="_blank" rel="noopener"><i className="fab fa-skype"></i> <span className="d-none d-xl-inline mg-l-5">Join class</span></a>
                                                {
                                                    checkCancelTime(cvDate(ls.ScheduleTimeUTC).dateObject) ? (<a href={`#`} onClick={(e) => {
                                                        e.preventDefault();
                                                        handleCancelLesson(ls);
                                                    }} className="btn btn-danger btn-sm"><i data-feather="x"></i> <span className="d-none d-xl-inline mg-l-5">Cancel</span></a>) : (
                                                        <button disabled className="btn btn-disabled btn-sm" data-toggle="tooltip" title="You can only cancel this lesson before start for 30 minutes !!" data-placement="top"><i data-feather="x"></i> <span className="d-none d-xl-inline mg-l-5">Cancel</span></button>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    ))

                                ) : (
                                            <tr>
                                                <td colSpan={5}>
                                                    <div className="empty-error tx-center mg-y-30 bg-white mg-x-auto">
                                                        <img src="../assets/img/no-booking.svg" alt="image" className="wd-200 mg-b-15" />
                                                        <p className=" tx-danger tx-medium">You don't have any booked lessons with students</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                }

                            </tbody>
                        </table>
                    </div>
                    {totalResult > pageSize && itemShow > 10 && (
                        <Pagination
                            innerClass="pagination"
                            activePage={pageNumber}
                            itemsCountPerPage={pageSize}
                            totalItemsCount={totalResult}
                            pageRangeDisplayed={5}
                            onChange={(page) => setPageNumber(page)}
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="active"
                        />
                    )}
                </div>
            </div>

            <CancelBookingTeacher
                BookingID={cancelData?.lessonId ?? ''}
                name="Warning !!"
                LessionName={cancelData?.lessonName ?? ''}
                start={cancelData?.lessonStart ?? ''}
                end={cancelData?.lessonEnd ?? ''}
                date={cancelData?.lessonDate ?? ''}
                callback={refreshListUpcoming}
            />

            <StudentInformationModal
                ref={mdStudentInfo}
                studentId={studentId}
            />
        </>
    )
}


export default UpComingList;
