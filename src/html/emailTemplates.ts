const priceIncreaseContent = (
  oldPrice: number,
  newPrice: number,
  percentage: string,
) => `
  <p>The price has increased by <b>${percentage}%</b> in the last hour!</p>
  <ul>
    <li>Old Price: $${oldPrice}</li>
    <li>New Price: $${newPrice}</li>
  </ul>`;

// Function to create the content for a target price alert
const targetPriceContent = (targetPrice: number, currentPrice: number) => `
  <p>The price has reached your target price of <b>$${targetPrice}</b>!</p>
  <ul>
    <li>Current Price: $${currentPrice}</li>
  </ul>`;

// Function to create a general price alert email template
const priceAlertEmailTemplate = (
  chain: string,
  alertType: string,
  content: string,
) => `
  <table width="100%" cellpadding="48" align="center">
    <tr>
      <td>
        <font size="5" weight="bold"><b>Price Alert: ${chain.toUpperCase()}</b></font>
      </td>
    </tr>
    <tr height="20"></tr>
    <tr>
      <td><font color="#777777">${alertType}</font></td>
    </tr>
    <tr>
      <td>${content}</td>
    </tr>
    <tr height="40"></tr>
    <tr>
      <td>Best regards,<br/>Your Price Monitoring Team</td>
    </tr>
  </table>`;

const Templates = {
  priceIncreaseContent,
  targetPriceContent,
  priceAlertEmailTemplate,
};

export default Templates;
