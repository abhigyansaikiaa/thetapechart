import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client (requires Service Role Key to bypass RLS if needed, or anon key if RLS allows anon inserts)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }])
      .select();

    if (error) {
      // Check for unique constraint violation (code '23505')
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Email is already subscribed' }, { status: 409 });
      }
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Newsletter Subscribe Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
