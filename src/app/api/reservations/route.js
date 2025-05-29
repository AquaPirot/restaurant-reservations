import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Preuzmi sve rezervacije
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    })
    
    return NextResponse.json(reservations)
  } catch (error) {
    console.error('Greška pri dohvatanju rezervacija:', error)
    return NextResponse.json(
      { error: 'Greška pri dohvatanju rezervacija' },
      { status: 500 }
    )
  }
}

// POST - Dodaj novu rezervaciju
export async function POST(request) {
  try {
    const data = await request.json()
    
    // Validacija
    if (!data.name || !data.phone || !data.date || !data.time) {
      return NextResponse.json(
        { error: 'Nedostaju obavezna polja' },
        { status: 400 }
      )
    }

    const reservation = await prisma.reservation.create({
      data: {
        name: data.name,
        phone: data.phone,
        date: data.date,
        time: data.time,
        guests: parseInt(data.guests) || 1,
        tableNumber: data.tableNumber ? parseInt(data.tableNumber) : null,
        type: data.type || 'standard',
        notes: data.notes || null,
        createdBy: data.createdBy || 'Konobar'
      }
    })

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    console.error('Greška pri kreiranju rezervacije:', error)
    return NextResponse.json(
      { error: 'Greška pri kreiranju rezervacije' },
      { status: 500 }
    )
  }
}

// DELETE - Obriši rezervaciju
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID rezervacije je obavezan' },
        { status: 400 }
      )
    }

    await prisma.reservation.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Greška pri brisanju rezervacije:', error)
    return NextResponse.json(
      { error: 'Greška pri brisanju rezervacije' },
      { status: 500 }
    )
  }
}