function checkSessionCookie() {
  const cookies = {}; // Create an empty object to store cookie name-value pairs
  const allCookies = document.cookie.split("; "); // Split the cookie string into an array of "name=value" strings

  allCookies.forEach((cookie) => {
    const [name, value] = cookie.split("="); // Split each "name=value" string by '='
    cookies[name] = value; // Assign each name and value to the cookies object
  });

  return cookies;
}

const allCookies = checkSessionCookie();
console.log(allCookies);

export default checkSessionCookie;
