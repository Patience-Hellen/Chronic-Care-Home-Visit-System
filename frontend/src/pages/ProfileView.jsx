
export default function ProfileView() {
    const profile = {
        name: "Waweru Kimani",
        uid: "p-1024-ken",
        illness: "Hypertension & Diabetes",
        location: "Nairobi East, Embakasi",
        kin: { name: "Jane Kimani", phone: "+254 712 345 678" }
    };

    return (
        <div className="main-content">
            <header className="page-header">
                <h3 style={{fontWeight: 800}}>MY CLINICAL PROFILE</h3>
            </header>

            <div style={{ padding: '32px' }}>
                <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                        <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '24px' }}>P</div>
                        <div>
                            <h2 style={{ margin: 0 }}>{profile.name}</h2>
                            <small style={{ color: '#94a3b8' }}>ID: {profile.uid}</small>
                        </div>
                    </div>

                    <div className="hub-item">
                        <span className="hub-label">PRIMARY DIAGNOSIS</span>
                        <div className="hub-val">{profile.illness}</div>
                    </div>

                    <div className="hub-item" style={{ marginTop: '15px' }}>
                        <span className="hub-label">LOCATION</span>
                        <div className="hub-val">{profile.location}</div>
                    </div>

                    <div className="hub-item" style={{ marginTop: '30px', background: '#fef2f2', border: '1px solid #fee2e2' }}>
                        <span className="hub-label" style={{ color: '#ef4444' }}>NEXT OF KIN / EMERGENCY</span>
                        <div className="hub-val" style={{ fontSize: '14px', marginTop: '5px' }}>
                            {profile.kin.name} • {profile.kin.phone}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}