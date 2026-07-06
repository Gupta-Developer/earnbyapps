import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../lib/authHelper';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    // Authenticate the mobile user
    const authUser = getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    // Check Cloudinary configuration
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured on the backend.' },
        { status: 501 }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'earnbyapps_proofs';

    // Generate secure upload signature
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
    });
  } catch (error: any) {
    console.error('Error generating Cloudinary upload signature:', error);
    return NextResponse.json({ error: error.message || 'Signature generation failed' }, { status: 500 });
  }
}
