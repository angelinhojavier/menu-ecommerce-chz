import * as bodyScrollLock from 'body-scroll-lock';
import hfConfig from 'hfConfig';
import * as homeDecorFurnitureMobileFlyoutLevel1Template from 'text!homeDecorFurnitureMobileFlyoutLevel1Template';
import * as homeDecorFurnitureMobileFlyoutLevel2Template from 'text!homeDecorFurnitureMobileFlyoutLevel2Template';
import * as homeDecorFurnitureMobileFlyoutLevel3Template from 'text!homeDecorFurnitureMobileFlyoutLevel3Template';
import * as simpleflyoutLevel1Template from 'text!specialsSimpleFlyoutLevel1Tpl';
import * as thdcustomer from 'thd-customer';

import Mustache from 'mustache';
import headerAnalytics from 'header.analytics';
import headerData from 'header.data';
import headerMask from 'header.mask';
import specialsFlyout from 'header.specialsflyout';
import utils from 'hfs.shared.utils';

const flyout = {};

const privateMethods = {};
const privateData = {};

let homeDecorFurnitureData = {};
let diyProjectsIdeasData = {};
let homeServicesData = {};
let specialsOffersData = {};

let l1Name;
let l2Name;

let homeDecorFurnitureRecentlyViewedCategories = [];
let persistentAisle = null;
let persistentBay = null;

privateMethods.templates = {};

// constructDIYProjectsIdeasFlyoutLevel1
// constructHomeServicesFlyoutLevel1
// The id contains level 2 even though this is level 1
privateMethods.templates.diyAndHomeServicesLevel1 =
  '<div id="diyhslevel2" class="diyandhs">' +
  '  <span class="SimpleFlyout__header">' +
  '    {{name}} ' +
  '  </span>' +
  '  <div class="SimpleFlyout__divider"></div>' +
  '  <ul class="SimpleFlyout__list">' +
  '    {{#links}} ' +
  '      {{#hidel2level}} ' +
  '        {{#sublinks}} ' +
  '          {{^hidemobile}} ' +
  '            <li class="SimpleFlyout__listItem">' +
  '              <a data-type="direct" ' +
  '                 class="SimpleFlyout__link" ' +
  '                 href="{{link}}" ' +
  '                 title="{{{title}}}">' +
  '                {{{title}}} ' +
  '              </a>' +
  '            </li>' +
  '          {{/hidemobile}} ' +
  '        {{/sublinks}} ' +
  '      {{/hidel2level}} ' +
  '      {{^hidel2level}} ' +
  '        <li class="SimpleFlyout__listItem">' +
  '          <a class="{{linkClassName}}__link"  ' +
  '             href="{{link}}"  ' +
  '             title="{{{title}}}">' +
  '            {{{title}}} ' +
  '          </a>' +
  '        </li>' +
  '      {{/hidel2level}} ' +
  '    {{/links}} ' +
  '    {{#viewAllLink}} ' +
  '      <li class="SimpleFlyout__listItem">' +
  '        <a data-type="direct" ' +
  '           class="SimpleFlyout__link" ' +
  '           href="{{viewAllLink}}" ' +
  '           title="View All">' +
  '          View All {{name}} ' +
  '        </a>' +
  '      </li>' +
  '    {{/viewAllLink}} ' +
  '  </ul>' +
  '</div>';

// diyHomeServicesHelper
privateMethods.templates.diyAndHomeServicesLevel3 =
  '<span class="SimpleFlyout__header">' +
  '  {{name}} ' +
  '</span>' +
  '<div class="SimpleFlyout__divider"></div>' +
  '<ul class="SimpleFlyout__list">' +
  '  {{#sublinks}} ' +
  '    <li class="SimpleFlyout__listItem">' +
  '      <a data-type="direct" ' +
  '         class="SimpleFlyout__link" ' +
  '         href="{{link}}" ' +
  '         title="{{{title}}}">' +
  '        {{{title}}} ' +
  '      </a>' +
  '    </li>' +
  '  {{/sublinks}} ' +
  '  {{#viewAllLink}} ' +
  '    <li class="SimpleFlyout__listItem">' +
  '      <a data-type="direct" ' +
  '         class="SimpleFlyout__link" ' +
  '         href="{{viewAllLink}}" ' +
  '         title="View All">' +
  '        View All {{name}} ' +
  '      </a>' +
  '    </li>' +
  '  {{/viewAllLink}} ' +
  '</ul>';

// openSimpleMenuLevel2
// openSimpleMenuLevel3
privateMethods.templates.simpleList =
  '{{#allLink}} ' +
  '  <a href="{{allLink}}">' +
  '    <span class="SimpleFlyout__header">' +
  '      {{name}} ' +
  '    </span>' +
  '  </a>' +
  '{{/allLink}} ' +
  '{{^allLink}} ' +
  '  <span class="SimpleFlyout__header">' +
  '    {{name}} ' +
  '  </span>' +
  '{{/allLink}} ' +
  '<div class="SimpleFlyout__divider"></div>' +
  '<ul class="SimpleFlyout__list">' +
  '  {{#links}} ' +
  '    <li class="SimpleFlyout__listItem">' +
  '      <a class="SimpleFlyout__link" href="{{url}}" title="{{name}}">' +
  '        {{name}} ' +
  '      </a>' +
  '    </li>' +
  '  {{/links}} ' +
  '  {{#allLink}} ' +
  '    <li class="SimpleFlyout__listItem">' +
  '      <a data-type="direct" class="SimpleFlyout__link" href="{{allLink}}" title="View All">' +
  '        View All {{name}} ' +
  '      </a>' +
  '    </li>' +
  '  {{/allLink}} ' +
  '</ul>';

// renderL1Categories
privateMethods.templates.level1Flyout =
  '{{#l1}} ' +
  '  {{^hideL1}} ' +
  '    <li class="SimpleFlyout__listItem">' +
  '      <a href="{{link}}" ' +
  '         class="SimpleFlyout__link{{#activeHolidayClass}} SimpleFlyout__link--{{activeHolidayClass}}{{/activeHolidayClass}}" ' +
  '         data-level="{{name}}" ' +
  '         data-image="{{feature.image}}" ' +
  '         data-title="{{feature.title}}" ' +
  '         data-cta="{{feature.cta}}" ' +
  '         data-link="{{feature.link}}" ' +
  '         title="{{name}}">' +
  '        {{name}} ' +
  '      </a>' +
  '    </li>' +
  '  {{/hideL1}} ' +
  '{{/l1}}';

privateData.homeDecorFurnitureSelectedLevels = [];
privateData.homeServicesSelectedLevels = [];
privateData.specialsSelectedLevels = [];

/*
  * Private Methods
  */

/**
 * Captures the path traversed by the user on click of the headers in L2 and L3.
 * This is used for analytics. And logs the path
 */

privateData.pathCaptured = false;

privateMethods.capturePath = function _capturePath(event) {
  if (!privateData.pathCaptured) {
    if (event?.target?.classList?.contains('hdfMobile')) {
      // Home Decor, Furniture & Kitchenware
      privateData.homeDecorFurnitureSelectedLevels.push(event?.target?.textContent);
      privateMethods.logHomeDecorFurniturePath('header click');
    } else {
      // All Departments
      const path = ['all departments', privateData.selectedLevel1];
      privateData.selectedLevel2 !== undefined && path.push(privateData.selectedLevel2);
      path.push(event?.target?.textContent);
      privateMethods.logEventPath('header click', path);
    }
    privateData.pathCaptured = true;
  } else {
    privateData.pathCaptured = false;
  }
};

privateMethods.clearURL = function _clearURL(urlString) {
  // Need to ensure this value isn't just a placeholder
  // if it is, we need to remove the string so Mustache can tell.
  return urlString === '#' ? '' : urlString;
};

privateMethods.closeOnSearchOpen = function _closeOnSearchOpen(event, isOpen) {
  if (event?.detail?.open || isOpen) {
    privateMethods.showSimpleFlyout(null, false);
    document.dispatchEvent(new CustomEvent('toggleMyAccountDrawer', {detail:{open:false}}))
  }
};

privateMethods.constructDIYProjectsIdeasFlyoutLevel1 = function _constructDIYProjectsIdeasFlyoutLevel1(event, response) {
  const panelTitle = event?.target?.textContent;
  const viewAllURL = event?.target?.getAttribute?.('href');
  let htmlContent;

  diyProjectsIdeasData = utils.extendObject(true, response);
  diyProjectsIdeasData.diyflyout.name = panelTitle;
  diyProjectsIdeasData.diyflyout.linkClassName = 'diy';
  diyProjectsIdeasData.diyflyout.viewAllLink = viewAllURL;
  const contentWrapper = document.createElement('template');
  htmlContent = Mustache.render(privateMethods.templates.diyAndHomeServicesLevel1, diyProjectsIdeasData.diyflyout);
  contentWrapper.innerHTML = htmlContent;
  utils.hideAllElements('#simplePanelLevel1 span, #simplePanelLevel1 div.SimpleFlyout__divider:nth-child(2)');
  document.getElementById('simplePanelLevel1')?.appendChild(contentWrapper.content);
};

privateMethods.constructHomeDecorFurnitureFlyoutLevel1 = function _constructHomeDecorFurnitureFlyoutLevel1(event, response) {
  const panelTitle = 'Home Decor, Furniture & Kitchenware';
  const previousBackPanel = document.querySelectorAll('.SimpleFlyout__back');

  homeDecorFurnitureData = response;
  homeDecorFurnitureData.name = panelTitle;
  homeDecorFurnitureRecentlyViewedCategories = privateMethods.getRecentlyViewedCategories();

  if (homeDecorFurnitureRecentlyViewedCategories !== null
    && homeDecorFurnitureRecentlyViewedCategories.length > 0) {
    homeDecorFurnitureData.hasCategories = true;
    homeDecorFurnitureData.categories = homeDecorFurnitureRecentlyViewedCategories;
  }

  const contentWrapper = document.createElement('template');
  const htmlContent = Mustache.render(homeDecorFurnitureMobileFlyoutLevel1Template, homeDecorFurnitureData);
  contentWrapper.innerHTML = htmlContent;

  utils.hideAllElements('#simplePanelLevel1 span, #simplePanelLevel1 div.SimpleFlyout__divider:nth-child(2)');
  document.getElementById('simplePanelLevel1')?.appendChild(contentWrapper.content);

  if (previousBackPanel[0] && previousBackPanel[0].childNodes && previousBackPanel[0].childNodes[2]) {
    previousBackPanel[0].childNodes[2].textContent = ' Main Menu';
  }

  privateMethods.showSimplePanel(1);
};

privateMethods.constructHomeServicesFlyoutLevel1 = function _constructHomeServicesFlyoutLevel1(event, response) {
  const panelTitle = event?.target?.textContent;
  const viewAllURL = event?.target?.getAttribute('href');

  homeServicesData = utils.extendObject(true, response);
  homeServicesData.hsflyout.name = panelTitle;
  homeServicesData.hsflyout.linkClassName = 'hs';
  homeServicesData.hsflyout.viewAllLink = viewAllURL;

  const htmlContent = Mustache.render(privateMethods.templates.diyAndHomeServicesLevel1, homeServicesData.hsflyout);
  const contentWrapper = document.createElement('template');
  contentWrapper.innerHTML = htmlContent;
  utils.hideAllElements('#simplePanelLevel1 span, #simplePanelLevel1 div.SimpleFlyout__divider:nth-child(2)');
  document.getElementById('simplePanelLevel1')?.appendChild(contentWrapper.content);
};

privateMethods.determineHomeDecorFurnitureSubnavHeader = function _determineHomeDecorFurnitureSubnavHeader() {
  const homeDecorFurnitureDataPromise = privateMethods.retrieveHomeDecorFurnitureData();

  const persistentSubnavTitleElement = document.querySelector('.SimpleFlyout__subnav__title');
  let persistentSubnavTitle = 'Home Decor, Furniture & Kitchenware';

  // This function does way too much!
  function doABunchOfThingsThatNeedToBeRefactoredButEventuallySetSubNavTitle(breadcrumbs) {
    if (breadcrumbs && breadcrumbs.length > 0 && homeDecorFurnitureData && homeDecorFurnitureData.aisles) {
      const breadcrumbNValues = [];

      breadcrumbs.forEach((breadcrumb) => {
        if (breadcrumb && breadcrumb.url) {
          const splitURL = breadcrumb.url.split('/');
          const breadcrumbNValue = splitURL.filter(part => part.indexOf('N-') !== -1)[0];
          if (breadcrumbNValue) {
            breadcrumbNValues.push(breadcrumbNValue);
          }
        }
      });

      const potentialAisles = [];
      const potentialBays = [];
      let shelfFound = false;
      let bayFound = false;
      let aisleFound = false;

      homeDecorFurnitureData.aisles.forEach((aisle) => {
        aisle.aisleBulleted = false;
        if (aisle && aisle.nValue && breadcrumbNValues.indexOf(aisle.nValue) !== -1) {
          potentialAisles.push(aisle);
        }
        aisle.bays && aisle.bays.forEach((bay) => {
          bay.bayBulleted = false;
          if (bay && bay.nValue && breadcrumbNValues.indexOf(bay.nValue) !== -1) {
            potentialBays.push(bay);
          }

          bay.shelves && bay.shelves.forEach((shelf) => {
            shelf.shelfBulleted = false;
          });

          bay.shelves && bay.shelves.forEach((shelf) => {
            if (!shelfFound && shelf && shelf.nValue && breadcrumbNValues.indexOf(shelf.nValue) !== -1) {
              aisle.aisleBulleted = true;
              bay.bayBulleted = true;
              shelf.shelfBulleted = true;

              persistentAisle = aisle;
              persistentBay = bay;
              persistentSubnavTitle = bay.name;

              aisleFound = true;
              bayFound = true;
              shelfFound = true;
            }
          });
        });
      });

      if (!shelfFound) {
        if (!bayFound && potentialBays.length >= 1) {
          potentialBays[0].bayBulleted = true;
          persistentSubnavTitle = potentialBays[0].name;
          persistentBay = potentialBays[0];
          bayFound = true;

          homeDecorFurnitureData.aisles.forEach((aisle) => {
            aisle.bays.forEach((bay) => {
              if (!aisleFound && bay.bayBulleted) {
                aisle.aisleBulleted = true;
                persistentAisle = aisle;
                aisleFound = true;
              }
            });
          });
        } else if (!aisleFound && potentialAisles.length >= 1) {
          potentialAisles[0].aisleBulleted = true;
          persistentSubnavTitle = potentialAisles[0].name;
          persistentAisle = potentialAisles[0];
          aisleFound = true;
        }
      }

      if (aisleFound || bayFound || shelfFound) {
        privateMethods.updateRecentlyViewedCategories(breadcrumbs[breadcrumbs.length - 1]);
      }
    }

    if (persistentSubnavTitleElement) {
      persistentSubnavTitleElement.textContent = persistentSubnavTitle;
    }
  }

  if (persistentSubnavTitleElement && utils.isEventBusAvailable()) {
    const EVENT_BUS = window.THD_EVENT_BUS || window.LIFE_CYCLE_EVENT_BUS;
    EVENT_BUS.lifeCycle.on('breadcrumbs.ready', (data) => {
      if (!data || !data.output) return;
      const breadcrumbs = data.output.crumbs;
      homeDecorFurnitureDataPromise.then(() => {
        doABunchOfThingsThatNeedToBeRefactoredButEventuallySetSubNavTitle(breadcrumbs);
      });
    });
    EVENT_BUS.on('@@HDHOME/PAGE_LOAD', (data) => {
      if (!data || !data.output) return;
      homeDecorFurnitureDataPromise.then(() => {
        const breadcrumbs = data.output.breadCrumbs ?
          data.output.breadCrumbs :
          data.output.response.breadCrumbs;
        doABunchOfThingsThatNeedToBeRefactoredButEventuallySetSubNavTitle(breadcrumbs);
      });
    });
  }

  if (persistentSubnavTitleElement) {
    persistentSubnavTitleElement.textContent = persistentSubnavTitle;
  }
};

privateMethods.diyHomeServicesHelper = function _diyHomeServicesHelper(allLinks, level1URL, level1Name) {
  if (allLinks && allLinks.length) {
    allLinks.filter((config, index) => config.title === level1Name && config.sublinks).map((currentLink) => {
      const htmlContent = Mustache.render(privateMethods.templates.diyAndHomeServicesLevel3, {
        sublinks: currentLink.sublinks,
        name: level1Name,
        viewAllLink: level1URL
      });
      utils.setInnerHtml('#simplePanelLevel2 .SimpleFlyout__container', htmlContent);
      privateMethods.showSimplePanel(2);
    });
  }
};

privateMethods.fetchAisle = function _fetchAisle(level) {
  let aisle;
  homeDecorFurnitureData.aisles.forEach((element) => {
    if ((element.name || '').toLowerCase() === level.toLowerCase()) {
      aisle = element;
    }
  });
  return aisle;
};

privateMethods.getNValue = function _getNValue(location) {
  if (location.link) {
    return location.link.split('/').filter(part => part.indexOf('N-') !== -1)[0];
  }
  return null;
};

privateMethods.getRecentlyViewedCategories = function _getRecentlyViewedCategories() {
  try {
    return JSON.parse(window.localStorage.getItem('HDF_RECENTLY_VIEWED_CATEGORIES'));
  } catch (e) {
    return null;
  }
};

privateMethods.handleMenuLevel4 = function _handleMenuLevel4() {

  if (privateData.homeDecorFurnitureSelectedLevels && privateData.homeDecorFurnitureSelectedLevels[0] === 'home decor and furniture') {
    privateData.homeDecorFurnitureSelectedLevels.push(this.textContent);
    privateMethods.logHomeDecorFurniturePath('header click');
  } else {
    const level1Name = privateData.selectedLevel1;
    const level2Name = privateData.selectedLevel2;

    privateMethods.logEventPath('header click', ['all departments', level1Name, level2Name, this.textContent]);
  }
};

privateMethods.interactWithSimpleMenuLink = function _interactWithSimpleMenuLink(event) {
  const flyoutID = event?.target?.dataset?.id;

  if (flyoutID) {
    event.preventDefault();

    switch (flyoutID) {
      case 'departmentsFlyout':
        privateMethods.showAllDepartmentsFlyout(event);
        break;

      case 'homeDecorFurniture':
        privateMethods.showHomeDecorFurnitureFlyout(event);
        break;

      case 'diyProjectsIdeas':
        privateMethods.showDIYProjectsIdeasFlyout(event);
        break;

      case 'homeServices':
        privateMethods.showHomeServicesFlyout(event);
        break;

      case 'specialOffers':
        privateMethods.showSpecialsFlyout(event);
        break;

      default:
        break;
    }
  }
};

privateMethods.logEventPath = function _logEventPath(type, pathArray) {
  pathArray.forEach((level, index) => {
    if (level && index) {
      pathArray[index] = level.replace('&', 'and').toLowerCase().trim();
    }
  });
  // Get header at the beginning, then join them all
  return headerAnalytics.logEvent(type, ['header'].concat(pathArray).join('>'));
};

privateMethods.logEventPathL3Link = function _logEventPathL3Link() {
  const l3LinkText = this.textContent.replace('&', 'and').toLowerCase()
    .trim();

  const checkLevelOne = l1Name && l1Name.toLowerCase().trim();
  if (checkLevelOne !== 'home decor and furniture' && checkLevelOne !== 'all departments' && l2Name) {
    privateMethods.logEventPath('header click', [l1Name, l2Name, l3LinkText]);
  }
};

privateMethods.logEventPathTaskLink = function _logEventPathTaskLink() {
  const taskLinkText = this.textContent.replace('&', 'and').toLowerCase()
    .trim();
  l1Name = taskLinkText;
  privateMethods.logEventPath('header click', [taskLinkText]);
};

privateMethods.logFeaturedBrandsClick = function _logFeaturedBrandsClick() {
  const analyticsPathArray = [];
  privateData.homeDecorFurnitureSelectedLevels.forEach((level) => {
    analyticsPathArray.push(level.replace('&', 'and').toLowerCase().trim());
  });

  analyticsPathArray.push('featured brands');

  const featuredBrand = this?.getAttribute('alt')
    ?.replace('&', 'and')
    .toLowerCase()
    .trim();

  if (featuredBrand && featuredBrand !== '') {
    analyticsPathArray.push(featuredBrand);
  }

  return headerAnalytics.logEvent('header click', ['header'].concat(analyticsPathArray).join('>'));
};


privateMethods.logHeaderImageClick = function _logHeaderImageClick() {
  const analyticsPathArray = [];
  privateData.homeDecorFurnitureSelectedLevels.forEach((level) => {
    analyticsPathArray.push(level.replace('&', 'and').toLowerCase().trim());
  });

  const headerImageTitle = analyticsPathArray[analyticsPathArray.length - 1];
  analyticsPathArray.push(`${headerImageTitle} image`);

  return headerAnalytics.logEvent('header click', ['header'].concat(analyticsPathArray).join('>'));
};

privateMethods.logHomeDecorFurniturePath = function _logHomeDecorFurniturePath(type) {
  const analyticsPathArray = [];
  privateData.homeDecorFurnitureSelectedLevels.forEach((level) => {
    analyticsPathArray.push(level.replace('&', 'and').toLowerCase().trim());
  });
  return headerAnalytics.logEvent(type, ['header'].concat(analyticsPathArray).join('>'));
};

privateMethods.logRecentlyViewedCategory = function _logRecentlyViewedCategory() {
  const analyticsPathArray = [];
  privateData.homeDecorFurnitureSelectedLevels.forEach((level) => {
    analyticsPathArray.push(level.replace('&', 'and').toLowerCase().trim());
  });

  analyticsPathArray.push('recently viewed');

  const recentlyViewedCategory = this.text.replace('&', 'and').toLowerCase().trim();
  analyticsPathArray.push(recentlyViewedCategory);

  return privateMethods.logEventPath('header click', analyticsPathArray);
};

privateMethods.logShopAllClick = function _logShopAllClick() {
  const analyticsPathArray = [];
  privateData.homeDecorFurnitureSelectedLevels.forEach((level) => {
    analyticsPathArray.push(level.replace('&', 'and').toLowerCase().trim());
  });

  const shopAllTitle = analyticsPathArray[analyticsPathArray.length - 1];
  analyticsPathArray.push(`${shopAllTitle} shop all`);

  return headerAnalytics.logEvent('header click', ['header'].concat(analyticsPathArray).join('>'));
};

privateMethods.notifyMenuState = function _notifyMenuState(state) {
  // Use a namespaced event, pass along the state
  // TODO: menuState seems to only be used by consumers,
  // need to be careful about refactoring this trigger.
  document.dispatchEvent(new CustomEvent('menuState',{
    detail: {isOpen: state, menu: 'simple'}
  }));
};

privateMethods.openDiyHsMenuLevel2 = function _openDiyHsMenuLevel2(event) {
  const level1URL = this?.getAttribute('href');
  const level1Name = this.textContent?.trim();
  const level1Class = this?.getAttribute('class');
  let allLinks;

  if (this?.dataset?.type !== 'direct') {
    event.preventDefault();
    event.stopPropagation();

    // if class is diy__link pass DIY Flyout data
    if (level1Class.indexOf('diy__link') !== -1) {
      allLinks = diyProjectsIdeasData.diyflyout?.links;
    } else if (level1Class.indexOf('hs__link') !== -1) {
      privateData.homeServicesSelectedLevels.push(level1Name);
      allLinks = homeServicesData.hsflyout?.links;
    }

    privateMethods.diyHomeServicesHelper(allLinks, level1URL, level1Name);
    l2Name = level1Name;
    if (!this.classList.contains('homedecor__link')) {
      privateMethods.logEventPath('header click', [l1Name, level1Name]);
    }
  } else {
    privateMethods.logEventPath('header click', [level1Name, event.target.textContent?.trim()]);
  }
};

privateMethods.openMenuToHomeDecorFurniture = function _openMenuToHomeDecorFurniture(event) {
  l1Name = 'home decor and furniture';
  utils.removeAllElements('.hdfMobile');

  privateMethods.toggleSimpleFlyout(event);
  let htmlContent;
  const previousBackPanel = document.querySelectorAll('.SimpleFlyout__back');

  if (previousBackPanel[0] && previousBackPanel[0].childNodes && previousBackPanel[0].childNodes[2]) {
    previousBackPanel[0].childNodes[2].textContent = ' Main Menu';
  }

  if (persistentAisle === null) {
    privateMethods.showHomeDecorFurnitureFlyout(event);
  } else {
    l2Name = persistentAisle.name;
    privateData.homeDecorFurnitureSelectedLevels.push(l1Name);
    privateData.homeDecorFurnitureSelectedLevels.push(persistentAisle.name);

    if (previousBackPanel[1] && previousBackPanel[1].childNodes && previousBackPanel[1].childNodes[2]) {
      previousBackPanel[1].childNodes[2].textContent = ' Home Decor, Furniture & Kitchenware';
    }

    homeDecorFurnitureData.name = 'Home Decor, Furniture & Kitchenware';

    homeDecorFurnitureRecentlyViewedCategories = privateMethods.getRecentlyViewedCategories();
    if (homeDecorFurnitureRecentlyViewedCategories !== null
      && homeDecorFurnitureRecentlyViewedCategories.length > 0) {
      homeDecorFurnitureData.hasCategories = true;
      homeDecorFurnitureData.categories = homeDecorFurnitureRecentlyViewedCategories;
    }

    const contentWrapper = document.createElement('template');
    htmlContent = Mustache.render(homeDecorFurnitureMobileFlyoutLevel1Template, homeDecorFurnitureData);
    contentWrapper.innerHTML = htmlContent;
    utils.hideAllElements('#simplePanelLevel1 ul, #simplePanelLevel1 span.SimpleFlyout__header');
    document.getElementById('simplePanelLevel1')?.appendChild(contentWrapper.content);

    htmlContent = Mustache.render(homeDecorFurnitureMobileFlyoutLevel2Template, persistentAisle);
    utils.setInnerHtml('#simplePanelLevel2 .SimpleFlyout__container', htmlContent);

    if (persistentBay === null) {
      privateMethods.showSimplePanel(2);
    } else {
      privateData.homeDecorFurnitureSelectedLevels.push(persistentBay.name);

      htmlContent = Mustache.render(homeDecorFurnitureMobileFlyoutLevel3Template, persistentBay);
      utils.setInnerHtml('#simplePanelLevel3 .SimpleFlyout__container', htmlContent);

      privateMethods.showSimplePanel(3);

      if (previousBackPanel[2] && previousBackPanel[2].childNodes && previousBackPanel[2].childNodes[2]) {
        previousBackPanel[2].childNodes[2].textContent = ` ${l2Name}`;
      }
    }
  }
};

privateMethods.openSimpleMenuLevel2 = function _openSimpleMenuLevel2(event) {
  let level1Name = this?.dataset?.name || this?.textContent;
  const previousBackPanel = document.querySelectorAll('.SimpleFlyout__back');

  event.preventDefault();

  let htmlContent;

  // Sets a standard analytics value for specials & offers flyout savings event
  if (this.closest('a[data-id]')?.dataset?.id === 'savingsEvent') {
    level1Name = 'special savings event';
  }

  if (this.classList.contains('hdfMobile')) {
    // Home Decor, Furniture & Kitchenware
    // At this moment, the user is on panel level 1 which displays all of the aisles

    privateData.homeDecorFurnitureSelectedLevels.push(level1Name);

    homeDecorFurnitureData.name = level1Name.trim();

    const aisle = privateMethods.fetchAisle(homeDecorFurnitureData.name);

    // If the aisle has bays, move to the next panel with bays
    // Else, redirect to the aisle page
    if (aisle.hasBays) {
      homeDecorFurnitureData.bays = aisle.bays;

      htmlContent = Mustache.render(homeDecorFurnitureMobileFlyoutLevel2Template, aisle);
      utils.setInnerHtml('#simplePanelLevel2 .SimpleFlyout__container', htmlContent);

      if (previousBackPanel[1] && previousBackPanel[1].childNodes && previousBackPanel[1].childNodes[2]) {
        previousBackPanel[1].childNodes[2].textContent = ' Home Decor, Furniture & Kitchenware';
      }

      privateMethods.showSimplePanel(2);
    } else {
      privateMethods.logHomeDecorFurniturePath('header click')
        .then(() => {
          // Go where we were going any way
          privateMethods.setLocation(aisle.link);
        });
    }
  } else {
    // All Departments
    const level1DataLevel = this?.dataset?.level;
    const level1URL = this?.getAttribute('href');

    let departmentName = 'all departments';
    if (this.classList.contains('SimpleFlyout__link-home-decor')) {
      departmentName = 'home decor and furniture';
    } else if (this.classList.contains('SimpleFlyout__link specialOffersFlyout__l3')) {
      departmentName = 'specials and offers';
    }

    privateData.selectedLevel1 = level1DataLevel;
    const requestLevel2Data = headerData.getLevel2Data(level1DataLevel);

    // If it worked
    requestLevel2Data
      .then((level2Data) => {
        htmlContent = Mustache.render(privateMethods.templates.simpleList, {
          links: level2Data,
          allLink: privateMethods.clearURL(level1URL),
          name: level1Name
        });

        utils.setInnerHtml('#simplePanelLevel2 .SimpleFlyout__container', htmlContent);

        if (previousBackPanel[1] && previousBackPanel[1].childNodes && previousBackPanel[1].childNodes[2]) {
          previousBackPanel[1].childNodes[2].textContent = ' Back';
        }

        privateMethods.showSimplePanel(2);
      }, (error) => {
        // If it failed
        // Go where we were going any way
        privateMethods.setLocation(level1URL);
      })
      .then(() => {
        privateMethods.logEventPath('header click', [departmentName, level1Name]);
      });
  }
};

privateMethods.openSimpleMenuLevel3 = function _openSimpleMenuLevel3(event) {
  const level1Name = privateData.selectedLevel1;
  const level2Name = this?.dataset?.name || this?.textContent?.trim();
  privateData.selectedLevel2 = level2Name;
  const previousBackPanel = document.querySelectorAll('.SimpleFlyout__back');

  // If this is not a direct link
  if (this?.dataset?.type !== 'direct') {
    event.preventDefault();

    let htmlContent;

    if (this.classList.contains('hdfMobile')) {
      // Home Decor, Furniture & Kitchenware
      const intermediateLevel = privateData.homeDecorFurnitureSelectedLevels.slice(-1)[0];
      privateData.homeDecorFurnitureSelectedLevels.push(level2Name);

      homeDecorFurnitureData.name = level2Name.trim();

      if (!homeDecorFurnitureData.bays) {
        const aisle = privateMethods.fetchAisle(intermediateLevel);
        if (aisle.hasBays) {
          homeDecorFurnitureData.bays = aisle.bays;
        }
      }

      let bay;
      homeDecorFurnitureData.bays.forEach((element) => {
        if (element.name === homeDecorFurnitureData.name) {
          bay = element;
        }
      });

      htmlContent = Mustache.render(homeDecorFurnitureMobileFlyoutLevel3Template, bay);
      utils.setInnerHtml('#simplePanelLevel3 .SimpleFlyout__container', htmlContent);

      if (previousBackPanel[2] && previousBackPanel[2].childNodes && previousBackPanel[2].childNodes[2]) {
        previousBackPanel[2].childNodes[2].textContent = ` ${intermediateLevel}`;
      }

      privateMethods.showSimplePanel(3);
    } else {
      // All Departments
      const level2URL = this?.getAttribute('href');

      // request the data
      const requestLevel3Data = headerData.getLevel3Data(level1Name, level2Name);

      // If it worked
      requestLevel3Data
        .then((level3Data) => {
          // render this thing
          htmlContent = Mustache.render(privateMethods.templates.simpleList, {
            links: level3Data,
            allLink: privateMethods.clearURL(level2URL),
            name: level2Name
          });

          // put it in the DOM
          utils.setInnerHtml('#simplePanelLevel3 .SimpleFlyout__container', htmlContent);

          if (previousBackPanel[2] && previousBackPanel[2].childNodes && previousBackPanel[2].childNodes[2]) {
            previousBackPanel[2].childNodes[2].textContent = ' Back';
          }

          // Show the panel
          privateMethods.showSimplePanel(3);
        }, (error) => {
          // If it failed - could be that the index doesn't exist, or that its got no results
          // Go where we were going any way
          privateMethods.setLocation(level2URL);
        })
        .then(() => {
          privateMethods.logEventPath('header click', ['all departments', level1Name, level2Name]);
        });
    }
  } else {
    // This is a direct link so log it now
    if (this?.classList?.contains('hdfMobile')) {
      let analyticsSelectedBay = level2Name;
      if (level2Name.trim() === '') {
        analyticsSelectedBay = this?.childNodes[1]?.alt
          ? `image ${this?.childNodes[1]?.alt}`
          : 'image';
      }
      privateData.homeDecorFurnitureSelectedLevels.push(analyticsSelectedBay);
      privateMethods.logHomeDecorFurniturePath('header click');
    } else if (privateData.homeServicesSelectedLevels && privateData.homeServicesSelectedLevels[0] === 'home services') {
      privateData.homeServicesSelectedLevels.push(level2Name);
    } else {
      privateMethods.logEventPath('header click', ['all departments', level1Name, level2Name]);
    }
  }
};

privateMethods.preventMaskClose = function _preventMaskClose(event) {
  event.stopPropagation();
};

privateMethods.removeB2XLinks = function _removeB2XLinks() {
  //TODO: remove this function and superfluos markup during b2x refactor
  if (thdcustomer.default.isB2XCustomer) {
    document.querySelector('#B2CRedirect')?.remove();
    document.querySelector('#MobiletaskLinkPro')?.remove();
    document.querySelector('#MobiletaskLinkFav')?.remove();
    document.querySelector('#headerOrderStatus')?.remove();
    document.querySelector('#MobileTasklinkList')?.classList.remove('u--hide');
    document.querySelector('#FavoritesLink')?.setAttribute('href', 'https://' + hfConfig.nonSecureHostName + '/b2b/account/view/list/summary');
  } else {
    document.querySelector('#B2XRedirect')?.remove();
    document.querySelector('#b2xheaderOrderStatus')?.remove();
    document.querySelector('#MobileTasklinkList')?.classList.remove('u--hide');
  }
};

privateMethods.renderL1Categories = function _renderL1Categories() {
  const requestLevel1Data = headerData.getLevel1Data();
  requestLevel1Data.then((level1Data) => {
    const htmlContent = Mustache.render(privateMethods.templates.level1Flyout, {
      l1: level1Data
    });
    utils.emptyElement('#simplePanelLevel1 ul.SimpleFlyout__list');
    utils.setInnerHtml('#simplePanelLevel1 ul.SimpleFlyout__list', htmlContent);
  });
};

privateMethods.retrieveHomeDecorFurnitureData = function _retrieveHomeDecorFurnitureData() {
  const jsonPath = '/hdus/en_US/DTCCOMNEW/fetch/homeDecorFurnitureMobileFlyout.json';
  const responseDataPromise = headerData.getEtchJSON(jsonPath);

  responseDataPromise.then((homeDecorFurnitureFlyoutData) => {
    privateMethods.setHomeDecorFurnitureData(homeDecorFurnitureFlyoutData);
  });

  return responseDataPromise;
};

privateMethods.setHomeDecorFurnitureData = function _setHomeDecorFurnitureData(homeDecorFurnitureFlyoutData) {
  homeDecorFurnitureRecentlyViewedCategories = privateMethods.getRecentlyViewedCategories();

  if (homeDecorFurnitureFlyoutData && homeDecorFurnitureFlyoutData.aisles) {
    homeDecorFurnitureFlyoutData.aisles.forEach((aisle) => {
      if (aisle.columns && aisle.columns.length !== 0) {
        aisle.nValue = privateMethods.getNValue(aisle);
        aisle.bays = [];

        aisle.columns.forEach((column) => {
          if (column.bays && column.bays.length !== 0) {
            column.bays.forEach((bay) => {
              bay.nValue = privateMethods.getNValue(bay);

              bay.hasShelves = bay.shelves && bay.shelves.length !== 0;
              if (bay.hasShelves) {
                bay.shelves.forEach((shelf) => {
                  shelf.nValue = privateMethods.getNValue(shelf);
                });

                bay.categories = homeDecorFurnitureRecentlyViewedCategories;
                if (bay.categories && bay.categories.length > 0) {
                  bay.hasCategories = true;
                  bay.shelves[bay.shelves.length - 1].seperator = true;
                }
              }

              aisle.bays.push(bay);
            });
          }
        });
      }
      if (aisle.name === 'Shop by Room') {
        aisle.bays.forEach((bay) => {
          bay.imageURL = null;
        });
      }
      aisle.hasBays = aisle.bays && aisle.bays.length !== 0;

      if (homeDecorFurnitureRecentlyViewedCategories !== null
        && homeDecorFurnitureRecentlyViewedCategories.length > 0
        && aisle.hasBays) {
        aisle.bays.push({
          bayBulleted: false,
          categories: homeDecorFurnitureRecentlyViewedCategories,
          grid: false,
          hasCategories: true,
          hasShelves: true,
          inline: true,
          name: 'Recently Viewed Categories',
          seperator: true
        });
      }
    });
  }

  homeDecorFurnitureData = homeDecorFurnitureFlyoutData;
};

privateMethods.setLocation = function _setLocation(url) {
  window.location.assign(url);
};

privateMethods.showAllDepartmentsFlyout = function _showAllDepartmentsFlyout(event) {
  // Do not redirect the user to href link
  if (event?.target?.dataset?.type !== 'direct') {
    event.preventDefault();
    utils.removeAllElements('.diyandhs');
    utils.removeAllElements('.hdfMobile');
    utils.removeAllElements('.specialsflyout');
    utils.showAllElements('#simplePanelLevel1 .SimpleFlyout__list');
    utils.showAllElements('#simplePanelLevel1 span, #simplePanelLevel1 div.SimpleFlyout__divider:nth-child(2)');

    const previousBackPanel = document.querySelectorAll('.SimpleFlyout__back');

    if (previousBackPanel[0] && previousBackPanel[0].childNodes && previousBackPanel[0].childNodes[2]) {
      previousBackPanel[0].childNodes[2].textContent = ' Back';
    }

    privateMethods.showSimplePanel(1);
    document.dispatchEvent(new Event('closeHeaderTooltips'));
  } else {
    // the below log event needs to be in an else block
    privateMethods.logEventPath('header click', ['all departments', event?.target?.textContent?.trim()]);
  }
};

privateMethods.showDIYProjectsIdeasFlyout = function _showDIYProjectsIdeasFlyout(event) {
  const jsonPath = '/hdus/en_US/DTCCOMNEW/fetch/diyflyout2.json';
  const level1Name = event?.target?.textContent;
  const panelTitle = event?.target?.textContent;
  const previousBackPanel = document.querySelectorAll('.SimpleFlyout__back');

  // do not redirect the user to href link
  if (event?.target?.dataset?.type !== 'direct') {
    event.preventDefault();
    utils.removeAllElements('.diyandhs');
    utils.removeAllElements('.hdfMobile');
    utils.hideAllElements('#simplePanelLevel1 .SimpleFlyout__list');

    // Only make a call if diyProjectsIdeasData is not available
    if (!diyProjectsIdeasData.hasOwnProperty('diyflyout')) {
      headerData.getEtchJSON(jsonPath)
        .then(privateMethods.constructDIYProjectsIdeasFlyoutLevel1.bind(null, event));
    } else {
      privateMethods.constructDIYProjectsIdeasFlyoutLevel1(event, diyProjectsIdeasData);
    }

    if (previousBackPanel) {
      if (previousBackPanel[0] && previousBackPanel[0].childNodes && previousBackPanel[0].childNodes[2]) {
        previousBackPanel[0].childNodes[2].textContent = ' Back';
      }
      if (previousBackPanel[1] && previousBackPanel[1].childNodes && previousBackPanel[1].childNodes[2]) {
        previousBackPanel[1].childNodes[2].textContent = ' Back';
      }
    }

    privateMethods.showSimplePanel(1);
    document.dispatchEvent(new Event('closeHeaderTooltips'));
  } else { // redirect the user to href link & log the details
    privateMethods.logEventPath('header click', [level1Name, panelTitle]);
  }
};

privateMethods.showHomeDecorFurnitureFlyout = function _showHomeDecorFurnitureFlyout(event) {
  privateData.homeDecorFurnitureSelectedLevels.push('home decor and furniture');

  // do not redirect the user to href link
  if (event?.target?.dataset?.type !== 'direct') {
    event.preventDefault();

    utils.removeAllElements('.hdfMobile');
    utils.hideAllElements('#simplePanelLevel1 .SimpleFlyout__list');

    // Only make a call if aisles is not available
    if (!homeDecorFurnitureData.hasOwnProperty('aisles')) {
      const flyoutDataRetrieved = privateMethods.retrieveHomeDecorFurnitureData();

      flyoutDataRetrieved.then(() => {
        // homeDecorFurnitureData is a global variable that was set in retrieveHomeDecorFurnitureData()
        privateMethods.constructHomeDecorFurnitureFlyoutLevel1(event, homeDecorFurnitureData);
      });

      document.dispatchEvent(new Event('closeHeaderTooltips'));
    } else {
      privateMethods.constructHomeDecorFurnitureFlyoutLevel1(event, homeDecorFurnitureData);
      document.dispatchEvent(new Event('closeHeaderTooltips'));
    }
  } else { // redirect the user to href link & log the details
    const panelTitle = event?.target?.textContent;
    privateMethods.logEventPath('header click', [panelTitle]);
  }
};

privateMethods.showHomeServicesFlyout = function _showHomeServicesFlyout(event) {
  privateData.homeServicesSelectedLevels.push('home services');

  const jsonPath = '/hdus/en_US/DTCCOMNEW/fetch/hsflyout.json';
  const level1Name = event?.target?.textContent;
  const panelTitle = event?.target?.textContent;
  const previousBackPanel = document.querySelectorAll('.SimpleFlyout__back');

  // Do not redirect the user to href link
  if (event?.target?.dataset?.type !== 'direct') {
    event.preventDefault();
    utils.removeAllElements('.diyandhs');
    utils.removeAllElements('.hdfMobile');
    utils.hideAllElements('#simplePanelLevel1 .SimpleFlyout__list');

    // Only make a call if homeServicesData is not available
    if (!homeServicesData.hasOwnProperty('hsFlyout')) {
      headerData.getEtchJSON(jsonPath)
        .then(privateMethods.constructHomeServicesFlyoutLevel1.bind(null, event));
    } else {
      privateMethods.constructHomeServicesFlyoutLevel1(event, homeServicesData);
    }

    if (previousBackPanel) {
      if (previousBackPanel[0] && previousBackPanel[0].childNodes && previousBackPanel[0].childNodes[2]) {
        previousBackPanel[0].childNodes[2].textContent = ' Back';
      }
      if (previousBackPanel[1] && previousBackPanel[1].childNodes && previousBackPanel[1].childNodes[2]) {
        previousBackPanel[1].childNodes[2].textContent = ' Back';
      }
    }

    privateMethods.showSimplePanel(1);
    document.dispatchEvent(new Event('closeHeaderTooltips'));
  } else { // redirect the user to href link & log the details
    privateMethods.logEventPath('header click', [level1Name, panelTitle]);
  }
};

privateMethods.showSimpleFlyout = function _showSimpleFlyout(event, open) {
  if (event?.detail?.hasOwnProperty('open')) {
    open = event.detail.open;
  }
  const menuShown = (typeof open === 'undefined') ? true : open;
  // element selector for mobile flyout menu
  const menuElement = document.querySelector('#simpleFlyout');

  privateMethods.notifyMenuState(menuShown);
  // toggle the menu state
  document.getElementById('simpleFlyout')?.classList?.toggle('SimpleFlyout--closed', !menuShown);
  // Toggle the button state... its complicated
  utils.toggleClassForAll('#simpleMenuButton .SimpleMenu__close', 'SimpleMenu__close--open', menuShown);
  utils.toggleClassForAll('#simpleMenuButton .SimpleMenu__menu', 'SimpleMenu__menu--closed', menuShown)

  // reset the panel to the beginning
  privateData.homeDecorFurnitureSelectedLevels = [];
  privateData.homeServicesSelectedLevels = [];
  privateMethods.showSimplePanel(0);
  headerMask.show();

  let overlayElement = document.querySelector('.SimpleFlyout__overlay');

  if (menuShown) {
    const top = parseInt(window.getComputedStyle(document.querySelector('.SimpleFlyout__overlay')).getPropertyValue('top'), 10);
    // TODO: not sure about this
    const scrollTop = window.scrollY;
    const offset = document.querySelector('.Header3')?.offsetTop;
    // close the tooltips in case they are open
    document.dispatchEvent(new Event('closeHeaderTooltips'));
    document.dispatchEvent(new Event('closeAllMenus'));
    // show the masking layer if appropriate
    document.dispatchEvent(new CustomEvent('headerMask-show', {detail: {open: menuShown}}));
    // disable body scroll when mobile menu is open
    if (document.querySelector('.SimpleFlyout__overlay').style) {
      document.querySelector('.SimpleFlyout__overlay').style.top = `${top - scrollTop + offset}px`;
    }
    document.getElementById('simpleFlyout')?.classList?.add('SimpleFlyout--open');
    bodyScrollLock.disableBodyScroll(menuElement);
  } else {
    document.dispatchEvent(new CustomEvent('headerMask-show', {detail: {open: menuShown}}));
    // enable body scroll when mobile menu is closed
    document.getElementById('simpleFlyout')?.classList?.remove('SimpleFlyout--open');
    if (document.querySelector('.SimpleFlyout__overlay')?.style) {
      document.querySelector('.SimpleFlyout__overlay').style.top = '';
    }
    bodyScrollLock.enableBodyScroll(menuElement);
  }
};

privateMethods.showSimplePanel = function _showSimplePanel(level) {
  const simpleFlyout = document.getElementById('simpleFlyout');
  const thisLevel = parseInt(level, 10);

  utils.toggleClassForAll('#simpleFlyout .SimpleFlyout__wrapper', 'SimpleFlyout__wrapper--level1', (thisLevel === 1));
  utils.toggleClassForAll('#simpleFlyout .SimpleFlyout__wrapper', 'SimpleFlyout__wrapper--level2', (thisLevel === 2));
  utils.toggleClassForAll('#simpleFlyout .SimpleFlyout__wrapper', 'SimpleFlyout__wrapper--level3', (thisLevel === 3));
  // TODO: not sure about this
  if (simpleFlyout) simpleFlyout.scrollTop = 0;
};

privateMethods.simpleMenuBack = function _simpleMenuBack(event) {
  if (event && event.type === 'touchend') {
    // Prevent default to stop click firing for touch events
    event.preventDefault();
  }

  privateData.homeDecorFurnitureSelectedLevels.pop();

  // strangely, event is explicitly needed for FF but not for others...
  privateMethods.showSimplePanel(event?.target?.dataset?.level);
};

privateMethods.toggleSimpleFlyout = function _toggleSimpleFlyout(event) {
  const simpleMenu = document.querySelector('#simpleFlyout');
  // TODO: this seems bananas. the !! means that it's open if it has the closed class.
  const simpleMenuOpen = !(!simpleMenu?.classList?.contains('SimpleFlyout--closed'));

  event.preventDefault();
  event.stopPropagation();

  document.dispatchEvent(new CustomEvent('toggleMyAccountDrawer', {detail:{open:false}}))
  privateMethods.showSimpleFlyout(event, simpleMenuOpen);
};

privateMethods.updateRecentlyViewedCategories = function _updateRecentlyViewedCategories(breadcrumb) {
  let recentlyViewedCategories = privateMethods.getRecentlyViewedCategories();

  if (recentlyViewedCategories === null) {
    recentlyViewedCategories = [];
    recentlyViewedCategories.unshift({
      name: breadcrumb.name || breadcrumb.label,
      url: breadcrumb.url
    });
  } else {
    let categoryFound = false;
    recentlyViewedCategories.forEach((category) => {
      if (category.name === breadcrumb.name
        || category.name === breadcrumb.label
        || category.url === breadcrumb.url) {
        categoryFound = true;
      }
    });

    if (!categoryFound) {
      if (recentlyViewedCategories.length === 5) {
        recentlyViewedCategories.pop();
      }
      recentlyViewedCategories.unshift({
        name: breadcrumb.name || breadcrumb.label,
        url: breadcrumb.url
      });
    }
  }

  window.localStorage.setItem('HDF_RECENTLY_VIEWED_CATEGORIES', JSON.stringify(recentlyViewedCategories));
};

// Specials and offers flyout modules

privateMethods.setSpecialsOffersData = function _setSpecialsOffersData(data) {
  specialsOffersData = data;
};

privateMethods.getSpecialsOffersData = function _getSpecialsOffersData() {
  return specialsOffersData;
};

privateMethods.constructSpecialsFlyoutLevel1 = function _constructSpecialsFlyoutLevel1(event) {
  const panelTitle = event?.target?.textContent;
  const { specialsflyout } = specialsOffersData;

  specialsflyout.linkClassName = 'specials';
  specialsflyout.name = panelTitle;

  const htmlContent = Mustache.render(simpleflyoutLevel1Template, specialsflyout);
  const contentWrapper = document.createElement('template');
  contentWrapper.innerHTML = htmlContent;
  utils.hideAllElements('#simplePanelLevel1 span, #simplePanelLevel1 div.SimpleFlyout__divider:nth-child(2)');
  document.getElementById('simplePanelLevel1')?.appendChild(contentWrapper.content);
};

privateMethods.showSpecialsFlyout = function _showSpecialsFlyout(event) {
  privateData.specialsSelectedLevels.push('specials offers');

  const level1Name = event?.target?.textContent;
  const panelTitle = event?.target?.textContent;
  const previousBackPanel = document.querySelectorAll('.SimpleFlyout__back');

  // Do not redirect the user to href link
  if (event?.target?.dataset?.type !== 'direct') {
    event?.preventDefault();
    utils.removeAllElements('.specialsflyout');
    utils.removeAllElements('.hdfMobile');
    utils.hideAllElements(' #simplePanelLevel1 .SimpleFlyout__list');


    // Only make a call if specialsOffersData is not available
    if (!specialsOffersData.specialsflyout) {
      specialsFlyout.getFlyoutData((flyoutData) => {
        specialsOffersData = flyoutData;

        privateMethods.constructSpecialsFlyoutLevel1(event, specialsOffersData);
      });
    } else {
      privateMethods.constructSpecialsFlyoutLevel1(event, specialsOffersData);
    }
    (previousBackPanel[0]?.childNodes[2] || '').textContent = ' Back';
    (previousBackPanel[1]?.childNodes[2] || '').textContent = ' Back';
    privateMethods.showSimplePanel(1);
    document.dispatchEvent(new Event('closeHeaderTooltips'));
  } else { // redirect the user to href link & log the details
    privateMethods.logEventPath('header click', [level1Name, panelTitle]);
  }
};

// bind to all the necessary elements
privateMethods.initialize = function initialize() {
  privateMethods.removeB2XLinks();

  privateMethods.determineHomeDecorFurnitureSubnavHeader();
  const events = ['click', 'touchend'];

  utils.delegateListeners(events, '#simpleFlyout', privateMethods.preventMaskClose);
  utils.delegateListeners(events, '#simpleFlyout .SimpleFlyout__back', privateMethods.simpleMenuBack);
  utils.delegateListeners(events, '#simpleMenuButton', privateMethods.toggleSimpleFlyout);
  utils.delegateListeners(events, '#simplePanelLevel2 .SimpleFlyout__header', privateMethods.capturePath);
  utils.delegateListeners(events, '#simplePanelLevel3 .SimpleFlyout__header', privateMethods.capturePath);
  utils.delegateListeners(events, '.SimpleFlyout__subnav', privateMethods.openMenuToHomeDecorFurniture);
  utils.delegateListeners(['click'], '#diyhslevel2 .hs__link', privateMethods.openDiyHsMenuLevel2);
  utils.delegateListeners(['click'], '#diyhslevel2 .diy__link', privateMethods.openDiyHsMenuLevel2);
  utils.delegateListeners(['click'], '#simplePanelLevel1 .SimpleFlyout__link', privateMethods.openSimpleMenuLevel2);
  utils.delegateListeners(['click'], '#simplePanelLevel1 .SimpleFlyout__link--homeDecorFurniture', privateMethods.openSimpleMenuLevel2);
  utils.delegateListeners(['click'], '#simplePanelLevel2 .SimpleFlyout__link', privateMethods.openSimpleMenuLevel3);
  utils.delegateListeners(['click'], '#simplePanelLevel2 .SimpleFlyout__link--homeDecorFurniture', privateMethods.openSimpleMenuLevel3);
  utils.delegateListeners(['click'], '#simplePanelLevel2 .SimpleFlyout__imageDescription', privateMethods.openSimpleMenuLevel3);
  utils.delegateListeners(['click'], '#simplePanelLevel2 .SimpleFlyout__container .SimpleFlyout__list li.SimpleFlyout__listItem a.SimpleFlyout__link', privateMethods.logEventPathL3Link);
  utils.delegateListeners(['click'], '#simplePanelLevel3 .SimpleFlyout__link', privateMethods.handleMenuLevel4);
  utils.delegateListeners(['click'], '#simplePanelLevel3 .SimpleFlyout__link--homeDecorFurniture', privateMethods.handleMenuLevel4);
  utils.delegateListeners(['click'], '#simplePanelMain', privateMethods.interactWithSimpleMenuLink);
  utils.delegateListeners(['click'], '#simplePanelMain .SimpleFlyout__list li.SimpleFlyout__listItem a.SimpleFlyout__link', privateMethods.logEventPathTaskLink);
  utils.delegateListeners(['click'], '.SimpleFlyout__listItem__grid--col', privateMethods.logFeaturedBrandsClick);
  utils.delegateListeners(['click'], '.SimpleFlyout__headerImage', privateMethods.logHeaderImageClick);
  utils.delegateListeners(['click'], '.SimpleFlyout__shop', privateMethods.logShopAllClick);
  utils.delegateListeners(['click'], '.SimpleFlyout__listItem__recentlyViewedCategories--category', privateMethods.logRecentlyViewedCategory);
  document.addEventListener('searchState', privateMethods.closeOnSearchOpen);
  document.addEventListener('showSimpleFlyout', privateMethods.showSimpleFlyout);
};

/*
  * Public Methods
  */

flyout.init = function init() {
  // Do it before ready - cause we rock
  privateMethods.initialize();

  // Start loading the data now
  headerData.init();

  // Render the L1 Categories
  if (hfConfig.flyoutVersion === '8') {
    privateMethods.renderL1Categories();
  }

  return this;
};

flyout.getPrivateMethods = function getPrivateMethods() {
  return privateMethods;
};

export default flyout;
