import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">

      {/* Bootstrap Responsive Grid */}
      <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-4">

        {/* Bootstrap Card */}
        <div className="card shadow-lg border-0 rounded-4 p-4">

          {/* Header */}
          <div className="text-center mb-4">
            <h6 className="text-danger">Đây là trang Register</h6>
            <h3 className="text-success fw-bold">PHUC TRUONG PC SHOP</h3>
            <p className="text-muted small">Your Social Campaigns</p>
          </div>

          {/* Form */}
          <form>

            {/* Username */}
            <div className="mb-3">
              <label className="form-label">User Name</label>
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="Enter your username"
              />
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label">Địa chỉ</label>
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="Enter your address"
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                type="tel"
                className="form-control rounded-3"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control rounded-3"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control rounded-3"
                placeholder="Enter your password"
              />
            </div>

            {/* Button */}
            <button className="btn btn-success w-100 rounded-pill py-2">
              Sign Up
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-4 small">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
