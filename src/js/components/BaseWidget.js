class BaseWidget  {
  constructor(wrapperElement, initialValue){
    const thisWidget = this;

    thisWidget.dom = {};

    thisWidget.dom.wrapper = wrapperElement;
    thisWidget.correctValue = initialValue;
  }
  get value() {
    const thisWidget = this;

    return thisWidget.correctValue;
  }
  setValue(value) {
    const thisWidget = this;

    thisWidget.value = value;
  }
  set value(value) {
    const thisWidget = this;
    const newValue = thisWidget.parseValue(value);

    /** TODO: Add Validation */
    if (newValue != thisWidget.correctValue && thisWidget.isValid(value)) {
      thisWidget.correctValue = newValue;
      thisWidget.anounce();
    }
    thisWidget.renderValue();
  }

  parseValue(value){
    return parseInt(value);
  }

  isValid(value){
    return !isNaN(value);
  }

  // eslint-disable-next-line no-unused-vars
  renderValue(value) {
    const thisWidget = this;

    thisWidget.dom.input.wrapper.innerHTML = thisWidget.value;
  }

  anounce() {

    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });

    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;
