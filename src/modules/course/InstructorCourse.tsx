import React, { useEffect, useState } from "react";
import Navbar from "../home/Navbar.tsx";

interface Course {
  title: string;
  description: string;
  instructorName: string;
  category: string;
  imageUrl: string;
  courseID: string;
}

const LOCAL_STORAGE_KEY = "instructor-courses";

const InstructorCourse: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newCourse, setNewCourse] = useState<Course>({
    title: "",
    description: "",
    instructorName: "",
    category: "",
    imageUrl: "",
    courseID: ""
  });
  useEffect(() => {
    const storedCourses = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    } else {
      let defaultCourses: Course[] = JSON.parse(localStorage.getItem("evidwan-available-courses") || "[]");
      defaultCourses = [...defaultCourses, ...JSON.parse(localStorage.getItem("evidwan-enrolled-courses") || "[]")];
      setCourses(defaultCourses);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultCourses));
    }
  }, []);

  const updateStorage = (updatedCourses: Course[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCourses));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleCreateCourse = () => {
    // Validation: Check if any field is empty
    const fields: any = Object.values(newCourse);
    if (fields.some(field => !field.trim())) {
      alert("Please fill in all fields.");
      return;
    }
  
    let updatedCourses: Course[];
    if (editIndex !== null) {
      updatedCourses = courses.map((course, index) =>
        index === editIndex ? newCourse : course
      );
      setEditIndex(null);
    } else {
      updatedCourses = [...courses, newCourse];
    }
  
    setCourses(updatedCourses);
    updateStorage(updatedCourses);
  
    // Append to existing data in local storage
    const existingCourses = JSON.parse(localStorage.getItem("evidwan-available-courses") || "[]");
    const combinedCourses = [...existingCourses, newCourse];
    localStorage.setItem("evidwan-available-courses", JSON.stringify(combinedCourses));
    setShowDialog(false);
    setNewCourse({ title: "", description: "", instructorName: "", category: "", imageUrl: "", courseID: ""});
  };

  const handleEditCourse = (index: number) => {
    setEditIndex(index);
    setNewCourse(courses[index]);
    setShowDialog(true);
  };

  const handleDeleteCourse = (index: number) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
    updateStorage(updatedCourses);
  };

  return (
    <>
      <Navbar role="Instructor" />
      <div className="container mt-4">
        <style>
          {`
            .uniform-img {
              height: 180px;
              width: 100%;
              object-fit: cover;
              border-top-left-radius: 0.375rem;
              border-top-right-radius: 0.375rem;
            }
          `}
        </style>

        <div className="text-center">
        <button
  className="btn btn-secondary btn-outline-light mb-3 createButton"
  onClick={() => {
    setEditIndex(null);
    setNewCourse({ title: "", description: "", instructorName: "", category: "", imageUrl: "", courseID: "" });
    setShowDialog(true);
  }}
>
  Create Course
</button>
        </div>

        <div className="row">
          {courses.map((course, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card h-100">
                <img
                  src={course.imageUrl}
                  className="card-img-top uniform-img"
                  alt={course.title}
                />
                <div className="card-body cbody">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">Course ID: {course.courseID}</p>
                  <p className="card-text">Description: {course.description}</p>
                  <p className="card-text">Instructor: {course.instructorName}</p>
                  <p className="card-text">Category: {course.category}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEditCourse(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleDeleteCourse(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showDialog && (
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editIndex !== null ? "Edit Course" : "Create New Course"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDialog(false)}
                  ></button>
                </div>
                <div className="modal-body">
                <input
                    type="text"
                    className="form-control mb-2"
                    name="courseID"
                    value={newCourse.courseID}
                    onChange={handleInputChange}
                    placeholder="Course ID"
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="title"
                    value={newCourse.title}
                    onChange={handleInputChange}
                    placeholder="Course Title"
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="description"
                    value={newCourse.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="instructorName"
                    value={newCourse.instructorName}
                    onChange={handleInputChange}
                    placeholder="Instructor Name"
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="category"
                    value={newCourse.category}
                    onChange={handleInputChange}
                    placeholder="Category"
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="imageUrl"
                    value={newCourse.imageUrl}
                    onChange={handleInputChange}
                    placeholder="Image URL"
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCreateCourse}
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDialog(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InstructorCourse;
