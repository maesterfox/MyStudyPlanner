// Get modal and button elements
const modal = document.getElementById("studyPlanModal");
const btn = document.getElementById("generateStudyPlanBtn");
const span = document.getElementsByClassName("close")[0];
const submitModal = document.getElementById("submitModal");

// Open modal
btn.onclick = function () {
  modal.style.display = "block";
};

// Close modal
span.onclick = function () {
  modal.style.display = "none";
};

// Close modal if clicked outside of it
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// On submit, gather inputs and generate study plan
document.getElementById("submitModal").addEventListener("click", function () {
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

  const allSubjects = [...primarySubjects, ...secondarySubjects];

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

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
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
    headerRow.innerHTML = '<th class="hours-col">Hours</th>';
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
      studyHoursCell.textContent = "1"; // 1-hour study block
      studyHoursCell.classList.add("hours-col");
      studyRow.appendChild(studyHoursCell);

      for (let dayIndex = 0; dayIndex < daysPerWeek; dayIndex++) {
        const studyCell = document.createElement("td");
        let subject;

        if (prevSubjectSpan) {
          // Continue the previous subject for 2-hour blocks
          subject = prevSubjectSpan;
          prevSubjectSpan = null;
        } else {
          const subjectIndex =
            (Math.floor(block / 2) + dayIndex) % weightedSubjects.length;
          subject = subjectsForRow[subjectIndex];
          if (subject !== tertiarySubjects) {
            // If the subject is not tertiary, it should span the next row
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

  // Create a table to display the subject counts
  const countsTable = document.createElement("table");
  countsTable.id = "subjectCountsTable";
  const countsHeaderRow = document.createElement("tr");
  countsHeaderRow.innerHTML = "<th>Subject</th><th>Blocks</th>";
  countsTable.appendChild(countsHeaderRow);
  Object.keys(subjectCounts).forEach((subject) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${subject}</td><td>${subjectCounts[subject]}</td>`;
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

// Close the modal
document.getElementById("studyPlanModal").style.display = "none";

// Limit the "days per week" input to a maximum of 7
document.getElementById("daysInput").addEventListener("input", function () {
  const inputValue = parseInt(this.value);
  if (inputValue > 7) {
    this.value = 7;
  }
});
