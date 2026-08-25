import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import connectDB from '@/lib/connectDB.js'
import CompanyBasicInfo from '@/models/Admin/CompanyBasicInfo'
import { getCompanyBasicInfo } from '@/services/companyBasicInfo.service'

const normalizeArray = (value) => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => String(item ?? '').trim()).filter(Boolean)
}

const normalizeContactNumbers = (value) => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => String(item ?? '').replace(/\D/g, '').slice(0, 10))
    .filter(Boolean)
}

const normalizeImage = (value) => ({
  url: value?.url || '',
  key: value?.key || '',
})

const normalizePayload = (payload) => ({
  companyName: String(payload?.companyName || '').trim(),
  companyDomainName: String(payload?.companyDomainName || '').trim(),
  contactNumbers: normalizeContactNumbers(payload?.contactNumbers),
  whatsappNumber: String(payload?.whatsappNumber || '').replace(/\D/g, '').slice(0, 10),
  mainLogo: normalizeImage(payload?.mainLogo),
  footerLogo: normalizeImage(payload?.footerLogo),
  mobileUiLogo: normalizeImage(payload?.mobileUiLogo),
  emails: normalizeArray(payload?.emails),
  officeAddresses: normalizeArray(payload?.officeAddresses),
  googleAddress: String(payload?.googleAddress || ''),
  googleUrl: String(payload?.googleUrl || ''),
  googleLink: String(payload?.googleLink || ''),
  facebookLink: String(payload?.facebookLink || ''),
  instagramLink: String(payload?.instagramLink || ''),
  youtubeLink: String(payload?.youtubeLink || ''),
  googleMapLink: String(payload?.googleMapLink || ''),
  googleTrackingTag: String(payload?.googleTrackingTag || ''),
  titleTagForMainLandingPage: String(payload?.titleTagForMainLandingPage || ''),
  keywords: normalizeArray(payload?.keywords),
})

export async function GET() {
  try {
    const companyBasicInfo = await getCompanyBasicInfo()
    return NextResponse.json({ success: true, data: companyBasicInfo }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const payload = await request.json()
    const normalizedPayload = normalizePayload(payload)

    if (!normalizedPayload.companyName) {
      return NextResponse.json({ success: false, error: 'Company name is required' }, { status: 400 })
    }

    if (!normalizedPayload.companyDomainName) {
      return NextResponse.json({ success: false, error: 'Company domain name is required' }, { status: 400 })
    }
    const invalidContactNumber = normalizedPayload.contactNumbers.find((number) => String(number).length !== 10)
    if (invalidContactNumber) {
      return NextResponse.json({ success: false, error: 'Each contact number must be exactly 10 digits' }, { status: 400 })
    }

    const companyBasicInfo = await CompanyBasicInfo.create(normalizedPayload)
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: companyBasicInfo }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    await connectDB()
    const payload = await request.json()
    const normalizedPayload = normalizePayload(payload)
    const { id } = payload || {}

    const invalidContactNumber = normalizedPayload.contactNumbers.find((number) => String(number).length !== 10)
    if (invalidContactNumber) {
      return NextResponse.json({ success: false, error: 'Each contact number must be exactly 10 digits' }, { status: 400 })
    }

    let companyBasicInfo = null

    if (id) {
      companyBasicInfo = await CompanyBasicInfo.findByIdAndUpdate(id, normalizedPayload, {
        new: true,
        runValidators: true,
      })
    } else {
      const existingRecord = await CompanyBasicInfo.findOne().sort({ updatedAt: -1 })

      if (!existingRecord) {
        return NextResponse.json({ success: false, error: 'Company basic info not found' }, { status: 404 })
      }

      companyBasicInfo = await CompanyBasicInfo.findByIdAndUpdate(existingRecord._id, normalizedPayload, {
        new: true,
        runValidators: true,
      })
    }

    if (!companyBasicInfo) {
      return NextResponse.json({ success: false, error: 'Company basic info not found' }, { status: 404 })
    }

    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: companyBasicInfo }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}