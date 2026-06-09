import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'top 88%',
  scrollEnd = 'bottom 10%',
  stagger = 0.03
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    let text = '';
    if (typeof children === 'string') {
      text = children;
    } else if (Array.isArray(children)) {
      text = children.map(c => (typeof c === 'string' ? c : String(c))).join('');
    } else if (children) {
      text = String(children);
    }

    return text.split('').map((char, index) => (
      <span className="char" key={index}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current ?? window;
    const charElements = [...el.querySelectorAll('.char')];
    if (!charElements.length) return;

    // Always start hidden
    gsap.set(charElements, {
      opacity: 0,
      yPercent: 120,
      scaleY: 2.3,
      scaleX: 0.7,
      transformOrigin: '50% 0%',
      willChange: 'opacity, transform'
    });

    // Create the tween as paused — we drive it with ScrollTrigger callbacks
    const tween = gsap.to(charElements, {
      opacity: 1,
      yPercent: 0,
      scaleY: 1,
      scaleX: 1,
      duration: animationDuration,
      ease: ease,
      stagger: stagger,
      paused: true
    });

    // Give the browser one frame to finish layout before creating the trigger
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();

      const trigger = ScrollTrigger.create({
        trigger: el,
        scroller,
        start: scrollStart,
        end: scrollEnd,
        invalidateOnRefresh: true,
        onEnter: () => tween.play(),            // scroll down into view → play
        onLeaveBack: () => tween.reverse(),     // scroll back up → reverse
        onLeave: () => tween.reverse(),         // scroll past top → reverse
        onEnterBack: () => tween.play()         // scroll back down → play again
      });

      // Cleanup
      el._sfTrigger = trigger;
    });

    return () => {
      cancelAnimationFrame(rafId);
      tween.kill();
      el._sfTrigger?.kill();
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <div ref={containerRef} className={`scroll-float ${containerClassName}`}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </div>
  );
};

export default ScrollFloat;
