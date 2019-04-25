async function displayCookies(cookieEndpoint, container) {
  const response = await fetch(cookieEndpoint, {credentials: 'include'});
  const data = await response.json()
  document.getElementById(container).textContent = JSON.stringify(data, null, 4);
}

(function () {
  displayCookies('https://peaceful-wing.glitch.me/cookies.json', 'remote-cookie-jar');
})();
