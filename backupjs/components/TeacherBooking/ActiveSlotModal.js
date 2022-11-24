import React, {useRef} from 'react';

const ActiveSlotModal = ({data, handleOpenSlot}) => {
    const { date, start, end } = data;
    const _onSubmit = e => {
        e.preventDefault();
        handleOpenSlot(data);
    }
  
    return (
        <div className="modal fade effect-scale" data-backdrop="static" data-keyboard="false" id="md-active-slot" tabIndex={-1} role="dialog" aria-labelledby="active-slot" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
                <div className="modal-content">
                    <div className="modal-header bg-warning">
                        <h5 className="modal-title" id="newCampaignTitle">Set available for this !!</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Date: <span className="tx-medium" id="js-date-time">{date}</span></p>
                        <div className="row">
                            <div className="col">
                                <p>Start: <span className="tx-medium" id="js-start-time">{start}</span></p>
                            </div>
                            <div className="col">
                                <p>End: <span className="tx-medium" id="js-end-time">{end}</span></p>
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer bd-t-0 pd-t-0">
                        <button type="button" className="btn btn-light btn-sm" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-flat btn-sm tx-primary" onClick={_onSubmit}>Open it</button>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default ActiveSlotModal;
