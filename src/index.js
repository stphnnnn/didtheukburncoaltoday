import startOfDay from "date-fns/startOfDay";
import subDays from "date-fns/subDays";
import parseISO from "date-fns/parseISO";
import differenceInDays from "date-fns/differenceInDays";

import "./styles.css";

const API_URL = "https://api.carbonintensity.org.uk/generation";

function hasBurnedCoal(item) {
  const coalGeneration = item.generationmix.find((mix) => mix.fuel === "coal");
  return coalGeneration.perc > 0;
}

async function fetchStreak() {
  const maxDays = 60;

  const to = new Date();
  const from = subDays(to, maxDays);

  const response = await fetch(
    `${API_URL}/${from.toISOString()}/${to.toISOString()}`
  );
  const json = await response.json();

  const lastBurnedCoal = json.data.reverse().find(hasBurnedCoal);

  let streakMessage;

  if (lastBurnedCoal) {
    const lastBurnedCoalDateTime = parseISO(lastBurnedCoal.to);
    streakMessage = differenceInDays(to, lastBurnedCoalDateTime);
  } else {
    streakMessage = `over ${maxDays}`;
  }

  document.getElementById("streak").innerHTML = `
    It has been ${streakMessage} days since the UK last burned coal.
  `;
}

async function fetchHasBurnedToday() {
  const to = new Date();
  const from = startOfDay(to);

  const response = await fetch(
    `${API_URL}/${from.toISOString()}/${to.toISOString()}`
  );
  const json = await response.json();

  // check if some item in json.data has its coal generation mix percentage greater than 0
  // means that UK has burned coal today
  const hasBurnedFuel = json.data.some(hasBurnedCoal);

  if (hasBurnedFuel) {
    document.getElementById("headline").innerHTML = `
      <h1>Yes</h1>
    `;
  } else {
    document.getElementById("headline").innerHTML = `
      <h1>No</h1>
    `;
  }
}

fetchHasBurnedToday();
fetchStreak();
