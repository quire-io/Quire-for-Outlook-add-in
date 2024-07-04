
// messages
// TODO: replace messages
const TEXT_LOGIN_TITLE = "The Quire brown fox jumps over the lazy dog.";
const TEXT_LOGIN_DESCRIPTION = "In order to create new tasks, we will need access to your Quire account.";
const TEXT_LOGIN_BUTTON = "Login with Quire";

// urls
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const HOST_URL = process.env.HOST_URL;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTH_URL = `${HOST_URL}/oauth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

// keys
const KEY_TOKEN = "token";
const KEY_REFRESH = "refresh_token";

//styles
const COLOR_PRIMARY = "#05843E";
const COLOR_SECONDARY = "#4AA433";

export {
  TEXT_LOGIN_TITLE,
  TEXT_LOGIN_DESCRIPTION,
  TEXT_LOGIN_BUTTON,

  CLIENT_ID,
  CLIENT_SECRET,
  HOST_URL,
  REDIRECT_URI,
  AUTH_URL,

  KEY_TOKEN,
  KEY_REFRESH,

  COLOR_PRIMARY,
  COLOR_SECONDARY
};