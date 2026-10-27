export default function ProfileImageSection() {
  return (
    <div className="first-profile">
      <div className="profile-section">
        <a href="#">Back</a>
        <div className="progress">
          <div className="line" id="active-line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <div className="profile-descript">
          <h2>Profile Image</h2>
          <p>
            Uploaded image should be a corporate image because it is sent as
            part of yout internship application
          </p>
        </div>
        <form className="profile-icon">
          
            <input id="user-icon" type="image" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXIgcHJldmlldy1pY29uIj48cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIvPjwvc3ZnPg==" alt="" />
           
          <button>Proceed</button>
        </form>
      </div>
    </div>
  );
}
