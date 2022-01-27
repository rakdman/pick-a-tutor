import React, { useEffect, useState } from "react"
import { Container, Row, Col, ListGroup, Button, Image, Card } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import CourseCard from "../Components/CourseCard"
import { Link, useParams } from "react-router-dom"
import apiEndPoints from "../Components/ApiEndpoints"
import jwt_decode from "jwt-decode"
import tutorImage1 from "../images/tutor1.jpg"
import FileListItem from "../Components/FileListItem"

function TutorProfile() {
  const status = localStorage.getItem("statusCode")
  const encodedToken = localStorage.getItem("token")
  var token = ""
  if (encodedToken) token = jwt_decode(encodedToken)

  const [tutorProfile, setTutorProfile] = useState(null)
  const { id } = useParams()

  const getTutorProfile = async (tutorID) => {
    const tutorProfile = await apiEndPoints.getTutorProfile(tutorID)
    setTutorProfile(tutorProfile)
  }

  const [tutor, setTutor] = useState([])

  const getTutor = async () => {
    const data = await apiEndPoints.getTutorById(id)
    setTutor(() => data.data.data[0])
  }

  useEffect(() => {
    getTutorProfile(id)
    getTutor()
  }, [])

  return (
    tutorProfile && (
      <Container>
        <Row style={{ marginTop: " 1rem" }}>
          <Col md={5}>
            <Image
              // TODO: Switch to dynamically loaded images from the backend
              src={tutorImage1}
              fluid={true}
              thumbnail={true}
              className="floatRight"
              alt="tutor image"
              style={{ height: "400px", width: "600px" }}
            />
          </Col>
          <Col md={7} className="flexColumn">
            <h3>{tutorProfile.firstName + " " + tutorProfile.lastName} {id == token.id ? "(You)" : ""}</h3>
            <h6>
              {/* TODO: add real value of the rating and num of reviews after receiving it from the backend */}
              {4.5}
              <i className="bi bi-star-fill" style={{ color: "#ffff00" }} /> 
              {/* TODO: Add num of reviews from backend */}
              
            </h6>
            {
              // only logged in users should see a button
              status === null ?
                <></> :
                // only THIS tutor should see the "Edit profile" button, everyone else should see "Contact tutor"
                id != token.id ?
                  <Link to={"/chat"} state={{ contact: tutor }}>
                    <Button variant="outline-primary" style={{ margin: "5px" }}>Contact tutor</Button>
                  </Link>
                  :
                  <Button
                    variant="outline-primary"
                    style={{ margin: "5px" }}
                    href={"/editTutorProfile"}
                  >
                    Edit profile
                  </Button>
            }
          </Col>
        </Row>

        <Row style={{ marginTop: " 1rem" }}>
          <Col>
            <h3>Description</h3>
            {/* TODO: add non dummy value from the backend */}
            {"10 years experience in the academic and the industrial fields."}
          </Col>
        </Row>

        <Row style={{ marginTop: " 1rem" }}>
          <Col>
            <h3>Files</h3>
            <ListGroup variant="flush">
              {
                // TODO: fix this, it is not showing anything for anonymous users
                // users who are not THIS tutor should only see approved files
                id != token.id ?
                  tutorProfile.files
                    .filter((file) => file.approvalStatus === "Approved")
                    .map((file) => (
                      <FileListItem file={file} key={file.id} />
                    ))
                  :
                  tutorProfile.files.map((file) => (
                    <FileListItem file={file} isThisTutor={true} key={file.id} />
                  ))
              }
            </ListGroup>
          </Col>
        </Row>

        <Row style={{ marginTop: " 1rem" }}>
          <h1>Courses</h1>
          <Container style={{ overflowX: "scroll" }}>
            <Container style={{ display: "flex" }}>
              <Card
                style={{
                  width: "20rem",
                  fontSize: "1rem",
                  borderColor: "transparent",
                  minWidth: "270px",
                }}
              >
                <Card.Body>
                  {
                    // users who are not THIS tutor should not see an "Add course" button
                    id != token.id ?
                      <></>
                      :
                      <Button
                        variant="outline-primary"
                        style={{ margin: "5px" }}
                        href="/addCourse"
                      >
                        Add course
                      </Button>
                  }
                </Card.Body>
              </Card>
              {tutorProfile.Courses.map((course) => {
                // Make the course object structure uniform
                const formattedCourse = Object.assign(
                  course,
                  course.TutorCourse
                )
                return (
                  <CourseCard
                    tutorName={
                      tutorProfile.firstName + " " + tutorProfile.lastName
                    }
                    course={formattedCourse}
                    key={formattedCourse.id}
                  />
                )
              })}
            </Container>
          </Container>
        </Row>
      </Container >
    )
  )
}

export default TutorProfile