import { CardAssessments } from "@/components/card-assesssments";
import { getTestimonials } from "../_data-access/get-testimonials";
import { StarRating } from "@/components/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fakeReviews } from "@/utils/constants";
import { cn } from "@/lib/utils";

export async function Testimonials() {
  const testimonials = await getTestimonials();
  const newArray = [...testimonials, ...fakeReviews];

  let rating: number = 0;
  function totalRating() {
    let ratingTotal: number = 0;
    newArray.forEach(testimonial => {
      ratingTotal += testimonial.rating
    });
    rating = ratingTotal / newArray.length;
    const result = Math.floor(ratingTotal / newArray.length);

    return result
  }

  const fallbackColors = [
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-blue-500",
    "bg-yellow-500"
  ];

  return (
    <section id="testimonial" className="bg-white py-6 sm:px-1 flex flex-col items-center justify-center gap-6">
      <div className="container mx-auto px-6">

        <h2 className="text-primary text-3xl text-center font-bold">
          Amado por massoterapeutas
        </h2>
        <p className="text-center">
          Depoimentos de profissionais de massagem que transformaram suas práticas com nossa plataforma.
        </p>
        <div className="w-full space-y-4 mt-10">
          {(testimonials.length > 0 &&
            <CardAssessments
              testimonials={testimonials}
              starGroup={0}
              endGroup={10}
              reverse={true}
            />
          )}
          {(testimonials.length > 13 &&
            <CardAssessments
              testimonials={testimonials}
              starGroup={10}
              endGroup={20}
              reverse={false}
            />
          )}
          {(testimonials.length > 23 &&
            <CardAssessments
              testimonials={testimonials}
              starGroup={20}
              endGroup={30}
              reverse={true}
            />
          )}
        </div>

        <div className="w-full mt-16 bg-teal-50 rounded-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Junte-se a mais de {'500'} profissionais de massoterapia que confiam no Equilibrium
                Center
              </h3>
              <p className="text-gray-700">
                De profissionais autônomos a clínicas com várias unidades, nossa plataforma se adapta para atender às suas necessidades, mantendo a simplicidade que você deseja.
              </p>
            </div>

            <div>

              <div className="flex -space-x-2">
                {newArray.slice(0, 8).map((avatar, index) => (
                  <Avatar key={avatar.id} className="border border-white">
                    <AvatarImage src={avatar.user.image ?? ""} />
                    <AvatarFallback
                      className={cn(
                        "text-white",
                        fallbackColors[index % fallbackColors.length]
                      )}
                    >
                      {avatar.user.name?.split(" ")[0]?.[0]}
                      {avatar.user.name?.split(" ")[1]?.[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>

              <div>
                <StarRating rating={totalRating()} />
                <p>
                  {rating.toFixed(1)}/5
                  (mais de {newArray.length + 100} avaliações)
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}