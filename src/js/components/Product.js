import {select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';
class Product {
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion(); //wywołanie metody
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  renderInMenu() {
    const thisProduct = this;

    /** generate HTML based on template */
    //tworzę zmienną generatedHTML i wywołuję mętodę templates.menuProduct i przekazuję je dane produktu - atrybut
    const generatedHTML = templates.menuProduct(thisProduct.data);


    /** create element using utils.createElementPromHTML */
    //////////////////////  method                ///////////////
    //element DOM o właściwości instancji  ??//
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    /** find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    /** add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }

  getElements(){
    const thisProduct =this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }


  initAccordion(){
    const thisProduct = this;

    /** find the clickable trigger (the element that should react to cliking ) */
    const clicableTrigger = thisProduct.accordionTrigger;

    /** START : click event listener to triger */
    clicableTrigger.addEventListener('click', function(){

      /** prevent default action for event */
      event.preventDefault();

      /** toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle('active');

      /** find all active products */
      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);

      /**  START LOOP: for each active produkt */
      for (let activeProduct of activeProducts){

        /**  START: if the active product isn't the element of thisProdukt  */
        if (activeProduct != thisProduct.element){

          /** remove class active for the active product */
          activeProduct.classList.remove('active');

          /** END: if the active product isn't the element of thisProduct */
        }

        /** END LOOP: for each active product */
      }

      /** END: click event listener to triger */
    });
  }

  initOrderForm(){
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();

    });
  }

  processOrder(){
    const thisProduct = this;

    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);
    thisProduct.params = {};
    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price;

    /* START LOOP: for each paramId in thisProduct.data.params */
    for (let paramId in thisProduct.data.params) {

      /* save the element in thisProduct.data.params with key paramId as const param */
      const param = thisProduct.data.params[paramId];

      /* START LOOP: for each optionId in param.options */
      for (let optionId in param.options) {
      /* save the element in param.options with key optionId as const option */
        const option = param.options[optionId];

        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

        /* START IF: if option is selected and option is not default */
        if(optionSelected && !option.default){

          /* add price of option to variable price */
          price += option.price ;

        /* END IF: if option is selected and option is not default */
        }

        /* START ELSE IF: if option is not selected and option is default */
        else if (!optionSelected && option.default ) {

          /* deduct price of option from price */
          price -= option.price;

          /* END ELSE IF: if option is not selected and option is default */
        }

        /**[NEW] find all images with class active */
        const activeImages = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId );

        /**[NEW] START IF ELSE: if option is selected add active class classNames.MenuProduct.imageVisible */
        if (optionSelected && activeImages) {
          activeImages.classList.add(classNames.menuProduct.imageVisible);

          /** [NEW NEW LOOP: new place of the loop ] */
          if(!thisProduct.params[paramId]) {

            thisProduct.params[paramId] = {

              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;
          /*[NEW NEW END LOOP ]

        /**[NEW] ELSE :  option is not selected  remove class active in classNamess.menuProduct.imageisible */
        } else {
          if(activeImages){
            activeImages.classList.remove(classNames.menuProduct.imageVisible);

            /**[NEW] END IF ELSE LOOP */
          }
        }
      /* END LOOP: for each optionId in param.options */
      }
    /* END LOOP: for each paramId in thisProduct.data.params */
    }
    /* set the contents of thisProduct.priceElem to be the value of variable price */
    /** multiply price by amount */
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
    //[OLD] price *= thisProduct.amountWidget.value;
    /** set the contentsof thisProduct.priceElem to be the value of variable price  */
    thisProduct.priceElem.innerHTML = thisProduct.price;
  }

  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    // eslint-disable-next-line no-unused-vars
    thisProduct.amountWidgetElem.addEventListener('updated', function(event) {
      thisProduct.processOrder();
    });
  }

  addToCart(){
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount =  thisProduct.amountWidget.value;

    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);

  }
}

export default Product;
