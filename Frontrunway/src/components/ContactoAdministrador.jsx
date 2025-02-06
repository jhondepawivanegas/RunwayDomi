import React from 'react';

const ContactoAdministrador = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(/fon.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-10/12 max-w-md bg-black bg-opacity-50 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white mb-4">
          Contáctate con el soporte por olvido de contraseña
        </h1>
        <p className="text-green-400 text-center font-bold mb-2">
          u67hdh+22n831o10yxy8@sharklasers.com
        </p>
        <p className="text-gray-300 text-center mb-4">
          Si has olvidado tu contraseña, por favor, comunícate con el administrador a través de este
          enlace de correo electrónico.
        </p>
        <p className="text-gray-300 text-center mb-6">
          Antes de enviar el correo, asegúrate de incluir tu nombre de usuario y una breve descripción
          del problema para que podamos ayudarte de manera más eficiente.
        </p>
        <div className="flex justify-center">
          <a
            href="mailto:soporte@dominio.com?subject=Olvido de contraseña&body=Nombre de usuario: %0D%0ADescripción del problema: "
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-all"
          >
            Enviar correo electrónico
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactoAdministrador;
