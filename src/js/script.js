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
      console.log('new Product', thisProduct);
    }
    renderInMenu() {
      const thisProduct = this;

      /** generate HTML based on template */
      //tworzę zmienną generatedHTML i wywołuję mętodę templates.menuProduct i przekazuję je dane produktu - atrybut
      const generatedHTML = templates.menuProduct(thisProduct.data);
      //console.log(generatedHTML);

      /** create element using utils.createElementPromHTML */
      //////////////////////  method                ///////////////
      //element DOM o właściwości instancji  ??//
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      console.log('thisProduct.element', thisProduct.element);
      /** find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /** add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }
    initAccordion(){
      const thisProduct = this;

      /** find the clickable trigger (the element that should react to cliking ) */

      /** START : click event listener to triger */

        /** prevent default action for event */

        /** toggle active class on element of thisProduct */

        /** find all active products */

        /**  START LOOP: for each active produkt */

          /**  START: if the active product isn't the element of thisProdukt  */

           /** remove class active for the active product */

          /** END: if the active product isn't the element of thisProduct */

          /** END LOOP: for each active product */

      /** END: click event listener to triger */
    }
  }

  const app = {
    initMenu: function() {
      const thisApp = this;

      console.log('thisApp.data', thisApp.data);

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
