import ContactInfo from "../components/dashboard/ContactInfo";
import Navbar from "../components/dashboard/Navbar";
import ProfileCard from "../components/dashboard/ProfileCard";
import TrendsChart from "../components/dashboard/TrendsChart";
import VitalsCard from "../components/dashboard/VitalsCard";

function PatientProfilePage() {
    return (
        <div className="dashboard">

            <Navbar />

            <ProfileCard />

            <div className="main-grid">

                <div className="left">
                    <ContactInfo />
                    <VitalsCard />
                </div>

                <div className="right">
                    <TrendsChart />
                    {/* glucose chart later */}
                </div>

            </div>

        </div>
    );
}

export default PatientProfilePage;