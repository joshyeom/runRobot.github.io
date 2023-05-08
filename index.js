const dataUrl = "./data.json";
const currentUrl = window.location.href;
const regex = new RegExp("(?<=index)[<>]?\\d+");
const currentPage = parseInt(currentUrl.match(regex)[0]);

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

fetch(dataUrl)
  .then((response) => response.json())
  .then((data) => {
    // const newObj = {};
    // for (const key in data["1"]["내용"]) {
    //   if (key % 2 !== 0) {
    //     const value = data["1"]["내용"][key].replace(/\\/g, ""); // escape 문자열 제거
    //     const binary = parseInt(value, 36).toString(2);
    //     if (!isNaN(binary)) {
    //       newObj[key] = binary;
    //     }
    //   }
    // }

    const container = document.getElementById("container");
    if (data[`${currentPage}`]?.부제목) {
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
  });

const beforeButton = document.querySelector(".left");
const nextButton = document.querySelector(".right");

beforeButton.addEventListener("click", handlePage);
nextButton.addEventListener("click", handlePage);

function handlePage(e) {
  if (e.target.classList.contains("left")) {
    if (currentPage === 1) {
      return;
    }
    window.location.href = `./index${currentPage - 1}.html`;
  } else {
    if (currentPage === 180) {
      return;
    }
    window.location.href = `./index${currentPage + 1}.html`;
  }
}
// JSON변환기; //
