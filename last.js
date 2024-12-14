// Default state
const mainConsentBanner = document.querySelector(".consent-banner-wrapper");
const miniConsentBanner = document.querySelector(".miniConsentBanner");

function consentBanner(showMain, showMini) {
  mainConsentBanner.style.display = showMain ? "block" : "none";
  miniConsentBanner.style.display = showMini ? "block" : "none";
}

// Retrieve cookie info and update display
const checkUserType = localStorage.getItem("mrCookieState");
const getAllToggle = document.querySelector(
  ".cookie-detail-headline .cookie-toggle input"
);
const cookieCategoryName = document.querySelector(
  ".cookie-detail-headline .cookieCatagory"
).textContent;

// Open main banner on mini banner click
miniConsentBanner.onclick = () => {
  consentBanner(true, false);

  const inputState = JSON.parse(localStorage.getItem("inputState")) || {};
  const cookieToggle = document.querySelectorAll(".cookie-toggle input");

  if (inputState) {
    if (inputState.analytics) cookieToggle[2].checked = true;
    if (inputState.marketing) cookieToggle[3].checked = true;
    if (inputState.preferences) cookieToggle[1].checked = true;
    if (inputState.necessary) cookieToggle[0].checked = true;
  }
};

// Default cookie state
const defaultState = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
  functionality_storage: "granted",
  personalization_storage: "granted",
  security_storage: "granted",
};

// Check first visit and update consent banner
function firstVisitConsent() {
  if (checkUserType === "true") {
    const userConsent = JSON.parse(localStorage.getItem("cookieState"));
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag("consent", "default", defaultState);
    consentBanner(false, true);

    const inputState = JSON.parse(localStorage.getItem("inputState")) || {};

    if (inputState.marketing) {
      userConsent.ad_storage = "granted";
      userConsent.ad_personalization = "granted";
      userConsent.ad_user_data = "granted";
    } else if (inputState.analytics) {
      userConsent.analytics_storage = "granted";
    } else if (inputState.preferences) {
      userConsent.functionality_storage = "granted";
      userConsent.personalization_storage = "granted";
    }

    gtag("consent", "update", userConsent);

    window.dataLayer.push({
      event: "consent_page_view",
      consent: userConsent,
    });
  } else if (!checkUserType) {
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag("consent", "default", defaultState);
    consentBanner(true, false);
  }
}
firstVisitConsent();

// Accept all cookies
const acceptConsentButton = document.getElementById("acceptConsentButton");
acceptConsentButton.onclick = () => {
  document
    .querySelectorAll(".section-content")
    .forEach((element) => (element.style.display = "none"));
  consentSection.style.display = "block";
  document.getElementById("preferenceConsentButton").innerText = "Cookie Settings ";
  // document.getElementsByClassName(
  //   "consent-content-area"
  // )[0].style.flexDirection = "row";
  if (window.innerWidth < 885) {
    document.getElementsByClassName(
      "consent-content-area"
    )[0].style.flexDirection = "column";
  } else {
    document.getElementsByClassName(
      "consent-content-area"
    )[0].style.flexDirection = "row";
  }

  const acceptAll = {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
    functionality_storage: "granted",
    personalization_storage: "granted",
    security_storage: "granted",
  };

  const inputArray = {
    necessary: true,
    preferences: true,
    analytics: true,
    marketing: true,
  };

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }

  gtag("consent", "update", acceptAll);

  window.dataLayer.push({
    event: "consent_update",
    consent: acceptAll,
  });

  consentBanner(false, true);

  localStorage.setItem("mrCookieState", true);
  localStorage.setItem("cookieState", JSON.stringify(acceptAll));
  localStorage.setItem("inputState", JSON.stringify(inputArray));

  const cookieToggle = document.querySelectorAll(".cookie-toggle input");
  cookieToggle.forEach((toggle, index) => {
    if (index > 0) toggle.checked = true;
  });
};

// Reject all cookies
const rejectConsentButton = document.getElementById("rejectConsentButton");
rejectConsentButton.onclick = () => {
  const deniedAll = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
  };

  const inputArray = {
    necessary: false,
    preferences: false,
    analytics: false,
    marketing: false,
  };

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }

  gtag("consent", "update", deniedAll);

  window.dataLayer.push({
    event: "consent_update",
    consent: deniedAll,
  });

  consentBanner(false, true);

  localStorage.setItem("mrCookieState", true);
  localStorage.setItem("cookieState", JSON.stringify(deniedAll));
  localStorage.setItem("inputState", JSON.stringify(inputArray));

  const cookieToggle = document.querySelectorAll(".cookie-toggle input");
  cookieToggle.forEach((toggle, index) => {
    if (index > 0) toggle.checked = false;
  });
};

// Preference consent button logic
const preferenceConsentButton = document.getElementById(
  "preferenceConsentButton"
);
preferenceConsentButton.onclick = () => {
  const navItems = document.querySelectorAll(".nav-item");
  const detailsSec = document.getElementById("detailsSection");
  const allSections = document.querySelectorAll(".section-content");
  const prefBtn = document.getElementById("preferenceConsentButton");

  document.getElementsByClassName(
    "consent-content-area"
  )[0].style.flexDirection = "column";

  if (detailsSec.style.display === "none") {
    allSections.forEach((element, index) => {
      navItems[index].style.borderBottom = "none";
      element.style.display = "none";

      navItems[1].style.borderBottom = "2px solid #3771ce";
      allSections[1].style.display = "block";
      prefBtn.innerText = "Save";
    });
  } else {
    document
      .querySelectorAll(".section-content")
      .forEach((element) => (element.style.display = "none"));
    consentSection.style.display = "block";
    prefBtn.innerText = "PREFERENCES";

    // if width is less than 450px then change the flex direction to column
    if (window.innerWidth < 885) {
      document.getElementsByClassName(
        "consent-content-area"
      )[0].style.flexDirection = "column";
    } else {
      document.getElementsByClassName(
        "consent-content-area"
      )[0].style.flexDirection = "row";
    }

    const consentCustom = {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted",
    };

    const inputArray = {
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
    };

    const inputKeys = Object.keys(inputArray);
    const consentCustomKeys = Object.keys(consentCustom);

    const cookieToggle = document.querySelectorAll(".cookie-toggle input");
    cookieToggle.forEach((toggle, i) => {
      inputArray[inputKeys[i]] = toggle.checked;
    });

    if (inputArray.marketing) {
      consentCustom.ad_storage = "granted";
      consentCustom.ad_personalization = "granted";
      consentCustom.ad_user_data = "granted";
    } else if (inputArray.analytics) {
      consentCustom.analytics_storage = "granted";
    } else if (inputArray.preferences) {
      consentCustom.functionality_storage = "granted";
      consentCustom.personalization_storage = "granted";
    }

    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag("consent", "update", consentCustom);

    window.dataLayer.push({
      event: "consent_update",
      consent: consentCustom,
    });

    consentBanner(false, true);

    localStorage.setItem("mrCookieState", true);
    localStorage.setItem("cookieState", JSON.stringify(consentCustom));
    localStorage.setItem("inputState", JSON.stringify(inputArray));
  }
};

// Matching cookies with the database and website
const matchedCookies = [
  /* ... your matched cookies data ... */
];

const necessaryCookies = {};
const preferencesCookies = {};
const analyticsCookies = {};
const marketingCookies = {};

// Update each cookie category
function matchingCookies() {
  matchedCookies.forEach((element) => {
    const platform = element.platform;

    if (!allCookies[platform]) allCookies[platform] = [];
    allCookies[platform].push(element);

    const categoryMap = {
      Functional: necessaryCookies,
      Preferences: preferencesCookies,
      Analytics: analyticsCookies,
      Marketing: marketingCookies,
    };

    const category = categoryMap[element.category] || {};
    if (!category[platform]) category[platform] = [];
    category[platform].push(element);
  });
}

// Render cookies
function renderCookies(section, elements, data) {
  if (Object.keys(data).length < 1) {
    elements.push(`
      <div class="cookies">
        <p class="consent-descriptions">No cookie to display</p>
      </div>
    `);
  } else {
    for (const platform in data) {
      const platformCookies = data[platform].length;
      elements.push(`
        <div class="cookies">
          <div class="cookie-provider">
            <div>
              <span class="cookie-provider-headline consent-headlines">${platform}</span>
              <div class="totalCookiesWrapper">
              <span class="totalCookies">${platformCookies}</span>
              </div>
            </div>
            <div>
              <span class="material-symbols-outlined cookieProvideIcon">expand_more</span>
            </div>
          </div>
    
          <div class="cookie-learn-more-wrapper">
            <span class="cookie-learn-more"><a target="_blank" href="${data[platform][0].privary_rights_portals}">Learn More about the provider</a></span>
            <span class="material-symbols-outlined">open_in_new</span>
          </div>
      `);

      data[platform].forEach((cookieObject) => {
        elements.push(`
          <div class="actual-cookie-wrapper" style="display:none">
            <div>
              <span class="consent-headlines">${cookieObject.data_key}</span>
            </div>
            <div>
              <span class="consent-descriptions">${cookieObject.description}</span>
            </div>
            <div class="hr-making"></div>
            <div>
              <span class="consent-headlines">Expiry:</span>
              <span class="consent-descriptions">${cookieObject.retention_period}</span>
            </div>
            <div>
              <span class="consent-headlines">Type:</span>
              <span class="consent-descriptions">HTTP</span>
            </div>
          </div>
        `);
      });

      elements.push(`</div>`);
    }
  }

  section.innerHTML += elements.join("");
}

function updateCookies() {
  renderCookies(getNecessarySection, necessaryElements, necessaryCookies);
  renderCookies(getPreferencesSection, preferencesElements, preferencesCookies);
  renderCookies(getAnalyticsSection, analyticsElements, analyticsCookies);
  renderCookies(getMarketingSection, marketingElements, marketingCookies);

  document.getElementById("totalNecessaryCookies").textContent =
    Object.keys(necessaryCookies).length;
  document.getElementById("totalPreferencesCookies").textContent =
    Object.keys(preferencesCookies).length;
  document.getElementById("totalAnalyticsCookies").textContent =
    Object.keys(analyticsCookies).length;
  document.getElementById("totalMarketingCookies").textContent =
    Object.keys(marketingCookies).length;
}

// General code for handling UI interactions
function generalCode() {
  const cookieCategory = document.querySelectorAll(".cookieCatagory");
  const cookies = document.querySelectorAll(".all-cookies");
  const categoryIcon = document.querySelectorAll(".catagoryIcon");

  cookieCategory.forEach((category, i) => {
    category.onclick = () => {
      cookies[i].style.display =
        cookies[i].style.display === "none" ? "block" : "none";
      categoryIcon[i].style.transform =
        categoryIcon[i].style.transform === "rotate(180deg)"
          ? "rotate(360deg)"
          : "rotate(180deg)";
    };
  });

  const cookieProviderHeadlines = document.querySelectorAll(
    ".cookies .cookie-provider"
  );
  const cookieProvideIcons = document.querySelectorAll(".cookieProvideIcon");

  cookieProvideIcons.forEach((icon) => {
    icon.style.transform = "rotate(360deg)";
  });

  cookieProviderHeadlines.forEach((headline, index) => {
    headline.onclick = () => {
      const actualCookieWrappers = headline
        .closest(".cookies")
        .querySelectorAll(".actual-cookie-wrapper");
      actualCookieWrappers.forEach((wrapper) => {
        wrapper.style.display =
          wrapper.style.display === "none" ? "flex" : "none";
      });

      const cookieProvideIcon = cookieProvideIcons[index];
      cookieProvideIcon.style.transform =
        cookieProvideIcon.style.transform === "rotate(360deg)"
          ? "rotate(180deg)"
          : "rotate(360deg)";
    };
  });

  const navItems = document.querySelectorAll(".nav-item");
  const contentSections = document.querySelectorAll(".section-content");
  const prefBtn = document.getElementById("preferenceConsentButton");

  navItems.forEach((item, index) => {
    item.onclick = () => {
      contentSections.forEach((section, idx) => {
        section.style.display = "none";
        navItems[idx].style.borderBottom = "none";
      });

      prefBtn.innerText = "PREFERENCE";
      if (contentSections[index])
        contentSections[index].style.display = "block";
      item.style.borderBottom = "2px solid #3771ce";
    };
  });
}

matchingCookies();
updateCookies();
generalCode();
