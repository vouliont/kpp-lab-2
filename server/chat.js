let users = [];

let chat = {
   subscribe(req, res) {
      users.push(res);

      res.on('close', function() {
         let index = users.indexOf(res);
         users.splice(index, 1);
      })
   },
   publish(body) {
      users.map((res) => {
         res.end(JSON.stringify(body));
      });

      users = [];
   }
}

exports.subscribe = chat.subscribe;
exports.publish = chat.publish;