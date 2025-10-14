import { Product } from "@/types/product";
import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

interface ProductSiderProps {
  product: Product & {
    thumbnailItems?: { name: string }[];
  };
}

export default function ProductSider({ product }: ProductSiderProps) {
  const images = [
    {
      original: product.featured_image,
      thumbnail: product.featured_image,
    },
  ];

  if (product.thumbnailItems?.length) {
    for (const image of product.thumbnailItems) {
      images.push({
        original: image.name,
        thumbnail: image.name,
      });
    }
  }

  return <ImageGallery items={images} />;
}
