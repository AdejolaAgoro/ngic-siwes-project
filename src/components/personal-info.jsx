export default function PersonalInfo() {
  return (
    <div className="second-section">
      <div className="profile-section">
        <a href="#">Back</a>
        <div className="progress">
          <div className="line" id="active-line"></div>
          <div className="line" id="active-line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>

        <div className="second-info">
          <h3>Personal Information</h3>
        </div>
        {/* Form for personal info */}
        <form className="profile-section-form">
          {/* fullname */}
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            name="fullname"
            id="fullname"
            placeholder="Type Fullname Here"
          />
          {/* phone number */}
          <label htmlFor="phone">Phone No</label>
          <input type="tel" name="phone" id="phone" placeholder="0902345678" />
          {/* date of Birth */}
          <label htmlFor="dob">Date of Birth</label>
          <input type="date" name="dob" id="dob" />
          {/* gender */}
          <label htmlFor="gender">Gender</label>
          <select name="gender" id="gender">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>{" "}
          <br />
          <label htmlFor="address">Residential Address</label>
          <input type="text" name="address" id="address" />
          <button>Proceed</button>
        </form>
      </div>
    </div>
  );
}
