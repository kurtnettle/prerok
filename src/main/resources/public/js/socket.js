let socket
let is_connected

async function connect() {
  if (is_connected) return;
  socket = new WebSocket(`ws://${window.location.host}/text`);
  socket.binaryType = "arraybuffer";
  socket.onmessage = function(event) {
    handle_msg(event.data);
  }
  socket.onopen = (event) => {
    console.log("The connection has been opened successfully.");
    is_connected = true;
  }

  socket.onclose = (event) => {
    console.log("The connection has been closed (unexpected)");
    is_connected = false;
  };
}

function disconnect() {
  socket.close();
  is_connected = false;
}


const SENDER_INIT_RESP = 1;
// let gmsg;
async function handle_msg(binary_msg) {
  let msg_array = new Uint8Array(binary_msg);
  // gmsg = msg_array;
  console.log(decoder.decode(msg_array));
  let msg_type = msg_array[0];
  let header_len = parseInt(decoder.decode(msg_array.slice(1, 5)));
  let header_string = decoder.decode(msg_array.slice(5, 5 + header_len));
  let data = msg_array.slice(5 + header_len, msg_array.length);
  console.log("msg_type:", msg_type);
  console.log("header_len:", header_len);
  console.log("header_string:", header_string);
  console.log("data:", data);

  switch (msg_type) {
    case SENDER_INIT_RESP: {
      handle_sender_init_resp(header_string);
      break;
    }
  }
}

function handle_sender_init_resp(header) {
  let res = JSON.parse(header);
  console.log("Your prerok session id is: ", res.sid);
  alert("Your prerok session id is: " + res.sid)
}
// let msg = binary_msg.text();
// table.insertRow(-1).insertCell(0).innerText = msg;
// const link = document.createElement('a');
// link.style.display = 'none';
// document.body.appendChild(link);


// const blob = new Blob([binary_msg], { type: 'text/plain' });
// const objectURL = URL.createObjectURL(blob);

// link.href = objectURL;
// link.href = URL.createObjectURL(blob);
// link.download = 'data.bin';
// link.click();


