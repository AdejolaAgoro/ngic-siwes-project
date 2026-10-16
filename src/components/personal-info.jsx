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
        
        {/* Form for personal info */}
        <form>
          <h3>Personal Information</h3>
          {/* fullname */}
          <label htmlFor="fullname">Full Name</label>
          <input type="text" name="fullname" id="fullname" placeholder="type Fullname Here" />
          {/* phone number */}
          <label htmlFor="phone">Phone No</label>
          <input type="tel" name="phone" id="phone" placeholder="0902345678"/>
          {/* date of Birth */}
          <label htmlFor="dob">Date of Birth</label>
          <input type="date" name="dob" id="dob" />
          {/* gender */}
          <label htmlFor="gender">Gender</label>
          <select name="gender" id="gender">
            <option value="male"></option>
            <option value="male"></option>
            <option value="male"></option>
          </select>
        </form>
      </div>
    </div>
  );
}
