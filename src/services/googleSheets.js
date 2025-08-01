// Backend service for Google Sheets integration

const axios = require("axios");

class GoogleSheetsService {
  constructor(appsScriptUrl) {
    this.appsScriptUrl = appsScriptUrl; // Your deployed Apps Script URL
  }

  async writeBookingToSheets(bookingData) {
    try {
      const response = await axios.post(this.appsScriptUrl, bookingData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      });

      return response.data;
    } catch (error) {
      throw new Error(`Google Sheets write failed: ${error.message}`);
    }
  }
}

// Alternative service with retry mechanism
class RobustGoogleSheetsService {
  constructor(appsScriptUrl, maxRetries = 3) {
    this.appsScriptUrl = appsScriptUrl;
    this.maxRetries = maxRetries;
  }

  async writeBookingWithRetry(bookingData) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await axios.post(this.appsScriptUrl, bookingData, {
          headers: { "Content-Type": "application/json" },
          timeout: 8000,
        });

        if (response.data.success) {
          return response.data;
        }

        throw new Error(
          response.data.error || "Unknown error from Google Sheets"
        );
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed:`, error.message);

        if (attempt < this.maxRetries) {
          await this.delay(1000 * attempt); // Progressive delay
        }
      }
    }

    throw new Error(
      `All ${this.maxRetries} attempts failed. Last error: ${lastError.message}`
    );
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export for use in your main application
module.exports = {
  GoogleSheetsService,
  RobustGoogleSheetsService,
};
