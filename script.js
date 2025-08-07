// Collecting Values from the input

const studentName = document.querySelector(".studentName");
const studentId = document.querySelector(".studentId");
const studentEmail = document.querySelector(".studentEmail");
const studentNumber = document.querySelector(".studentNumber");
const submitButton = document.querySelector(".submitButton");
const studentTableBody = document.querySelector("#studentTable tbody");
const studentForm = document.querySelector("form");

submitButton.addEventListener("click", addEvent);

let editRow = null;

// Function check if the input is just numbers or not
function isOnlyNumbers(value) {
  return /^\d+$/.test(value);
}

function updateTableScrollbar() {
  const container = document.getElementById("tableContainer");
  const tableHeight = container.scrollHeight;
  const maxHeight = 400;

  // If content height exceeds maxHeight => scrollbar appears (overflow-y: auto), else no scrollbar
  if (container.clientHeight >= maxHeight) {
    container.style.overflowY = "auto";
  } else {
    container.style.overflowY = "hidden";
  }
}

// Main function
function addEvent() {
  if (
    studentName.value == "" ||
    studentEmail.value == "" ||
    studentId.value == "" ||
    studentNumber.value == ""
  ) {
    alert("Input proper values");
    return;
  }
  // Checking if the studentID is just numbers or not
  if (!isOnlyNumbers(studentId.value.trim())) {
    alert("Student ID must be a number only.");
    return;
  }
  // Checking if the studentNumber is just numbers or not and under 10
  if (
    !isOnlyNumbers(studentNumber.value.trim()) ||
    studentNumber.value.trim().length < 10
  ) {
    alert("Contact number must be numeric and at least 10 digits.");
    return;
  }
  // If editRow is positive then edit the content added else add new
  if (editRow) {
    editRow.children[0].textContent = studentName.value;
    editRow.children[1].textContent = studentId.value;
    editRow.children[2].textContent = studentEmail.value;
    editRow.children[3].textContent = studentNumber.value;

    editRow = null;
    submitButton.textContent = "Add Student";
  } else {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${studentName.value}</td>
    <td>${studentId.value}</td>
    <td>${studentEmail.value}</td>
    <td>${studentNumber.value}</td>
    <td class="actions">
        <button class="edit-btn" >Edit</button>
        <button class="delete-btn" >Delete</button>
    </td>
    `;
    studentTableBody.appendChild(row);
  }

  studentForm.reset();
  updateTableScrollbar();
}

studentTableBody.addEventListener("click", modifyItem);

function modifyItem(e) {
  const val = e.target;

  if (val.classList[0] == "delete-btn") {
    const parent = val.parentElement;
    const superParent = parent.parentElement;
    superParent.remove();
    if (editRow === row) {
      editRow = null;
      studentForm.reset();
      submitButton.textContent = "Add Student";
    }
    //   When removing the element to update scroll bar
    updateTableScrollbar();
  } else if (val.classList[0] == "edit-btn") {
    const row = val.closest("tr");
    // Fill the form fields with that row's data
    studentName.value = row.children[0].textContent;
    studentId.value = row.children[1].textContent;
    studentEmail.value = row.children[2].textContent;
    studentNumber.value = row.children[3].textContent;

    // Remember which row we are editing
    editRow = row;
    submitButton.textContent = "Update Student";
  }
}
