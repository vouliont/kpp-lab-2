let socket = null;
let formSendMsg = null;
let listMsgs = null;

let userName = '';
let formChooseName = document.querySelector('#form-choose-name');
let wrapper = document.querySelector('#wrapper');

formChooseName.onsubmit = function(e) {
   e.preventDefault();

   userName = this.elements.name.value;
   if (userName === '') return;

   let chat = document.createElement('div');
   chat.className = 'row d-flex justify-content-center';
   chat.innerHTML = `
      <div class="col-12">   
         <form id="form-send-msg">
            <div class="input-group">
               <input type="text" name="msg" class="form-control" placeholder="your message">
               <div class="input-group-append">
                  <button type="submit" class="btn btn-outline-secondary">Send</button>
               </div>
            </div>
         </form>
      </div>
      <div class="col-12">
         <ul class="list-group list-group-flush" id="list-msgs"></ul>
      </div>
   `;

   let title = document.createElement('h3');
   title.id = 'title';
   title.className = 'pt-3 pb-3';
   title.innerHTML = `Chat | ${userName}`;

   this.parentNode.parentNode.removeChild(this.parentNode);
   wrapper.appendChild(title);
   wrapper.appendChild(chat);

   initUser();
}

function initUser() {
   socket = io();

   socket.on('get message on client', function(obj) {
      obj = JSON.parse(obj);

      let item = document.createElement('li');
      item.className = 'list-group-item';
      item.innerHTML = `
         <strong class="d-block">${obj.name}</strong>
         ${obj.msg}
      `;
   
      listMsgs.insertAdjacentElement('afterBegin', item);
   });

   formSendMsg = document.querySelector('#form-send-msg');
   listMsgs = document.querySelector('#list-msgs');

   formSendMsg.onsubmit = function(e) {
      e.preventDefault();
      if (this.elements.msg.value === '') return;

      socket.emit('send message to server', JSON.stringify({ msg: this.elements.msg.value, name: userName }));
      this.elements.msg.value = '';
   };
}