import { templates, select} from '../settings.js';
import {utils} from '../utils.js';
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
    console.log(thisBooking.dom.wrapper);
    element.appendChild(thisBooking.dom.wrapper);
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    console.log(thisBooking.dom.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    console.log(thisBooking.dom.hoursAmount);
  }

  initWidgets() {
    const thisBooking = this;
  }

}

export default Booking;
