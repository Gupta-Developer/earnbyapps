import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';
import { getAuthenticatedUser } from '../../../../lib/authHelper';

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

export async function GET(request: Request) {
  try {
    const authUser = getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    await ensureSubmissionsTable();
    const rows = await sql`
      SELECT * 
      FROM submissions 
      WHERE user_email = ${authUser.email} 
      ORDER BY created_at DESC
    `;
    
    const formatted = rows.map(r => {
      let timeStr = 'Just now';
      if (r.created_at) {
        try {
          const d = new Date(r.created_at);
          if (!isNaN(d.getTime())) {
            timeStr = d.toLocaleString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
          }
        } catch (e) {
          // fallback
        }
      }
      return {
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
        time: timeStr,
        verifierEmail: r.verifier_email,
        verificationType: r.verification_type as 'admin' | 'creator',
        referralSlotId: r.referral_slot_id || undefined
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error('Error fetching mobile submissions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    await ensureSubmissionsTable();
    const body = await request.json();
    const { appId, proof, proofType, proofUrl, referralSlotId } = body;

    if (!appId || !proof) {
      return NextResponse.json({ error: 'Missing appId or proof.' }, { status: 400 });
    }

    // Retrieve user's full name
    const users = await sql`SELECT full_name FROM users WHERE id = ${parseInt(authUser.id)}`;
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    const userName = users[0].full_name;

    // Retrieve campaign details to prevent tampering
    // Ensure columns exist (Self-migrating)
    try {
      await sql`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS assigned_email VARCHAR(255)`;
    } catch (migErr) {
      // Ignored
    }
    
    const campaigns = await sql`SELECT name, reward, assigned_email FROM campaigns WHERE id = ${appId}`;
    if (campaigns.length === 0) {
      return NextResponse.json({ error: 'Campaign not found.' }, { status: 404 });
    }

    const campaign = campaigns[0];
    const appName = campaign.name;
    const reward = Number(campaign.reward);
    const verifierEmail = campaign.assigned_email || 'admin';
    const verificationType = campaign.assigned_email ? 'creator' : 'admin';

    const submissionId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const finalProofType = proofType && proofType !== 'text' ? proofType : (proofUrl ? 'image' : 'text');

    await sql`
      INSERT INTO submissions (
        id, user_name, user_email, app_name, app_id, reward,
        proof, proof_type, proof_url, status, verifier_email,
        verification_type, referral_slot_id
      ) VALUES (
        ${submissionId}, ${userName}, ${authUser.email}, ${appName}, ${appId}, ${reward},
        ${proof}, ${finalProofType}, ${proofUrl || null}, 'Pending', ${verifierEmail},
        ${verificationType}, ${referralSlotId || null}
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Submission received successfully!',
      submissionId
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating mobile submission:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
