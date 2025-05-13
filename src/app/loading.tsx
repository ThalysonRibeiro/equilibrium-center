import img_loading from "@/assets/massage-couple.gif";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div>
        <Image
          src={img_loading}
          alt="imagem de carregamento"
          width={100}
          height={100}
        />
      </div>
    </div>
  )
}