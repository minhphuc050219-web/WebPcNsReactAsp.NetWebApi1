import { Link } from 'react-router-dom';

export default function Login() {
  return (
  <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">

      {/* Bootstrap Responsive Grid */}
      <div className="col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3">

        {/* Bootstrap Card */}
        <div className="card shadow-lg border-0 rounded-4 p-4">

          {/* Header */}
          <div className="text-center mb-4">
            <h6 className="text-danger">Đây là trang Login</h6>
            <h3 className="text-primary fw-bold">PHUC TRUONG PC SHOP</h3>
            <p className="text-muted small">Your Social Campaigns</p>
          </div>

          {/* Form */}
          <form>

            {/* Username */}
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="Enter your username"
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control rounded-3"
                placeholder="Enter your password"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="d-flex justify-content-between align-items-center mb-3">

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked
                />
                <label className="form-check-label">
                  Remember this Device
                </label>
              </div>

              <Link
                to="#"
                className="text-decoration-none small"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Button */}
            <button className="btn btn-primary w-100 rounded-pill py-2">
              Sign In
            </button>

          </form>

          {/* Footer */}
          <p className="text-center mt-4 small">
            New to PHUC TRUONG PC SHOP?{" "}
            <Link to="/register" className="text-decoration-none">
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}