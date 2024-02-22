import path from 'path';
import { siteUrl, __maindirname } from '../utils/utils.js'

export const attachmentPath = path.join(__maindirname, 'public', 'assets', 'image', 'banner.png');


// ARREGLAR LO DE SITEURL
export function generatePurchaseConfirmationHTML({ userName, purchaseNumber }) {
  return `
    <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" bgcolor="#ffffff" style="padding: 20px;">
          <table align="center" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width: 100%;">
            <tr>
              <td align="center" style="font-family: Arial, sans-serif; font-size: 24px; mso-height-rule: exactly; line-height: 28px; color: #555555;">
                ¡Hola ${userName}, tu compra ha sido realizada!
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 10px; font-family: Arial, sans-serif; font-size: 16px; mso-height-rule: exactly; line-height: 20px; color: #555555;">
                Tu número de compra es: <b>${purchaseNumber}</b>
              </td>
            </tr>
            <tr>
            <td align="center" style="padding: 10px; font-family: Arial, sans-serif; font-size: 16px; mso-height-rule: exactly; line-height: 20px; color: #555555;">
              Muchas gracias por confiar en nosotros.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px;">
              <a href="${siteUrl}" target="_blank">
                <img src="cid:banner" alt="Clicknshop!" width="100%" style="height: auto;"/>
              </a>
            </td>
          </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}



export function recoveryPassHTML({ userName, resetURL, siteUrl }) {
  return `
    <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" bgcolor="#ffffff" style="padding: 20px;">
          <table align="center" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width: 100%;">
            <tr>
              <td align="center" style="font-family: Arial, sans-serif; font-size: 24px; mso-height-rule: exactly; line-height: 28px; color: #555555;">
                Hola ${userName}, ¿te has olvidado de la contraseña?
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 10px; font-family: Arial, sans-serif; font-size: 16px; mso-height-rule: exactly; line-height: 20px; color: #555555;">
              Tu enlace para restablecer la contraseña
              </td>
            </tr>
            <tr>
            <td align="center" style="padding: 10px; font-family: Arial, sans-serif; font-size: 16px; mso-height-rule: exactly; line-height: 20px; color: #555555;">
            Para restablecer tu contraseña, por favor haz clic en el siguiente enlace: <a href="${resetURL}">Restablecer Contraseña</a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px;">
              <a href="${siteUrl}" target="_blank">
                <img src="cid:banner" alt="Clicknshop!" width="100%" style="height: auto;"/>
              </a>
            </td>
          </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}