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

// 🛡️ Reset cookie preferences: deletes consent cookie + common tracking cookies
function resetConsent() {
  // Remove the custom consent cookie
  document.cookie =
    "consentGiven=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";

  // Define common cookie prefixes used by GA and Meta (currently active)
  const cookiePrefixes = ["_ga", "_fbp"];

  // Optionally check multiple paths to ensure cookies are removed regardless of how they were set
  const pathsToTry = ["/", window.location.pathname];

  // Loop through existing cookies and remove those matching known prefixes
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    cookiePrefixes.forEach((prefix) => {
      if (name.startsWith(prefix)) {
        pathsToTry.forEach((path) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Lax`;
        });
      }
    });
  });

  // 🔮 Future-proofing note:
  // If additional platforms like TikTok, LinkedIn, Google Ads, Pinterest, etc. are added later,
  // you should consider extending `cookiePrefixes` to include known patterns like:
  // "_ttp" (TikTok), "_gcl_au" (Google Ads), "li_gc" (LinkedIn), "_pin_unauth" (Pinterest), etc.

  // Wait briefly before reloading to ensure deletion takes effect before any tags re-set them
  console.log(
    "Consent reset. Attempted cookie deletion. Reloading in 300ms..."
  );
  setTimeout(() => {
    location.reload();
  }, 300);
}
//-- End Reset cookie preferences script --
