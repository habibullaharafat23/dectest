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
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "denied",
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
  document.getElementById("preferenceConsentButton").innerText = "Cookie Instellingen";
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
// Matching cookies with the database and website
const matchedCookies = [
  /* ... your matched cookies data ... */

  {
    "id": "fbp",
    "platform": "Facebook",
    "category": "Marketing",
    "data_key": "_fbp",
    "domain": "https://ai-pioneers.nl/",
    "description": "Používáno Facebookem k doručování řady reklamních produktů, jako je real-time bidding od třetích stran",
    "retention_period": "3 months",
    "data_controller": "Facebook",
    "privary_rights_portals": "https://www.facebook.com/about/privacy/",
    "wildcard_match": 0
},
{
    "id": "fbc",
    "platform": "Facebook",
    "category": "Marketing",
    "data_key": "_fbc",
    "domain": "https://ai-pioneers.nl/",
    "description": "Používáno Facebookem k doručování řady reklamních produktů, jako je real-time bidding od třetích stran",
    "retention_period": "3 months",
    "data_controller": "Facebook",
    "privary_rights_portals": "https://www.facebook.com/about/privacy/",
    "wildcard_match": 0
},
{
    "id": "ga",
    "platform": "Google",
    "category": "Analytics",
    "data_key": "_ga *",
    "domain": "https://ai-pioneers.nl/",
    "description": "Primární cookie používaná Google Analytics k rozlišení jednoho návštěvníka od druhého",
    "retention_period": "1 month",
    "data_controller": "Google",
    "privary_rights_portals": "https://policies.google.com/privacy?hl=en-US",
    "wildcard_match": 0
},
{
    "id": "gcl-au",
    "platform": "Google",
    "category": "Marketing",
    "data_key": "_gcl_au",
    "domain": "https://ai-pioneers.nl/",
    "description": "Pro uložení a sledování konverzí.",
    "retention_period": "3 months",
    "data_controller": "Google",
    "privary_rights_portals": "https://policies.google.com/privacy?hl=en-US",
    "wildcard_match": 0
},
{
    "id": "ga",
    "platform": "Google",
    "category": "Analytics",
    "data_key": "_ga_*",
    "domain": "https://ai-pioneers.nl/",
    "description": "Pro uložení a počítání zobrazení stránek.",
    "retention_period": "1 year",
    "data_controller": "Google",
    "privary_rights_portals": "https://policies.google.com/privacy",
    "wildcard_match": 0
},
{
  "id": "ga",
  "platform": "Google",
  "category": "Analytics",
  "data_key": "_gid*",
  "domain": "https://ai-pioneers.nl/",
  "description": "Ukládat a počítat zobrazení stránek.",
  "retention_period": "1 day",
  "data_controller": "Google",
  "privary_rights_portals": "https://policies.google.com/privacy",
  "wildcard_match": 0
},
  {
      "id": "wordpress-logged-in",
      "platform": "WordPress",
      "category": "Functional",
      "data_key": "wordpress_logged_in_*",
      "domain": "https://ai-pioneers.nl/",
      "description": "Ukládat přihlášené uživatele.",
      "retention_period": "1 months",
      "data_controller": "WordPress",
      "privary_rights_portals": "https://wordpress.org/about/privacy/",
      "wildcard_match": 0
  },
  {
      "id": "wordpress-sec",
      "platform": "WordPress",
      "category": "Functional",
      "data_key": "wordpress_sec_*",
      "domain": "https://ai-pioneers.nl/",
      "description":"Pro zajištění ochrany proti hackerům uchovávejte údaje o účtu.",
      "retention_period": "15 days",
      "data_controller": "WordPress",
      "privary_rights_portals": "https://wordpress.org/about/privacy/",
      "wildcard_match": 0
  },
  {
      "id": "wordpress-test-cookie",
      "platform": "WordPress",
      "category": "Functional",
      "data_key": "wordpress_test_cookie",
      "domain": "https://ai-pioneers.nl/",
      "description": "Poskytnout ochranu proti hackerům, uložit údaje účtu.",
      "retention_period": "Session",
      "data_controller": "WordPress",
      "privary_rights_portals": "https://wordpress.org/about/privacy/",
      "wildcard_match": 0
  },
  {
      "id": "wp-settings",
      "platform": "WordPress",
      "category": "Functional",
      "data_key": "wp-settings-*",
      "domain": "https://ai-pioneers.nl/",
      "description": "ukládat uživatelské preference.",
      "retention_period": "Persistent",
      "data_controller": "WordPress",
      "privary_rights_portals": "https://wordpress.org/about/privacy/",
      "wildcard_match": 0
  },
  {
      "id": "wp-settings",
      "platform": "WordPress",
      "category": "Functional",
      "data_key": "wp-settings-*",
      "domain": "https://ai-pioneers.nl/",
      "description": "ukládat uživatelské preference.",
      "retention_period": "1 year",
      "data_controller": "WordPress",
      "privary_rights_portals": "https://wordpress.org/about/privacy/",
      "wildcard_match": 0
  },
  {
    "id": "MUID",
    "platform": "Microsoft Clarity",
    "category": "Marketing",
    "data_key": "MUID",
    "domain": "https://ai-pioneers.nl/",
    "description": "Ukládejte a sledujte návštěvy různých webových stránek.",
    "retention_period": "1 year",
    "data_controller": "Microsoft Clarity",
    "privary_rights_portals": "https://privacy.microsoft.com/en-us/privacystatement",
    "wildcard_match": 0
},
{
  "id": "clck",
  "platform": "Microsoft Clarity",
  "category": "Marketing",
  "data_key": "_clck",
  "domain": "https://ai-pioneers.nl/",
  "description": "Uložit jedinečné ID uživatele.",
  "retention_period": "1 year",
  "data_controller": "Microsoft Clarity",
  "privary_rights_portals": "https://privacy.microsoft.com/en-us/privacystatement",
  "wildcard_match": 0
},
{
"id": "clsk",
"platform": "Microsoft Clarity",
"category": "Statistics",
"data_key": "_clsk",
"domain": "https://ai-pioneers.nl/",
"description": "Ukládat a kombinovat zobrazení stránek uživatelem do jednoho záznamu relace.",
"retention_period": "1 day",
"data_controller": "Microsoft Clarity",
"privary_rights_portals": "https://privacy.microsoft.com/en-us/privacystatement",
"wildcard_match": 0
},
{
"id": "pin_unauth",
"platform": "Pinterest",
"category": "Marketing",
"data_key": "_pin_unauth",
"domain": "https://ai-pioneers.nl/",
"description": "Ukládat historii používání uživatelů.",
"retention_period": "1 day",
"data_controller": "Pinterest",
"privary_rights_portals": "https://policy.pinterest.com/en/privacy-policy",
"wildcard_match": 0
},
{
"id": "pin_unauth",
"platform": "Pinterest",
"category": "Marketing",
"data_key": "_pin_unauth",
"domain": "https://ai-pioneers.nl/",
"description":"Ukládat historii používání uživatelů.",
"retention_period": "1 day",
"data_controller": "Pinterest",
"privary_rights_portals": "https://policy.pinterest.com/en/privacy-policy",
"wildcard_match": 0
},
{
"id": "uetsid",
"platform": "Bing Ads",
"category": "Marketing",
"data_key": "__uetsid",
"domain": "https://ai-pioneers.nl/",
"description": "ukládat a sledovat návštěvy napříč webovými stránkami.",
"retention_period": "1 day",
"data_controller": "Bing Ads",
"privary_rights_portals": "https://privacy.microsoft.com/privacystatement",
"wildcard_match": 0
},
{
"id": "uetvid",
"platform": "Bing Ads",
"category": "Marketing",
"data_key": "_uetvid",
"domain": "https://ai-pioneers.nl/",
"description": "ukládat a sledovat návštěvy napříč webovými stránkami.",
"retention_period": "13 month",
"data_controller": "Bing Ads",
"privary_rights_portals": "https://privacy.microsoft.com/privacystatement",
"wildcard_match": 0
},
{
"id": "Sbjs_current",
"platform": "Sourcebuster JS",
"category": "Analytics",
"data_key": "Sbjs_current",
"domain": "https://ai-pioneers.nl/",
"description": "ukládat podrobnosti o prohlížeči.",
"retention_period": "6 month",
"data_controller": "Sourcebuster JS",
"privary_rights_portals": "#",
"wildcard_match": 0
},
{
"id": "sbjs_current_add",
"platform": "Sourcebuster JS",
"category": "Analytics",
"data_key": "sbjs_current_add",
"domain": "https://ai-pioneers.nl/",
"description": "ukládat podrobnosti o prohlížeči.",
"retention_period": "6 month",
"data_controller": "Sourcebuster JS",
"privary_rights_portals": "#",
"wildcard_match": 0
},
{
"id": "sbjs_first",
"platform": "Sourcebuster JS",
"category": "Analytics",
"data_key": "sbjs_first",
"domain": "https://ai-pioneers.nl/",
"description": "Používá se knihovnou Simple Behavioral JavaScript (SBJS) k ukládání dalších dat souvisejících s chováním nebo interakcemi aktuálního uživatele na webu.",
"retention_period": "6 month",
"data_controller": "Sourcebuster JS",
"privary_rights_portals": "#",
"wildcard_match": 0
},
{
"id": "Sbjs_first_add",
"platform": "Sourcebuster JS",
"category": "Analytics",
"data_key": "Sbjs_first_add",
"domain": "https://ai-pioneers.nl/",
"description": "Používá se knihovnou Simple Behavioral JavaScript (SBJS) k ukládání dalších dat souvisejících s chováním nebo interakcemi aktuálního uživatele na webu.",
"retention_period": "6 month",
"data_controller": "Sourcebuster JS",
"privary_rights_portals": "#",
"wildcard_match": 0
},
{
"id": "sbjs_migrations",
"platform": "Sourcebuster JS",
"category": "Analytics",
"data_key": "sbjs_migrations",
"domain": "https://ai-pioneers.nl/",
"description": "Používá se knihovnou Simple Behavioral JavaScript (SBJS) k ukládání dalších dat souvisejících s chováním nebo interakcemi aktuálního uživatele na webu.",
"data_controller": "Sourcebuster JS",
"privary_rights_portals": "#",
"wildcard_match": 0
},
{
"id": "sbjs_udata",
"platform": "Sourcebuster JS",
"category": "Analytics",
"data_key": "sbjs_udata",
"domain": "https://ai-pioneers.nl/",
"description":"Používá se knihovnou Simple Behavioral JavaScript (SBJS) k ukládání dalších dat souvisejících s chováním nebo interakcemi aktuálního uživatele na webu.",
"retention_period": "6 month",
"data_controller": "Sourcebuster JS",
"privary_rights_portals": "#",
"wildcard_match": 0
},
{
"id": "tk_ai",
"platform": "WooCommerce",
"category": "Analytics",
"data_key": "tk_ai",
"domain": "https://ai-pioneers.nl/",
"description": "pro uložení jedinečného ID uživatele.",
"retention_period": "session",
"data_controller": "WooCommerce",
"privary_rights_portals": "#",
"wildcard_match": 0
},
{
"id": "tk_r3d",
"platform": "Jetpack",
"category": "Analytics",
"data_key": "tk_r3d",
"domain": "https://ai-pioneers.nl/",
"description": "pro uložení jedinečného ID uživatele.",
"retention_period": "3 days",
"data_controller": "Jetpack",
"privary_rights_portals": "https://jetpack.com/support/privacy/#",
"wildcard_match": 0
},
{
"id": "ANONCHK",
"platform": "Microsoft Clarity",
"category": "Marketing",
"data_key": "ANONCHK",
"domain": "https://ai-pioneers.nl/",
"description": "se specifickými funkcemi",
"retention_period": "session",
"data_controller": "Microsoft Clarity",
"privary_rights_portals": "https://privacy.microsoft.com/en-us/privacystatement",
"wildcard_match": 0
},
{
"id": "APISID",
"platform": "Google",
"category": "Marketing",
"data_key": "APISID",
"domain": "https://ai-pioneers.nl/",
"description": "se specifickými funkcemi",
"retention_period": "1 year",
"data_controller": "Google",
"privary_rights_portals": "https://policies.google.com/privacy",
"wildcard_match": 0
},
{
"id": "DSID",
"platform": "Google",
"category": "Marketing",
"data_key": "DSID",
"domain": "https://ai-pioneers.nl/",
"description": "pro uložení uživatelských preferencí.",
"retention_period": "2 weeks",
"data_controller": "Google",
"privary_rights_portals": "https://policies.google.com/privacy",
"wildcard_match": 0
},
{
"id": "HSID",
"platform": "Google",
"category": "Marketing",
"data_key": "HSID",
"domain": "https://ai-pioneers.nl/",
"description": "poskytnout prevenci podvodů.",
"retention_period": "2 years",
"data_controller": "Google",
"privary_rights_portals": "https://policies.google.com/privacy",
"wildcard_match": 0
},
{
"id": "SAPISID",
"platform": "Google",
"category": "Marketing",
"data_key": "SAPISID",
"domain": "https://ai-pioneers.nl/",
"description": "pro uložení uživatelských preferencí.",
"retention_period": "2 years",
"data_controller": "Google",
"privary_rights_portals": "https://policies.google.com/privacy",
"wildcard_match": 0
},
{
"id": "SIDCC",
"platform": "Google",
"category": "Marketing",
"data_key": "SIDCC",
"domain": "https://ai-pioneers.nl/",
"description": "poskytnout identifikaci důvěryhodného webového provozu.",
"retention_period": "1 years",
"data_controller": "Google",
"privary_rights_portals": "https://policies.google.com/privacy",
"wildcard_match": 0
},
{
"id": "SSID",
"platform": "Google",
"category": "Marketing",
"data_key": "SSID",
"domain": "https://ai-pioneers.nl/",
"description": "se specifickými funkcemi",
"retention_period": "2 years",
"data_controller": "Google",
"privary_rights_portals": "https://policies.google.com/privacy",
"wildcard_match": 0
},
{
"id": "stripe_mid",
"platform": "Stripe",
"category": "Marketing",
"data_key": "__stripe_mid",
"domain": "https://ai-pioneers.nl/",
"description": "poskytnout prevenci podvodů.",
"retention_period": "1 years",
"data_controller": "Stripe",
"privary_rights_portals": "https://stripe.com/privacy",
"wildcard_match": 0
},
{
"id": "hjSessionUser",
"platform": "Hotjar",
"category": "Analytics",
"data_key": "_hjSessionUser_*",
"domain": "https://ai-pioneers.nl/",
"description": "pro uložení jedinečného ID uživatele.",
"retention_period": "1 years",
"data_controller": "Hotjar",
"privary_rights_portals": "https://www.hotjar.com/legal/policies/privacy/y",
"wildcard_match": 0
},
{
"id": "datr",
"platform": "Facebook",
"category": "Marketing",
"data_key": "datr",
"domain": "https://ai-pioneers.nl/",
"description": "poskytnout prevenci podvodů.",
"retention_period": "2 years",
"data_controller": "Facebook",
"privary_rights_portals": "https://www.facebook.com/privacy/policies/cookies/?entry_point=cookie_policy_redirect&entry=0",
"wildcard_match": 0
},
{
"id": "sb",
"platform": "Facebook",
"category": "Marketing",
"data_key": "sb",
"domain": "https://ai-pioneers.nl/",
"description": "ukládat podrobnosti o prohlížeči.",
"retention_period": "2 years",
"data_controller": "Facebook",
"privary_rights_portals": "https://www.facebook.com/privacy/policies/cookies/?entry_point=cookie_policy_redirect&entry=0",
"wildcard_match": 0
},
{
"id": "ttwid",
"platform": "TikTok",
"category": "Marketing",
"data_key": "ttwid",
"domain": "https://ai-pioneers.nl/",
"description": "uložit, pokud uživatel viděl vložený obsah.",
"retention_period": "1 years",
"data_controller": "TikTok",
"privary_rights_portals": "https://www.tiktok.com/legal/page/row/privacy-policy/en",
"wildcard_match": 0
},
{
"id": "wd",
"platform": "Facebook",
"category": "Marketing",
"data_key": "wd",
"domain": "https://ai-pioneers.nl/",
"description": "číst rozlišení obrazovky.",
"retention_period": "1 week",
"data_controller": "Facebook",
"privary_rights_portals": "https://www.facebook.com/privacy/policies/cookies/?entry_point=cookie_policy_redirect&entry=0",
"wildcard_match": 0
},
{
"id": "xs",
"platform": "Facebook",
"category": "Marketing",
"data_key": "xs",
"domain": "https://ai-pioneers.nl/",
"description": "číst rozlišení obrazovky.",
"retention_period": "3 months",
"data_controller": "Facebook",
"privary_rights_portals": "https://www.facebook.com/privacy/policies/cookies/?entry_point=cookie_policy_redirect&entry=0",
"wildcard_match": 0
},


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
