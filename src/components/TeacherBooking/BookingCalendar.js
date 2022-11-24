import React, { useState, useEffect, useReducer } from 'react';
import {
	getListEventsOfWeek,
	setEventAvailable,
	setEventClose,
	addScheduleLog,
} from '~src/api/teacherAPI';
import { cancelLesson } from '~src/api/optionAPI';
import ActiveSlotModal from './ActiveSlotModal';
import CloseSlotModal from './CloseSlotModal';
import CancelSlotModal from './CancelSlotModal';
import { appSettings } from '~src/config';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import {
	getDifferentMinBetweenTime,
	checkCancelTime,
	convertDDMMYYYYtoMMDDYYYY,
} from '~src/utils';
import Flatpickr from 'react-flatpickr';
import { CSSTransition } from 'react-transition-group';
import Select from 'react-select';

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

let calendar;
const pad = n => (n >= 10 ? n : '0' + n);
Date.prototype.addHours = function(h) {
	this.setTime(this.getTime() + h * 60 * 60 * 1000);
	return this;
};

Date.prototype.addDays = function(days) {
	return new Date(this.getTime() + 864e5 * days);
};

var popWhitelist = $.fn.tooltip.Constructor.Default.whiteList; //White list data attribute;
popWhitelist.a.push('data-skype');
popWhitelist.a.push('data-schedule');
popWhitelist.a.push('disabled');

//Add hourse Prototype
const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const hotTime = [5, 6, 7, 8, 9, 13, 14, 15, 16];

const date = new Date();
const d = date.getDate();
const m = date.getMonth() + 1;
const y = date.getFullYear();

const formatDateString = dateStr => {
	//Date object,
	return moment(new Date(dateStr)).format('DD/MM/YYYY');
};

const initEvents = [
	{
		id: randomId(),
		title: 'Event Booked',
		start: new Date(
			moment(`${pad(d + 2)}/${m}/2020 10:30`, 'DD/MM/YYYY hh:mm'),
		),
		end: new Date(moment(`${pad(d + 2)}/${m}/2020 11:00`, 'DD/MM/YYYY hh:mm')),
		eventType: 0, // 0 : Bình thường || 1 : Hot
		bookStatus: true,
		bookInfo: {
			name: 'Trương Văn Lam',
		},
		available: false,
		isEmptySlot: false,
	},
	{
		id: randomId(),
		title: 'Event Booked',
		start: new Date(
			moment(`${pad(d + 2)}/${m}/2020 15:30`, 'DD/MM/YYYY hh:mm'),
		),
		end: new Date(moment(`${pad(d + 2)}/${m}/2020 16:00`, 'DD/MM/YYYY hh:mm')),
		eventType: 0, // 0 : Bình thường || 1 : Hot
		bookStatus: true,
		bookInfo: {
			name: 'Hoàng Thúy Uyên',
		},
		available: false,
		isEmptySlot: false,
	},
	{
		id: randomId(),
		title: 'Event Booked',
		start: new Date(
			moment(`${pad(d - 1)}/${m}/2020 12:30`, 'DD/MM/YYYY hh:mm'),
		),
		end: new Date(moment(`${pad(d - 1)}/${m}/2020 13:00`, 'DD/MM/YYYY hh:mm')),
		eventType: 0, // 0 : Bình thường || 1 : Hot
		bookStatus: true,
		bookInfo: {
			name: 'Huynh van Banh',
		},
		available: false,
		isEmptySlot: false,
	},
	{
		id: randomId(),
		title: 'Event Booked',
		start: new Date(moment(`${pad(d)}/${m}/2020 08:30`, 'DD/MM/YYYY hh:mm')),
		end: new Date(moment(`${pad(d)}/${m}/2020 09:00`, 'DD/MM/YYYY hh:mm')),
		eventType: 0, // 0 : Bình thường || 1 : Hot
		bookStatus: true,
		bookInfo: {
			name: 'Huynh van Banh',
		},
		available: false,
		isEmptySlot: false,
	},
	{
		id: randomId(),
		title: 'Event Available',
		start: new Date(
			moment(`${pad(d - 2)}/${m}/2020 14:30`, 'DD/MM/YYYY hh:mm'),
		),
		end: new Date(moment(`${pad(d - 2)}/${m}/2020 15:00`, 'DD/MM/YYYY hh:mm')),
		eventType: 0, // 0 : Bình thường || 1 : Hot
		bookStatus: false,
		bookInfo: null,
		available: true,
		isEmptySlot: false,
	},
	{
		id: randomId(),
		title: 'Event Available',
		start: new Date(moment(`${pad(d)}/${m}/2020 14:30`, 'DD/MM/YYYY hh:mm')),
		end: new Date(moment(`${pad(d)}/${m}/2020 15:00`, 'DD/MM/YYYY hh:mm')),
		eventType: 0, // 0 : Bình thường || 1 : Hot
		bookStatus: false,
		bookInfo: null,
		available: true,
		isEmptySlot: false,
	},
	{
		id: randomId(),
		title: 'Event Hot available',
		start: new Date(
			moment(`${pad(d + 1)}/${m}/2020 12:30`, 'DD/MM/YYYY hh:mm'),
		),
		end: new Date(moment(`${pad(d + 1)}/${m}/2020 13:00`, 'DD/MM/YYYY hh:mm')),
		eventType: 1, // 0 : Bình thường || 1 : Hot
		bookStatus: false,
		bookInfo: null,
		available: true,
		isEmptySlot: false,
	},
	{
		id: randomId(),
		title: 'Empty slot',
		start: new Date(
			moment(`${pad(d + 1)}/${m}/2020 07:30`, 'DD/MM/YYYY hh:mm'),
		),
		end: new Date(moment(`${pad(d + 1)}/${m}/2020 08:00`, 'DD/MM/YYYY hh:mm')),
		eventType: 1, // 0 : Bình thường || 1 : Hot
		bookStatus: false,
		bookInfo: null,
		available: false,
		isEmptySlot: true,
	},
	{
		id: randomId(),
		title: 'Empty slot',
		start: new Date(
			moment(`${pad(d + 1)}/${m}/2020 08:00`, 'DD/MM/YYYY hh:mm'),
		),
		end: new Date(moment(`${pad(d + 1)}/${m}/2020 08:30`, 'DD/MM/YYYY hh:mm')),
		eventType: 1, // 0 : Bình thường || 1 : Hot
		bookStatus: false,
		bookInfo: null,
		available: false,
		isEmptySlot: true,
	},
	{
		id: randomId(),
		title: 'Empty slot',
		start: new Date(
			moment(`${pad(d + 1)}/${m}/2020 09:30`, 'DD/MM/YYYY hh:mm'),
		),
		end: new Date(moment(`${pad(d + 1)}/${m}/2020 10:00`, 'DD/MM/YYYY hh:mm')),
		eventType: 1, // 0 : Bình thường || 1 : Hot
		bookStatus: false,
		bookInfo: null,
		available: false,
		isEmptySlot: true,
	},
	{
		id: randomId(),
		title: 'Empty slot',
		start: new Date(moment('15/06/2020 08:30', 'DD/MM/YYYY hh:mm')),
		end: new Date(moment('15/06/2020 09:00', 'DD/MM/YYYY hh:mm')),
		eventType: 1, // 0 : Bình thường || 1 : Hot
		bookStatus: false,
		bookInfo: null,
		available: true,
		isEmptySlot: false,
	},
];

const BookingCalendar = (/* { eventSource, setEventSource } */) => {
	const [eventSource, setEventSource] = useState(initEvents);
	const [activeDate, setActiveDate] = useState(new Date());
	const [isLoading, setIsLoading] = useState(true);
	const [showErrorBook, setShowErrorBook] = useState(false);
	const [activeModal, setActiveModal] = useState({
		id: '',
		studentName: '',
		start: '',
		end: '',
		date: '',
	});

	const [showQuickCalendar, setShowQuickCalendar] = useState(false);
	const [quickCalendarState, dispatch] = useReducer(reducer, {
		fromDate: '',
		toDate: '',
		fromTime: '06:00',
		toTime: '23:00',
	});
	const [optionSlots, setOPtionSlot] = useState([]);
	const [chooseSlots, setChooseSlot] = useState([]);

	const updateQuickCalendarState = (key, value) => {
		dispatch({
			type: 'STATE_CHANGE',
			payload: { key, value },
		});

		let from = quickCalendarState.fromDate;
		let to = quickCalendarState.toDate;
		let start = quickCalendarState.fromTime;
		let end = quickCalendarState.toTime;

		if (key == 'fromDate') from = value;
		if (key == 'toDate') to = value;
		if (key == 'fromTime') start = value;
		if (key == 'toTime') end = value;

		if (from !== '' && to !== '') {
			let array = [];
			let fromFormat = new Date(convertDDMMYYYYtoMMDDYYYY(from));
			let toFormat = new Date(convertDDMMYYYYtoMMDDYYYY(to));

			const startFormat =
				parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
			const endFormat =
				parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);

			var loop = fromFormat;
			while (loop <= toFormat) {
				for (
					let i =
						startFormat % 30 == 0
							? startFormat
							: (Math.floor(startFormat / 30) + 1) * 30;
					i <= endFormat;
					i = i + 30
				) {
					i !== 23 * 60 &&
						array.push(
							`${moment(loop).format('DD/MM/YYYY')} - ${pad(
								Math.floor(i / 60),
							)}:${pad(i % 60)} - ${pad(Math.floor((i + 25) / 60))}:${pad(
								(i + 25) % 60,
							)}`,
						);
				}
				var newDate = loop.setDate(loop.getDate() + 1);
				loop = new Date(newDate);
			}
			setOPtionSlot(array);
		}
	};

	// console.log(new Date().toLocateString());

	const getEventByWeek = async (date = formatDateString(activeDate)) => {
		setIsLoading(true);
		try {
			const res = await getListEventsOfWeek({ Date: date }); // @string date dd/mm/yyyy
			if (res.Code === 1 && res.Data.length > 0) {
				const newEvents = res.Data.map(event => {
					return {
						...event,
						id: event.BookingID,
						title: event.title || '',
						start: moment(event.Start, 'YYYY-MM-DDTHH:mm').toDate(),
						end: moment(event.End, 'YYYY-MM-DDTHH:mm').toDate(),
						eventType: event.eventType,
						bookStatus: event.bookStatus,
						bookInfo: event.bookInfo,
						available: event.available,
						isEmptySlot: event.isEmptySlot,
					};
				});
				setEventSource(newEvents);
			}
			setIsLoading(false);
		} catch (error) {
			console.log('Goi API khong thanh cong');
		}
	};

	const triggerNextCalendar = () => {
		const nextWeek = activeDate.setDate(activeDate.getDate() + 7);
		setActiveDate(nextWeek);
	};

	const triggerPrevCalendar = () => {
		const prevWeek = activeDate.setDate(activeDate.getDate() - 7);
		setActiveDate(prevWeek);
	};

	const triggerTodayCalendar = () => {
		console.log('Today clicked');
		setActiveDate(new Date());
	};

	let $toggleCheckbox;
	const initCalendar = () => {
		//const createEventSlots

		const calendarEl = document.getElementById('js-book-calendar');

		const $closeModal = $('#md-close-slot');
		const $cancelModal = $('#md-cancel-slot');

		const eventDidMount = args => {
			//    console.log("eventDidMount", args);
			const { event, el } = args;
			const data = {
				...event.extendedProps,
				id: event.id,
				start: event.start,
				end: event.end,
			};
			el.setAttribute('tabindex', -1);
			if (!args.isPast && ![...el.classList].includes('booked-slot')) {
				$(el).tooltip({
					html: true,
					title: `
                    <p class="mg-b-0 tx-nowrap">Your time: ${moment(
											event.extendedProps?.TeacherStart ?? new Date(),
										).format('DD/MM/YYYY hh:mm A')}</p>
                      <p class="mg-b-0 tx-nowrap">VN time: ${moment(
												event.start,
											).format('DD/MM/YYYY hh:mm A')}</p>
                `,
					animation: false,
					template: `<div class="tooltip" role="tooltip">
                    <div class="tooltip-arrow">
                    </div>
                    <div class="tooltip-inner">
                    
                    </div>
                  </div>`,
					trigger: 'hover',
				});
			}

			let diff = getDifferentMinBetweenTime(new Date(), event.start);
			let cancelable = diff > 60 ? true : false;

			!!el &&
				[...el.classList].includes('booked-slot') &&
				$(el)
					.popover({
						html: true,
						container: 'body',
						trigger: 'focus',
						title: 'Booked information',
						content: `  
                <p class="mg-b-5"><span class="mg-r-5">Course:</span><span class="tx-medium">${event
									.extendedProps.bookInfo?.DocumentName ?? ''}</span></p>
                <p class="mg-b-5"><span class="mg-r-5">Lesson:</span><span class="tx-medium">${event
									.extendedProps.bookInfo?.LessonName ?? ''}</span></p>
                <p class="mg-b-5"><span class="mg-r-5">Student:</span><span class="tx-medium">${event
									.extendedProps.bookInfo?.name ?? ''}</span></p>
                <p class="mg-b-5"><span class="mg-r-5">Your time:</span><span class="tx-medium">${moment(
									event.extendedProps?.TeacherStart ?? new Date(),
								).format('DD/MM/YYYY hh:mm A')}</span></p>
                <p class="mg-b-0"><span class="mg-r-5">VN time:</span><span class="tx-medium">${moment(
									event.start,
								).format('DD/MM/YYYY hh:mm A')}</span></p>

                <div class="action mg-t-15">
                    <a href="#" data-schedule='${JSON.stringify(
											data,
										)}' class="btn btn-sm btn-info btn-block tx-white-f mg-b-10 join-class-skype" target="_blank" rel="noopener">Go to Classroom</a>
                    ${
											cancelable
												? `<a href="#" class="btn btn-sm btn-danger btn-block cancel-schedule" data-schedule='${JSON.stringify(
														data,
												  )}'>Cancel lesson</a>`
												: `<a href="#" class="btn btn-sm btn-block btn-disabled">Cancel lesson</a>`
										}
                    ${
											cancelable
												? ''
												: '<p class="mg-b-0 tx-danger mg-t-10">Sorry, you cannot cancel the class</p>'
										}
                </div>

                `,
					})
					.on('click', function() {
						$(this).popover('show');
					});

			$(document).on('click', function(event) {
				let $el = $(el);
				if (
					!$(event.target).closest($el).length &&
					!$(event.target).closest('.popover').length
				) {
					$el.popover('hide');
				}
			});

			!!$toggleCheckbox && showStudentToggle();
			const events = calendar.getEvents();
			const dayHeaders = document.querySelectorAll('.fc-col-header-cell');
			// console.log({dayHeaders});
			if (dayHeaders.length > 0)
				for (let i = 0; i < dayHeaders.length; i++) {
					//  console.log(dayHeaders[i]);
					if ('data-date' in dayHeaders[i].dataset) continue;
					const date = dayHeaders[i].getAttribute('data-date');
					const dateHD = new Date(date);
					let bookedSlot = 0;
					let totalSlot = 0;
					events.map(event => {
						const eventDate = new Date(event.extendedProps.Start.split('T')[0]);
						if (eventDate.getTime() === dateHD.getTime()) {
							(event.extendedProps.available === true ||
								event.extendedProps.bookStatus === true) &&
								totalSlot++;
							event.extendedProps.bookStatus === true && bookedSlot++;
						}
					});
					// console.log(dayHeaders[i]);
					// console.log({bookedSlot, totalSlot});
					dayHeaders[i].querySelector('.booked').textContent = bookedSlot;
					dayHeaders[i].querySelector('.total').textContent = totalSlot;
				}
		};

		const eventClick = args => {
			console.log(
				'event Source calendar',
				calendar.getEventSources()[0].internalEventSource.meta,
			);
			const element = args.el;
			const { start, end, id } = args.event;
			if (
				!!$toggleCheckbox &&
				$toggleCheckbox.prop('checked') === true &&
				![...element.classList].includes('booked-slot')
			) {
				toast.warning(
					'Please uncheck "Only show student booking hours" before open or booking slot !!',
					{
						position: toast.POSITION.TOP_CENTER,
						autoClose: 5000,
					},
				);
				return;
			}
			if (
				[...element.classList].includes('fc-event-past') ||
				![...element.classList].includes('empty-slot')
			)
				return;

				var d = new Date();
				var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
				var nd = new Date(utc + (3600000*7));
			
			const diff = getDifferentMinBetweenTime(nd, start);
			console.log(nd);
			console.log(start);
			console.log(diff);
			if (diff < 30) {
				setShowErrorBook(true);
				return;
			}

			/*  setActiveModal({
                ...activeModal,
                ...args.event.extendedProps,
                date: moment(start).format("DD/MM/YYYY"),
                start: moment(start).format("HH:mm A"),
                end: moment(end).format("HH:mm A")
            });
            $("#md-active-slot").appendTo('body').modal("show");
            */
			_openSlot(
				{
					...activeModal,
					...args.event.extendedProps,
					date: moment(start).format('DD/MM/YYYY'),
					start: moment(start).format('HH:mm A'),
					end: moment(end).format('HH:mm A'),
				},
				calendar.getEventSources()[0].internalEventSource.meta,
			);
		};

		calendar = new FullCalendar.Calendar(calendarEl, {
			height: 550,
			expandRows: true,
			slotMinTime: '06:00',
			slotMaxTime: '23:00',
			eventSources: eventSource,
			headerToolbar: {
				start: '', // will normally be on the left. if RTL, will be on the right
				center: '',
				end: 'today,prev,title,next', // will normally be on the right. if RTL, will be on the left
			},
			titleFormat: { year: 'numeric', month: 'short' },
			navLinks: true, // can click day/week names to navigate views
			editable: false,
			stickyHeaderDates: true,
			selectable: true,
			nowIndicator: true,
			allDaySlot: false,
			dayMaxEvents: true, // allow "more" link when too many events
			eventOverlap: false,
			initialDate: new Date(),
			initialView: 'timeGridWeek',
			firstDay: 1,
			slotDuration: '00:30',
			slotLabelInterval: '00:30',
			slotEventOverlap: false,
			selectOverlap: function(event) {
				return event.rendering === 'background';
			},
			slotLabelContent: function(arg) {
				//  console.log('slotLabelContent', arg);
				const hour = arg.date.getHours();
				console.log(hour);
				let templateEl = document.createElement('div');
				templateEl.setAttribute('class', 'slot-label');
				$("th.fc-timegrid-axis").html('VN Time');
				const html = `
                 ${moment(arg.date).format('hh:mm A')}
                 `;
				templateEl.innerHTML = html;
				return { html };
			},

			dayHeaderContent: function(args) {
				const days = args.date.getDay();
				const d = args.date.getDate();

				const html = `
                    <div class="header-container">
                        <div class="date-wrap">
                            <span class="hd-date">${d} </span><span class="hd-day">${dayNamesShort[days]}</span>
                        </div>
                       <div class="box-slot">
                            <span class="booked"></span> <span class="mg-x-2">/</span> <span class="total"></span>
                       </div>
                    </div>
                `;
				return { html };
			},
			eventClassNames: function(args) {
				const { event, isPast, isStart } = args;
				const {
					bookInfo,
					eventType,
					bookStatus,
					available,
					isEmptySlot,
				} = event.extendedProps;
				let classLists = bookStatus ? 'booked-slot' : 'available-slot';
				classLists += eventType === 1 ? ' hot-slot ' : '';
				classLists += isEmptySlot ? ' empty-slot' : '';
				return classLists;
			},
			eventContent: function(args) {
				let templateEl = document.createElement('div');
				const { event, isPast, isStart } = args;
				const {
					bookInfo,
					eventType,
					bookStatus,
					available,
					isEmptySlot,
				} = event.extendedProps;
				let name = '';
				if (!!bookInfo) {
					let arrayName = bookInfo.name.split(' ');
					name = arrayName[arrayName.length - 1];
				}
				console.log();
				const data = {
					...event.extendedProps,
					id: event.id,
					start: event.start,
					end: event.end,
				};
				const html = `
                    ${
											!isEmptySlot
												? `
                    <div class="inner-book-wrap ">
                        <div class="inner-content">
                        ${
													bookStatus
														? `
                                <span class="label-book booked"><i class="fas ${
																	isPast ? 'fa-check' : 'fa-user-graduate'
																}"></i> ${
																isPast ? 'FINISHED' : 'BOOKED'
														  } ${name}</span>
                                `
														: `<span class="label-book"><i class="fas fa-copyright"></i>AVAILABLE</span>`
												}
                        ${
													available
														? `<a href="javascript:;" class="fix-btn close-schedule" data-schedule='${JSON.stringify(
																data,
														  )}' data-events='${
																calendar.getEventSources()[0]
																	.internalEventSource.meta
														  }'>Close</a>`
														: ''
												}
                        </div>
                    </div>`
												: ''
										}
                `;
				templateEl.innerHTML = html;
				return { domNodes: [templateEl] };
			},
			eventClick: eventClick,
			eventDidMount: eventDidMount,
			nowIndicatorDidMount: function(args) {
				//   console.log("nowIndicatorDidMount", args);
			},
			//events: eventSource
		});

		calendar.render();

		$('.fc-toolbar-chunk:first-child').append(
			`<div class="custom-control custom-checkbox" id="student-toggle">
                <input type="checkbox" class="custom-control-input" id="student-toggle-checkbox">
                <label class="custom-control-label" for="student-toggle-checkbox">Only show student booking hours</label>
            </div>`,
		);

		$('body').on('click', '.cancel-schedule', function(e) {
			e.preventDefault();
			const eventData = JSON.parse(this.getAttribute('data-schedule'));
			console.log(eventData);
			setActiveModal({
				...activeModal,
				...eventData,
				studentName: eventData.bookInfo?.name ?? '',
				courseName: eventData.bookInfo?.DocumentName ?? '',
				lessonName: eventData.bookInfo?.LessonName ?? '',
				teacherTime: moment(eventData?.TeacherStart ?? new Date()).format(
					'DD/MM/YYYY hh:mm A',
				),
				vnTime: moment(eventData.start).format('DD/MM/YYYY hh:mm A'),
			});

			$cancelModal.appendTo('body').modal('show');
			// alert("Cancel schedule ID : " + eventData);
		});

		$('body').on('click', '.close-schedule', function(e) {
			e.preventDefault();
			const eventData = JSON.parse(this.getAttribute('data-schedule'));
			const eventsArray = calendar.getEventSources()[0].internalEventSource
				.meta;
			console.log(eventData);
			/*  setActiveModal({
                ...activeModal,
                ...eventData,
                date: moment(eventData.start).format('dddd, DD/MM/YYYY'),
                start: moment(eventData.start).format('hh:mm A'),
                end: moment(eventData.end).format('hh:mm A')
            });
            $closeModal.appendTo('body').modal('show'); */
			// alert("Close slot available ID : " + eventData);
			_closeSlot(
				{
					...activeModal,
					...eventData,
					date: moment(eventData.start).format('dddd, DD/MM/YYYY'),
					start: moment(eventData.start).format('hh:mm A'),
					end: moment(eventData.end).format('hh:mm A'),
				},
				eventsArray,
			);
		});

		$('body').on('click', '.join-class-skype', async function(e) {
			e.preventDefault();
			const eventData = JSON.parse(this.getAttribute('data-schedule'));
			try {
				addScheduleLog({ BookingID: eventData.BookingID });
			} catch (error) {
				console.log(error?.message ?? `Can't add schedule log !!`);
			}
			window.location.href = `skype:${eventData?.bookInfo?.SkypeID ?? ''}?chat`;
		});

		$('body').on(
			'click',
			'#js-book-calendar .fc-next-button',
			triggerNextCalendar,
		);
		$('body').on(
			'click',
			'#js-book-calendar .fc-prev-button',
			triggerPrevCalendar,
		);
		$('body').on(
			'click',
			'#js-book-calendar .fc-today-button',
			triggerTodayCalendar,
		);
		$toggleCheckbox = $('#student-toggle-checkbox');

		$('body').on('change', $toggleCheckbox, showStudentToggle);

		function showStudentToggle() {
			const value = $toggleCheckbox.prop('checked');
			const nonBookedEvents = $('.fc-event:not(.booked-slot)');
			value
				? nonBookedEvents.addClass('hide-event')
				: nonBookedEvents.removeClass('hide-event');
		}
	};

	const setAvailableEvent = (newProps, eventsArray) => {
		console.log(newProps);
		console.log(eventSource);
		const newSources = [...eventsArray].map(event =>
			event.StudyTimeID === newProps.StudyTimeID &&
			event.Start === newProps.Start
				? {
						...event,
						available: true,
						bookStatus: false,
						isEmptySlot: false,
						OpenDayID: newProps.OpenDayID,
				  }
				: event,
		);
		//console.log(newSources)
		setEventSource(newSources);
	};

	const closeAvailableEvent = (newProps, eventsArray) => {
		const newSources = [...eventsArray].map(event =>
			event.StudyTimeID === newProps.StudyTimeID &&
			event.Start === newProps.Start
				? {
						...event,
						available: false,
						bookStatus: false,
						isEmptySlot: true,
				  }
				: event,
		);
		setEventSource(newSources);
	};

	const cancelBookedEvent = newProps => {
		const { StudyTimeID, Start } = newProps;
		const newSources = [...eventSource].map(event =>
			event.StudyTimeID === StudyTimeID && event.Start === Start
				? {
						...event,
						available: false,
						bookStatus: false,
						isEmptySlot: true,
						bookInfo: null,
				  }
				: event,
		);
		setEventSource(newSources);
	};

	const _openSlot = async (data, eventsArray) => {
		setIsLoading(true);
		$('#md-active-slot').modal('hide');
		try {
			const res = await setEventAvailable({
				Date: formatDateString(new Date(data.Start)),
				StudyTimeID: data.StudyTimeID,
			});
			if (res.Code === 1) {
				console.log(res.Data.OpenDayID);
				setAvailableEvent(
					{
						...data,
						OpenDayID: res?.Data?.OpenDayID ?? 0,
					},
					eventsArray,
				);
				/*  toast.success('Open slot success', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000
                }); */
			} else {
				toast.error('Open slot failed', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
				console.log('Loi  khi goi api');
			}
		} catch (error) {
			console.log('Error openSlot !', error);
			alert('Open slot failed !!');
		}
		setIsLoading(false);
	};

	const _closeSlot = async (data, eventsArray) => {
		setIsLoading(true);
		console.log(data);
		$('#md-close-slot').modal('hide');
		try {
			const res = await setEventClose({
				OpenDayID: data.OpenDayID,
			});
			if (res.Code === 1) {
				closeAvailableEvent(data, eventsArray);
				/*  toast.success('Close slot success', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000
                }); */
			} else {
				toast.error('Close slot failed', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
				console.log('Call api không thành công, xem lại tham số !');
			}
		} catch (error) {
			console.log('Error openSlot !', error);
		}
		setIsLoading(false);
	};

	const _cancelSlot = async data => {
		setIsLoading(true);
		$('#md-cancel-slot').modal('hide');
		try {
			const res = await cancelLesson({
				BookingID: data.BookingID,
				ReasonCancleOfTeacher: data.reason,
			});
			if (res.Code === 1) {
				cancelBookedEvent(data);
				toast.success('You have canceled a lesson successfully', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
			} else {
				toast.error(res?.Message ?? 'Cancel slot failed', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
			}
		} catch (error) {
			console.log('Error openSlot !', error);
		}
		setIsLoading(false);
	};

	const onSubmit = e => {
		e.preventDefault();
		console.log(chooseSlots);
	};

	useEffect(() => {
		console.log('effect', eventSource);
		if (!!calendar) {
			console.log('Event source updated', eventSource);
			// calendar.addEventSource(eventSource);
			let eventsInstance = calendar.getEventSources();
			eventsInstance[0] && eventsInstance[0].remove();
			calendar.addEventSource(eventSource);
		}
	}, [eventSource]);

	useEffect(() => {
		getEventByWeek();
		// console.log(activeDate);
	}, [activeDate]);

	useEffect(() => {
		initCalendar();
	}, []);

	return (
		<>
			<div className="book__calendar">
				{isLoading && (
					<div className="loading-style">
						<div className="lds-ellipsis">
							<div></div>
							<div></div>
							<div></div>
							<div></div>
						</div>
					</div>
				)}
				<div className="time-zone"></div>

				{/*  <button className="btn btn-primary mg-b-15 show-quick-calendar" onClick={() => setShowQuickCalendar(!showQuickCalendar)}>Open Quick Slots</button>
                <CSSTransition
                    timeout={300}
                    in={showQuickCalendar}
                    classNames="calendar"
                    onEnter={() => setShowQuickCalendar(true)}
                    onExited={() => setShowQuickCalendar(false)}>
                    <>
                        {
                            showQuickCalendar && <div id="quick-calendar">
                                <form action="" method="get" noValidate className="" onSubmit={onSubmit}>
                                    <div className="row">
                                        <div className="col-md-2 c-left">
                                            <h5>Date</h5>
                                        </div>
                                        <div className="col-md-10 c-right">
                                            <div className="form-row">
                                                <div className="col-12 col-sm-6 col-lg-4 form-group mg-b-0">
                                                    <Flatpickr
                                                        placeholder="From date"
                                                        options={{
                                                            dateFormat: "d/m/Y",
                                                            minDate: moment(new Date()).format('DD/MM/YYYY'),
                                                            maxDate: quickCalendarState.toDate,
                                                            static: true,
                                                        }}
                                                        className="form-control"
                                                        onChange={(selectedDates, dateStr, instance) =>
                                                            updateQuickCalendarState("fromDate", dateStr)} />
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-4 form-group mg-b-0">
                                                    <Flatpickr
                                                        placeholder="To date"
                                                        options={{
                                                            dateFormat: "d/m/Y",
                                                            minDate: quickCalendarState.fromDate,
                                                            static: true,
                                                        }}
                                                        className="form-control"
                                                        onChange={(selectedDates, dateStr, instance) =>
                                                            updateQuickCalendarState("toDate", dateStr)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row pd-t-15">
                                        <div className="col-md-2 c-left">
                                            <h5>Time</h5>
                                        </div>
                                        <div className="col-md-10 c-right">
                                            <div className="form-row">
                                                <div className="col-12 col-sm-6 col-lg-4 form-group mg-b-0">
                                                    <Flatpickr
                                                        placeholder="Start time"
                                                        value={quickCalendarState.fromTime}
                                                        value="06:00"
                                                        options={{
                                                            dateFormat: "H:i",
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            time_24hr: true,
                                                            disableMobile: "true",
                                                            minTime: "06:00",
                                                            maxTime: quickCalendarState.toTime,
                                                            static: true,
                                                        }}
                                                        className="form-control"
                                                        onChange={(selectedDates, dateStr, instance) =>
                                                            updateQuickCalendarState("fromTime", dateStr)} />
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-4 form-group mg-b-0">
                                                    <Flatpickr
                                                        placeholder="End time"
                                                        value={quickCalendarState.toTime}
                                                        value="23:00"
                                                        options={{
                                                            dateFormat: "H:i",
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            time_24hr: true,
                                                            disableMobile: "true",
                                                            minTime: quickCalendarState.fromTime,
                                                            maxTime: "23:00",
                                                            static: true,
                                                        }}
                                                        className="form-control"
                                                        onChange={(selectedDates, dateStr, instance) =>
                                                            updateQuickCalendarState("toTime", dateStr)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row pd-t-15">
                                        <div className="col-md-2 c-left">
                                            <h5>Slots</h5>
                                        </div>
                                        <div className="col-md-10 c-right">
                                            <div className="form-row">
                                                <div className="col-12 col-lg-8">
                                                    <Select
                                                        isMulti={true}
                                                        isSearchable={false}
                                                        menuPortalTarget={document.body}
                                                        options={optionSlots}
                                                        getOptionLabel={label => label}
                                                        getOptionValue={value => value}
                                                        styles={appSettings.selectStyle}
                                                        className="basic-multi-select"
                                                        placeholder="Select Slots"
                                                        classNamePrefix="select"
                                                        onChange={val => setChooseSlot(val)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary mg-y-15">Open Slots</button>
                                </form>
                            </div>
                        }
                    </>
                </CSSTransition>

 */}
				<div id="js-book-calendar" className="fc fc-unthemed fc-ltr" />
			</div>
			<div className="notice pd-20 bg-primary-light rounded-5 mg-t-30">
				<h5 className="mg-b-15 tx-primary">
					<i className="fas fa-file"></i> Notes:
				</h5>
				<ul className="mg-b-0">
					<li>Each Class is 25 minutes.</li>
					<li>To open a slot, simply select the time Slot and click on it.</li>
					<li>To close a Slot, simple select the time Slot and click on it.</li>
					<li>
						To cancel a Booked Class, select the Booked Slot and click `Cancel
						the Class`.
					</li>
				</ul>
			</div>
			<ActiveSlotModal data={activeModal} handleOpenSlot={_openSlot} />

			<CloseSlotModal data={activeModal} handleCloseSlot={_closeSlot} />

			<CancelSlotModal data={activeModal} handleCancelSlot={_cancelSlot} />
			<Modal
				show={showErrorBook}
				onHide={() => setShowErrorBook(false)}
				size="sm"
				centered
				bsPrefix="modal"
			>
				<Modal.Header bsPrefix="modal-header bg-danger tx-white pd-10">
					<Modal.Title bsPrefix="modal-title tx-white">
						Open slot failed !
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p className="mg-b-0">
						Sorry, you cannot open this class. It is less than 30 mins to
						starting time.
					</p>
					<div className="tx-right mg-t-15">
						<Button
							size="sm"
							variant="light"
							onClick={() => setShowErrorBook(false)}
						>
							Close
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};

/* 


const BookingCalendarWrap = () => {
    const [eventSource, setEventSource] = useState(initEvents);
    const [activeDate, setActiveDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);

    const getEventSource = async (date = formatDateString(activeDate)) => {
        setIsLoading(true);
        try {
            const res = await getListEventsOfWeek({ Date: date }); // @string date dd/mm/yyyy
            if (res.Code === 1 && res.Data.length > 0) {
                const newEvents = res.Data.map((event) => {
                    return {
                        ...event,
                        id: event.BookingID,
                        title: event.title || '',
                        start: moment(event.Start, 'YYYY-MM-DDTHH:mm').toDate(),
                        end: moment(event.End, 'YYYY-MM-DDTHH:mm').toDate(),
                        eventType: event.eventType,
                        bookStatus: event.bookStatus,
                        bookInfo: event.bookInfo,
                        available: event.available,
                        isEmptySlot: event.isEmptySlot
                    }
                });
                setEventSource(newEvents);
            }
            setIsLoading(false);
        } catch (error) {
            console.log('Goi API khong thanh cong');
        }
    }
    useEffect(()=>{
        getEventSource();
    },[])

    return <BookingCalendar eventSource={eventSource} setEventSource={setEventSource}/>
} */

export default BookingCalendar;
