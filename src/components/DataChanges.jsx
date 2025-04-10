// import axios
import axios from "axios";

// import toast
import toast from "react-hot-toast";

// import rrd
import { useNavigate, NavLink, useParams } from "react-router-dom";

// import react
import { useState, useEffect } from "react";

// import for phone
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

function DataChanges() {
  const navigate = useNavigate();
  const { idEvent } = useParams();

  const [language, setLanguage] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [image, setImage] = useState("");
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("OFFLINE");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [validated, setValidated] = useState(false);
  const [participant, setParticipant] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaderBtn, setLoaderBtn] = useState(true);

  
  // Upload photo to cloudinary
  const handleUpload = async () => {
    if (!image) {
      toast.error("Please upload an image!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "events");
    formData.append("cloud_name", "dmnx1jyqq");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dmnx1jyqq/image/upload",
        formData
      );

      console.log("Server :", response.data);
      setImgUrl(response.data.secure_url);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error while uploading!");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      toast.error("Please enter your event data.");
      setValidated(true);
      return;
    }

    // setting date
    if (
      new Date(`${startDate}T${startTime}`) > new Date(`${endDate}T${endTime}`)
    ) {
      toast.error("End time must be later than start time!");
      return;
    }

    const today = new Date();
    const todayDate = today.toISOString().split("T")[0]; //

    if (startDate < todayDate) {
      toast.error("Start date cannot be before today!");
      return;
    }

    if (endDate < todayDate) {
      toast.error("End date cannot be before today!");
      return;
    }

    // put to events
    try {
      setLoaderBtn(false);
      const response = await axios.put(
        `https://67ddbf11471aaaa742826b6e.mockapi.io/events/${idEvent}`,
        {
          eventName,
          location,
          language,
          eventType,
          startDate,
          startTime,
          endDate,
          endTime,
          imgUrl,
          phone,
          email,
          description,
          participant,
        }
      );
      setTimeout(() => {
        setLoading(false); // выключаем состояние загрузки после завершения запроса
        toast.success("Event updated successfully!");
        navigate("/myEvents");
      }, 1000);
    } catch (err) {
      setLoading(false);
      toast.error("Failed to update event");
      console.error(err);
    }

    // Reset form
    setEventName("");
    setLocation("");
    setLanguage("");
    setEventType("OFFLINE");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setImgUrl("");
    setPhone("");
    setEmail("");
    setDescription("");
    setValidated(false);
    setParticipant("");
  };

  return (
    <div>
      {/* create event  */}
      <div className=" text-info h2 mt-2">Edit Event Details</div>
      <div className="container my-3 border border-2 border-info rounded-0 py-2 pt-4">
        <form
          noValidate
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          onSubmit={handleSubmit}
        >
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-6">
                  <label htmlFor="source-language" className="form-label">
                    SOURCE LANGUAGE
                  </label>
                  <select
                    className="form-select mt-2 rounded-0"
                    name="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    id="source-language"
                    required
                  >
                    <option value="">Choose language</option>
                    <option value="English">English</option>
                    <option value="Russian">Russian</option>
                    <option value="Kazakh">Kazakh</option>
                  </select>
                  <div className="invalid-feedback">
                    Please select a source language.
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="uploadPhotos" className="form-label">
                    UPLOAD PHOTOS
                  </label>

                  <input
                    type="file"
                    className="form-control d-inline-block rounded-0"
                    name="uploadPhotos"
                    onChange={(e) => setImage(e.target.files[0])}
                    id="uploadPhotos"
                    required
                  />

                  <div className="invalid-feedback">Please upload a photo.</div>
                  <button
                    onClick={handleUpload}
                    type="button"
                    className="btn btn-info text-white my-2 rounded-0 mb-2"
                  >
                    Upload a photo
                  </button>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="row">
                <div className="col-6 my-3">
                  <label htmlFor="event-name" className="form-label">
                    EVENT NAME
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-0"
                    name="eventName"
                    value={eventName}
                    id="event-name"
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Event name.."
                    required
                  />
                  <div className="invalid-feedback">
                    Event name is required.
                  </div>
                </div>
                <div className="col-4 my-3">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-0"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    id="location"
                    placeholder="Location.."
                    required
                  />
                  <div className="invalid-feedback">Location is required.</div>
                </div>
                <div className="col-2 my-3">
                  <label htmlFor="participant" className="form-label">
                    {" "}
                    Participants
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-0"
                    name="participant"
                    value={participant}
                    onChange={(e) =>
                      setParticipant(parseInt(e.target.value) || 0)
                    }
                    required
                    min="1"
                    id="participant"
                    placeholder="83.."
                  />
                  <div className="invalid-feedback">
                    Participant is required.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 my-3 mt-4">
              <span>EVENT TYPE</span>
              <div className="row">
                <div className="col-6 d-grid">
                  <input
                    type="radio"
                    className="btn-check"
                    name="eventType"
                    onChange={(e) => setEventType(e.target.value)}
                    value="OFFLINE"
                    checked={eventType === "OFFLINE"}
                    id="option5"
                    required
                  />
                  <label
                    className="btn rounded-0 btn-outline-info"
                    htmlFor="option5"
                  >
                    OFFLINE EVENT
                  </label>
                </div>
                <div className="col-6 d-grid">
                  <input
                    type="radio"
                    className="btn-check"
                    name="eventType"
                    onChange={(e) => setEventType(e.target.value)}
                    value="ONLINE"
                    checked={eventType === "ONLINE"}
                    id="option6"
                    required
                  />
                  <label
                    className="btn rounded-0 btn-outline-info "
                    htmlFor="option6"
                  >
                    ONLINE EVENT
                  </label>
                </div>
              </div>
              <div className="invalid-feedback">
                Please select an event type.
              </div>
            </div>

            <div className="col-12 my-3 mt-5">
              <div className="row">
                <div className="col-6">
                  <label htmlFor="start-date" className="form-label">
                    START DATE
                  </label>
                  <input
                    type="date"
                    className="form-control rounded-0"
                    name="startDate"
                    onChange={(e) => setStartDate(e.target.value)}
                    value={startDate}
                    id="start-date"
                    required
                  />
                  <div className="invalid-feedback">
                    Start date is required.
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="start-time" className="form-label">
                    START TIME
                  </label>
                  <input
                    type="time"
                    className="form-control rounded-0"
                    name="startTime"
                    onChange={(e) => setStartTime(e.target.value)}
                    value={startTime}
                    id="start-time"
                    required
                  />
                  <div className="invalid-feedback">
                    Start time is required.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 my-3 mt-5">
              <div className="row">
                <div className="col-6">
                  <label htmlFor="end-date" className="form-label">
                    END DATE
                  </label>
                  <input
                    type="date"
                    className="form-control rounded-0"
                    name="endDate"
                    onChange={(e) => setEndDate(e.target.value)}
                    value={endDate}
                    id="end-date"
                    required
                  />
                  <div className="invalid-feedback">End date is required.</div>
                </div>
                <div className="col-6">
                  <label htmlFor="end-time" className="form-label">
                    END TIME
                  </label>
                  <input
                    type="time"
                    className="form-control rounded-0"
                    name="endTime"
                    onChange={(e) => setEndTime(e.target.value)}
                    value={endTime}
                    id="end-time"
                    required
                  />
                  <div className="invalid-feedback">End time is required.</div>
                </div>
              </div>
            </div>
            <div className="col-12 my-3 mt-5">
              <div className="row">
                <div className="col-6">
                  <label htmlFor="email" className="form-label">
                    EMAIL
                  </label>
                  <input
                    placeholder="Enter email..."
                    type="email"
                    className="form-control rounded-0"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    id="email"
                    required
                  />
                  <div className="invalid-feedback">Email is required.</div>
                </div>
                <div className="col-6">
                  <label htmlFor="phone" className="form-label">
                    PHONE NUMBER AND WHATSAPP
                  </label>
                  <PhoneInput
                    country={"kz"}
                    value={phone}
                    className="my-phone-input"
                    onChange={(phone) => setPhone(phone)}
                    inputProps={{
                      name: "phone",
                      required: true,
                    }}
                  />

                  <div className="invalid-feedback">
                    Phone number is required.
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="eventDescriptions" className="form-label">
                Event Description
              </label>
              <textarea
                name="eventDescriptions"
                className="form-control"
                id="eventDescriptions"
                onChange={(e) => setDescription(e.target.value)}
                required
                value={description}
                placeholder="Event Description..."
                style={{ height: "100px" }}
              ></textarea>
              <div className="invalid-feedback">
                Event Description is required.
              </div>
            </div>

            <div className="col-12 mt-4">
              <div className="row">
                <div className="col-6 d-grid">
                  <NavLink
                    className="d-grid  link-offset-2 link-underline link-underline-opacity-0"
                    to="/myEvents"
                  >
                    {" "}
                    <button type="button" className="btn btn-danger rounded-0">
                      CANCEL{" "}
                    </button>
                  </NavLink>
                </div>
                <div className="col-6 d-grid">
                  <button
                    type="submit"
                    className="btn btn-info text-white rounded-0 d-flex justify-content-center"
                    
                  >
                    <span>{loaderBtn ? <span>UPDATE</span> : <span className="loaderBtn"></span>}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DataChanges;
