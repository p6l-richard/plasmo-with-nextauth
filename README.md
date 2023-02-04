# Plasmo with NextAuth

## About

Structure

```
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ plasmo
  |   ├─ React Native using React 18
  |   ├─ Custome Wrapper around NextAuth react hooks
  |   └─ API calls using react-query
  └─ next.js
      ├─ Next.js 13
      ├─ React 18
      ├─ TailwindCSS
      ├─ E2E Typesafe API Server & Client
      └─ Exemplatory REST endpoints included
packages
 ├─ api
 |   └─ tRPC v10 router definition
 ├─ auth
     └─ authentication using next-auth.
 └─ db
     └─ typesafe db-calls using Prisma
```


## Quick Start

To get it running, follow the steps below:

### Setup dependencies

```
# Install dependencies
pnpm i
```

#### Configure environment variables.

There is an `.env.example` in the root directory you can use for reference
```
cp .env.example .env
```


##### Configure Plasmo's environment variables
We're following https://docs.plasmo.com/quickstarts/with-stripe#set-up-fixed-extension-id-for-development on pinning your extension ID:

```
openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out key.pem
openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out key.pem
```
Copy this value into a new apps/plasmo/.env.local
```
# // .env.local
# ...
# CRX_PUBLIC_KEY=v47...
```
Update plasmo's manifest:
```
# apps/plasmo/package.json
{
 "manifest": {
 ...
 "key": "$CRX_PUBLIC_KEY"
 }
}
```
Now, copy the extension id from `chrome://extensions` into the .env file in the root
```
# The extension ID is required to make the chrome.runtime.sendMessage available in NextJS
# @see https://developer.chrome.com/docs/extensions/mv3/messaging/#external-webpage

NEXT_PUBLIC_EXTENSION_ID=elj...
```

### Prepare the database
```
# Deploy the database with
pnpm db-up
```

```
# Push the Prisma schema to your database

pnpm db:push
```

### Run `pnpm dev` at the project root folder.

> **TIP:** It might be easier to run each app in separate terminal windows so you get the logs from each app separately. You can run `pnpm --filter plasmo dev` and `pnpm --filter nextjs dev` to run each app in a separate terminal window.


### Done!

Now that you have created your production build, submitted it to the stores, and installed EAS Update, you are ready for anything!

## References

The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).
