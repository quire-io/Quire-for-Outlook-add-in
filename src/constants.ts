
// messages
export const M_LOGIN_TITLE = "Never miss a deadline by turning your emails into actionable tasks with Quire for Outlook.";
export const M_LOGIN_DESCRIPTION = "In order to create new tasks, we will need access to your Quire account.";
export const M_LOGIN_BUTTON = "Login with Quire";

export const M_FORMCOLUMN_PROJECT = "Project";
export const M_FORMCOLUMN_TASK = "Task name";
export const M_FORMCOLUMN_DUE = "Due date";
export const M_FORMCOLUMN_ASSIGNEES = "Assignees";
export const M_FORMCOLUMN_ASSIGNEES_DESCRIPTION = "Add assignee by typing in users’ ID or users’ email addresses. Use comma to separate assignees.";
export const M_FORMCOLUMN_TAGS = "Tags";
export const M_FORMCOLUMN_TAGS_DESCRIPTION = "Add tags to this task by typing in the existing tags. Use comma to separate tags.";
export const M_FORMCOLUMN_DESCRIPTION = "Description";
export const M_FORMCOLUMN_DESCRIPTION_OPTION = "Plain text";

export const M_BUTTON_CREATE = "Create Task";
export const M_BUTTON_CANCEL = "Cancel";
export const M_BUTTON_VIEW_DONE = "View on Quire";
export const M_BUTTON_VIEW_CREATE = "Add another task";
export const M_DONE_MESSAGE = "Your new task has been added to Quire.";

export const M_SETTING_HELP = "Help";
export const M_SETTING_LOGOUT = "Log out";

export const M_ERROR_NO_PROJECT = "Failed to fetch projects.";
export const M_ERROR_NO_AUTH = "Failed to authenticate with Quire.";
export const M_ERROR_TOKEN_EXPIRED = "Token expired. Please log in again.";
export const M_ERROR_NO_AVAILABLE = "No available projects in current organization. Please create a project in Quire first.";

export const M_DESC_VIEW_IN_OUTLOOK = "View in Outlook";

// urls
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const HOST_URL = process.env.HOST_URL;
export const REDIRECT_URI = `${HOST_URL}/callback.html`;
export const QUIRE_URL = process.env.QUIRE_URL;
export const AUTH_URL = `${QUIRE_URL}/oauth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
export const HELP_URL = "https://quire.io/apps/outlook-add-in";
export const OUTLOOK_INBOX_URL = "https://outlook.live.com/mail/0/inbox/id/"

// keys
export const KEY_TOKEN = "token";
export const KEY_REFRESH = "refresh_token";
export const KEY_CURUSER = "current_user";
export const KEY_DEFAULT_PROJECT = "default_project";

//styles
export const COLOR_PRIMARY = "#05843E";
// export const COLOR_SECONDARY = "#4AA433";