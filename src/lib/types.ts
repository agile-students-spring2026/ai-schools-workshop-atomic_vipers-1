export interface District {
  id: string
  name: string
  state: string
  stateAbbreviation: string
  city: string
  locale: LocaleType
  enrollment: number
  graduationRate: number | null
  studentTeacherRatio: number | null
  revenuePerPupil: number | null
  expenditurePerPupil: number | null
}

export type LocaleType = 'urban' | 'suburban' | 'rural' | 'town'

export interface SearchParams {
  query?: string
  state?: string
  locale?: LocaleType
  sortBy?: SortField
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export type SortField =
  | 'name'
  | 'enrollment'
  | 'graduationRate'
  | 'expenditurePerPupil'

export interface SearchResult {
  districts: District[]
  total: number
  page: number
  limit: number
}

export interface CompareRequest {
  ids: string[]
}

export interface ApiError {
  message: string
  status: number
}

export const STATE_ABBREVIATIONS: Record<string, string> = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
}

export const STATES = Object.keys(STATE_ABBREVIATIONS)
