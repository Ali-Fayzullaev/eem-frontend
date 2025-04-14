import React from 'react'
// import  react
import { useState, useEffect } from "react";

// import from axios
import axios from "axios";
// import hooks
import useFetch from "../hook/useFetch";

// import toasts
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

// import from RRD
import { NavLink } from "react-router-dom";

// import MyEvents from './MyEvents'


function ChangesDataAdmin() {


    const axiosInstance = axios.create({
        baseURL: "https://67ddbf11471aaaa742826b6e.mockapi.io/",
      });
    
      // useState
      const [show, setShow] = useState(true);
     
    
      // API for events
      const {
        data: events,
        loading,
        error,
        refetch,
      } = useFetch(`https://67ddbf11471aaaa742826b6e.mockapi.io/events`);
    
      const handleDelete = async (id) => {
        try {
          await axiosInstance.delete(`events/${id}`);
    
          console.log(`Deleted event id: ${id}`);
          refetch();
          toast.success("Cancelled !");
        } catch (err) {
          console.error("Error deleting event:", err);
        }
      };
    
      const handleOpenCloseAccordion = () => {
        setShow(!show);
      };

  return (
    <div>
        <Toaster />
        <ToastContainer />
        <div className="accordion" id="accordionPanelsStayOpenExample">
            {/* {<MyEvents/>} */}
            <div className="accordion-item my-custom-accordion">
                <h2 className="accordion-header">
                <button
                    className="accordion-button "
                    onClick={handleOpenCloseAccordion}
                    type="button"
                    aria-expanded="true"
                    aria-controls="panelsStayOpen-collapseOne"
                >
                    <div className="w-100 h-100 my-2 text-start d-flex justify-content-between align-items-center">
                    <span className="fw-medium fs-5">My Created Events </span>
                    {events?.length ? (
                        <span className="fw-bolder mx-3">
                        You have:
                        <code className="fs-5 ">
                            {" "}
                            {loading && (
                            <div className="loaderEvents d-inline-block"></div>
                            )}{" "}
                            {events?.length}{" "}
                        </code>{" "}
                        events
                        </span>
                    ) : (
                        "You haven't created any events yet 😢"
                    )}
                    </div>

                    <p></p>
                </button>
                </h2>
                <div
                id="panelsStayOpen-collapseOne"
                className={`accordion-collapse scrollable ${show ? "show" : ""}`}
                >
                <div className="accordion-body ">
                    {loading && <div className="loader"></div>}
                    {error && <div className="loaderErr"></div>}
                    <div className="row">
                    {events &&
                        events.map((event) => (
                        <div key={event.id} className="col-md-4">
                            <div className="card mb-3 ">
                            {event.imgUrl && (
                                <img
                                src={event.imgUrl}
                                className=" img-fluid rounded-3"
                                style={{
                                    width: "100%",
                                    height: "250px",
                                    objectFit: "cover",
                                }}
                                alt={event.eventName}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{event.eventName}</h5>
                                <p className="card-text">
                                📅 {event.startDate} | ⏰ {event.startTime}
                                </p>
                                <div className="d-flex gap-2">
                                <button
                                    onClick={() => addToCalendar(event)}
                                    className="btn btn-success"
                                >
                                    📆 Add to Calendar
                                </button>
                                {/* Button trigger modal  */}
                                <button
                                    data-bs-toggle="modal"
                                    data-bs-target={`#${event.id}`}
                                    className="btn btn-danger"
                                >
                                    🗑 Сancel
                                </button>
                                {/* Modal  */}
                                <div
                                    className="modal fade"
                                    key={event.id}
                                    id={`${event.id}`}
                                    tabIndex="-1"
                                    aria-labelledby="exampleModalLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                        <h1
                                            className="modal-title fs-5"
                                            id="exampleModalLabel"
                                        >
                                            My Events
                                        </h1>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                        </div>
                                        <div className="modal-body">
                                        Do you really want to delete{" "}
                                        <strong>{event.eventName}</strong>?
                                        <h5 className="card-title">
                                            {event.eventName}
                                        </h5>
                                        <p className="card-text">
                                            📅 {event.startDate} | ⏰{" "}
                                            {event.startTime}
                                        </p>
                                        </div>
                                        <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(event.id)}
                                            data-bs-dismiss="modal"
                                            className="btn btn-danger text-white"
                                        >
                                            🗑 Сancel
                                        </button>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </div>
                                <div className="d-flex gap-2">
                                <NavLink to={`changesDataAdmin/change/${event.id}`}>
                                    <button className="btn btn-info mt-2 text-white">
                                         Changes
                                    </button>
                                </NavLink>
                                <NavLink to={`list/${event.id}`}>
                                    <button className="btn btn-warning mt-2 text-white">
                                    Participants
                                    </button>
                                </NavLink>
                                </div>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChangesDataAdmin