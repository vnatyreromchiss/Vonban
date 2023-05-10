AOS.init();

// You can also pass an optional settings object
// below listed default settings
AOS.init({
  // Global settings:
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
  initClassName: 'aos-init', // class applied after initialization
  animatedClassName: 'aos-animate', // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
  

  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 500, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});




const tabs = document.querySelectorAll('.slider__content__tabs__tab');
const lists = document.querySelectorAll('.slider__content__list');
const images = document.querySelectorAll('.slider__image__img');
const mobileImages = document.querySelectorAll('.slider__mobile_image__img');

const activeTabClassName = 'active_tab';
const displayClass = 'show_list';
const hideClass = 'hide_list';

const displayImgClass = 'show_img';
const hideImgClass = 'hide_img';

const displayMobileImage = 'show_mobile_img';
const hideMobileImage = 'hide_mobile_img';

const deactivateAllTabs = () => {
    tabs.forEach((tab) => {
        tab.classList.remove(activeTabClassName);
    })
}

const hideAllLists = () => {
    lists.forEach(list => {
        list.classList.remove(displayClass);
        list.classList.add(hideClass);
    })
}

const hideAllImages = () => {
    images.forEach(image => {
        image.classList.remove(displayImgClass);
        image.classList.add(hideImgClass);
    })
}

const hideAllMobileImages = () => {
    mobileImages.forEach(mobImg => {
        mobImg.classList.remove(displayMobileImage);
        mobImg.classList.add(hideMobileImage);
    })
}

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        deactivateAllTabs();
        tab.classList.add(activeTabClassName);
        hideAllLists();
        lists[index].classList.add(displayClass);
        lists[index].classList.remove(hideClass);
        hideAllMobileImages();
        if(mobileImages){
            mobileImages[index].classList.add(displayMobileImage);
            mobileImages[index].classList.remove(hideMobileImage);
        }
        
        images[index].classList.add(displayImgClass);
        images[index].classList.remove(hideImgClass);
        setTimeout(() => {
            hideAllImages();
            images[index].classList.add(displayImgClass);
            images[index].classList.remove(hideImgClass);

        }, 400);
        
    })
})




const wrapper = document.querySelector(".facts_wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".facts_card").offsetWidth;
const arrowBtns = document.querySelectorAll(".facts__slides__arrow_button");

const dots = document.querySelectorAll('.facts__dots__conatiner__dot');
const activeDotClass = 'active_dot';
const dotCount = 6;
let currentDot = 0;

const deactivateAllDots = () => {
    dots.forEach(dot => {
        dot.classList.remove(activeDotClass);
    })
}

const carouselChildrens = [...carousel.children];
let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;
// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);
// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});
// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});
// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");
// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;

        deactivateAllDots();
        if(btn.id === 'right'){
            if(currentDot >= dotCount){
                currentDot = 0;
            }else{
                currentDot++;
            }
        }else{
            if(currentDot <= 0){
                currentDot = 6;
            }else{
                currentDot--;
            }
        }
        dots[currentDot].classList.add(activeDotClass);
    });
});

// dots.forEach(dot => {
//     dot.addEventListener('click', () => {
//         console.log(dot.id);
//         const dotId = dot.id;
//         if(currentDot > dotId){

//         }
//     })
// })

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}
const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}
const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}
const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }
    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    // if(!wrapper.matches(":hover")) autoPlay();
}
// const autoPlay = () => {
//     if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
//     // Autoplay the carousel after every 2500 ms
//     timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
// }
//autoPlay();
// carousel.addEventListener("mousedown", dragStart);
// carousel.addEventListener("mousemove", dragging);
// document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
//wrapper.addEventListener("mouseleave", autoPlay);



// "use strict"

const reviewsSwiper = document.querySelector('.swiper-reviews');

if(reviewsSwiper) {
    const swiper = new Swiper('.swiper-reviews', {
        // Optional parameters
        loop: true,
        autoHeight:true,
        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
      });
}