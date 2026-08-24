import Image from "next/image"

const CategoryBanner = ({ title, bannerImage }) => {
  return (
    <div className="relative h-[150px] md:h-[350px] overflow-hidden w-full md:w-[85%] mx-auto">
      <Image src={bannerImage} alt={title} quality={100} width={1280} height={720} className="w-full h-full object-contain" priority />
    </div>
  )
}

export default CategoryBanner