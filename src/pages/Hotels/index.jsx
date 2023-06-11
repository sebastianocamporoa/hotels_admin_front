import React, { useState, useEffect } from "react";
import "../styles.css";
import axios from "axios";
import Swal from "sweetalert2";
import CloseIcon from "../../assets/icons/close.svg";

function Hotels() {
  const [allHotels, setAllHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [roomType, setRoomType] = useState([]);
  const [accommodation, setAccommodation] = useState([]);
  const [newHotelData, setNewHotelData] = useState({
    name: "",
    address: "",
    city: "",
    nit: "",
    rooms: [],
  });
  const [additionalFields, setAdditionalFields] = useState([]);

  async function getHotels() {
    const response = await axios.get(
      "https://hotelsadmin-production.up.railway.app/api/hotels"
    );
    setAllHotels(response.data.data);
  }

  async function getRoomTypes() {
    const response = await axios.get(
      "https://hotelsadmin-production.up.railway.app/api/room-types"
    );
    setRoomType(response.data.data);
  }

  async function getAccommodations() {
    const response = await axios.get(
      "https://hotelsadmin-production.up.railway.app/api/accommodations"
    );
    setAccommodation(response.data.data);
  }

  async function deleteHotel(id) {
    try {
      const response = await axios.delete(
        `https://hotelsadmin-production.up.railway.app/api/hotels/${id}`
      );
      console.log(response.status);
      if (response.status === 200) {
        Swal.fire("Hotel eliminado correctamente", "", "success");
      }
      getHotels();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurrió un error al eliminar el hotel",
      });
    }
  }

  useEffect(() => {
    getHotels();
    getRoomTypes();
    getAccommodations();
    setAdditionalFields([{ roomType: "", accommodation: "", numRooms: "" }]);
  }, []);

  const __handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value.length > 0) {
      let search_results = allHotels.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.address.toLowerCase().includes(search.toLowerCase()) ||
          item.city.toLowerCase().includes(search.toLowerCase()) ||
          item.nit.toLowerCase().includes(search.toLowerCase())
      );
      setAllHotels(search_results);
    } else {
      getHotels();
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewHotelData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addAdditionalField = () => {
    setAdditionalFields([
      ...additionalFields,
      { roomType: "", accommodation: "", numRooms: "" },
    ]);
  };

  const removeAdditionalField = (index) => {
    const updatedFields = additionalFields.filter((_, i) => i !== index);
    setAdditionalFields(updatedFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://hotelsadmin-production.up.railway.app/api/hotels/create",
        {
          name: newHotelData.name,
          address: newHotelData.address,
          city: newHotelData.city,
          nit: newHotelData.nit,
          rooms: additionalFields,
        }
      );

      console.log(response.data);

      if (response.status === 201) {
        Swal.fire("Hotel creado correctamente", "", "success");
        getHotels();
        closeModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrió un error al crear el hotel",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurrió un error al crear el hotel",
      });
    }
  };

  const handleRoomTypeChange = (event, index) => {
    const value = event.target.value;
    const updatedFields = [...additionalFields];
    updatedFields[index] = {
      ...updatedFields[index],
      roomType: value,
    };
    setAdditionalFields(updatedFields);
  };

  const handleAccommodationChange = (event, index) => {
    const value = event.target.value;
    const updatedFields = [...additionalFields];
    updatedFields[index] = {
      ...updatedFields[index],
      accommodation: value,
    };
    setAdditionalFields(updatedFields);
  };

  const handleNumRoomsChange = (event, index) => {
    const { value } = event.target;
    const updatedFields = [...additionalFields];
    updatedFields[index] = {
      ...updatedFields[index],
      numRooms: value,
    };
    setAdditionalFields(updatedFields);
  };

  return (
    <div className="dashboard-content">
      <div className="dashbord-header-container">
        <button className="dashbord-header-btn" onClick={openModal}>
          Nuevo hotel
        </button>
      </div>

      <div className="dashboard-content-container">
        <div className="dashboard-content-header">
          <h2>Hoteles</h2>
          <div className="dashboard-content-search">
            <input
              type="text"
              value={search}
              placeholder="Buscar..."
              className="dashboard-content-input"
              onChange={(e) => __handleSearch(e)}
            />
          </div>
        </div>

        <table>
          <thead>
            <th>ID</th>
            <th>NOMBRE</th>
            <th>CIUDAD</th>
            <th>DIRECCIÓN</th>
            <th>NIT</th>
            {/* <th></th> */}
            <th></th>
          </thead>

          {allHotels.length !== 0 ? (
            <tbody>
              {allHotels.map((hotel, index) => (
                <tr key={index}>
                  <td>
                    <span>{hotel.id}</span>
                  </td>
                  <td>
                    <span>{hotel.name}</span>
                  </td>
                  <td>
                    <span>{hotel.city}</span>
                  </td>
                  <td>
                    <span>{hotel.address}</span>
                  </td>
                  <td>
                    <span>{hotel.nit}</span>
                  </td>
                  {/* <td>
                    <button className="dashbord-header-btn">Editar</button>
                  </td> */}
                  <td>
                    <button
                      className="dashbord-btn-warning"
                      onClick={() => deleteHotel(hotel.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>

        {allHotels.length !== 0 ? (
          <></>
        ) : (
          <div className="dashboard-content-footer">
            <span className="empty-table">No hay hoteles registrados</span>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={closeModal}>
              <img src={CloseIcon} alt="Close" className="close-icon" />
            </button>
            <h2>Nuevo hotel</h2>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="column">
                  <label htmlFor="name">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="dashboard-form-input"
                    value={newHotelData.name}
                    onChange={handleChange}
                  />

                  <label htmlFor="city">Ciudad</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="dashboard-form-input"
                    value={newHotelData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="column">
                  <label htmlFor="address">Dirección</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="dashboard-form-input"
                    value={newHotelData.address}
                    onChange={handleChange}
                  />

                  <label htmlFor="nit">NIT</label>
                  <input
                    type="text"
                    id="nit"
                    name="nit"
                    className="dashboard-form-input"
                    value={newHotelData.nit}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <h3>Habitaciones del hotel</h3>
              {additionalFields.map((field, index) => (
                <div key={index}>
                  <div className="row">
                    <div className="column">
                      <label htmlFor={`room-type-${index}`}>
                        Tipo de habitación
                      </label>
                      <select
                        id={`room-type-${index}`}
                        name={`room-type-${index}`}
                        className="dashboard-form-input"
                        onChange={(event) => handleRoomTypeChange(event, index)}
                      >
                        <option value="">Seleccione</option>
                        {roomType.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>

                      <label htmlFor={`accommodation-${index}`}>
                        Tipo de acomodación
                      </label>
                      <select
                        id={`accommodation-${index}`}
                        name={`accommodation-${index}`}
                        className="dashboard-form-input"
                        onChange={(event) =>
                          handleAccommodationChange(event, index)
                        }
                      >
                        <option value="">Seleccione</option>
                        {accommodation.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="column">
                      <label htmlFor={`num-rooms-${index}`}>
                        Número de habitaciones
                      </label>
                      <input
                        type="number"
                        id={`num-rooms-${index}`}
                        name={`num-rooms-${index}`}
                        className="dashboard-form-input"
                        min="0"
                        onChange={(event) => handleNumRoomsChange(event, index)}
                      />

                      <button
                        type="button"
                        className="modal-content-button-error"
                        onClick={() => removeAdditionalField(index)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="modal-btns">
                <button
                  type="button"
                  className="add-room modal-content-button"
                  onClick={addAdditionalField}
                >
                  Agregar habitación adicional
                </button>

                <button className="modal-content-button" type="submit">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hotels;
