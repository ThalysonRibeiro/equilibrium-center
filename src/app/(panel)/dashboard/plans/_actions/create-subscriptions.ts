"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stripe } from "@/utils/stipe";
import { planMap, stripeToDatabasePlan, StripePlan } from "@/utils/plans/plans";

interface SubscriptionProps {
  type: StripePlan;
}

export async function createSubscription({ type }: SubscriptionProps) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return {
      sessionId: "",
      error: "Falha ao ativar plano.",
    };
  }

  const findUser = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!findUser) {
    return {
      sessionId: "",
      error: "Falha ao ativar plano.",
    };
  }

  let customerId = findUser.stripe_customer_id;

  if (!customerId) {
    const stripeCustomer = await stripe.customers.create({
      email: findUser.email,
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        stripe_customer_id: stripeCustomer.id,
      },
    });

    customerId = stripeCustomer.id;
  }

  const price = planMap[type];

  if (!price) {
    return {
      sessionId: "",
      error: "Plano inválido.",
    };
  }

  try {
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      metadata: {
        type,
      },
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    // Atualiza o plano do usuário no banco (tipo lógico)
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: stripeToDatabasePlan[type], // ex: "BASIC"
      },
    });

    return {
      sessionId: stripeCheckoutSession.id,
    };
  } catch (error) {
    console.error(error);

    return {
      sessionId: "",
      error: "Erro ao criar sessão de pagamento.",
    };
  }
}
