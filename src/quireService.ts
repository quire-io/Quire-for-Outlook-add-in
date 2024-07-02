const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const host_url = "https://8461-122-116-28-7.ngrok-free.app";
const redirect_uri = "https://localhost:3000/callback.html";
const auth_url = `${host_url}/oauth?client_id=${client_id}&redirect_uri=${redirect_uri}`;


export function print(msg: any) {//would remove this cheat later
  console.log(msg);
}

let token: string;

export async function auth() {
  let dialog: Office.Dialog;

  return new Promise<string>((resolve, reject) => {
    Office.context.ui.displayDialogAsync(auth_url,
      function (asyncResult) {
        dialog = asyncResult.value;
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
      }
    );
  
    async function processMessage(arg: { message: string , origin: string }) {
      dialog.close();

      if (arg.message !== '')  {
        await getQuireService(arg.message);  
        resolve(token);
      } else {
        reject("Error");
      }
    }
  });
}

async function getQuireService(code: string) {
  await $.post(`http://localhost/oauth/token`, {
    "grant_type": "authorization_code",
    "code": code,
    "client_id": client_id,
    "client_secret": client_secret,
  }, function(response) {
    if (response.error)
      return;
    else
      token = response.access_token;
  });
}