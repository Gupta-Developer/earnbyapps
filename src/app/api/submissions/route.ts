import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db';

async function ensureSubmissionsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id VARCHAR(255) PRIMARY KEY,
      user_name VARCHAR(255) NOT NULL,
      user_email VARCHAR(255) NOT NULL,
      app_name VARCHAR(255) NOT NULL,
      app_id VARCHAR(255) NOT NULL,
      reward NUMERIC(10, 2) NOT NULL,
      proof TEXT NOT NULL,
      proof_type VARCHAR(50) DEFAULT 'text',
      proof_url TEXT,
      status VARCHAR(50) DEFAULT 'Pending',
      verifier_email VARCHAR(255) NOT NULL,
      verification_type VARCHAR(50) DEFAULT 'admin',
      referral_slot_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function GET() {
  try {
    await ensureSubmissionsTable();
    const rows = await sql`SELECT * FROM submissions ORDER BY created_at DESC`;
    
    const formatted = rows.map(r => ({
      id: r.id,
      userName: r.user_name,
      userEmail: r.user_email,
      appName: r.app_name,
      appId: r.app_id,
      reward: Number(r.reward),
      proof: r.proof,
      proofType: r.proof_type as 'image' | 'video' | 'text',
      proofUrl: r.proof_url || undefined,
      status: r.status as 'Pending' | 'Approved' | 'Rejected',
      time: new Date(r.created_at).toLocaleDateString() || 'Just now',
      verifierEmail: r.verifier_email,
      verificationType: r.verification_type as 'admin' | 'creator',
      referralSlotId: r.referral_slot_id || undefined
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureSubmissionsTable();
    const body = await req.json();
    const {
      id,
      userName,
      userEmail,
      appName,
      appId,
      reward,
      proof,
      proofType,
      proofUrl,
      status,
      verifierEmail,
      verificationType,
      referralSlotId
    } = body;

    await sql`
      INSERT INTO submissions (
        id, user_name, user_email, app_name, app_id, reward,
        proof, proof_type, proof_url, status, verifier_email,
        verification_type, referral_slot_id
      ) VALUES (
        ${id}, ${userName}, ${userEmail}, ${appName}, ${appId}, ${reward},
        ${proof}, ${proofType}, ${proofUrl || null}, ${status || 'Pending'}, ${verifierEmail},
        ${verificationType}, ${referralSlotId || null}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await ensureSubmissionsTable();
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    await sql`
      UPDATE submissions
      SET status = ${status}
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating submission:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
