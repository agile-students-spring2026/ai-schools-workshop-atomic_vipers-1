import { NextRequest, NextResponse } from 'next/server'
import { getDistrictsByIds } from '@/lib/api-client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const idsParam = searchParams.get('ids')

  if (!idsParam) {
    return NextResponse.json(
      { message: 'At least one district ID is required', status: 400 },
      { status: 400 }
    )
  }

  const ids = idsParam.split(',').filter(Boolean)

  if (ids.length === 0) {
    return NextResponse.json(
      { message: 'At least one district ID is required', status: 400 },
      { status: 400 }
    )
  }

  if (ids.length > 5) {
    return NextResponse.json(
      { message: 'Maximum of 5 districts can be compared', status: 400 },
      { status: 400 }
    )
  }

  try {
    const districts = await getDistrictsByIds(ids)
    return NextResponse.json({ districts })
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch districts for comparison', status: 500 },
      { status: 500 }
    )
  }
}
