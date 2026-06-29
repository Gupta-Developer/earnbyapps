import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db';

export async function GET() {
  try {
    const campaigns = await sql`SELECT * FROM campaigns ORDER BY created_at DESC`;
    // Map db columns to frontend interface structure
    const formattedCampaigns = campaigns.map(c => ({
      id: c.id,
      name: c.name,
      category: c.category,
      platforms: c.platforms ? c.platforms.split(',') : [],
      earningRate: c.earning_rate,
      averageEarningsPerDay: Number(c.reward),
      difficulty: 'Easy', // default
      rating: 5.0,
      reviewsCount: 1,
      description: c.description || '',
      longDescription: c.long_description || '',
      tags: c.tags ? c.tags.split(',') : [],
      actionText: `Launch ${c.name}`,
      externalUrl: c.external_url || '',
      targetCountry: c.target_country || 'Global',
      currency: c.currency || 'USD',
      currencySymbol: c.currency_symbol || '$',
      targetCompletions: Number(c.target_completions || 1000),
      videoUrl: c.video_url || undefined,
      reward: Number(c.reward)
    }));
    return NextResponse.json(formattedCampaigns);
  } catch (error: any) {
    console.error('Error fetching campaigns from database:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      category,
      platforms,
      earningRate,
      description,
      longDescription,
      tags,
      externalUrl,
      targetCountry,
      currency,
      currencySymbol,
      targetCompletions,
      videoUrl,
      reward
    } = body;

    const platformsStr = Array.isArray(platforms) ? platforms.join(',') : (platforms || 'Web');
    const tagsStr = Array.isArray(tags) ? tags.join(',') : (tags || '');
    const rewardNum = Number(reward) || 0.50;
    const compsCount = Number(targetCompletions) || 1000;
    const finalId = id || `custom-${Date.now()}`;

    await sql`
      INSERT INTO campaigns (
        id, name, category, platforms, earning_rate, reward, 
        description, long_description, tags, external_url, 
        target_country, currency, currency_symbol, target_completions, video_url
      ) VALUES (
        ${finalId}, ${name}, ${category}, ${platformsStr}, ${earningRate}, ${rewardNum},
        ${description}, ${longDescription || description}, ${tagsStr}, ${externalUrl},
        ${targetCountry || 'Global'}, ${currency || 'USD'}, ${currencySymbol || '$'}, ${compsCount}, ${videoUrl || null}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        platforms = EXCLUDED.platforms,
        earning_rate = EXCLUDED.earning_rate,
        reward = EXCLUDED.reward,
        description = EXCLUDED.description,
        long_description = EXCLUDED.long_description,
        tags = EXCLUDED.tags,
        external_url = EXCLUDED.external_url,
        target_country = EXCLUDED.target_country,
        currency = EXCLUDED.currency,
        currency_symbol = EXCLUDED.currency_symbol,
        target_completions = EXCLUDED.target_completions,
        video_url = EXCLUDED.video_url
    `;

    return NextResponse.json({ success: true, campaignId: finalId });
  } catch (error: any) {
    console.error('Error saving campaign to database:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
