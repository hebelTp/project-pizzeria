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
      thisProduct.initAccordion(); //wywołanie metody

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
    initAccordion(){
      const thisProduct = this;
      //console.log(thisProduct);

      /** find the clickable trigger (the element that should react to cliking ) */
      const clicableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      console.log('CLIKABLETRIGGERR', clicableTrigger);

      /** START : click event listener to triger */
      clicableTrigger.addEventListener('click', function(){
        console.log('click!!')




        /** prevent default action for event */
        event.preventDefault();
        /** toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active');

        /** find all active products */
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
        console.log('ACTIVE PRODUCTS', activeProducts);
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
