export default function InstitutionDetails() {
  return (
    <div className="second-section">
      <div className="profile-section">
        <a href="#">Back</a>
        <div className="progress">
          <div className="line" id="active-line"></div>
          <div className="line" id="active-line"></div>
          <div className="line" id="active-line"></div>
          <div className="line"></div>
        </div>

        <div className="second-info">
          <h3>Institution Details</h3>
        </div>
        {/* Form for Institution info */}
        <form className="profile-section-form">
          {/* Institution */}
          <label htmlFor="institution">Institution</label>
          <input
            type="text"
            name="institution"
            id="institution"
            placeholder="e.g Lagos State University"
          />
          {/* course */}
          <label htmlFor="course">Course</label>
          <input type="text" name="course" id="course" placeholder="e.g Computer Science" />
         
          {/* level */}
          <label htmlFor="level">Level</label>
          <select name="level" id="level">
            <option value="">100 Level</option>
            <option value="">200 Level</option>
            <option value="">300 Level</option>
            <option value="">400 Level</option>
            <option value="">500 Level</option>
            <option value="">600 Level</option>
            <option value="">Other</option>
          </select>{" "}
          <br />
          <label htmlFor="matric">Matric No</label>
          <input type="text" name="matric" id="matric" />
          <br />
          <label htmlFor="cgpa">CGPA</label>
          <input type="number" name="cgpa" id="cgpa" placeholder="e.g 4.97" />
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}
