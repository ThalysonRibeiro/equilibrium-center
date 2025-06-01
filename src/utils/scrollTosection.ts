type scrolTypes = "instant" | "smooth"

export const scrollTosection = (id: string, scrollMod: scrolTypes) => {
  if (typeof window !== "undefined") {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: scrollMod })
    }
  }
}