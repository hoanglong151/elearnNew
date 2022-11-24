import React, { useState, useEffect, useReducer, useRef } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import 'react-toastify/scss/main.scss';
import { appSettings } from '~src/config';
import Select from 'react-select'
import { randomId } from "~src/utils"
import { toastInit } from "~src/utils";
import { REQUEST_SUCCESS, FILL_ALL } from '~components/common/Constant/toast';
import {addSupportTicket} from '~src/api/teacherAPI';
import styles from "~components/TeacherSupportModal.module.scss"
import { Editor } from '@tinymce/tinymce-react';
import {uploadImageToServer} from '~src/api/optionAPI'

const categoryArr = [
	{
		label: 'About Student',
		value: 'About Student',
	},
	{
		label: 'About Teacher',
		value: 'About Teacher',
	},
	{
		label: 'About Syllabus',
		value: 'About Syllabus',
	},

	{
		label: 'About Compensation',
		value: 'About Compensation',
	},
	{
		label: 'Others',
		value: 'Others',
	},
];


const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'STATE_CHANGE': {
			return {
				...prevState,
				[payload.key]: payload.value,
			};
		}
		default:
			return prevState;
			break;
	}
};


const imageUploadHandle = async (blobInfo, success, failure, progress) => {
    const blob = await blobInfo.blob();
    try {
       const res = await uploadImageToServer([blob]);
       res.Code === 1 && res.Data.length > 0 && success(`${res.Data[0].UrlIMG}`);
       //success('https://vcdn-ngoisao.vnecdn.net/2020/07/08/MRAT6138-JPG-2263-1594179677_r_460x0.jpg');
    } catch (error) {
        console.log(error?.message ?? error);
    }
   
}

const editorOptions = {
    min_height: 300,
    id:randomId(),
    menubar: false,
    images_upload_handler: imageUploadHandle,
    images_reuse_filename: true,
    // toolbar: false,
    // menubar: false,
    inline: false,
    plugins: [
        'autolink lists link image ',
        'media table paste help wordcount',
        'lists',
        'autolink',
        'paste',
        'table',
    ],
    // quickbars_insert_toolbar: 'quicktable image table',
    // quickbars_selection_toolbar: 'bold italic underline | formatselect | blockquote quicklink',
    // contextmenu: 'undo redo | inserttable | cell row column deletetable | help',
    toolbar:
        'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist  | removeformat | media image link',
      placeholder: 'Your content...',

}



const initialState = {
    nguoigui: "",
    title: categoryArr[0],
    content: "",
    file: "",
}

const TeacherSupportModal = ({refreshList}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    //const [state, setState] = React.useState(initialState);
    const [editorContent, setEditorContent] = React.useState('');
    const submitAlert = () => toast.warn(FILL_ALL, toastInit);

  

    const handleChange = (e) => {
        const value = e.value;
        const key = "title";
        //const value = target.type === "file" ? target.files[0] : target.value;
        //const key = target.getAttribute("name");
        
        setState({
            ...state,
            [key]: value,
        })
    }

    const handleSubmit = async () => {
        if(state.title.length <= 0 || editorContent.length <= 0){ submitAlert(); return;}
        try {
            const res = await addSupportTicket({
                SupportTitle: state?.title?.value ?? '',
                SupportContent: tinymce.html.Entities.encodeAllRaw(editorContent) || ''
            })
            if(res.Code === 1){
                toast.success('New ticket was created.');
                $('#md-teacher-support').fadeOut(500, function () {
                    $('#md-teacher-support').modal('hide');
                });
                setEditorContent('');
                setState({...state, title:''});
                refreshList && refreshList();
            }
            res.Code !== 1 && toast.warning('Your paste text not correct format, please use clear format button in editor..');
        }catch (error) {
            console.log(error?.message ?? 'Submit ticket không thành công')
        }
    }

    const _handleEditorChange = (content, editor) => {
        setEditorContent(content);
    }

    React.useEffect(() => {
        let focusEvent = $(document).on('focusin', function(e) {
            if ($(e.target).closest(".tox").length) {
              e.stopImmediatePropagation();
            }
        });
        return () => {
            focusEvent.remove();
        }
    },[]);


    React.useEffect(() => {
        console.log(state);
    },[state]);

    return <div className="modal fade effect-scale" id="md-teacher-support" tabIndex="-1" role="dialog" aria-labelledby="active-slot"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-primary" role="document">
            <div className="modal-content">
                <div className="modal-header bg-primary">
                    <h5 className="modal-title tx-white"><i className="fas fa-send-o"></i> Create a new ticket</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span className="tx-white" aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="form-row align-items-center">
                        <div className="form-group col-sm-2 col-label-fixed">
                            <p className="mg-b-0 tx-medium">Title:</p>
                        </div>
                        <div className="form-group col-sm-10">
                        <Select
											name="title"
											options={categoryArr}
											value={state.title}
											getOptionLabel={option => option.label}
											getOptionValue={option => option.value}
											styles={appSettings.selectStyle}
											className="basic-multi-select"
											placeholder="Choose Category *"
											classNamePrefix="select"
											onChange={val => {
												dispatch({
													type: 'STATE_CHANGE',
													payload: { key: 'title', value: val },
												});
											}}
										/>
                            {/* <input type="text" className="form-control" name="title"
                                value={state.title}
                                onChange={handleChange} /> */}
                        </div>
                    </div>
                 
                    <div className="form-row ht-300">
                        <div className="form-group col-sm-2 col-label-fixed">
                            <p className="mg-b-0 tx-medium mg-t-10">Content:</p>
                        </div>
                        <div className="form-group col-sm-10">
                            <Editor
                                    init={editorOptions}
                                    onEditorChange={_handleEditorChange}
                                    value={editorContent}
                                    apiKey='e1mtlim1uia64sz4l2u880y2zrqjmk0lyk8h3f2wso0e4yi2'
                            />
                        </div>
                    </div>
                   
           
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-light" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>Send</button>
                </div>
            </div>
        </div>
    </div>
}

export default TeacherSupportModal;