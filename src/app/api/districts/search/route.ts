import { NextRequest, NextResponse } from 'next/server'
import { searchDistricts } from '@/lib/api-client'
import { SearchParams, LocaleType, SortField } from '@/lib/types'

const VALID_SORT_FIELDS: SortField[] = [
  'name',
  'enrollment',
  'graduationRate',
  'expenditurePerPupil',
]
const VALID_LOCALES: LocaleType[] = ['urban', 'suburban', 'rural', 'town']

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const query = searchParams.get('query') ?? undefined
  const state = searchParams.get('state') ?? undefined
  const localeParam = searchParams.get('locale') ?? undefined
  const sortByParam = searchParams.get('sortBy') ?? undefined
  const sortOrder = searchParams.get('sortOrder') ?? undefined
  const pageParam = searchParams.get('page')
  const limitParam = searchParams.get('limit')

  const locale =
    localeParam && VALID_LOCALES.includes(localeParam as LocaleType)
      ? (localeParam as LocaleType)
      : undefined

  const sortBy =
    sortByParam && VALID_SORT_FIELDS.includes(sortByParam as SortField)
      ? (sortByParam as SortField)
      : undefined

  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1
  const limit = limitParam
    ? Math.min(100, Math.max(1, parseInt(limitParam, 10)))
    : 20

  const params: SearchParams = {
    query,
    state,
    locale,
    sortBy,
    sortOrder: sortOrder === 'desc' ? 'desc' : 'asc',
    page: isNaN(page) ? 1 : page,
    limit: isNaN(limit) ? 20 : limit,
  }

  try {
    const result = await searchDistricts(params)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { message: 'Failed to search districts', status: 500 },
      { status: 500 }
    )
  }
}
