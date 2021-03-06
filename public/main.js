const textInput = document.getElementById('textInput');
const chat = document.getElementById('chat');
let mediaTag = '';
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
    state = 'show';
    getWatsonMessageAndInsertTemplate();
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

function fromUserMessage() {
  $('.from-user br').remove('br');
  $('.from-user audio').remove('audio');
  $('.from-user video').remove('video');s
}

const templateChatMessage = (message, from) =>
  ` <div class="from-${from}">
      <div class="message-inner">
        <p>${message}</p>
        <br/> 
        ${mediaTag}
      ` +
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
const getWatsonMessageAndInsertTemplate = async (text = 'start') => {
  // use this url when you dont have an url for production
  // const uri = 'https://localhost:4000/conersation';

  // use this url when you have an external url built with credentials to use on production
  const uri = 'https://bot-monsanto.mybluemix.net/fox/';
  const response = await (await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: { text },
      context
    })
  })).json();
  data = response.output.action.data;
  const arr = data.split('.');
  mediaTag =
    arr[arr.length - 1] === 'mp3' || arr[arr.length - 1] === 'wav'
      ? `<audio controls class="voice" id="voice" autoplay> <source src="${data}" type="audio/wav">
  <source src="${data}" type="audio/mpeg"> </audio>`
      : ` <video controls id="video" autoplay> <source src="${data}" type="video/mp4"></video>`;
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
    fromUserMessage();
  }
});
