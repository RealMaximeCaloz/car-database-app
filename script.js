const leftButton = document.getElementsByClassName("arrow-left")[0].addEventListener('click', handleLeftButtonClick);
const rightButton = document.getElementsByClassName("arrow-right")[0].addEventListener('click', handleRightButtonClick);
const titleBanner = document.getElementsByClassName("title-banner")[0].addEventListener('click', handleTitleBannerClick);


function handleLeftButtonClick(){
    alert("left button was clicked!")
};

function handleRightButtonClick(){
    alert("right button was clicked!")
};

function handleTitleBannerClick(){
    alert("Title Banner was clicked!")
};