const generateTablesButton = document.getElementById("generateTablesButton");

generateTablesButton.addEventListener("click", function () {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const numDaysPerWeek = parseInt(prompt("How many days per week?"));
    if (!numDaysPerWeek) return; // Cancelled

    const numWeeks = parseInt(prompt("How many weeks of study?"));
    if (!numWeeks) return; // Cancelled

    const numSubjects = parseInt(prompt("How many subjects would you like to study?"));
    if (!numSubjects) return; // Cancelled

    const numStudyBlocksPerDay = parseInt(prompt("How many 2-hour blocks per day?"));
    if (!numStudyBlocksPerDay) return; // Cancelled

    const subjects = [];
    for (let i = 1; i <= numSubjects; i++) {
        const subjectTitle = prompt(`Enter the title of Subject ${i}`);
        if (subjectTitle === null) return; // Cancelled
        subjects.push(subjectTitle);
    }

    const studyPlanTablesContainer = document.getElementById("studyPlanTables");
    studyPlanTablesContainer.innerHTML = "";

    const numTotalBlocksPerDay = numStudyBlocksPerDay * 2; // Including breaks

    for (let week = 1; week <= numWeeks; week++) {
        const tableTitle = document.createElement("h2");
        tableTitle.textContent = `Week ${week}`;
        studyPlanTablesContainer.appendChild(tableTitle);

        const table = document.createElement("table");
        table.className = "study-table";

        const headerRow = document.createElement("tr");
        headerRow.innerHTML = '<th class="hours-col">Hours</th>';
        for (let dayIndex = 0; dayIndex < numDaysPerWeek; dayIndex++) {
            const day = daysOfWeek[dayIndex];
            const th = document.createElement("th");
            th.textContent = day;
            headerRow.appendChild(th);
        }
        table.appendChild(headerRow);

        for (let block = 1; block <= numTotalBlocksPerDay; block++) {
            const row = document.createElement("tr");

            const hoursCell = document.createElement("td");
            hoursCell.textContent = block % 2 === 1 ? '2' : '1';
            hoursCell.classList.add("hours-col");
            row.appendChild(hoursCell);

            for (let dayIndex = 0; dayIndex < numDaysPerWeek; dayIndex++) {
                const cell = document.createElement("td");
                const subjectIndex = (dayIndex * numStudyBlocksPerDay + Math.ceil(block / 2) - 1) % numSubjects;
                cell.textContent = block % 2 === 1 ? subjects[subjectIndex] : 'Break';
                cell.classList.add(block % 2 === 0 ? 'break-cell' : 'subject-cell');
                row.appendChild(cell);
            }
            table.appendChild(row);
        }

        studyPlanTablesContainer.appendChild(table);
    }
});
