
// messages
// TODO: replace messages
export const M_LOGIN_TITLE = "The Quire brown fox jumps over the lazy dog.";
export const M_LOGIN_DESCRIPTION = "In order to create new tasks, we will need access to your Quire account.";
export const M_LOGIN_BUTTON = "Login with Quire";

export const M_FORMCOLUMN_PROJECT = "Project";
export const M_FORMCOLUMN_TASK = "Task name";
export const M_FORMCOLUMN_DUE = "Due date";
export const M_FORMCOLUMN_ASSIGNEES = "Assignees";
export const M_FORMCOLUMN_ASSIGNEES_DESCRIPTION = "Add assignee by typing in users’ ID or users’ email addresses. User comma to separate between assignees.";
export const M_FORMCOLUMN_TAGS = "Tags";
export const M_FORMCOLUMN_TAGS_DESCRIPTION = "Add tags to this task by typing in the existing tags. Use comma to separate between tags.";
export const M_FORMCOLUMN_DESCRIPTION = "Description";
export const M_FORMCOLUMN_DESCRIPTION_OPTION = "Plain text";

export const M_BUTTON_CREATE = "Create Task";
export const M_BUTTON_CANCEL = "Cancel";
export const M_BUTTON_VIEW_DONE = "View on Quire";
export const M_BUTTON_VIEW_CREATE = "Add another task";
export const M_DONE_MESSAGE = "Your new task has been added to Quire.";

// urls
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const HOST_URL = process.env.HOST_URL;
export const REDIRECT_URI = process.env.REDIRECT_URI;
export const QUIRE_URL = process.env.QUIRE_URL;
export const AUTH_URL = `${HOST_URL}/oauth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

// keys
export const KEY_TOKEN = "token";
export const KEY_REFRESH = "refresh_token";

//styles
export const COLOR_PRIMARY = "#05843E";
export const COLOR_SECONDARY = "#4AA433";