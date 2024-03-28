"use client"

import { useRef, useEffect } from 'react';
import { images } from '@/components/Images'; 

export default function Home() {

  //Vars
  let progress = 30;
  let startX = 0;
  let active = 0;
  let isDown = false;

  //Contants
  const speedWheel = 0.02;
  const speedDrag = -0.1;

  //Get Z
  const getZindex = (array, index) =>
    array.map((_, i) => (index === i ? array.length : array.length - Math.abs(index - i)));

  //Items
  const $itemsRef = useRef([]);
  const $cursorsRef = useRef([]);

  const displayItems = (item, index, active) => {
    const zIndex = getZindex([...$itemsRef.current], active)[index];
    item.style.setProperty('--zIndex', zIndex);
    item.style.setProperty('--active', (index - active) / $itemsRef.current.length);
  };

  //Animate
  const animate = () => {
    progress = Math.max(0, Math.min(progress, 100));
    active = Math.floor((progress / 100) * ($itemsRef.current.length - 1));

    $itemsRef.current.forEach((item, index) => displayItems(item, index, active));
  };
//   animate();

  //Click on Items
  useEffect(() => {
    $itemsRef.current.forEach((item, i) => {
      item.addEventListener('click', () => {
        progress = (i / $itemsRef.current.length) * 100 + 10;
        animate();
      });
    });
	animate();
  }, []);

  //Handlers
  const handleWheel = (e) => {
    const wheelProgress = e.deltaY * speedWheel;
    progress = progress + wheelProgress;
    animate();
  };

  const handleMouseMove = (e) => {
    if (e.type === 'mousemove') {
      $cursorsRef.current.forEach(($cursor) => {
        $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    }
    if (!isDown) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const mouseProgress = (x - startX) * speedDrag;
    progress = progress + mouseProgress;
    startX = x;
    animate();
  };

  const handleMouseDown = (e) => {
    isDown = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };

  const handleMouseUp = () => {
    isDown = false;
  };

  useEffect(() => {
    document.addEventListener('wheel', handleWheel);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchstart', handleMouseDown);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchstart', handleMouseDown);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <main>
      <div className="carousel">
	  <img src="/gkh-logo.svg" className=" absolute left-2 bottom-2 mobile:w-[40vw]  tablet:w-[30vw] laptop:w-[20vw] " />
        {
		  images.map((item,index) => (
		  	<div key={index} className="carousel-item" ref={(el) => ($itemsRef.current[index] = el)}>
                <div className="carousel-box">
                  <div className="num">{index <= 8 && "0"}{index+1}</div>
                  <img src={item} />
                </div>
              </div>
		  ))
		}

      </div>
      <div className="cursor" ref={(el) => ($cursorsRef.current[0] = el)}></div>
      <div className="cursor cursor2" ref={(el) => ($cursorsRef.current[1] = el)}></div>
    </main>
  );
}
