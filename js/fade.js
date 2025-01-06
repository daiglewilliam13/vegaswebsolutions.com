//animate when entering viewport

let divsToAnimate = Array.from(document.querySelectorAll('[data-animate]'));

window.addEventListener('scroll', (e) =>{
    animateFadeIn();
})

const inViewCheck = (div) => {
    let dimensions = div.getBoundingClientRect();
    if (dimensions.top > 0 && dimensions.top < window.innerHeight) {
        div.classList.remove('hide');
        div.classList.add('show');
    } 
}

const animateFadeIn = () => {
    let delay=100;
    divsToAnimate.forEach((div)=>{
        setTimeout(()=>{
            inViewCheck(div)
        },delay)
        delay += 100
    })
}
divsToAnimate.forEach((div)=>{
    div.classList.add('hide');
})
animateFadeIn();