import { AUTH_URL, KEY_TOKEN, KEY_REFRESH, CLIENT_ID, CLIENT_SECRET, QUIRE_URL } from './constants';

export function print(msg: any) {//would remove this cheat later
  console.log(msg);
}

export async function quireAuthentication() {
  let dialog: Office.Dialog;

  return new Promise<boolean>((resolve, reject) => {
    Office.context.ui.displayDialogAsync(AUTH_URL, {
      height: 70, //percentage
      width: 70,
    }, function (asyncResult) {
        if (asyncResult.status !== Office.AsyncResultStatus.Succeeded)
          reject(asyncResult.error);
        dialog = asyncResult.value;
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
      }
    );
  
    async function processMessage(arg: { message: string , origin: string }) {
      dialog.close();

      const code = arg.message;

      if (code !== '')
        resolve(_getToken("auth", code));
      else
        reject("Failed to authenticate.");
    }
  });
}

async function _getToken(type: "auth" | "refresh", data: String) {
  return await $.post(`${QUIRE_URL}/oauth/token`, {
    "grant_type": type === "auth" ? "authorization_code" : "refresh_token",
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "code": data,
    "refresh_token": data,
  }, function (response) {
    if (response.error)
      return false;
    else {
      const token = response.access_token;
      const refresh_token = response.refresh_token;

      localStorage.setItem(KEY_TOKEN, token);
      localStorage.setItem(KEY_REFRESH, refresh_token);
      return true;
    }
  });
}

export async function attemptAutoLogin(): Promise<boolean> {
  const refresh_token = localStorage.getItem(KEY_REFRESH);
  if (!refresh_token)
    return false;

  return await _getToken("refresh", refresh_token);
}

export class Project {
  oid: string;
  name: string;
  constructor(oid: string, name: string) {
    this.oid = oid;
    this.name = name;
  }
}

export const inboxProject = new Project("-", "Inbox");

interface QuireApiOption {
  url: string;
  method: 'post' | 'get';
  data?: any;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const api_getProjects = "/api/project/list";

export async function quireApi(option: QuireApiOption) {
  const token = localStorage.getItem(KEY_TOKEN);
  $.ajax({
    url: `${QUIRE_URL}${option.url}`,
    method: option.method,
    headers: {"Authorization": `Bearer ${token}`},
    success: option.onSuccess,
    error: option.onError,
  })
}

export async function getProjects() {
  return await new Promise<Project[]>((resolve, reject) => {
    quireApi({
      url: api_getProjects,
      method: 'get',
      onSuccess: (projects) => {
        if (projects instanceof Array) {
          const list = [
            inboxProject,
            ...projects.map((project: any) => new Project(project.oid, project.name))
                .sort((a: Project, b: Project) => a.name.localeCompare(b.name))
          ]
          resolve(list);
        }
        else
          reject("Failed to fetch projects.");
      },
      onError: (error) => {
        console.error(error);
        reject(error);
      }
    });
  })
};