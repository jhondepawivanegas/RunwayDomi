import cron from 'node-cron';
import { conexion } from "./Database/Conexion.js";

// Programa la tarea para ejecutarse diariamente a medianoche
cron.schedule('0 0 * * *', async () => {
    try {
        const ahora = new Date();
        const haceUnDia = new Date(ahora);
        haceUnDia.setDate(ahora.getDate() - 1);

        // Desactiva domiciliarios que no han depositado en más de 24 horas o nunca han depositado
        const sql = `
            UPDATE domiciliarios
            SET activo = FALSE
            WHERE (ultimo_deposito < ? OR ultimo_deposito IS NULL) AND activo = TRUE
        `;
        await conexion.query(sql, [haceUnDia]);
        console.log('Cron job ejecutado: domiciliarios desactivados según necesidad');
    } catch (error) {
        console.error('Error en el cron job:', error);
    }
});
