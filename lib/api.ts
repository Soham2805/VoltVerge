const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

//
// Interfaces
//

export interface EVStation {
  id: number
  name: string
  latitude: number
  longitude: number
  status: string
}

export interface Booking {
  id: number
  station: number // or EVStation if nested
  user: number // or email/username, depending on backend
  start_time: string
  end_time: string
}

//
// Stations
//

export async function getStations(): Promise<EVStation[]> {
  const res = await fetch(`${API_BASE_URL}/stations/`)
  if (!res.ok) throw new Error("Failed to fetch stations")
  return res.json()
}

export async function getStation(id: number): Promise<EVStation> {
  const res = await fetch(`${API_BASE_URL}/stations/${id}/`)
  if (!res.ok) throw new Error("Failed to fetch station")
  return res.json()
}

export async function addStation(data: Partial<EVStation>): Promise<EVStation> {
  const res = await fetch(`${API_BASE_URL}/stations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to add station")
  return res.json()
}

//
// Bookings
//

export async function getBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_BASE_URL}/bookings/`)
  if (!res.ok) throw new Error("Failed to fetch bookings")
  return res.json()
}

export async function getBooking(id: number): Promise<Booking> {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}/`)
  if (!res.ok) throw new Error("Failed to fetch booking")
  return res.json()
}

export async function addBooking(data: Partial<Booking>): Promise<Booking> {
  const res = await fetch(`${API_BASE_URL}/bookings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to add booking")
  return res.json()
}
