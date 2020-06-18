import parseISO from "date-fns/parseISO";
import differenceInDays from "date-fns/differenceInDays";
import isSameDay from "date-fns/isSameDay";

import "./styles.css";

async function init() {
  // Get data
  const response = await fetch(`/api`);
  const json = await response.json();

  // Hide spinner
  const spinner = document.querySelector(".spinner");
  spinner.style.display = "none";

  // Did the UK burn coal today?
  const hasBurnedCoal = isSameDay(new Date(), parseISO(json.to));

  if (hasBurnedCoal) {
    document.getElementById("headline").innerHTML = `
      <h1 class="red">Yes</h1>
    `;
  } else {
    document.getElementById("headline").innerHTML = `
      <h1 class="blue">No</h1>
    `;
  }

  // No coal streak
  const streakInDays = differenceInDays(new Date(), parseISO(json.to));

  if (hasBurnedCoal) {
    document.getElementById("streak").innerHTML = `
      But we don’t have to! Earlier this year, <a class="blue" href="https://www.theguardian.com/business/2020/apr/28/britain-breaks-record-for-coal-free-power-generation">the UK went months in a row</a> without burning coal.
    `;
  } else {
    document.getElementById("streak").innerHTML = `
      It has been <span class="blue">${streakInDays} days</span> since the UK last burned coal.
    `;
  }
}

init();
