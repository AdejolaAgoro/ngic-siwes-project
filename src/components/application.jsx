export default function Application() {
  return (
    <div className="second-section">
       <div className="profile-section">
        <a href="#">Back</a>
        <div className="progress">
          <div className="line" id="active-line"></div>
          <div className="line" id="active-line"></div>
          <div className="line" id="active-line"></div>
          <div className="line" id="active-line"></div>
        </div>

        <div className="second-info">
          <h3>NGIC Internship Application</h3>
        </div>
        {/* Form for Application  */}
        <form className="profile-section-form">
          {/* internship Period */}
         <label htmlFor="period">Internship Period</label>
         <select name="period" id="period">
          <option value="">1 month</option>
          <option value="">2 months</option>
          <option value="">3 months</option>
          <option value="">6 months</option>
          <option value="">12 months</option>
          <option value="">18 months</option>
          <option value="">24 months</option>
         </select>

         {/* Upload Cv */}
         <label htmlFor="cv-upload">Upload CV</label>
         <input type="file" name="cv-upload" id="cv-upload" />

         {/* Upload Student ID */}
         <label htmlFor="id-upload">Upload Student ID</label>
         <input type="file" name="id-upload" id="id-upload" />

         {/* Upload school internship letter */}
         <label htmlFor="upload-letter">Institution Internship Letter</label>
         <input type="file" name="upload-letter" id="upload-letter" />
         
          <button>Submit Application</button>
        </form>
      </div>
    </div>
  );
}
