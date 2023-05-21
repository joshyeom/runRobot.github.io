const dataUrl = "./asciiArt.json";
const container = document.getElementById("container");

function displayAsciiArt(asciiArt, className) {
  return new Promise((resolve) => {
    const pre = document.createElement("pre");
    pre.className = className;
    container.appendChild(pre);

    let index = 0;
    const intervalId = setInterval(() => {
      pre.textContent += asciiArt[index];
      index++;

      if (index === asciiArt.length) {
        clearInterval(intervalId);
        resolve();
      }
    }, 10);
  });
}

const xhr = new XMLHttpRequest();
xhr.open("GET", dataUrl, true);
xhr.onload = function () {
  if (xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    const asciiArtKeys = Object.keys(data);

    async function displayAsciiArtSequentially() {
      for (let i = 0; i < asciiArtKeys.length; i++) {
        const key = asciiArtKeys[i];
        const asciiArt = data[key].join("\n");
        const className = `pre-style-${i + 1}`;
        await displayAsciiArt(asciiArt, className);
      }
    }

    displayAsciiArtSequentially();
  }
};
xhr.send();
