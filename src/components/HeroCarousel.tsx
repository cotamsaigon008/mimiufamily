import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CarouselImage {
  name: string;
  src: string;
  bg: string;
  panel: string;
}

// Character roster: 1 male (Martin Hoàng Uy) + 3 female (Tuyết Nguyễn, Mi, Miu).
// Confirmed by screenshot: img4 (green) is the boy → Martin. img2 (blue) is
// the girl → Tuyết. Miu (img3) and Mi (placeholder) are unchanged.
const IMAGES: CarouselImage[] = [
  {
    name: 'Mi',
    // TODO: replace with Mi's real (female) artwork once available.
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F',
  },
  {
    name: 'Martin Hoàng Uy',
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
  },
  {
    name: 'Miu',
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
  },
  {
    name: 'Tuyết Nguyễn',
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
  },
];

type Role = 'center' | 'left' | 'right' | 'back';

const TRANSITION_MS = 650;
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Inline grain texture: fractal noise rendered at low alpha via feColorMatrix.
const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
const GRAIN_DATA_URI = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`;

function roleStyles(role: Role, isMobile: boolean): CSSProperties {
  switch (role) {
    case 'center':
      return {
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: 'none',
        opacity: 1,
        zIndex: 20,
        left: '50%',
        height: isMobile ? '60%' : '92%',
        bottom: isMobile ? '22%' : 0,
      };
    case 'left':
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '20%' : '30%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
      };
    case 'right':
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '80%' : '70%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
      };
    case 'back':
    default:
      return {
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(4px)',
        opacity: 1,
        zIndex: 5,
        left: '50%',
        height: isMobile ? '13%' : '22%',
        bottom: isMobile ? '32%' : '12%',
      };
  }
}

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Preload all four images on mount.
  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // Track mobile breakpoint.
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
    };
  }, []);

  function navigate(direction: 'next' | 'prev') {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) =>
      direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4
    );
    unlockTimer.current = setTimeout(() => {
      setIsAnimating(false);
    }, TRANSITION_MS);
  }

  const center = activeIndex;
  const left = (activeIndex + 3) % 4;
  const right = (activeIndex + 1) % 4;

  function roleFor(i: number): Role {
    if (i === center) return 'center';
    if (i === left) return 'left';
    if (i === right) return 'right';
    return 'back';
  }

  const active = IMAGES[activeIndex];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: active.bg,
        transition: `background-color ${TRANSITION_MS}ms ${EASE}`,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>
        {/* 1. Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: GRAIN_DATA_URI,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* 2. Giant ghost text */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none uppercase"
          style={{
            zIndex: 2,
            top: '18%',
            fontFamily: 'Anton, sans-serif',
            fontSize: 'clamp(90px, 28vw, 380px)',
            fontWeight: 900,
            color: '#fff',
            opacity: 1,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          3D Shape
        </div>

        {/* 3. Top-left brand label */}
        <div
          className="absolute top-6 left-4 sm:left-8 text-xs font-semibold uppercase"
          style={{ zIndex: 60, color: '#fff', opacity: 0.9, letterSpacing: '0.18em' }}
        >
          Toonhub
        </div>

        {/* 4. Carousel */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((item, i) => {
            const role = roleFor(i);
            const style = roleStyles(role, isMobile);
            return (
              <div
                key={item.name}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  transition: `transform ${TRANSITION_MS}ms ${EASE}, filter ${TRANSITION_MS}ms ${EASE}, opacity ${TRANSITION_MS}ms ${EASE}, left ${TRANSITION_MS}ms ${EASE}`,
                  willChange: 'transform, filter, opacity',
                  ...style,
                }}
              >
                <img
                  src={item.src}
                  alt=""
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* 5. Bottom-left text + nav buttons */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: 320 }}
        >
          <div
            className="font-semibold uppercase tracking-widest mb-1 text-[11px] sm:text-xs"
            style={{ color: '#fff', opacity: 0.8, letterSpacing: '0.16em' }}
          >
            {active.name}
          </div>
          <div
            className="font-bold uppercase tracking-widest mb-2 sm:mb-3 text-base sm:text-[22px]"
            style={{ color: '#fff', opacity: 0.95, letterSpacing: '0.02em' }}
          >
            Toonhub Figurines
          </div>
          <p
            className="hidden sm:block text-xs sm:text-sm mb-4 sm:mb-5"
            style={{ color: '#fff', opacity: 0.85, lineHeight: 1.6 }}
          >
            The artwork is stunning, shipped fully prepared. The finish is a
            vision, the 3D craft is flawless. Many thanks! Wishing you the
            win. Order now.
          </p>
          <div className="flex gap-3">
            <NavButton direction="prev" onClick={() => navigate('prev')} />
            <NavButton direction="next" onClick={() => navigate('next')} />
          </div>
        </div>

        {/* 6. Bottom-right discover link */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 uppercase"
          style={{
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Anton, sans-serif',
            fontSize: 'clamp(20px, 4vw, 56px)',
            fontWeight: 400,
            color: '#fff',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textDecoration: 'none',
            transition: 'opacity 200ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.95')}
        >
          <span style={{ opacity: 0.95 }}>Discover it</span>
          <ArrowRight
            className="w-5 h-5 sm:w-8 sm:h-8"
            style={{ marginLeft: 8 }}
            strokeWidth={2.25}
          />
        </a>
      </div>
    </div>
  );
}

function NavButton({
  direction,
  onClick,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = direction === 'prev' ? ArrowLeft : ArrowRight;

  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
      style={{
        backgroundColor: hovered ? 'rgba(255,255,255,0.12)' : 'transparent',
        border: '2px solid #fff',
        color: '#fff',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 150ms, background-color 150ms',
        cursor: 'pointer',
      }}
    >
      <Icon size={26} strokeWidth={2.25} />
    </button>
  );
}
