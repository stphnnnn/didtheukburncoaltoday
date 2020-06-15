import parseISO from "date-fns/parseISO";
import differenceInDays from "date-fns/differenceInDays";
import isSameDay from "date-fns/isSameDay";

import "./styles.css";

async function init() {
  // Get data
  const response = await fetch(`/api`);
  const json = await response.json();

  // Did the UK burn coal today?
  const hasBurnedCoal = isSameDay(new Date(), parseISO(json.to));

  if (hasBurnedCoal) {
    document.getElementById("headline").innerHTML = `
      <h1>Yes</h1>
    `;
  } else {
    document.getElementById("headline").innerHTML = `
      <h1>No</h1>
    `;
  }

  // No coal streak
  const streakInDays = differenceInDays(new Date(), parseISO(json.to));

  document.getElementById("streak").innerHTML = `
    It has been ${streakInDays} days since the UK last burned coal.
  `;
}

init();
