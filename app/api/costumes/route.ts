import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Costume from '@/models/Costume';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const available = searchParams.get('available');

    const filter: any = {};

    if (type) {
      filter.type = type;
    }

    if (size) {
      filter.size = { $in: [size] };
    }

    if (color) {
      filter.color = { $in: [color] };
    }

    if (available !== null) {
      filter.available = available === 'true';
    }

    const costumes = await Costume.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: costumes });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const costume = await Costume.create(body);

    return NextResponse.json({ success: true, data: costume }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

