import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget {

  constructor(element) {

    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this ;

    thisWidget.getElements(element);

    thisWidget.initActions(thisWidget.value);
    // console.log('Amount Widget', thisWidget );

  }

  getElements( ) {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(value){
    return !isNaN(value)
  && value >= settings.amountWidget.defaultMin
  && value <= settings.amountWidget.defaultMax;
  }

  // eslint-disable-next-line no-unused-vars
  renderValue(value) {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  ///////alter to practice //////

  //   if (this.isValid(thisWidget.value, newValue)) {
  //         thisWidget.value = newValue;
  //         thisWidget.anounce();
  //       }
  // thisWidget.dom.input.value = thisWidget.value;
  // }

  // isValid(oldValue, newValue){
  //   return newValue != oldValue &&
  //   newValue >= settings.amountWidget.defaultMin &&
  //   newValue <= settings.amountWidget.defaultMax
  // }

  initActions () {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function() {
      //thisWidget.setValue(thisWidget.dom.input.value );
    // eslint-disable-next-line indent
    thisWidget.value = thisWidget.dom.input.value;
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function(event) {

      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function(event) {

      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
  }
}
export default AmountWidget;

