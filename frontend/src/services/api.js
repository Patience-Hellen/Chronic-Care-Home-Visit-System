const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const clinicalService = {
    async submitReading(data) {
        const response = await fetch(`${BASE_URL}/readings/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async syncDeviceData() {
        console.log("Starting Web Bluetooth Handshake...");
        console.log("Searching for BLE Service: 00001810-0000-1000-8000-00805f9b34fb (Blood Pressure)");
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const rawPacket = { hex: "0xC3", decimal: 195 }; 
                
                console.log(`GATT Packet Received from Device: ${rawPacket.hex}`);
                console.log(`Decoding Logic Applied: Hex ${rawPacket.hex} -> Integer ${rawPacket.decimal}`);
                
                resolve({
                    type: 'hypertension',
                    systolic: rawPacket.decimal,
                    diastolic: 110,
                    symptoms: ['Dizziness'],
                    source: 'Simulated BLE Device (GATT)'
                });
            }, 1500);
        });
    }
};