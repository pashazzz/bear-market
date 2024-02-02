declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_HOST: string
      SERVER_PORT: string
      DB_ADDR: string
      NEED_TO_RETURN_TO_INIT_IMAGES_ON_RESTART: string // should be convert to boolean
      SALT_FOR_HASH: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}