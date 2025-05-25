import { NextResponse } from 'next/server';
import Stripe from "stripe";
import { stripe } from "@/utils/stipe";
import { manageSubscription } from '@/utils/manage-subscription';
import { Plan } from '@/generated/prisma';
import { revalidatePath } from 'next/cache';

export const POST = async (req: Request) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }

  const text = await req.text();
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_SECRETE_WEBHOOK_KEY as string,
  );

  switch (event.type) {
    case "customer.subscription.deleted":
      const payment = event.data.object as Stripe.Subscription;
      await manageSubscription(
        payment.id,
        payment.customer.toString(),
        false,
        true
      );

      break;
    case "customer.subscription.updated":
      const paymentIntent = event.data.object as Stripe.Subscription;
      await manageSubscription(
        paymentIntent.id,
        paymentIntent.customer.toString(),
        false,
      );
      revalidatePath("/dashboard/plans");
      break;

    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const type = checkoutSession?.metadata?.type ? checkoutSession?.metadata.type : "NORMAL"

      if (checkoutSession.subscription && checkoutSession.customer) {
        await manageSubscription(
          checkoutSession.subscription.toString(),
          checkoutSession.customer.toString(),
          true,
          false,
          type as Plan
        );
      }
      revalidatePath("/dashboard/plans");
      break;

    default:
      break;
  }

  return NextResponse.json({ received: true });

}