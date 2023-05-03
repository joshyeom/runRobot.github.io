const dataUrl = "./data.json";

function displayContent(data, container, propertyKeys, index) {
  if (index >= propertyKeys.length) {
    return;
  }
  const propertyKey = propertyKeys[index];
  const h4 = document.createElement("h4");
  const binaryText = data[`${1}`]["내용"][propertyKey];
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
    const container = document.getElementById("container");
    if (data[`${1}`]?.부제목) {
      const h2 = document.createElement("h2");
      const binaryText = data[`${1}`]["부제목"]["2진법"];
      let i = 0;
      const intervalId = setInterval(function () {
        h2.textContent += binaryText.charAt(i);
        i++;
        if (i === binaryText.length) {
          clearInterval(intervalId);
          const h3 = document.createElement("h3");
          const text = data[`${1}`]["부제목"]["한글"];
          container.appendChild(h3);
          let j = 0;
          const intervalId2 = setInterval(function () {
            h3.textContent += text.charAt(j);
            j++;
            if (j === text.length) {
              clearInterval(intervalId2);
              const propertyKeys = Object.keys(data[`${1}`]["내용"]);
              displayContent(data, container, propertyKeys, 0);
            }
          }, 50);
        }
      }, 50);
      container.appendChild(h2);
    }
  });

console.log(1);
