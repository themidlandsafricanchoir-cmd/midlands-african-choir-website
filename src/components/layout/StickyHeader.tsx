import { useState, useEffect } from 'react';

export default function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    // Set initial state
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return;
    if (scrolled) {
      header.classList.add('bg-black', 'shadow-md');
      header.classList.remove('bg-transparent');
      // Keep text white on dark background
      header.querySelectorAll('.nav-link').forEach(el => {
        el.classList.add('text-white');
        el.classList.remove('text-black');
      });
      header.querySelectorAll('.site-name').forEach(el => {
        el.classList.add('text-white');
        el.classList.remove('text-black');
      });
    } else {
      header.classList.remove('bg-black', 'shadow-md');
      header.classList.add('bg-transparent');
      header.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('text-black');
        el.classList.add('text-white');
      });
      header.querySelectorAll('.site-name').forEach(el => {
        el.classList.remove('text-black');
        el.classList.add('text-white');
      });
    }
  }, [scrolled]);

  return null; // purely behavioural
}
