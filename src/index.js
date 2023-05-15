import './css/styles.css';
import { fetchCountries } from "./fetchCountries.js";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from "lodash.debounce";
const DEBOUNCE_DELAY = 300;

const input = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

input.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const inputCountry = event.target.value.trim();
  console.log(inputCountry)
  if (inputCountry) {
    fetchCountries(inputCountry).then(foundCountry).catch(err);
  } else {
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
  }
}

function foundCountry(data) {
  if (data.length === 1) {
    countryList.innerHTML = "";
    countryInfo.innerHTML = creatMarkupInfo(data);
  } else if (data.length < 11) {
    countryInfo.innerHTML = "";
    countryList.innerHTML = creatMarkupList(data);
  } else {
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
    Notify.info(
      "Too many matches found. Please enter a more specific name."
    );
  }
}

function creatMarkupInfo(array) {
  return array
    .map(
      ({
        name: { official },
        population,
        capital,
        flags: { svg, alt },
        languages,
      }) => `<div class="country-unite">
      <img src="${svg}" alt="${alt}" class="flag" height=60px>
      <h2>${official}</h2> </div>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>
  `
    )
    .join('');
}

function creatMarkupList(array) {
  return array
    .map(
      ({ name: { official }, flags: { svg, alt } }) => `<li class="list">
      <img src="${svg}" alt="${alt}" class="flag"  width = 90px height = 60px>
      <h2>${official}</h2>
      </li>`
    )
    .join('');
}

function err(error) {
  if(error.message === "404"){
    Notify.failure("Oops, there is no country with that name.");
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  } else {
    Notify.failure(`${error.message}`);
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  };
  }