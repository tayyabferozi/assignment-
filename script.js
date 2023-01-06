function capitalize(str) {
  // implement a function to capitalize the first letter of every word in str
  // your code goes here
  return str.charAt(0).toUpperCase() + str.slice(1);
}

window.addEventListener("DOMContentLoaded", (event) => {
  // execute the code when the initial HTML document has been completely loaded, we need the regions select to be loaded

  var lookup = {};

  for (let i in activities) {
    // for every item in the activities - every piece of statistic info
    let region;
    if (activities[i].Location.ParentId)
      region = capitalize(activities[i].Location.ParentId);
    // read region from an activity
    else region = capitalize(activities[i].Location.Id); // read polling station Id from an activity
    let station = activities[i].Location.Name; // read polling station from an activity
    if (region && !(region in lookup)) {
      // if the region hasn't been previously processed
      lookup[region] = {}; // add a new region to the lookup
    }
    lookup[region][station] = 1; // add a station to the lookup. lookup is a two-dimensional associative array/object
  }

  // console.log(lookup); // uncomment this line if you want to see the result in the console

  // now let's get regions for the first select element
  var regions = Object.keys(lookup).sort(); // get the list of keys in the lookup and sort it

  // console.log("regions =>", regions); // uncomment this line if you want to see the result in the console

  const region_s = document.getElementById("region-list"); // get region select element
  for (let i in regions) {
    // for every region
    let opt = document.createElement("option"); // create a new option
    opt.innerHTML = regions[i]; // fill the text with the region name
    opt.value = regions[i]; // fill the value with the region name
    region_s.appendChild(opt); // add newly created option to the region select
  }

  // to get polling stations for the first region and sort it

  // const stations = Object.keys(lookup[regions[0]]).sort(); // if you need to process polling stations in the loop, use loop counter instead of index 0
  // console.log("regions =>", stations); // uncomment this line if you want to see the result in the console

  // write your code to fill the polling stations select element

  const station_s = document.getElementById("polling-list"); // get region select element

  const voteFromInput = document.getElementById("vote-from");
  const voteUntilInput = document.getElementById("vote-until");
  const totalInput = document.getElementById("total");
  // const electDayInput = document.getElementById("elect-day");
  const showStatsBtn = document.getElementById("show-stats");
  const error = document.getElementById("error");

  function showStations(val) {
    station_s.innerHTML = "";
    const stations = Object.keys(lookup[val]).sort(); // if you need to process polling stations in the loop, use loop counter instead of index 0

    let opt = document.createElement("option"); // create a new option
    opt.innerHTML = "All"; // fill the text with the region name
    opt.value = ""; // fill the value with the region name
    station_s.appendChild(opt); // add newly created option to the region select

    for (let i in stations) {
      // for every region
      let opt = document.createElement("option"); // create a new option
      opt.innerHTML = stations[i]; // fill the text with the region name
      opt.value = stations[i]; // fill the value with the region name
      station_s.appendChild(opt); // add newly created option to the region select
    }
  }

  function showStats(arr) {
    const totalChecked = totalInput.checked;
    // const electChecked = electDayInput.checked;

    const tbody = document.getElementById("t-body");

    tbody.innerHTML = "";

    arr.forEach((el) => {
      const tr = document.createElement("tr");

      const td1 = document.createElement("td");

      td1.innerHTML = el.Location.ParentId || el.Location.Id || "";

      const td2 = document.createElement("td");

      td2.innerHTML = el.Location.Name || "";

      const td3 = document.createElement("td");

      td3.innerHTML = el.Location.Address || "";

      const td4 = document.createElement("td");

      td4.innerHTML = el.Location.VoterCount || "";

      const td5 = document.createElement("td");

      const td6 = document.createElement("td");

      if (totalChecked) {
        td5.innerHTML = el.TotalStatistic.Count || "";
        td6.innerHTML = el.TotalStatistic.Percentage || "";
      } else {
        td5.innerHTML = el.ElectionDayTotalStatistic.Count || "";
        td6.innerHTML = el.ElectionDayTotalStatistic.Percentage || "";
      }

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);

      tbody.appendChild(tr);
    });
  }

  region_s.addEventListener("change", function (e) {
    const val = e.target.value;

    if (val) showStations(val);
    else station_s.innerHTML = "";
  });

  showStatsBtn.addEventListener("click", function (e) {
    const regionVal = region_s.value;
    const stationVal = station_s.value;
    const voteFromVal = voteFromInput.value;
    const voteUntilVal = voteUntilInput.value;

    error.innerHTML = "";

    let activitiesFiltered = activities;

    if (regionVal) {
      activitiesFiltered = activitiesFiltered.filter(
        (el) =>
          regionVal?.toLowerCase() === el?.Location?.ParentId?.toLowerCase() ||
          regionVal?.toLowerCase() === el?.Location?.Id?.toLowerCase()
      );
    }

    // console.log(activitiesFiltered);

    if (stationVal) {
      activitiesFiltered = activitiesFiltered.filter(
        (el) => stationVal === el.Location.Name
      );
    }

    if (voteFromVal) {
      if (voteFromVal < 1) {
        error.innerHTML = '"Voters from" value must be greater than 0 or empty';

        return;
      }

      activitiesFiltered = activitiesFiltered.filter(
        (el) => voteFromVal < el.Location.VoterCount
      );
    }

    if (voteUntilVal) {
      if (voteUntilVal < 1) {
        error.innerHTML =
          '"Voters until" value must be greater than 0 or empty';

        return;
      }

      if (+voteUntilVal <= +voteFromVal) {
        error.innerHTML =
          '"Voters until" value must be smaller than "Voters from" value';

        return;
      }

      activitiesFiltered = activitiesFiltered.filter(
        (el) => voteUntilVal > el.Location.VoterCount
      );
    }

    showStats(activitiesFiltered);
  });
});
