import { useState, useEffect, useRef } from 'react';

interface NavLink {
  href: string;
  label: string;
}

interface Props {
  links: NavLink[];
  currentPath: string;
}

export default function HamburgerMenu({ links, currentPath }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={menuRef} className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
        className="flex flex-col justify-center items-center gap-[5px] min-w-[44px] min-h-[44px] p-2 text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <span className="block w-6 h-0.5 bg-cream" />
        <span className="block w-6 h-0.5 bg-cream" />
        <span className="block w-6 h-0.5 bg-cream" />
      </button>

      {/* Mobile nav overlay */}
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-50 bg-navy text-cream flex flex-col items-center justify-center transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Close button inside overlay */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation menu"
          className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center text-cream text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          ✕
        </button>

        <nav>
          <ul className="flex flex-col items-center gap-6">
            {links.map((link) => {
              const isActive =
                link.href === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(link.href);

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-2xl font-sans transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                      isActive ? 'font-bold text-gold' : 'font-normal text-cream'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
