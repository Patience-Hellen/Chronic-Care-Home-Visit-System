const BASE_URL = 'http://localhost:8000/api';

export const clinicalService = {
    // Submit to Django
    async submitReading(data) {
        const response = await fetch(`${BASE_URL}/readings/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    // Mock Smartwatch Sync
    async syncDeviceData() {
        console.log("Connecting to Bluetooth Device...");
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    type: 'hypertension',
                    systolic: Math.floor(Math.random() * (140 - 110) + 110),
                    diastolic: 80,
                    source: 'Apple Watch'
                });
            }, 2000);
        });
    }
};