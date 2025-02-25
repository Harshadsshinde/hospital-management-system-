import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  // Appointment details state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

  // Doctor details (using first and last names)
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");

  // List of departments
  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  // List of doctors fetched from the backend
  const [doctors, setDoctors] = useState([]);

  // List of appointments fetched from the backend
  const [appointments, setAppointments] = useState([]);

  // Fetch the list of doctors when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
        console.log("Doctors:", data.doctors);
      } catch (error) {
        console.error("Error fetching doctors", error);
      }
    };
    fetchDoctors();
  }, []);

  // Function to fetch appointments
  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/appointment/getall",
        { withCredentials: true }
      );
      setAppointments(data.appointments);
    } catch (error) {
      console.error("Error fetching appointments", error);
      toast.error("Error fetching appointments");
    }
  };

  // Fetch appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle form submission
  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      // Convert hasVisited to a Boolean (if not already)
      const hasVisitedBool = Boolean(hasVisited);

      const { data } = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        {
          firstName,
          lastName,
          email,
          phone,
          nic,
          dob,
          gender,
          appointment_date: appointmentDate,
          department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          hasVisited: hasVisitedBool,
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);

      // Clear form fields after successful submission
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setAppointmentDate("");
      setDepartment("Pediatrics");
      setDoctorFirstName("");
      setDoctorLastName("");
      setHasVisited(false);
      setAddress("");

      // Refresh the list of appointments after adding a new one
      fetchAppointments();
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="container form-component appointment-form">
        <h2>Appointment</h2>
        <form onSubmit={handleAppointment}>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="NIC"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="date"
              placeholder="Appointment Date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>
          <div>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                // Clear the selected doctor when department changes
                setDoctorFirstName("");
                setDoctorLastName("");
              }}
            >
              {departmentsArray.map((depart, index) => (
                <option value={depart} key={index}>
                  {depart}
                </option>
              ))}
            </select>
            <select
              // Using .trim() to ensure that an empty selection returns an empty string
              value={`${doctorFirstName} ${doctorLastName}`.trim()}
              onChange={(e) => {
                // Split the selected value into first and last names
                const [first, last] = e.target.value.split(" ");
                setDoctorFirstName(first || "");
                setDoctorLastName(last || "");
              }}
              disabled={!department}
            >
              <option value="">Select Doctor</option>
              {doctors
                .filter((doctor) => doctor.doctorDepartment === department)
                .map((doctor) => (
                  <option
                    value={`${doctor.firstName} ${doctor.lastName}`}
                    key={doctor._id}
                  >
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
            </select>
          </div>
          <textarea
            rows="10"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <p style={{ marginBottom: 0 }}>Have you visited before?</p>
            <input
              type="checkbox"
              checked={hasVisited}
              onChange={(e) => setHasVisited(e.target.checked)}
              style={{ flex: "none", width: "25px" }}
            />
          </div>
          <button style={{ margin: "0 auto" }}>GET APPOINTMENT</button>
        </form>
      </div>

      {/* Appointments List */}
      <div className="container appointment-list">
        <h2>Appointments</h2>
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-item">
              <p>
                <strong>Name:</strong> {appointment.firstName} {appointment.lastName}
              </p>
              <p>
                <strong>Email:</strong> {appointment.email}
              </p>
              <p>
                <strong>Phone:</strong> {appointment.phone}
              </p>
              <p>
                <strong>Department:</strong> {appointment.department}
              </p>
              <p>
                <strong>Doctor:</strong> {appointment.doctor.firstName} {appointment.doctor.lastName}
              </p>
              <p>
                <strong>Date:</strong> {appointment.appointment_date}
              </p>
            </div>
          ))
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </>
  );
};

export default AppointmentForm;
