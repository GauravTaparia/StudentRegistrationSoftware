// Select input fields and DOM elements
const studentName = document.querySelector(".studentName");
const studentId = document.querySelector(".studentId");
const studentEmail = document.querySelector(".studentEmail");
const studentNumber = document.querySelector(".studentNumber");
const submitButton = document.querySelector(".submitButton");
const studentTableBody = document.querySelector("#studentTable tbody");
const studentForm = document.querySelector("form");

// localStorage key for saving student data
const STORAGE_KEY = "studentsData";

// Track the row currently being edited (null means add mode)
let editRow = null;

/**
 * Check if a string contains only digits
 * @param {string} value
 * @returns {boolean}
 */
function isOnlyNumbers(value) {
  return /^\d+$/.test(value);
}

/**
 * Load student data array from localStorage
 * @returns {Array} students array
 */
function loadStudents() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Save student data array to localStorage
 * @param {Array} students
 */
function saveStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

/**
 * Render student records from localStorage into the table
 */
function renderStudents() {
  const students = loadStudents();
  studentTableBody.innerHTML = "";

  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.studentName}</td>
      <td>${student.studentId}</td>
      <td>${student.email}</td>
      <td>${student.contactNumber}</td>
      <td class="actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
      </td>
    `;
    studentTableBody.appendChild(row);
  });

  updateTableScrollbar();
}

/**
 * Update vertical scrollbar of the table container dynamically.
 * Shows scrollbar if row count > 3, hides otherwise.
 */
function updateTableScrollbar() {
  const container = document.getElementById("tableContainer");
  const tbody = studentTableBody;

  if (tbody.rows.length > 3) {
    container.style.overflowY = "auto"; // Show scrollbar
  } else {
    container.style.overflowY = "hidden"; // Hide scrollbar
  }
}

/**
 * Clear the form inputs and reset submit button and edit mode
 */
function clearFormAndReset() {
  studentForm.reset();
  editRow = null;
  submitButton.textContent = "Add Student";
}

/**
 * Pull values from the form inputs and trim them
 * @returns {Object} inputs object or null if empty
 */
function getFormValues() {
  return {
    name: studentName.value.trim(),
    id: studentId.value.trim(),
    email: studentEmail.value.trim(),
    contact: studentNumber.value.trim(),
  };
}

/**
 * Validate input fields with required constraints
 * Alerts if invalid; returns true if all valid
 */
function validateInputs({ name, id, email, contact }) {
  if (!name || !id || !email || !contact) {
    alert("Please fill in all fields.");
    return false;
  }
  if (!/^[A-Za-z\s]+$/.test(name)) {
    alert("Student Name must contain only letters and spaces.");
    return false;
  }
  if (!isOnlyNumbers(id)) {
    alert("Student ID must contain only numbers.");
    return false;
  }
  // Basic email validation
  if (!/\S+@\S+\.\S+/.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }
  if (!isOnlyNumbers(contact) || contact.length < 10) {
    alert("Contact Number must be numeric and at least 10 digits.");
    return false;
  }
  return true;
}

/**
 * Add or update student record based on edit mode
 */
function addEvent(e) {
  e.preventDefault();

  const { name, id, email, contact } = getFormValues();

  if (!validateInputs({ name, id, email, contact })) {
    return; // stop if validation fails
  }

  let students = loadStudents();

  if (editRow) {
    // Updating existing record
    const editedId = editRow.children[1].textContent;
    const index = students.findIndex((s) => s.studentId === editedId);

    // Ensure the new ID is either unchanged or unique
    if (index !== -1) {
      if (id !== editedId && students.some((s) => s.studentId === id)) {
        alert("Student ID already exists. Please use a unique ID.");
        return;
      }
      // Update the student record
      students[index] = {
        studentName: name,
        studentId: id,
        email: email,
        contactNumber: contact,
      };
    } else {
      alert("Error: Could not find student to update.");
      return;
    }
  } else {
    // Adding new record, check duplicate ID
    if (students.some((s) => s.studentId === id)) {
      alert("Student ID already exists. Please use a unique ID.");
      return;
    }
    students.push({
      studentName: name,
      studentId: id,
      email: email,
      contactNumber: contact,
    });
  }

  // Save updated student list and refresh table
  saveStudents(students);
  renderStudents();
  clearFormAndReset();
}

/**
 * Handle clicks on Edit and Delete buttons inside the table
 */
function modifyItem(e) {
  const target = e.target;

  if (target.classList.contains("delete-btn")) {
    const row = target.closest("tr");
    const studentIdToDelete = row.children[1].textContent;

    let students = loadStudents();
    students = students.filter((s) => s.studentId !== studentIdToDelete);

    saveStudents(students);
    renderStudents();

    if (editRow === row) {
      clearFormAndReset();
    }
  } else if (target.classList.contains("edit-btn")) {
    const row = target.closest("tr");

    // Fill form for editing
    studentName.value = row.children[0].textContent;
    studentId.value = row.children[1].textContent;
    studentEmail.value = row.children[2].textContent;
    studentNumber.value = row.children[3].textContent;

    editRow = row;
    submitButton.textContent = "Update Student";
  }
}

// Event listeners
submitButton.addEventListener("click", addEvent);
studentTableBody.addEventListener("click", modifyItem);

// Load data and render table on page load
window.addEventListener("DOMContentLoaded", () => {
  renderStudents();
  clearFormAndReset();
});
