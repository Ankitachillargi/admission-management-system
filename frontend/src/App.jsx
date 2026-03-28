import { useState } from "react";
import axios from "axios";

function App() {
  const [applicant, setApplicant] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    entry_type: "",
    quota_type: "",
    marks: "",
    document_status: "Pending",
  });

  const [allocation, setAllocation] = useState({
    applicant_id: "",
    program_id: "",
    quota: "",
  });

  const [dashboard, setDashboard] = useState(null);
  const [program, setProgram] = useState({ name: "", intake: "" });
  const [quota, setQuota] = useState({
  program_id: "",
  name: "",
  seats: "",
});

  const createProgram = async () => {
  const res = await axios.post("http://localhost:5000/program", program);
  alert("Program created ID: " + res.data.programId);
};

const createQuota = async () => {
  const res = await axios.post("http://localhost:5000/quota", quota);
  alert("Quota added");
};

  const handleApplicantChange = (e) => {
    setApplicant({ ...applicant, [e.target.name]: e.target.value });
  };

  const createApplicant = async () => {
    await axios.post("http://localhost:5000/applicant", applicant);
    alert("Applicant Created");
  };

  const handleAllocationChange = (e) => {
    setAllocation({ ...allocation, [e.target.name]: e.target.value });
  };

  const allocateSeat = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/allocate-seat",
        allocation
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const loadDashboard = async () => {
    const res = await axios.get("http://localhost:5000/dashboard");
    setDashboard(res.data);
  };

  const confirmAdmission = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/confirm-admission",
      {
        admission_id: allocation.admission_id,
        fee_status: allocation.fee_status,
      }
    );
    alert(res.data.message + " - " + res.data.admissionNumber);
  } catch (err) {
    alert(err.response.data.message);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admission Management</h1>


      <h2>Create Program</h2>
<input
  placeholder="Program Name"
  onChange={(e) =>
    setProgram({ ...program, name: e.target.value })
  }
/>
<input
  placeholder="Intake"
  onChange={(e) =>
    setProgram({ ...program, intake: e.target.value })
  }
/>
<button onClick={createProgram}>Create Program</button>


<h2>Add Quota</h2>
<input
  placeholder="Program ID"
  onChange={(e) =>
    setQuota({ ...quota, program_id: e.target.value })
  }
/>
<input
  placeholder="Quota Name"
  onChange={(e) =>
    setQuota({ ...quota, name: e.target.value })
  }
/>
<input
  placeholder="Seats"
  onChange={(e) =>
    setQuota({ ...quota, seats: e.target.value })
  }
/>
<button onClick={createQuota}>Add Quota</button>



      <h2>Create Applicant</h2>
      <input name="name" placeholder="Name" onChange={handleApplicantChange} />
      <input name="email" placeholder="Email" onChange={handleApplicantChange} />
      <input name="phone" placeholder="Phone" onChange={handleApplicantChange} />
      <input name="category" placeholder="Category" onChange={handleApplicantChange} />
      <input name="entry_type" placeholder="Entry Type" onChange={handleApplicantChange} />
      <input name="quota_type" placeholder="Quota Type" onChange={handleApplicantChange} />
      <input name="marks" placeholder="Marks" onChange={handleApplicantChange} />
      <button onClick={createApplicant}>Create</button>

      <hr />

      <h2>Allocate Seat</h2>
      <input name="applicant_id" placeholder="Applicant ID" onChange={handleAllocationChange} />
      <input name="program_id" placeholder="Program ID" onChange={handleAllocationChange} />
      <input name="quota" placeholder="Quota" onChange={handleAllocationChange} />
      <button onClick={allocateSeat}>Allocate</button>

      <hr />

      <h2>Dashboard</h2>
      <button onClick={loadDashboard}>Load Dashboard</button>

      {dashboard && (
        <div>
          <p>Total Intake: {dashboard.totalIntake}</p>
          <p>Total Admitted: {dashboard.totalAdmitted}</p>
          <p>Remaining Seats: {dashboard.remainingSeats}</p>

          <h3>Quota Stats</h3>
          {dashboard.quotaStats.map((q, i) => (
            <p key={i}>
              {q.quota}: {q.count}
            </p>
          ))}
        </div>
      )}

      <hr />

<h2>Confirm Admission</h2>
<input
  placeholder="Admission ID"
  onChange={(e) =>
    setAllocation({ ...allocation, admission_id: e.target.value })
  }
/>
<select
  onChange={(e) =>
    setAllocation({ ...allocation, fee_status: e.target.value })
  }
>
  <option value="Pending">Pending</option>
  <option value="Paid">Paid</option>
</select>

<button onClick={confirmAdmission}>Confirm</button>
    </div>
  );
}

export default App;