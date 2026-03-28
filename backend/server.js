const express = require("express");
const cors = require("cors");

require('./db/database')
const db = require("./db/database");

const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Admission Management API Running");
});


app.post("/program", (req, res) => {
  const { name, intake } = req.body;

  const query = `INSERT INTO programs (name, intake) VALUES (?, ?)`;

  db.run(query, [name, intake], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Program created",
      programId: this.lastID,
    });
  });
});



app.post("/quota", (req, res) => {
  const { program_id, name, seats } = req.body;

  const query = `INSERT INTO quotas (program_id, name, seats) VALUES (?, ?, ?)`;

  db.run(query, [program_id, name, seats], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Quota added",
      quotaId: this.lastID,
    });
  });
});

// ✅ CREATE APPLICANT
app.post("/applicant", (req, res) => {
  const {
    name,
    email,
    phone,
    category,
    entry_type,
    quota_type,
    marks,
    document_status
  } = req.body;

  const query = `
    INSERT INTO applicants 
    (name, email, phone, category, entry_type, quota_type, marks, document_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [name, email, phone, category, entry_type, quota_type, marks, document_status],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Applicant created",
        applicantId: this.lastID,
      });
    }
  );
});

app.get("/quotas", (req, res) => {
  db.all("SELECT * FROM quotas", [], (err, rows) => {
    res.json(rows);
  });
});

// ✅ SEAT ALLOCATION
app.post("/allocate-seat", (req, res) => {
  const { applicant_id, program_id, quota } = req.body;

  // Step 1: Get quota limit
  const quotaQuery = `
    SELECT seats FROM quotas 
    WHERE program_id = ? AND name = ?
  `;

  db.get(quotaQuery, [program_id, quota], (err, quotaRow) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!quotaRow) {
      return res.status(400).json({ message: "Quota not found" });
    }

    const quotaLimit = quotaRow.seats;

    // Step 2: Count current admissions
    const countQuery = `
      SELECT COUNT(*) as count FROM admissions 
      WHERE program_id = ? AND quota = ?
    `;

    db.get(countQuery, [program_id, quota], (err, countRow) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const currentCount = countRow.count;

      // Step 3: Check limit
      if (currentCount >= quotaLimit) {
        return res.status(400).json({
          message: "Quota full. Cannot allocate seat.",
        });
      }

      // Step 4: Allocate seat
      const insertQuery = `
        INSERT INTO admissions 
        (applicant_id, program_id, quota, fee_status, status)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.run(
        insertQuery,
        [applicant_id, program_id, quota, "Pending", "Allocated"],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.json({
            message: "Seat allocated successfully",
            admissionId: this.lastID,
          });
        }
      );
    });
  });
});

// ✅ CONFIRM ADMISSION
app.post("/confirm-admission", (req, res) => {
  const { admission_id, fee_status } = req.body;

  // Step 1: Check fee
  if (fee_status !== "Paid") {
    return res.status(400).json({
      message: "Admission cannot be confirmed until fee is paid",
    });
  }

  // Step 2: Get admission details
  const getQuery = `
    SELECT * FROM admissions WHERE id = ?
  `;

  db.get(getQuery, [admission_id], (err, admission) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!admission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    const { program_id, quota } = admission;

    // Step 3: Count existing confirmed admissions (for numbering)
    const countQuery = `
      SELECT COUNT(*) as count FROM admissions
      WHERE program_id = ? AND quota = ? AND admission_number IS NOT NULL
    `;

    db.get(countQuery, [program_id, quota], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const nextNumber = row.count + 1;

      // Format number (0001, 0002...)
      const padded = String(nextNumber).padStart(4, "0");

      const admissionNumber = `INST/2026/PRG${program_id}/${quota}/${padded}`;

      // Step 4: Update admission
      const updateQuery = `
        UPDATE admissions
        SET fee_status = ?, status = ?, admission_number = ?
        WHERE id = ?
      `;

      db.run(
        updateQuery,
        [fee_status, "Confirmed", admissionNumber, admission_id],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.json({
            message: "Admission confirmed",
            admissionNumber,
          });
        }
      );
    });
  });
});

// ✅ DASHBOARD
app.get("/dashboard", (req, res) => {
  const dashboard = {};

  // Total intake
  db.get(`SELECT SUM(intake) as total FROM programs`, [], (err, intakeRow) => {
    if (err) return res.status(500).json({ error: err.message });

    dashboard.totalIntake = intakeRow.total || 0;

    // Total admitted
    db.get(`SELECT COUNT(*) as count FROM admissions`, [], (err, admRow) => {
      if (err) return res.status(500).json({ error: err.message });

      dashboard.totalAdmitted = admRow.count;

      dashboard.remainingSeats =
        dashboard.totalIntake - dashboard.totalAdmitted;

      // Quota-wise
      db.all(
        `SELECT quota, COUNT(*) as count FROM admissions GROUP BY quota`,
        [],
        (err, quotaRows) => {
          if (err) return res.status(500).json({ error: err.message });

          dashboard.quotaStats = quotaRows;

          res.json(dashboard);
        }
      );
    });
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});