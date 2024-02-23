import { Database } from "sqlite3"
import { startDb } from "../dbPrepare"
import { users as userSeeds } from "../seeds/users"
import { IUserEntity } from "../../interfaces/IUserEntity"

describe('db_prepare', () => {
  it('should take user with id=1', (done) => {
    startDb()
      .then((db: Database) => {
        db.get('SELECT * FROM users WHERE id=1', (err, res: IUserEntity) => {
          if (err) {
            done(err)
          }
          expect(res.username).toEqual(userSeeds[0].username)
          done()
        })

      })
  })
})

// export default {}