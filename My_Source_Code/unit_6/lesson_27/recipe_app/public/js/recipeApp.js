$(document).ready(() => {
  $("#modal-button").click(() => { // Event listener for modal button click
    $(".modal-body").html(""); // Clear modal body content
    $.get("/api/courses", (results = {}) => { // Send GET request to fetch courses from API
      let data = results.data; // Extract data from response
      if (!data || !data.courses) return; // If no data or courses found, return
      data.courses.forEach(course => { // Iterate over each course in the data
        $(".modal-body").append( // Append course details to modal body
          `<div>
						<span class="course-title">
							${course.title} <!-- Display course title -->
						</span>
						<button class='button ${course.joined ? "joined-button" : "join-button"}' data-id="${course._id}">
							${course.joined ? "Joined" : "Join"} <!-- Display 'Joined' or 'Join' button based on user's join status -->
						</button>
						<div class="course-description">
							${course.description} <!-- Display course description -->
						</div>
					</div>`
        );
      });
    }).then(() => { // After fetching courses, add event listener to join buttons
      addJoinButtonListener();
    });
  });
});

let addJoinButtonListener = () => {
  $(".join-button").click(event => { // Event listener for join button click
    let $button = $(event.target), // Get the clicked button element
      courseId = $button.data("id"); // Get the ID of the course associated with the button
    $.get(`/api/courses/${courseId}/join`, (results = {}) => { // Send GET request to join the course
      let data = results.data; // Extract data from response
      if (data && data.success) { // If join successful
        $button // Update button text and classes
          .text("Joined")
          .addClass("joined-button")
          .removeClass("join-button");
      } else { // If join failed
        $button.text("Try again"); // Update button text
      }
    });
  });
};
