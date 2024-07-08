# Quire for Outlook add-in

Transform emails into action items in [Quire](https://quire.io).

## How to dev 

### on Mac

[Guide](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/sideload-outlook-add-ins-for-testing)

1. Upload `manifest.xml` to outlook manually
2. Do `npm run dev-server` to host dev server


## How to build

1. Prepare `.env` contains the following informations:
```
CLIENT_ID = client-id
CLIENT_SECRET = client-secret
HOST_URL = add-in-cdn-url //ex. https://ms-outlook-quire.io
QUIRE_URL = quire-url
```

2. Edit `manifest.xml`, replace the value of these fields below if necessary. `<AppDomains>` would have to contain all used domain in add-ins.
```xml
<DisplayName DefaultValue="Quire"/><!-- ? Add-in name -->
<Description DefaultValue="Unfold your idea."/><!-- ? Add-in description -->
<SupportUrl DefaultValue="https://quire.io/help"/><!-- ? Add-in support url -->
<AppDomains><!-- ! Add-in domains -->
  <AppDomain>https://quire.io</AppDomain>
  <AppDomain>https://ms-outlook.quire.io/</AppDomain>
</AppDomains>
```  

3. Replace `urlProd` in `webpack.config.js` if needed.
```js
const urlProd = "https://ms-outlook.quire.io/";
```

4. Do `npm run build`
5. The files for deployment would be in `./dist`
```
/polyfill.js
/vendor.js
/callback.html
/callback.js
/taskpane.html
/taskpane.js

/assets/logo_16.png
/assets/logo_32.png
/assets/logo_64.png
/assets/logo_80.png
/assets/logo_128.png
/assets/loading.png
/assets/welcome_start.png
```