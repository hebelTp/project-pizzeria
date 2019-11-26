import { templates, select} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';
class Booking {
  constructor(bookingElement){
    const thisBooking = this;

    thisBooking.render(bookingElement);
    thisBooking.initWidgets();
  }

  render(element) {
    const thisBooking = this;

    /** generate HTML based on template */
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    //thisBooking.dom.wrapper = ;
    thisBooking.dom.wrapper = element;

    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);

    element.appendChild(thisBooking.dom.wrapper);
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);

    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }

}

export default Booking;
