import img_bg_hero from "@/assets/bg-3.png";
import Image from "next/image";

export function BgHero() {
  return (
    <>
      <div className=" w-full absolute h-screen min-h-175 -z-10">
        <Image
          src={img_bg_hero}
          alt="imagem do hero inlustratica"
          fill
          className="object-cover"
          sizes="(max-width:480px) 100vw (max-width: 1024px) 75vw, 60vw"
        />
      </div>
    </>
  )
}