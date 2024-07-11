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
