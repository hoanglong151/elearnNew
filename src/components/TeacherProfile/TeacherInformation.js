import React, { useState, useEffect, useReducer, useRef, useContext } from 'react'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import { useForm, Controller } from 'react-hook-form';
import { appSettings } from '~src/config';
import Select from 'react-select'
import { randomId } from '~src/utils';
import { getTeacherInfoProfile, updateTeacherInfoProfile } from '~src/api/teacherAPI';
import { toast } from 'react-toastify'
import { Context as ProfileContext } from '~src/context/ProfileContext';
import {
    uploadImageToServer,
    getEnglishProficiencyOptions,
    getLevelOfEducationOptions,
    getLocationOptions,
    getStateOptions,
    getTimeZone,
    getListLevelPurpose

} from '~src/api/optionAPI';


const optionsLevel = [
    { value: '1', label: 'Kids and Teens' },
    { value: '2', label: 'Elementary' },
    { value: '3', label: 'Intermediate' },
    { value: '4', label: 'Advance' },
    { value: '5', label: 'Speaking' },
    { value: '6', label: 'IELTS' }
  ]

const Schema = Yup.object().shape({
    fullName: Yup.string()
        .required('Full name is required'),
    skypeId: Yup.string()
        .required('Skype id is required'),
    phoneNumber: Yup.string()
              .required('Phone is required'),
    state: Yup.mixed()
    .required('State is required'),
    levelOfEducation: Yup.mixed()
        .nullable(false)
        .required("Level of education is required"),
    englishProficien: Yup.mixed()
        .nullable(false)
        .required("Level of education is required"),
        location: Yup.mixed()
        .nullable(false)
        .required("location is required"),
    levelOfPurpose: Yup.mixed()
        .nullable(false)
        .required("Level of purpose must be at least one option")
       
    
});

const optionState = {
    locationOptions: [],
    stateOptions: [],
    englishProficienOptions: [],
    levelOfPurposeOptions: [],
    levelOfEducationOptions: [],
    timeZoneOptions: [],
}

const initialState = {
    avatar: "https://theamericanschool.edu.vn/wp-content/uploads/2020/01/Ms-Hong-Nguyen-Vietnamese.jpg",
    fullName: "Truong Van Lam",
    skypeId: "mona.media",
    phoneNumber: "0886706289",
    location: null,
    levelOfPurpose: null,
    levelOfEducation: null,
    state: null,
    email: "vietdat106@gmail.com",
    timeZone: null,
    schoolName: "Bach Khoa University",
    major: '',
    englishProficien: null,
    loadOption: false,
}

const reducer = (prevState, { type, payload }) => {
    // console.log('Log payload', payload);
    switch (type) {
        case "UPDATE_STATE":
            return { ...prevState, [payload.key]: payload.value }
            break;
        default:
            return prevState;
            break;
    }
}

const ProfileAvatar = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [myAvatar, setAvatar] = useState();
    const inputFileRef = useRef(true);

    const handleUploadImage = async () => {
        setIsLoading(true);
        try {
            const input = inputFileRef.current;
            if (input.files && input.files[0]) {
                const res = await uploadImageToServer(input.files);
                if (res.Code === 1 && res.Data.length > 0) {
                    props.updateAvatar('avatar', res.Data[0].UrlIMG);
                }
            }

        } catch (error) {
            console.log(error?.message ?? 'L???i g???i api');
        }
        setIsLoading(false);
    }

    return (
        <>
            <div className={`teacher-avatar ${isLoading ? 'loading-style' : ''} mg-x-auto`}>
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                <div className="upload-container">
                    <label className="upload-avatar">
                        <input ref={inputFileRef} type="file" accept="image/*" className="upload-box hidden d-none upload-file" onChange={handleUploadImage} />
                        <img src={props?.getValues('avatar') ?? '../assets/img/default-avatar.png'} alt="avatar" className="image-holder" />
                    </label>
                </div>
            </div>
        </>
    )
}


function TeacherInformation() {
    const [state, dispatch] = useReducer(reducer, optionState);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [optionLoaded, setOptionLoaded] = useState(false);
    const { state: profileState, updateUserInfo } = useContext(ProfileContext);
    const { errors, register, handleSubmit: handleSubmitInformation, setValue, getValues, control, watch } = useForm({
        mode: 'onBlur',
        defaultValue: initialState,
        resolver: yupResolver(Schema),
    });

    const watchLocation = watch('location');

    const updateState = (key, value) => dispatch({ type: 'UPDATE_STATE', payload: { key, value } });

    const setMultipleValue = (dataObj) => {
        if (typeof dataObj !== 'object') return;
        for (let property in dataObj) {
            setValue(property, dataObj[property]);
        }
    }

    const loadTeacherInfo = async () => {
        setIsLoading(true);
        try {
            const res = await getTeacherInfoProfile();
            console.log('getTeacherInfoProfile res:', res.Data);
            if (res.Code === 1) {
                console.log('LevelPurpose res:', res.Data?.LevelPurpose.split(',') ?? '');
                const obj = {
                    avatar: res.Data?.TeacherIMG ?? '',
                    fullName: res.Data?.FullName ?? '',
                    skypeId: res.Data?.SkypeID ?? '',
                    phoneNumber: res.Data.Phone.toString() || '',
                    levelOfPurpose: JSON.parse(res.Data?.LevelPurpose ?? "[]").map(id => {
                        return [...state.levelOfPurposeOptions].find(level => level.ID === id);
                    }),
                    levelOfEducation: [...state.levelOfEducationOptions].find((option, index) => option.ID === res.Data?.LevelOfEducation) ?? null,
                    state: res.Data?.StateName ?? '',
                    email: res.Data?.Email ?? '',
                    timeZone: [...state.timeZoneOptions].find((option, index) => option.ID === res.Data?.TimezoneID) ?? null,
                    schoolName: res.Data?.SchoolName ?? '',
                    major: res.Data?.Major ?? '',
                    englishProficien: [...state.englishProficienOptions].find((option, index) => option.ID === res.Data?.EnglishProficiency) ?? null,
                    location: res.Data?.CountryName ?? ''
                }
                //console.log(obj.levelOfPurpose);
                console.log('getTeacherInfoProfile res:', obj.levelOfPurpose);
                updateUserInfo({ ...res.Data, Avatar: res.Data?.TeacherIMG ?? '' });
                setMultipleValue(obj);
            }
        } catch (e) {
            console.log(e);
        }
        setIsLoading(false);
    }

    const loadSelectOptionAPI = async () => {
        try {
            const [proficienRes, educationRes, purposeRes, timezoneRes, locationRes] = await Promise.all([
                getEnglishProficiencyOptions(),
                getLevelOfEducationOptions(),
                getListLevelPurpose(),
                getTimeZone(),
                getLocationOptions(),
            ]);
            updateState('englishProficienOptions', proficienRes.Data ?? []);
            updateState('levelOfEducationOptions', educationRes.Data ?? []);
            updateState('levelOfPurposeOptions', purposeRes.Data ?? []);
            updateState('timeZoneOptions', timezoneRes.Data ?? []);
            updateState('locationOptions', locationRes.Data ?? []);
            setOptionLoaded(true);
        } catch (err) {
            console.log(err?.message ?? 'Call Promise all failed, check params again...')
        }
    };

    const loadStateOptions = async (LocationID) => {
        try {
            const res = await getStateOptions({
                LocationID
            });
            if (res.Code === 1) {
                updateState('stateOptions', res.Data);
            }
        } catch (error) {
            console.log(err?.message ?? 'Call api getLocationOptions failed, check params again...')
        }
    }

    const _onSubmitInformation = async (data, e) => {
        e.preventDefault();
        setSubmitLoading(true);
        // console.log('Submiting');
        // console.log(data);
        console.log(data);
        try {
            const res = await updateTeacherInfoProfile({
                FullName: data?.fullName ?? '', // str
                SkypeID: data?.skypeId ?? '', // str
                Phone: data?.phoneNumber.toString() ?? '', // str
                TimeZoneID: parseInt(data.timeZone?.ID ?? 0), // int
                LevelPurpose: JSON.stringify(!!data.levelOfPurpose && !!data.levelOfPurpose.length > 0 ? data.levelOfPurpose.map(ce => ce.ID) : []), // str arr
                LevelOfEdacation: parseInt(data?.levelOfEducation.ID) ?? 0, // int
                SchoolName: data?.schoolName ?? '', // str
                Major: data?.major ?? '', // str
                Proficiency: data?.englishProficien?.ID ?? 0, // int
                EnglishProficiency: data?.englishProficien?.ID ?? 0, // int
                Avatar: data?.avatar ?? '', // str
                Location: data?.location ?? '',
                State: data?.state ?? '',
            });
            res.Code === 1 && toast.success('Information updated successfully !!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
            res.Code === 1 && updateUserInfo({
                ...profileState,
                FullName: data?.fullName ?? '',
                Phone: data?.phoneNumber.toString() ?? '',
                Avatar: data?.avatar ?? '', // str
            })
            res.Code !== 1 && toast.error('Update information failed !!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
        } catch (err) {
            console.log(err?.message ?? 'Call API updateTeacherInfoProfile failed, check params again...')
        }
        setSubmitLoading(false);
    }

    useEffect(() => {
        !!watchLocation && !!watchLocation.ID ? loadStateOptions(watchLocation.ID) : loadStateOptions(0);
        // console.log(watchLocation);
    }, [watchLocation]);
    useEffect(() => {
        optionLoaded === true && loadTeacherInfo();
    }, [optionLoaded])

    useEffect(() => {
        loadSelectOptionAPI();
    }, [])

    useEffect(() => {
        console.log(errors);
    }, [errors])

    return (
        <>
            <form onSubmit={handleSubmitInformation(_onSubmitInformation)}>
                <Controller
                    as={
                        <ProfileAvatar getValues={getValues} updateAvatar={setValue} />
                    }
                    control={control}
                    name="avatar"
                />
                {/* <ProfileAvatar ref={register} name="avatar" avatar={getValues('avatar')} updateAvatar={setValue} /> */}
                <div className="teacher-info mg-l-0-f mg-t-30">
                    <h5 className="mg-b-20"><i className="fas fa-user mg-r-5"></i>Basic Information</h5>
                    <div className="row group-float-label">
                        <div className="form-group col-12 col-sm-6">
                            <div className="input-float">
                                <input type="text" className={`form-control ${!!errors && errors.fullName ? 'error-form' : ''}`} placeholder="Full name *" name="fullName" ref={register} required />
                                <label>Full Name *</label>
                            </div>
                            {!!errors && !!errors.fullName && (<span className="tx-danger mg-t-5 d-block">{errors.fullName?.message}</span>)}
                        </div>
                        <div className="form-group col-12 col-sm-6">
                            <div className="input-float">
                                <input type="text" className={`form-control ${!!errors && errors.skypeId ? 'error-form' : ''}`} placeholder="Skype ID *" name="skypeId" ref={register} required />
                                <label>Skype ID *</label>
                            </div>
                            {!!errors && !!errors.skypeId && (<span className="tx-danger mg-t-5 d-block">{errors.skypeId?.message}</span>)}
                        </div>
                        <div className="form-group col-12 col-sm-6">
                            <div className="input-float">
                                <input type="text" className={`form-control ${!!errors && errors.phoneNumber ? 'error-form' : ''}`} placeholder="Phone number *" name="phoneNumber" ref={register} required />
                                <label>Phone Number *</label>
                            </div>
                            {!!errors && !!errors.phoneNumber && (<span className="tx-danger mg-t-5 d-block">{errors.phoneNumber?.message}</span>)}
                        </div>
                        <div className="form-group col-12 col-sm-6">
                            <div className="input-float">
                                <input type="text" className={`form-control ${!!errors && errors.email ? 'error-form' : ''}`} placeholder="Email *" name="email" ref={register} required readOnly />
                                <label>Email</label>
                            </div>
                        </div>
                        <div className="form-group col-12 col-sm-6 col-lg-3">
                        <div className="input-float">
                                <input type="text" className={`form-control ${!!errors && errors.location ? 'error-form' : ''}`} placeholder="location *" name="location" ref={register} required />
                                <label>Location</label>
                            </div>
                            {/* <div className="input-float">
                                <Controller
                                    as={
                                        <Select
                                            key={option => `${option.id}`}
                                            isSearchable={true}
                                            isLoading={isLoading}
                                            loadingMessage={() => 'Select option is loading...'}
                                            options={state.locationOptions}
                                            getOptionLabel={option => `${option.LocationName}`}
                                            getOptionValue={option => `${option.ID}`}
                                            styles={appSettings.selectStyle}
                                            placeholder="Select your location..."
                                            className={`${!!errors && !!errors.location ? 'error-form' : ''}`}
                                        />
                                    }
                                    control={control}
                                    name="location" />
                                <label>Location</label>
                            </div>
                            {!!errors && !!errors.location && (<span className="tx-danger mg-t-5 d-block">{errors.location?.message}</span>)} */}
                        </div>
                        <div className="form-group col-12 col-sm-6 col-lg-3">
                        <div className="input-float">
                                <input type="text" className={`form-control ${!!errors && errors.state ? 'error-form' : ''}`} placeholder="state *" name="state" ref={register} required />
                                <label>state</label>
                            </div>
                            {/* <div className="input-float">
                                <Controller
                                    as={
                                        <Select
                                            key={option => `${option.id}`}
                                            isSearchable={true}
                                            isLoading={!optionLoaded}
                                            loadingMessage={() => 'Select option is loading...'}
                                            options={state.stateOptions}
                                            getOptionLabel={option => `${option.StateName}`}
                                            getOptionValue={option => `${option.ID}`}
                                            styles={appSettings.selectStyle}
                                            placeholder="Select state..."
                                            className={`${!!errors && !!errors.state ? 'error-form' : ''}`}
                                        />
                                    }
                                    control={control}
                                    name="state" />
                                <label>State *</label>
                            </div>
                            {!!errors && !!errors.state && (<span className="tx-danger mg-t-5 d-block">{errors.state?.message}</span>)} */}
                        </div>

                        <div className="form-group col-12 col-sm-12 col-lg-6">
                            <div className="input-float">
                                <Controller
                                    as={
                                        <Select
                                            key={option => `${option.id}`}
                                            isSearchable={true}
                                            isLoading={state.timeZoneOptions.length > 0 ? false : true}
                                            loadingMessage={() => 'Loading options...'}
                                            options={state.timeZoneOptions}
                                            getOptionLabel={option => `${option.TimeZoneName}`}
                                            getOptionValue={option => `${option.ID}`}
                                            styles={appSettings.selectStyle}
                                            placeholder="Select timezone..."
                                            menuPortalTarget={document.body}
                                            className={`${!!errors && !!errors.timeZone ? 'error-form' : ''}`}
                                        />
                                    }
                                    control={control}
                                    name="timeZone" />

                                <label>Time zone *</label>
                            </div>
                            {!!errors && !!errors.timeZone && (<span className="tx-danger mg-t-5 d-block">{errors.timeZone?.message}</span>)}
                        </div>
                        <div className="form-group col-12 col-sm-12">
                            <div className="input-float">
                                <Controller
                                    as={
                                        <Select
                                            isMulti={true}
                                             key={option => `${option.ID}`}
                                             isSearchable={false}
                                             isLoading={isLoading}
                                             loadingMessage={() => 'Loading options...'}
                                             //defaultValue={optionsLevel[1]}
                                             options={state.levelOfPurposeOptions}
                                             getOptionLabel={option => `${option.PurposeLevelName}`}
                                             getOptionValue={option => `${option.ID}`}
                                             onChange={(values) => updateState('levelOfPurposeOptions', values)}
                                             styles={appSettings.selectStyle}
                                             menuPortalTarget={document.body}
                                             //value={state.levelOfPurposeOptions}
                                        />
                                    }
                                    control={control}
                                    name="levelOfPurpose" />

                                <label>Level purpose</label>
                            </div>
                            {/* {!!errors && !!errors.levelOfPurpose && (<span className="tx-danger mg-t-5 d-block">{errors.levelOfPurpose?.message}</span>)} */}
                        </div>
                    </div>
                    <hr className="mg-b-30 mg-t-0" style={{ borderStyle: 'dashed' }} />
                    <h5 className="mg-b-20"><i className="fas fa-user-graduate mg-r-5"></i>Education Attainment</h5>
                    <div className="row group-float-label">
                        <div className="form-group col-12 col-sm-6">
                            <div className="input-float">
                                <Controller
                                    as={
                                        <Select
                                            key={option => `${option.id}`}
                                            isSearchable={false}
                                            isLoading={isLoading}
                                            loadingMessage={() => 'Loading options...'}
                                            options={state.levelOfEducationOptions}
                                            getOptionLabel={option => `${option.LevelOfEducationName}`}
                                            getOptionValue={option => `${option.ID}`}
                                            styles={appSettings.selectStyle}
                                            placeholder="Select level..."
                                            menuPortalTarget={document.body}
                                            className={`${!!errors && !!errors.levelOfEducation ? 'error-form' : ''}`}
                                        />
                                    }
                                    control={control}
                                    name="levelOfEducation" />

                                <label>Level of Education</label>
                            </div>
                            {!!errors && !!errors.levelOfEducation && (<span className="tx-danger mg-t-5 d-block">{errors.levelOfEducation?.message}</span>)}
                        </div>
                        <div className="form-group col-12 col-sm-6">
                            <div className="input-float">
                                <input type="text" className={`form-control ${!!errors && errors.schoolName ? 'error-form' : ''}`} placeholder="School name" name="schoolName" ref={register} />
                                <label>School name</label>
                            </div>
                        </div>
                        <div className="form-group col-12 col-sm-6">
                            <div className="input-float">
                                <input type="text" className={`form-control ${!!errors && errors.major ? 'error-form' : ''}`} placeholder="Marjor" name="major" ref={register} />

                                <label>Major/Specialization *</label>
                            </div>
                        </div>
                        <div className="form-group col-12 col-sm-6">
                            <div className="input-float">
                                <Controller
                                    as={
                                        <Select
                                            key={option => `${option.id}`}
                                            isSearchable={false}
                                            isLoading={isLoading}
                                            loadingMessage={() => 'Loading options...'}
                                            options={state.englishProficienOptions}
                                            getOptionLabel={option => `${option.EnglishProficiencyName}`}
                                            getOptionValue={option => `${option.ID}`}
                                            styles={appSettings.selectStyle}
                                            placeholder="Select proficiency..."
                                            menuPortalTarget={document.body}
                                            className={`${!!errors && !!errors.englishProficien ? 'error-form' : ''}`}
                                        />
                                    }
                                    control={control}
                                    name="englishProficien" />

                                <label>English proficiency</label>
                            </div>
                            {!!errors && !!errors.englishProficien && (<span className="tx-danger mg-t-5 d-block">{errors.englishProficien?.message}</span>)}
                        </div>
                    </div>
                </div>

                <div className="tx-center">
                    <button type="submit" className="btn btn-primary d-inline-flex align-items-center" disabled={submitLoading}>
                        {
                            submitLoading ? (
                                <div className="spinner-border wd-20 ht-20 mg-r-5" role="status">
                                    <span className="sr-only">Submitting...</span>
                                </div>
                            )
                                : (<><i className="fa fa-save mg-r-5"></i></>)
                        }
                        <span>{submitLoading ? 'Updating' : 'Save'} information</span>

                    </button>
                </div>
            </form>
        </>
    )
}


export default TeacherInformation

