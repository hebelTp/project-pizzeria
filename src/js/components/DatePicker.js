import {select, } from '../settings.js';
import BaseWidget from './BaseWidget.js';
import {utils} from '../utils.js';
import { settings } from '../settings.js';

class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();

  }
  initPlugin () {
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = new Date(utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture));

    // console.log(this.minDate);
    // console.log(this.maxDate);
    // console.log(thisWidget)
  }

  parseValue (value){
    return value;
  }

  isValid() {
    return true;
  }

  renderValue() {

  }
}
export default DatePicker;
