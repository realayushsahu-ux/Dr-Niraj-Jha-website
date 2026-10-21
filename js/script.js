
const menuToggle = document.getElementById("menu-toggle");
const mainNavigation = document.getElementById("nav-menu");

if (menuToggle && mainNavigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNavigation.classList.toggle("is-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    mainNavigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNavigation.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            mainNavigation.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        }
    });
}


const yearElement = document.getElementById("current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

const appointmentModal = document.getElementById("appointment-modal");
const appointmentForm = document.getElementById("appointment-form");
const appointmentMessage = document.getElementById("appointment-message");
const appointmentSubmit = document.getElementById("appointment-submit");
const closeAppointment = document.getElementById("close-appointment");

const appointmentURL = "https://script.google.com/macros/s/AKfycbwNVRjInFvKG4owAjlL5vASTNX2r5NicKTbuOAgHG0UIpdNFgIXacWaNJWf3FmhvIVw/exec";

function openAppointmentForm() {
  appointmentModal.classList.add("is-visible");
  appointmentModal.setAttribute("aria-hidden", "false");
  document.getElementById("patient-name").focus();
}

function closeAppointmentForm() {
  appointmentModal.classList.remove("is-visible");
  appointmentModal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll("a, button").forEach(function (element) {
  if (element.textContent.trim().toLowerCase().includes("book appointment")) {
    element.addEventListener("click", function (event) {
      event.preventDefault();
      openAppointmentForm();
    });
  }
});

closeAppointment.addEventListener("click", closeAppointmentForm);

appointmentModal.addEventListener("click", function (event) {
  if (event.target === appointmentModal) {
    closeAppointmentForm();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && appointmentModal.classList.contains("is-visible")) {
    closeAppointmentForm();
  }
});

appointmentForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!appointmentForm.reportValidity()) return;

  const formData = new FormData(appointmentForm);
  const phone = String(formData.get("phone") || "").trim();

  if (!/^[0-9]{10}$/.test(phone)) {
    appointmentMessage.textContent = "Please enter a valid 10-digit phone number.";
    return;
  }

  appointmentSubmit.disabled = true;
  appointmentSubmit.textContent = "Submitting...";
  appointmentMessage.textContent = "";

  try {
    const data = new URLSearchParams();

    ["name", "email", "phone", "city"].forEach(function (field) {
      data.set(field, String(formData.get(field) || "").trim());
    });

    await fetch(appointmentURL, {
      method: "POST",
      mode: "no-cors",
      body: data
    });

    appointmentMessage.textContent =
      "Your request was submitted. Please wait while we verify that it appears in the clinic's appointment sheet.";

    appointmentForm.reset();
  } catch (error) {
    appointmentMessage.textContent =
      "We couldn't submit your request. Please contact the clinic by phone.";
  } finally {
    appointmentSubmit.disabled = false;
    appointmentSubmit.textContent = "Request a Call";
  }
});
