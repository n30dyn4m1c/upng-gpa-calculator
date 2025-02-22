var globalCourses = [];
var selectedCourses = new Set(); // Store selected courses to track duplicates

// Fetch courses from the local JSON file
function fetchCourses() {
    console.log("Fetching courses.json with cache-busting...");

    const url = `courses.json?v=${new Date().getTime()}`; // Unique URL each time

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Courses Loaded:", data);
            globalCourses = data;
        })
        .catch(error => console.error("Failed to load courses:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    fetchCourses(); // Load courses when page loads
});

// Add a new course row dynamically
function addCourseRow() {
    var tbody = document.getElementById('coursesTable').getElementsByTagName('tbody')[0];
    var row = tbody.insertRow();
    var cellIndex = row.insertCell(0);
    var cellCredits = row.insertCell(1);
    var cellGrade = row.insertCell(2);
    var cellPoints = row.insertCell(3);
    var cellAction = row.insertCell(4);

    cellIndex.innerHTML = `<input type="text" class="form-control course-input" placeholder="Enter course">`;
    cellCredits.innerHTML = `<div class="credits-input"></div>`;
    cellGrade.innerHTML = `
        <select class="form-control grade-select" onchange="updateGradePoints(this)">
            <option value="">Select Grade</option>
            <option value="5">HD</option>
            <option value="4">DI</option>
            <option value="3">CR</option>
            <option value="2">PA</option>
            <option value="1">CP</option>
            <option value="0">F</option>
        </select>`;
    cellPoints.innerHTML = `<div class="grade-points"></div>`;
    cellAction.innerHTML = `<button onclick="removeCourseRow(this)" class="btn-remove"></button>`; // Red X button

    $(cellIndex).find('input').autocomplete({
        source: globalCourses.map(course => ({
            label: course.number + " - " + course.name,
            value: course.number,
            credits: course.credits
        })),
        select: function (event, ui) {
            // Check for duplicates
            if (selectedCourses.has(ui.item.value)) {
                alert("You have already selected this course. You cannot repeat a course in the same semester or academic year. Use the CGPA calculator for repetitions.");
                $(this).val(''); // Clear the duplicate input
            } else {
                // Add course to selectedCourses
                selectedCourses.add(ui.item.value);

                console.log("Selected Course:", ui.item);
                $(this).val(ui.item.label);
                $(this).closest('tr').find('.credits-input').text(ui.item.credits);
            }
            return false;
        }
    });
}

// Remove a course row
function removeCourseRow(button) {
    var row = button.parentNode.parentNode;
    var courseCode = row.querySelector('.course-input').value.split(' - ')[0];

    // Remove the course from the selectedCourses set
    selectedCourses.delete(courseCode);
    row.parentNode.removeChild(row);
}

// Update grade points dynamically
function updateGradePoints(select) {
    var gradePoint = select.value;
    var row = select.parentNode.parentNode;
    row.getElementsByClassName('grade-points')[0].textContent = gradePoint;
}

function calculateGPA() {
    var rows = document.querySelectorAll('#coursesTable tbody tr');
    var totalPoints = 0, totalCredits = 0;

    rows.forEach(row => {
        var credits = parseFloat(row.getElementsByClassName('credits-input')[0].textContent); // Credits
        var points = parseFloat(row.getElementsByClassName('grade-points')[0].textContent); // Grade point

        if (!isNaN(credits) && !isNaN(points)) {
            totalPoints += credits * points;
            totalCredits += credits;
        }
    });

    var gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

    document.getElementById('result').textContent = `Your GPA is: ${gpa}`;
}

function clearAllCourses() {
    document.querySelector('#coursesTable tbody').innerHTML = '';
    document.getElementById('result').textContent = '';
    selectedCourses.clear(); // Clear the selectedCourses set
}
