import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Costume from '@/models/Costume';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const costume = await Costume.findById(params.id);

    if (!costume) {
      return NextResponse.json(
        { success: false, error: 'Costume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: costume });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const costume = await Costume.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!costume) {
      return NextResponse.json(
        { success: false, error: 'Costume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: costume });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const costume = await Costume.findByIdAndDelete(params.id);

    if (!costume) {
      return NextResponse.json(
        { success: false, error: 'Costume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

