import {settings, select, classNames, templates} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';



const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    thisApp.activatePage(thisApp.pages[0].id);

    for(let link of thisApp.navLinks) {
      link.addEventListener('click', function(event) {
        const clickedElement = this;
        event.preventDefault();

        /** get page id from href attribute  */
        const id = clickedElement.getAttribute('href').replace('#', '');
        console.log(id);
        /** run thisApp.activatePage with that id */

      });

    }
  },

  activatePage: function(pageId) {
    const thisApp = this;
    /**add class "active" to matching pages, remove from non-matching */

    for (let page of thisApp.pages) {
      // FIRST VERSION
      // if(page.id == pageId){
      //   page.classList.add(classNames.pages.active);
      // } else {
      //   page.classList.remove(classNames.pages.active);
      // }

      //SECOND VERSION TOGGLE METHOD THE SAME
      page.classList.add(classNames.pages.active, page.id == pageId);
    }

    /**add class "active" to matching LINKS , remove from non-matching */

    for (let link of thisApp.navLinks) {

      //SECOND VERSION TOGGLE METHOD
      link.classList.add(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initMenu: function() {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
    // eslint-disable-next-line no-unused-vars
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();
      });

  },

  initCart: function() {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  init: function() {
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData();
    //thisApp.initMenu();
    thisApp.initCart();


  },
};

app.init();
