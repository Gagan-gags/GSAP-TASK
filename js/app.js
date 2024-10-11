gsap.registerPlugin(Observer, ScrollTrigger);

const sections = gsap.utils.toArray(".section");
let currentIndex = 0;
let isAnimating = false; 

const section1Timeline = gsap.timeline({ paused: true });
section1Timeline.from(".section1__Heading", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power2.out"
}).from(".section1__Content", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power2.out"
}, "-=0.5");

const imageTimeline = gsap.timeline({ paused: true });
const images = document.querySelectorAll('.image__icon img');
images.forEach((img, index) => {
  imageTimeline.from(img, {
    scale: 0.5,
    opacity: 0,
    duration: 0.3, 
    ease: "back.out(1.7)",
    delay: index * 0.2 
  });
});

const section2Timeline = gsap.timeline({ paused: true });
section2Timeline.from(".image-container", {
  scale: 0.5,
  opacity: 0,
  duration: 0.5,
  ease: "back.out(1.7)"
}).from("#section2 p", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power2.out"
}, "-=0.5").from(".thumb-image", {
  y: 100,
  opacity: 0,
  duration: 0.5,
  ease: "power2.out"
}, "-=0.5");

const section3Timeline = gsap.timeline({ paused: true });
section3Timeline.from(".right", {
  x: 600, 
  duration: 0.8,
  opacity: 1,
  ease: "power2.out",
  onStart: () => {
    const rightElement = document.querySelector('.right');
    rightElement.style.visibility = "visible";
    rightElement.style.right = "0";
  }
}).from(".secrion3__content__text h2", {
  y: 720,
  duration: 2,
  ease: "power2.out"
}, "-=1").from(".secrion3__content__text p", {
  y: 500,
  duration: 2,
  ease: "power2.out"
}, "-=1");

const section4Timeline = gsap.timeline({ paused: true });
section4Timeline.from(".left", {  
  x: -600, 
  duration: 0.8,
  opacity: 1,
  ease: "power2.out",
  onStart: () => {
    const leftElement = document.querySelector('.left'); 
    leftElement.style.visibility = "visible";
    leftElement.style.left = "0"; 
  }
}).from(".secrion4__content__text h2", {
  y: 720,
  duration: 2,
  ease: "power2.out"
}, "-=1").from(".secrion4__content__text p", {
  y: 600,
  duration: 2,
  ease: "power2.out"
}, "-=1");

ScrollTrigger.create({
  trigger: '#section3',
  start: "top 50%",
  end: "bottom 80%", 
  onEnter: () => {
    section3Timeline.play();
  },
  onLeave: () => {
    gsap.to(".right", {
      width: "100%",  
      duration: 1,
      ease: "power2.inOut"
    });
    gsap.to(".right", {
      opacity: 0,  
      duration: 1,
      delay: 0.5, 
      ease: "power2.inOut"
    });
    gsap.to(".section3__content__text h2, .section3__content__text p", {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: "power2.inOut"
    });
  },
});

ScrollTrigger.create({
  trigger: '#section4',
  start: "top 50%",
  end: "bottom 80%",
  onEnter: () => {
    section4Timeline.play();
  },
  onLeave: () => {
    section4Timeline.reverse();
  }
});

function goToSection(index) {
  if (isAnimating) return;
  console.log("Navigating to section with index:", index);

  index = gsap.utils.wrap(0, sections.length, index);
  currentIndex = index;

  isAnimating = true; 
  gsap.to(sections, {
    duration: 1,
    yPercent: -100 * index, 
    ease: "power1.inOut",
    onComplete: () => {
      console.log('Section transition completed'); 
      if (index === 0) {
        section1Timeline.play();
        imageTimeline.play(); 
      } else if (index === 1) {
        section2Timeline.play();
      } else if (index === 2) {
        section3Timeline.play();
      } else if (index === 3) { 
        section4Timeline.play(); 
      }
      isAnimating = false; 
    },
    onStart: () => {
      if (index !== 0) {
        section1Timeline.pause().progress(0);
        imageTimeline.pause().progress(0);
      }
      if (index !== 1) {
        section2Timeline.pause().progress(0); 
      }
      if (index !== 2) {
        section3Timeline.pause().progress(0); 
      }
      if (index !== 3) { 
        section4Timeline.pause().progress(0);
      }
    }
  });
}

let scrollTimeout;
const debounce = (fn, delay) => {
  return function(...args) {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => fn.apply(this, args), delay);
  };
};

Observer.create({
  type: "wheel,touch,drag",
  tolerance: 10,
  onUp: debounce(() => goToSection(currentIndex - 1), 200),
  onDown: debounce(() => goToSection(currentIndex + 1), 200),
  onDrag: (self) => {
    if (self.deltaY < 0) {
      debounce(() => goToSection(currentIndex - 1), 200)();
    } else {
      debounce(() => goToSection(currentIndex + 1), 200)();
    }
  },
  preventDefault: true
});

goToSection(0);
section1Timeline.play();
