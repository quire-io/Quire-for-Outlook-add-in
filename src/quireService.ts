import { AUTH_URL, KEY_TOKEN, KEY_REFRESH, CLIENT_ID, CLIENT_SECRET, QUIRE_URL, M_ERROR_NO_PROJECT, M_ERROR_NO_AUTH, KEY_CURUSER, M_ERROR_TOKEN_EXPIRED } from './constants';

export async function quireAuthentication() {
  let dialog: Office.Dialog;

  return new Promise<void>((resolve, reject) => {
    Office.context.ui.displayDialogAsync(AUTH_URL, {
      height: 70, //percentage
      width: 70,
    }, function (asyncResult) {
        if (asyncResult.status !== Office.AsyncResultStatus.Succeeded)
          reject(asyncResult.error.message.toString() ?? M_ERROR_NO_AUTH);
        dialog = asyncResult.value;
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
      }
    );
  
    async function processMessage(arg: { message: string , origin: string }) {
      dialog.close();

      const code = arg.message;
      if (code !== '')
        getToken("auth", code)
          .then(() => resolve())
          .catch(() => reject(M_ERROR_NO_AUTH));
      else
        reject(M_ERROR_NO_AUTH);
    }
  });
}

async function getToken(type: "auth" | "refresh", data: string) {
  return new Promise<void>((resolve, reject) => {
    $.post(`${QUIRE_URL}/oauth/token`, {
      "grant_type": type === "auth" ? "authorization_code" : "refresh_token",
      "client_id": CLIENT_ID,
      "client_secret": CLIENT_SECRET,
      "code": data,
      "refresh_token": data,
    })
    .done((response) => {
      if (response.error)
        reject(M_ERROR_NO_AUTH);
      else {
        const token = response.access_token;
        const refresh_token = response.refresh_token;
  
        localStorage.setItem(KEY_TOKEN, token);
        localStorage.setItem(KEY_REFRESH, refresh_token);
        getCurrentUser();
        resolve();
      }
    })
    .fail(() => {
      localStorage.clear();
      reject(M_ERROR_NO_AUTH);
    });
  })
}

export async function attemptAutoLogin(): Promise<void> {
  const refresh_token = localStorage.getItem(KEY_REFRESH);
  if (!refresh_token)
    return Promise.reject(M_ERROR_NO_AUTH);

  return await getToken("refresh", refresh_token);
}

export class Project {
  id: string;
  name: string;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

function toQuireDate(date: Date | undefined) {
  if (!date)
    return undefined;
  return new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())).toISOString();
}

export class Task {
  name: string;
  due: string | undefined;
  assignees: string[] | undefined;
  tags: string[] | undefined;
  description: string;
  constructor(name: string, due: Date | undefined, assignees: string[], tags: string[], description: string) {
    this.name = name;
    this.due = toQuireDate(due);
    this.assignees = assignees;
    this.tags = tags;
    this.description = description;
  }
}

export type VoidRun = () => void;

interface QuireApiOption {
  url: string;
  method: 'post' | 'get';
  data?: any;
  contentType?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const api_getProjects = "/api/project/list";
const api_createTask = (oid: string) => `/api/task/id/${oid}`;
const api_getCurrentUser = "/api/user/id/me";

export async function quireApi(option: QuireApiOption) {
  const token = localStorage.getItem(KEY_TOKEN);
  $.ajax({
    url: `${QUIRE_URL}${option.url}`,
    method: option.method,
    headers: {
      "Authorization": `Bearer ${token}`},
    data: option.data,
    success: option.onSuccess,
    error: option.onError,
  })
}

export async function getCurrentUser() {
  return await new Promise<string>((resolve, reject) => {
    quireApi({
      url: api_getCurrentUser,
      method: 'get',
      onSuccess: (user) => {
        localStorage.setItem(KEY_CURUSER, user.oid)
        resolve(user.oid);
      },
      onError: (error) => {
        console.error(error);
        reject();
      }
    });
  })
}

export async function loadProjects() {
  return await new Promise<Project[]>((resolve, reject) => {
    quireApi({
      url: api_getProjects,
      method: 'get',
      onSuccess: (projects) => {
        if (projects instanceof Array) {
          resolve(projects.map((project: any) => new Project(project.id, project.name))
            .sort((a: Project, b: Project) => a.name.localeCompare(b.name)));
        }
        else
          reject(M_ERROR_NO_PROJECT);
      },
      onError: (error) => {
        if (error.status === 400)
          reject(M_ERROR_NO_PROJECT);
        else
          reject(M_ERROR_TOKEN_EXPIRED);
      }
    });
  })
};

export async function createTask(task: Task, projectOid: string) {
  // only set follwers if getCurrentUser is successful
  const currentUser = localStorage.getItem(KEY_CURUSER);

  return await new Promise<string>((resolve, reject) => {
    quireApi({
      url: api_createTask(projectOid),
      method: 'post',
      data: JSON.stringify({
        name: task.name,
        due: task.due,
        assignees: task.assignees,
        tags: task.tags,
        description: task.description,
        followers: currentUser && [currentUser]
      }),
      onSuccess(response) {
        if (response.url)
          resolve(response.url);
        else
          reject("Failed to create task.");
      },
      onError(error) {
        if (error.status === 400)
          reject(error.responseJSON.message);
        else
          reject(M_ERROR_TOKEN_EXPIRED);
      }
    });
  })
}