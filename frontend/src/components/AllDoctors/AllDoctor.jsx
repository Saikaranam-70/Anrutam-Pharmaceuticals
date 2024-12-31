import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AllDoctor.css';

import banner from '../../assets/banner.png'
import { URL } from '../URL/url';

const AllDoctor = () => {
  const [doctors, setDoctors] = useState([]);

  // Fetch doctors data from the backend API
  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await fetch(`${URL}/doctors/`);
      const data = await response.json();
      setDoctors(data);
    };

    fetchDoctors();
  }, []);

  return (
    <div className="doctor-list-container">
      <div className="img">
      <img src={banner} alt="Image Not Found" />
      </div>
      <h1>Our Doctors</h1>
      <div className="doctor-list">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div className="doctor-card" key={doctor._id}>
              <img
                src={`${URL}/doctors/uploads/${doctor.image || 'default.jpg'}`}
                alt={doctor.name}
                className="doctor-image"
              />
              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Hospital:</strong> {doctor.hospitalName}</p>

                {/* View details link */}
                <Link to={`/doctor/${doctor._id}`} className="toggle-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>Loading doctors...</p>
        )}
      </div>
    </div>
  );
};

export default AllDoctor;
