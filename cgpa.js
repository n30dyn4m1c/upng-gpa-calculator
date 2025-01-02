var globalCourses = [];
var allCourses = []; // Stores all courses for CGPA calculation

// Fetch courses from the JSON file
function fetchCourses() {
    console.log("Fetching courses.json...");
    const url = `courses.json?v=${new Date().getTime()}`; // Cache busting
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Courses Loaded:", data);
            globalCourses = data;
        })
        .catch(error => console.error("Failed to load courses:", error));
}

// Load courses when the page loads
document.addEventListener("DOMContentLoaded", function () {
    fetchCourses();
});

// Add course dynamically
function addCourseRow() {
    // Ensure courses are loaded
    console.log("All Courses:", allCourses);

    if (globalCourses.length === 0) {
        alert("Courses are still loading. Please wait and try again.");
        return;
    }

    var tbody = document.getElementById('coursesTable').getElementsByTagName('tbody')[0];
    var row = tbody.insertRow();
    var cellIndex = row.insertCell(0);
    var cellCredits = row.insertCell(1);
    var cellGrade = row.insertCell(2);
    var cellPoints = row.insertCell(3);
    var cellAction = row.insertCell(4);

    // Create input fields
    cellIndex.innerHTML = `<input type="text" class="form-control course-input" placeholder="Enter course number or name">`;
    cellCredits.innerHTML = `<input type="number" class="form-control credits-input" readonly>`;
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
    cellAction.innerHTML = `<button onclick="removeCourseRow(this)" class="btn btn-danger">Remove</button>`;

    // Attach autocomplete
    setTimeout(() => {
        $(".course-input").last().autocomplete({
            source: function (request, response) {
                var results = globalCourses.filter(course =>
                    course.number.toString().toLowerCase().includes(request.term.toLowerCase()) ||
                    course.name.toLowerCase().includes(request.term.toLowerCase())
                );
                response(results.map(course => ({
                    label: course.number + " - " + course.name,
                    value: course.number,
                    credits: course.credits
                })));
            },
            select: function (event, ui) {
                $(this).val(ui.item.label); // Display course info
                $(this).closest('tr').find('.credits-input').val(ui.item.credits); // Autofill credits

                // Prevent duplicate entries
                var existingCourse = allCourses.find(c => c.number === ui.item.value);
                if (!existingCourse) {
                    allCourses.push({
                        number: ui.item.value,
                        credits: ui.item.credits,
                        gradePoint: 0 // Initialize grade point
                    });
                }
                console.log("All Courses:", allCourses); // Debugging log
                return false;
            }
        });
    }, 100); // Delay to ensure DOM is ready
}

// Remove course row
function removeCourseRow(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

// Update grade points
function updateGradePoints(select) {
    var gradePoint = parseFloat(select.value);
    var row = select.parentNode.parentNode;

    // Update displayed grade point
    row.getElementsByClassName('grade-points')[0].textContent = gradePoint;

    // Update grade point in global array
    var courseName = row.getElementsByClassName('course-input')[0].value.split(' - ')[0];
    allCourses.forEach(course => {
        if (course.number === courseName) {
            course.gradePoint = gradePoint; // Update grade point
        }
    });
}

// Calculate CGPA
function calculateCGPA() {
    console.log("Calculating CGPA...");
    var courseMap = {};

    allCourses.forEach(course => {
        if (isNaN(course.gradePoint) || course.gradePoint === "") return;

        if (!courseMap[course.number] || course.gradePoint > courseMap[course.number].gradePoint) {
            courseMap[course.number] = course;
        }
    });

    var totalPoints = 0, totalCredits = 0;
    Object.values(courseMap).forEach(course => {
        totalPoints += course.credits * course.gradePoint;
        totalCredits += course.credits;
    });

    var cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    document.getElementById('result').textContent = `Your CGPA is: ${cgpa}`;
}
