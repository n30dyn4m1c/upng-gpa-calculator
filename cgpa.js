<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UPNG CGPA Calculator</title>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
    <style>
        body { padding: 20px; font-family: Arial, sans-serif; }
        .container { max-width: 800px; margin: auto; }
        .header { padding: 20px; text-align: center; background-color: #f8f9fa; margin-bottom: 20px; }
        .header h1 { color: #0d6efd; }
        table th, table td { text-align: center; vertical-align: middle; padding: 10px; }

        /* Add table borders */
        table {
            border: 1px solid #dee2e6;
        }
        table th, table td {
            border: 1px solid #dee2e6;
        }

        .ui-autocomplete {
            z-index: 1050;
            max-height: 200px;
            overflow-y: auto;
            background-color: #fff;
            border: 1px solid #ccc;
        }
        .button-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        /* Mobile-specific adjustments */
        @media (max-width: 768px) {
            body { font-size: 14px; padding: 10px; }
            .container { padding: 10px; }
            .header { padding: 10px; }
            .header h1 { font-size: 20px; }
            table {
                display: block;
                overflow-x: auto;
                white-space: nowrap;
                font-size: 12px;
            }
            table th, table td {
                padding: 5px;
            }
            button {
                font-size: 12px;
                padding: 5px 10px;
            }
            input, select {
                font-size: 12px;
                padding: 5px;
            }

            /* Adjust autocomplete and dropdown fonts for mobile */
            .ui-autocomplete { font-size: 12px !important; }
            select.form-control { font-size: 12px !important; appearance: none; -webkit-appearance: none; -moz-appearance: none; }
            select.form-control::-ms-expand { display: none; } /* Hide dropdown arrow in IE */
            input.course-input { font-size: 12px !important; padding: 5px; }
            .credits-input { font-size: 12px !important; padding: 5px; }
        }

        /* Style for credits to match grade points */
        .credits-display {
            font-size: 14px;
            padding: 5px;
        }

        /* Match GPA result size with button text */
        #result {
            font-size: 16px; /* Same as button text */
            padding: 5px;
        }

        /* Red X icon button with same red as Clear All button */
        .btn-remove {
            color: white;
            background-color: #dc3545; /* Bootstrap danger red */
            font-size: 16px;
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
        }
        .btn-remove::before {
            content: '\2716'; /* Unicode for X symbol */
        }
    </style>
      <script>
        MathJax = {
          tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']]
          },
          svg: {
            fontCache: 'global'
          }
        };
      </script>
      <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
      <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>UPNG CGPA Calculator</h1>
            <p style="text-align: left;">Calculate Cumulative Grade Point Average (CGPA) for courses studied across multiple semesters or academic years at the University of Papua New Guinea. You can enter repeated courses.</p>
        </div>
        <div class="button-container">
            <button onclick="addCourseRow()" class="btn btn-secondary">Add Course</button>
            <button onclick="clearAllCourses()" class="btn btn-danger">Clear All</button>
        </div>
        <table id="coursesTable" class="table table-bordered">
            <thead>
                <tr>
                    <th style="width: 55%;">Course Code/Name</th>
                    <th style="width: 10%;">Credits</th>
                    <th style="width: 20%;">Grade</th>
                    <th style="width: 10%;">Grade Point</th>
                    <th style="width: 5%;"></th>
                </tr>
            </thead>
            <tbody>
                <!-- Rows dynamically added here -->
            </tbody>
        </table>
        <button onclick="calculateCGPA()" class="btn btn-success">Calculate CGPA</button>
        <div id="result" class="mt-3"></div>
        <div class="mt-3">
            <b><p>CGPA Notes:</p></b>
<ul style="text-align: left;">
  <li>Repeat courses are allowed, but the highest grade attained will be used for calculation.</li>
  <li>Grade points are based on the following scale:
    <ul>
      <li>HD = 5, DI = 4, CR = 3, PA = 2, CP = 1, F = 0</li>
    </ul>
  </li>
  <li>The formula used is:
    <p style="text-align: center; font-size: 18px;">CGPA = \( \frac{\sum (\text{Highest Grade Points} \times \text{Credits})}{\sum (\text{Credits})} \)</p>
  </li>
  <li>CGPA calculations apply only within the same academic program. If you enroll in a new program, a separate CGPA calculation will begin for that program.</li>
</ul>
            <a href="index.html" class="btn btn-link">Go back to GPA Calculator</a>
        </div>
    </div>
    <script src="cgpa.js"></script>
</body>
</html>
