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
  // Remove custom consent cookie
  document.cookie =
    "consentGiven=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";

  // Known first-party cookie names/prefixes to remove
  const cookiesToRemove = [
    "_ga",
    "_fbp",
  ];

  // Function to delete a cookie by name, trying different paths
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    // Try with the current path (in case it's more specific)
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${window.location.pathname}; SameSite=Lax`;
    // Try one level up in the path
    const pathParts = window.location.pathname.split('/').slice(0, -1).join('/');
    if (pathParts) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${pathParts}/; SameSite=Lax`;
    }
    // Optional: Try with a specific domain if you suspect that's the case
    // const domain = document.domain;
    // document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}; SameSite=Lax`;
  }

  // Loop through the cookies to remove
  cookiesToRemove.forEach(cookieName => {
    deleteCookie(cookieName);
  });

  // Add a slightly longer delay to ensure cookie deletion
  console.log("Consent reset. Attempted cookie deletion. Reloading in 500ms...");
  setTimeout(() => {
    location.reload();
  }, 500);
}
//-- End Reset cookie preferences script --
