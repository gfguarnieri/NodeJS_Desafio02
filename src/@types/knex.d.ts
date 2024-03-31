// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      name: string
      description: string
      userid: string
      created_at: string
      in_diet: boolean
    }
    users: {
      id: string
      session_id: string
      name: string
      email: string
      created_at: string
    }
  }
}
