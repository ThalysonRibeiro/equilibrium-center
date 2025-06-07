import { stripe } from "@/utils/stripe";
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
  const item = subscription.items.data[0];
  const expirationDate = item?.current_period_end
    ? new Date(item.current_period_end * 1000)
    : null;



  const subscriptionData = {
    id: subscription.id,
    userId: findUSer.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    plan: type ?? "NORMAL",
    expiresAt: expirationDate,
  }

  if (subscriptionId && deleteAction) {
    await prisma.subscription.delete({
      where: {
        id: subscriptionId
      }
    });
    await prisma.user.update({
      where: { id: findUSer.id },
      data: {
        plan: "EXPIRED"
      }
    });
    return;
  }

  if (createAction) {
    try {
      await prisma.subscription.create({
        data: subscriptionData
      });

      await prisma.user.update({
        where: { id: findUSer.id },
        data: {
          plan: subscriptionData.plan
        }
      });

    } catch (error) {
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