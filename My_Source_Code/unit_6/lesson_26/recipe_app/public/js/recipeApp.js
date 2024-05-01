$(document).ready(() => {
  $("#modal-button").click(() => { // Event listener for click on modal button
    $(".modal-body").html(""); // Clear modal body content
    $.get("/courses?format=json", data => { // Send GET request to fetch course data in JSON format
      data.forEach(course => { // Iterate over each course in the data
        $(".modal-body").append( // Append course details to modal body
          `<div>
            <span class="course-title">
              ${course.title} <!-- Display course title -->
            </span>
            <div class="course-description">
              ${course.description} <!-- Display course description -->
            </div>
          </div>`
        );
      });
    });
  });
});
