"use strict";

const Course = require("../models/course");
const httpStatus = require("http-status-codes");
const User = require("../models/user");

// Function to extract course parameters from request body
const getCourseParams = body => {
  return {
    title: body.title,
    description: body.description,
    maxStudents: body.maxStudents,
    cost: body.cost
  };
};

module.exports = {
  // Retrieves all courses
  index: (req, res, next) => {
    Course.find()
      .then(courses => {
        res.locals.courses = courses;
        next();
      })
      .catch(error => {
        console.error(`Error fetching courses: ${error.message}`);
        next(error);
      });
  },

  // Renders the index view
  indexView: (req, res) => {
    res.render("courses/index");
  },

  // Renders the form for creating a new course
  new: (req, res) => {
    res.render("courses/new");
  },

  // Creates a new course
  create: (req, res, next) => {
    let courseParams = getCourseParams(req.body);
    Course.create(courseParams)
      .then(course => {
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.error(`Error saving course: ${error.message}`);
        next(error);
      });
  },

  // Redirects to a specified path
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  // Retrieves and renders a specific course
  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.error(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  // Renders the view for a specific course
  showView: (req, res) => {
    res.render("courses/show");
  },

  // Renders the form for editing a specific course
  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.render("courses/edit", {
          course: course
        });
      })
      .catch(error => {
        console.error(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  // Updates a specific course
  update: (req, res, next) => {
    let courseId = req.params.id;
    let courseParams = getCourseParams(req.body);

    Course.findByIdAndUpdate(courseId, { $set: courseParams })
      .then(course => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.error(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },

  // Deletes a specific course
  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/courses";
        next();
      })
      .catch(error => {
        console.error(`Error deleting course by ID: ${error.message}`);
        next(error);
      });
  },

  // Responds with JSON data
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals
    });
  },

  // Handles JSON errors
  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      };
    } else {
      errorObject = {
        status: httpStatus.OK,
        message: "Unknown Error."
      };
    }
    res.json(errorObject);
  },

  // Filters user courses
  filterUserCourses: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    if (currentUser) {
      let mappedCourses = res.locals.courses.map(course => {
        let userJoined = currentUser.courses.some(userCourse => {
          return userCourse.equals(course._id);
        });
        return Object.assign(course.toObject(), { joined: userJoined });
      });
      res.locals.courses = mappedCourses;
      next();
    } else {
      next();
    }
  },

  // Joins a course
  join: (req, res, next) => {
    let courseId = req.params.id;
    let currentUser = req.user;
    if (currentUser) {
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
          courses: courseId
        }
      })
        .then(() => {
          res.locals.success = true;
          next();
        })
        .catch(error => {
          next(error);
        });
    } else {
      next(new Error("User must log in."));
    }
  }
};
