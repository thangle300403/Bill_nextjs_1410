import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Product } from "@/types/product";
import ProductCard from "@/components/Product";

interface RelatedProductSliderProps {
  relatedProducts: Product[];
}

export default function RelatedProductSlider({
  relatedProducts,
}: RelatedProductSliderProps) {
  if (!relatedProducts.length) {
    return (
      <p className="text-center text-muted">Không có sản phẩm liên quan.</p>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <h2 className="text-lg font-bold mb-4">Sản phẩm liên quan</h2>
      <Carousel
        opts={{ align: "start", loop: false }}
        plugins={[Autoplay({ delay: 3000 })]}
        className="w-full overflow-hidden"
      >
        <CarouselContent>
          {relatedProducts.map((product) => (
            <CarouselItem
              key={product.id}
              className="md:basis-1/3 sm:basis-1/2 basis-full px-2"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* More visible arrows */}
        <CarouselPrevious className="!w-12 !h-12 !text-2xl bg-white border rounded-full shadow-lg left-2" />
        <CarouselNext className="!w-12 !h-12 !text-2xl bg-white border rounded-full shadow-lg right-2" />
      </Carousel>
    </div>
  );
}
