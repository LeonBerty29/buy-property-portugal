"use client";
import { GridTileImage } from './tile';

export function CarouselSlider({ 
  pauseOnHover = false, 
  direction = 'left' 
}: { 
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
}) {

  const products = [
    "/images/discover/discover-slide-1.png",
    "/images/discover/discover-slide-2.png",
    "/images/discover/discover-slide-3.png",
    "/images/discover/discover-slide-4.png",
    "/images/discover/discover-slide-5.png",
    "/images/discover/discover-slide-6.png",
  ];

  if (!products?.length) return null;

  const carouselProducts = [...products, ...products];

  return (
    <div className="w-full overflow-hidden pb-6">
      <style jsx>{`
        @keyframes slideLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes slideRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .sliding-carousel {
          animation: ${direction === 'left' ? 'slideLeft' : 'slideRight'} 60s linear infinite;
          will-change: transform;
        }
        
        ${pauseOnHover ? '.sliding-carousel:hover { animation-play-state: paused; }' : ''}
      `}</style>
      
      <ul className="flex sliding-carousel gap-4 w-max">
        {carouselProducts.map((url, i) => (
          <li
            key={`discover-sider-images${i}`}
            className="relative h-[270px] w-[424px] flex-none"
          >
            <div className="relative h-full w-full">
              <GridTileImage
                alt={`discover-slide-${i}`}
                src={url}
                fill
                sizes="424px"
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}