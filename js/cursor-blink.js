function updateName() {
  const nameElement = document.getElementById("my-name");
  const currentText = nameElement.textContent;
  nameElement.textContent = currentText + "|";
  setTimeout(updateName, 500); // update the name every 500ms
}

setTimeout(updateName, 500); // start updating the name after 500ms

