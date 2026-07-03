import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');

    if (!country) {
      const methods = await sql`
        SELECT id, name, label, placeholder, target_country as "targetCountry", is_active as "isActive"
        FROM payment_methods
        WHERE is_active = true
        ORDER BY id ASC
      `;
      return NextResponse.json(methods);
    }

    // Query active methods matching target country
    const countryMethods = await sql`
      SELECT id, name, label, placeholder, target_country as "targetCountry", is_active as "isActive"
      FROM payment_methods
      WHERE is_active = true AND LOWER(target_country) = ${country.toLowerCase()}
      ORDER BY id ASC
    `;

    if (countryMethods.length > 0) {
      return NextResponse.json(countryMethods);
    }

    // Fallback to Global methods if no country-specific options exist
    const globalMethods = await sql`
      SELECT id, name, label, placeholder, target_country as "targetCountry", is_active as "isActive"
      FROM payment_methods
      WHERE is_active = true AND LOWER(target_country) = 'global'
      ORDER BY id ASC
    `;

    return NextResponse.json(globalMethods);
  } catch (error: any) {
    console.error('Error in GET /api/payment-methods:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
