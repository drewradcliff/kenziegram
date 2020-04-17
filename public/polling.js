async function getLatest(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

let errCount = 0;
let interval = setInterval(() => {
  getLatest("/latest", { after: 1523972111977 })
    .then((data) => {
      errCount = 0;
    })
    .catch((error) => {
      errCount++;
      console.log("Error:", errCount, error);
      if (errCount == 2) {
        displayError();
        clearInterval(interval);
      }
    });
}, 5000);

const displayError = () => {
  console.log("lost connection");
  let error = document.createElement("p");
  error.style.color = "red";
  error.textContent = "Lost connection to server";
  document.body.appendChild(error);
};
