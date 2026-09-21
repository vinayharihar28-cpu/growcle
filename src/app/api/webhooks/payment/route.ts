import { NextRequest, NextResponse } from "next/server";
import { markAttendance } from "@/features/leadership/actions/leadership-actions";

/**
 * Payment Gateway Webhook Endpoint
 * Accepts incoming payment confirmations from payment aggregators / UPI gateways
 * and automatically marks member attendance as paid & present.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { memberId, meetingId, amount, utr, gatewayTxnId, status } = body;

    if (!memberId || !meetingId) {
      return NextResponse.json(
        { error: "Missing required fields: memberId and meetingId" },
        { status: 400 }
      );
    }

    const isSuccess = status === "SUCCESS" || status === "PAID" || !status;

    await markAttendance({
      memberId,
      meetingId,
      checked: isSuccess,
      paymentMethod: "UPI_GATEWAY",
      utr: utr || gatewayTxnId,
      gatewayTxnId,
      amount: amount ? Number(amount) : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Attendance and transaction successfully synchronized via payment webhook.",
    });
  } catch (error: any) {
    console.error("[PaymentWebhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process payment webhook" },
      { status: 500 }
    );
  }
}
