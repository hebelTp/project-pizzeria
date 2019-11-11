/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion(); //wywołanie metody
      thisProduct.initOrderForm();
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
   console.log(thisProduct.priceElem)
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
      console.log('initOrderForm',thisProduct);

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

      });

    }

    processOrder(){
      const thisProduct = this;
      console.log('processOrder',thisProduct);
      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData',formData);

      /* set variable price to equal thisProduct.data.price */
      const price = thisProduct.priceElem;
      console.log(price);
      /* START LOOP: for each paramId in thisProduct.data.params */

      /* save the element in thisProduct.data.params with key paramId as const param */

        /* START LOOP: for each optionId in param.options */

        /* save the element in param.options with key optionId as const option */

           /* START IF: if option is selected and option is not default */

           /* add price of option to variable price */

           /* END IF: if option is selected and option is not default */

           /* START ELSE IF: if option is not selected and option is default */

           /* deduct price of option from price */

          /* END ELSE IF: if option is not selected and option is default */

        /* END LOOP: for each optionId in param.options */

      /* END LOOP: for each paramId in thisProduct.data.params */

    /* set the contents of thisProduct.priceElem to be the value of variable price */

    }
  }
  const app = {
    initMenu: function() {
      const thisApp = this;

      for (let productData in thisApp.data.products ) {
        new Product (productData, thisApp.data.products[productData]);
      }
    },

    initData: function () {
      const thisApp = this;
      thisApp.data = dataSource;
    },

    init: function() {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();

    },
  };

  app.init();
}
