---

**Blockchain Price Tracker** is a NestJS-based application that monitors the prices of Ethereum and Polygon tokens. The app automatically sends email alerts when there are significant price changes and provides APIs for retrieving real-time price data and setting up custom alerts.

## Features

1. **Automated Price Monitoring**

   - Continuously records the prices of Ethereum and Polygon every 5 minutes.

2. **Email Alerts**

   - Notifies `hyperhire_assignment@hyperhire.in` if the price of a cryptocurrency increases by more than 3% compared to its value one hour prior.

3. **Price Data API**

   - Offers an API to fetch hourly prices for the past 24 hours.
   - **Parameters:**
     - `chain`: Accepts `"ethereum"` or `"polygon"`
   - **Description:**
     - Allows users to retrieve the latest prices for specific hours, providing insight into price variations over the last 24 hours.

4. **Personalized Price Alerts**

   - Users can create alerts for specific price points through an API.
   - **Example Request:**
     ```json
     {
       "email": "your_email@example.com",
       "chain": "ethereum",
       "targetPrice": "1000"
     }
     ```

## Technical Stack

- **Framework:** NestJS
- **Database:** PostgreSQL with TypeORM
- **API:** Utilizes Moralis to fetch token prices
- **Containerization:** Implemented using Docker and Docker Compose
- **Logger:** Utilizes Winston and Morgan for logging

---
