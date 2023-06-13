var login = document.getElementById('enter');
var closebutton = document.getElementById('close-button');

export let AdminRank = 0;

login.addEventListener('click', () => {
  var username = document.getElementById('user').value;
  var password = document.getElementById('password').value;
  console.log(username, password);
  LoginAdmin(username, password);
});

function LoginAdmin(user, password) {
  fetch('../data/admin.json')
    .then(response => response.json())
    .then(data => {
      var admin = data.find(item => item.name === user && item.pw === password);
      if (admin) {
        SendMessage('Welcome Back', admin.login);
        AdminRank = admin.rank;
        console.log('Someone logged in as admin with rank: ' + AdminRank);
        setTimeout(function() {
          window.location.href = '../chat/chat.html';
        }, 2000);
      } else {
        console.log('Failed to login admin, unexpected username or password');
      }
    })
    .catch(error => console.log('Failed to login admin: ' + error));
}

function SendMessage(title, message) {
  var titleMessage = document.getElementById('title-message');
  var messageAbout = document.getElementById('message-about');
  var popup = document.getElementById('popup');
  titleMessage.innerHTML = title;
  messageAbout.innerHTML = message;
  popup.style.display = 'block';
}

function hidePopup() {
  document.getElementById('responsive-menu').checked = false;
  var popup = document.getElementById('popup');
  popup.style.display = 'none';
}
