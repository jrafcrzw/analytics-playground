//-- consent-banner script--
document.addEventListener("DOMContentLoaded", () => {
  const placeholders = document.querySelectorAll("[data-placeholder]");

  placeholders.forEach((el) => {
    const name = el.getAttribute("data-placeholder");
    loadHTML(el, `/partials/${name}.html`, () => {
      if (name === "consent-banner") initConsentBanner();
    });
  });
});

function loadHTML(el, url, callback) {
  fetch(url)
    .then((res) => res.text())
    .then((html) => {
      el.innerHTML = html;
      if (typeof callback === "function") callback();
    })
    .catch((err) => console.error("Error loading partial:", url, err));
}

function initConsentBanner() {
  const consentBanner = document.getElementById("consent-banner");
  const acceptButton = document.getElementById("consent-accept");
  const declineButton = document.getElementById("consent-decline");

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      name + "=" + (value || "") + expires + "; path=/; SameSite=Lax" + secure;
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
  }

  const consentGiven = getCookie("consentGiven");

  if (consentGiven === "true") {
    // Consent previously granted
  } else if (consentGiven === "false") {
    // Consent previously denied
  } else {
    // First-time visitor — show banner with fade-in
    consentBanner.style.display = "block";
    requestAnimationFrame(() => {
      consentBanner.classList.add("opacity-100");
    });
  }

  acceptButton.addEventListener("click", () => {
    setCookie("consentGiven", "true", 180);

    if (typeof gtag === "function") {
      gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    }

    window.dataLayer?.push({
      event: "consent_accepted",
      consent: "accepted",
    });

    consentBanner.style.display = "none";
    setTimeout(() => location.reload(), 300);
  });

  declineButton.addEventListener("click", () => {
    setCookie("consentGiven", "false", 180);
    consentBanner.style.display = "none";

    window.dataLayer?.push({
      event: "consent_declined",
      consent: "declined",
    });

    console.log("Consent explicitly declined");
  });
}
//-- End consent-banner script--

//-- Reset cookie preferences script --
function resetConsent() {
  // Remove the consent cookie
  document.cookie =
    "consentGiven=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";

  // Remove Meta Pixel cookie (_fbp)
  document.cookie =
    "_fbp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";

  // ⚠️ Future-proofing note:
  // If additional platforms like Google Ads, TikTok, LinkedIn, Pinterest, etc. are added,
  // you may need to remove their respective cookies too.
  // Common prefixes include: "_ga", "_gid", "_gcl_", "_ttp", "_li_", "_pin_", etc.
  // Some of these might not be deletable due to cookieless behavior or HttpOnly restrictions.

  // Reload the page to reset the consent state and re-trigger the banner logic
  location.reload();
  console.log("Consent reset. Page reloaded.");
}
//-- End Reset cookie preferences script --
