$(document).ready(() => {
  $("#modal-button").click(() => {
    $(".modal-body").html("");
    // Make a GET request to fetch course data from the API
    $.get(`/api/courses`, (results = {}) => {
      let data = results.data;
      // Check if data and courses array exist
      if (!data || !data.courses) return;
      // Iterate through each course in the data and append it to the modal body
      data.courses.forEach(course => {
        $(".modal-body").append(
          `<div>
            <span class="course-title">${course.title}</span>
            <span class="course-cost">$${course.cost}</span>
            <button class="${course.joined ? "joined-button" : "join-button"} btn btn-info btn-sm" data-id="${course._id}">
              ${course.joined ? "Joined" : "Join"}
            </button>
            <div class="course-description">${course.description}</div>
          </div>`
        );
      });
    }).then(() => {
      // Add event listener to the join buttons after modal content is loaded
      addJoinButtonListener();
    });
  });
});

// Function to handle click event on join buttons
let addJoinButtonListener = () => {
  $(".join-button").click(event => {
    let $button = $(event.target),
      courseId = $button.data("id");
    // Log the URL for joining a course
    console.log(`/api/courses/${courseId}/join`);
    // Make a GET request to join the course
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      let data = results.data;
      // If the join request is successful, update the button text and style
      if (data && data.success) {
        $button
          .text("Joined")
          .addClass("joined-button")
          .removeClass("join-button");
      } else {
        // If the join request fails, display "Try again" on the button
        $button.text("Try again");
      }
    });
  });
};
