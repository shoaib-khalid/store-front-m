import { sliderOpt } from 'src/app/shared/data';

export const introSlider = {
    ...sliderOpt,
    nav: false,
    dots: true,
    loop: false
}

export const brandSlider = {
    nav: false,
    dots: false,
    margin: 0,
    loop: false,
    responsive: {
        0: {
            items: 2
        },
        480: {
            items: 3
        },
        768: {
            items: 4
        },
        992: {
            items: 6
        }
    }
}

export const serviceSlider = {
    ...sliderOpt,
    nav: false,
    dots: false,
    margin: 20,
    loop: false,
    responsive: {
        0: {
            items: 1
        },
        480: {
            items: 2
        },
        768: {
            items: 2
        },
        992: {
            items: 3
        }
    }
}

export const productSlider = {
    ...sliderOpt,
    nav: false,
    dots: true,
    margin: 0,
    loop: false,
    autoHeight: false,
    responsive: {
        0: {
            items: 2
        },
        576: {
            items: 3
        },
        992: {
            items: 4,
            nav: true
        },
        1200: {
            items: 6,
            nav: true
        }
    }
}

export const bannerSlider = {
    ...sliderOpt,
    nav: false,
    dots: false,
    items: 1,
    margin: 10,
    loop: false,
    responsive: {
        0: {
            items: 1
        },
        576: {
            items: 2
        },
        992: {
            items: 3
        }
    }
}

export const instagramSlider = {
    ...sliderOpt,
    nav: false,
    dots: false,
    items: 2,
    margin: 20,
    loop: false,
    responsive: {
        576: {
            items: 3
        },
        992: {
            items: 4
        },
        1200: {
            items: 5
        }
    }
}

export const blogSlider = {
    ...sliderOpt,
    nav: false,
    dots: true,
    items: 3,
    margin: 20,
    loop: false,
    autoHeight: true,
    autoplay: false,
    responsive: {
        0: {
            items: 1
        },
        576: {
            items: 2
        },
        992: {
            items: 3
        },
        1200: {
            items: 4
        }
    }
}