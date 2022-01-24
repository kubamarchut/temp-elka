var buttons = document.getElementsByClassName('jsact');
var modals = document.getElementsByClassName('modal');

var navNext = document.getElementsByClassName('right');
var navPrev = document.getElementsByClassName('left');

navNext = Array.from(navNext)
navNext.pop();

function deleteAlert(div){
  div.classList.add('close');
  setTimeout(function() {
    div.remove();
  }, 400)
}

function deleteClicked(ev){deleteAlert(ev.target)};

var showAlert = function(type, content){
  var alerts = document.body.getElementsByClassName(type);
  var alreadyExists = false;
  if(alerts !== null){
    for (var i = 0; i < alerts.length; i++) {
      if(alerts[i].innerHTML == content) alreadyExists = true;
    }
  }
  if(!alreadyExists){
    var newEle = document.createElement('div');
    newEle.classList.add('alert', type);
    newEle.innerHTML = content;
    newEle.addEventListener('click', deleteClicked, false);
    document.body.appendChild(newEle);
  }
}

function openModal(i){
    modals[i].classList.toggle("open");
};

for(let j = 0; j < buttons.length; j++) {
  buttons[j].addEventListener("click", function(){openModal(j)}, false)
}

var tabs = document.getElementsByClassName('tab');
var dots = document.getElementsByClassName('dot');

var tabPos = 0;

var valid = function(n){
  var res = false;
  var inputs = tabs[tabPos].querySelectorAll('input');
  for (var i = 0; i < inputs.length; i++) {
      if ((inputs[i].type === 'text' && inputs[i].value != "") || (inputs[i].type === 'password' ) || (inputs[i].type === 'radio' && inputs[i].checked)){
        res = true;
      }
  }
  if(inputs.length == 0) res = true;
  if(!res){
    if(inputs[0].type === 'text'){
      showAlert('error', 'Musisz wpisać '+ alertMSG[0] +' 😉');
      inputs[0].classList.add('error');
    }
    else if(inputs[0].type === 'radio') showAlert('error', 'Musisz wybrać '+ alertMSG[1] +' 😉');
  }
  return res;
}

var goNextPrev = function(n){
  if(n<0 || (n>0 && valid(tabPos))){
    dots[tabPos].classList.remove('active');
    tabs[tabPos].classList.remove('active');
    tabPos += n;
    dots[tabPos].classList.add('active');
    tabs[tabPos].classList.add('active');
  }
}

for (var i = 0; i < navNext.length; i++) {
  navNext[i].addEventListener("click", function(){goNextPrev(1)}, false)
}
for (var i = 0; i < navPrev.length; i++) {
  navPrev[i].addEventListener("click", function(){goNextPrev(-1)}, false)
}


function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "error";
}
