import img_bg_hero from "@/assets/bg-3.png";
import img_form_1_hero from "@/assets/form-1.png";
import img_form_2_hero from "@/assets/form-2.png";
import img_form_3_hero from "@/assets/form-3.png";
import Image from "next/image";

export function BgHero() {
  return (
    <>
      <div className=" w-full absolute h-175 -z-10">
        <Image
          src={img_bg_hero}
          alt="imagem do hero inlustratica"
          fill
          className="object-cover"
        />
      </div>
      <div className="lg:w-115 lg:h-100 md:w-85 md:h-70 absolute lg:-top-30 -top-20 w-70 h-60 -z-10">
        <Image
          src={img_form_1_hero}
          alt="imagem do hero inlustratica"
          fill
          className="object-cover"
        />
      </div>
      <div className="lg:w-115 lg:h-100 md:w-85 md:h-70 absolute right-0 top-1/2 w-70 h-60 -z-10">
        <Image
          src={img_form_2_hero}
          alt="imagem do hero inlustratica"
          fill
          className="object-cover"
        />
      </div>
      <div className="lg:w-125 lg:h-100 md:w-95 md:h-70 w-80 h-60 -z-10 absolute left-0 lg:-bottom-20 -bottom-0">
        <Image
          src={img_form_3_hero}
          alt="imagem do hero inlustratica"
          fill
          className="object-cover"
        />
      </div>
    </>
  )
}