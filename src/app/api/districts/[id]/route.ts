import { NextRequest, NextResponse } from 'next/server'
import { getDistrictById } from '@/lib/api-client'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (!id) {
    return NextResponse.json(
      { message: 'District ID is required', status: 400 },
      { status: 400 }
    )
  }

  try {
    const district = await getDistrictById(id)

    if (!district) {
      return NextResponse.json(
        { message: 'District not found', status: 404 },
        { status: 404 }
      )
    }

    return NextResponse.json(district)
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch district', status: 500 },
      { status: 500 }
    )
  }
}
