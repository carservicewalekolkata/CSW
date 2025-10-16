export type CustomerActivityVehicle = {
  brandSlug: string
  brandName: string
  modelSlug: string
  modelName: string
  fuelType: string
}

export type CustomerActivityEntry = {
  id: string
  sessionToken: string
  phone: string
  vehicle: CustomerActivityVehicle
  vehicleSummary: string
  createdAt: string
}

export type CustomerSessionRecord = {
  token: string
  phone: string
  createdAt: string
  updatedAt: string
  entries: CustomerActivityEntry[]
}

export type CustomerActivityRequest = {
  sessionToken?: string
  phone?: string
  otpCode?: string
  vehicle: CustomerActivityVehicle
}

export type CustomerActivityResponse = {
  sessionToken: string
  entry: CustomerActivityEntry
  session: CustomerSessionRecord
}
