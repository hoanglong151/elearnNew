import React, { useState, useEffect } from 'react';
import SkeletonTable from '~components/common/Skeleton/SkeletonTable';
import { getMissingFeedback } from '~src/api/teacherAPI';
import Pagination from "react-js-pagination";

const MissingFeedbackRow = ({ data }) => {
    const { BookingID, ScheduleTimeVN, ScheduleTimeUTC, DocumentName, LessionName, EvaluationStatus } = data;
    return (
        <tr>
            <td className="clr-time">
                <div className="mg-b-5">
                    <span className=" mg-r-5"><i className="fa fa-clock tx-primary"></i> VN time:</span>
                    <span className="tx-gray-500">{ScheduleTimeVN}</span>
                </div>
                <div className="mg-b-5">
                    <span className=" mg-r-5"><i className="fa fa-clock tx-primary"></i> Your time:</span>
                    <span className="tx-gray-500">{ScheduleTimeUTC}</span>
                </div>
            </td>
            <td className="clr-lesson">
            <div className="mg-b-5">
                    <span className=" mg-r-5">Course:</span>
                    <span className="tx-gray-500">{DocumentName}</span>
                </div>
                <div className="mg-b-5">
                    <span className=" mg-r-5">Lesson:</span>
                    <span className="tx-gray-500">{LessionName}</span>
                </div>
            </td>
            <td className="clr-feedbackStatus">
                <div className="mg-b-5">
                    {
                        EvaluationStatus === 1 ? <span className="tx-danger">Not feedback</span>
                        : EvaluationStatus === 2 && <span className="tx-success">Feedbacked</span>
                    }
                </div>

            </td>
            <td className="clr-actions">
                <a target="_blank" rel="noopener" href={`/ElearnTeacher/EvaluationLesson?ID=${data.BookingID}`} className="btn btn-sm btn-warning rounded-5"><i className="fa fa-comment-alt clrm-icon" /> Feedback</a>
            </td>
        </tr>
    )
}



const MissingFeedbackTable = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(0);
    const [totalResult, setTotalResult] = useState(0);
    const loadMissingFeedback = async () => {
        try {
            const res = await getMissingFeedback({ Page: pageNumber });
            if (res?.Code && res.Code === 1) {
                setData(res.Data);
                setPageSize(res.PageSize);
                setTotalResult(res.TotalResult);
            } else {
                console.log('Code response khác 1');
            }
            setIsLoading(false);
           
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadMissingFeedback();
    }, [pageNumber])

    return (
        <>
            {
                isLoading ? <SkeletonTable /> : (
                    <>
                        <div className="table-responsive mg-b-15">
                            <table className="table table-classrooms table-borderless responsive-table table-hover">
                                <thead className="thead-primary">
                                    <tr className="">
                                        <th className="clr-time">Schedule</th>
                                        <th className="clr-lesson">Lesson</th>
                                        <th className="clr-feedbackStatus">Student feedback </th>
                                        <th className="clr-actions">Actions</th>
                                    </tr>
                                </thead>
                                {/*1 item*/}
                                <tbody>
                                    {!!data && !!data.length > 0 ? data.map(item => <MissingFeedbackRow key={`${item.BookingID}`} data={item} />) : (<tr><td colSpan={4}><span className="tx-danger d-block tx-center tx-medium tx-16">No data found.</span></td></tr>)}
                                </tbody>
                            </table>
                        </div>

                        {totalResult > pageSize && (
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
                    </>
                )
            }
        </>
    )
}

export default MissingFeedbackTable;