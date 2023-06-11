import React, { useState, useEffect } from "react";
import "../styles.css";
import axios from "axios";
import Swal from "sweetalert2";

function RoomTypes() {
  const [allRoomTypes, setAllRoomTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");

  async function getRoomTypes() {
    try {
      const response = await axios.get(
        "https://hotelsadmin-production.up.railway.app/api/room-types"
      );
      setAllRoomTypes(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteRoomType(id) {
    try {
      const response = await axios.delete(
        `https://hotelsadmin-production.up.railway.app/api/room-types/${id}`
      );
      if (response.status === 200) {
        Swal.fire("Tipo de habitación eliminada correctamente", "", "success");
      }
      getRoomTypes();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurrió un error al eliminar el tipo de habitación",
      });
    }
  }

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  useEffect(() => {
    getRoomTypes();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value.length > 0) {
      let search_results = allRoomTypes.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setAllRoomTypes(search_results);
    } else {
      getRoomTypes();
    }
  };

  return (
    <div className="dashboard-content">
      <div className="dashbord-header-container">
        <button className="dashbord-header-btn" onClick={toggleModal}>
          Nuevo tipo de habitación
        </button>
      </div>
      <div className="dashboard-content-container">
        <div className="dashboard-content-header">
          <h2>Tipos de habitación</h2>
          <div className="dashboard-content-search">
            <input
              type="text"
              value={search}
              placeholder="Buscar..."
              className="dashboard-content-input"
              onChange={handleSearch}
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              {/* <th></th> */}
              <th></th>
            </tr>
          </thead>
          {allRoomTypes.length !== 0 ? (
            <tbody>
              {allRoomTypes.map((roomType, index) => (
                <tr key={index}>
                  <td>
                    <span>{roomType.id}</span>
                  </td>
                  <td>
                    <span>{roomType.name}</span>
                  </td>
                  {/* <td>
                    <button className="dashbord-header-btn">Editar</button>
                  </td> */}
                  <td>
                    <button
                      className="dashbord-btn-warning"
                      onClick={() => deleteRoomType(roomType.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>

        {allRoomTypes.length === 0 && (
          <div className="dashboard-content-footer">
            <span className="empty-table">No hay hoteles registrados</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h1>Hello Modal</h1>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleUsernameChange}
              />
            </form>
            <button onClick={toggleModal}>Cerrar Modal</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomTypes;
