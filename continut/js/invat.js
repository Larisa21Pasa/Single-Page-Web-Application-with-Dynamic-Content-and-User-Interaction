//SECTIUNEA 1 -> INFORMATII LIVE
"use strict";
console.log("AM AJUNS AIIICCIICIICICI")
/* Functia de afisare timp */
function refreshTime() {
  const timeDisplay = document.getElementById("date-time");
  const dateString = new Date().toLocaleString();
  const formattedString = dateString.replace(", ", " - ");
  timeDisplay.textContent = formattedString;
}

/* Functia de afisare locatie -> NU FUNCTIONEAZA */
var x = document.getElementById("current-location");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      onSuccess,
      onError,
      showPosition
    );
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>" +
    "Longitude: " +
    position.coords.longitude;
}

function onSuccess(position) {
  console.log("onSuccess");

  x.innerHTML = "Detecting your location...";
  let { latitude, longitude } = position.coords;
  fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
  )
    .then((response) => response.json())
    .then((response) => {
      let allDetails = response.results[0].components;
      console.table(allDetails);
      let { county, postcode, country } = allDetails;
      x.innerHTML = `${county} ${postcode}, ${country}`;
    })
    .catch(() => {
      x.innerHTML = "Something went wrong";
    });
  console.log(x.innerHTML);
}

function onError(error) {
  if (error.code == 1) {
    x.innerHTML = "You denied the request";
  } else if (error.code == 2) {
    x.innerHTML = "Location is unavailable";
  } else {
    x.innerHTML = "Something went wrong";
  }
  x.setAttribute("disabled", "true");
}

/* Functia care identifica URL curent  */
function getCurrentURL() {
  var currentURL = document.getElementById("current_url");
  currentURL.innerHTML = window.location.href;
}

/* Functia care identifica browserul de pe care sunt conectata */
function getBrowser() {
  var currentBrowser = document.getElementById("current-browser");
  var currentBrowserVersion = document.getElementById(
    "version-browser"
  );
  var currentOS = document.getElementById("current-os");

  currentBrowser.innerHTML = window.navigator.appCodeName;
  currentBrowserVersion.innerHTML = window.navigator.appVersion;
  currentOS.innerHTML = window.navigator.platform;
}
//call functions
  setInterval(refreshTime, 1000);
  getCurrentURL();
  getLocation();
  getBrowser();

//SECTIUNEA 2 -> CANVAS

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var rects = [];
var isDrawing = false;
var currentBorderColor = "#000000";
var currentFillColor = "#ffffff";
var currentRect = null;

canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mouseup", mouseUp, false);
canvas.addEventListener("mousemove", mouseMove, false);

function mouseDown(e) {
    currentRect = {
    startX: e.pageX - this.offsetLeft,
    startY: e.pageY - this.offsetTop,
    w: 0,
    h: 0,
    borderColor: currentBorderColor,
    fillColor: currentFillColor
    };
    isDrawing = true;
}

function mouseUp() {
    if (currentRect) {
    rects.push(currentRect);
    currentRect = null;
    draw();
    }
    isDrawing = false;
}

function mouseMove(e) {
    if (isDrawing) {
    currentRect.w = e.pageX - this.offsetLeft - currentRect.startX;
    currentRect.h = e.pageY - this.offsetTop - currentRect.startY;
    draw();
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < rects.length; i++) {
    var rect = rects[i];
    context.beginPath();
    context.rect(rect.startX, rect.startY, rect.w, rect.h);
    context.strokeStyle = rect.borderColor;
    context.fillStyle = rect.fillColor;
    context.lineWidth = 2;
    context.stroke();
    context.fill();
    }
    if (currentRect) {
    context.beginPath();
    context.rect(
        currentRect.startX,
        currentRect.startY,
        currentRect.w,
        currentRect.h
    );
    context.strokeStyle = currentRect.borderColor;
    context.fillStyle = currentRect.fillColor;
    context.lineWidth = 2;
    context.stroke();
    context.fill();
    }
}

function clearCanvas() {
    rects = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
}

var borderColorPicker = document.getElementById("border-color-picker");
borderColorPicker.addEventListener("change", function() {
    currentBorderColor = borderColorPicker.value;
    if (currentRect) {
    currentRect.borderColor = currentBorderColor;
    }
});

var fillColorPicker = document.getElementById("fill-color-picker");
fillColorPicker.addEventListener("change", function() {
    currentFillColor = fillColorPicker.value;
    if (currentRect) {
    currentRect.fillColor = currentFillColor;
    }
});
    
  


//SECTIUNEA 3 -> TABEL DINAMIC
var columnHeaders = ["Coloana 1", "Coloana 2"];

function insertRow() {
// Get the table element and the position to insert the new row
var table = document.getElementById("myTable");
var rowPos = parseInt(document.getElementById("rowPosition").value);

// If row position is invalid, insert new row at the end of the table
if (rowPos < 0 || rowPos > table.rows.length) {
rowPos = table.rows.length;
}

// Create a new row element and insert it at the specified position
var newRow = table.insertRow(rowPos);

// Add cells with the appropriate text to the new row
for (var i = 0; i < table.rows[0].cells.length; i++) {
var newCell = newRow.insertCell(i);
newCell.innerHTML = "A" + (rowPos-1) + (i + 1);
}

// Change the background color of the cells in the new row
newRow.style.backgroundColor = document.getElementById("colorPicker").value;
}
function insertColumn() {
// Get the table element and the position to insert the new column
var table = document.getElementById("myTable");
var colPos = parseInt(document.getElementById("columnPosition").value);

// If column position is invalid, insert new column at the end of the table
if (colPos < 0 || colPos > table.rows[0].cells.length) {
colPos = table.rows[0].cells.length;
}

// Insert a new <th> element with the appropriate header text
var newHeader = table.rows[0].insertCell(colPos);
newHeader.innerHTML = "Coloana " + colPos ;

// Add a new cell to each row at the specified position
for (var i = 1; i < table.rows.length; i++) {
var newRow = table.rows[i];
var newCell = newRow.insertCell(colPos);
newCell.innerHTML = "A" + (i-1) + colPos;
// Move existing cells to the right
for (var j = newRow.cells.length - 1; j > colPos; j--) {
newRow.cells[j].innerHTML = newRow.cells[j - 1].innerHTML;
}
// Set the background color for the new cell
newCell.style.backgroundColor = document.getElementById("colorPicker").value;
}
}


