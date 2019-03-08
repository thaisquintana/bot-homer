const textInput = document.getElementById('textInput');
const chat = document.getElementById('chat');
const audio = document.getElementById('voice');

let d,
  h,
  m = 0;

let state = 'hide';
let context = {};

$(document).ready(function() {
  setTimeout(function() {
    $('.chat-column').hide();
  }, 100);
});

$('#dialog-btn').click(function() {
  if (state === 'hide') {
    $('.chat-column').show(1000);
    $('.from-watson audio')
      .get(0)
      .play();
    state = 'show';
  } else {
    $('.chat-column').hide(1000);
    state = 'hide';
  }
});

function scrollMessages() {
  let dialog = $('#chat');
  let height = dialog[0].scrollHeight;
  dialog.scrollTop(height);
}

function setDate() {
  d = new Date();
  m = d.getMinutes();
  if (m <= 9) m = '0' + m;
  return '<div>' + d.getHours() + ':' + m + '</div>';
}

function voiceAutoPlay() {
  $('.from-user audio').removeAttr('autoplay');
}

const templateChatMessage = (message, from) =>
  ` <div class="from-${from}">
      <div class="message-inner">
        <p>${message}</p>
        <br/> 
        <audio controls class="voice" id="voice" autoplay>
          <source src="${data}" type="audio/mpeg">
          <source src="${data}" type="audio/wav">
        </audio>` +
  '<div class="timer">' +
  setDate();
+'</div> ' + '</div>';

// Create an element and append to chat
const InsertTemplateInTheChat = template => {
  const div = document.createElement('div');
  div.innerHTML = template;
  chat.appendChild(div);
  scrollMessages();
};

// Calling server and get the watson output
const getWatsonMessageAndInsertTemplate = async (text = '') => {
  const uri = 'http://localhost:4000/conversation/';
  const response = await (await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      context
    })
  })).json();
  data = response.output.action.data;
  context = response.context;
  const template = templateChatMessage(response.output.text, 'watson');
  InsertTemplateInTheChat(template);
  console.log(response);
};

textInput.addEventListener('keydown', event => {
  if (event.keyCode === 13 && textInput.value) {
    // Send the user message
    getWatsonMessageAndInsertTemplate(textInput.value);
    const template = templateChatMessage(textInput.value, 'user');
    InsertTemplateInTheChat(template);
    // Clear input box for further messages
    textInput.value = '';
    voiceAutoPlay();
  }
});

getWatsonMessageAndInsertTemplate();
