import { templates} from '../settings.js';
import {utils} from '../utils.js';
class Booking {
  constructor(bookingElement){
    const thisBooking = this;

    console.log('Booking', thisBooking);

    thisBooking.render(bookingElement);
    thisBooking.initWidgets();
  }

  render(element) {
    const thisBooking = this;

    /** generate HTML based on template */
    const generatedHTML = templates.bookingWidget();
    console.log(generatedHTML);

    thisBooking.dom = {};
    //thisBooking.dom.wrapper = ;
    thisBooking.dom.wrapper = element;

    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);
    console.log(thisBooking.dom.wrapper);

    element.appendChild(thisBooking.dom.wrapper);
  }

  initWidgets() {
    const thisBooking = this;
  }

}

export default Booking;
