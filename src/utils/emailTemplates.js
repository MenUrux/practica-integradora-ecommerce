import path from 'path';
import { siteUrl, __maindirname, ecommerceName } from '../utils/utils.js'

export const attachmentPath = path.join(__maindirname, 'public', 'assets', 'image', 'banner.png');


// ARREGLAR LO DE SITEURL
export function generatePurchaseConfirmationHTML({ userName, purchaseNumber, products, total }) {
  const productsListHTML = products.map(p => `
      <tr>
          <td>${p.quantity}x ${p.name}</td>
          <td>$${p.price.toFixed(2)}</td>
          <td>$${(p.quantity * p.price).toFixed(2)}</td>
      </tr>
  `).join('');

  return `
  <h1>¡Hola ${userName}, tu compra ha sido realizada!</h1>
  <p>Tu número de compra es: <strong>${purchaseNumber}</strong></p>
  <table>
      <tr>
          <th>Cantidad</th>
          <th>Producto</th>
          <th>Subtotal</th>
      </tr>
      ${productsListHTML}
      <tr>
          <td colspan="2" style="text-align: right;">Total:</td>
          <td><strong>$${total.toFixed(2)}</strong></td>
      </tr>
      <tr> 
      <td>
      </tr>
      </td>
      </table>
      <p>Muchas gracias por confiar en nosotros.</p>
      <a href="${siteUrl}" target="_blank">
      <img src="cid:banner" alt="${ecommerceName}!" width="100%" style="height: auto;"/>
      </a>
  `;
}



function createProductsListHTML(products) {
  return products.map(p => `
      <tr>
          <td>${p.quantity}x ${p.product.name}</td>
          <td>$${p.product.price.toFixed(2)}</td>
          <td>$${(p.quantity * p.product.price).toFixed(2)}</td>
      </tr>
  `).join('');
}

export function generateDetailedPurchaseConfirmationHTML({ userName, purchaseNumber, products, total }) {
  const productsListHTML = createProductsListHTML(products);
  return `
      <h1>¡Hola ${userName}, tu compra ha sido realizada!</h1>
      <p>Tu número de compra es: <strong>${purchaseNumber}</strong></p>
      <ul>
          ${productsListHTML}
      </ul>
      <p>Total de la compra: <strong>$${total}</strong></p>
      <p>Muchas gracias por confiar en nosotros.</p>
  `;
}



export function recoveryPassHTML({ userName, resetURL }) {
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
              Tu enlace para restablecer la contraseña:<br>
              <a style="text-decoration: underline;" href="${resetURL}">${resetURL}</a>
              </td>
            </tr>
          <tr>
            <td align="center" style="padding: 10px;">
              <a href="${siteUrl}" target="_blank">
                <img src="cid:banner" alt="${ecommerceName}!" width="100%" style="height: auto;"/>
              </a>
            </td>
          </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

export function welcomeUser({ userName }) {
  return `
    <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" bgcolor="#ffffff" style="padding: 20px;">
          <table align="center" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width: 100%;">
            <tr>
              <td align="center" style="font-family: Arial, sans-serif; font-size: 24px; mso-height-rule: exactly; line-height: 28px; color: #555555;">
                ¡Hola ${userName}, gracias por registrarte!
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 10px; font-family: Arial, sans-serif; font-size: 16px; mso-height-rule: exactly; line-height: 20px; color: #555555;">
              Nos complace darte la bienvenida a nuestro sitio.<br>
              </td>
            </tr>
          <tr>
            <td align="center" style="padding: 10px;">
              <a href="${siteUrl}" target="_blank">
              <img src="cid:banner" alt="${ecommerceName}!" width="100%" style="height: auto;"/>
              </a>
            </td>
          </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}