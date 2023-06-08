//Key API

var key = 'AIzaSyCPQEPxbW_jv6N_XSOUMBIThX3DlAjqddY';
var cx = '50873707364714151';

//Variabel
var AiName = 'RyuX';
var submit = document.getElementById("submit");
var regenerate = document.getElementById('new');
var reset = document.getElementById('reset');
var recognition = document.getElementById('recognition');
var sendImagePath = submit.querySelector('img').src;
var deleteImagePath = reset.querySelector('img').src;
var regenerateImagePath = regenerate.querySelector('img').src;
var recognitionImagePath = recognition.querySelector('img').src;
var loading = document.getElementById('loading');
const AiAnswer = document.getElementById("answer");
let typingAnimation = null;

//Event
recognition.addEventListener('click', RecognitionQuestion)

reset.addEventListener('click', ResetAll)

submit.addEventListener("click", () =>{
    ResetAll();
    var question = document.getElementById("question").value.trim();
    var stopWords = ["the", "is", "and", "of", "to", "who", "what", "where"];
    var tokens = question.split(" ");
    var keywords = [];
    
    // Call ResetPicture() function
    ResetPicture();
    
    if(question === "" || question === " "){
        EarthQuake();
        return
    }

    // get question keyword
    for (var i = 0; i < tokens.length; i++) {
        if (!stopWords.includes(tokens[i])) {
            keywords.push(tokens[i]);
        }
    }
    
    // get forbind word in keyword
    var forbind = ["nigga", "dick", "ddos", "hitler", "fuck", "sex", "nigger", "18+", "hot", "ass"];
    for(var i = 0; i<forbind.length; i++){
        if(keywords.includes(forbind[i])){
            SendMessage('Warning', 'RyuX is not answer that kind of question');
            return;
        }
    }
    var format = keywords.join("_");
    Answer(format); // memanggil function Answer agar Ai merespon
})

regenerate.addEventListener('click', () =>{
    ResetAll();
    var question = document.getElementById('question').value.trim();
    GetAnotherData(question);
})

// Function
function updatemenu() {
  if (document.getElementById('responsive-menu').checked == true) {
    document.getElementById('menu').style.borderBottomRightRadius = '0';
    document.getElementById('menu').style.borderBottomLeftRadius = '0';
  }else{
    document.getElementById('menu').style.borderRadius = '10px';
  }
}

function Answer(question){
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${question}`)
    .then(response => response.json())
    .then(data =>{
        const title = data.title;
        const answer = data.extract;
        
        if(title === 'Not found.'){
            GetAnotherData(question); //mencari data lain
        }
        else{
            Typing(`${AiName}: ${answer}`)
        }
    })
}

function GetAnotherData(question){
    fetch(`https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${question}`)
    .then(response => response.json())
    .then(data =>{
        var items = data.items;
        var answerText = "";
                
        if(items && items.length < 1){
            AiAnswer.innerText = `${AiName}: Sorry data not found in my data`;
            return;
        }
        
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var snippet = item.snippet;
                
            // Menghapus tanggal dan tahun dari teks hasil snippet
            snippet = snippet.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '');
            snippet = snippet.replace(/\b\d{4}\b/g, '');
                
            answerText += snippet + "\n";
        }
            
        Typing(`${AiName}: ${answerText}`);
    })
    .catch(error =>{
        Typing(error)
    })
}

function EarthQuake() {
  fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json')
    .then(response => response.json())
    .then(data => {
      AiAnswer.style.display = 'flex';
      AiAnswer.innerText = JSON.stringify(data, null, 2);
    })
    .catch(error => console.log(error));
}

function Typing(text) {
  let index = 0;
  const speed = 10; // typing speed(milisecond)
  AiAnswer.style.display = 'flex';  
    
  function type() {
    if (index < text.length) {
      AiAnswer.innerHTML += text.charAt(index);
      index++;
      submit.style.display = "none";
      loading.style.display = 'inline-block';
      typingAnimation = setTimeout(type, speed);
    }
    else{
        regenerate.style.display = 'flex';
        reset.style.display = 'flex';
        recognition.style.display = 'flex';
        submit.style.display = "inline-block";
        loading.style.display = 'none';
    }  
  }

  type();
}

function RecognitionQuestion(){
    var question = document.getElementById('question').value.trim();
    
    fetch(`https://www.googleapis.com/customsearch/v1?cx=${cx}&q=${question}&key=${key}&searchType=image`)
    .then(response => response.json())
    .then(data =>{
        var items = data.items;
        var answerText = "";
        var pictureClass = document.getElementById('body-image');
        
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var snippet = item.snippet;
            
            // Find image/get image url
            var imageUrl = item.link;
            
            // Create element for the image
            var imageElement = document.createElement('img');
            imageElement.src = imageUrl;
            
            // image style
            imageElement.style.display = 'flex';
            imageElement.style.width = '100px';
            imageElement.style.height = 'auto';
            
            // Add the image
            pictureClass.appendChild(imageElement);
        }
    })
}

function ResetPicture(){
    var images = document.getElementsByTagName('img');
    for (var i = 0; i < images.length; i++) {
        images[i].src = '';
        images[i].styles = 'none';
    }
    
    submit.querySelector('img').src = sendImagePath;
    reset.querySelector('img').src = deleteImagePath;
    regenerate.querySelector('img').src = regenerateImagePath;
    recognition.querySelector('img').src = recognitionImagePath;
}

function ResetAll(){
    clearTimeout(typingAnimation);
    AiAnswer.innerText = '';
    AiAnswer.style.display = 'none';
    regenerate.style.display = 'none';
    reset.style.display = 'none';
    recognition.style.display = 'none';
    ResetPicture();
}

function SendMessage(title, message) {
    var titleMessage = document.getElementById('title-message');
    var messageAbout = document.getElementById('message-about');
    var popup = document.getElementById('popup');
    titleMessage.innerText = title;
    messageAbout.innerText = message;
    popup.style.display = 'block';
}

function hidePopup() {
    document.getElementById('responsive-menu').checked = false;
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
}