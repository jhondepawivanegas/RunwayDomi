import React, { useState, useEffect } from "react";
import UseCrud from "../../hook/UseCrud";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "../../AuthContext";
import { API_URL } from "../config";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; // Importa los estilos de Toastify

// Íconos
import {
  FaHashtag,
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaInfoCircle,
  FaTimes,
  FaFilePdf,
  FaFileExcel,
} from "react-icons/fa";

// Librerías para PDF y Excel
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Solicitudes = () => {
  const BASEURL = `${API_URL}/solicitudes/getSolicitudes`;
  const BASEURL2 = `${API_URL}/solicitudes/getSolicitud`;
  const BASEURL3 = `${API_URL}/solicitudes/patchSolicitud`;
  const BASEURL4 = `${API_URL}/domiciliarios/getDomiciliarios`;
  const BASEURL5 = `${API_URL}/solicitudes/patchEstadoSolicitud`;
  const BASEURL6 = `${API_URL}/solicitudes/getSolicitudesByUsuario`;
  const BASEURL7 = `${API_URL}/solicitudes/patchCancelarSolicitud`;
  const BASEURL8 = `${API_URL}/solicitudes/getSolicitudesByDomiciliario`;

  const { auth } = useAuth();
  const [tipoUsuario] = useState(auth.user?.tipo_usuario);

  const { getApi, response, error, loading } = UseCrud(BASEURL);
  const {
    getApiById,
    responseById,
    error: error2,
    loading: loading2,
  } = UseCrud(BASEURL2);

  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [domiciliariosDisponibles, setDomiciliariosDisponibles] = useState([]);

  const { getApi: getDomiciliarios, response: responseDomiciliarios } =
    UseCrud(BASEURL4);

  const {
    updateApi,
    error: errorUpdate,
    loading: loadingUpdate,
  } = UseCrud(BASEURL3);

  const { updateApi: updateEstado } = UseCrud(BASEURL5);
  const { updateApi: cancelarSolicitud } = UseCrud(BASEURL7);

  const {
    getApiById: getSolicitudesUsuario,
    responseById: responseSolicitudesUsuario,
  } = UseCrud(BASEURL6);

  const navigate = useNavigate(); // Botón "Volver"

  // ====================== Cargar Solicitudes según Usuario ======================
  useEffect(() => {
    if (["particular", "negocio"].includes(tipoUsuario)) {
      if (auth.user?.id_usuario) {
        getSolicitudesUsuario(`/${auth.user.id_usuario}`);
      }
    } else if (tipoUsuario === "domiciliario") {
      if (auth.user?.id_usuario) {
        getSolicitudesUsuario(`${BASEURL8}/${auth.user.id_usuario}`);
      }
    } else {
      getApi();
    }
  }, [auth.user]);

  // Cargar domiciliarios cuando se abre el modal de edición
  useEffect(() => {
    if (isEditModalOpen) {
      getDomiciliarios();
    }
  }, [isEditModalOpen]);

  // Actualiza domiciliarios
  useEffect(() => {
    if (responseDomiciliarios) {
      setDomiciliariosDisponibles(responseDomiciliarios);
    }
  }, [responseDomiciliarios]);

  // ====================== Funciones de Exportación ======================

  // Convierte una URL de imagen a base64 (para addImage en PDF)
  const getBase64FromUrl = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  // Exportar PDF con logo, nombre y descripción
  const handleDownloadPDF = async () => {
    // Revisar que 'response' no esté vacío
    if (!response || !Array.isArray(response) || response.length === 0) {
      Toastify({
        text: "No hay datos para exportar a PDF",
        duration: 3000,
        backgroundColor: "red",
      }).showToast();
      return;
    }

    const doc = new jsPDF({ orientation: "p", unit: "pt", format: "letter" });
    let yPos = 50;

    // (1) Agregamos Logo
    try {
      const logoUrl = "/logo.png"; // Ruta ajustable
      const imgData = await getBase64FromUrl(logoUrl);
      doc.addImage(imgData, "PNG", 40, 20, 50, 30); // Ajusta posición/tamaño
    } catch (err) {
      console.log("No se pudo cargar el logo:", err);
    }

    // (2) Agregamos Título
    doc.setFontSize(14);
    doc.text("MiNegocio - Reporte de Solicitudes", 40, yPos + 40);

    // (3) Agregamos Descripción
    doc.setFontSize(10);
    doc.text(
      "Descripción: Este PDF contiene la lista de solicitudes generadas.\nGracias por confiar en nuestros servicios.",
      40,
      yPos + 55
    );

    // (4) Construimos la tabla con 'autoTable'
    const head = [["ID", "Recogida", "Entrega", "Estado"]];
    const body = response.map((sol) => [
      sol.id_solicitud,
      sol.direccion_recogida,
      sol.direccion_entrega,
      sol.estado,
    ]);

    doc.autoTable({
      startY: yPos + 80,
      head,
      body,
      styles: { fontSize: 10, halign: "center" },
      headStyles: { fillColor: [63, 81, 181], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 40, right: 40 },
    });

    doc.save("Solicitudes.pdf");
  };

  // Exportar Excel con "texto" de logo y descripción
  const handleDownloadExcel = () => {
    if (!response || !Array.isArray(response) || response.length === 0) {
      Toastify({
        text: "No hay datos para exportar a Excel",
        duration: 3000,
        backgroundColor: "red",
      }).showToast();
      return;
    }

    // Filas de encabezado y descripción
    const data = [
      ["MiNegocio - Exportado", "", "", ""],
      [
        "Descripción:",
        "Este archivo contiene la lista de solicitudes generadas.\nGracias por confiar en nosotros.",
      ],
      [],
      ["ID", "Recogida", "Entrega", "Estado"],
      ...response.map((sol) => [
        sol.id_solicitud,
        sol.direccion_recogida,
        sol.direccion_entrega,
        sol.estado,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitudes");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Solicitudes.xlsx");
  };

  // ====================================================================

  // Abre modal de detalles
  const handleDetailsClick = (solicitud) => {
    setSelectedSolicitud(solicitud);
  };

  // Cierra modal de detalles
  const closeDetails = () => {
    setSelectedSolicitud(null);
  };

  // Maneja la búsqueda
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (searchId) {
        const result = await getApiById(`/${searchId}`);
        if (!result) {
          Toastify({
            text: "No se encontró la solicitud",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
          }).showToast();
        }
      } else {
        await getApi();
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      if (error.response?.status !== 401) {
        Toastify({
          text: "Error al realizar la búsqueda",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
      }
    }
  };

  // Abre modal de edición
  const handleEditClick = (solicitud) => {
    setEditFormData({
      id_solicitud: solicitud.id_solicitud,
      id_cliente: solicitud.id_cliente,
      cliente_nombre: solicitud.cliente_nombre,
      id_domiciliario: solicitud.id_domiciliario,
      direccion_recogida: solicitud.direccion_recogida,
      direccion_entrega: solicitud.direccion_entrega,
      fecha_hora: solicitud.fecha_hora,
      estado: solicitud.estado,
    });
    setIsEditModalOpen(true);
  };

  // Enviar edición
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      let resp;
      if (editFormData.estado === "completado") {
        resp = await updateEstado(
          { estado: editFormData.estado },
          `/${editFormData.id_solicitud}`
        );
      } else {
        const dataToUpdate = {
          direccion_recogida: editFormData.direccion_recogida,
          direccion_entrega: editFormData.direccion_entrega,
          estado: editFormData.estado,
          id_domiciliario: editFormData.id_domiciliario,
        };
        resp = await updateApi(dataToUpdate, `/${editFormData.id_solicitud}`);
      }

      if (resp) {
        setIsEditModalOpen(false);
        if (searchId) {
          await getApiById(`/${searchId}`);
        } else {
          await getApi();
        }
        Toastify({
          text: "Detalles del pedido actualizados exitosamente",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "green",
        }).showToast();
      } else {
        Toastify({
          text: "No se pudo realizar el cambio",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      Toastify({
        text: "Error al realizar el cambio",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    }
  };

  // Cancelar solicitud
  const handleCancelarSolicitud = async (id_solicitud) => {
    try {
      if (window.confirm("¿Está seguro que desea cancelar esta solicitud?")) {
        const response = await cancelarSolicitud(
          { estado: "cancelado" },
          `/${id_solicitud}`
        );
        if (response) {
          if (auth.user?.id_usuario) {
            await getSolicitudesUsuario(`/${auth.user.id_usuario}`);
          }
          Toastify({
            text: "Solicitud cancelada exitosamente",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "green",
          }).showToast();
        }
      }
    } catch (error) {
      console.error("Error detallado al cancelar la solicitud:", error);
      Toastify({
        text: "Error al cancelar la solicitud",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url(/fon.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header title="Pedidos" />
      <div className="lg:ml-64 pt-16 flex-grow">
        <div className="p-4 sm:p-6 lg:p-8 bg-black bg-opacity-70 rounded-lg m-4">
          {/* Barra de Búsqueda y Botones */}
          <div className="mb-6 flex flex-col sm:flex-row gap-2">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-2 flex-grow"
            >
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Buscar por ID..."
                className="px-4 py-2 bg-transparent border border-gray-300 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 flex-grow"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors duration-200"
                disabled={loading2}
              >
                {loading2 ? "Buscando..." : "Buscar"}
              </button>
            </form>

            <div className="flex flex-wrap gap-2 ">
              
              

              {/* Botones PDF/Excel con íconos */}
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                <FaFilePdf />
                Exportar PDF
              </button>
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                <FaFileExcel />
                Exportar Excel
              </button>

              {/* Botón "Solicitar Domiciliario" para ciertos usuarios */}
              {["administrador", "particular"].includes(tipoUsuario) && (
                <Link
                  to="/solicitud"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Solicitar Domiciliario
                </Link>
              )}
            </div>
          </div>

          {/* Tabla de Solicitudes */}
          <div className="bg-transparent rounded-lg overflow-hidden border border-gray-300">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-white">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
                      Dir. Recogida
                    </th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                      Dir. Entrega
                    </th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
                      Detalles
                    </th>
                    <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {/* MAPEO COMPLETO DE SOLICITUDES */}
                  {searchId && responseById
                    ? Array.isArray(responseById)
                      ? responseById.map((solicitud, index) => (
                          <tr
                            key={solicitud.id_solicitud || index}
                            className="border-b hover:bg-gray-700"
                          >
                            <td className="px-4 py-2 text-center">
                              {solicitud.id_solicitud}
                            </td>
                            <td className="px-4 py-2">
                              {solicitud.direccion_recogida}
                            </td>
                            <td className="px-4 py-2">
                              {solicitud.direccion_entrega}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {new Date(solicitud.fecha_hora).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                                  solicitud.estado === "completado"
                                    ? "bg-green-600 text-white"
                                    : solicitud.estado === "en curso"
                                    ? "bg-yellow-600 text-white"
                                    : solicitud.estado === "cancelado"
                                    ? "bg-red-600 text-white"
                                    : "bg-blue-600 text-white"
                                }`}
                              >
                                {solicitud.estado}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded text-xs"
                                onClick={() => handleDetailsClick(solicitud)}
                              >
                                Ver detalles
                              </button>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <div className="flex gap-2 justify-center">
                                {!["particular", "negocio"].includes(tipoUsuario) && (
                                  <button
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-1 px-2 rounded text-xs"
                                    onClick={() => handleEditClick(solicitud)}
                                  >
                                    Editar
                                  </button>
                                )}
                                {["particular", "negocio"].includes(tipoUsuario) && (
                                  <button
                                    className={`
                                      bg-red-600 hover:bg-red-700 
                                      text-white font-medium py-1 px-2 
                                      rounded text-xs
                                      ${
                                        solicitud.estado === "cancelado" ||
                                        solicitud.estado === "completado"
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }
                                    `}
                                    onClick={() =>
                                      handleCancelarSolicitud(solicitud.id_solicitud)
                                    }
                                    disabled={
                                      solicitud.estado === "cancelado" ||
                                      solicitud.estado === "completado"
                                    }
                                  >
                                    Cancelar
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      : [responseById].map((solicitud, index) => (
                          <tr
                            key={solicitud.id_solicitud || index}
                            className="border-b hover:bg-gray-700"
                          >
                            <td className="px-4 py-2 text-center">
                              {solicitud.id_solicitud}
                            </td>
                            <td className="px-4 py-2">
                              {solicitud.direccion_recogida}
                            </td>
                            <td className="px-4 py-2">
                              {solicitud.direccion_entrega}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {new Date(solicitud.fecha_hora).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                                  solicitud.estado === "completado"
                                    ? "bg-green-600 text-white"
                                    : solicitud.estado === "en curso"
                                    ? "bg-yellow-600 text-white"
                                    : solicitud.estado === "cancelado"
                                    ? "bg-red-600 text-white"
                                    : "bg-blue-600 text-white"
                                }`}
                              >
                                {solicitud.estado}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded text-xs"
                                onClick={() => handleDetailsClick(solicitud)}
                              >
                                Ver detalles
                              </button>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <div className="flex gap-2 justify-center">
                                {!["particular", "negocio"].includes(tipoUsuario) && (
                                  <button
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-1 px-2 rounded text-xs"
                                    onClick={() => handleEditClick(solicitud)}
                                  >
                                    Editar
                                  </button>
                                )}
                                {["particular", "negocio"].includes(tipoUsuario) && (
                                  <button
                                    className={`
                                      bg-red-600 hover:bg-red-700 
                                      text-white font-medium py-1 px-2 
                                      rounded text-xs
                                      ${
                                        solicitud.estado === "cancelado" ||
                                        solicitud.estado === "completado"
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }
                                    `}
                                    onClick={() =>
                                      handleCancelarSolicitud(solicitud.id_solicitud)
                                    }
                                    disabled={
                                      solicitud.estado === "cancelado" ||
                                      solicitud.estado === "completado"
                                    }
                                  >
                                    Cancelar
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                    : (["particular", "negocio"].includes(tipoUsuario)
                        ? responseSolicitudesUsuario
                        : response
                      )?.map((solicitud, index) => (
                        <tr
                          key={solicitud.id_solicitud || index}
                          className="border-b hover:bg-gray-700"
                        >
                          <td className="px-4 py-2 text-center">
                            {solicitud.id_solicitud}
                          </td>
                          <td className="px-4 py-2">
                            {solicitud.direccion_recogida}
                          </td>
                          <td className="px-4 py-2">
                            {solicitud.direccion_entrega}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {new Date(solicitud.fecha_hora).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                                solicitud.estado === "completado"
                                  ? "bg-green-600 text-white"
                                  : solicitud.estado === "en curso"
                                  ? "bg-yellow-600 text-white"
                                  : solicitud.estado === "cancelado"
                                  ? "bg-red-600 text-white"
                                  : "bg-blue-600 text-white"
                              }`}
                            >
                              {solicitud.estado}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded text-xs"
                              onClick={() => handleDetailsClick(solicitud)}
                            >
                              Ver detalles
                            </button>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex gap-2 justify-center">
                              {!["particular", "negocio"].includes(tipoUsuario) && (
                                <button
                                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-1 px-2 rounded text-xs"
                                  onClick={() => handleEditClick(solicitud)}
                                >
                                  Editar
                                </button>
                              )}
                              {["particular", "negocio"].includes(tipoUsuario) && (
                                <button
                                  className={`
                                    bg-red-600 hover:bg-red-700 
                                    text-white font-medium py-1 px-2 
                                    rounded text-xs
                                    ${
                                      solicitud.estado === "cancelado" ||
                                      solicitud.estado === "completado"
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }
                                  `}
                                  onClick={() =>
                                    handleCancelarSolicitud(solicitud.id_solicitud)
                                  }
                                  disabled={
                                    solicitud.estado === "cancelado" ||
                                    solicitud.estado === "completado"
                                  }
                                >
                                  Cancelar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE DETALLES */}
      {selectedSolicitud && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={closeDetails}
        >
          <div
            className="relative bg-gradient-to-br from-white via-gray-100 to-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado */}
            <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-5">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaInfoCircle className="text-green-600" />
                Detalles de la Solicitud
              </h2>
              <button
                onClick={closeDetails}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-xl font-semibold"
              >
                <FaTimes />
              </button>
            </div>

            {/* Contenido en formato grid con íconos (similar a tu código) */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
              {/* ID Solicitud */}
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <FaHashtag className="text-blue-600" />
                <span>ID Solicitud:</span>
              </div>
              <div>{selectedSolicitud.id_solicitud}</div>

              {/* Cliente (si corresponde) */}
              {!["particular", "negocio"].includes(tipoUsuario) && (
                <>
                  <div className="flex items-center gap-2 font-semibold text-gray-800">
                    <FaUser className="text-blue-500" />
                    <span>Cliente:</span>
                  </div>
                  <div>{selectedSolicitud.cliente_nombre}</div>
                </>
              )}

              {/* Direcciones */}
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <FaMapMarkerAlt className="text-red-500" />
                <span>Dir. Recogida:</span>
              </div>
              <div>{selectedSolicitud.direccion_recogida}</div>
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <FaMapMarkerAlt className="text-green-500" />
                <span>Dir. Entrega:</span>
              </div>
              <div>{selectedSolicitud.direccion_entrega}</div>

              {/* Descripción (si existe) */}
              {selectedSolicitud.descripcion && (
                <>
                  <div className="flex items-center gap-2 font-semibold text-gray-800">
                    <FaInfoCircle className="text-purple-500" />
                    <span>Descripción:</span>
                  </div>
                  <div>{selectedSolicitud.descripcion}</div>
                </>
              )}

              {/* Fecha y Hora */}
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <FaClock className="text-yellow-500" />
                <span>Fecha y Hora:</span>
              </div>
              <div>
                {selectedSolicitud.fecha_hora
                  ? new Date(selectedSolicitud.fecha_hora).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : "N/A"}
              </div>

              {/* Estado */}
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <FaInfoCircle className="text-indigo-500" />
                <span>Estado:</span>
              </div>
              <div>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                    selectedSolicitud.estado === "completado"
                      ? "bg-green-600 text-white"
                      : selectedSolicitud.estado === "en curso"
                      ? "bg-yellow-600 text-white"
                      : selectedSolicitud.estado === "cancelado"
                      ? "bg-red-600 text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {selectedSolicitud.estado}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL para Editar Solicitud */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Editar Solicitud</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-medium"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  ID Solicitud
                </label>
                <input
                  type="text"
                  value={editFormData?.id_solicitud || ""}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Nombre Cliente
                </label>
                <input
                  type="text"
                  value={editFormData?.id_cliente || ""}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Fecha y Hora
                </label>
                <input
                  type="text"
                  value={
                    editFormData?.fecha_hora
                      ? new Date(editFormData.fecha_hora).toLocaleString("es-ES", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : ""
                  }
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Dirección de Recogida
                </label>
                <input
                  type="text"
                  value={editFormData?.direccion_recogida || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      direccion_recogida: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Dirección de Entrega
                </label>
                <input
                  type="text"
                  value={editFormData?.direccion_entrega || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      direccion_entrega: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Estado
                </label>
                <select
                  value={editFormData?.estado || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      estado: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="en curso">En curso</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="para reasignar">Para reasignar</option>
                  <option value="asignado">Asignado</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Domiciliario
                </label>
                <select
                  value={editFormData?.id_domiciliario || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      id_domiciliario: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value={editFormData?.id_domiciliario}>
                    {editFormData?.domiciliario_nombre || "Seleccionar domiciliario"}
                  </option>
                  {Array.isArray(domiciliariosDisponibles) &&
                    domiciliariosDisponibles.map((domiciliario) => (
                      <option
                        key={domiciliario.id_domiciliario}
                        value={domiciliario.id_domiciliario}
                      >
                        {domiciliario.nombre}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solicitudes;
