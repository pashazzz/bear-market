# Bear Market

## Before run you should
- install Typescript
- run `npx tsx backend/utils/generateKeyPair.ts` - generate crypto keys for check JWT

------

## Home
- Most recent bears
- Grouped by some criteria (price, ¿tags?)
## Customer page
- Owned bears
- Moderators can see new uploaded bears and accept/decline them; send explaining to user if it need
## Creating the bear
- Upload image with pending for accept from admin ?or
- ¿ Send request to mage.space or other free ai image generator with api or cheap OpenAI ?
  - On pending can be no more than 3 bears (or can be changed by admin)
- Available period of sale
- Additional accessories, icons on the corners (0 - 2 credits)
## Bear page
### for all
- only see the card details
### for logged in users
- give bid for bear card
- start conversation with owner
### for owner/admin
- Put it on sale with the common price (between 4 to 10 credits)
- The bear image in original size (access to file only for owner)
## Admin side features
- Admin can accept or decline the new bear from user

## Users
### Roles
- Common users, without roles: can own the bear cards and trade them
- Moderators: can accept/decline the new uploaded bears
- Admins: can assign roles

## Technologies
- React, Vite
- Node, ExpressJs
- Sqlite
### Using DB
To have the repeatable process, we will not use the common persistant DB but in-memory.
On server start it'll be seeded and all lifetime of app the changes will appear there.

## Features
- resetable set
- access to image by URL only to owners (using JWT)

## TODO
- Trade process:
  - update last bid automatically, using sockets
  - sending messages between users
  - worker that automatically checks on midnight (UTC) the ended trades and close them
- Create registration process
- Uploading new image for moderating
  - accept/decline it by moderators/admins
- Localization
- Search by
  - title
  - description
  - owner
  - price
- ¿ Tags ?
  - predefined, moderated
  - who can add new one?
- Logging
- Admin
  - assign roles
  - watch logs
  - ban the users
