console.log('connected main.js')

//navbar 

const htmlToInject = `
<img src="/images/sunburst.png" height="75px" width="100px"> 
<a class="navlink" id="home" href="/index.html">home</a>
<a class="navlink" id="about" href="/about/index.html">about</a>
<a class="navlink" id="services" href="/services/index.html">services</a>
<a class="navlink" id="contact" href="/contact/index.html">contact</a>
<span id="vws">Vegas Web Solutions™</span>
`

let navEl = document.getElementById('navbar');

//set active class 

navEl.innerHTML = htmlToInject;
let currentPage = document.querySelector('meta[name=page').getAttribute('content');
let navBarItems = Array.from(document.getElementsByClassName('navlink'));
navBarItems.forEach((item)=>{
    if(item.id==currentPage){
        item.classList.add('selected');
    } else {
        item.classList.remove('selected');
    }
})

// graphs

// total sales graph
const graphTS = document.getElementById('graph-tsot');
let bars1 = Array.from(graphTS?.children[1].children)
let tooltip1 = document.getElementById('ts-bubble');
let interval = 0;
bars1.forEach((bar) => {
    let year = bar.dataset.year;
    let val = bar.dataset.val;
    let heightPct = Math.round((val / 1200000) * 100);
    setTimeout(() => {
        bar.style.height = heightPct + "%";
    }, [100 + interval]);
    interval += 50;
    bar.addEventListener('mouseover', function () {
        changeTooltip1(val, this);
    })
})

const changeTooltip1 = (textVal, el) => {
    let x = el.offsetHeight;
    let y = el.offsetLeft;
    let next = el.nextElementSibling;
    tooltip1.style.bottom = x + 40 + 'px';
    if (next == null) {
        tooltip1.style.left = y - 120 + 'px';
    } else {

        tooltip1.style.left = y + 10 + 'px';
    }
    tooltip1.style.opacity = 1;
    tooltip1.innerText = '$' + textVal + " million";

}


//pct of sales graph

function calcAngleDegrees(x, y) {
    return (Math.atan2(y, x) * 180) / Math.PI;
}
const graphPct = document.getElementById('graph-pct');

//adjust bar height;
let bars2 = Array.from(graphPct.children[2].children);
bars2.forEach((currentBar) => {
    let val = currentBar.dataset.val;
    let heightPct = val * 5; //for scaling; top of graph is only 20%
    currentBar.style.height = heightPct + "%";

})

//adjust line angle for graph based on height
const adjustLineAngle = () => {
    bars2.forEach((currentBar) => {
        let nextBar = currentBar.nextElementSibling;
        let height1, height2, width;
        height1 = currentBar.offsetHeight;
        width = currentBar.offsetWidth;
        if (nextBar) {
            height2 = nextBar.offsetHeight;
        } else {
            height2 = height1 + 20;
        }
        let heightDiff = height1 - height2;
        let angleToSkew = calcAngleDegrees(width, heightDiff);
        currentBar.style.transform = "skewY(" + angleToSkew + "deg)";
        currentBar.dataset.angle = angleToSkew;
    })
}

//give time to adjust height 
setTimeout(() => {
    adjustLineAngle(), [3000]
})

window.addEventListener('resize', function () {
    adjustLineAngle();
})

//line graph tooltip
let lineToolTip = document.getElementById('line-tooltip');

//change text
const changeTooltip2 = (textVal, el) => {
    let x = el.offsetHeight;
    let y = el.offsetLeft;
    let next = el.nextElementSibling;
    if (next == null) {
        lineToolTip.style.left = y - 120 + 'px';
    } else {

        lineToolTip.style.left = y + 10 + 'px';
    }
    lineToolTip.style.bottom = x + 100 + 'px';
    lineToolTip.style.opacity = 1;
    lineToolTip.innerText = textVal + "% of total sales";
}

//move dot
let dot = document.getElementById('line-dot');
let lineGraph = document.getElementById('graph-pct');
let lines = Array.from(document.getElementsByClassName('line'))

lines.forEach((currentLine) => {
    currentLine.addEventListener('mousemove', function (event) {
        let barRect = currentLine.getBoundingClientRect(); //skewed bar with border top for line
        let graphRect = lineGraph.getBoundingClientRect(); //graph wrapper element
        let xPos = event.clientX - graphRect.x; //x pos of mouse minus distance from edge of viewport
        let xPosInBar = event.clientX - barRect.left;
        let currentAngle = currentLine.dataset.angle;
        let yHeight = getTriangleHeight(-currentAngle, xPosInBar);
        let totalHeight = this.offsetHeight + yHeight;
        let pct = (totalHeight / lineGraph.offsetHeight) / 5 * 100;
        let displayPct = Math.round(pct * 100) / 100;
        changeTooltip2(displayPct, this)
        moveDot(xPos, totalHeight)
        changeYearDisp(currentLine.dataset.year);
    })
})
const moveDot = (x, y) => {
    dot.style.left = x - 13 + 'px';
    dot.style.bottom = y - 13 + 'px'
}

const getTriangleHeight = (angle, width) => {
    let rads = convertToRads(angle)
    let height = width * Math.tan(rads);
    return height;
}

const changeYearDisp = (year) => {
    let yearEl = document.getElementById('year-disp');
    yearEl.innerText= year;

}

const convertToRads = (angle) => {
    return angle * (Math.PI / 180);
}

//reset tooltip and dot on window resize

window.addEventListener('resize', function () {
    changeTooltip1('', bars1[0]);
    changeTooltip2('', bars2[0]);
    moveDot(13, bars2[0].offsetHeight)

})




