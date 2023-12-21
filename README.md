# Bear Market

## Before run you should
- install Typescript
- run `npx tsx backend/utils/generateKeyPair.ts` - generate crypto keys for check JWT

------

## Home
- Most recent bears
- Grouped by some criteria
## Customer page
- Owned bears
## Creating the bear
- Upload image with pending for accept from admin ?or
- ? Send request to mage.space or other free ai image generator with api or cheap OpenAI
  - On pending can be no more than 3 bears (or can be changed by admin)
- Available period of sale
- Additional accessories, icons on the corners (0 - 2 credits)
## Bear page
### for all
- give bet for bear card
- start conversation with owner
### for owner/admin
- Adding discounts
- Put it on sale with the common price (between 4 to 10 credits)
- The bear image in original size (access to file only for owner)
## Admin side features
- Admin can accept or decline the new bear from user

## Technologies
- React, Vite
- Node, ExpressJs
- Sqlite

## TODO
- Create authorization mechanism
- Create Bear page
