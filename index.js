const card = document.getElementById("card");
const inputCard = document.getElementById("textcard");
const title = document.getElementById("title");
const note = document.getElementById("note");
const closebtn = document.getElementById("closebtn");
const pinItemsdisplay = document.getElementById("pinnotesdisplay");
const cardsdisplay = document.getElementById("notesdisplay");
const searchInput = document.getElementById("search");
const cards = document.getElementById("cards");
const resetbtn = document.getElementById("resetbutton");
const gridView = document.getElementById("gridview");
const listView = document.getElementById("listview");
const pinHeaderDisplay = document.getElementById("Pinned");
const notesheaddisplay = document.getElementById("others");
const inputcarddisplay = document.getElementById("inputcard");
const searchPinItemsBlock = document.getElementById("pinItemsdisplay");
const displayarchiveitems = document.getElementById("archiveitems");
const overlay = document.getElementById("overlay");

//get items from storagr
let itemFromStorage = JSON.parse(localStorage.getItem("Notes")) || [];
let deleteitemFromStorage =
  JSON.parse(localStorage.getItem("Delete-Notes")) || [];
let archiveitemFromStorage =
  JSON.parse(localStorage.getItem("Archive-Notes")) || [];
let pinneditemFromStorage =
  JSON.parse(localStorage.getItem("Pinned-Notes")) || [];

// additemstodisplay();
function textCardDisplay() {
  closebtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`;
  closebtn.style.color = "black";

  card.style.display = "none";
  inputCard.style.display = "block";
  title.focus();
}

//onclickAddItems
function onclickAddItems(e) {
  if (e.key === "Enter") {
    e.preventDefault();
  }
}

//submitItems
function submitItems(e) {
  e.preventDefault();

  if (
    (title.value !== 0 || note.value !== 0) &&
    (title.value !== "" || note.value !== "")
  ) {
    addItemsToLocalStorage();
  }

  card.style.display = "block";
  inputCard.style.display = "none";

  title.value = "";
  note.value = "";

  title.placeholder = "Title";
  note.placeholder = "Take a note..";

  inputCard.classList.remove("editItem");
  overlay.classList.remove("overlay");
}

function initialDisplayItems() {
  displayItemsFromNotes(itemFromStorage);
  displaypinnedItems(pinneditemFromStorage);
  noteSection.style.display = "block";
  inputCard.classList.remove("editItem");
  inputCard.style.background = " ";
  title.style.background = " ";
  note.style.background = " ";

  displayHeaders();
}

function displayHeaders() {
  if (pinneditemFromStorage.length === 0) {
    pinHeaderDisplay.style.display = "none";
  } else {
    pinHeaderDisplay.style.display = "block";
  }

  if (itemFromStorage.length !== 0 && pinneditemFromStorage.length !== 0) {
    notesheaddisplay.style.display = "block";
  } else {
    notesheaddisplay.style.display = "none";
  }
}

// Add item to Local Storage
function addItemsToLocalStorage() {
  const editable = itemFromStorage.find((i) => i.isEditable === true);
  if (!editable) {
    const newId = itemFromStorage[itemFromStorage.length - 1]?.id + 1 || 1;
    const newItem = {
      id: newId,
      title: title.value,
      note: note.value,
      color: "#ffffff",
      isEditable: false,
    };

    itemFromStorage.push(newItem);
  } else {
    itemFromStorage.forEach((item, index) => {
      if (item.isEditable === true) {
        itemFromStorage.splice(index, 1, {
          id: item.id,
          title: title.value,
          note: note.value,
          color: item.color,
          isEditable: false,
        });
      }
    });
  }

  localStorage.setItem("Notes", JSON.stringify(itemFromStorage));

  displayItemsFromNotes(itemFromStorage);
}

//display items from DOM
function displayItemsFromNotes(items) {
  cardsdisplay.innerHTML = "";

  items.forEach((item) => {
    let b = document.createElement("div");
    // b.setAttribute("id", "cards");
    b.setAttribute("draggable", true);
    b.classList.add("cards");
    b.setAttribute("data-id", item.id);

    const itemColor = item.color || "#ffffff";

    b.innerHTML = `<p class="texttitle" id="texttitle">${item.title}</p>
                        <p class="textnote" id="textnote">${item.note}</p>
                        <div class = "hideContent" style="visibility: hidden">
                               <i class="fa-regular fa-trash-can delicon"></i>
                               <i class="fa-solid fa-file-arrow-down archiveicon"></i>
                               <label for="color-${item.id}"><img src="./icons/paint.svg" alt="" class="colorpickericon"></label>
                               <input type="color" class="colorpicker" id="color-${item.id}" value="${itemColor}"/>
                               <img src="./icons/pin-map-save-favorite-point-svgrepo-com.svg" alt="sdfdfgsdg" class="pinned" id="pinned"/> </div>`;
    cardsdisplay.appendChild(b);
    b.style.background = itemColor;

    const deleteIcon = document.querySelectorAll(".delicon");
    const archiveIcon = document.querySelectorAll(".archiveicon");
    const pinnedItems = document.querySelectorAll(".pinned");
    const colorpicker = document.querySelectorAll(".colorpicker");

    deleteIcon.forEach((element) => {
      element.addEventListener("click", deleteNoteFromStorage);
    });

    archiveIcon.forEach((element) => {
      element.addEventListener("click", archiveNoteFromStorage);
    });

    pinnedItems.forEach((element) => {
      element.addEventListener("click", pinNoteFromStorage);
    });

    colorpicker.forEach((element) => {
      element.addEventListener("input", colorPicker);
    });

    cardsdisplay.addEventListener("click", (e) => {
      const target = e.target;

      if (target.closest(".texttitle") || target.closest(".textnote")) {
        editItems(e);
      }
    });

    const hideContent = b.querySelector(".hideContent");

    b.addEventListener("mouseover", () => {
      hideContent.style.visibility = "visible";
    });

    b.addEventListener("mouseout", () => {
      hideContent.style.visibility = "hidden";
    });
  });
  enableDragAndDrop();
}

//this function is used for Drag and Drop
function enableDragAndDrop() {
  const dragCards = document.querySelectorAll(".cards");
  dragCards.forEach((item) => {
    item.addEventListener("dragstart", () => {
      setTimeout(() => item.classList.add("dragging"), 0);
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      updateItemsArray();
    });
  });

  function updateItemsArray() {
    const currentCards = cardsdisplay.querySelectorAll(".cards");
    itemFromStorage = Array.from(currentCards).map((item) => {
      const id = item.getAttribute("data-id");
      return itemFromStorage.find((item) => item.id == id);
    });
    localStorage.setItem("Notes", JSON.stringify(itemFromStorage));
  }

  const sortableList = (e) => {
    const draggingItem = cardsdisplay.querySelector(".dragging");
    const siblings = [
      ...cardsdisplay.querySelectorAll(".cards:not(.dragging)"),
    ];

    let nextSibling = siblings.find((sibling) => {
      return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });
    if (nextSibling) {
      cardsdisplay.insertBefore(draggingItem, nextSibling);
    } else {
      cardsdisplay.appendChild(draggingItem);
    }
  };
  cardsdisplay.addEventListener("dragover", sortableList);
}

//this is for Edit items from notes
function editItems(e) {
  const card = e.target.closest(".cards");
  const cardId = card.getAttribute("data-id");

  const titleText = card.firstChild.textContent;
  const noteText = card.children[1].textContent;

  inputCard.style.display = "block";

  inputCard.classList.add("editItem");
  overlay.classList.add("overlay");

  closebtn.innerHTML = `<i class="fa-solid fa-pen"></i> Update Item`;
  closebtn.style.color = "green";

  title.value = titleText;
  note.value = noteText;

  const updatedNotes = itemFromStorage.map((item) => {
    if (item.id == cardId) {
      item.isEditable = true;
      inputCard.style.background = item.color;
      title.style.background = item.color;
      note.style.background = item.color;
    }
    return item;
  });

  localStorage.setItem("Notes", JSON.stringify(updatedNotes));
}

function colorPicker(e) {
  e.stopPropagation();

  const selectedColor = e.target.value;
  const card = e.target.closest(".cards");
  const cardId = card.getAttribute("data-id");

  const updatedNotes = itemFromStorage.map((item) => {
    if (item.id == cardId) {
      item.color = selectedColor;
    }
    return item;
  });

  card.style.backgroundColor = selectedColor;

  localStorage.setItem("Notes", JSON.stringify(updatedNotes));
}

//deletNoteFromStorage
function deleteNoteFromStorage(e) {
  e.stopPropagation();

  const card = e.target.closest(".cards");
  const itemId = card.getAttribute("data-id");

  const deleteobject = itemFromStorage.find(
    (item) => item.id === parseInt(itemId)
  );

  if (deleteobject) {
    deleteitemFromStorage.push(deleteobject);
    localStorage.setItem("Delete-Notes", JSON.stringify(deleteitemFromStorage));
  }

  modifiedItemToStorageNotes(itemId);
}

function archiveNoteFromStorage(e) {
  e.stopPropagation();

  const card = e.target.closest(".cards");
  const itemId = card.getAttribute("data-id");

  const archiveObject = itemFromStorage.find(
    (item) => item.id === parseInt(itemId)
  );
  if (archiveObject) {
    archiveitemFromStorage.push(archiveObject);
    localStorage.setItem(
      "Archive-Notes",
      JSON.stringify(archiveitemFromStorage)
    );
  }

  modifiedItemToStorageNotes(itemId);
}

function pinNoteFromStorage(e) {
  e.stopPropagation();

  const card = e.target.closest(".cards");
  const itemId = card.getAttribute("data-id");

  const pinObject = itemFromStorage.find(
    (item) => item.id === parseInt(itemId)
  );
  if (pinObject) {
    pinneditemFromStorage.push(pinObject);
    localStorage.setItem("Pinned-Notes", JSON.stringify(pinneditemFromStorage));
  }

  modifiedItemToStorageNotes(itemId);
  displaypinnedItems(pinneditemFromStorage);
}

// add bin items to deletenotes
function modifiedItemToStorageNotes(itemId) {
  itemFromStorage = itemFromStorage.filter(
    (item) => item.id !== parseInt(itemId)
  );
  localStorage.setItem("Notes", JSON.stringify(itemFromStorage));

  displayItemsFromNotes(itemFromStorage);
  displayHeaders();
}

//aside wrap
function asidewrap() {
  const asideElement = document.querySelector("aside");
  asideElement.classList.toggle("asidehidden");
}

//search items
const onSearch = () => {
  const text = searchInput.value.toUpperCase();
  resetbtn.style.display = "block";
  searchPinItemsBlock.style.display = "none";
  notesheaddisplay.style.display = "none";
  inputcarddisplay.style.display = "none";

  cardsdisplay.innerHTML = "";

  if (text !== "") {
    searchItems(
      [...itemFromStorage, ...archiveitemFromStorage, ...pinneditemFromStorage],
      text
    );
  } else {
    resetbtn.style.display = "none";
    searchPinItemsBlock.style.display = "block";
    notesheaddisplay.style.display = "block";
    inputcarddisplay.style.display = "flex";
    cardsdisplay.style.marginTop = "0rem";
    initialDisplayItems();
  }
};

function searchItems(array, text) {
  array.forEach((i) => {
    const itemTitle = i.title.toUpperCase();
    const itemNotes = i.note.toUpperCase();

    if (itemTitle.indexOf(text) !== -1 || itemNotes.indexOf(text) !== -1) {
      searchItemsToDisplay(i);
    }
  });
}

function searchItemsToDisplay(i) {
  let b = document.createElement("div");
  b.setAttribute("id", "cards");
  b.classList.add("cards");
  const itemColor = i.color || "#ffffff";
  b.innerHTML = `<p class="texttitle" id="texttitle">${i.title}</p>
                        <p class="textnote" id="textnote">${i.note}</p>
                        <i class="fa-regular fa-trash-can delicon"></i>
                        <i class="fa-solid fa-file-arrow-down archiveicon"></i>
                         <label for="color-${i.id}"><img src="./icons/paint.svg" alt="" class="colorpickericon"></label>
                        <input type="color" class="colorpicker" id="color-${i.id}" value="${itemColor}" /> `;
  cardsdisplay.appendChild(b);
  b.style.background = itemColor;

  cardsdisplay.style.marginTop = "10rem";
}

//resetbutton
function resetbutton(e) {
  e.preventDefault();

  searchInput.value = "";
  displayItemsFromNotes(itemFromStorage);
  resetbtn.style.display = "none";
  searchPinItemsBlock.style.display = "block";
  notesheaddisplay.style.display = "block";
  inputcarddisplay.style.display = "flex";
  cardsdisplay.style.marginTop = "0rem";
}

const section = document.querySelector("section");
const body = document.querySelector("body");
const nav = document.querySelector("nav");

const darkthememode = document.getElementById("darktheme");
const lightthememode = document.getElementById("lighttheme");

function gridview() {
  cardsdisplay.classList.remove("list-view");
  pinItemsdisplay.classList.remove("list-view");
  displayarchiveitems.classList.remove("list-view");
  displaybinitems.classList.remove("list-view");
  notesheaddisplay.classList.remove("list-view");
  pinHeaderDisplay.classList.remove("list-view");

  listView.style.display = "block";
  gridView.style.display = "none";
}

function listview() {
  cardsdisplay.classList.add("list-view");
  pinItemsdisplay.classList.add("list-view");
  displayarchiveitems.classList.add("list-view");
  displaybinitems.classList.add("list-view");
  notesheaddisplay.classList.add("list-view");
  pinHeaderDisplay.classList.add("list-view");

  listView.style.display = "none";
  gridView.style.display = "block";
}

// This function is used to handle the dark theme..
function darktheme() {
  body.classList.toggle("darktheme");
  nav.classList.toggle("navbg");
  section.classList.toggle("darkthemesection");
  lightthememode.style.display = "block";
  darkthememode.style.display = "none";
}

function lightTheme() {
  body.classList.remove("darktheme");
  nav.classList.remove("navbg");
  section.classList.remove("darkthemesection");

  lightthememode.style.display = "none";
  darkthememode.style.display = "block";
}

// mouse click submission
// const notes = document.querySelector(".notesection");
// notes.addEventListener("click", submititem);

// function submititem() {
//   if (title.value.trim() !== "" || note.value.trim() !== "") {
//     addItemsToLocalStorage();
//     title.value = "";
//     note.value = "";
//     card.style.display = "block";
//     inputCard.style.display = "none";
//     overlay.classList.remove("overlay");
//   }
// }

inputCard.addEventListener("click", saveonclick);
function saveonclick(e) {
  e.stopPropagation();
}

//display pinned items
function displaypinnedItems(items) {
  pinItemsdisplay.innerHTML = "";

  items.forEach((item) => {
    let x = document.createElement("div");
    x.setAttribute("id", "cards");
    x.classList.add("cards");
    x.setAttribute("data-id", item.id);
    x.setAttribute("draggable", true);

    const itemColor = item.color || "#ffffff";

    x.innerHTML = `<p class="texttitle" id="texttitle">${item.title}</p>
                        <p class="textnote" id="textnote">${item.note}</p>
                        <i class="fa-regular fa-trash-can delicon"></i>
                        <i class="fa-solid fa-file-arrow-down archiveicon"></i>
                        <img src="./icons/pinnedfill.svg" alt="pinned" class="pinned unpinned" id="pinned"/>
                         <label for="color-${item.id}"><img src="./icons/paint.svg" alt="" class="colorpickericon"></label>
                        <input type="color" class="colorpicker" id="color-${item.id}" value="${itemColor}" />`;
    pinItemsdisplay.appendChild(x);

    x.style.background = itemColor;
    const colorpicker = document.querySelectorAll(".colorpicker");

    pinItemsdisplay.addEventListener("click", (e) => {
      const card = e.target.closest(".cards");
      if (!card) return;

      const itemId = card.getAttribute("data-id");

      if (e.target.classList.contains("delicon")) {
        deleteNoteFrompinStorage(itemId);
      } else if (e.target.classList.contains("archiveicon")) {
        archiveNoteFrompinStorage(itemId);
      } else if (e.target.classList.contains("unpinned")) {
        unPinNoteFromStorage(itemId);
      }
      // else if (e.target.closest(".texttitle")  || e.target.closest(".textnote")) {
      //   editPinItems(e);
      // }
    });
    colorpicker.forEach((element) => {
      element.addEventListener("input", colorPickerForPinItems);
    });
  });
  // enableDragAndDrop(pinItemsdisplay);
}

// function editPinItems(e){
//   const card = e.target.closest(".cards");
//   const cardId = card.getAttribute("data-id");

//   const titleText = card.firstChild.textContent;
//   const noteText = card.children[1].textContent;

//   inputCard.style.display = "block";
//   inputCard.classList.add("editItem");
//   overlay.classList.add("overlay");

//   title.value = titleText;
//   note.value = noteText;

//   const updatedNotes = pinneditemFromStorage.map((item) => {
//     if (item.id == cardId) {
//       item.isEditable = true;
//     }
//     return item;
//   });

//   localStorage.setItem("Pinned-Notes", JSON.stringify(updatedNotes));
// }

function colorPickerForPinItems(e) {
  const selectedColor = e.target.value;
  const card = e.target.closest(".cards");
  const cardId = card.getAttribute("data-id");

  const updatedNotes = pinneditemFromStorage.map((item) => {
    if (item.id == cardId) {
      item.color = selectedColor;
    }
    return item;
  });

  card.style.backgroundColor = selectedColor;

  localStorage.setItem("Pinned-Notes", JSON.stringify(updatedNotes));
}

//deletNoteFromStorage
function deleteNoteFrompinStorage(itemId) {
  const deleteobject = pinneditemFromStorage.find(
    (item) => item.id === parseInt(itemId)
  );

  if (deleteobject) {
    deleteitemFromStorage.push(deleteobject);
    localStorage.setItem("Delete-Notes", JSON.stringify(deleteitemFromStorage));
  }
  modifiedItemToStoragePinItems(itemId);

  displayItemsFromNotes(itemFromStorage);
  displaypinnedItems(pinneditemFromStorage);
  displayHeaders();
}

function archiveNoteFrompinStorage(itemId) {
  const archiveObject = pinneditemFromStorage.find(
    (item) => item.id === parseInt(itemId)
  );
  if (archiveObject) {
    archiveitemFromStorage.push(archiveObject);
    localStorage.setItem(
      "Archive-Notes",
      JSON.stringify(archiveitemFromStorage)
    );
  }
  modifiedItemToStoragePinItems(itemId);

  displayItemsFromNotes(itemFromStorage);
  displaypinnedItems(pinneditemFromStorage);
  displayHeaders();
}

function unPinNoteFromStorage(itemId) {
  const unpinnedObject = pinneditemFromStorage.find(
    (item) => item.id === parseInt(itemId)
  );

  if (unpinnedObject) {
    itemFromStorage.push(unpinnedObject);
    localStorage.setItem("Notes", JSON.stringify(itemFromStorage));
  }
  modifiedItemToStoragePinItems(itemId);

  displaypinnedItems(pinneditemFromStorage);
  displayItemsFromNotes(itemFromStorage);
  displayHeaders();
}
// add bin items to pinnotes
function modifiedItemToStoragePinItems(itemId) {
  pinneditemFromStorage = pinneditemFromStorage.filter(
    (item) => item.id !== parseInt(itemId)
  );
  localStorage.setItem("Pinned-Notes", JSON.stringify(pinneditemFromStorage));
}

function changedirectorytonotes() {
  noteSection.style.display = "block";
  displaybinitems.style.display = "none";
  displayarchiveitems.style.display = "none";

  noteslink.classList.add("active");
  archivelink.classList.remove("active");
  trashlink.classList.remove("active");

  displayItemsFromNotes(itemFromStorage);
  displayarchiveitems.innerHTML = "";
  displaybinitems.innerHTML = "";
}

// archive items
const noteSection = document.getElementById("notesection");
const noteslink = document.getElementById("notes");
const archivelink = document.getElementById("archive");

function changedirectorytoarchive() {
  noteSection.style.display = "none";
  displayarchiveitems.style.display = "block";
  displaybinitems.style.display = "none";

  archivelink.classList.add("active");
  noteslink.classList.remove("active");
  trashlink.classList.remove("active");

  additemtoArchivedisplay(archiveitemFromStorage);
}

function additemtoArchivedisplay(items) {
  displayarchiveitems.innerHTML = "";
  displaybinitems.innerHTML = "";

  items.forEach((item) => {
    let b = document.createElement("div");
    b.setAttribute("id", "cards");
    b.classList.add("cards");
    b.setAttribute("data-id", item.id);
    const itemColor = item.color || "#ffffff";

    b.innerHTML = `<p class="texttitle" id="texttitle">${item.title}</p>
                <p class="textnote" id="textnote">${item.note}</p>
                <i class="fa-regular fa-trash-can delicon"></i>
                 <i class="fa-solid fa-file-arrow-up unarchiveicon"></i>`;
    displayarchiveitems.appendChild(b);
    b.style.background = itemColor;

    const archivedeleteicon = document.querySelectorAll(".delicon");
    const unarchivefrombin = document.querySelectorAll(".unarchiveicon");

    archivedeleteicon.forEach((element) => {
      element.addEventListener("click", archivedeletenote);
    });
    unarchivefrombin.forEach((element) => {
      element.addEventListener("click", unArchiveItemFromBin);
    });
  });
}

function unArchiveItemFromBin(e) {
  const card = e.target.closest(".cards");
  const itemId = card.getAttribute("data-id");

  const unArchvieObject = archiveitemFromStorage.find(
    (item) => item.id === parseInt(itemId)
  );
  if (unArchvieObject) {
    itemFromStorage.push(unArchvieObject);
    localStorage.setItem("Notes", JSON.stringify(itemFromStorage));
  }
  modifiedItemToStorageArchive(itemId);
}

function archivedeletenote(e) {
  const card = e.target.closest(".cards");
  const itemId = card.getAttribute("data-id");

  const deleteobject = archiveitemFromStorage.find(
    (item) => item.id === parseInt(itemId)
  );
  if (deleteobject) {
    deleteitemFromStorage.push(deleteobject);
    localStorage.setItem("Delete-Notes", JSON.stringify(deleteitemFromStorage));
  }
  modifiedItemToStorageArchive(itemId);
}
// add archive items to archivenotes
function modifiedItemToStorageArchive(itemId) {
  archiveitemFromStorage = archiveitemFromStorage.filter(
    (item) => item.id !== parseInt(itemId)
  );
  localStorage.setItem("Archive-Notes", JSON.stringify(archiveitemFromStorage));

  additemtoArchivedisplay(archiveitemFromStorage);
}

//delete Items
const displaybinitems = document.getElementById("binitems");
const trashlink = document.getElementById("trash");

function changedirectorytobin() {
  noteSection.style.display = "none";
  displayarchiveitems.style.display = "none";
  displaybinitems.style.display = "block";

  archivelink.classList.remove("active");
  noteslink.classList.remove("active");
  trashlink.classList.add("active");

  additemtoBindisplay(deleteitemFromStorage);
}

function additemtoBindisplay(items) {
  displaybinitems.innerHTML = "";
  displayarchiveitems.innerHTML = "";

  items.forEach((item) => {
    let b = document.createElement("div");
    b.setAttribute("id", "cards");
    b.classList.add("cards");
    b.setAttribute("data-id", item.id);
    const itemColor = item.color || "#ffffff";

    b.innerHTML = `<p class="texttitle" id="texttitle">${item.title}</p>
                <p class="textnote" id="textnote">${item.note}</p>
                <i class="fa-regular fa-trash-can delicon"></i>
                <i class="fa-solid fa-trash-arrow-up restoreicon"></i>`;
    displaybinitems.appendChild(b);
    b.style.background = itemColor;

    const deleteitemfrombin = document.querySelectorAll(".delicon");
    const unarchivefrombin = document.querySelectorAll(".restoreicon");

    deleteitemfrombin.forEach((element) => {
      element.addEventListener("click", deletebinnote);
    });
    unarchivefrombin.forEach((element) => {
      element.addEventListener("click", restoreItemFromBin);
    });
  });
}

function restoreItemFromBin(e) {
  const card = e.target.closest(".cards");
  const itemId = card.getAttribute("data-id");

  const restoreObject = deleteitemFromStorage.find(
    (item) => item.id === parseInt(itemId)
  );

  Swal.fire({
    title: "Do you want to Restore the Item?",
    showCancelButton: true,
    confirmButtonText: "Restore",
  }).then((result) => {
    if (result.isConfirmed) {
      if (restoreObject) {
        itemFromStorage.push(restoreObject);
        localStorage.setItem("Notes", JSON.stringify(itemFromStorage));
      }
      modifiedItemToStorageBin(itemId);
      Swal.fire("Restored Item to Notes!", "", "success");
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}

function deletebinnote(e) {
  const card = e.target.closest(".cards");
  const itemId = card.getAttribute("data-id");

  Swal.fire({
    title: "Do you want to delete permanently?",
    showCancelButton: true,
    confirmButtonText: "OK",
    denyButtonText: ``,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Deleted!", "", "success");
      modifiedItemToStorageBin(itemId);
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}

// set remaining bin items to deletenotes and display bin items
function modifiedItemToStorageBin(itemId) {
  deleteitemFromStorage = deleteitemFromStorage.filter(
    (item) => item.id !== parseInt(itemId)
  );
  localStorage.setItem("Delete-Notes", JSON.stringify(deleteitemFromStorage));

  additemtoBindisplay(deleteitemFromStorage);
}

//EventListeners.....
card.addEventListener("click", textCardDisplay);
title.addEventListener("keypress", onclickAddItems);
closebtn.addEventListener("click", submitItems);
document.addEventListener("DOMContentLoaded", initialDisplayItems);
resetbtn.addEventListener("click", resetbutton);
darkthememode.addEventListener("click", darktheme);
lightthememode.addEventListener("click", lightTheme);
gridView.addEventListener("click", gridview);
listView.addEventListener("click", listview);
