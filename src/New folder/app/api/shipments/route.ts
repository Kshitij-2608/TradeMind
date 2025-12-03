import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ShipmentData } from '@/types/shipment';

/**
 * GET /api/shipments
 * Retrieve all shipments with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const product = searchParams.get('product');
    const currency = searchParams.get('currency');
    const anomaly = searchParams.get('anomaly');

    // Build filter object
    const where: any = {};
    if (product && product !== 'All') {
      where.product = product;
    }
    if (currency && currency !== 'All') {
      where.currency = currency;
    }
    if (anomaly !== null) {
      where.anomaly = anomaly === 'true';
    }

    // Fetch from database
    const shipments = await db.shipment.findMany({
      where,
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true,
      data: shipments,
      count: shipments.length
    });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shipments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shipments
 * Create a new shipment record
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'date', 'shipmentId', 'product', 'quantity', 'pricePerUnit',
      'currency', 'marketImpactScore', 'delayInDays', 'riskScore',
      'profit', 'cost', 'anomaly'
    ];

    for (const field of requiredFields) {
      if (!(field in body)) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new shipment
    const shipment = await db.shipment.create({
      data: {
        date: new Date(body.date),
        shipmentId: body.shipmentId,
        product: body.product,
        quantity: parseInt(body.quantity),
        pricePerUnit: parseFloat(body.pricePerUnit),
        currency: body.currency,
        marketImpactScore: parseFloat(body.marketImpactScore),
        delayInDays: parseInt(body.delayInDays),
        riskScore: parseFloat(body.riskScore),
        profit: parseFloat(body.profit),
        cost: parseFloat(body.cost),
        anomaly: Boolean(body.anomaly)
      }
    });

    return NextResponse.json(
      { success: true, data: shipment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create shipment' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/shipments/:id
 * Update an existing shipment record
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Shipment ID is required' },
        { status: 400 }
      );
    }

    // Update shipment
    const shipment = await db.shipment.update({
      where: { id },
      data: {
        ...(data.date && { date: new Date(data.date) }),
        ...(data.product && { product: data.product }),
        ...(data.quantity && { quantity: parseInt(data.quantity) }),
        ...(data.pricePerUnit && { pricePerUnit: parseFloat(data.pricePerUnit) }),
        ...(data.currency && { currency: data.currency }),
        ...(data.marketImpactScore !== undefined && { marketImpactScore: parseFloat(data.marketImpactScore) }),
        ...(data.delayInDays !== undefined && { delayInDays: parseInt(data.delayInDays) }),
        ...(data.riskScore !== undefined && { riskScore: parseFloat(data.riskScore) }),
        ...(data.profit !== undefined && { profit: parseFloat(data.profit) }),
        ...(data.cost !== undefined && { cost: parseFloat(data.cost) }),
        ...(data.anomaly !== undefined && { anomaly: Boolean(data.anomaly) })
      }
    });

    return NextResponse.json({ success: true, data: shipment });
  } catch (error) {
    console.error('Error updating shipment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update shipment' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/shipments/:id
 * Delete a shipment record
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Shipment ID is required' },
        { status: 400 }
      );
    }

    await db.shipment.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Shipment deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting shipment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete shipment' },
      { status: 500 }
    );
  }
}
