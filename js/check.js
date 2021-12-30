const Checking = Check.prototype;
const PR_NUM = 32;
let pr_array = new Array(PR_NUM);

function Check(){
    this.div = document.querySelector(".info-li");
    this.button = document.querySelector(".info-btn");
    this.logo = document.querySelector(".logo");
    this.Engine();
}
function showInfo() {
  $('.info-wrapper').removeClass('closed');
}
function CheckToggle(evt) {
    var values = document.getElementsByName("check");
    for (var i=0; i<values.length; i++) {
      if(values[i].checked){
        $(`.${values[i].value}`).addClass('active');
        pr_array[i] = values[i].value;
      } else{
        $(`.${values[i].value}`).removeClass('active');
        pr_array[i] = '';
      }
    }
    saveCheck(pr_array);

    if (!$('.info-wrapper').hasClass('closed')) {
        $('.info-wrapper').addClass('closed');
        evt.preventDefault();
    }
}
function saveCheck(values) {
  localStorage.setItem("value_array", JSON.stringify(values));
}

function loadCheck() {
  const loadedCheck = localStorage.getItem("value_array");
  var values = JSON.parse(loadedCheck);
  var check = false;

  var checkes = document.getElementsByName("check");

  if(!values){
    $('.info-wrapper').removeClass('closed');
    return false;
  }
  
  for (let i=0; i<PR_NUM; i++) {
      if(values[i]){
        $(`.${values[i]}`).addClass('active');
        check = true;
        checkes[i].checked = true;
      }
  }
  if(check){
    $('.info-wrapper').addClass('closed');
  } else {
    $('.info-wrapper').removeClass('closed');
  }
}
Checking.Engine = function(){
    this.button.addEventListener('click', CheckToggle);
    this.logo.addEventListener('click',showInfo);
    loadCheck();
}

new Check();