// import { useNavigate } from "react-router-dom";
// import { Button } from "react-bootstrap";
// import imgNotFound from "../assets/imgNotFound.svg";

// function NotFoundPage() {
//   const navigate = useNavigate();

//   return (
//     <div className="container-fluid d-flex justify-content-center align-items-center vw-100 vh-100 m-0 p-0 bg-img">
//       <div className="row w-100 d-flex justify-content-center align-items-center ">
//         <div className="col-5 py-5 d-flex justify-content-center align-items-center rounded-4 bg-light position-relative">
//           <div className="row d-flex justify-content-center align-items-center">
//             <div className="col-12 d-flex justify-content-center align-items-center position-relative">
//               <img src={imgNotFound} className="img-fluid my-3" alt="" />
//               <h1
//                 className="position-absolute text-center text-white"
//                 style={{
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   fontSize: "120px",
//                   fontWeight: "bold",
//                   textShadow: "2px 2px 10px rgba(0,0,0,0.8)", // Фонда яхши кўриниши учун
//                 }}
//               >
//                 404
//               </h1>
//             </div>

//             <div className="col-12 d-flex justify-content-center align-items-center">
//               <p className="fs-3 fw-medium mt-5 mb-3">
//                 Looks like you've got lost...
//               </p>
//             </div>
//             <div className="col-12 d-flex justify-content-center align-items-center">
//               <Button
//                 variant="primary"
//                 size="lg"
//                 onClick={() => navigate("/login")}
//                 style={{
//                   padding: "0.5rem 2rem",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Back to Login
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default NotFoundPage;

import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import imgNotFound from "../assets/imgNotFound.svg";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 m-0 p-0 bg-img">
      <div className="row w-100 d-flex justify-content-center align-items-center m-0 p-2">
        <div className="col-lg-5 col-md-8 col-12 py-4 py-lg-5 d-flex justify-content-center align-items-center rounded-4 bg-light position-relative">
          <div className="row d-flex justify-content-center align-items-center w-100 m-0">
            <div className="col-12 d-flex justify-content-center align-items-center position-relative">
              <img 
                src={imgNotFound} 
                className="img-fluid my-3" 
                alt="404 illustration" 
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <h1
                className="position-absolute text-center text-white"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "clamp(60px, 10vw, 120px)",
                  fontWeight: "bold",
                  textShadow: "2px 2px 10px rgba(0,0,0,0.8)",
                }}
              >
                404
              </h1>
            </div>

            <div className="col-12 d-flex justify-content-center align-items-center text-center px-2">
              <p className="fs-4 fs-md-3 fw-medium mt-4 mt-md-5 mb-3 mb-md-4">
                Looks like you've got lost...
              </p>
            </div>
            <div className="col-12 d-flex justify-content-center align-items-center mb-3 mb-md-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/login")}
                className="px-4 py-2 fw-bold"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;