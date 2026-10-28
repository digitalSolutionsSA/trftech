import { supabase } from './supabase'

export type EnquiryStatus = 'new' | 'contacted' | 'closed'

export interface Enquiry {
  id: string
  created_at: string
  /** Which form it came from */
  source: 'home' | 'security'
  name: string
  phone: string
  email: string | null
  service: string | null
  property_type: string | null
  message: string | null
  status: EnquiryStatus
  /** When the email alert went out (null until sent, or if alerts aren't configured) */
  notified_at: string | null
}

export type EnquiryInput = Pick<Enquiry, 'source' | 'name' | 'phone'> &
  Partial<Pick<Enquiry, 'email' | 'service' | 'property_type' | 'message'>>

const clean = (v?: string | null) => (v && v.trim() ? v.trim() : null)

/**
 * Save an enquiry from a public form. Visitors may insert but not read enquiries back,
 * so this deliberately doesn't `.select()` the new row.
 */
export async function submitEnquiry(input: EnquiryInput) {
  const { error } = await supabase.from('enquiries').insert({
    source: input.source,
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: clean(input.email),
    service: clean(input.service),
    property_type: clean(input.property_type),
    message: clean(input.message),
  })
  if (error) throw error
}
