const dataUrl = "./data.json";
const currentUrl = window.location.href;
const regex = /index(\d+)\.html/;
const currentPageMatch = currentUrl.match(regex);
let currentPage = currentPageMatch ? parseInt(currentPageMatch[1]) : 1;
const container = document.getElementById("container");
const pageCountForm = document.querySelector(".pageCount");
let nowPageInput = document.querySelector(".nowPage");
nowPageInput.setAttribute("placeholder", `${currentPage}`);

pageCountForm.addEventListener("submit", function (event) {
  event.preventDefault(); // 폼 전송 이벤트 기본 동작 방지
  const inputPage = parseInt(nowPageInput.value);
  if (isNaN(inputPage) || inputPage < 1 || inputPage > 17) {
    alert("1부터 17까지의 페이지 번호만 입력해주세요.");
    return;
  }
  if (inputPage !== currentPage) {
    handlePage(inputPage);
  }
});

nowPageInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // 폼 전송 기본 동작 방지
    const inputPage = parseInt(nowPageInput.value);
    if (isNaN(inputPage) || inputPage < 1 || inputPage > 17) {
      alert("1부터 17까지의 페이지 번호만 입력해주세요.");
      return;
    }
    if (inputPage !== currentPage) {
      handlePage(inputPage);
    }
  }
});

nowPageInput.addEventListener("focus", function () {
  nowPageInput.removeAttribute("placeholder");
});

nowPageInput.addEventListener("blur", function () {
  nowPageInput.setAttribute("placeholder", currentPage);
});

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

beforeButton.addEventListener("click", function (event) {
  event.preventDefault();
  handlePage(currentPage - 1); // 이전 페이지로 이동
});

nextButton.addEventListener("click", function (event) {
  event.preventDefault();
  handlePage(currentPage + 1); // 다음 페이지로 이동
});

function handlePage(pageNumber) {
  if (pageNumber < 1 || pageNumber > 17 || pageNumber === currentPage) {
    return;
  }

  // 다음 페이지의 URL 생성
  const nextPageUrl = `./index${pageNumber}.html`;

  window.location.href = nextPageUrl;
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
