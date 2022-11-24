import React from 'react';
import ReactDOM from 'react-dom';
import { getFormattedDate } from "~src/utils"

const NotificationItem = ({
    NotificationID,
    NotificationTitle,
    NotificationIMG,
    CreatedBy,
    CreatedDate,
    NotificationContent,
    URL
}) => {
    return (
        <div className="card card-event">
            <img src={NotificationIMG} className="card-img-top" alt="" />
            <div className="card-body tx-13">
                <h5><a href={URL} className="tx-16">{NotificationTitle}</a></h5>
                <p className="meta mg-t-5">
                    <span className="author main-color bg-transparent">{CreatedBy}</span>
                    <span className="tx-12 tx-color-03">{getFormattedDate(CreatedDate)}</span>
                </p>
                <p className="mg-b-0 mg-t-10 tx-thumbnail"
                    dangerouslySetInnerHTML={{ __html: NotificationContent }}></p>
            </div>
        </div>
    )
}

export default NotificationItem;