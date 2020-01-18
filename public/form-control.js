// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
    e.preventDefault();
    // Check that the user entered a message 
    if (messageInputElement.value) {
      //saveMessage(messageInputElement.value).then(function() {
        // TODO send our message through P2P! And then execute the code below in a callback (idk how that will work)
        // Clear message text field and re-enable the SEND button.
        resetMaterialTextfield(messageInputElement);
        toggleButton();
      //});
    }
  }

  function toggleButton() {
    if (messageInputElement.value) {
      submitButtonElement.removeAttribute('disabled');
    } else {
      submitButtonElement.setAttribute('disabled', 'true');
    }
  }

  // Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
    element.value = '';
    element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
  }
  
  var submitButtonElement = document.getElementById('submit');
  var messageInputElement = document.getElementById('message');
  var messageFormElement = document.getElementById('message-form');
  messageFormElement.addEventListener('submit', onMessageFormSubmit);
messageInputElement.addEventListener('keyup', toggleButton);
messageInputElement.addEventListener('change', toggleButton);