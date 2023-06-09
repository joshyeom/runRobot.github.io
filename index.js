const dataUrl = "./data.json";
const currentUrl = window.location.href;
const regex = /index(\d+)\.html/;
const currentPageMatch = currentUrl.match(regex);
let currentPage = currentPageMatch ? parseInt(currentPageMatch[1]) : 1;
const container = document.getElementById("container");
const currentDiv = document.querySelector(".currentPage");
currentDiv.innerHTML = currentPage;

function displayContent(data, container, propertyKeys, index) {
  if (index >= propertyKeys.length) {
    return;
  }

  const binaryText =
    index % 2 === 0
      ? data[`${currentPage}`]["내용"][propertyKeys[index]]
          .replace(/[^\w\s]/gi, "")
          .split(" ")
          .map((word) => parseInt(word, 36).toString(2).padStart(8, "0"))
          .join("")
      : data[`${currentPage}`]["내용"][propertyKeys[index]];

  const h4 = document.createElement("h4");
  if (index % 2 !== 0) {
    h4.classList.add("binary-text");
    h4.classList.add("jejugothic");
  } else {
    h4.classList.add("binary-text");
    h4.classList.add("mono");
  }
  let i = 0;
  const intervalId = setInterval(function () {
    h4.textContent += binaryText.charAt(i);
    i++;
    if (i === binaryText.length) {
      clearInterval(intervalId);
      displayContent(data, container, propertyKeys, index + 1);
    }
  }, 30);
  container.appendChild(h4);
}

const xhr = new XMLHttpRequest();
xhr.open("GET", dataUrl, true);
xhr.onload = function () {
  if (xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    if (data[`${currentPage}`] && data[`${currentPage}`]["부제목"]) {
      const h2 = document.createElement("h2");
      h2.classList.add("mono");
      const binaryText = data[`${currentPage}`]["부제목"]["영어"]
        .replace(/[^\w\s]/gi, "")
        .split(" ")
        .map((word) => parseInt(word, 36).toString(2).padStart(8, "0"))
        .join("");
      let i = 0;
      const intervalId = setInterval(function () {
        h2.textContent += binaryText.charAt(i);
        i++;
        if (i === binaryText.length) {
          clearInterval(intervalId);
          const h2 = document.createElement("h2");
          h2.classList.add("jejugothic");
          const text = data[`${currentPage}`]["부제목"]["한글"];
          container.appendChild(h2);
          let j = 0;
          const intervalId2 = setInterval(function () {
            h2.textContent += text.charAt(j);
            j++;
            if (j === text.length) {
              clearInterval(intervalId2);
              const propertyKeys = Object.keys(data[`${currentPage}`]["내용"]);
              displayContent(data, container, propertyKeys, 0);
            }
          }, 50);
        }
      }, 50);
      container.appendChild(h2);
    }
  }
};
xhr.send();

const beforeButton = document.querySelector(".left");
const nextButton = document.querySelector(".right");

if (currentPage === 1) {
  beforeButton.innerHTML = "";
} else if (currentPage === 17) {
  nextButton.innerHTML = "";
}

const $footer = document.querySelector("footer");

$footer.addEventListener("click", pageHandler);

function pageHandler({ target }) {
  if (!target.classList.contains("right") && !target.classList.contains("left"))
    return;

  let nextPageUrl = target.classList.contains("right")
    ? currentPage + 1
    : currentPage - 1;
  window.location.href = `./index${nextPageUrl}.html`;
}

function scrollToBottom() {
  const isAtBottom =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight;

  if (!isAtBottom) {
    return;
  } else {
    window.scrollTo(0, document.body.scrollHeight);
  }
}
setInterval(scrollToBottom, 100);
