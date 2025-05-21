import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { authService } from "../api/authService";
import { useState, useEffect } from "react";
import useFetch from "../hook/useFetchh";
import "../Pay.css";
function Payment() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  
    useEffect(() => {
      const data = authService.getCurrentUser();
      if (data) {
        setCurrentUser(data);
      }
    }, []);

    const {data: event} = useFetch(`http://localhost:8080/api/v1/events/${id}`)

    console.log(event)

  return (
    <>
    <div className="card-pay">
      <div className="card-top border-bottom text-center">
        <Link to={`/${currentUser && (currentUser.role === "admin" || currentUser.role === "meneger") ? "admin" : "user"}/events`}>
          Бас тарту
        </Link>
        <span id="logo">{id}</span>
      </div>
  
      <div className="card-body-pay">
        <div className="row upper">
          <span>
            <i className="fa fa-check-circle-o"></i> Сатып алу себеті
          </span>
          <span>
            <i className="fa fa-check-circle-o"></i> Тапсырыс мәліметтері
          </span>
          <span id="payment">
            <span id="three">{id}</span>Төлем
          </span>
        </div>
  
        <div className="row">
          <div className="col-md-7">
            <div className="left border">
              <div className="row">
                <span className="header">Төлем</span>
                <div className="icons">
                  <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
                  <img src="https://img.icons8.com/color/48/000000/mastercard-logo.png" alt="MasterCard" />
                  <img src="https://img.icons8.com/color/48/000000/maestro.png" alt="Maestro" />
                </div>
              </div>
              <form>
                <span>Карта иесінің аты:</span>
                <input placeholder="Линда Уильямс" />
                <span>Карта нөмірі:</span>
                <input placeholder="0125 6780 4567 9909" />
                <div className="row">
                  <div className="col-4">
                    <span>Мерзімі:</span>
                    <input placeholder="YY/MM" />
                  </div>
                  <div className="col-4">
                    <span>CVV:</span>
                    <input id="cvv" />
                  </div>
                </div>
                <input type="checkbox" id="save_card" className="align-left" />
                <label htmlFor="save_card">Карта мәліметтерін сақтау</label>
              </form>
            </div>
          </div>
  
          <div className="col-md-5">
            <div className="right border">
              <div className="header">Тапсырыс шолуы</div>
              <p>2 өнім</p>
  
              <div className="row item">
                <div className="col-4 align-self-center">
                  <img className="img-fluid" src="https://i.imgur.com/79M6pU0.png" alt="Item 1" />
                </div>
                <div className="col-8">
                  <div className="row"><b>$26.99</b></div>
                  <div className="row text-muted">Be Legandary Ерін далабы - Nude rose</div>
                  <div className="row">Саны: 1</div>
                </div>
              </div>
  
              <div className="row item">
                <div className="col-4 align-self-center">
                  <img className="img-fluid" src="https://i.imgur.com/Ew8NzKr.jpg" alt="Item 2" />
                </div>
                <div className="col-8">
                  <div className="row"><b>$19.99</b></div>
                  <div className="row text-muted">Be Legandary Ерін далабы - Sheer Navy Cream</div>
                  <div className="row">Саны: 1</div>
                </div>
              </div>
  
              <hr />
              <div className="row lower">
                <div className="col text-left">Аралық жиынтық</div>
                <div className="col text-right">$46.98</div>
              </div>
              <div className="row lower  mt-3">
                  <button className="btn btn-primary btn-block">Place order</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  
  );
}

export default Payment;
