import Stripe from "stripe";
import { stripe } from "@/utils/stipe";
import { Plan } from "@/generated/prisma";
import prisma from "@/lib/prisma";


/**
 * Salvar, atyualizar ou deletar informações das assinaturas no banco de dados, sincronizando com a stripe.
*/
export async function manageSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
  deleteAction = false,
  type?: Plan
) {
  const findUSer = await prisma.user.findFirst({
    where: {
      stripe_customer_id: customerId,
    }
  });
  if (!findUSer) {
    return Response.json({ error: "Falha ao realizar assinatura" }, { status: 400 })
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: findUSer.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    plan: type ?? "NORMAL"
  }

  if (subscriptionId && deleteAction) {
    await prisma.subscription.delete({
      where: {
        id: subscriptionId
      }
    });
    return;
  }

  if (createAction) {
    try {
      await prisma.subscription.create({
        data: subscriptionData
      });

    } catch (error) {
      console.log("Erro ao salvar assinatura no banco", error);
      return Response.json({ error: "Falha ao atualizar no banco a assinatura" }, { status: 400 });
    }
  } else {
    try {
      const findSubscription = await prisma.subscription.findFirst({
        where: {
          id: subscriptionId
        }
      });
      if (!findSubscription) return;
      await prisma.subscription.update({
        where: {
          id: findSubscription.id,
        },
        data: {
          status: subscription.status,
          priceId: subscription.items.data[0].price.id,
        }
      });

    } catch {
      return Response.json({ error: "Falha ao atualizar no banco a assinatura" }, { status: 400 });
    }
  }

  return;

}