// In your external JavaScript file

// Possibly addig a drag and drop feature 

document.addEventListener("DOMContentLoaded", function () {
  showLoader();

  setTimeout(function () {
    hideLoader();
  }, 4000); // 4 seconds delay before hiding the loader
});

function showLoader() {
  var loader = document.querySelector(".loader");
  loader.style.opacity = "1"; // Ensure the loader is fully visible
}

function hideLoader() {
  var loader = document.querySelector(".loader");
  loader.style.opacity = "0"; // Set opacity to 0 to trigger transition
  setTimeout(function () {
    loader.style.display = "none"; // Hide the loader after the transition
  }, 1000); // Wait for the transition to complete (1 second)
}

// Get modal and button elements
const modal = document.getElementById("studyPlanModal");
const documentationModal = document.getElementById("documentationModal");
const btn = document.getElementById("generateStudyPlanBtn");
const span = document.getElementsByClassName("close")[0];
const generateBtn = document.getElementById("generateStudyPlanBtn"); // Get the button
const closeDocumentationBtn = document.getElementById("closeDocumentationBtn");

// Add event listeners

// Functions to show/hide the button
function showButton() {
  generateBtn.style.display = "block";
}

function openModal() {
  console.log("openModal called"); // Add this line
  modal.style.display = "block";
  hideButton();
}

function openDocumentationModal() {
  console.log("openDocumentationModal called");
  documentationModal.style.display = "block";
}

function hideButton() {
  console.log("hideButton called"); // Add this line
  generateBtn.style.display = "none";
}

function closeModal() {
  modal.style.display = "none";
  showButton();
}

function closeDocumentationModal() {
  documentationModal.style.display = "none";
}

// Open modal
btn.onclick = function () {
  modal.style.display = "block";
};

// Open documentation modal
document
  .getElementById("documentationBtn")
  .addEventListener("click", openDocumentationModal);

// Close modal
span.onclick = function () {
  modal.style.display = "none";
};

// Close documentation modal
closeDocumentationBtn.onclick = closeDocumentationModal;

// Add event listeners to your modal's open/close triggers
const modalTriggerBtn = document.getElementById("generateStudyPlanBtn"); // Replace with your trigger
modalTriggerBtn.addEventListener("click", openModal);

// Close the modal
modal.style.display = "none"; // Corrected

// Close span (attaches to the closeModal function)
span.onclick = closeModal;

// Close modal if clicked outside of it
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// On submit, gather inputs and generate study plan
document.getElementById("submitModal").addEventListener("click", function () {
  closeModal();
  const primarySubjectsInput = document.getElementById(
    "primarySubjectInput"
  ).value;
  const secondarySubjectsInput = document.getElementById(
    "secondarySubjectInput"
  ).value;
  const tertiarySubjectsInput = document.getElementById(
    "tertiarySubjectInput"
  ).value;
  const primarySubjects = primarySubjectsInput.split(",");
  const secondarySubjects = secondarySubjectsInput.split(",");
  const tertiarySubjects = tertiarySubjectsInput.split(",");

  const allSubjects = [
    ...primarySubjects,
    ...secondarySubjects,
    ...tertiarySubjects,
  ];

  // Check for at least 2 subjects
  if (allSubjects.length < 2) {
    alert("Please enter at least 2 subjects.");
    return;
  }

  const hoursPerDay = parseInt(document.getElementById("hoursInput").value);
  const daysPerWeek = parseInt(document.getElementById("daysInput").value);
  const totalWeeks = parseInt(document.getElementById("weeksInput").value);

  // Initialize the subject counts
  const subjectCounts = {};

  const daysOfWeek = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
  const studyPlanTablesContainer = document.getElementById("studyPlanTables");
  studyPlanTablesContainer.innerHTML = "";

  // Calculate the total number of 2-hour blocks available in a day
  const totalBlocksPerDay = Math.floor(hoursPerDay / 2);
  const tertiaryOneHourBlocks = Math.floor(hoursPerDay * 0.1);

  // Create a weighted subject list where primary subjects appear twice as often as secondary subjects
  const weightedSubjects = [
    ...primarySubjects,
    ...primarySubjects,
    ...primarySubjects,
    ...primarySubjects,
    ...primarySubjects,
    ...primarySubjects,
    ...primarySubjects,
    ...primarySubjects,
    ...secondarySubjects,
    ...secondarySubjects,
    ...secondarySubjects,
    ...secondarySubjects,
    ...tertiarySubjects,
  ];

  // Generate the study plan tables
  for (let week = 1; week <= totalWeeks; week++) {
    const tableTitle = document.createElement("h2");
    tableTitle.textContent = `Week ${week}`;
    studyPlanTablesContainer.appendChild(tableTitle);
    const table = document.createElement("table");
    table.className = "study-table";

    // Add tertiary subjects into weightedSubjects
    for (let i = 0; i < tertiaryOneHourBlocks; i++) {
      weightedSubjects.push(tertiarySubjects);
    }

    // Table Header
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = '<th class="hours-col">Hrs</th>';
    for (let dayIndex = 0; dayIndex < daysPerWeek; dayIndex++) {
      const day = daysOfWeek[dayIndex];
      const th = document.createElement("th");
      th.textContent = day;
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Variable to track whether the previous subject should span to the next row
    let prevSubjectSpan = null;

    // Loop through total number of 1-hour blocks
    for (let block = 0; block < totalBlocksPerDay * 2; block++) {
      // 2 rows for each 2-hour block
      const subjectsForRow = [...weightedSubjects];
      shuffleArray(subjectsForRow); // Shuffle the subjects for interleaving

      // Create a study row
      const studyRow = document.createElement("tr");
      const studyHoursCell = document.createElement("td");
      const tertiarySubjectProbability = 0.1; // 10% chance

      studyHoursCell.textContent = "1"; // 1-hour study block
      studyHoursCell.classList.add("hours-col");
      studyRow.appendChild(studyHoursCell);

      for (let dayIndex = 0; dayIndex < daysPerWeek; dayIndex++) {
        const studyCell = document.createElement("td");
        let subject;

        if (prevSubjectSpan) {
          subject = prevSubjectSpan;
          prevSubjectSpan = null;
        } else {
          const subjectIndex =
            (Math.floor(block / 2) + dayIndex) % weightedSubjects.length;

          if (Math.random() < tertiarySubjectProbability) {
            subject = tertiarySubjects;
          } else {
            subject = subjectsForRow[subjectIndex];
          }

          if (subject !== tertiarySubjects) {
            prevSubjectSpan = subject;
          }
        }

        studyCell.textContent = subject;
        studyCell.classList.add("subject-cell");
        studyRow.appendChild(studyCell);

        // Update the subject counts
        if (subjectCounts[subject]) {
          subjectCounts[subject] += 1;
        } else {
          subjectCounts[subject] = 1;
        }
      }
      table.appendChild(studyRow);
    }
    studyPlanTablesContainer.appendChild(table);
  }

  // Create a table to display the subject counts with percentages
  const countsTable = document.createElement("table");
  countsTable.id = "subjectCountsTable";
  const countsHeaderRow = document.createElement("tr");
  countsHeaderRow.innerHTML =
    "<th>Subject</th><th>Blocks</th><th>Percentage</th>"; // Add a new header for percentage
  countsTable.appendChild(countsHeaderRow);

  // Calculate the total number of blocks allocated to all subjects
  const totalBlocksAllocated = Object.values(subjectCounts).reduce(
    (acc, curr) => acc + curr,
    0
  );

  Object.keys(subjectCounts).forEach((subject) => {
    const row = document.createElement("tr");
    const blocks = subjectCounts[subject];
    const percentage = ((blocks / totalBlocksAllocated) * 100).toFixed(2); // Calculate percentage based on total blocks allocated
    row.innerHTML = `<td>${subject}</td><td>${blocks}</td><td>${percentage}%</td>`; // Display percentage in the table
    countsTable.appendChild(row);
  });

  // Insert the counts table above the schedule tables
  studyPlanTablesContainer.insertBefore(
    countsTable,
    studyPlanTablesContainer.firstChild
  );
});

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap array elements
  }
}

// Limit the "days per week" input to a maximum of 7
document.getElementById("daysInput").addEventListener("input", function () {
  const inputValue = parseInt(this.value);
  if (inputValue > 7) {
    this.value = 7;
  }
});
