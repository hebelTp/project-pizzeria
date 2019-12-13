import { templates, select, classNames} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import { settings } from '../settings.js';

class Booking {
  constructor(bookingElement){
    const thisBooking = this;

    thisBooking.reservation = [];

    thisBooking.render(bookingElement);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.selectTable();
    // thisBooking.sendBooked();


  }


  // WORKS ON A PREPARED CHEAT SHEET = OBJ =  OBJ Date, OBJ Hour, ARR number of table
  // eslint-disable-next-line no-unused-vars

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;
    thisBooking.booked = {};

    for(let item of bookings){


      thisBooking.makeBooked(item.date, item.hour, item.duration, [item.table]);
    }

    /**LOOP for each eventsCurrent - once time */
    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, [item.table]);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate,1 )) {

          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, [item.table]);
        }
      }
    }


    thisBooking.updateDOM();
    thisBooking.rangeColourHour();


  }

  makeBooked(date, hour, duration, tablesArray) {

    const thisBooking = this;
    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5 ) {

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];

      }

      thisBooking.booked[date][hourBlock] = thisBooking.booked[date][hourBlock].concat(tablesArray);
      const duplicat = [];
      for (let i = 0; i < thisBooking.booked[date][hourBlock].length; i++) {
        const tableId = thisBooking.booked[date][hourBlock][i];
        if(!duplicat.includes(tableId)) {
          duplicat.push(tableId);
        }
      }
      thisBooking.booked[date][hourBlock] = duplicat;
    }

  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvailable = true;
    }

    for(let table of thisBooking.dom.tables) {

      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
    thisBooking.rangeColourHour();
  }

  render(element) {
    const thisBooking = this;
    /** generate HTML based on template */
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);
    element.appendChild(thisBooking.dom.wrapper);

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount.input);

    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.inputPhone = thisBooking.dom.wrapper.querySelector(select.booking.bookPhone);
    thisBooking.dom.inputAddress = thisBooking.dom.wrapper.querySelector(select.booking.bookAddress);
    thisBooking.dom.submit = thisBooking.dom.wrapper.querySelector(select.booking.bookTableBtn);
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hourBooking =  thisBooking.dom.wrapper.querySelector(select.booking.bookHourInput);
    thisBooking.dom.hourAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.peopleBooking = thisBooking.dom.wrapper.querySelector(select.booking.bookPeopleInput);
    thisBooking.dom.starters  = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);


    thisBooking.dom.wrapper.addEventListener('updated', function() {
    //  thisBooking.rangeColourHour();
      thisBooking.updateDOM();
    });


  }

  getData(){
    const thisBooking = this;
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,

      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],

    };
console.log(params);
    const urls ={
      booking:        settings.db.url + '/' + settings.db.booking
                                      + '?' + params.booking.join('&'),
      eventsCurrent:  settings.db.url + '/' + settings.db.event
                                      + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:   settings.db.url + '/' + settings.db.event
                                      + '?' + params.eventsRepeat.join('&'),
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })

      .then(function([bookings, eventsCurrent, eventsRepeat]) {
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      console.log(bookings);
      console.log(eventsCurrent);
      console.log(eventsRepeat);
      });
  }

  selectTable(){
    const thisBooking = this;

    for (let table of thisBooking.dom.tables) {
      table.addEventListener('click', function() {
        // if (table.classList.contains(classNames.booking.tableBooked)) {
        // } else {
        table.classList.toggle('selected');//&&table.classList.add(classNames.booking.tableBooked);
        // if (table.classList.contains('booked')) {     //// nadpisano
        //   table.classList.remove('selected');          //// nadpisano
        // }                                          //// nadpisano

        thisBooking.tableId = table.getAttribute(settings.booking.tableIdAttribute);

      });
    }
    thisBooking.dom.submit.addEventListener('click', function(){
      event.preventDefault();
      thisBooking.sendBooked();

    });
  }

  sendBooked(){

    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.booking;
    const payload = {
      bookPhone: thisBooking.dom.inputPhone.value,            //
      bookAddress: thisBooking.dom.inputAddress.value,        //
      datePicked: thisBooking.datePicker.correctValue,               //
      hourPicked: thisBooking.hourPicker.value,               //
      bookHourInput: thisBooking.dom.hourBooking.value,
      bookPeopleInput: thisBooking.dom.peopleBooking.value,
      starters: [],
      table:[],


    };
console.log(payload);
    for(let starter of thisBooking.dom.starters) {
      if (starter.checked == true) {
        payload.starters.push(starter.value);
      }
    }
    for (let table of this.dom.tables) {

      if (table.classList.contains('selected')) {
        thisBooking.tableId = table.getAttribute(settings.booking.tableIdAttribute);
        table.classList.add('booked');
        table.classList.remove('selected');
        if (!isNaN(thisBooking.tableId)) {
          thisBooking.tableId = parseInt(thisBooking.tableId);
        }
        payload.table.push(thisBooking.tableId);
      }


      // for (let table of thisBooking.dom.tables) {
      //   if (table.classList.contains('selected')) {
      //     thisBooking.tableId = table.getAttribute(settings.booking.tableIdAttribute);

      //     table.classList.add(classNames.booking.tableBooked);
      //     table.classList.remove('selected');
      //     if (!isNaN(thisBooking.tableId)) {
      //       thisBooking.tableId = parseInt(thisBooking.tableId);
      //     }
      //     payload.table.push(thisBooking.tableId);


    }


    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options)
      .then(function(response) {
        return response.json();
        // eslint-disable-next-line no-unused-vars
      }).then (function(parsedResponse){
        thisBooking.makeBooked(payload.datePicked, payload.hourPicked, payload.bookHourInput, payload.table);
        // jeśli nie przechodzi payload.table to nie wysyłaj
        console.log(payload.datePicked);
        console.log(payload.hourPicked);
        console.log(payload.bookHourInput);
        console.log(payload.table);

      });

  }

  rangeColourHour() {
    const thisBooking = this;
    const bookedHours = thisBooking.booked[thisBooking.date];
    const sliderDataForDay = [];
    thisBooking.dom.rangeSlider = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.slider);

    const slider = thisBooking.dom.rangeSlider;

    for (let bookedHour in bookedHours){
      const firstOfInterval = ((bookedHour -12)*100)/12;
      const secondOfInterval = ((bookedHour-12+0.5)*100)/12;

      if
      (bookedHours[bookedHour].length <=1) {
        sliderDataForDay.push (' green ' + firstOfInterval + '%, green ' + secondOfInterval + '%');
      } else if
      (bookedHours[bookedHour].length === 2) {
        sliderDataForDay.push (' orange ' + firstOfInterval + '%, ' + 'orange ' + secondOfInterval + '% ');
      } else if
      (bookedHours[bookedHour].length === 3){
        sliderDataForDay.push (' red ' + firstOfInterval + '%, ' + 'red ' + secondOfInterval + '% ');
      }
    }

    const greenOrangeRedString = sliderDataForDay.join();
    slider.style.background =  'linear-gradient(to right, ' + greenOrangeRedString + ')';
  }
}
export default Booking;
