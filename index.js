const dataUrl = "./data.json";
const currentUrl = window.location.href;
const regex = /index[<>]?d+/;
const currentPageMatch = currentUrl.match(regex);
const currentPage = currentPageMatch
  ? parseInt(currentPageMatch[0].slice(5))
  : 1;

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
  h4.classList.add("binary-text"); // 클래스 추가
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
    const container = document.getElementById("container");
    if (data[`${currentPage}`] && data[`${currentPage}`]["부제목"]) {
      const h2 = document.createElement("h2");
      const binaryText = parseInt(
        data[`${currentPage}`]["부제목"]["영어"].replace(/[^\w\s"']/g, ""),
        36
      ).toString(2);
      let i = 0;
      const intervalId = setInterval(function () {
        h2.textContent += binaryText.charAt(i);
        i++;
        if (i === binaryText.length) {
          clearInterval(intervalId);
          const h2 = document.createElement("h2");
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

beforeButton.addEventListener("click", handlePage);
nextButton.addEventListener("click", handlePage);

function handlePage(event) {
  const currentDirection = event.target.classList.contains("left") ? -1 : 1;
  const newPage = currentPage + currentDirection;
  if (newPage < 1 || newPage > 3) {
    return;
  }
  window.location.href = `./index${newPage}.html`;
}
