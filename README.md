# Quire for Outlook add-in

Transform emails into action items in [Quire](https://quire.io).

## How to dev 

### on Mac

1. create `.env` file contains the following variable
```
CLIENT_ID = client-id
CLIENT_SECRET = client-secret
HOST_URL = add-in-hosting-cdn-url
QUIRE_URL = quire-url
```

2. edit `manifest.xml`, put the urls into `<AppDomains>`
```xml
<AppDomains><!-- ! Add-in domains -->
  <AppDomain>QUIRE_URL</AppDomain>
  <AppDomain>HOST_URL</AppDomain>
</AppDomains>
```

3. Upload `manifest.xml` to outlook manually, [Guide](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/sideload-outlook-add-ins-for-testing)

4. Do `npm run dev-server` to host dev server

## Where to upload the `manifest.xml`

[outlook](https://www.microsoft.com/en-us/microsoft-365/outlook)

1. open a message

2. click on `Get add-ins`
   
![image](https://github.com/Whiterzi/Quire-for-Outlook-add-in/assets/99382465/c40af452-08ac-4dd9-803e-df5b7840a41b)

3. My add-ins -> Custom Addins -> Add a Custom add-in -> Add from file...
![image](https://github.com/Whiterzi/Quire-for-Outlook-add-in/assets/99382465/da934ed5-14b8-44fd-871a-2eac1655d887)

4. upload `manifest.xml`