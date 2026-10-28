import type { Format, Language, Status } from "./session"

export type Filters = {
  format?: Format
  status?: Status
  language?: Language
  city?: string
  county?: string
}
