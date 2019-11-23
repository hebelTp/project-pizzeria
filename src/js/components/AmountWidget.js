import {settings, select} from '../settings.js';

class AmountWidget {

  constructor(element) {
    const thisWidget = this ;

    thisWidget.getElements(element);
    thisWidget.value = settings.amountWidget.defaultValue;
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions(thisWidget.value);
  }

  getElements(element) {
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) {

    const thisWidget = this;

    const newValue = parseInt(value);
    /** TODO: Add Validation */
    if (newValue != thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
      thisWidget.value = newValue;
      thisWidget.anounce();
    }
    thisWidget.input.value = thisWidget.value;
  }

  ///////alter to practice //////

  //   if (this.isValid(thisWidget.value, newValue)) {
  //         thisWidget.value = newValue;
  //         thisWidget.anounce();
  //       }
  // thisWidget.input.value = thisWidget.value;
  // }

  // isValid(oldValue, newValue){
  //   return newValue != oldValue &&
  //   newValue >= settings.amountWidget.defaultMin &&
  //   newValue <= settings.amountWidget.defaultMax
  // }

  initActions () {

    const thisWidget = this;

    thisWidget.input.addEventListener('change', function() {
      thisWidget.setValue(thisWidget.input.value );
    });
    thisWidget.linkIncrease.addEventListener('click', function(event) {

      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });

    thisWidget.linkDecrease.addEventListener('click', function(event) {

      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
  }

  anounce() {

    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });

    thisWidget.element.dispatchEvent(event);
  }
}
export default AmountWidget;
