-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 07-02-2025 a las 14:27:57
-- Versión del servidor: 8.0.30
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `runwaydomicilios`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `domiciliarios`
--

CREATE TABLE `domiciliarios` (
  `id_domiciliario` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `licencia_vehiculo` varchar(50) DEFAULT NULL,
  `disponibilidad` enum('disponible','no disponible') DEFAULT NULL,
  `dotacion` varchar(255) DEFAULT NULL,
  `soat` varchar(255) DEFAULT NULL,
  `fecha_ingreso` datetime DEFAULT NULL,
  `fecha_salida` datetime DEFAULT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `horario` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `imagen_vehiculo` varchar(255) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `ultimo_deposito` timestamp NULL DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `descuento_ingreso` decimal(5,2) NOT NULL DEFAULT '0.00',
  `descuento_salida` decimal(5,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `domiciliarios`
--

INSERT INTO `domiciliarios` (`id_domiciliario`, `id_usuario`, `licencia_vehiculo`, `disponibilidad`, `dotacion`, `soat`, `fecha_ingreso`, `fecha_salida`, `estado`, `horario`, `fecha`, `imagen_vehiculo`, `nombre`, `foto`, `ultimo_deposito`, `activo`, `descuento_ingreso`, `descuento_salida`) VALUES
(1, 7, 'BXP-64G', 'no disponible', NULL, NULL, NULL, NULL, 'activo', NULL, NULL, NULL, '', NULL, NULL, 1, 0.00, 0.00),
(2, 9, 'jlkm', 'no disponible', NULL, NULL, NULL, NULL, 'activo', NULL, NULL, NULL, '', NULL, NULL, 1, 0.00, 0.00),
(3, 10, 'XYZ-123', 'disponible', NULL, NULL, '2025-02-07 08:00:00', '2025-02-07 20:00:00', 'activo', NULL, NULL, NULL, NULL, NULL, NULL, 1, 0.00, 5.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs_actividad`
--

CREATE TABLE `logs_actividad` (
  `id_log` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `descripcion` text,
  `fecha_hora` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `logs_actividad`
--

INSERT INTO `logs_actividad` (`id_log`, `id_usuario`, `descripcion`, `fecha_hora`) VALUES
(1, 1, 'fesf.jglyedkwjl-dwmnaf', '2024-12-17 16:02:14'),
(2, 1, 'lalalala\n', '2024-12-18 19:29:49'),
(3, 1, 'khofgchjk', '2024-12-26 22:19:55'),
(4, 1, 'kjkhhbnjkm', '2024-12-26 22:23:48'),
(5, 1, 'ijlgjcfhhgvhbjnkl', '2024-12-26 22:30:37'),
(11, 1, 'sdfvfa', '2025-01-15 14:13:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `negocios`
--

CREATE TABLE `negocios` (
  `id_negocio` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `nombre_negocio` varchar(100) DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `negocios`
--

INSERT INTO `negocios` (`id_negocio`, `id_usuario`, `nombre_negocio`, `banner`, `direccion`) VALUES
(1, 10, 'mundo gorras', '1731008331033-gorras.png', 'calle 13a 18-26e'),
(2, 10, 'bartoaa', '1734625600548-469294563_17991003089737079_6402060915407169813_n (1).jpg', 'cra123'),
(3, 10, 'bartoppp', '1734701222918-469294563_17991003089737079_6402060915407169813_n (1).jpg', 'hvhxi'),
(4, 16, 'Mono así es ', '1735251000447-10-19-07_1013.jpg', 'Crajshag'),
(5, 12, 'ranford', '1736010960119-camiseta.png', 'cra123'),
(6, 12, 'mono loco', NULL, 'cra1onlk2|'),
(7, 16, 'qweq', NULL, 'we'),
(8, 12, 'ewrgthgy', NULL, 'rwty'),
(9, 10, 'yo no fui  ss', NULL, 'cras'),
(10, 16, 'aleale', NULL, 'cra234'),
(11, 12, 'barto', NULL, 'wede');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `novedades`
--

CREATE TABLE `novedades` (
  `id_novedad` int NOT NULL,
  `id_domiciliario` int DEFAULT NULL,
  `id_solicitud` int DEFAULT NULL,
  `descripcion` text,
  `estado` enum('pendiente','resuelta') DEFAULT NULL,
  `fecha_reporte` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `novedades`
--

INSERT INTO `novedades` (`id_novedad`, `id_domiciliario`, `id_solicitud`, `descripcion`, `estado`, `fecha_reporte`) VALUES
(1, 2, 2, 'ndccpjklf', 'resuelta', '2024-12-17 09:05:42'),
(2, 1, 1, 'se entrego correctamente\n', 'resuelta', '2025-01-15 11:00:45'),
(3, 1, 4, 'daños en la moto\n', 'resuelta', '2025-01-15 11:23:33'),
(4, 1, 5, 'wdefw', 'resuelta', '2025-01-15 11:24:31'),
(5, 1, 4, 'ngfb', 'pendiente', '2025-01-15 11:51:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes_incidencias`
--

CREATE TABLE `reportes_incidencias` (
  `id_reporte` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_solicitud` int DEFAULT NULL,
  `tipo_incidencia` enum('entrega fallida','producto danado','accidente','otro') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `descripcion` text,
  `estado` enum('pendiente','resuelto') DEFAULT NULL,
  `fecha_reporte` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id_solicitud` int NOT NULL,
  `id_cliente` int DEFAULT NULL,
  `id_domiciliario` int DEFAULT NULL,
  `direccion_recogida` varchar(200) DEFAULT NULL,
  `direccion_entrega` varchar(200) DEFAULT NULL,
  `descripcion` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `estado` enum('para reasignar','asignado','en curso','completado','cancelado') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fecha_hora` datetime DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`id_solicitud`, `id_cliente`, `id_domiciliario`, `direccion_recogida`, `direccion_entrega`, `descripcion`, `estado`, `fecha_hora`, `precio`) VALUES
(1, 1, 2, 'cra1plknlw', 'LJMM', 'KNssc', 'completado', '2024-12-17 13:51:27', NULL),
(2, 1, 2, 'hhhhh', 'KJDNWSDCS', 'KN DKLKS', 'completado', '2024-12-17 13:51:35', NULL),
(3, 1, 2, 'Cra1ccv', 'Madelena ', 'Fallas ', 'completado', '2024-12-18 19:24:40', NULL),
(4, 1, 1, 'ukyjhtgtrr', 'kndlhd', 'sdfgn', 'completado', '2025-01-13 13:37:11', NULL),
(5, 1, 1, 'Portal de rafa', 'cra1322', 'bhjdknshkj', 'completado', '2025-01-13 14:06:35', NULL),
(6, 1, 1, 'ukyjhtgtrr', 'LJMM', 'wedf', 'completado', '2025-01-15 16:11:05', NULL),
(7, 1, 1, 'ukyjhtgtrr', 'kndlhdh', 'llllllll', 'completado', '2025-01-29 14:42:20', NULL),
(8, 1, 1, 'cra1323', '32rwedsd', 'dasf', 'completado', '2025-01-29 19:45:31', NULL),
(9, 1, 2, 'cra1323', 'werr', 'wer', 'completado', '2025-01-29 19:48:53', NULL),
(10, 1, 1, '5', '444+45-', '\n21204+651\n32.0\n614\n156498/+64\n51\n\n\n\n+\n', 'completado', '2025-01-30 16:28:59', NULL),
(11, 1, 1, 'cfiyghj', 'hjb k', 'jn', 'asignado', '2025-01-31 14:26:05', NULL),
(12, 1, 2, 'efvd', 'sadfgdsf', 'sdfgf', 'asignado', '2025-01-31 14:30:39', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `tipo_usuario` enum('administrador','negocio','particular','domiciliario') DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  `cedula` varchar(50) DEFAULT NULL,
  `tipoDocumento` varchar(50) DEFAULT NULL,
  `numeroDocumento` varchar(50) DEFAULT NULL,
  `fotocopia_cedula` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `tipo_usuario`, `email`, `telefono`, `password`, `estado`, `cedula`, `tipoDocumento`, `numeroDocumento`, `fotocopia_cedula`) VALUES
(1, 'Administrador', 'administrador', 'administrador@gmail.com', '1222345', '$2b$10$VZNkNZaDh2FmZeQyDdTcRuWCb8SxpZDNpsQbVEFSXhpTISWRlk5BW', 'inactivo', '425312532', 'pasaporte', '213', NULL),
(7, 'domiciliario1', 'domiciliario', 'domiciliario1@gmail.com', '2424564', '$2b$10$0hrxNvVK9Q.8t33O5Kz0SONXA92rJyZGsCaIZDLczuwKcgB321/aC', 'activo', NULL, 'cedula', '1083903571', NULL),
(9, 'Domiciliario2', 'domiciliario', 'mono@gmail.com', '32121321', '$2b$10$/1Fn4I3t/fV.KaL6CL5v8ecGINNEiuRIyE1Jwo8Ogmqk2DX60nSci', 'activo', NULL, 'cedula_extranjera', '78', NULL),
(10, 'NegocioMono', 'negocio', 'negocio@gmail.com', '47647474', '$2b$10$GPPHJNMgO1A.dD.PJSM60eRJhW0uMVzAOTfy68GVgqYI5c9KQOqOS', 'inactivo', NULL, 'cedula', '10839111', NULL),
(12, 'juan', 'negocio', 'monoaaaaa@gmail.com', '123456789', '$2b$10$JIb8i4aHfsANv/5HYuGb6eLWV8ZJNdXX/sfNKMSXih1KXA73kGiJa', 'inactivo', NULL, NULL, NULL, NULL),
(16, 'ñl', 'negocio', 'mbncvb@gmail.com', '320985852', '$2b$10$Tw/k8XEQVnGuzHZweuNo8OGpS.PduKOuyFBuN1PoMPVSUtFS68tJ2', 'activo', NULL, 'pasaporte', '123', NULL),
(31, 'Jhon Freddy Guevara Vanegas', 'particular', 'e@gmail.com', '32155', '$2b$10$KNxk4rlA01MKKz3kqAemr.2dWVZdRAexCwk8WO9vFilKfUtsAH/k.', 'inactivo', NULL, NULL, NULL, NULL),
(32, 'Jhon Freddy Guevara Vanegas', 'particular', 'vane2@gmail.com', '3205252', '$2b$10$cT6HmIv8W38L41pQ/wpCiOik.KmpP73hxW54d24qn9anE8oANXdZG', 'activo', NULL, 'cedula_extranjera', '44214', NULL),
(33, 'barto', 'particular', 'Benito@gmail.com', '32121321', '$2b$10$JWjPrHynQq8J553LC9bqG.qdkMOQjnsfaXBHO5nFgAsIDXm0dA.tu', 'activo', NULL, 'cedula_extranjera', '108390342', NULL),
(34, 'jose cuellar', 'particular', 'jose@gmail.com', '321565885', '$2b$10$2I7qHCFjj8AKOpXhfOL17.t//UbQqSUHfjxnuw6KaLGNrE5d26M4e', 'activo', NULL, 'cedula', '36274888', NULL),
(35, 'jhon ', 'particular', 'bhbv@gmail.com', '32121321', '$2b$10$I3Zm9vZYecPOsKh1wTKTAOzitlH.1wxYG8wwfzucOiER.Inu4S/My', 'activo', NULL, 'cedula_extranjera', '1083903571', NULL),
(36, 'Jian', 'particular', 'jhonfredyguevaravanegas@gmail.com', '3209577772', '$2b$10$kcpZzJR5w3fOcnO86S0/wOPDOLnMp77eeCEoA0qSxdVZ3GB4jAEUe', 'activo', NULL, 'cedula', '556', NULL),
(37, 'jhon ', 'particular', 'vane@gmail.com', '32055355', '$2b$10$mN8LTxSJnx6yewVMLa9fFOVRIHCShEEz8xamRCewCvUpdG8C59ofK', 'activo', NULL, 'cedula', '1083903571', NULL),
(38, 'juana', 'particular', 'mono@gmail.com', '534', '$2b$10$pMJKxYm2DPgSEHNbemSWHOM0//y6LA7alsT/WNMRDAxKe.6C2ARPy', 'activo', NULL, 'cedula', '10839111', NULL),
(39, 'juana', 'particular', 'mono@gmail.com', '534', '$2b$10$I2MxLp9iLKzPs4eqPfFO2eY1tg.7u5hanODrTed7FxxQglAodK/ha', 'activo', NULL, 'cedula', '10839111', NULL),
(40, 'juana', 'particular', 'juana@gmail.com', '3133777618', '$2b$10$P89tUgvmMPn/0vV7DQHgc.UUCdKlWbfQO5kzKdCxWt3yDi/MeglP6', 'activo', NULL, 'cedula', '10839111', NULL),
(41, 'jhon ', 'particular', 'vane@gmail.com', '32121321', '$2b$10$UQ1NeEIIVjMp72z1Pk5NDOvkQrfhjGwduymQm8nmhJvvZSX4sI59.', 'activo', NULL, 'cedula', '1083903571', NULL),
(42, 'andres', 'particular', 'andres@gmail.com', '3215786', '$2b$10$9mDKNXJEaWUXGuDNSSKf8epcoEn6N1m.TzoGUfp0P6MoBfXQbJ3Gq', 'activo', NULL, 'cedula_extranjera', '10839111', NULL),
(43, 'juan', 'domiciliario', 'juan@gmail.com', '4512321', '$2b$10$CVH7GmnFhGoEbhjxq3TEveXi/jIDYPLemsL5FOLtF4wtkhk48r5LC', 'activo', NULL, 'cedula', '123', NULL),
(44, 'emesias@gmail.com', 'domiciliario', 'eme@gmail.com', '3209577772', '$2b$10$d5eVK9j0cVeCfFnU2zDjkuYsFnBKG1RiDDuFZGtTYqr1ImxmCP82m', 'activo', NULL, 'cedula', '123', NULL),
(45, 'Daniel Dussan', 'particular', 'danie@gmail.com', '32153215', '$2b$10$G244b2KZGxuCmg8/5.eaTeHMfggr4ZTuuDKKBmIo26wSf81DAGppq', 'activo', NULL, 'cedula', '1082641', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `domiciliarios`
--
ALTER TABLE `domiciliarios`
  ADD PRIMARY KEY (`id_domiciliario`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `logs_actividad`
--
ALTER TABLE `logs_actividad`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `negocios`
--
ALTER TABLE `negocios`
  ADD PRIMARY KEY (`id_negocio`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `novedades`
--
ALTER TABLE `novedades`
  ADD PRIMARY KEY (`id_novedad`),
  ADD KEY `id_domiciliario` (`id_domiciliario`),
  ADD KEY `id_solicitud` (`id_solicitud`);

--
-- Indices de la tabla `reportes_incidencias`
--
ALTER TABLE `reportes_incidencias`
  ADD PRIMARY KEY (`id_reporte`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_solicitud` (`id_solicitud`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_domiciliario` (`id_domiciliario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `domiciliarios`
--
ALTER TABLE `domiciliarios`
  MODIFY `id_domiciliario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `logs_actividad`
--
ALTER TABLE `logs_actividad`
  MODIFY `id_log` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `negocios`
--
ALTER TABLE `negocios`
  MODIFY `id_negocio` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `novedades`
--
ALTER TABLE `novedades`
  MODIFY `id_novedad` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `reportes_incidencias`
--
ALTER TABLE `reportes_incidencias`
  MODIFY `id_reporte` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `id_solicitud` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `domiciliarios`
--
ALTER TABLE `domiciliarios`
  ADD CONSTRAINT `domiciliarios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `logs_actividad`
--
ALTER TABLE `logs_actividad`
  ADD CONSTRAINT `logs_actividad_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `negocios`
--
ALTER TABLE `negocios`
  ADD CONSTRAINT `negocios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `novedades`
--
ALTER TABLE `novedades`
  ADD CONSTRAINT `novedades_ibfk_1` FOREIGN KEY (`id_domiciliario`) REFERENCES `domiciliarios` (`id_domiciliario`),
  ADD CONSTRAINT `novedades_ibfk_2` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`);

--
-- Filtros para la tabla `reportes_incidencias`
--
ALTER TABLE `reportes_incidencias`
  ADD CONSTRAINT `reportes_incidencias_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `reportes_incidencias_ibfk_2` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`);

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `solicitudes_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `solicitudes_ibfk_2` FOREIGN KEY (`id_domiciliario`) REFERENCES `domiciliarios` (`id_domiciliario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
