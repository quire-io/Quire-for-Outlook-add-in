const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const host_url = "https://52ee-122-116-28-7.ngrok-free.app";
const redirect_uri = "https://localhost:3000/callback.html";
const auth_url = `${host_url}/oauth?client_id=${client_id}&redirect_uri=${redirect_uri}`;

export const KEY_TOKEN = "token";
export const KEY_REFRESH = "refresh_token";

export function print(msg: any) {//would remove this cheat later
  console.log(msg);
}

export async function quireAuthentication() {
  let dialog: Office.Dialog;

  return new Promise<boolean>((resolve, reject) => {
    Office.context.ui.displayDialogAsync(auth_url,
      function (asyncResult) {
        if (asyncResult.status !== Office.AsyncResultStatus.Succeeded)
          reject(asyncResult.error);
        dialog = asyncResult.value;
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
      }
    );
  
    async function processMessage(arg: { message: string , origin: string }) {
      dialog.close();

      if (arg.message !== '')
        resolve(_getQuireService(arg.message));
      else
        reject("Failed to authenticate.");
    }
  });
}

async function _getQuireService(code: string): Promise<boolean> {
  return await $.post(`http://localhost/oauth/token`, {
    "grant_type": "authorization_code",
    "code": code,
    "client_id": client_id,
    "client_secret": client_secret,
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